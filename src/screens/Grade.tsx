import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, RotateCcw, ScanLine } from "lucide-react";
import { getReturn } from "@/data/returns";
import { gradeItem } from "@/lib/api";
import type { Grading } from "@/data/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimatedNumber } from "@/components/motion/AnimatedNumber";
import { ConfidenceRing } from "@/components/motion/ConfidenceRing";
import { RevealCard } from "@/components/motion/RevealCard";
import { StatusPill } from "@/components/motion/StatusPill";
import { ModelBadge, type ModelBadgeState } from "@/components/layout/ModelBadge";
import { ProductImage } from "@/components/layout/ProductImage";
import { cn } from "@/lib/utils";

const GRADE_COLOR: Record<string, string> = {
  "Like-New": "#2BB673",
  "Very Good": "#00A8E1",
  Good: "#FF9900",
  Acceptable: "#FEBD69",
  Damaged: "#E5564E",
};

export default function Grade() {
  const { id = "RTN-10481" } = useParams();
  const navigate = useNavigate();
  const item = getReturn(id);

  const [grading, setGrading] = useState<Grading | null>(null);
  const [phase, setPhase] = useState<"calling" | "revealed">("calling");
  const [activePhoto, setActivePhoto] = useState(0);
  const [runId, setRunId] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    setGrading(null);
    setPhase("calling");
    setActivePhoto(0);
    startedRef.current = true;
    // small floor so the scanning animation always reads on camera
    const minDelay = new Promise((r) => setTimeout(r, 1600));
    Promise.all([gradeItem(id), minDelay]).then(([result]) => {
      if (cancelled) return;
      setGrading(result);
      setPhase("revealed");
    });
    return () => {
      cancelled = true;
    };
  }, [id, runId]);

  if (!item) {
    return (
      <div className="grid h-full place-items-center text-muted">
        Return {id} not found.
      </div>
    );
  }

  const badgeState: ModelBadgeState =
    phase === "calling"
      ? "calling"
      : grading?.source === "live"
        ? "done"
        : "fallback";

  const photo = item.photos[activePhoto];
  const gradeColor = grading ? GRADE_COLOR[grading.conditionGrade] : "#FF9900";

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="section-label">Live Grading · {item.sku}</p>
          <h2 className="text-[26px] font-semibold text-white">{item.title}</h2>
        </div>
        <StatusPill status={phase === "calling" ? "grading" : "deciding"} pulse />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* LEFT — product photo + scan + defect boxes */}
        <div className="relative">
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-slate/60 bg-ink/60">
            <ProductImage
              src={photo?.url}
              alt={photo?.alt}
              className="h-full w-full"
              hint="Add public/demo/shoe-1.jpg for the live grade"
            />

            {/* scanning shimmer while calling */}
            <AnimatePresence>
              {phase === "calling" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="pointer-events-none absolute inset-0"
                >
                  <div className="absolute inset-0 bg-sky/5" />
                  <div className="absolute left-0 right-0 h-24 animate-scan bg-gradient-to-b from-transparent via-sky/30 to-transparent" />
                  <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-ink/70 px-3 py-1.5 backdrop-blur">
                    <ScanLine className="h-3.5 w-3.5 animate-pulse text-sky" />
                    <span className="text-[11px] text-sky">
                      Nova is inspecting the photo…
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* defect boxes draw in — only on the graded photo (the first) */}
            {phase === "revealed" &&
              activePhoto === 0 &&
              grading?.defects.map((d, i) => (
                <motion.div
                  key={d.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.2, duration: 0.4 }}
                  className="absolute rounded-md border-2 border-gold"
                  style={{
                    left: `${d.box.x * 100}%`,
                    top: `${d.box.y * 100}%`,
                    width: `${d.box.w * 100}%`,
                    height: `${d.box.h * 100}%`,
                    boxShadow: "0 0 0 9999px rgba(0,0,0,0)",
                  }}
                >
                  <span className="absolute -top-6 left-0 whitespace-nowrap rounded bg-gold px-1.5 py-0.5 text-[10px] font-semibold text-ink">
                    {d.label} · {d.severity}
                  </span>
                </motion.div>
              ))}
          </div>

          {/* thumbnail strip — all angles, click to switch */}
          {item.photos.length > 1 && (
            <div className="mt-3 flex items-center gap-2.5">
              {item.photos.map((p, i) => {
                const active = i === activePhoto;
                return (
                  <button
                    key={p.url}
                    onClick={() => setActivePhoto(i)}
                    aria-label={`View photo ${i + 1}`}
                    className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border transition-all ${
                      active
                        ? "border-orange ring-1 ring-orange/50"
                        : "border-slate/50 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <ProductImage src={p.url} alt={p.alt} className="h-full w-full" hint="" />
                    <span className="absolute bottom-0 left-0 right-0 bg-ink/80 py-0.5 text-center text-[9px] font-medium text-success">
                      graded
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          <p className="mt-3 text-[11px] text-muted/50">
            {item.photos.length} photo(s) · multimodal inspection by Amazon Nova ·{" "}
            <span className="text-muted/70">{photo?.alt}</span>
          </p>
        </div>

        {/* RIGHT — grading panel */}
        <div className="surface relative flex flex-col p-6">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <p className="section-label">Grading result</p>
              <p className="mt-1 text-[13px] text-muted">
                Reason on file: “{item.reason}”
              </p>
            </div>
            <ModelBadge state={badgeState} />
          </div>

          {/* score + grade + confidence */}
          <div className="grid grid-cols-[1fr_auto] items-center gap-4 rounded-xl border border-slate/50 bg-ink/40 p-5">
            <div>
              <p className="section-label">Condition score</p>
              <div className="flex items-end gap-2">
                <span
                  className="text-[56px] font-bold leading-none tabular-nums"
                  style={{ color: gradeColor }}
                >
                  {phase === "revealed" && grading ? (
                    <AnimatedNumber value={grading.conditionScore} durationMs={1100} />
                  ) : (
                    <span className="text-muted/40">··</span>
                  )}
                </span>
                <span className="mb-2 text-[18px] text-muted/50">/100</span>
              </div>
              <AnimatePresence>
                {phase === "revealed" && grading && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Badge
                      variant="success"
                      className="mt-3 !text-[13px]"
                      style={{
                        color: gradeColor,
                        borderColor: `${gradeColor}66`,
                        background: `${gradeColor}1a`,
                      }}
                    >
                      {grading.conditionGrade}
                    </Badge>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="grid place-items-center">
              {phase === "revealed" && grading ? (
                <ConfidenceRing
                  value={grading.confidence}
                  size={104}
                  label="Confidence"
                />
              ) : (
                <div className="h-[104px] w-[104px] animate-pulse rounded-full border-4 border-slate/40" />
              )}
            </div>
          </div>

          {/* checks tick green one by one */}
          <p className="section-label mt-6 mb-2">Inspection checklist</p>
          <div className="grid gap-2">
            {phase === "calling" &&
              [0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-10 animate-pulse rounded-lg border border-slate/40 bg-ink/30"
                />
              ))}
            {phase === "revealed" &&
              grading?.checks.map((c, i) => (
                <RevealCard key={c.label} index={i} delayMs={500} immediate>
                  <div className="flex items-center gap-3 rounded-lg border border-slate/40 bg-ink/40 px-3 py-2.5">
                    <span
                      className={cn(
                        "grid h-5 w-5 place-items-center rounded-full",
                        c.passed ? "bg-success/20 text-success" : "bg-danger/20 text-danger",
                      )}
                    >
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    <span className="text-[13px] text-white/90">{c.label}</span>
                  </div>
                </RevealCard>
              ))}
          </div>

          {/* latency line */}
          <AnimatePresence>
            {phase === "revealed" && grading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-5 flex items-center justify-between border-t border-slate/40 pt-4"
              >
                <span className="text-[12px] text-muted">
                  Graded by {grading.graderModel} ·{" "}
                  <span className="mono text-white/80">
                    {(grading.latencyMs / 1000).toFixed(1)}s
                  </span>
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CTA */}
          <div className="mt-5 flex items-center gap-3">
            <Button
              size="lg"
              className="group flex-1"
              disabled={phase !== "revealed"}
              onClick={() => navigate(`/decision/${id}`)}
            >
              Run decision
              <ArrowRight className="transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => setRunId((n) => n + 1)}
              title="Re-run grading"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
