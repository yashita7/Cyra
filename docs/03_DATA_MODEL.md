# 03 — Data Model, Seed Data & the Live Bedrock Layer

Screens read from typed seed data in `src/data/`; the two hero AI moments call the **Bedrock proxy** in `server/`. This file is the **single source of truth** for the demo numbers (the offline fallback) — keep every screen consistent with it.

## Folder layout
```
src/data/
  types.ts          // types below
  returns.ts        // ~12–16 returns (the shoe is the hero)
  comps.ts          // comparable listings + EV inputs for the hero item (the decision reasons over these)
  buyers.ts         // synthetic buyers (Person 2)
  prevention.ts     // prevention insight (Person 2)
  stats.ts          // dashboard stats (Person 2)
  cached/grading.json   // committed baseline grade (fallback)
  cached/decision.json  // committed baseline decision (fallback)
src/lib/api.ts      // front-end fetch helpers -> /api/grade, /api/decide
server/
  index.ts          // Express server: /api/grade, /api/decide
  bedrock.ts        // aws-sdk Bedrock calls (Nova) + JSON parsing
  cache.ts          // cache-and-fallback util (read/write cached/*.json)
  prompts.ts        // the grading + decision prompts
```

## Types (`types.ts`)
```ts
export type Status = "queued" | "grading" | "deciding" | "listed" | "saved" | "flagged";
export type Fate = "Resell" | "Refurbish" | "Donate" | "Recycle" | "Exchange";
export interface ProductPhoto { url: string; alt: string; }
export interface Defect { id: string; label: string; severity: "minor"|"moderate"|"major";
  box: { x:number; y:number; w:number; h:number }; } // 0–1 relative coords
export interface Grading { conditionGrade: "Like-New"|"Very Good"|"Good"|"Acceptable"|"Damaged";
  conditionScore: number; confidence: number; defects: Defect[];
  checks: { label:string; passed:boolean }[]; graderModel: string; latencyMs: number;
  source: "live" | "fallback"; }                      // so the UI can flag fallback on the ModelBadge
export interface FateEvaluation { fate: Fate; recoveryValue:number; refurbCost:number;
  logisticsCost:number; timeToSellDays:number; carbonDeltaKg:number; netValue:number; }
export interface Decision { reasoningTrace: string[]; evaluations: FateEvaluation[];
  chosenFate: Fate; confidence:number; channel:string; rationale:string; carbonSavedKg:number;
  decidedModel: string; source: "live" | "fallback"; }
export interface ReturnItem { id:string; sku:string; title:string; category:string;
  reason:string; orderValue:number; photos:ProductPhoto[]; status:Status; isHero?:boolean;
  grading?:Grading; decision?:Decision; }
export interface Buyer { id:string; name:string; matchScore:number; signal:string;
  budget:number; greenCreditsOffered:number; }
export interface PreventionInsight { sku:string; title:string; returnRatePct:number;
  topReason:string; topReasonSharePct:number; fix:{before:string; after:string};
  projectedReductionPct:number; }
export interface DashboardStats { valueRecoveredINR:number; co2DivertedKg:number;
  preventablePct:number; unitsSaved:number; unitsTotal:number;
  scale:{ valueRecoveredUSD:string; co2AvoidedTonnes:string }; }
```

## THE CANONICAL HERO RETURN (fallback values; live calls should land near these)
```ts
// returns.ts — hero item (isHero:true)
{
  id:"RTN-10481", sku:"SKU-4471", title:"Men's Road Running Shoes — Size 9",
  category:"Footwear", reason:"too small", orderValue:3499, status:"queued", isHero:true,
  photos:[ /* public/demo/shoe-*.jpg; alt text describing the shoe */ ],
}
```
Add **~12–15 filler returns** (electronics, apparel, home, toys; varied reasons/statuses) so the Inbox feels real — basic fields + `status` only.

### Fallback grade → `cached/grading.json`
```json
{ "conditionGrade":"Like-New","conditionScore":92,"confidence":94,
  "defects":[{"id":"d1","label":"Minor outsole wear","severity":"minor","box":{"x":0.55,"y":0.7,"w":0.3,"h":0.18}}],
  "checks":[{"label":"Both shoes present","passed":true},{"label":"Original box & laces","passed":true},
            {"label":"Authenticity verified","passed":true},{"label":"No functional damage","passed":true}],
  "graderModel":"Amazon Nova Pro","latencyMs":4200,"source":"fallback" }
```

### EV inputs the decision reasons over → `comps.ts` (seeded, stable)
```ts
export const heroEvaluations: FateEvaluation[] = [
  { fate:"Resell",   recoveryValue:2499, refurbCost:0,   logisticsCost:140, timeToSellDays:6,  carbonDeltaKg:1.8, netValue:2359 },
  { fate:"Refurbish",recoveryValue:2120, refurbCost:180, logisticsCost:140, timeToSellDays:11, carbonDeltaKg:1.2, netValue:1800 },
  { fate:"Exchange", recoveryValue:1640, refurbCost:0,   logisticsCost:160, timeToSellDays:3,  carbonDeltaKg:0.9, netValue:1480 },
  { fate:"Donate",   recoveryValue:0,    refurbCost:0,   logisticsCost:90,  timeToSellDays:0,  carbonDeltaKg:1.5, netValue:-90 },
  { fate:"Recycle",  recoveryValue:95,   refurbCost:0,   logisticsCost:80,  timeToSellDays:0,  carbonDeltaKg:0.0, netValue:15 },
];
```
`Resell` has the max `netValue` → the decision deterministically lands on Resell even though the reasoning is generated live.

### Fallback decision → `cached/decision.json`
The scripted reasoning trace + verdict (used if AWS is down). Reasoning lines:
```
"Analyzing returned item: Men's Running Shoes (SKU-4471)…"
"Condition: Like-New — 94% confidence. Minor outsole wear only."
"Return reason parsed: \u201Ctoo small\u201D \u2192 not a defect. Fully resellable."
"Retrieving comparable active listings… 3 matches found."
"Computing expected value across 5 fates…"
"Resell \u20B92,499 · Refurbish \u20B92,120 · Exchange \u20B91,640 · Donate \u20B90 · Recycle \u20B995"
"Net of \u20B9180 refurb + \u20B9140 logistics \u2192 Resell maximizes recovery."
"Sustainability: +1.8 kg CO\u2082e saved vs. recycling."
"Decision: RESELL via Amazon Warehouse Deals. Confidence 91%."
```
Verdict: `chosenFate:"Resell"`, `confidence:91`, `channel:"Amazon Warehouse Deals"`, `carbonSavedKg:1.8`, rationale: "Like-New condition and a non-defect return reason make resale the highest-value, fastest-moving, and second-greenest outcome — recovering ₹2,499 with minimal handling.", `decidedModel:"Amazon Nova Pro"`, `source:"fallback"`.

## The live Bedrock layer (`server/`)
**Why a server:** AWS credentials must never reach the browser. The React app calls our own endpoints; the server calls Bedrock.

- **`/api/grade`** (POST, body: image as base64 / a `demoItem` id) → `bedrock.ts` sends the image + grading prompt to **Amazon Nova Pro** (`amazon.nova-pro-v1:0`) via `@aws-sdk/client-bedrock-runtime` `InvokeModel`, requesting **strict JSON** matching `Grading`. Parse robustly; on parse/error/timeout, return `cached/grading.json` with `source:"fallback"`. On success, set `source:"live"`, fill `latencyMs`, and **write the result to `cached/grading.json`** (so the last good call is the new fallback / pre-warm).
- **`/api/decide`** (POST, body: the `Grading` + `heroEvaluations`) → Nova reasons over the provided evaluations and returns `{ reasoningTrace[], chosenFate, confidence, rationale }`. Constrain the prompt: *pick the fate with the highest net value, produce a concise step-by-step trace in the given style, keep it grounded in the numbers provided.* Since the data favors Resell, output is stable. Fallback = `cached/decision.json`. Cache good results.
- **`cache.ts`**: read/write helpers; always return something (never throw to the client).
- **`prompts.ts`**: the two prompts. Keep them strict about JSON and grounded in inputs.

**Run:** `concurrently` runs Vite + the Express server; Vite proxies `/api` to the server port (e.g. 8787). Front-end `src/lib/api.ts` exposes `gradeItem()` / `decideFate()` returning typed results.

## Env (gitignored `.env`, commit `.env.example`)
```
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
NOVA_MODEL_ID=amazon.nova-pro-v1:0
```

## Seed for Person 2 (create now)
- `stats.ts` → `{ valueRecoveredINR:420000, co2DivertedKg:1043, preventablePct:58, unitsSaved:96, unitsTotal:100, scale:{ valueRecoveredUSD:"$2B+", co2AvoidedTonnes:"1M+" } }`
- `prevention.ts` → `{ sku:"SKU-4471", title:"Men's Road Running Shoes", returnRatePct:22, topReason:"smaller than expected", topReasonSharePct:61, fix:{ before:"\u201CTrue to size.\u201D", after:"\u201CRuns small — order half a size up. See updated fit guide + scale photo.\u201D" }, projectedReductionPct:38 }`
- `buyers.ts` → 3 buyers (matchScore 94/88/81, a `signal` each, budgets, `greenCreditsOffered` ~120).

## Images (tell me what you need)
Grading needs 1–3 running-shoe photos. **Instruct me to drop my own into `public/demo/shoe-1.jpg` etc.**; don't download images yourself. If absent, render a neutral placeholder so the screen works, and remind me to add real photos before recording (the live grade needs a real image).
