import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, Check, Leaf, ShieldCheck, Clock } from "lucide-react";
import { getReturn } from "@/data/returns";
import gradingCache from "@/data/cached/grading.json";
import decisionCache from "@/data/cached/decision.json";
import type { Grading, Decision } from "@/data/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RevealCard } from "@/components/motion/RevealCard";
import { ModelBadge } from "@/components/layout/ModelBadge";
import { ProductImage } from "@/components/layout/ProductImage";
import { DotBackdrop } from "@/components/layout/Backgrounds";
import { inr } from "@/lib/utils";

/** Timeline step for the Product Passport provenance. */
interface TimelineStep {
  label: string;
  detail: string;
  icon: React.ElementType;
  status: "complete";
}

export default function Listing() {
  const { id = "RTN-10481" } = useParams();
  const navigate = useNavigate();
  const item = getReturn(id);
  const [activePhoto, setActivePhoto] = useState(0);

  // Use cached grading + decision as the listing basis (already ran on Screens 3 & 4)
  const grading: Grading = gradingCache as Grading;
  const decision: Decision = decisionCache as Decision;

  if (!item) {
    return (
      <div className="grid h-full place-items-center text-muted">
        Return {id} not found.
      </div>
    );
  }

  // Auto-generated listing description
  const description = `${item.category} in ${grading.conditionGrade} condition. ${grading.defects.length > 0 ? `Minor cosmetic wear noted: ${grading.defects[0].label.toLowerCase()}.` : "No visible defects."} Original packaging included. Professionally graded and authenticated. Perfect for sustainable shoppers.`;

  // Product Passport timeline
  const timeline: TimelineStep[] = [
    {
      label: "Item Returned",
      detail: `Customer reason: "${item.reason}"`,
      icon: Clock,
      status: "complete",
    },
    {
      label: "Graded Like-New",
      detail: `${grading.conditionScore}/100 score · ${grading.confidence}% confidence`,
      icon: ShieldCheck,
      status: "complete",
    },
    {
      label: "Defect Noted",
      detail:
        grading.defects.length > 0
          ? grading.defects[0].label
          : "No defects found",
      icon: Check,
      status: "complete",
    },
    {
      label: "Listed for Resale",
      detail: `${decision.channel} · ${inr(decision.evaluations[0].recoveryValue)}`,
      icon: ArrowRight,
      status: "complete",
    },
  ];

  return (
    <div className="relative mx-auto max-w-7xl px-6 py-8">
      <DotBackdrop />

      {/* Header */}
      <div className="relative mb-6 flex items-center justify-between">
        <div>
          <p className="section-label">Auto-Listing · {item.sku}</p>
          <h2 className="text-[26px] font-semibold text-white">{item.title}</h2>
        </div>
        <ModelBadge state="idle" />
      </div>

      <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* LEFT — Product Image */}
        <div className="lg:col-span-5">
          <RevealCard index={0}>
            <div className="surface overflow-hidden p-5">
              <div className="aspect-square overflow-hidden rounded-xl border border-slate/60 bg-ink/60">
                <ProductImage
                  src={item.photos[activePhoto]?.url}
                  alt={item.photos[activePhoto]?.alt}
                  className="h-full w-full"
                  hint="Hero product image"
                />
              </div>
              <div className="mt-4 flex gap-2">
                {item.photos.slice(0, 3).map((p, i) => {
                  const active = i === activePhoto;
                  return (
                    <button
                      key={i}
                      onClick={() => setActivePhoto(i)}
                      className={`h-16 w-16 overflow-hidden rounded-lg border transition-all ${
                        active
                          ? "border-orange ring-1 ring-orange/50"
                          : "border-slate/50 opacity-60 hover:opacity-100 hover:border-slate"
                      }`}
                    >
                      <ProductImage src={p.url} alt={p.alt} className="h-full w-full" hint="" />
                    </button>
                  );
                })}
              </div>
            </div>
          </RevealCard>
        </div>

        {/* RIGHT — Listing Card + Passport */}
        <div className="flex flex-col gap-6 lg:col-span-7">
          {/* Generated Listing Card */}
          <RevealCard index={1}>
            <div className="surface relative overflow-hidden p-6">
              <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-orange/10 blur-3xl" />
              <div className="relative">
                <div className="mb-3 flex items-center gap-2">
                  <Badge variant="success">{grading.conditionGrade}</Badge>
                  <Badge variant="orange">{decision.channel}</Badge>
                </div>
                <h3 className="text-[22px] font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-muted">
                  {description}
                </p>
                <div className="mt-5 flex items-end gap-3">
                  <span className="text-[40px] font-bold text-orange">
                    {inr(decision.evaluations[0].recoveryValue)}
                  </span>
                  <span className="mb-2 text-[16px] text-muted line-through">
                    {inr(item.orderValue)}
                  </span>
                  <span className="mb-2 rounded-md bg-success/10 px-2 py-1 text-[13px] font-semibold text-success">
                    {Math.round(
                      ((item.orderValue - decision.evaluations[0].recoveryValue) /
                        item.orderValue) *
                        100,
                    )}
                    % off
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Badge variant="success" className="!text-[11px]">
                    <Leaf className="h-3 w-3" />
                    +{decision.carbonSavedKg} kg CO₂e saved
                  </Badge>
                  <Badge className="!text-[11px]">
                    <ShieldCheck className="h-3 w-3" />
                    Authenticity verified
                  </Badge>
                </div>
              </div>
            </div>
          </RevealCard>

          {/* Product Passport */}
          <RevealCard index={2}>
            <div className="surface p-6">
              <div className="mb-4 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-sky" />
                <p className="section-label !text-sky">Product Passport</p>
              </div>
              <p className="mb-5 text-[13px] text-muted">
                Verified condition timeline — the trustworthy refurbished experience.
              </p>

              {/* Timeline */}
              <div className="space-y-4">
                {timeline.map((step, i) => {
                  const Icon = step.icon;
                  const isLast = i === timeline.length - 1;
                  return (
                    <div key={i} className="relative flex gap-3">
                      {/* Connector line */}
                      {!isLast && (
                        <div className="absolute left-[15px] top-8 h-full w-px bg-slate/40" />
                      )}
                      {/* Icon */}
                      <div className="relative z-10 grid h-[30px] w-[30px] shrink-0 place-items-center rounded-full border border-slate/60 bg-squid">
                        <Icon className="h-4 w-4 text-success" />
                      </div>
                      {/* Content */}
                      <div className="flex-1 pb-2">
                        <p className="text-[14px] font-semibold text-white">
                          {step.label}
                        </p>
                        <p className="text-[13px] text-muted">{step.detail}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Authenticity Row */}
              <div className="mt-5 flex items-center gap-2 rounded-xl border border-success/30 bg-success/5 p-3">
                <Check className="h-4 w-4 text-success" strokeWidth={3} />
                <span className="text-[13px] font-semibold text-success">
                  Authenticity verified by {grading.graderModel}
                </span>
              </div>

              {/* Carbon Badge */}
              <div className="mt-3 flex items-center gap-2 rounded-xl border border-success/30 bg-success/5 p-3">
                <Leaf className="h-4 w-4 text-success" />
                <span className="text-[13px] text-muted">
                  <span className="font-semibold text-success">
                    +{decision.carbonSavedKg} kg CO₂e saved
                  </span>{" "}
                  vs. recycling this item
                </span>
              </div>
            </div>
          </RevealCard>

          {/* CTA */}
          <RevealCard index={3}>
            <Button
              size="lg"
              className="group w-full"
              onClick={() => navigate(`/buyers/${id}`)}
            >
              Find buyers
              <ArrowRight className="transition-transform group-hover:translate-x-1" />
            </Button>
          </RevealCard>
        </div>
      </div>
    </div>
  );
}
