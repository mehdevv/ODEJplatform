import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import {
  fadeIn,
  fadeInUp,
  pageTransition,
  staggerContainer,
  staggerItem,
} from "@/lib/motion";
import type { ReactNode } from "react";

type MotionDivProps = HTMLMotionProps<"div">;

/** Scroll-triggered fade-in-up */
export function FadeIn({
  children,
  className,
  delay = 0,
  ...props
}: MotionDivProps & { delay?: number }) {
  const reduced = useReducedMotion();
  if (reduced) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={fadeInUp}
      transition={{ delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/** Simple opacity fade */
export function Fade({
  children,
  className,
  ...props
}: MotionDivProps) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-24px" }}
      variants={fadeIn}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/** Stagger children on scroll */
export function Stagger({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-48px" }}
      variants={staggerContainer}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} variants={staggerItem}>
      {children}
    </motion.div>
  );
}

/** Page route transition wrapper */
export function PageMotion({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
    >
      {children}
    </motion.div>
  );
}

/** Subtle hover lift for cards */
export function MotionCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.99 }}
    >
      {children}
    </motion.div>
  );
}

export { motion };
