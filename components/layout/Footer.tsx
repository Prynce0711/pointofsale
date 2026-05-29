"use client";

export default function Footer() {
  return (
    <footer className="relative border-t border-[#ead8c5] bg-[#fffaf3]/90 px-5 py-4 text-xs text-[#8a6b58]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ead9c4] to-transparent" />
      <div className="flex flex-col gap-2 text-[0.7rem] uppercase tracking-[0.24em] text-[#c9823a] sm:flex-row sm:items-center sm:justify-between">
        <span className="font-display">Bean Counter POS</span>
        <span className="text-[0.68rem] text-[#8a6b58] normal-case tracking-normal">
          Local cafe operations powered by SQLite and Prisma.
        </span>
      </div>
    </footer>
  );
}

