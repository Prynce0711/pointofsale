import AppShell from "@/app/Layout/index";
import SalesHistoryPage from "@/app/Pages/Sales/SalesHistoryPage";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date } = await searchParams;

  return (
    <AppShell
      title="Sales History"
      subtitle="Daily sales reports, receipts, totals, and item breakdowns."
    >
      <SalesHistoryPage date={date} />
    </AppShell>
  );
}
