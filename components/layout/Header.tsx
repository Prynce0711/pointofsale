"use client";

import { logoutAction } from "@/app/actions/auth";
import { AnimatedButton } from "@/components/ui/Motion/Motion";

type HeaderProps = {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  userName?: string;
};

export default function Header({ title, subtitle, actions, userName }: HeaderProps) {
  return (
    <header className="relative flex flex-col gap-4 overflow-hidden border-b border-[#ead8c5] bg-[#fffaf3]/92 px-5 py-5 shadow-[0_18px_40px_rgba(61,35,21,0.08)] backdrop-blur lg:flex-row lg:items-center lg:justify-between">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#2c1810] via-[#c9823a] to-[#ead9c4]" />
      <div>
        <p className="font-display text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#c9823a]">
          Coffee Shop POS
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-[#2c1810] sm:text-3xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-1 text-sm text-[#7b6254] sm:text-[0.95rem]">
            {subtitle}
          </p>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {actions}
        {userName ? (
          <>
            <span className="rounded-2xl border border-[#ead8c5] bg-[#f7ead8] px-3 py-2 text-sm font-medium text-[#4b2f22]">
              {userName}
            </span>
            <form action={logoutAction}>
              <AnimatedButton
                type="submit"
                className="rounded-2xl border border-[#d8bf9f] bg-white/80 px-3 py-2 text-sm font-semibold text-[#4b2f22] transition hover:bg-[#fff4e6]"
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

