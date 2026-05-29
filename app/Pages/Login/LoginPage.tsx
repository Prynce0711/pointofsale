"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/actions/auth";
import {
  DEFAULT_ADMIN_EMAIL,
  DEFAULT_ADMIN_PASSWORD,
} from "@/app/lib/auth-constants";
import { emptyActionState } from "@/app/lib/validation";
import Failed from "@/app/Shared/PopUps/Failed";
import SubmitButton from "@/app/Shared/Form/SubmitButton";

export default function LoginPage() {
  const [state, formAction] = useActionState(loginAction, emptyActionState);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
            Coffee Shop POS
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-950">
            Sign in to Bean Counter
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Use your cafe account to open the dashboard, POS, inventory, and
            attendance modules.
          </p>
        </div>

        <form action={formAction} className="grid gap-4">
          <Failed message={state.ok ? "" : state.message} />

          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Email
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              defaultValue={DEFAULT_ADMIN_EMAIL}
              className="rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </label>

          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Password
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              defaultValue={DEFAULT_ADMIN_PASSWORD}
              className="rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </label>

          <SubmitButton pendingLabel="Signing in..." className="w-full">
            Sign in
          </SubmitButton>
        </form>

        <p className="mt-5 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-900">
          First run account: {DEFAULT_ADMIN_EMAIL} / {DEFAULT_ADMIN_PASSWORD}.
          Change this before real use.
        </p>
      </section>
    </main>
  );
}
