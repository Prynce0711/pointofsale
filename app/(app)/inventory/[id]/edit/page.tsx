import { notFound } from "next/navigation";
import AppShell from "@/app/Layout/index";
import ProductForm from "@/app/Pages/Inventory/ProductForm";
import { prisma } from "@/app/lib/prisma";
import Card from "@/app/Shared/Card/Card";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = Number(id);

  if (!Number.isInteger(productId)) notFound();

  const product = await prisma.product.findUnique({ where: { id: productId } });

  if (!product) notFound();

  return (
    <AppShell title="Edit product" subtitle={product.name}>
      <Card title="Product details">
        <ProductForm
          product={{
            id: product.id,
            name: product.name,
            category: product.category,
            size: product.size,
            sku: product.sku,
            barcode: product.barcode,
            price: (product.priceCents / 100).toFixed(2),
            stock: product.stock,
            lowStockThreshold: product.lowStockThreshold,
            isMenuItem: product.isMenuItem,
            isIngredient: product.isIngredient,
          }}
        />
      </Card>
    </AppShell>
  );
}
