"use client";

import { useActionState } from "react";
import { adjustStockAction } from "@/app/actions/products";
import { STOCK_LOG_TYPES, stockLogTypeLabels } from "@/app/lib/labels";
import { emptyActionState } from "@/app/lib/validation";
import Failed from "@/app/Shared/PopUps/Failed";
import SubmitButton from "@/app/Shared/Form/SubmitButton";
import Success from "@/app/Shared/PopUps/Success";

export default function StockAdjustmentForm({ productId }: { productId: number }) {
  const [state, formAction] = useActionState(adjustStockAction, emptyActionState);

  return (
    <form action={formAction} className="grid gap-2">
      <input type="hidden" name="productId" value={productId} />
      {state.ok ? <Success message={state.message} /> : <Failed message={state.message} />}
      <div className="grid gap-2 sm:grid-cols-[1fr_100px_1fr_auto]">
        <select
          name="type"
          defaultValue="STOCK_IN"
          className="coffee-focus rounded-xl border border-[#d8bf9f] bg-white px-3 py-2 text-sm text-[#2c1810]"
        >
          {STOCK_LOG_TYPES.map((type) => (
            <option key={type} value={type}>
              {stockLogTypeLabels[type]}
            </option>
          ))}
        </select>
        <input
          name="quantity"
          type="number"
          min="1"
          defaultValue="1"
          className="coffee-focus rounded-xl border border-[#d8bf9f] bg-white px-3 py-2 text-sm text-[#2c1810]"
        />
        <input
          name="note"
          placeholder="Note"
          className="coffee-focus rounded-xl border border-[#d8bf9f] bg-white px-3 py-2 text-sm text-[#2c1810]"
        />
        <SubmitButton pendingLabel="Updating..." className="w-full sm:w-auto">
          Save
        </SubmitButton>
      </div>
    </form>
  );
}
