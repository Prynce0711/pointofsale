type DeleteButtonProps = {
  children?: React.ReactNode;
};

export default function DeleteButton({ children = "Delete" }: DeleteButtonProps) {
  return (
    <button
      type="submit"
      className="inline-flex items-center justify-center rounded-md border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50"
    >
      {children}
    </button>
  );
}
