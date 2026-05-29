import Link from "next/link";
import { navigationItems } from "@/app/lib/navigation";

export default function Sidebar() {
  return (
    <aside className="border-b border-slate-200 bg-slate-950 text-white lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:border-b-0">
      <div className="flex h-full flex-col">
        <div className="px-5 py-5">
          <Link href="/dashboard" className="block">
            <span className="text-lg font-semibold">Bean Counter</span>
            <span className="block text-xs text-slate-300">Cafe operations</span>
          </Link>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-4 lg:flex-col lg:overflow-visible">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto hidden border-t border-white/10 px-5 py-4 text-xs text-slate-400 lg:block">
          Inventory, sales, and attendance in one workspace.
        </div>
      </div>
    </aside>
  );
}
