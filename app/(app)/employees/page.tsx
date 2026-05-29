import AppShell from "@/app/Layout/index";
import EmployeesPage from "@/app/Pages/Employees/EmployeesPage";

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
