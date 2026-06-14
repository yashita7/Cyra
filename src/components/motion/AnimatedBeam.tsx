import { useEffect, useId, useState, type RefObject } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface AnimatedBeamProps {
  containerRef: RefObject<HTMLElement>;
  fromRef: RefObject<HTMLElement>;
  toRef: RefObject<HTMLElement>;
  active?: boolean; // glowing pulse travels when true
  curvature?: number;
  color?: string;
  activeColor?: string;
  duration?: number;
}

/**
 * Draws a curved connector between two elements inside a shared container.
 * When `active`, a bright gradient pulse travels along the path.
 * Self-contained Framer Motion implementation (no external registry needed).
 */
export function AnimatedBeam({
  containerRef,
  fromRef,
  toRef,
  active = false,
  curvature = 0,
  color = "#37475A",
  activeColor = "#FF9900",
  duration = 1.4,
}: AnimatedBeamProps) {
  const id = useId().replace(/:/g, "");
  const reduce = useReducedMotion();
  const [d, setD] = useState("");
  const [box, setBox] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const compute = () => {
      const c = containerRef.current;
      const a = fromRef.current;
      const b = toRef.current;
      if (!c || !a || !b) return;
      const cr = c.getBoundingClientRect();
      const ar = a.getBoundingClientRect();
      const br = b.getBoundingClientRect();
      const x1 = ar.left + ar.width / 2 - cr.left;
      const y1 = ar.top + ar.height / 2 - cr.top;
      const x2 = br.left + br.width / 2 - cr.left;
      const y2 = br.top + br.height / 2 - cr.top;
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2 - curvature;
      setD(`M ${x1},${y1} Q ${mx},${my} ${x2},${y2}`);
      setBox({ w: cr.width, h: cr.height });
    };
    compute();
    const ro = new ResizeObserver(compute);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", compute);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", compute);
    };
  }, [containerRef, fromRef, toRef, curvature]);

  if (!d) return null;

  return (
    <svg
      className="pointer-events-none absolute inset-0"
      width={box.w}
      height={box.h}
      fill="none"
      style={{ overflow: "visible" }}
    >
      <defs>
        <linearGradient id={`grad-${id}`} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={activeColor} stopOpacity="0" />
          <stop offset="50%" stopColor={activeColor} stopOpacity="1" />
          <stop offset="100%" stopColor="#FEBD69" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* base resting line */}
      <path
        d={d}
        stroke={color}
        strokeWidth={1.5}
        strokeOpacity={active ? 0.5 : 0.3}
        strokeLinecap="round"
      />

      {/* traveling glow pulse when active */}
      {active && !reduce && (
        <motion.path
          d={d}
          stroke={`url(#grad-${id})`}
          strokeWidth={2.5}
          strokeLinecap="round"
          initial={{ pathLength: 0.18, pathOffset: 0 }}
          animate={{ pathOffset: [0, 1] }}
          transition={{ duration, repeat: Infinity, ease: "linear" }}
          style={{ filter: `drop-shadow(0 0 4px ${activeColor})` }}
        />
      )}
      {active && reduce && (
        <path d={d} stroke={activeColor} strokeWidth={2} strokeOpacity={0.8} />
      )}
    </svg>
  );
}
