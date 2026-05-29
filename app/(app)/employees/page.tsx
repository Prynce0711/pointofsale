import AppShell from "@/components/layout/AppShell";
import EmployeesPage from "@/features/employees/components/EmployeesPage";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <AppShell
      title="Employee Management"
      subtitle="Manage baristas, cashiers, staff, and managers."
    >
      <EmployeesPage />
    </AppShell>
  );
}

