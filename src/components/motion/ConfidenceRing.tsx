import { useEffect, useRef, useState } from "react";
import {
  animate,
  useInView,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import { cn } from "@/lib/utils";

export interface ConfidenceRingProps {
  value: number; // 0–100
  size?: number;
  label?: string;
  sublabel?: string;
  color?: string; // defaults: orange, or success if value >= 90
  durationMs?: number;
  className?: string;
}

/** Animated circular progress (SVG). */
export function ConfidenceRing({
  value,
  size = 96,
  label,
  sublabel,
  color,
  durationMs = 900,
  className,
}: ConfidenceRingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  const reduce = useReducedMotion();
  const mv = useMotionValue(0);
  const [pct, setPct] = useState(0);

  const stroke = Math.max(6, Math.round(size * 0.08));
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const ringColor = color ?? (value >= 90 ? "#2BB673" : "#FF9900");

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setPct(value);
      return;
    }
    const controls = animate(mv, value, {
      duration: durationMs / 1000,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setPct(v),
    });
    return () => controls.stop();
  }, [inView, value, durationMs, reduce, mv]);

  const offset = circ - (pct / 100) * circ;

  return (
    <div
      ref={ref}
      className={cn("relative inline-flex flex-col items-center", className)}
      style={{ width: size }}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#37475A"
            strokeOpacity={0.5}
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={ringColor}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ filter: `drop-shadow(0 0 6px ${ringColor}66)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-semibold tabular-nums"
            style={{ fontSize: size * 0.26, color: ringColor }}
          >
            {Math.round(pct)}
            <span style={{ fontSize: size * 0.13 }}>%</span>
          </span>
        </div>
      </div>
      {label && (
        <span className="mt-2 text-sm font-medium text-white">{label}</span>
      )}
      {sublabel && (
        <span className="text-[11px] text-muted/70">{sublabel}</span>
      )}
    </div>
  );
}
