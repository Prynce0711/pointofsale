import AppShell from "@/app/Layout/index";
import Dashboard from "@/app/Pages/Dashboard/Dashboard";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  return (
    <AppShell
      title="Dashboard"
      subtitle="Daily sales, best sellers, low stock, and attendance status."
    >
      <Dashboard />
    </AppShell>
  );
}
