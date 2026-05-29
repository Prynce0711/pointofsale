"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { startOfToday } from "@/lib/format";
import {
  actionError,
  emptyActionState,
  idFromForm,
  optionalString,
  type ActionState,
} from "@/lib/validation";

export async function timeInAction(
  _prevState: ActionState = emptyActionState,
  formData: FormData,
): Promise<ActionState> {
  void _prevState;
  await requireAuth();

  try {
    const employeeId = idFromForm(formData, "employeeId");
    const now = new Date();
    const today = startOfToday();
    const status = isLate(now) ? "LATE" : "PRESENT";

    await prisma.$transaction(async (tx) => {
      const employee = await tx.employee.findUnique({ where: { id: employeeId } });

      if (!employee || employee.status !== "ACTIVE") {
        throw new Error("Employee is not active.");
      }

      const existing = await tx.attendance.findUnique({
        where: { employeeId_date: { employeeId, date: today } },
      });

      if (existing?.timeIn) {
        throw new Error("This employee already timed in today.");
      }

      await tx.attendance.upsert({
        where: { employeeId_date: { employeeId, date: today } },
        create: {
          employeeId,
          date: today,
          timeIn: now,
          status,
          notes: optionalString(formData, "notes"),
        },
        update: {
          timeIn: now,
          status,
          notes: optionalString(formData, "notes"),
        },
      });
    });

    revalidateAttendance();
    return { ok: true, message: "Time in recorded." };
  } catch (error) {
    return actionError(error);
  }
}

export async function timeOutAction(
  _prevState: ActionState = emptyActionState,
  formData: FormData,
): Promise<ActionState> {
  void _prevState;
  await requireAuth();

  try {
    const employeeId = idFromForm(formData, "employeeId");
    const today = startOfToday();

    const attendance = await prisma.attendance.findUnique({
      where: { employeeId_date: { employeeId, date: today } },
    });

    if (!attendance?.timeIn) {
      throw new Error("Record a time in before time out.");
    }

    if (attendance.timeOut) {
      throw new Error("This employee already timed out today.");
    }

    await prisma.attendance.update({
      where: { id: attendance.id },
      data: { timeOut: new Date() },
    });

    revalidateAttendance();
    return { ok: true, message: "Time out recorded." };
  } catch (error) {
    return actionError(error);
  }
}

export async function markAbsentAction(
  _prevState: ActionState = emptyActionState,
  formData: FormData,
): Promise<ActionState> {
  void _prevState;
  await requireAuth();

  try {
    const employeeId = idFromForm(formData, "employeeId");
    const today = startOfToday();

    await prisma.attendance.upsert({
      where: { employeeId_date: { employeeId, date: today } },
      create: {
        employeeId,
        date: today,
        status: "ABSENT",
        notes: optionalString(formData, "notes"),
      },
      update: {
        status: "ABSENT",
        timeIn: null,
        timeOut: null,
        notes: optionalString(formData, "notes"),
      },
    });

    revalidateAttendance();
    return { ok: true, message: "Absent status recorded." };
  } catch (error) {
    return actionError(error);
  }
}

function isLate(value: Date) {
  const threshold = new Date(value);
  threshold.setHours(9, 15, 0, 0);
  return value > threshold;
}

function revalidateAttendance() {
  revalidatePath("/attendance");
  revalidatePath("/dashboard");
}

