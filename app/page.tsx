import { redirect } from "next/navigation";
import LoginPage from "@/app/Pages/Login/LoginPage";
import { getCurrentUser } from "@/app/lib/auth";

export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return <LoginPage />;
}
