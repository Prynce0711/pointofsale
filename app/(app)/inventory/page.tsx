import AppShell from "@/components/layout/AppShell";
import InventoryPage from "@/features/inventory/components/InventoryPage";
import AddButton from "@/components/ui/ActionButton/Add";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; lowStock?: string }>;
}) {
  return (
    <AppShell
      title="Inventory"
      subtitle="Products, ingredients, supplies, low stock alerts, and stock history."
      actions={<AddButton href="/inventory/new">Add product</AddButton>}
    >
      <InventoryPage searchParams={await searchParams} />
    </AppShell>
  );
}

