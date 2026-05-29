import AppShell from "@/components/layout/AppShell";
import ReportsPage from "@/features/reports/components/ReportsPage";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date } = await searchParams;

  return (
    <AppShell
      title="Reports"
      subtitle="Daily sales performance, best-selling drinks, and low stock ingredients."
    >
      <ReportsPage date={date} />
    </AppShell>
  );
}

