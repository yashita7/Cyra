import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Package, Sparkles, TrendingUp, ShieldAlert } from "lucide-react";
import { returns } from "@/data/returns";
import { inboxStats } from "@/data/stats";
import { inr } from "@/lib/utils";
import { AnimatedNumber } from "@/components/motion/AnimatedNumber";
import { RevealCard } from "@/components/motion/RevealCard";
import { StatusPill } from "@/components/motion/StatusPill";
import { ProductImage } from "@/components/layout/ProductImage";
import { DotBackdrop } from "@/components/layout/Backgrounds";

const TILES = [
  { label: "Pending", value: inboxStats.pending, icon: Package, fmt: "int" as const },
  { label: "Auto-resolved today", value: inboxStats.autoResolvedToday, icon: Sparkles, fmt: "int" as const },
  { label: "Recovery today", value: inboxStats.recoveryTodayINR, icon: TrendingUp, fmt: "currencyINRCompact" as const },
  { label: "Preventable", value: inboxStats.preventablePct, icon: ShieldAlert, fmt: "percent" as const },
];

export default function Inbox() {
  const navigate = useNavigate();

  return (
    <div className="relative mx-auto max-w-7xl px-6 py-8">
      <DotBackdrop />

      {/* header */}
      <div className="relative mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-[28px] font-semibold tracking-tight text-white">
            Returns Inbox
          </h2>
          <StatusPill status="grading" pulse className="!text-sky" />
        </div>
        <span className="mono text-[12px] text-muted/60">
          {returns.length} items in stream
        </span>
      </div>

      {/* stat strip */}
      <div className="relative mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {TILES.map((t, i) => (
          <RevealCard key={t.label} index={i}>
            <div className="surface flex items-center gap-4 p-4">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-orange/10 text-orange">
                <t.icon className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="section-label">{t.label}</span>
                <span className="text-[24px] font-semibold text-white">
                  <AnimatedNumber value={t.value} format={t.fmt} durationMs={1100} />
                </span>
              </div>
            </div>
          </RevealCard>
        ))}
      </div>

      {/* return cards grid */}
      <p className="section-label relative mb-3">Incoming returns</p>
      <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {returns.map((item, i) => {
          const isHero = item.isHero;
          return (
            <RevealCard key={item.id} index={i}>
              <motion.button
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                onClick={() =>
                  isHero ? navigate(`/grade/${item.id}`) : undefined
                }
                disabled={!isHero}
                className={`group relative w-full overflow-hidden rounded-2xl border p-4 text-left transition-all ${
                  isHero
                    ? "cursor-pointer border-orange/50 bg-squid/80 shadow-glow"
                    : "cursor-default border-slate/50 bg-squid/50 opacity-90"
                }`}
              >
                {isHero && (
                  <span className="absolute right-3 top-3 z-10 rounded-full bg-orange px-2 py-0.5 text-[10px] font-bold text-ink">
                    NEW
                  </span>
                )}

                <div className="mb-3 flex gap-3">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-ink/60">
                    {isHero ? (
                      <ProductImage
                        src={item.photos[0]?.url}
                        alt={item.photos[0]?.alt}
                        className="h-full w-full"
                        hint="shoe-1.jpg"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center text-muted/40">
                        <Package className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-[14px] font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="mono text-[11px] text-muted/60">{item.sku}</p>
                    <p className="mt-1 text-[12px] text-muted">
                      Reason: <span className="text-white/90">“{item.reason}”</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate/40 pt-3">
                  <span className="text-[13px] font-semibold text-white">
                    {inr(item.orderValue)}
                  </span>
                  <div className="flex items-center gap-2">
                    <StatusPill status={item.status} pulse={isHero} />
                    {isHero && (
                      <ArrowRight className="h-4 w-4 text-orange transition-transform group-hover:translate-x-1" />
                    )}
                  </div>
                </div>

                {isHero && (
                  <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-orange/0 transition group-hover:ring-orange/40" />
                )}
              </motion.button>
            </RevealCard>
          );
        })}
      </div>

      <p className="relative mt-6 text-center text-[12px] text-muted/50">
        Click the highlighted return (SKU-4471) to run live grading →
      </p>
    </div>
  );
}
