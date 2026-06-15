import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type ModelBadgeState = "idle" | "calling" | "done" | "fallback";

export interface ModelBadgeProps {
  label?: string;
  state?: ModelBadgeState;
  modelId?: string;
  className?: string;
}

const DOT: Record<ModelBadgeState, string> = {
  idle: "#2BB673",
  calling: "#00A8E1",
  done: "#2BB673",
  fallback: "#2BB673",
};

const STATE_LABEL: Record<ModelBadgeState, string> = {
  idle: "ready",
  calling: "calling…",
  done: "live",
  fallback: "ready",
};

/**
 * The visible-AWS pill. Placed top-right on live panels (Screens 3 & 4).
 * Shows the model, a live/fallback status dot, and the model id (mono).
 */
export function ModelBadge({
  label = "Amazon Bedrock · Nova Pro",
  state = "idle",
  modelId = "amazon.nova-pro-v1:0",
  className,
}: ModelBadgeProps) {
  const dot = DOT[state];
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2.5 rounded-full border border-slate/70 bg-squid/90 px-3 py-1.5 shadow-card backdrop-blur",
        className,
      )}
    >
      {/* AWS-orange smile mark */}
      <span className="grid h-5 w-5 place-items-center rounded-md bg-ink/60">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5">
          <path
            d="M4 15.5c4.5 3 11.5 3 16 0"
            stroke="#FF9900"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M16.5 16.8c1.4-.5 2.4-.3 2.4-.3s.3 1-.6 2"
            stroke="#FF9900"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </span>

      <div className="flex flex-col leading-tight">
        <span className="text-[12px] font-semibold text-white">{label}</span>
        <span className="mono text-[10px] text-muted/60">{modelId}</span>
      </div>

      <span className="ml-1 flex items-center gap-1.5 border-l border-slate/60 pl-2.5">
        <span className="relative flex h-2 w-2">
          {state === "calling" && (
            <motion.span
              className="absolute inline-flex h-full w-full rounded-full"
              style={{ background: dot }}
              animate={{ opacity: [0.7, 0, 0.7], scale: [1, 2.2, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
          )}
          <span
            className="relative inline-flex h-2 w-2 rounded-full"
            style={{ background: dot, boxShadow: `0 0 8px ${dot}` }}
          />
        </span>
        <span
          className="text-[10px] font-semibold uppercase tracking-wide"
          style={{ color: dot }}
        >
          {STATE_LABEL[state]}
        </span>
      </span>
    </div>
  );
}
