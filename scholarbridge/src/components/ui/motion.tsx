"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 16, scale: 0.97 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView={shouldReduceMotion ? undefined : "show"}
      viewport={{ once: true, amount: 0.08 }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  layout = false,
  exitOnRemove = false,
  hoverLift = true,
}: {
  children: ReactNode;
  className?: string;
  layout?: boolean;
  exitOnRemove?: boolean;
  hoverLift?: boolean;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={shouldReduceMotion ? undefined : itemVariants}
      layout={layout ? "position" : undefined}
      exit={
        exitOnRemove && !shouldReduceMotion
          ? { opacity: 0, y: -8, scale: 0.98 }
          : undefined
      }
      whileHover={
        shouldReduceMotion || !hoverLift ? undefined : { y: -3, scale: 1.01 }
      }
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
