type ConfirmButtonProps = {
  children: React.ReactNode;
  disabled?: boolean;
};

export default function ConfirmButton({ children, disabled }: ConfirmButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="inline-flex items-center justify-center rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
    >
      {children}
    </button>
  );
}
