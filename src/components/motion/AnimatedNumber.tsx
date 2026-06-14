import { useEffect, useRef, useState } from "react";
import {
  animate,
  useInView,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { inr, inrCompact, usd } from "@/lib/utils";

export type NumberFormat =
  | "int"
  | "currencyINR"
  | "currencyINRCompact"
  | "currencyUSD"
  | "compact"
  | "percent";

export interface AnimatedNumberProps {
  value: number;
  durationMs?: number;
  format?: NumberFormat;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

function formatValue(v: number, format: NumberFormat, decimals: number) {
  switch (format) {
    case "currencyINR":
      return inr(v);
    case "currencyINRCompact":
      return inrCompact(v);
    case "currencyUSD":
      return usd(v);
    case "compact":
      return new Intl.NumberFormat("en-US", { notation: "compact" }).format(v);
    case "percent":
      return `${v.toFixed(decimals)}%`;
    case "int":
    default:
      return new Intl.NumberFormat("en-IN", {
        maximumFractionDigits: decimals,
      }).format(v);
  }
}

/** Count-up on view; re-animates whenever `value` changes. */
export function AnimatedNumber({
  value,
  durationMs = 1200,
  format = "int",
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const mv = useMotionValue(0);
  const [display, setDisplay] = useState(() =>
    formatValue(0, format, decimals),
  );

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setDisplay(formatValue(value, format, decimals));
      return;
    }
    const controls = animate(mv, value, {
      duration: durationMs / 1000,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setDisplay(formatValue(latest, format, decimals)),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, value, durationMs, format, decimals, reduce]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
