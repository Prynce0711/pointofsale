import Link from "next/link";

type AddButtonProps = {
  href: string;
  children: React.ReactNode;
};

export default function AddButton({ href, children }: AddButtonProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
    >
      + {children}
    </Link>
  );
}
