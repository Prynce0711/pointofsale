import AppShell from "@/app/Layout/index";
import ReportsPage from "@/app/Pages/Reports/ReportsPage";

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
