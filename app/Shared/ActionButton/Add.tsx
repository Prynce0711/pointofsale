import { AnimatedLink } from "@/app/Shared/Motion/Motion";

type AddButtonProps = {
  href: string;
  children: React.ReactNode;
};

export default function AddButton({ href, children }: AddButtonProps) {
  return (
    <AnimatedLink
      href={href}
      className="inline-flex items-center justify-center rounded-xl bg-[#7a4b2c] px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-[#7a4b2c]/20 transition hover:bg-[#61361f]"
    >
      + {children}
    </AnimatedLink>
  );
}
