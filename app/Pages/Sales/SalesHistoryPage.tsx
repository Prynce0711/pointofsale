import { formatCurrency, formatDateInput, formatDateTime } from "@/app/lib/format";
import { orderTypeLabels, productSizeLabels, temperatureLabels } from "@/app/lib/labels";
import { prisma } from "@/app/lib/prisma";
import Card from "@/app/Shared/Card/Card";
import EmptyState from "@/app/Shared/EmptyState/EmptyState";
import {
  AnimatedButton,
  AnimatedItem,
  AnimatedList,
} from "@/app/Shared/Motion/Motion";

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
          <label className="grid gap-1 text-sm font-medium text-[#4b2f22]">
            Business date
            <input
              type="date"
              name="date"
              defaultValue={formatDateInput(start)}
              className="coffee-focus rounded-2xl border border-[#d8bf9f] bg-white/80 px-3 py-2 text-[#2c1810]"
            />
          </label>
          <AnimatedButton
            type="submit"
            className="rounded-2xl bg-[#2c1810] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#4b2f22]"
          >
            View report
          </AnimatedButton>
        </form>
      </Card>

      <AnimatedList className="grid gap-4 md:grid-cols-3">
        <AnimatedItem>
          <Metric label="Gross sales" value={formatCurrency(totalRevenue)} tone="dark" />
        </AnimatedItem>
        <AnimatedItem>
          <Metric label="Completed orders" value={String(sales.length)} />
        </AnimatedItem>
        <AnimatedItem>
          <Metric label="Items sold" value={String(totalItems)} />
        </AnimatedItem>
      </AnimatedList>

      <Card title="Sales history" description="Receipt-style record of completed sales.">
        {sales.length === 0 ? (
          <EmptyState title="No sales for this date" />
        ) : (
          <AnimatedList className="grid gap-4">
            {sales.map((sale) => (
              <AnimatedItem key={sale.id}>
                <article className="rounded-3xl border border-[#ead8c5] bg-[#fffaf3] p-4 shadow-sm transition hover:border-[#d8bf9f] hover:shadow-[var(--shadow-card)]">
                  <div className="flex flex-col gap-2 border-b border-dashed border-[#d8bf9f] pb-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="font-semibold text-[#2c1810]">{sale.receiptNo}</h3>
                      <p className="text-sm text-[#8a6b58]">
                        {formatDateTime(sale.createdAt)} /{" "}
                        {orderTypeLabels[sale.orderType]}
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-[#2c1810]">
                      {formatCurrency(sale.totalCents)}
                    </p>
                  </div>
                  <div className="mt-3 grid gap-2">
                    {sale.items.map((item) => {
                      const addOns = parseAddOns(item.addOnsJson);
                      return (
                        <div
                          key={item.id}
                          className="grid gap-2 rounded-2xl bg-white/70 px-3 py-2 text-sm md:grid-cols-[1fr_auto]"
                        >
                          <div>
                            <p className="font-semibold text-[#2c1810]">
                              {item.quantity}x {item.productName}
                            </p>
                            <p className="text-xs text-[#8a6b58]">
                              {productSizeLabels[item.size]} /{" "}
                              {temperatureLabels[item.temperature]}
                              {addOns.length > 0
                                ? ` / Add-ons: ${addOns
                                    .map((addOn) => addOn.name)
                                    .join(", ")}`
                                : ""}
                            </p>
                          </div>
                          <span className="font-semibold text-[#4b2f22]">
                            {formatCurrency(item.lineTotalCents)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-3 grid gap-1 text-sm text-[#4b2f22] sm:ml-auto sm:w-72">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatCurrency(sale.subtotalCents)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Paid</span>
                      <span>{formatCurrency(sale.amountPaidCents)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-[#3e621d]">
                      <span>Change</span>
                      <span>{formatCurrency(sale.changeCents)}</span>
                    </div>
                  </div>
                </article>
              </AnimatedItem>
            ))}
          </AnimatedList>
        )}
      </Card>
    </div>
  );
}

function Metric({
  label,
  value,
  tone = "light",
}: {
  label: string;
  value: string;
  tone?: "light" | "dark";
}) {
  return (
    <div
      className={
        tone === "dark"
          ? "rounded-3xl border border-[#2c1810] bg-[#2c1810] p-5 text-white shadow-[var(--shadow-soft)]"
          : "rounded-3xl border border-[#ead8c5] bg-[#fffaf3] p-5 shadow-[var(--shadow-card)]"
      }
    >
      <p
        className={
          tone === "dark"
            ? "text-sm font-medium text-[#ead8c5]"
            : "text-sm font-medium text-[#8a6b58]"
        }
      >
        {label}
      </p>
      <p
        className={
          tone === "dark"
            ? "mt-2 text-2xl font-semibold text-white"
            : "mt-2 text-2xl font-semibold text-[#2c1810]"
        }
      >
        {value}
      </p>
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
