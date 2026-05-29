import Link from "next/link";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  basePath: string;
};

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <Link
        href={`${basePath}?page=${Math.max(1, currentPage - 1)}`}
        className="rounded-md border border-slate-300 px-3 py-2 text-slate-700 aria-disabled:pointer-events-none aria-disabled:opacity-40"
        aria-disabled={currentPage <= 1}
      >
        Previous
      </Link>
      <span className="text-slate-500">
        Page {currentPage} of {totalPages}
      </span>
      <Link
        href={`${basePath}?page=${Math.min(totalPages, currentPage + 1)}`}
        className="rounded-md border border-slate-300 px-3 py-2 text-slate-700 aria-disabled:pointer-events-none aria-disabled:opacity-40"
        aria-disabled={currentPage >= totalPages}
      >
        Next
      </Link>
    </div>
  );
}
