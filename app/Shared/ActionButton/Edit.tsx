import { AnimatedLink } from "@/app/Shared/Motion/Motion";

type EditButtonProps = {
  href: string;
  children?: React.ReactNode;
};

export default function EditButton({ href, children = "Edit" }: EditButtonProps) {
  return (
    <AnimatedLink
      href={href}
      className="inline-flex items-center justify-center rounded-xl border border-[#d8bf9f] bg-white/70 px-3 py-2 text-sm font-medium text-[#4b2f22] transition hover:bg-[#fff8ef]"
    >
      {children}
    </AnimatedLink>
  );
}
