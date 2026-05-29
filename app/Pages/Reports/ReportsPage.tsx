import Link from "next/link";
import {
  formatCurrency,
  formatDateInput,
  formatDateTime,
} from "@/app/lib/format";
import {
  DRINK_CATEGORIES,
  productCategoryLabels,
  stockLogTypeLabels,
  type ProductCategoryValue,
} from "@/app/lib/labels";
import { prisma } from "@/app/lib/prisma";
import Card from "@/app/Shared/Card/Card";
import EmptyState from "@/app/Shared/EmptyState/EmptyState";
import {
  AnimatedButton,
  AnimatedItem,
  AnimatedList,
  AnimatedRow,
} from "@/app/Shared/Motion/Motion";

type ReportsPageProps = {
  date?: string;
};

export default async function ReportsPage({ date }: ReportsPageProps) {
  const selectedDate = parseDateFilter(date) ?? new Date();
  const start = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate(),
  );
  const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 1);

  const [sales, inventory, stockLogs] = await Promise.all([
    prisma.sale.findMany({
      where: {
        status: "COMPLETED",
        createdAt: { gte: start, lt: end },
      },
      include: {
        items: {
          select: {
            productName: true,
            category: true,
            quantity: true,
            lineTotalCents: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { isIngredient: true },
          {
            category: {
              in: [
                "COFFEE_BEANS",
                "MILK",
                "SYRUP",
                "CUPS",
                "LIDS",
                "STRAWS",
                "PASTRIES",
                "OTHER_INGREDIENT",
                "SUPPLY",
              ],
            },
          },
        ],
      },
      orderBy: [{ stock: "asc" }, { name: "asc" }],
    }),
    prisma.stockLog.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { product: true },
    }),
  ]);

  const items = sales.flatMap((sale) => sale.items);
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalCents, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const averageTicket = sales.length ? Math.round(totalRevenue / sales.length) : 0;
  const dineInOrders = sales.filter((sale) => sale.orderType === "DINE_IN").length;
  const takeOutOrders = sales.filter((sale) => sale.orderType === "TAKE_OUT").length;
  const bestSellers = getBestSellers(
    items.filter((item) =>
      DRINK_CATEGORIES.includes(
        item.category as (typeof DRINK_CATEGORIES)[number],
      ),
    ),
  );
  const categoryTotals = getCategoryTotals(items);
  const lowStockItems = inventory
    .filter((product) => product.stock <= product.lowStockThreshold)
    .slice(0, 8);

  return (
    <div className="grid gap-5">
      <Card title="Report date">
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
            Update report
          </AnimatedButton>
          <Link
            href="/sales"
            className="rounded-2xl border border-[#d8bf9f] bg-white/70 px-4 py-2 text-center text-sm font-semibold text-[#4b2f22] hover:bg-[#fff8ef]"
          >
            Receipt history
          </Link>
        </form>
      </Card>

      <AnimatedList className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AnimatedItem>
          <Metric label="Net sales" value={formatCurrency(totalRevenue)} tone="dark" />
        </AnimatedItem>
        <AnimatedItem>
          <Metric label="Orders" value={String(sales.length)} />
        </AnimatedItem>
        <AnimatedItem>
          <Metric label="Items sold" value={String(totalItems)} />
        </AnimatedItem>
        <AnimatedItem>
          <Metric label="Average ticket" value={formatCurrency(averageTicket)} />
        </AnimatedItem>
      </AnimatedList>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card
          title="Sales by category"
          description="Revenue and quantity breakdown for the selected business date."
        >
          {categoryTotals.length === 0 ? (
            <EmptyState title="No category sales for this date" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left text-sm">
                <thead className="text-xs uppercase text-[#8a6b58]">
                  <tr>
                    <th className="py-2 pr-4">Category</th>
                    <th className="py-2 pr-4">Quantity</th>
                    <th className="py-2 text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ead8c5]">
                  {categoryTotals.map((category) => (
                    <AnimatedRow key={category.category}>
                      <td className="py-3 pr-4 font-semibold text-[#2c1810]">
                        {productCategoryLabels[category.category]}
                      </td>
                      <td className="py-3 pr-4 text-[#8a6b58]">
                        {category.quantity}
                      </td>
                      <td className="py-3 text-right font-semibold text-[#4b2f22]">
                        {formatCurrency(category.totalCents)}
                      </td>
                    </AnimatedRow>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <div className="grid gap-5">
          <Card title="Order mix">
            <div className="grid gap-3">
              <MixRow label="Dine-in" value={dineInOrders} total={sales.length} />
              <MixRow label="Take-out" value={takeOutOrders} total={sales.length} />
            </div>
          </Card>

          <Card title="Best-selling drinks">
            {bestSellers.length === 0 ? (
              <EmptyState title="No drink sales yet" />
            ) : (
              <div className="grid gap-3">
                {bestSellers.map((drink, index) => (
                  <div
                    key={`${drink.name}-${drink.category}`}
                    className="flex items-center justify-between gap-3 rounded-2xl bg-[#fff8ef] px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#2c1810]">
                        {index + 1}. {drink.name}
                      </p>
                      <p className="text-xs text-[#8a6b58]">
                        {productCategoryLabels[drink.category]}
                      </p>
                    </div>
                    <span className="rounded-full bg-[#f3e6d5] px-2 py-1 text-xs font-semibold text-[#7a4b2c]">
                      {drink.quantity} sold
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <Card
          title="Low stock ingredients"
          description="Coffee shop supplies that need restocking soon."
        >
          {lowStockItems.length === 0 ? (
            <EmptyState title="Ingredient stock levels look healthy" />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {lowStockItems.map((product) => (
                <Link
                  key={product.id}
                  href={`/inventory/${product.id}/edit`}
                  className="rounded-3xl border border-[#d8bf9f] bg-[#fff8ef] p-4 transition hover:border-[#b98f62] hover:shadow-[var(--shadow-card)]"
                >
                  <p className="font-semibold text-[#2c1810]">{product.name}</p>
                  <p className="mt-1 text-xs text-[#8a6b58]">
                    {productCategoryLabels[product.category]}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-[#8a6b58]">Current stock</span>
                    <span className="font-semibold text-[#9b5f25]">
                      {product.stock}/{product.lowStockThreshold}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>

        <Card title="Recent stock movement">
          {stockLogs.length === 0 ? (
            <EmptyState title="No stock movement yet" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left text-sm">
                <thead className="text-xs uppercase text-[#8a6b58]">
                  <tr>
                    <th className="py-2 pr-4">Product</th>
                    <th className="py-2 pr-4">Type</th>
                    <th className="py-2 pr-4">Qty</th>
                    <th className="py-2">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ead8c5]">
                  {stockLogs.map((log) => (
                    <AnimatedRow key={log.id}>
                      <td className="py-3 pr-4 font-semibold text-[#2c1810]">
                        {log.product.name}
                      </td>
                      <td className="py-3 pr-4 text-[#8a6b58]">
                        {stockLogTypeLabels[log.type]}
                      </td>
                      <td className="py-3 pr-4 font-semibold text-[#4b2f22]">
                        {log.quantity}
                      </td>
                      <td className="py-3 text-[#8a6b58]">
                        {formatDateTime(log.createdAt)}
                      </td>
                    </AnimatedRow>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </section>
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

function MixRow({
  label,
  value,
  total,
}: {
  label: string;
  value: number;
  total: number;
}) {
  const percentage = total ? Math.round((value / total) * 100) : 0;

  return (
    <div className="grid gap-2 rounded-2xl bg-[#fff8ef] px-3 py-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-[#2c1810]">{label}</span>
        <span className="text-[#8a6b58]">
          {value} orders / {percentage}%
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[#ead8c5]">
        <div
          className="h-full rounded-full bg-[#9b5f25]"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function getBestSellers(
  items: Array<{
    productName: string;
    category: ProductCategoryValue;
    quantity: number;
    lineTotalCents: number;
  }>,
) {
  const totals = new Map<
    string,
    {
      name: string;
      category: ProductCategoryValue;
      quantity: number;
      totalCents: number;
    }
  >();

  for (const item of items) {
    const key = `${item.productName}-${item.category}`;
    const existing = totals.get(key) ?? {
      name: item.productName,
      category: item.category,
      quantity: 0,
      totalCents: 0,
    };

    existing.quantity += item.quantity;
    existing.totalCents += item.lineTotalCents;
    totals.set(key, existing);
  }

  return [...totals.values()]
    .sort((a, b) => b.quantity - a.quantity || b.totalCents - a.totalCents)
    .slice(0, 5);
}

function getCategoryTotals(
  items: Array<{
    category: ProductCategoryValue;
    quantity: number;
    lineTotalCents: number;
  }>,
) {
  const totals = new Map<
    ProductCategoryValue,
    { category: ProductCategoryValue; quantity: number; totalCents: number }
  >();

  for (const item of items) {
    const existing = totals.get(item.category) ?? {
      category: item.category,
      quantity: 0,
      totalCents: 0,
    };

    existing.quantity += item.quantity;
    existing.totalCents += item.lineTotalCents;
    totals.set(item.category, existing);
  }

  return [...totals.values()].sort((a, b) => b.totalCents - a.totalCents);
}

function parseDateFilter(value?: string) {
  if (!value) return null;

  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;

  return new Date(year, month - 1, day);
}
