"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { loginAction } from "@/app/actions/auth";
import { Footer, Header } from "@/components/layout";
import {
  DEFAULT_ADMIN_EMAIL,
  DEFAULT_ADMIN_PASSWORD,
} from "@/lib/auth-constants";
import { emptyActionState } from "@/lib/validation";
import SubmitButton from "@/components/ui/Form/SubmitButton";
import Failed from "@/components/ui/PopUps/Failed";

const screenTransition = { duration: 0.32, ease: "easeOut" as const };

export default function LoginPage() {
  const [state, formAction] = useActionState(loginAction, emptyActionState);
  const [isBrewing, setIsBrewing] = useState(true);
  const router = useRouter();
  const hasNavigated = useRef(false);
  const isLeaving = state.ok;

  useEffect(() => {
    const timer = window.setTimeout(() => setIsBrewing(false), 850);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!state.ok || hasNavigated.current) {
      return;
    }

    hasNavigated.current = true;
    const timer = window.setTimeout(() => {
      router.push("/dashboard");
    }, 360);

    return () => window.clearTimeout(timer);
  }, [state.ok, router]);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#FAF4EA] text-[#24150f]">
      <Header title="Welcome back" subtitle="Sign in to Bean Counter POS" />
      <main className="relative flex-1 overflow-hidden bg-[radial-gradient(circle_at_top_left,#ead9c4_0,#f8f3ea_42%,#fffaf3_100%)] px-4 py-6 sm:px-6 lg:px-10">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,250,243,0.78),rgba(247,239,227,0.58))]" />
        <AnimatePresence mode="wait">
          {isBrewing ? (
            <BrewingScreen key="brewing" />
          ) : (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={
                isLeaving
                  ? { opacity: 0, y: -8, scale: 0.98 }
                  : { opacity: 1, y: 0, scale: 1 }
              }
              exit={{ opacity: 0 }}
              transition={{ duration: 0.36, ease: "easeOut" }}
              className="relative mx-auto grid h-full w-full max-w-6xl items-center gap-5 lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)]"
            >
            <motion.section
              initial={{ opacity: 0, x: -18, y: 8 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ ...screenTransition, delay: 0.04 }}
              className="relative overflow-hidden rounded-3xl border border-[#E6D2BC] bg-[#FFFAF3]/92 p-5 shadow-[var(--shadow-soft)] backdrop-blur sm:p-6"
            >
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#2c1810] via-[#c9823a] to-[#ead9c4]" />
              <div className="mb-6">
                <p className="text-sm font-semibold uppercase tracking-wide text-[#c9823a]">
                  Coffee Shop POS
                </p>
                <h1 className="font-display mt-2 text-3xl font-semibold text-[#2c1810]">
                  Sign in to Bean Counter
                </h1>
                <p className="mt-2 text-sm leading-6 text-[#7b6254]">
                  Open the dashboard, POS, inventory, reports, and attendance
                  workspace for your coffee shop.
                </p>
              </div>

              <form action={formAction} className="grid gap-4">
                <Failed message={state.ok ? "" : state.message} />

                <label className="grid gap-1 text-sm font-medium text-[#4b2f22]">
                  Email
                  <input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    defaultValue={DEFAULT_ADMIN_EMAIL}
                    className="coffee-focus rounded-2xl border border-[#d8bf9f] bg-white/80 px-3 py-2.5 text-[#2c1810]"
                  />
                </label>

                <label className="grid gap-1 text-sm font-medium text-[#4b2f22]">
                  Password
                  <input
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    defaultValue={DEFAULT_ADMIN_PASSWORD}
                    className="coffee-focus rounded-2xl border border-[#d8bf9f] bg-white/80 px-3 py-2.5 text-[#2c1810]"
                  />
                </label>

                <SubmitButton pendingLabel="Signing in..." className="w-full py-3">
                  Sign in
                </SubmitButton>
              </form>


            </motion.section>

            <motion.aside
              initial={{ opacity: 0, x: 18, y: 8 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ ...screenTransition, delay: 0.1 }}
              className="relative min-h-[280px] overflow-hidden rounded-3xl border border-[#E6D2BC] bg-[#5A3825] p-5 text-[#FFFAF3] shadow-[var(--shadow-soft)] sm:min-h-[360px] sm:p-6"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(250,244,234,0.22),transparent_34%),linear-gradient(135deg,rgba(90,56,37,0.94),rgba(44,24,16,0.96))]" />
              <div className="relative flex h-full flex-col justify-between gap-8">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-[#d7a260]">
                      Coffee Moments
                    </p>
                    <h2 className="font-display mt-2 max-w-md text-3xl font-semibold leading-tight sm:text-4xl">
                      A calm, cozy pour for every shift.
                    </h2>
                    <p className="mt-3 max-w-md text-sm text-[#ead9c4]">
                      Warm aroma, soft textures, and a gentle start to the day.
                    </p>
                  </div>
                  <CoffeeMark compact />
                </div>

                <div className="flex flex-wrap gap-2">
                  {[
                    "Aroma",
                    "Balance",
                    "Comfort",
                    "Slow Brew",
                    "Cafe Ritual",
                  ].map((label) => (
                    <span
                      key={label}
                      className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#ead9c4]"
                    >
                      {label}
                    </span>
                  ))}
                </div>

                <div className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <p className="text-sm font-semibold uppercase tracking-wide text-[#d7a260]">
                    Coffee Ritual
                  </p>
                  <p className="mt-2 text-xl font-semibold">Sip. Savor. Reset.</p>
                  <p className="mt-2 text-sm text-[#ead9c4]">
                    A quiet pause between rushes, with coffee that feels like
                    home.
                  </p>
                </div>
              </div>
            </motion.aside>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

function BrewingScreen() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -8 }}
      transition={screenTransition}
      className="relative grid min-h-[calc(100vh-12rem)] place-items-center"
    >
      <div className="grid justify-items-center gap-5 text-center">
        <CoffeeMark />
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: 0.08, ease: "easeOut" }}
            className="text-2xl font-semibold text-[#2c1810]"
          >
            Brewing your workspace...
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: 0.16, ease: "easeOut" }}
            className="mt-2 text-sm text-[#7b6254]"
          >
            Preparing Bean Counter POS
          </motion.p>
        </div>
      </div>
    </motion.section>
  );
}

function CoffeeMark({ compact = false }: { compact?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.32, ease: "easeOut" }}
      className={compact ? "relative h-20 w-20" : "relative h-28 w-28"}
      aria-hidden="true"
    >
      <div className="absolute left-1/2 top-0 flex -translate-x-1/2 gap-1">
        {[0, 1, 2].map((item) => (
          <motion.span
            key={item}
            animate={{ opacity: [0, 0.8, 0], y: [10, -2, -16] }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              delay: item * 0.22,
              ease: "easeOut",
            }}
            className="h-8 w-1.5 rounded-full bg-[#c9823a]/70"
          />
        ))}
      </div>
      <div
        className={`absolute bottom-4 left-1/2 -translate-x-1/2 rounded-b-3xl rounded-t-xl border border-[#E6D2BC] bg-[#FFFAF3] shadow-[0_18px_40px_rgba(61,35,21,0.16)] ${
          compact ? "h-12 w-14" : "h-16 w-20"
        }`}
      >
        <div
          className={`absolute right-0 top-3 translate-x-1/2 rounded-full border-4 border-[#FFFAF3] ${
            compact ? "h-7 w-7" : "h-9 w-9"
          }`}
        />
        <div className="absolute inset-x-3 top-3 h-2 rounded-full bg-[#d7a260]" />
      </div>
      <div
        className={`absolute bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-[#8B5A35]/20 ${
          compact ? "h-2 w-16" : "h-3 w-24"
        }`}
      />
    </motion.div>
  );
}

function CafeStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur">
      <p className="text-xs uppercase tracking-wide text-[#d7a260]">{label}</p>
      <p className="mt-1 text-sm font-semibold text-[#FFFAF3]">{value}</p>
    </div>
  );
}

