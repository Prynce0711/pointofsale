"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  createProductAction,
  updateProductAction,
} from "@/app/actions/products";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_SIZES,
  productCategoryLabels,
  productSizeLabels,
} from "@/app/lib/labels";
import { emptyActionState } from "@/app/lib/validation";
import Failed from "@/app/Shared/PopUps/Failed";
import SubmitButton from "@/app/Shared/Form/SubmitButton";
import Success from "@/app/Shared/PopUps/Success";

export type ProductFormValues = {
  id: number;
  name: string;
  category: string;
  size: string;
  sku: string;
  barcode: string | null;
  price: string;
  stock: number;
  lowStockThreshold: number;
  isMenuItem: boolean;
  isIngredient: boolean;
};

type ProductFormProps = {
  product?: ProductFormValues;
};

export default function ProductForm({ product }: ProductFormProps) {
  const action = product
    ? updateProductAction.bind(null, product.id)
    : createProductAction;
  const [state, formAction] = useActionState(action, emptyActionState);

  return (
    <form action={formAction} className="grid gap-5">
      {state.ok ? <Success message={state.message} /> : <Failed message={state.message} />}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium text-[#4b2f22]">
          Product name
          <input
            name="name"
            required
            defaultValue={product?.name}
            className="coffee-focus rounded-2xl border border-[#d8bf9f] bg-white/80 px-3 py-2 text-[#2c1810]"
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-[#4b2f22]">
          SKU
          <input
            name="sku"
            required
            defaultValue={product?.sku}
            className="coffee-focus rounded-2xl border border-[#d8bf9f] bg-white/80 px-3 py-2 uppercase text-[#2c1810]"
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-[#4b2f22]">
          Category
          <select
            name="category"
            required
            defaultValue={product?.category ?? "COFFEE"}
            className="coffee-focus rounded-2xl border border-[#d8bf9f] bg-white px-3 py-2 text-[#2c1810]"
          >
            {PRODUCT_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {productCategoryLabels[category]}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1 text-sm font-medium text-[#4b2f22]">
          Size
          <select
            name="size"
            defaultValue={product?.size ?? "NOT_APPLICABLE"}
            className="coffee-focus rounded-2xl border border-[#d8bf9f] bg-white px-3 py-2 text-[#2c1810]"
          >
            {PRODUCT_SIZES.map((size) => (
              <option key={size} value={size}>
                {productSizeLabels[size]}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1 text-sm font-medium text-[#4b2f22]">
          Barcode
          <input
            name="barcode"
            defaultValue={product?.barcode ?? ""}
            className="coffee-focus rounded-2xl border border-[#d8bf9f] bg-white/80 px-3 py-2 text-[#2c1810]"
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-[#4b2f22]">
          Price
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={product?.price ?? "0"}
            className="coffee-focus rounded-2xl border border-[#d8bf9f] bg-white/80 px-3 py-2 text-[#2c1810]"
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-[#4b2f22]">
          Stock
          <input
            name="stock"
            type="number"
            min="0"
            required
            defaultValue={product?.stock ?? 0}
            className="coffee-focus rounded-2xl border border-[#d8bf9f] bg-white/80 px-3 py-2 text-[#2c1810]"
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-[#4b2f22]">
          Low stock threshold
          <input
            name="lowStockThreshold"
            type="number"
            min="0"
            required
            defaultValue={product?.lowStockThreshold ?? 5}
            className="coffee-focus rounded-2xl border border-[#d8bf9f] bg-white/80 px-3 py-2 text-[#2c1810]"
          />
        </label>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-[#ead8c5] bg-[#fff8ef] p-4 sm:flex-row">
        <label className="flex items-center gap-2 text-sm font-medium text-[#4b2f22]">
          <input
            type="checkbox"
            name="isMenuItem"
            defaultChecked={product?.isMenuItem ?? true}
            className="size-4 rounded border-[#d8bf9f]"
          />
          Sell on POS menu
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-[#4b2f22]">
          <input
            type="checkbox"
            name="isIngredient"
            defaultChecked={product?.isIngredient ?? false}
            className="size-4 rounded border-[#d8bf9f]"
          />
          Track as ingredient or supply
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton>{product ? "Update product" : "Create product"}</SubmitButton>
        <Link
          href="/inventory"
          className="rounded-xl border border-[#d8bf9f] bg-white/70 px-4 py-2 text-sm font-semibold text-[#4b2f22] hover:bg-[#fff8ef]"
        >
          Back to inventory
        </Link>
      </div>
    </form>
  );
}
