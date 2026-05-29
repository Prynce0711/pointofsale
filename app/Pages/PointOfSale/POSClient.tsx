"use client";

import { useMemo, useState, useTransition } from "react";
import {
  completeSaleAction,
  type CheckoutResult,
} from "@/app/actions/sales";
import { formatCurrency } from "@/app/lib/format";
import {
  ORDER_TYPES,
  TEMPERATURE_OPTIONS,
  isDrinkCategory,
  orderTypeLabels,
  productCategoryLabels,
  productSizeLabels,
  temperatureLabels,
  type OrderTypeValue,
  type ProductCategoryValue,
  type ProductSizeValue,
  type TemperatureValue,
} from "@/app/lib/labels";

export type POSProduct = {
  id: number;
  name: string;
  category: ProductCategoryValue;
  size: ProductSizeValue;
  sku: string;
  priceCents: number;
  stock: number;
};

type CartItem = POSProduct & {
  cartId: string;
  quantity: number;
  temperature: TemperatureValue;
  addOnIds: number[];
};

type POSClientProps = {
  products: POSProduct[];
  addOns: POSProduct[];
};

export default function POSClient({ products, addOns }: POSClientProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("ALL");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<OrderTypeValue>("DINE_IN");
  const [amountPaid, setAmountPaid] = useState("");
  const [result, setResult] = useState<CheckoutResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const categories = useMemo(
    () => ["ALL", ...new Set(products.map((product) => product.category))],
    [products],
  );

  const filteredProducts = products.filter((product) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      q === "" ||
      product.name.toLowerCase().includes(q) ||
      product.sku.toLowerCase().includes(q);
    const matchesCategory = category === "ALL" || product.category === category;

    return matchesQuery && matchesCategory;
  });

  const addOnMap = new Map(addOns.map((addOn) => [addOn.id, addOn]));
  const subtotalCents = cart.reduce(
    (total, item) => total + getLineTotal(item, addOnMap),
    0,
  );
  const paidCents = Math.round((Number(amountPaid) || 0) * 100);
  const changeCents = Math.max(0, paidCents - subtotalCents);

  function addToCart(product: POSProduct) {
    setResult(null);
    setCart((current) => [
      ...current,
      {
        ...product,
        cartId: createCartId(),
        quantity: 1,
        temperature: isDrinkCategory(product.category) ? "ICED" : "NOT_APPLICABLE",
        addOnIds: [],
      },
    ]);
  }

  function updateQuantity(cartId: string, quantity: number) {
    setCart((current) =>
      current.map((item) =>
        item.cartId === cartId
          ? { ...item, quantity: Math.max(1, Math.min(999, quantity)) }
          : item,
      ),
    );
  }

  function toggleAddOn(cartId: string, addOnId: number) {
    setCart((current) =>
      current.map((item) => {
        if (item.cartId !== cartId) return item;

        const hasAddOn = item.addOnIds.includes(addOnId);
        return {
          ...item,
          addOnIds: hasAddOn
            ? item.addOnIds.filter((id) => id !== addOnId)
            : [...item.addOnIds, addOnId],
        };
      }),
    );
  }

  function updateTemperature(cartId: string, temperature: TemperatureValue) {
    setCart((current) =>
      current.map((item) =>
        item.cartId === cartId ? { ...item, temperature } : item,
      ),
    );
  }

  function removeItem(cartId: string) {
    setCart((current) => current.filter((item) => item.cartId !== cartId));
  }

  function completeSale() {
    setResult(null);
    startTransition(async () => {
      const response = await completeSaleAction({
        orderType,
        amountPaidCents: paidCents,
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          temperature: item.temperature,
          addOnIds: item.addOnIds,
        })),
      });

      setResult(response);

      if (response.ok) {
        setCart([]);
        setAmountPaid("");
      }
    });
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
      <section className="grid gap-4">
        <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-[1fr_auto]">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search drinks, pastries, SKU"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold ${
                  category === item
                    ? "bg-slate-950 text-white"
                    : "border border-slate-300 bg-white text-slate-700"
                }`}
              >
                {item === "ALL"
                  ? "All"
                  : productCategoryLabels[item as ProductCategoryValue]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <article
              key={product.id}
              className="grid min-h-44 gap-3 rounded-lg border border-slate-200 bg-white p-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-slate-950">{product.name}</h3>
                  <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                    {formatCurrency(product.priceCents)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {productCategoryLabels[product.category]} /{" "}
                  {productSizeLabels[product.size]}
                </p>
              </div>
              <div className="mt-auto flex items-center justify-between gap-3">
                <span
                  className={`text-xs font-semibold ${
                    product.stock <= 0 ? "text-rose-600" : "text-slate-500"
                  }`}
                >
                  Stock: {product.stock}
                </span>
                <button
                  type="button"
                  disabled={product.stock <= 0}
                  onClick={() => addToCart(product)}
                  className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  Add
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <aside className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 xl:sticky xl:top-4 xl:self-start">
        <div className="border-b border-dashed border-slate-300 pb-3">
          <h2 className="text-lg font-semibold text-slate-950">Receipt</h2>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {ORDER_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setOrderType(type)}
                className={`rounded-md px-3 py-2 text-sm font-semibold ${
                  orderType === type
                    ? "bg-slate-950 text-white"
                    : "border border-slate-300 text-slate-700"
                }`}
              >
                {orderTypeLabels[type]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid max-h-[520px] gap-3 overflow-y-auto pr-1">
          {cart.length === 0 ? (
            <p className="rounded-md bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
              Cart is empty.
            </p>
          ) : (
            cart.map((item) => (
              <div key={item.cartId} className="rounded-md border border-slate-200 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-950">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {item.sku} / {productSizeLabels[item.size]}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.cartId)}
                    className="text-sm font-semibold text-rose-600"
                  >
                    Remove
                  </button>
                </div>

                <div className="mt-3 grid gap-2">
                  {isDrinkCategory(item.category) ? (
                    <select
                      value={item.temperature}
                      onChange={(event) =>
                        updateTemperature(
                          item.cartId,
                          event.target.value as TemperatureValue,
                        )
                      }
                      className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                    >
                      {TEMPERATURE_OPTIONS.filter(
                        (temperature) => temperature !== "NOT_APPLICABLE",
                      ).map((temperature) => (
                        <option key={temperature} value={temperature}>
                          {temperatureLabels[temperature]}
                        </option>
                      ))}
                    </select>
                  ) : null}

                  {addOns.length > 0 ? (
                    <div className="grid gap-1 rounded-md bg-slate-50 p-2">
                      {addOns.map((addOn) => (
                        <label
                          key={addOn.id}
                          className="flex items-center justify-between gap-2 text-xs text-slate-700"
                        >
                          <span className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={item.addOnIds.includes(addOn.id)}
                              onChange={() => toggleAddOn(item.cartId, addOn.id)}
                            />
                            {addOn.name}
                          </span>
                          <span>{formatCurrency(addOn.priceCents)}</span>
                        </label>
                      ))}
                    </div>
                  ) : null}

                  <div className="flex items-center justify-between gap-3">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(event) =>
                        updateQuantity(item.cartId, Number(event.target.value))
                      }
                      className="w-24 rounded-md border border-slate-300 px-3 py-2 text-sm"
                    />
                    <span className="text-sm font-semibold text-slate-950">
                      {formatCurrency(getLineTotal(item, addOnMap))}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="grid gap-2 border-t border-dashed border-slate-300 pt-3 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotalCents)}</span>
          </div>
          <div className="flex justify-between text-base font-semibold">
            <span>Total</span>
            <span>{formatCurrency(subtotalCents)}</span>
          </div>
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Cash received
            <input
              type="number"
              min="0"
              step="0.01"
              value={amountPaid}
              onChange={(event) => setAmountPaid(event.target.value)}
              className="rounded-md border border-slate-300 px-3 py-2 text-slate-950"
            />
          </label>
          <div className="flex justify-between font-semibold text-emerald-700">
            <span>Change</span>
            <span>{formatCurrency(changeCents)}</span>
          </div>
          {result ? (
            <div
              className={`rounded-md px-3 py-2 text-sm ${
                result.ok
                  ? "bg-emerald-50 text-emerald-800"
                  : "bg-rose-50 text-rose-800"
              }`}
            >
              {result.message}
              {result.receiptNo ? (
                <span className="block font-semibold">{result.receiptNo}</span>
              ) : null}
            </div>
          ) : null}
          <button
            type="button"
            disabled={cart.length === 0 || isPending}
            onClick={completeSale}
            className="rounded-md bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isPending ? "Completing..." : "Complete sale"}
          </button>
        </div>
      </aside>
    </div>
  );
}

function getLineTotal(item: CartItem, addOnMap: Map<number, POSProduct>) {
  const addOnsTotal = item.addOnIds.reduce(
    (total, id) => total + (addOnMap.get(id)?.priceCents ?? 0),
    0,
  );

  return (item.priceCents + addOnsTotal) * item.quantity;
}

function createCartId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()}`;
}
