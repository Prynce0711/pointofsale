"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationItems } from "@/lib/navigation";
import { cn } from "@/lib/ui";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-b border-[#ead8c5] bg-[#2c1810] text-white shadow-[0_20px_60px_rgba(44,24,16,0.18)] lg:fixed lg:inset-y-0 lg:left-0 lg:w-72 lg:border-b-0">
      <div className="flex h-full flex-col">
        <div className="px-5 py-5">
          <Link href="/dashboard" className="block">

            <span className="font-display mt-3 block text-lg font-semibold tracking-[0.02em]">
              Bean Counter
            </span>
            <span className="block text-xs uppercase tracking-[0.2em] text-[#d8bf9f]">
              Cafe operations suite
            </span>
          </Link>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-4 lg:flex-col lg:overflow-visible">
          {navigationItems.map((item) => (
            <div key={item.href} className="shrink-0 lg:shrink">
              <Link
                href={item.href}
                className={cn(
                  "block whitespace-nowrap rounded-2xl px-3 py-2.5 text-sm font-medium tracking-[0.01em] text-[#ead8c5] transition hover:bg-white/10 hover:text-white",
                  pathname === item.href &&
                    "bg-[#fff8ef] text-[#2c1810] shadow-sm hover:bg-[#fff8ef] hover:text-[#2c1810]",
                )}
              >
                {item.label}
              </Link>
            </div>
          ))}
        </nav>
        <div className="mx-4 mt-auto hidden rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-xs text-[#d8bf9f] lg:mb-4 lg:block">
          <p className="font-semibold text-white">Today&apos;s focus</p>
          <p className="mt-1">Fast checkout, clean stock, and steady staff coverage.</p>
        </div>
      </div>
    </aside>
  );
}

