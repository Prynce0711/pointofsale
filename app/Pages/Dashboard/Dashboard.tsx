import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  startOfToday,
  startOfTomorrow,
} from "@/app/lib/format";
import {
  DRINK_CATEGORIES,
  productCategoryLabels,
  type ProductCategoryValue,
} from "@/app/lib/labels";
import Card from "@/app/Shared/Card/Card";
import EmptyState from "@/app/Shared/EmptyState/EmptyState";

export default async function Dashboard() {
  const today = startOfToday();
  const tomorrow = startOfTomorrow();

  const [
    todaySales,
    recentSales,
    activeProducts,
    activeEmployees,
    todayAttendance,
    soldDrinkItems,
  ] = await Promise.all([
    prisma.sale.findMany({
      where: {
        status: "COMPLETED",
        createdAt: { gte: today, lt: tomorrow },
      },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.sale.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { items: true },
    }),
    prisma.product.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    }),
    prisma.employee.count({ where: { status: "ACTIVE" } }),
    prisma.attendance.findMany({
      where: { date: today },
      include: { employee: true },
      orderBy: { employee: { firstName: "asc" } },
    }),
    prisma.saleItem.findMany({
      where: {
        sale: { status: "COMPLETED" },
        category: { in: [...DRINK_CATEGORIES] },
      },
      select: {
        productName: true,
        category: true,
        quantity: true,
        lineTotalCents: true,
      },
    }),
  ]);

  const dailyRevenue = todaySales.reduce(
    (total, sale) => total + sale.totalCents,
    0,
  );
  const dailyItems = todaySales.reduce(
    (total, sale) =>
      total + sale.items.reduce((itemTotal, item) => itemTotal + item.quantity, 0),
    0,
  );
  const lowStock = activeProducts
    .filter((product) => product.stock <= product.lowStockThreshold)
    .slice(0, 8);
  const bestSellers = getBestSellers(soldDrinkItems);

  return (
    <div className="grid gap-5">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric label="Sales today" value={formatCurrency(dailyRevenue)} />
        <Metric label="Orders today" value={String(todaySales.length)} />
        <Metric label="Items sold today" value={String(dailyItems)} />
        <Metric label="Active employees" value={String(activeEmployees)} />
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card
          title={`Daily sales report - ${formatDate(today)}`}
          description="Completed coffee shop sales for the current business day."
          actions={
            <Link
              href="/sales"
              className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              View history
            </Link>
          }
        >
          {recentSales.length === 0 ? (
            <EmptyState
              title="No sales yet"
              description="Completed POS checkouts will show here."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase text-slate-500">
                  <tr>
                    <th className="py-2 pr-4">Receipt</th>
                    <th className="py-2 pr-4">Date</th>
                    <th className="py-2 pr-4">Items</th>
                    <th className="py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {recentSales.map((sale) => (
                    <tr key={sale.id}>
                      <td className="py-3 pr-4 font-medium text-slate-950">
                        {sale.receiptNo}
                      </td>
                      <td className="py-3 pr-4 text-slate-500">
                        {formatDateTime(sale.createdAt)}
                      </td>
                      <td className="py-3 pr-4 text-slate-500">
                        {sale.items.length}
                      </td>
                      <td className="py-3 text-right font-semibold">
                        {formatCurrency(sale.totalCents)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <div className="grid gap-5">
          <Card title="Best-selling drinks">
            {bestSellers.length === 0 ? (
              <EmptyState title="No drink sales yet" />
            ) : (
              <div className="grid gap-3">
                {bestSellers.map((item) => (
                  <div
                    key={`${item.name}-${item.category}`}
                    className="flex items-center justify-between gap-3 rounded-md bg-slate-50 px-3 py-2"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-950">
                        {item.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {productCategoryLabels[item.category]}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-emerald-700">
                      {item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card title="Low stock alert">
            {lowStock.length === 0 ? (
              <EmptyState title="Stock levels look healthy" />
            ) : (
              <div className="grid gap-2">
                {lowStock.map((product) => (
                  <Link
                    key={product.id}
                    href={`/inventory/${product.id}/edit`}
                    className="flex items-center justify-between rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm"
                  >
                    <span className="font-medium text-slate-950">{product.name}</span>
                    <span className="font-semibold text-amber-800">
                      {product.stock}/{product.lowStockThreshold}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </div>
      </section>

      <Card title="Today attendance">
        {todayAttendance.length === 0 ? (
          <EmptyState
            title="No attendance records today"
            description="Time in and absent records will appear after staff actions."
          />
        ) : (
          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {todayAttendance.map((record) => (
              <div
                key={record.id}
                className="rounded-md border border-slate-200 px-3 py-2 text-sm"
              >
                <p className="font-semibold text-slate-950">
                  {record.employee.firstName} {record.employee.lastName}
                </p>
                <p className="text-slate-500">{record.status}</p>
              </div>
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
