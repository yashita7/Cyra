import { useState, useEffect } from "react";
import { TrendingUp, Leaf, Package, ShieldCheck, Globe } from "lucide-react";
import confetti from "canvas-confetti";
import { dashboardStats } from "@/data/stats";
import { AnimatedNumber } from "@/components/motion/AnimatedNumber";
import { RevealCard } from "@/components/motion/RevealCard";
import { ModelBadge } from "@/components/layout/ModelBadge";
import { DotBackdrop } from "@/components/layout/Backgrounds";
import { cn } from "@/lib/utils";

/** Counter tile configuration. */
interface CounterTile {
  label: string;
  icon: React.ElementType;
  color: string;
  getValue: (scaled: boolean) => number | string;
  format?: "int" | "currencyINRCompact" | "percent" | ((scaled: boolean) => "int" | "currencyINRCompact" | "percent" | undefined);
  suffix?: string | ((scaled: boolean) => string | undefined);
}

export default function Impact() {
  const [scaled, setScaled] = useState(false);
  const [confettiShown, setConfettiShown] = useState(false);

  // Fire confetti once on initial counter landing
  useEffect(() => {
    if (!confettiShown) {
      const timer = setTimeout(() => {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#FF9900", "#FEBD69", "#2BB673", "#00A8E1"],
          disableForReducedMotion: true,
        });
        setConfettiShown(true);
      }, 1400); // after counters animate
      return () => clearTimeout(timer);
    }
  }, [confettiShown]);

  // Fire confetti on scale toggle
  const handleScaleToggle = () => {
    setScaled(!scaled);
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.65 },
      colors: ["#FF9900", "#2BB673", "#00A8E1"],
      disableForReducedMotion: true,
    });
  };

  const counters: CounterTile[] = [
    {
      label: "Value Recovered",
      icon: TrendingUp,
      color: "#FF9900",
      getValue: (s) => (s ? dashboardStats.scale.valueRecoveredUSD : dashboardStats.valueRecoveredINR),
      format: (s) => (s ? undefined : "currencyINRCompact"),
      suffix: (s) => (s ? "" : undefined),
    },
    {
      label: "CO₂ Diverted",
      icon: Leaf,
      color: "#2BB673",
      getValue: (s) => (s ? dashboardStats.scale.co2AvoidedTonnes : dashboardStats.co2DivertedKg),
      suffix: (s) => (s ? "" : " kg"),
    },
    {
      label: "Preventable Returns",
      icon: ShieldCheck,
      color: "#146EB4",
      getValue: () => dashboardStats.preventablePct,
      format: "percent",
    },
    {
      label: "Units Saved",
      icon: Package,
      color: "#00A8E1",
      getValue: () => `${dashboardStats.unitsSaved}/${dashboardStats.unitsTotal}`,
    },
  ];

  return (
    <div className="relative mx-auto max-w-7xl px-6 py-8">
      <DotBackdrop />

      {/* Header */}
      <div className="relative mb-6 flex items-center justify-between">
        <div>
          <p className="section-label">Impact Dashboard</p>
          <h2 className="text-[26px] font-semibold text-white">
            Real-Time Sustainability Impact
          </h2>
          <p className="mt-1 text-[14px] text-muted">
            Every return routed saves value, cuts waste, and prevents the next one
          </p>
        </div>
        <ModelBadge state="idle" />
      </div>

      {/* Scale Toggle */}
      <RevealCard index={0}>
        <div className="relative mb-6 flex items-center justify-between rounded-xl border border-slate/50 bg-squid/60 p-4">
          <div className="flex items-center gap-3">
            <Globe className="h-5 w-5 text-orange" />
            <span className="text-[14px] font-semibold text-white">
              Project to Amazon scale
            </span>
          </div>
          <button
            onClick={handleScaleToggle}
            className={cn(
              "relative h-7 w-14 rounded-full transition-colors",
              scaled ? "bg-orange" : "bg-slate/50",
            )}
            aria-label="Toggle Amazon scale projection"
          >
            <span
              className={cn(
                "absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-md transition-transform",
                scaled ? "right-0.5" : "left-0.5",
              )}
            />
          </button>
        </div>
      </RevealCard>

      {/* Counter Grid */}
      <div className="relative grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {counters.map((counter, i) => {
          const Icon = counter.icon;
          const value = counter.getValue(scaled);
          const isString = typeof value === "string";

          return (
            <RevealCard key={counter.label} index={i + 1}>
              <div className="surface group relative overflow-hidden p-6 transition-all hover:shadow-glow">
                <div
                  className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-0 blur-3xl transition-opacity group-hover:opacity-100"
                  style={{ backgroundColor: `${counter.color}20` }}
                />
                <div className="relative">
                  <div className="mb-3 flex items-center justify-between">
                    <Icon className="h-6 w-6" style={{ color: counter.color }} />
                    <span className="text-[11px] uppercase tracking-wide text-muted">
                      {scaled ? "At Amazon Scale" : "Today"}
                    </span>
                  </div>
                  <div className="mb-2">
                    {isString ? (
                      <p
                        className="text-[36px] font-bold leading-none"
                        style={{ color: counter.color }}
                      >
                        {value}
                      </p>
                    ) : (
                      <p
                        className="text-[36px] font-bold leading-none tabular-nums"
                        style={{ color: counter.color }}
                      >
                        <AnimatedNumber
                          key={`${counter.label}-${scaled}`}
                          value={value as number}
                          format={
                            typeof counter.format === "function"
                              ? counter.format(scaled)
                              : counter.format
                          }
                          suffix={
                            typeof counter.suffix === "function"
                              ? counter.suffix(scaled)
                              : counter.suffix
                          }
                          durationMs={1100}
                        />
                      </p>
                    )}
                  </div>
                  <p className="text-[13px] text-muted">{counter.label}</p>
                </div>
              </div>
            </RevealCard>
          );
        })}
      </div>

      {/* Climate Pledge Reveal (only when scaled) */}
      {scaled && (
        <RevealCard index={5}>
          <div className="surface relative mt-6 overflow-hidden p-6">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-success/5 to-transparent" />
            <div className="relative flex items-start gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-success/20">
                <Leaf className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="mb-1 text-[18px] font-semibold text-white">
                  Advancing Amazon's Climate Pledge
                </p>
                <p className="text-[14px] leading-relaxed text-muted">
                  At Amazon scale, Cyra's intelligent returns routing directly contributes
                  to the Climate Pledge commitment:{" "}
                  <span className="font-semibold text-success">
                    net-zero carbon by 2040
                  </span>
                  . Every second-life decision — resell, refurbish, donate — keeps products
                  in circulation, avoids manufacturing emissions, and reduces landfill
                  waste. The compounding loop: smarter routing today → fewer returns
                  tomorrow → exponentially cleaner commerce.
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="h-px flex-1 bg-success/20" />
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-success">
                    Climate Pledge
                  </span>
                  <div className="h-px flex-1 bg-success/20" />
                </div>
              </div>
            </div>
          </div>
        </RevealCard>
      )}

      {/* Customer Win Message */}
      <RevealCard index={6}>
        <div className="surface mt-6 p-6 text-center">
          <p className="text-[15px] leading-relaxed text-muted">
            <span className="font-semibold text-white">The customer wins:</span> cheaper,
            trustworthy refurbished products with{" "}
            <span className="text-gold">Green Credits</span> for choosing sustainable
            options.{" "}
            <span className="font-semibold text-white">Amazon wins:</span> billions
            recovered, millions of tonnes CO₂ avoided, and{" "}
            <span className="text-orange">58% of returns are preventable</span> — Cyra
            closes the loop.
          </p>
        </div>
      </RevealCard>
    </div>
  );
}
