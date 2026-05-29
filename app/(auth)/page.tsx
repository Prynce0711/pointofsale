import { redirect } from "next/navigation";
import LoginPage from "@/app/Pages/Login/LoginPage";
import { getCurrentUser } from "@/app/lib/auth";
import PageTransition from "@/components/PageTransition";

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
