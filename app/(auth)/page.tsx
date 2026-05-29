import { redirect } from "next/navigation";
import LoginPage from "@/features/auth/components/LoginPage";
import { getCurrentUser } from "@/lib/auth";
import PageTransition from "@/components/common/PageTransition";

export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <PageTransition>
      <LoginPage />
    </PageTransition>
  );
}

