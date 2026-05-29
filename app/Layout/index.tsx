import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { requireAuth } from "@/app/lib/auth";

type AppShellProps = {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
};

export default async function AppShell({
  title,
  subtitle,
  actions,
  children,
}: AppShellProps) {
  const user = await requireAuth();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <Sidebar />
      <div className="flex min-h-screen flex-col lg:pl-64">
        <Header
          title={title}
          subtitle={subtitle}
          actions={actions}
          userName={user.name}
        />
        <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
