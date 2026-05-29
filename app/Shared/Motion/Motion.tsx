"use client";

import Link from "next/link";
import { motion, type HTMLMotionProps, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/app/lib/ui";

const smoothEase = [0.22, 1, 0.36, 1] as const;

export const pageVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: smoothEase },
  },
} satisfies Variants;

export const cardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.985 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.28, ease: smoothEase },
  },
} satisfies Variants;

export const rowVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.22, ease: "easeOut" as const },
  },
} satisfies Variants;

type AnimatedProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function AnimatedPage({ children, className }: AnimatedProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedCard({ children, className, delay = 0 }: AnimatedProps) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={{
        ...cardVariants,
        visible: {
          ...cardVariants.visible,
          transition: { ...cardVariants.visible.transition, delay },
        },
      }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

export function AnimatedList({ children, className }: AnimatedProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.045 } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedItem({ children, className }: AnimatedProps) {
  return (
    <motion.div variants={cardVariants} className={className}>
      {children}
    </motion.div>
  );
}

export function AnimatedRow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.tr
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-20px" }}
      variants={rowVariants}
      className={className}
    >
      {children}
    </motion.tr>
  );
}

export function AnimatedButton({
  children,
  className,
  ...props
}: HTMLMotionProps<"button"> & { children: ReactNode }) {
  return (
    <motion.button
      whileHover={!props.disabled ? { y: -1, scale: 1.01 } : undefined}
      whileTap={!props.disabled ? { scale: 0.98 } : undefined}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export function AnimatedLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.span
      whileHover={{ y: -1, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
      className="inline-flex"
    >
      <Link href={href} className={className}>
        {children}
      </Link>
    </motion.span>
  );
}

export function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <motion.div
      aria-hidden="true"
      animate={{ opacity: [0.45, 1, 0.45] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      className={cn("rounded-xl bg-amber-100/70", className)}
    />
  );
}
