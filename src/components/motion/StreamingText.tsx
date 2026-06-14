import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface StreamingTextProps {
  lines: string[];
  charsPerSec?: number;
  perLineDelayMs?: number;
  onDone?: () => void;
  /** fires as each line *starts* — drives tool-node lighting on Screen 4 */
  onLineStart?: (index: number) => void;
  cursor?: boolean;
  className?: string;
  lineClassName?: string;
}

/**
 * Typewriter, line-by-line. Types each line, pauses, advances; auto-scrolls.
 * Reduced-motion → renders everything at once.
 */
export function StreamingText({
  lines,
  charsPerSec = 45,
  perLineDelayMs = 320,
  onDone,
  onLineStart,
  cursor = true,
  className,
  lineClassName,
}: StreamingTextProps) {
  const reduce = useReducedMotion();
  const [done, setDone] = useState<string[]>([]);
  const [current, setCurrent] = useState("");
  const [finished, setFinished] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  // keep latest callbacks without retriggering the effect
  const cbs = useRef({ onDone, onLineStart });
  cbs.current = { onDone, onLineStart };

  useEffect(() => {
    setDone([]);
    setCurrent("");
    setFinished(false);

    if (reduce) {
      setDone(lines);
      setFinished(true);
      lines.forEach((_, i) => cbs.current.onLineStart?.(i));
      cbs.current.onDone?.();
      return;
    }

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const typeLine = (lineIdx: number) => {
      if (cancelled || lineIdx >= lines.length) {
        if (!cancelled) {
          setFinished(true);
          cbs.current.onDone?.();
        }
        return;
      }
      cbs.current.onLineStart?.(lineIdx);
      const text = lines[lineIdx];
      const charDelay = 1000 / charsPerSec;
      let charIdx = 0;

      const tick = () => {
        if (cancelled) return;
        charIdx++;
        setCurrent(text.slice(0, charIdx));
        if (charIdx < text.length) {
          timers.push(setTimeout(tick, charDelay));
        } else {
          // commit the finished line, pause, advance
          setDone((d) => [...d, text]);
          setCurrent("");
          timers.push(setTimeout(() => typeLine(lineIdx + 1), perLineDelayMs));
        }
      };
      tick();
    };

    timers.push(setTimeout(() => typeLine(0), 250));

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines, charsPerSec, perLineDelayMs, reduce]);

  // auto-scroll to newest line
  useEffect(() => {
    const el = containerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [done, current]);

  return (
    <div
      ref={containerRef}
      className={cn("flex flex-col gap-2 overflow-y-auto", className)}
    >
      {done.map((line, i) => (
        <p key={i} className={cn("text-[14px] leading-relaxed text-muted", lineClassName)}>
          <span className="mr-2 text-success">›</span>
          {line}
        </p>
      ))}
      {!finished && current && (
        <p className={cn("text-[14px] leading-relaxed text-white", lineClassName)}>
          <span className="mr-2 text-orange">›</span>
          {current}
          {cursor && (
            <span className="ml-0.5 inline-block h-[1.05em] w-[2px] -translate-y-[1px] animate-pulse bg-orange align-middle" />
          )}
        </p>
      )}
    </div>
  );
}
