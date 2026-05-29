import { AnimatedButton } from "@/app/Shared/Motion/Motion";

type DeleteButtonProps = {
  children?: React.ReactNode;
};

export default function DeleteButton({ children = "Delete" }: DeleteButtonProps) {
  return (
    <AnimatedButton
      type="submit"
      className="inline-flex items-center justify-center rounded-xl border border-rose-200 bg-white/70 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50"
    >
      {children}
    </AnimatedButton>
  );
}
