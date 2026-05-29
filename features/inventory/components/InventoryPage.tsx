import Link from "next/link";
import { deleteProductAction } from "@/app/actions/products";
import { formatCurrency, formatDateTime } from "@/lib/format";
import {
  PRODUCT_CATEGORIES,
  productCategoryLabels,
  productSizeLabels,
  stockLogTypeLabels,
  type ProductCategoryValue,
} from "@/lib/labels";
import { prisma } from "@/lib/prisma";
import DeleteButton from "@/components/ui/ActionButton/Delete";
import EditButton from "@/components/ui/ActionButton/Edit";
import Card from "@/components/ui/Card/Card";
import EmptyState from "@/components/ui/EmptyState/EmptyState";
import { AnimatedRow } from "@/components/ui/Motion/Motion";
import StockAdjustmentForm from "./StockAdjustmentForm";

type InventoryPageProps = {
  searchParams: {
    q?: string;
    category?: string;
    lowStock?: string;
  };
};

export default async function InventoryPage({ searchParams }: InventoryPageProps) {
  const query = searchParams.q?.trim() ?? "";
  const category = PRODUCT_CATEGORIES.includes(
    searchParams.category as ProductCategoryValue,
  )
    ? (searchParams.category as ProductCategoryValue)
    : "";
  const onlyLowStock = searchParams.lowStock === "1";

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(category ? { category } : {}),
      ...(query
        ? {
            OR: [
              { name: { contains: query } },
              { sku: { contains: query.toUpperCase() } },
              { barcode: { contains: query } },
            ],
          }
        : {}),
    },
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });
  const filteredProducts = onlyLowStock
    ? products.filter((product) => product.stock <= product.lowStockThreshold)
    : products;

  const stockLogs = await prisma.stockLog.findMany({
    take: 12,
    orderBy: { createdAt: "desc" },
    include: { product: true },
  });

  return (
    <div className="grid gap-5">
      <Card title="Inventory filters">
        <form className="grid gap-3 md:grid-cols-[1fr_220px_auto_auto]">
          <input
            name="q"
            defaultValue={query}
            placeholder="Search name, SKU, barcode"
            className="coffee-focus rounded-2xl border border-[#d8bf9f] bg-white/80 px-3 py-2 text-sm text-[#2c1810]"
          />
          <select
            name="category"
            defaultValue={category}
            className="coffee-focus rounded-2xl border border-[#d8bf9f] bg-white px-3 py-2 text-sm text-[#2c1810]"
          >
            <option value="">All categories</option>
            {PRODUCT_CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {productCategoryLabels[item]}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2 rounded-2xl border border-[#d8bf9f] bg-white/70 px-3 py-2 text-sm text-[#4b2f22]">
            <input
              type="checkbox"
              name="lowStock"
              value="1"
              defaultChecked={onlyLowStock}
            />
            Low stock
          </label>
          <button
            type="submit"
            className="rounded-2xl bg-[#2c1810] px-4 py-2 text-sm font-semibold text-white"
          >
            Apply
          </button>
        </form>
      </Card>

      <Card title="Product list" description="Menu items, ingredients, supplies, and add-ons.">
        {filteredProducts.length === 0 ? (
          <EmptyState
            title="No products found"
            description="Add products or change the current filters."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="text-xs uppercase text-[#8a6b58]">
                <tr>
                  <th className="py-2 pr-4">Product</th>
                  <th className="py-2 pr-4">Category</th>
                  <th className="py-2 pr-4">Price</th>
                  <th className="py-2 pr-4">Stock</th>
                  <th className="py-2 pr-4">Flags</th>
                  <th className="py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ead8c5]">
                {filteredProducts.map((product) => (
                  <AnimatedRow key={product.id} className="align-top">
                    <td className="py-4 pr-4">
                      <p className="font-semibold text-[#2c1810]">{product.name}</p>
                      <p className="text-xs text-[#8a6b58]">
                        SKU {product.sku}
                        {product.barcode ? ` / Barcode ${product.barcode}` : ""}
                      </p>
                    </td>
                    <td className="py-4 pr-4 text-[#6f4b35]">
                      {productCategoryLabels[product.category]}
                      <span className="block text-xs text-[#8a6b58]">
                        {productSizeLabels[product.size]}
                      </span>
                    </td>
                    <td className="py-4 pr-4 font-semibold">
                      {formatCurrency(product.priceCents)}
                    </td>
                    <td className="py-4 pr-4">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                          product.stock <= product.lowStockThreshold
                            ? "bg-[#fff1d8] text-[#9b5f25]"
                            : "bg-[#efe4d2] text-[#6f4b35]"
                        }`}
                      >
                        {product.stock} in stock
                      </span>
                      <span className="block pt-2 text-xs text-[#8a6b58]">
                        Threshold {product.lowStockThreshold}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-xs text-[#8a6b58]">
                      {product.isMenuItem ? "POS menu" : "Not on POS"}
                      <span className="block">
                        {product.isIngredient ? "Inventory item" : "Sales item"}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <EditButton href={`/inventory/${product.id}/edit`} />
                        <form action={deleteProductAction}>
                          <input type="hidden" name="id" value={product.id} />
                          <DeleteButton>Deactivate</DeleteButton>
                        </form>
                      </div>
                      <div className="mt-3 text-left">
                        <StockAdjustmentForm productId={product.id} />
                      </div>
                    </td>
                  </AnimatedRow>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card title="Stock in / stock out history">
        {stockLogs.length === 0 ? (
          <EmptyState title="No stock movement yet" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-[#8a6b58]">
                <tr>
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Product</th>
                  <th className="py-2 pr-4">Type</th>
                  <th className="py-2 pr-4">Qty</th>
                  <th className="py-2">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ead8c5]">
                {stockLogs.map((log) => (
                  <AnimatedRow key={log.id}>
                    <td className="py-3 pr-4 text-[#8a6b58]">
                      {formatDateTime(log.createdAt)}
                    </td>
                    <td className="py-3 pr-4 font-medium text-[#2c1810]">
                      <Link href={`/inventory/${log.productId}/edit`}>
                        {log.product.name}
                      </Link>
                    </td>
                    <td className="py-3 pr-4 text-[#6f4b35]">
                      {stockLogTypeLabels[log.type]}
                    </td>
                    <td className="py-3 pr-4">{log.quantity}</td>
                    <td className="py-3">
                      {log.previousStock} {"->"} {log.newStock}
                    </td>
                  </AnimatedRow>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

