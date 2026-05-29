import { logoutAction } from "@/app/actions/auth";

type HeaderProps = {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  userName?: string;
};

export default function Header({ title, subtitle, actions, userName }: HeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-slate-200 bg-white px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
          Coffee Shop POS
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-950">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {actions}
        {userName ? (
          <>
            <span className="rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">
              {userName}
            </span>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Sign out
              </button>
            </form>
          </>
        ) : null}
      </div>
    </header>
  );
}
