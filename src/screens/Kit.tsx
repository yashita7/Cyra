import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { AnimatedNumber } from "@/components/motion/AnimatedNumber";
import { AnimatedBar } from "@/components/motion/AnimatedBar";
import { RevealCard } from "@/components/motion/RevealCard";
import { StreamingText } from "@/components/motion/StreamingText";
import { ConfidenceRing } from "@/components/motion/ConfidenceRing";
import { StatusPill } from "@/components/motion/StatusPill";
import { AnimatedBeam } from "@/components/motion/AnimatedBeam";
import { ModelBadge, type ModelBadgeState } from "@/components/layout/ModelBadge";
import type { Status } from "@/data/types";
import { Cpu, Database } from "lucide-react";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="surface p-6">
      <p className="section-label mb-4">{title}</p>
      {children}
    </div>
  );
}

const STATUSES: Status[] = ["queued", "grading", "deciding", "listed", "saved", "flagged"];
const BADGE_STATES: ModelBadgeState[] = ["idle", "calling", "done", "fallback"];

export default function Kit() {
  const [scale, setScale] = useState(1);
  const graphRef = useRef<HTMLDivElement>(null);
  const aRef = useRef<HTMLDivElement>(null);
  const bRef = useRef<HTMLDivElement>(null);

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-6">
        <h2 className="text-[28px] font-semibold text-white">Motion Kit</h2>
        <p className="text-[14px] text-muted">
          Reusable animated components (Person 2 reuses all of these). Props in
          docs/02_MOTION_KIT.md.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Section title="AnimatedNumber">
          <div className="flex flex-wrap items-baseline gap-6">
            <span className="text-[32px] font-bold text-white">
              <AnimatedNumber value={420000 * scale} format="currencyINRCompact" />
            </span>
            <span className="text-[32px] font-bold text-success">
              <AnimatedNumber value={92} format="int" suffix="/100" />
            </span>
            <span className="text-[32px] font-bold text-orange">
              <AnimatedNumber value={91} format="percent" />
            </span>
          </div>
          <Button className="mt-4" variant="secondary" size="sm" onClick={() => setScale((s) => (s === 1 ? 4762 : 1))}>
            Toggle scale (re-animate)
          </Button>
        </Section>

        <Section title="ConfidenceRing">
          <div className="flex gap-8">
            <ConfidenceRing value={91} label="Decision" />
            <ConfidenceRing value={94} label="Like-New" />
            <ConfidenceRing value={81} label="Buyer" color="#146EB4" />
          </div>
        </Section>

        <Section title="AnimatedBar">
          <div className="flex flex-col gap-3">
            <AnimatedBar value={2359} max={2359} label="Resell" valueLabel="₹2,359" highlighted />
            <AnimatedBar value={1800} max={2359} label="Refurbish" valueLabel="₹1,800" />
            <AnimatedBar value={1480} max={2359} label="Exchange" valueLabel="₹1,480" />
          </div>
        </Section>

        <Section title="StatusPill">
          <div className="flex flex-wrap gap-2">
            {STATUSES.map((s) => (
              <StatusPill key={s} status={s} pulse />
            ))}
          </div>
        </Section>

        <Section title="StreamingText">
          <StreamingText
            lines={[
              "Analyzing returned item: Men's Running Shoes…",
              "Condition: Like-New — 94% confidence.",
              "Decision: RESELL via Amazon Warehouse Deals.",
            ]}
            className="max-h-[140px]"
          />
        </Section>

        <Section title="RevealCard (stagger)">
          <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <RevealCard key={i} index={i}>
                <div className="grid h-16 place-items-center rounded-xl border border-slate/50 bg-ink/40 text-muted">
                  {i + 1}
                </div>
              </RevealCard>
            ))}
          </div>
        </Section>

        <Section title="ModelBadge (the visible-AWS pill)">
          <div className="flex flex-wrap gap-3">
            {BADGE_STATES.map((s) => (
              <ModelBadge key={s} state={s} />
            ))}
          </div>
        </Section>

        <Section title="AnimatedBeam">
          <div ref={graphRef} className="relative h-32">
            <AnimatedBeam containerRef={graphRef} fromRef={aRef} toRef={bRef} active />
            <div ref={aRef} className="absolute left-[8%] top-1/2 -translate-y-1/2 grid h-14 w-14 place-items-center rounded-xl border border-orange/50 bg-squid">
              <Cpu className="h-6 w-6 text-orange" />
            </div>
            <div ref={bRef} className="absolute right-[8%] top-1/2 -translate-y-1/2 flex items-center gap-2 rounded-xl border border-orange/60 bg-orange/10 px-3 py-2">
              <Database className="h-4 w-4 text-orange" />
              <span className="text-[12px] text-white">Comps</span>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}
