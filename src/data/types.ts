export type Status =
  | "queued"
  | "grading"
  | "deciding"
  | "listed"
  | "saved"
  | "flagged";

export type Fate = "Resell" | "Refurbish" | "Donate" | "Recycle" | "Exchange";

export interface ProductPhoto {
  url: string;
  alt: string;
}

export interface Defect {
  id: string;
  label: string;
  severity: "minor" | "moderate" | "major";
  box: { x: number; y: number; w: number; h: number }; // 0–1 relative coords
}

export interface Grading {
  conditionGrade: "Like-New" | "Very Good" | "Good" | "Acceptable" | "Damaged";
  conditionScore: number;
  confidence: number;
  defects: Defect[];
  checks: { label: string; passed: boolean }[];
  graderModel: string;
  latencyMs: number;
  source: "live" | "fallback";
}

export interface FateEvaluation {
  fate: Fate;
  recoveryValue: number;
  refurbCost: number;
  logisticsCost: number;
  timeToSellDays: number;
  carbonDeltaKg: number;
  netValue: number;
}

export interface Decision {
  reasoningTrace: string[];
  evaluations: FateEvaluation[];
  chosenFate: Fate;
  confidence: number;
  channel: string;
  rationale: string;
  carbonSavedKg: number;
  decidedModel: string;
  source: "live" | "fallback";
}

export interface ReturnItem {
  id: string;
  sku: string;
  title: string;
  category: string;
  reason: string;
  orderValue: number;
  photos: ProductPhoto[];
  status: Status;
  isHero?: boolean;
  grading?: Grading;
  decision?: Decision;
}

export interface Buyer {
  id: string;
  name: string;
  matchScore: number;
  signal: string;
  budget: number;
  greenCreditsOffered: number;
}

export interface PreventionInsight {
  sku: string;
  title: string;
  returnRatePct: number;
  topReason: string;
  topReasonSharePct: number;
  fix: { before: string; after: string };
  projectedReductionPct: number;
}

export interface DashboardStats {
  valueRecoveredINR: number;
  co2DivertedKg: number;
  preventablePct: number;
  unitsSaved: number;
  unitsTotal: number;
  scale: { valueRecoveredUSD: string; co2AvoidedTonnes: string };
}
