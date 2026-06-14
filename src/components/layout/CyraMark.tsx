import { cn } from "@/lib/utils";

/** Cyra wordmark glyph — a recycling-loop "C" in Amazon orange. */
export function CyraMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn(className)} aria-hidden>
      <defs>
        <linearGradient id="cyra-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF9900" />
          <stop offset="100%" stopColor="#FEBD69" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="15" fill="#232F3E" stroke="#37475A" />
      <path
        d="M22 11.5a8 8 0 1 0 1.5 7"
        fill="none"
        stroke="url(#cyra-g)"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M22 8.2v3.6h-3.6"
        fill="none"
        stroke="url(#cyra-g)"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="16" r="2.4" fill="#FF9900" />
    </svg>
  );
}
