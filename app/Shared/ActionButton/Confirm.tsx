import { AnimatedButton } from "@/app/Shared/Motion/Motion";

type ConfirmButtonProps = {
  children: React.ReactNode;
  disabled?: boolean;
};

export default function ConfirmButton({ children, disabled }: ConfirmButtonProps) {
  return (
    <AnimatedButton
      type="submit"
      disabled={disabled}
      className="inline-flex items-center justify-center rounded-xl bg-[#7a4b2c] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#61361f] disabled:cursor-not-allowed disabled:bg-[#d9c3aa]"
    >
      {children}
    </AnimatedButton>
  );
}
