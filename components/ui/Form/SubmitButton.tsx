"use client";

import { useFormStatus } from "react-dom";
import { AnimatedButton } from "@/components/ui/Motion/Motion";

type SubmitButtonProps = {
  children: React.ReactNode;
  pendingLabel?: string;
  variant?: "primary" | "secondary" | "danger";
  className?: string;
};

const variants = {
  primary:
    "bg-[#7a4b2c] text-white shadow-sm shadow-[#7a4b2c]/20 hover:bg-[#61361f] disabled:bg-[#d9c3aa]",
  secondary:
    "border border-[#d8bf9f] bg-white/75 text-[#4b2f22] hover:bg-[#fff8ef] disabled:text-[#b79f8d]",
  danger:
    "border border-rose-200 bg-white/75 text-rose-700 hover:bg-rose-50 disabled:text-rose-300",
};

export default function SubmitButton({
  children,
  pendingLabel = "Saving...",
  variant = "primary",
  className = "",
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <AnimatedButton
      type="submit"
      disabled={pending}
      className={`inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {pending ? pendingLabel : children}
    </AnimatedButton>
  );
}

