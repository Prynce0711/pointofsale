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
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950"
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
          className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950"
        />
        <input
          name="note"
          placeholder="Note"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950"
        />
        <SubmitButton pendingLabel="Updating..." className="w-full sm:w-auto">
          Save
        </SubmitButton>
      </div>
    </form>
  );
}

