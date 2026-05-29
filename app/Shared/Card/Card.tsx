import type { ReactNode } from "react";
import { cn } from "@/app/lib/ui";

type CardProps = {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
};

export default function Card({
  title,
  description,
  actions,
  children,
  className,
}: CardProps) {
  return (
    <section className={cn("rounded-lg border border-slate-200 bg-white", className)}>
      {(title || description || actions) && (
        <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {title ? (
              <h2 className="text-base font-semibold text-slate-950">{title}</h2>
            ) : null}
            {description ? (
              <p className="mt-1 text-sm text-slate-500">{description}</p>
            ) : null}
          </div>
          {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
        </div>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}
