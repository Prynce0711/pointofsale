import AppShell from "@/app/Layout/index";
import POSClient, { type POSProduct } from "@/app/Pages/PointOfSale/POSClient";
import { prisma } from "@/app/lib/prisma";

export const dynamic = "force-dynamic";

export default async function POSPage() {
  const [products, addOns] = await Promise.all([
    prisma.product.findMany({
      where: {
        isActive: true,
        isMenuItem: true,
        NOT: { category: "ADD_ON" },
      },
      orderBy: [{ category: "asc" }, { name: "asc" }, { size: "asc" }],
      select: {
        id: true,
        name: true,
        category: true,
        size: true,
        sku: true,
        priceCents: true,
        stock: true,
      },
    }),
    prisma.product.findMany({
      where: { isActive: true, category: "ADD_ON" },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        category: true,
        size: true,
        sku: true,
        priceCents: true,
        stock: true,
      },
    }),
  ]);

  return (
    <AppShell
      title="POS"
      subtitle="Search products, build a receipt, collect cash, and reduce stock."
    >
      <POSClient
        products={products as POSProduct[]}
        addOns={addOns as POSProduct[]}
      />
    </AppShell>
  );
}
