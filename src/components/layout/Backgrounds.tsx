import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Hero background: animated Amazon-tinted beams over a faint grid.
 * Low-key on purpose — it must never fight the foreground content.
 */
export function BeamsBackground({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const beams = [
    { left: "12%", color: "#FF9900", delay: 0, dur: 7 },
    { left: "34%", color: "#00A8E1", delay: 1.5, dur: 9 },
    { left: "58%", color: "#FF9900", delay: 0.8, dur: 8 },
    { left: "78%", color: "#146EB4", delay: 2.2, dur: 10 },
  ];

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
      aria-hidden
    >
      <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      {!reduce &&
        beams.map((b, i) => (
          <motion.span
            key={i}
            className="absolute top-[-20%] h-[60%] w-px"
            style={{
              left: b.left,
              background: `linear-gradient(to bottom, transparent, ${b.color}, transparent)`,
              boxShadow: `0 0 24px 1px ${b.color}`,
            }}
            initial={{ y: "-40%", opacity: 0 }}
            animate={{ y: "180%", opacity: [0, 0.7, 0] }}
            transition={{
              duration: b.dur,
              delay: b.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      {/* central glow */}
      <div className="absolute left-1/2 top-1/3 h-[420px] w-[620px] -translate-x-1/2 rounded-full bg-orange/10 blur-[120px]" />
      <div className="absolute left-1/3 top-1/2 h-[320px] w-[420px] rounded-full bg-sky/10 blur-[120px]" />
    </div>
  );
}

/** Subtle dotted backdrop for interior screens. */
export function DotBackdrop({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 bg-dots opacity-[0.5] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]",
        className,
      )}
      aria-hidden
    />
  );
}
