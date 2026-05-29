"use client";

import { useActionState } from "react";
import { createEmployeeAction } from "@/app/actions/employees";
import { EMPLOYEE_ROLES, employeeRoleLabels } from "@/app/lib/labels";
import { emptyActionState } from "@/app/lib/validation";
import Failed from "@/app/Shared/PopUps/Failed";
import SubmitButton from "@/app/Shared/Form/SubmitButton";
import Success from "@/app/Shared/PopUps/Success";

export default function EmployeeForm() {
  const [state, formAction] = useActionState(createEmployeeAction, emptyActionState);

  return (
    <form action={formAction} className="grid gap-4">
      {state.ok ? <Success message={state.message} /> : <Failed message={state.message} />}
      <div className="grid gap-4 md:grid-cols-2">
        <input
          name="firstName"
          required
          placeholder="First name"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950"
        />
        <input
          name="lastName"
          required
          placeholder="Last name"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950"
        />
        <select
          name="role"
          defaultValue="BARISTA"
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950"
        >
          {EMPLOYEE_ROLES.map((role) => (
            <option key={role} value={role}>
              {employeeRoleLabels[role]}
            </option>
          ))}
        </select>
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950"
        />
        <input
          name="phone"
          placeholder="Phone"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 md:col-span-2"
        />
      </div>
      <SubmitButton>Add employee</SubmitButton>
    </form>
  );
}

