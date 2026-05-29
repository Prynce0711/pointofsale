import { formatDate, formatTime, startOfToday } from "@/app/lib/format";
import { employeeRoleLabels } from "@/app/lib/labels";
import { prisma } from "@/app/lib/prisma";
import Card from "@/app/Shared/Card/Card";
import EmptyState from "@/app/Shared/EmptyState/EmptyState";
import { AnimatedItem, AnimatedList, AnimatedRow } from "@/app/Shared/Motion/Motion";
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
          <AnimatedList className="grid gap-3 xl:grid-cols-2">
            {employees.map((employee) => {
              const record = employee.attendances[0];
              return (
                <AnimatedItem key={employee.id}>
                  <article className="grid gap-4 rounded-3xl border border-[#ead8c5] bg-[#fffaf3] p-4 shadow-sm transition hover:border-[#d8bf9f] hover:shadow-[var(--shadow-card)]">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="font-semibold text-[#2c1810]">
                          {employee.firstName} {employee.lastName}
                        </h3>
                        <p className="text-sm text-[#8a6b58]">
                          {employeeRoleLabels[employee.role]}
                        </p>
                      </div>
                      <StatusBadge status={record?.status ?? "NO_RECORD"} />
                    </div>
                    <div className="grid gap-2 text-sm sm:grid-cols-2">
                      <p className="rounded-2xl bg-white/70 px-3 py-2">
                        <span className="text-[#8a6b58]">Time in: </span>
                        <span className="font-medium text-[#2c1810]">
                          {formatTime(record?.timeIn)}
                        </span>
                      </p>
                      <p className="rounded-2xl bg-white/70 px-3 py-2">
                        <span className="text-[#8a6b58]">Time out: </span>
                        <span className="font-medium text-[#2c1810]">
                          {formatTime(record?.timeOut)}
                        </span>
                      </p>
                    </div>
                    <AttendanceControls
                      employeeId={employee.id}
                      hasTimeIn={Boolean(record?.timeIn)}
                      hasTimeOut={Boolean(record?.timeOut)}
                    />
                  </article>
                </AnimatedItem>
              );
            })}
          </AnimatedList>
        )}
      </Card>

      <Card title="Attendance history">
        {history.length === 0 ? (
          <EmptyState title="No attendance history yet" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="text-xs uppercase text-[#8a6b58]">
                <tr>
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Employee</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Time in</th>
                  <th className="py-2 pr-4">Time out</th>
                  <th className="py-2">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ead8c5]">
                {history.map((record) => (
                  <AnimatedRow key={record.id}>
                    <td className="py-3 pr-4 text-[#8a6b58]">
                      {formatDate(record.date)}
                    </td>
                    <td className="py-3 pr-4 font-medium text-[#2c1810]">
                      {record.employee.firstName} {record.employee.lastName}
                    </td>
                    <td className="py-3 pr-4">
                      <StatusBadge status={record.status} />
                    </td>
                    <td className="py-3 pr-4">{formatTime(record.timeIn)}</td>
                    <td className="py-3 pr-4">{formatTime(record.timeOut)}</td>
                    <td className="py-3 text-[#8a6b58]">{record.notes ?? "-"}</td>
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

function StatusBadge({
  status,
}: {
  status: "PRESENT" | "LATE" | "ABSENT" | "NO_RECORD";
}) {
  const styles = {
    PRESENT: "bg-[#eaf4dc] text-[#3e621d]",
    LATE: "bg-amber-50 text-amber-800",
    ABSENT: "bg-rose-50 text-rose-700",
    NO_RECORD: "bg-[#f3e6d5] text-[#6f4b35]",
  };

  return (
    <span className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}>
      {status === "NO_RECORD" ? "No record" : status}
    </span>
  );
}
