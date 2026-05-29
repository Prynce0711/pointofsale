import Header from "./Header";
import { requireAuth } from "@/app/lib/auth";
import PageTransition from "@/components/PageTransition";

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
    <>
      <Header
        title={title}
        subtitle={subtitle}
        actions={actions}
        userName={user.name}
      />
      <main className="flex-1 bg-transparent px-4 py-5 sm:px-6 lg:px-8">
        <PageTransition>{children}</PageTransition>
      </main>
    </>
  );
}
