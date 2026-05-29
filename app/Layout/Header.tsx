"use client";

import { logoutAction } from "@/app/actions/auth";
import { AnimatedButton } from "@/app/Shared/Motion/Motion";

type HeaderProps = {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  userName?: string;
};

export default function Header({ title, subtitle, actions, userName }: HeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-[#ead8c5] bg-[#fffaf3]/90 px-5 py-4 backdrop-blur lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-[#c9823a]">
          Coffee Shop POS
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-[#2c1810]">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-[#7b6254]">{subtitle}</p> : null}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {actions}
        {userName ? (
          <>
            <span className="rounded-xl bg-[#f3e6d5] px-3 py-2 text-sm font-medium text-[#4b2f22]">
              {userName}
            </span>
            <form action={logoutAction}>
              <AnimatedButton
                type="submit"
                className="rounded-xl border border-[#d8bf9f] bg-white/70 px-3 py-2 text-sm font-semibold text-[#4b2f22] hover:bg-[#fff8ef]"
              >
                Sign out
              </AnimatedButton>
            </form>
          </>
        ) : null}
      </div>
    </header>
  );
}
