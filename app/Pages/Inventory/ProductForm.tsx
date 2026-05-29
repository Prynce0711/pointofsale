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
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Product name
          <input
            name="name"
            required
            defaultValue={product?.name}
            className="rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          SKU
          <input
            name="sku"
            required
            defaultValue={product?.sku}
            className="rounded-md border border-slate-300 px-3 py-2 uppercase text-slate-950 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Category
          <select
            name="category"
            required
            defaultValue={product?.category ?? "COFFEE"}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            {PRODUCT_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {productCategoryLabels[category]}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Size
          <select
            name="size"
            defaultValue={product?.size ?? "NOT_APPLICABLE"}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            {PRODUCT_SIZES.map((size) => (
              <option key={size} value={size}>
                {productSizeLabels[size]}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Barcode
          <input
            name="barcode"
            defaultValue={product?.barcode ?? ""}
            className="rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Price
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={product?.price ?? "0"}
            className="rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Stock
          <input
            name="stock"
            type="number"
            min="0"
            required
            defaultValue={product?.stock ?? 0}
            className="rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Low stock threshold
          <input
            name="lowStockThreshold"
            type="number"
            min="0"
            required
            defaultValue={product?.lowStockThreshold ?? 5}
            className="rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </label>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:flex-row">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            name="isMenuItem"
            defaultChecked={product?.isMenuItem ?? true}
            className="size-4 rounded border-slate-300"
          />
          Sell on POS menu
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            name="isIngredient"
            defaultChecked={product?.isIngredient ?? false}
            className="size-4 rounded border-slate-300"
          />
          Track as ingredient or supply
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton>{product ? "Update product" : "Create product"}</SubmitButton>
        <Link
          href="/inventory"
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Back to inventory
        </Link>
      </div>
    </form>
  );
}

