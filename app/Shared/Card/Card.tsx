import type { ReactNode } from "react";
import { cn } from "@/app/lib/ui";
import { AnimatedCard } from "@/app/Shared/Motion/Motion";

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
    <AnimatedCard
      className={cn(
        "overflow-hidden rounded-3xl border border-[var(--color-coffee-border)] bg-[var(--color-soft-white)] shadow-[var(--shadow-card)]",
        className,
      )}
    >
      {(title || description || actions) && (
        <div className="flex flex-col gap-3 border-b border-[#ead8c5] bg-white/45 px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {title ? (
              <h2 className="text-base font-semibold text-[#2c1810]">{title}</h2>
            ) : null}
            {description ? (
              <p className="mt-1 text-sm text-[#7b6254]">{description}</p>
            ) : null}
          </div>
          {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
        </div>
      )}
      <div className="p-5">{children}</div>
    </AnimatedCard>
  );
}
