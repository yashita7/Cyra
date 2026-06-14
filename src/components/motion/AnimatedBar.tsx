import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface AnimatedBarProps {
  value: number;
  max: number;
  label?: string;
  valueLabel?: string;
  color?: string; // any CSS color; defaults to orange
  delayMs?: number;
  highlighted?: boolean; // winner glow
  className?: string;
}

/** Horizontal bar that fills to its share of `max` on view. */
export function AnimatedBar({
  value,
  max,
  label,
  valueLabel,
  color = "#FF9900",
  delayMs = 0,
  highlighted = false,
  className,
}: AnimatedBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  const reduce = useReducedMotion();
  const pct = max <= 0 ? 0 : Math.max(0, Math.min(100, (value / max) * 100));

  return (
    <div ref={ref} className={cn("group", className)}>
      <div className="mb-1.5 flex items-baseline justify-between">
        <span
          className={cn(
            "text-sm font-medium transition-colors",
            highlighted ? "text-white" : "text-muted",
          )}
        >
          {label}
        </span>
        <span
          className={cn(
            "mono text-[13px] font-semibold tabular-nums",
            highlighted ? "text-orange" : "text-muted",
          )}
        >
          {valueLabel}
        </span>
      </div>
      <div
        className={cn(
          "relative h-3 w-full overflow-hidden rounded-full bg-slate/30",
          highlighted && "ring-1 ring-orange/40",
        )}
      >
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: highlighted
              ? `linear-gradient(90deg, ${color}, #FEBD69)`
              : color,
            boxShadow: highlighted ? `0 0 18px -2px ${color}` : "none",
          }}
          initial={{ width: reduce ? `${pct}%` : 0 }}
          animate={inView ? { width: `${pct}%` } : {}}
          transition={{
            duration: 0.9,
            delay: delayMs / 1000,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {highlighted && (
            <span className="absolute inset-0 overflow-hidden rounded-full">
              <span className="absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/30 blur-sm animate-shimmer" />
            </span>
          )}
        </motion.div>
      </div>
    </div>
  );
}
