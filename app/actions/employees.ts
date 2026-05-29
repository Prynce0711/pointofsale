"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { EMPLOYEE_ROLES, EMPLOYEE_STATUSES } from "@/app/lib/labels";
import {
  actionError,
  emptyActionState,
  enumFromForm,
  idFromForm,
  optionalString,
  requiredString,
  type ActionState,
} from "@/app/lib/validation";

export async function createEmployeeAction(
  _prevState: ActionState = emptyActionState,
  formData: FormData,
): Promise<ActionState> {
  void _prevState;
  await requireAuth();

  try {
    const firstName = requiredString(formData, "firstName");
    const lastName = requiredString(formData, "lastName");
    const role = enumFromForm(formData, "role", EMPLOYEE_ROLES);
    const email = optionalString(formData, "email");
    const phone = optionalString(formData, "phone");

    if (email) {
      const existing = await prisma.employee.findUnique({ where: { email } });
      if (existing) throw new Error("Email is already used by another employee.");
    }

    await prisma.employee.create({
      data: { firstName, lastName, role, email, phone },
    });

    revalidateEmployees();
    return { ok: true, message: "Employee saved." };
  } catch (error) {
    return actionError(error);
  }
}

export async function updateEmployeeStatusAction(formData: FormData) {
  await requireAuth();
  const id = idFromForm(formData);
  const status = enumFromForm(formData, "status", EMPLOYEE_STATUSES);

  await prisma.employee.update({
    where: { id },
    data: { status },
  });

  revalidateEmployees();
}

function revalidateEmployees() {
  revalidatePath("/employees");
  revalidatePath("/attendance");
  revalidatePath("/dashboard");
}
