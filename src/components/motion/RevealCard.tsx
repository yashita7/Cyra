import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

export interface RevealCardProps {
  delayMs?: number;
  index?: number;
  className?: string;
  children: React.ReactNode;
  /** disable the viewport gate (animate immediately) */
  immediate?: boolean;
}

/** Fade + slide up, with stagger support via `index`. */
export function RevealCard({
  delayMs = 0,
  index = 0,
  className,
  children,
  immediate = false,
}: RevealCardProps) {
  const reduce = useReducedMotion();
  const delay = (delayMs + index * 80) / 1000;

  const variants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 18, filter: "blur(6px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.42, delay, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      {...(immediate
        ? { animate: "show" }
        : { whileInView: "show", viewport: { once: true, margin: "-40px" } })}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
