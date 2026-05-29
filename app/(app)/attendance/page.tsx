import AppShell from "@/components/layout/AppShell";
import AttendancePage from "@/features/attendance/components/AttendancePage";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <AppShell
      title="Attendance"
      subtitle="Time in, time out, daily attendance, and history for cafe staff."
    >
      <AttendancePage />
    </AppShell>
  );
}

