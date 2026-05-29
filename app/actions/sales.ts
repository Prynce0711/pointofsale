"use server";

import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import { requireAuth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import {
  ORDER_TYPES,
  TEMPERATURE_OPTIONS,
  type OrderTypeValue,
  type TemperatureValue,
} from "@/app/lib/labels";
import { getErrorMessage } from "@/app/lib/ui";

export type CheckoutLineInput = {
  productId: number;
  quantity: number;
  temperature: TemperatureValue;
  addOnIds: number[];
};

export type CheckoutInput = {
  orderType: OrderTypeValue;
  amountPaidCents: number;
  items: CheckoutLineInput[];
};

export type CheckoutResult = {
  ok: boolean;
  message: string;
  receiptNo?: string;
  totalCents?: number;
  changeCents?: number;
};

export async function completeSaleAction(input: CheckoutInput): Promise<CheckoutResult> {
  const user = await requireAuth();

  try {
    validateCheckoutInput(input);

    const allIds = [
      ...new Set([
        ...input.items.map((item) => item.productId),
        ...input.items.flatMap((item) => item.addOnIds),
      ]),
    ];
    const products = await loadProductsById(allIds);
    const productMap = new Map(products.map((product) => [product.id, product]));

    const preparedLines = input.items.map((line) => {
      const product = productMap.get(line.productId);

      if (!product || !product.isMenuItem || !product.isActive) {
        throw new Error("One cart item is no longer available.");
      }

      const addOns = line.addOnIds.map((id) => {
        const addOn = productMap.get(id);

        if (!addOn || addOn.category !== "ADD_ON" || !addOn.isActive) {
          throw new Error("One add-on is no longer available.");
        }

        return addOn;
      });

      const addOnsTotalCents = addOns.reduce(
        (total, addOn) => total + addOn.priceCents,
        0,
      );

      return {
        input: line,
        product,
        addOns,
        addOnsTotalCents,
        lineTotalCents: (product.priceCents + addOnsTotalCents) * line.quantity,
      };
    });

    const subtotalCents = preparedLines.reduce(
      (total, line) => total + line.lineTotalCents,
      0,
    );
    const totalCents = subtotalCents;

    if (input.amountPaidCents < totalCents) {
      throw new Error("Amount paid is less than the total.");
    }

    const requiredStock = new Map<number, number>();

    for (const line of preparedLines) {
      addRequiredStock(requiredStock, line.product.id, line.input.quantity);
      for (const addOn of line.addOns) {
        addRequiredStock(requiredStock, addOn.id, line.input.quantity);
      }
    }

    for (const [productId, required] of requiredStock) {
      const product = productMap.get(productId);
      if (!product || product.stock < required) {
        throw new Error(`${product?.name ?? "A product"} does not have enough stock.`);
      }
    }

    const receiptNo = createReceiptNo();
    const changeCents = input.amountPaidCents - totalCents;

    await prisma.$transaction(async (tx) => {
      const mutableStock = new Map(
        products.map((product) => [product.id, product.stock]),
      );

      const sale = await tx.sale.create({
        data: {
          receiptNo,
          orderType: input.orderType,
          subtotalCents,
          totalCents,
          amountPaidCents: input.amountPaidCents,
          changeCents,
          createdByUserId: user.id,
        },
      });

      for (const line of preparedLines) {
        const saleItem = await tx.saleItem.create({
          data: {
            saleId: sale.id,
            productId: line.product.id,
            productName: line.product.name,
            sku: line.product.sku,
            category: line.product.category,
            size: line.product.size,
            temperature: line.input.temperature,
            quantity: line.input.quantity,
            unitPriceCents: line.product.priceCents,
            addOnsTotalCents: line.addOnsTotalCents,
            lineTotalCents: line.lineTotalCents,
            addOnsJson: JSON.stringify(
              line.addOns.map((addOn) => ({
                id: addOn.id,
                name: addOn.name,
                sku: addOn.sku,
                priceCents: addOn.priceCents,
              })),
            ),
          },
        });

        await reduceStock(tx, mutableStock, {
          productId: line.product.id,
          quantity: line.input.quantity,
          saleItemId: saleItem.id,
          note: `Sale ${receiptNo}`,
        });

        for (const addOn of line.addOns) {
          await reduceStock(tx, mutableStock, {
            productId: addOn.id,
            quantity: line.input.quantity,
            saleItemId: saleItem.id,
            note: `Add-on for sale ${receiptNo}`,
          });
        }
      }
    });

    revalidatePath("/pos");
    revalidatePath("/inventory");
    revalidatePath("/sales");
    revalidatePath("/dashboard");

    return {
      ok: true,
      message: "Sale completed.",
      receiptNo,
      totalCents,
      changeCents,
    };
  } catch (error) {
    return { ok: false, message: getErrorMessage(error) };
  }
}

function validateCheckoutInput(input: CheckoutInput) {
  if (!ORDER_TYPES.includes(input.orderType)) {
    throw new Error("Order type is invalid.");
  }

  if (!Number.isInteger(input.amountPaidCents) || input.amountPaidCents < 0) {
    throw new Error("Amount paid is invalid.");
  }

  if (!Array.isArray(input.items) || input.items.length === 0) {
    throw new Error("Cart is empty.");
  }

  for (const item of input.items) {
    if (!Number.isInteger(item.productId) || item.productId < 1) {
      throw new Error("A cart product is invalid.");
    }

    if (!Number.isInteger(item.quantity) || item.quantity < 1) {
      throw new Error("Cart quantity must be at least 1.");
    }

    if (!TEMPERATURE_OPTIONS.includes(item.temperature)) {
      throw new Error("Temperature option is invalid.");
    }

    if (!Array.isArray(item.addOnIds)) {
      throw new Error("Add-ons are invalid.");
    }
  }
}

async function loadProductsById(ids: number[]) {
  return prisma.product.findMany({
    where: { id: { in: ids } },
    select: {
      id: true,
      name: true,
      category: true,
      size: true,
      sku: true,
      priceCents: true,
      stock: true,
      isMenuItem: true,
      isActive: true,
    },
  });
}

function addRequiredStock(requiredStock: Map<number, number>, id: number, quantity: number) {
  requiredStock.set(id, (requiredStock.get(id) ?? 0) + quantity);
}

async function reduceStock(
  tx: Prisma.TransactionClient,
  mutableStock: Map<number, number>,
  input: {
    productId: number;
    quantity: number;
    saleItemId: number;
    note: string;
  },
) {
  const previousStock = mutableStock.get(input.productId);

  if (previousStock === undefined) {
    throw new Error("Stock record is invalid.");
  }

  const newStock = previousStock - input.quantity;
  mutableStock.set(input.productId, newStock);

  await tx.product.update({
    where: { id: input.productId },
    data: { stock: newStock },
  });

  await tx.stockLog.create({
    data: {
      productId: input.productId,
      type: "SALE",
      quantity: input.quantity,
      previousStock,
      newStock,
      saleItemId: input.saleItemId,
      note: input.note,
    },
  });
}

function createReceiptNo() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const time = `${String(now.getHours()).padStart(2, "0")}${String(
    now.getMinutes(),
  ).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}`;
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();

  return `CS-${year}${month}${day}-${time}-${suffix}`;
}
