import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Status } from "@/data/types";

export interface StatusPillProps {
  status: Status;
  pulse?: boolean;
  className?: string;
}

const CONFIG: Record<
  Status,
  { label: string; dot: string; text: string; bg: string; border: string }
> = {
  queued: { label: "Queued", dot: "bg-slate", text: "text-muted", bg: "bg-slate/15", border: "border-slate/50" },
  grading: { label: "Grading", dot: "bg-sky", text: "text-sky", bg: "bg-sky/10", border: "border-sky/40" },
  deciding: { label: "Deciding", dot: "bg-orange", text: "text-orange", bg: "bg-orange/10", border: "border-orange/40" },
  listed: { label: "Listed", dot: "bg-link", text: "text-link", bg: "bg-link/10", border: "border-link/40" },
  saved: { label: "Saved", dot: "bg-success", text: "text-success", bg: "bg-success/10", border: "border-success/40" },
  flagged: { label: "Flagged", dot: "bg-danger", text: "text-danger", bg: "bg-danger/10", border: "border-danger/40" },
};

/** Animated status chip; transitions when `status` changes. */
export function StatusPill({ status, pulse = false, className }: StatusPillProps) {
  const c = CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
        c.bg,
        c.border,
        c.text,
        className,
      )}
    >
      <span className="relative flex h-1.5 w-1.5">
        {pulse && (
          <span
            className={cn(
              "absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping",
              c.dot,
            )}
          />
        )}
        <span className={cn("relative inline-flex h-1.5 w-1.5 rounded-full", c.dot)} />
      </span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={status}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
        >
          {c.label}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
