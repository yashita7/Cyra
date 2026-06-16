import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import {
  ArrowRight,
  Boxes,
  Cpu,
  Database,
  Leaf,
  RotateCcw,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { getReturn } from "@/data/returns";
import { heroEvaluations } from "@/data/comps";
import { decideFate, gradeItem } from "@/lib/api";
import gradingFallback from "@/data/cached/grading.json";
import type { Decision as DecisionT, Grading } from "@/data/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimatedBar } from "@/components/motion/AnimatedBar";
import { AnimatedBeam } from "@/components/motion/AnimatedBeam";
import { ConfidenceRing } from "@/components/motion/ConfidenceRing";
import { StreamingText } from "@/components/motion/StreamingText";
import { StatusPill } from "@/components/motion/StatusPill";
import { ModelBadge, type ModelBadgeState } from "@/components/layout/ModelBadge";
import { inr } from "@/lib/utils";

interface Tool {
  key: string;
  label: string;
  icon: LucideIcon;
  threshold: number; // reasoning-line index at which this tool lights up
}

const TOOLS: Tool[] = [
  { key: "comps", label: "Comps", icon: Database, threshold: 3 },
  { key: "refurb", label: "Refurb Cost", icon: Wrench, threshold: 4 },
  { key: "inventory", label: "Inventory", icon: Boxes, threshold: 6 },
  { key: "carbon", label: "Carbon", icon: Leaf, threshold: 7 },
];

// corner positions for the four tool nodes
const POS = [
  "left-[6%] top-[12%]",
  "right-[6%] top-[12%]",
  "left-[6%] bottom-[12%]",
  "right-[6%] bottom-[12%]",
];

export default function Decision() {
  const { id = "RTN-10481" } = useParams();
  const navigate = useNavigate();
  const item = getReturn(id);

  const [decision, setDecision] = useState<DecisionT | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeLine, setActiveLine] = useState(-1);
  const [streamDone, setStreamDone] = useState(false);
  const [runId, setRunId] = useState(0);

  // refs for the beam graph
  const graphRef = useRef<HTMLDivElement>(null);
  const agentRef = useRef<HTMLDivElement>(null);
  const toolRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  useEffect(() => {
    let cancelled = false;
    setDecision(null);
    setLoading(true);
    setActiveLine(-1);
    setStreamDone(false);

    // use the last cached grade as the decision input (grading already ran on Screen 3)
    const grading: Grading =
      (item?.grading as Grading) ?? (gradingFallback as Grading);

    (async () => {
      // ensure we have a grade to reason over (cheap; cached if offline)
      const g = item?.grading ?? (await gradeItem(id).catch(() => grading));
      const result = await decideFate(g, heroEvaluations);
      if (cancelled) return;
      setDecision(result);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [id, runId, item]);

  const maxNet = useMemo(
    () => Math.max(...heroEvaluations.map((e) => e.netValue)),
    [],
  );

  // verdict celebration
  useEffect(() => {
    if (streamDone && decision) {
      const t = setTimeout(() => {
        confetti({
          particleCount: 70,
          spread: 64,
          origin: { y: 0.7 },
          colors: ["#FF9900", "#FEBD69", "#2BB673", "#00A8E1"],
          disableForReducedMotion: true,
        });
      }, 350);
      return () => clearTimeout(t);
    }
  }, [streamDone, decision]);

  if (!item) {
    return (
      <div className="grid h-full place-items-center text-muted">
        Return {id} not found.
      </div>
    );
  }

  const badgeState: ModelBadgeState = loading
    ? "calling"
    : decision?.source === "live"
      ? "done"
      : "fallback";

  const toolActive = (t: Tool) => activeLine >= t.threshold;

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="section-label">Decision Theater · {item.sku}</p>
          <h2 className="text-[26px] font-semibold text-white">
            Routing {item.title}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <StatusPill status="deciding" pulse />
          <ModelBadge state={badgeState} />
        </div>
      </div>

      {/* ROW 1 — reasoning stream + agent graph */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* reasoning stream */}
        <div className="surface flex flex-col p-5 lg:col-span-5">
          <div className="mb-3 flex items-center gap-2">
            <Cpu className="h-4 w-4 text-orange" />
            <p className="section-label !text-orange">Live agent reasoning</p>
          </div>
          <div className="min-h-[300px] flex-1">
            {loading ? (
              <div className="flex flex-col gap-3 pt-2">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-4 animate-pulse rounded bg-slate/30"
                    style={{ width: `${70 - i * 8}%` }}
                  />
                ))}
                <p className="mt-2 text-[12px] text-sky">
                  Nova is reasoning over the comparables…
                </p>
              </div>
            ) : (
              decision && (
                <StreamingText
                  lines={decision.reasoningTrace}
                  charsPerSec={48}
                  onLineStart={setActiveLine}
                  onDone={() => setStreamDone(true)}
                  className="max-h-[340px] pr-2"
                />
              )
            )}
          </div>
        </div>

        {/* agent graph with animated beams */}
        <div
          ref={graphRef}
          className="surface relative min-h-[300px] overflow-hidden lg:col-span-7"
        >
          <div className="absolute left-4 top-4 z-10">
            <p className="section-label">Agent · tool calls</p>
          </div>

          {/* beams (under nodes) */}
          {TOOLS.map((t, i) => (
            <AnimatedBeam
              key={t.key}
              containerRef={graphRef}
              fromRef={agentRef}
              toRef={toolRefs[i]}
              active={toolActive(t)}
              curvature={i % 2 === 0 ? 18 : -18}
            />
          ))}

          {/* central agent node */}
          <div
            ref={agentRef}
            className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
          >
            <motion.div
              animate={
                loading
                  ? { boxShadow: ["0 0 0 0 rgba(255,153,0,.4)", "0 0 0 14px rgba(255,153,0,0)"] }
                  : {}
              }
              transition={{ duration: 1.4, repeat: loading ? Infinity : 0 }}
              className="grid h-20 w-20 place-items-center rounded-2xl border border-orange/50 bg-gradient-to-br from-squid to-ink shadow-glow"
            >
              <Cpu className="h-8 w-8 text-orange" />
            </motion.div>
            <span className="mt-1.5 block text-center text-[11px] font-semibold text-white">
              Cyra Agent
            </span>
          </div>

          {/* tool nodes */}
          {TOOLS.map((t, i) => {
            const active = toolActive(t);
            return (
              <div
                key={t.key}
                ref={toolRefs[i]}
                className={`absolute z-10 ${POS[i]}`}
              >
                <motion.div
                  animate={
                    active
                      ? { scale: [1, 1.08, 1], borderColor: "rgba(255,153,0,.6)" }
                      : { scale: 1 }
                  }
                  transition={{ duration: 0.5 }}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2 backdrop-blur transition-colors ${
                    active
                      ? "border-orange/60 bg-orange/10"
                      : "border-slate/50 bg-squid/70"
                  }`}
                >
                  <t.icon
                    className={`h-4 w-4 ${active ? "text-orange" : "text-muted/60"}`}
                  />
                  <span
                    className={`text-[12px] font-medium ${active ? "text-white" : "text-muted/60"}`}
                  >
                    {t.label}
                  </span>
                  {active && (
                    <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-dot" />
                  )}
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ROW 2 — EV bars + verdict */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* EV comparison */}
        <div className="surface p-6 lg:col-span-7">
          <div className="mb-4 flex items-center justify-between">
            <p className="section-label">Expected value across 5 fates</p>
            <span className="mono text-[11px] text-muted/50">net ₹ recovered</span>
          </div>
          <div className="flex flex-col gap-4">
            {heroEvaluations.map((e, i) => {
              const isWinner = e.fate === (decision?.chosenFate ?? "Resell");
              return (
                <AnimatedBar
                  key={e.fate}
                  value={Math.max(e.netValue, 0)}
                  max={maxNet}
                  label={e.fate}
                  valueLabel={inr(e.netValue)}
                  highlighted={isWinner}
                  delayMs={300 + i * 120}
                />
              );
            })}
          </div>
          <div className="mt-5 border-t border-slate/40 pt-4 text-center">
            <p className="text-[12px] text-muted">
              Reasoned on Amazon Bedrock Nova — grounded in the numbers, not
              guessed.
            </p>
            {decision?.source === "fallback" && (
              <p className="mt-1 text-[11px] text-sky/80">
                Showing a cached response to conserve API quota · live Nova runs
                in the demo recording.
              </p>
            )}
          </div>
        </div>

        {/* verdict */}
        <div className="lg:col-span-5">
          <AnimatePresence mode="wait">
            {streamDone && decision ? (
              <motion.div
                key="verdict"
                initial={{ opacity: 0, x: 24, scale: 0.97 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 26 }}
                className="surface relative overflow-hidden p-6 shadow-glow"
              >
                <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-orange/20 blur-3xl" />
                <p className="section-label">Verdict</p>
                <div className="mt-2 flex items-end gap-3">
                  <span className="text-gradient-orange text-[40px] font-bold leading-none">
                    {decision.chosenFate.toUpperCase()}
                  </span>
                </div>
                <p className="mt-2 text-[13px] text-muted">
                  via <span className="font-semibold text-white">{decision.channel}</span>
                </p>

                <div className="my-5 flex items-center gap-5">
                  <ConfidenceRing value={decision.confidence} size={96} label="Confidence" />
                  <div className="flex flex-col gap-2">
                    <Badge variant="success" className="!text-[12px]">
                      <Leaf className="h-3 w-3" />
                      +{decision.carbonSavedKg} kg CO₂e saved
                    </Badge>
                    <Badge variant="orange" className="!text-[12px]">
                      {inr(heroEvaluations[0].recoveryValue)} recovered
                    </Badge>
                  </div>
                </div>

                <p className="rounded-xl border border-slate/40 bg-ink/40 p-3 text-[13px] leading-relaxed text-muted">
                  {decision.rationale}
                </p>

                <div className="mt-5 flex items-center gap-3">
                  <Button
                    size="lg"
                    className="group flex-1"
                    onClick={() => navigate(`/listing/${id}`)}
                  >
                    Create listing
                    <ArrowRight className="transition-transform group-hover:translate-x-1" />
                  </Button>
                  <Button
                    size="lg"
                    variant="secondary"
                    onClick={() => setRunId((n) => n + 1)}
                    title="Replay decision"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Replay
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="pending"
                exit={{ opacity: 0 }}
                className="surface grid min-h-[300px] place-items-center p-6"
              >
                <div className="flex flex-col items-center gap-3 text-center">
                  <Cpu className="h-8 w-8 animate-pulse text-orange/60" />
                  <p className="text-[13px] text-muted">
                    Verdict appears once the agent finishes reasoning…
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
