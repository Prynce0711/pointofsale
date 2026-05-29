import { formatDate, formatTime, startOfToday } from "@/app/lib/format";
import { employeeRoleLabels } from "@/app/lib/labels";
import { prisma } from "@/app/lib/prisma";
import Card from "@/app/Shared/Card/Card";
import EmptyState from "@/app/Shared/EmptyState/EmptyState";
import AttendanceControls from "./AttendanceControls";

export default async function AttendancePage() {
  const today = startOfToday();
  const employees = await prisma.employee.findMany({
    where: { status: "ACTIVE" },
    orderBy: [{ role: "asc" }, { firstName: "asc" }],
    include: {
      attendances: {
        where: { date: today },
        take: 1,
      },
    },
  });
  const history = await prisma.attendance.findMany({
    take: 30,
    orderBy: [{ date: "desc" }, { updatedAt: "desc" }],
    include: { employee: true },
  });

  return (
    <div className="grid gap-5">
      <Card
        title={`Daily attendance - ${formatDate(today)}`}
        description="Late is applied after 9:15 AM based on the server time."
      >
        {employees.length === 0 ? (
          <EmptyState
            title="No active employees"
            description="Add baristas, cashiers, staff, or managers first."
          />
        ) : (
          <div className="grid gap-3 xl:grid-cols-2">
            {employees.map((employee) => {
              const record = employee.attendances[0];
              return (
                <article
                  key={employee.id}
                  className="grid gap-3 rounded-lg border border-slate-200 p-4"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-950">
                        {employee.firstName} {employee.lastName}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {employeeRoleLabels[employee.role]}
                      </p>
                    </div>
                    <StatusBadge status={record?.status ?? "NO_RECORD"} />
                  </div>
                  <div className="grid gap-2 text-sm sm:grid-cols-2">
                    <p>
                      <span className="text-slate-500">Time in: </span>
                      <span className="font-medium">{formatTime(record?.timeIn)}</span>
                    </p>
                    <p>
                      <span className="text-slate-500">Time out: </span>
                      <span className="font-medium">{formatTime(record?.timeOut)}</span>
                    </p>
                  </div>
                  <AttendanceControls
                    employeeId={employee.id}
                    hasTimeIn={Boolean(record?.timeIn)}
                    hasTimeOut={Boolean(record?.timeOut)}
                  />
                </article>
              );
            })}
          </div>
        )}
      </Card>

      <Card title="Attendance history">
        {history.length === 0 ? (
          <EmptyState title="No attendance history yet" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="text-xs uppercase text-slate-500">
                <tr>
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Employee</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Time in</th>
                  <th className="py-2 pr-4">Time out</th>
                  <th className="py-2">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {history.map((record) => (
                  <tr key={record.id}>
                    <td className="py-3 pr-4 text-slate-500">
                      {formatDate(record.date)}
                    </td>
                    <td className="py-3 pr-4 font-medium text-slate-950">
                      {record.employee.firstName} {record.employee.lastName}
                    </td>
                    <td className="py-3 pr-4">
                      <StatusBadge status={record.status} />
                    </td>
                    <td className="py-3 pr-4">{formatTime(record.timeIn)}</td>
                    <td className="py-3 pr-4">{formatTime(record.timeOut)}</td>
                    <td className="py-3 text-slate-500">{record.notes ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: "PRESENT" | "LATE" | "ABSENT" | "NO_RECORD";
}) {
  const styles = {
    PRESENT: "bg-emerald-50 text-emerald-700",
    LATE: "bg-amber-50 text-amber-800",
    ABSENT: "bg-rose-50 text-rose-700",
    NO_RECORD: "bg-slate-100 text-slate-600",
  };

  return (
    <span className={`w-fit rounded-full px-2 py-1 text-xs font-semibold ${styles[status]}`}>
      {status === "NO_RECORD" ? "No record" : status}
    </span>
  );
}

