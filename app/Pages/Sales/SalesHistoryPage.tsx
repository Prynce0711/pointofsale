import { formatCurrency, formatDateInput, formatDateTime } from "@/app/lib/format";
import { orderTypeLabels, productSizeLabels, temperatureLabels } from "@/app/lib/labels";
import { prisma } from "@/app/lib/prisma";
import Card from "@/app/Shared/Card/Card";
import EmptyState from "@/app/Shared/EmptyState/EmptyState";

type SalesHistoryPageProps = {
  date?: string;
};

export default async function SalesHistoryPage({ date }: SalesHistoryPageProps) {
  const selectedDate = parseDateFilter(date) ?? new Date();
  const start = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate(),
  );
  const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 1);

  const sales = await prisma.sale.findMany({
    where: {
      status: "COMPLETED",
      createdAt: { gte: start, lt: end },
    },
    include: {
      items: { orderBy: { id: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalRevenue = sales.reduce((total, sale) => total + sale.totalCents, 0);
  const totalItems = sales.reduce(
    (total, sale) =>
      total + sale.items.reduce((itemTotal, item) => itemTotal + item.quantity, 0),
    0,
  );

  return (
    <div className="grid gap-5">
      <Card title="Daily report filter">
        <form className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Business date
            <input
              type="date"
              name="date"
              defaultValue={formatDateInput(start)}
              className="rounded-md border border-slate-300 px-3 py-2 text-slate-950"
            />
          </label>
          <button
            type="submit"
            className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
          >
            View report
          </button>
        </form>
      </Card>

      <section className="grid gap-4 md:grid-cols-3">
        <Metric label="Gross sales" value={formatCurrency(totalRevenue)} />
        <Metric label="Completed orders" value={String(sales.length)} />
        <Metric label="Items sold" value={String(totalItems)} />
      </section>

      <Card title="Sales history" description="Receipt-style record of completed sales.">
        {sales.length === 0 ? (
          <EmptyState title="No sales for this date" />
        ) : (
          <div className="grid gap-4">
            {sales.map((sale) => (
              <article
                key={sale.id}
                className="rounded-lg border border-slate-200 bg-white p-4"
              >
                <div className="flex flex-col gap-2 border-b border-dashed border-slate-300 pb-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-950">{sale.receiptNo}</h3>
                    <p className="text-sm text-slate-500">
                      {formatDateTime(sale.createdAt)} / {orderTypeLabels[sale.orderType]}
                    </p>
                  </div>
                  <p className="text-lg font-semibold text-slate-950">
                    {formatCurrency(sale.totalCents)}
                  </p>
                </div>
                <div className="mt-3 grid gap-2">
                  {sale.items.map((item) => {
                    const addOns = parseAddOns(item.addOnsJson);
                    return (
                      <div
                        key={item.id}
                        className="grid gap-2 rounded-md bg-slate-50 px-3 py-2 text-sm md:grid-cols-[1fr_auto]"
                      >
                        <div>
                          <p className="font-semibold text-slate-950">
                            {item.quantity}x {item.productName}
                          </p>
                          <p className="text-xs text-slate-500">
                            {productSizeLabels[item.size]} /{" "}
                            {temperatureLabels[item.temperature]}
                            {addOns.length > 0
                              ? ` / Add-ons: ${addOns.map((addOn) => addOn.name).join(", ")}`
                              : ""}
                          </p>
                        </div>
                        <span className="font-semibold">
                          {formatCurrency(item.lineTotalCents)}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-3 grid gap-1 text-sm sm:ml-auto sm:w-72">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(sale.subtotalCents)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Paid</span>
                    <span>{formatCurrency(sale.amountPaidCents)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-emerald-700">
                    <span>Change</span>
                    <span>{formatCurrency(sale.changeCents)}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function parseDateFilter(value?: string) {
  if (!value) return null;

  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;

  return new Date(year, month - 1, day);
}

function parseAddOns(value: string | null) {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is { name: string } =>
        item && typeof item.name === "string",
    );
  } catch {
    return [];
  }
}

