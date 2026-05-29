import Link from "next/link";

type EditButtonProps = {
  href: string;
  children?: React.ReactNode;
};

export default function EditButton({ href, children = "Edit" }: EditButtonProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
    >
      {children}
    </Link>
  );
}
