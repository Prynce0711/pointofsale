"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_SIZES,
  STOCK_LOG_TYPES,
} from "@/app/lib/labels";
import {
  actionError,
  centsFromForm,
  checkboxFromForm,
  emptyActionState,
  enumFromForm,
  idFromForm,
  integerFromForm,
  optionalString,
  requiredString,
  type ActionState,
} from "@/app/lib/validation";

type ParsedProduct = {
  name: string;
  category: (typeof PRODUCT_CATEGORIES)[number];
  size: (typeof PRODUCT_SIZES)[number];
  sku: string;
  barcode: string | null;
  priceCents: number;
  stock: number;
  lowStockThreshold: number;
  isMenuItem: boolean;
  isIngredient: boolean;
};

export async function createProductAction(
  _prevState: ActionState = emptyActionState,
  formData: FormData,
): Promise<ActionState> {
  void _prevState;
  const user = await requireAuth();

  try {
    const data = parseProductForm(formData);
    await assertUniqueProductCodes(data.sku, data.barcode);

    await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({ data });

      if (data.stock > 0) {
        await tx.stockLog.create({
          data: {
            productId: product.id,
            type: "STOCK_IN",
            quantity: data.stock,
            previousStock: 0,
            newStock: data.stock,
            note: "Initial stock",
            createdByUserId: user.id,
          },
        });
      }
    });

    revalidateCatalog();
    return { ok: true, message: "Product saved." };
  } catch (error) {
    return actionError(error);
  }
}

export async function updateProductAction(
  productId: number,
  _prevState: ActionState = emptyActionState,
  formData: FormData,
): Promise<ActionState> {
  void _prevState;
  const user = await requireAuth();

  try {
    if (!Number.isInteger(productId) || productId < 1) {
      throw new Error("Product is invalid.");
    }

    const data = parseProductForm(formData);
    await assertUniqueProductCodes(data.sku, data.barcode, productId);

    await prisma.$transaction(async (tx) => {
      const existing = await tx.product.findUnique({ where: { id: productId } });

      if (!existing) {
        throw new Error("Product was not found.");
      }

      await tx.product.update({
        where: { id: productId },
        data: {
          name: data.name,
          category: data.category,
          size: data.size,
          sku: data.sku,
          barcode: data.barcode,
          priceCents: data.priceCents,
          stock: data.stock,
          lowStockThreshold: data.lowStockThreshold,
          isMenuItem: data.isMenuItem,
          isIngredient: data.isIngredient,
          isActive: true,
        },
      });

      if (existing.stock !== data.stock) {
        await tx.stockLog.create({
          data: {
            productId,
            type: "ADJUSTMENT",
            quantity: Math.abs(data.stock - existing.stock),
            previousStock: existing.stock,
            newStock: data.stock,
            note: "Stock updated from product edit",
            createdByUserId: user.id,
          },
        });
      }
    });

    revalidateCatalog();
    return { ok: true, message: "Product updated." };
  } catch (error) {
    return actionError(error);
  }
}

export async function deleteProductAction(formData: FormData) {
  await requireAuth();
  const id = idFromForm(formData);

  await prisma.product.update({
    where: { id },
    data: { isActive: false },
  });

  revalidateCatalog();
}

export async function adjustStockAction(
  _prevState: ActionState = emptyActionState,
  formData: FormData,
): Promise<ActionState> {
  void _prevState;
  const user = await requireAuth();

  try {
    const productId = idFromForm(formData, "productId");
    const type = enumFromForm(formData, "type", STOCK_LOG_TYPES);
    const quantity = integerFromForm(formData, "quantity", { min: 1 });
    const note = optionalString(formData, "note");

    await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({ where: { id: productId } });

      if (!product || !product.isActive) {
        throw new Error("Product was not found.");
      }

      const newStock =
        type === "STOCK_IN"
          ? product.stock + quantity
          : type === "STOCK_OUT"
            ? product.stock - quantity
            : quantity;

      if (newStock < 0) {
        throw new Error("Stock cannot be negative.");
      }

      await tx.product.update({
        where: { id: productId },
        data: { stock: newStock },
      });

      await tx.stockLog.create({
        data: {
          productId,
          type,
          quantity: type === "ADJUSTMENT" ? Math.abs(newStock - product.stock) : quantity,
          previousStock: product.stock,
          newStock,
          note,
          createdByUserId: user.id,
        },
      });
    });

    revalidateCatalog();
    return { ok: true, message: "Stock updated." };
  } catch (error) {
    return actionError(error);
  }
}

function parseProductForm(formData: FormData): ParsedProduct {
  return {
    name: requiredString(formData, "name"),
    category: enumFromForm(formData, "category", PRODUCT_CATEGORIES),
    size: enumFromForm(formData, "size", PRODUCT_SIZES),
    sku: requiredString(formData, "sku").toUpperCase(),
    barcode: optionalString(formData, "barcode"),
    priceCents: centsFromForm(formData, "price"),
    stock: integerFromForm(formData, "stock", { min: 0 }),
    lowStockThreshold: integerFromForm(formData, "lowStockThreshold", {
      min: 0,
    }),
    isMenuItem: checkboxFromForm(formData, "isMenuItem"),
    isIngredient: checkboxFromForm(formData, "isIngredient"),
  };
}

async function assertUniqueProductCodes(
  sku: string,
  barcode: string | null,
  exceptId?: number,
) {
  const existing = await prisma.product.findFirst({
    where: {
      OR: [{ sku }, ...(barcode ? [{ barcode }] : [])],
      ...(exceptId ? { NOT: { id: exceptId } } : {}),
    },
    select: { sku: true, barcode: true },
  });

  if (!existing) return;

  if (existing.sku === sku) {
    throw new Error("SKU is already used by another product.");
  }

  throw new Error("Barcode is already used by another product.");
}

function revalidateCatalog() {
  revalidatePath("/inventory");
  revalidatePath("/pos");
  revalidatePath("/dashboard");
}
