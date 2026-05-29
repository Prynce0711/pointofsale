import AppShell from "@/components/layout/AppShell";
import Dashboard from "@/features/dashboard/components/Dashboard";

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

