import { useNavigate } from "react-router-dom";
import { ArrowRight, AlertTriangle, Check, X, TrendingDown, Package } from "lucide-react";
import { preventionInsight } from "@/data/prevention";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimatedNumber } from "@/components/motion/AnimatedNumber";
import { RevealCard } from "@/components/motion/RevealCard";
import { ModelBadge } from "@/components/layout/ModelBadge";
import { DotBackdrop } from "@/components/layout/Backgrounds";

/** Return reason cluster data (from docs/04_SCREENS.md). */
const REASON_CLUSTERS = [
  { name: "Sizing/Fit/Color", value: 45, color: "#FF9900" },
  { name: "Damage", value: 16, color: "#E5564E" },
  { name: "Inaccurate Descriptions", value: 14, color: "#146EB4" },
  { name: "Other", value: 25, color: "#37475A" },
];

/** Flagged SKU table rows. */
const FLAGGED_SKUS = [
  {
    sku: "SKU-4471",
    title: "Men's Road Running Shoes",
    returnRate: 22,
    topReason: "smaller than expected",
    flagged: true,
  },
  {
    sku: "SKU-2210",
    title: "Wireless Headphones",
    returnRate: 18,
    topReason: "connectivity issues",
    flagged: false,
  },
  {
    sku: "SKU-7788",
    title: "Cotton T-Shirt Pack",
    returnRate: 12,
    topReason: "color mismatch",
    flagged: false,
  },
];

export default function Prevention() {
  const navigate = useNavigate();

  return (
    <div className="relative mx-auto max-w-7xl px-6 py-8">
      <DotBackdrop />

      {/* Header */}
      <div className="relative mb-6 flex items-center justify-between">
        <div>
          <p className="section-label">Prevention Dashboard</p>
          <h2 className="text-[26px] font-semibold text-white">
            Upstream Prevention Intelligence
          </h2>
          <p className="mt-1 text-[14px] text-muted">
            Every return makes the catalog smarter — the closed prevention loop
          </p>
        </div>
        <ModelBadge state="idle" />
      </div>

      {/* ROW 1 — Reason Cluster Chart + Flagged SKU Table */}
      <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Reason Cluster Pie Chart */}
        <div className="lg:col-span-5">
          <RevealCard index={0}>
            <div className="surface p-6">
              <p className="section-label mb-4">Return reason clusters</p>
              <div className="flex items-center gap-6">
                <div className="h-[200px] w-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={REASON_CLUSTERS}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {REASON_CLUSTERS.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-2.5">
                  {REASON_CLUSTERS.map((cluster) => (
                    <div key={cluster.name} className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 shrink-0 rounded-sm"
                        style={{ backgroundColor: cluster.color }}
                      />
                      <span className="flex-1 text-[13px] text-muted">
                        {cluster.name}
                      </span>
                      <span className="text-[14px] font-semibold text-white">
                        {cluster.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </RevealCard>
        </div>

        {/* Flagged SKU Table */}
        <div className="lg:col-span-7">
          <RevealCard index={1}>
            <div className="surface p-6">
              <div className="mb-4 flex items-center justify-between">
                <p className="section-label">Flagged SKUs for intervention</p>
                <Badge variant="danger">
                  <AlertTriangle className="h-3 w-3" />
                  High return rate
                </Badge>
              </div>
              <div className="overflow-hidden rounded-xl border border-slate/50">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate/50 bg-ink/60 text-left text-[11px] uppercase tracking-wide text-muted">
                      <th className="px-4 py-3">SKU</th>
                      <th className="px-4 py-3">Product</th>
                      <th className="px-4 py-3">Return Rate</th>
                      <th className="px-4 py-3">Top Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FLAGGED_SKUS.map((item, i) => (
                      <tr
                        key={item.sku}
                        className={`border-b border-slate/50 text-[13px] transition-colors ${
                          item.flagged
                            ? "bg-danger/5 hover:bg-danger/10"
                            : "hover:bg-slate/10"
                        }`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {item.flagged && (
                              <AlertTriangle className="h-3.5 w-3.5 text-danger" />
                            )}
                            <span className="mono font-semibold text-white">
                              {item.sku}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted">{item.title}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`font-semibold ${
                              item.returnRate >= 20 ? "text-danger" : "text-orange"
                            }`}
                          >
                            {item.returnRate}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted">
                          {item.topReason}
                          {item.flagged && (
                            <span className="ml-2 text-[11px] text-danger">
                              (61% of returns)
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </RevealCard>
        </div>
      </div>

      {/* ROW 2 — Agent-Written Fix (Before/After Diff) */}
      <RevealCard index={2}>
        <div className="surface relative mt-6 overflow-hidden p-6">
          <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-success/10 blur-3xl" />
          <div className="relative">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="section-label">Agent-written catalog fix</p>
                <p className="text-[13px] text-muted">
                  SKU-4471 · {preventionInsight.title}
                </p>
              </div>
              <Badge variant="success">
                <Check className="h-3 w-3" />
                Fix deployed
              </Badge>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Before */}
              <div className="rounded-xl border border-danger/30 bg-danger/5 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <X className="h-4 w-4 text-danger" strokeWidth={3} />
                  <span className="text-[12px] font-semibold uppercase tracking-wide text-danger">
                    Before
                  </span>
                </div>
                <p className="text-[14px] italic leading-relaxed text-muted">
                  {preventionInsight.fix.before}
                </p>
                <div className="mt-3 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2">
                  <p className="text-[11px] text-danger">
                    <span className="font-semibold">
                      {preventionInsight.returnRatePct}% return rate
                    </span>{" "}
                    · {preventionInsight.topReasonSharePct}% cited "{preventionInsight.topReason}
                    "
                  </p>
                </div>
              </div>

              {/* After */}
              <div className="rounded-xl border border-success/30 bg-success/5 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Check className="h-4 w-4 text-success" strokeWidth={3} />
                  <span className="text-[12px] font-semibold uppercase tracking-wide text-success">
                    After
                  </span>
                </div>
                <p className="text-[14px] leading-relaxed text-white">
                  {preventionInsight.fix.after}
                </p>
                <div className="mt-3 rounded-lg border border-success/30 bg-success/10 px-3 py-2">
                  <p className="text-[11px] text-success">
                    <span className="font-semibold">
                      Projected −{preventionInsight.projectedReductionPct}% reduction
                    </span>{" "}
                    in sizing-related returns
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </RevealCard>

      {/* ROW 3 — Projected Reduction Gauge */}
      <RevealCard index={3}>
        <div className="surface mt-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="section-label">Projected impact</p>
              <p className="text-[13px] text-muted">
                Return reduction for {preventionInsight.sku} after catalog fix
              </p>
            </div>
            <div className="flex items-center gap-4">
              <TrendingDown className="h-8 w-8 text-success" />
              <div className="text-right">
                <p className="text-[48px] font-bold leading-none text-success">
                  <AnimatedNumber
                    value={preventionInsight.projectedReductionPct}
                    format="int"
                    suffix="%"
                  />
                </p>
                <p className="text-[13px] text-muted">fewer returns</p>
              </div>
            </div>
          </div>
          <div className="mt-5 flex items-center gap-2 rounded-xl border border-success/30 bg-success/5 p-4">
            <Package className="h-5 w-5 text-success" />
            <p className="text-[13px] text-muted">
              Translates to{" "}
              <span className="font-semibold text-success">
                ~340 fewer returns/year
              </span>{" "}
              for this SKU alone — fewer trucks, less packaging, happier customers
            </p>
          </div>
        </div>
      </RevealCard>

      {/* CTA */}
      <RevealCard index={4}>
        <div className="mt-6">
          <Button
            size="lg"
            className="group w-full"
            onClick={() => navigate("/impact")}
          >
            See impact
            <ArrowRight className="transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </RevealCard>
    </div>
  );
}
