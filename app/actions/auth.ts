"use server";

import { redirect } from "next/navigation";
import {
  clearSession,
  createSession,
  ensureDefaultAdmin,
  verifyPassword,
} from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  actionError,
  emptyActionState,
  requiredString,
  type ActionState,
} from "@/lib/validation";

export async function loginAction(
  _prevState: ActionState = emptyActionState,
  formData: FormData,
): Promise<ActionState> {
  void _prevState;

  try {
    await ensureDefaultAdmin();

    const email = requiredString(formData, "email").toLowerCase();
    const password = requiredString(formData, "password");
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !verifyPassword(password, user.passwordHash)) {
      throw new Error("Invalid email or password.");
    }

    await createSession(user.id);
  } catch (error) {
    return actionError(error);
  }

  return { ok: true, message: "Login successful." };
}

export async function logoutAction() {
  await clearSession();
  redirect("/");
}


