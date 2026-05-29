import { updateEmployeeStatusAction } from "@/app/actions/employees";
import { formatDate } from "@/lib/format";
import {
  EMPLOYEE_STATUSES,
  employeeRoleLabels,
  employeeStatusLabels,
} from "@/lib/labels";
import { prisma } from "@/lib/prisma";
import Card from "@/components/ui/Card/Card";
import EmptyState from "@/components/ui/EmptyState/EmptyState";
import SubmitButton from "@/components/ui/Form/SubmitButton";
import { AnimatedRow } from "@/components/ui/Motion/Motion";
import EmployeeForm from "./EmployeeForm";

export default async function EmployeesPage() {
  const employees = await prisma.employee.findMany({
    orderBy: [{ status: "asc" }, { role: "asc" }, { firstName: "asc" }],
  });

  return (
    <div className="grid gap-5 xl:grid-cols-[420px_minmax(0,1fr)]">
      <Card
        title="Add employee"
        description="Create baristas, cashiers, staff, and managers for attendance tracking."
      >
        <EmployeeForm />
      </Card>

      <Card title="Employee list">
        {employees.length === 0 ? (
          <EmptyState title="No employees yet" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="text-xs uppercase text-[#8a6b58]">
                <tr>
                  <th className="py-2 pr-4">Employee</th>
                  <th className="py-2 pr-4">Role</th>
                  <th className="py-2 pr-4">Contact</th>
                  <th className="py-2 pr-4">Created</th>
                  <th className="py-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ead8c5]">
                {employees.map((employee) => (
                  <AnimatedRow key={employee.id}>
                    <td className="py-4 pr-4">
                      <p className="font-semibold text-[#2c1810]">
                        {employee.firstName} {employee.lastName}
                      </p>
                      <p className="text-xs text-[#8a6b58]">
                        {employeeStatusLabels[employee.status]}
                      </p>
                    </td>
                    <td className="py-4 pr-4 text-[#4b2f22]">
                      {employeeRoleLabels[employee.role]}
                    </td>
                    <td className="py-4 pr-4 text-[#8a6b58]">
                      {employee.email ?? "-"}
                      <span className="block">{employee.phone ?? ""}</span>
                    </td>
                    <td className="py-4 pr-4 text-[#8a6b58]">
                      {formatDate(employee.createdAt)}
                    </td>
                    <td className="py-4 text-right">
                      <form
                        action={updateEmployeeStatusAction}
                        className="flex justify-end gap-2"
                      >
                        <input type="hidden" name="id" value={employee.id} />
                        <select
                          name="status"
                          defaultValue={employee.status}
                          className="coffee-focus rounded-xl border border-[#d8bf9f] bg-white/80 px-3 py-2 text-sm text-[#2c1810]"
                        >
                          {EMPLOYEE_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {employeeStatusLabels[status]}
                            </option>
                          ))}
                        </select>
                        <SubmitButton variant="secondary" pendingLabel="Saving...">
                          Save
                        </SubmitButton>
                      </form>
                    </td>
                  </AnimatedRow>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

