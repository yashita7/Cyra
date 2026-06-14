import type { FateEvaluation, Grading } from "../src/data/types";

/**
 * GRADING — Nova inspects the product photo and returns strict JSON matching
 * the `Grading` shape (minus server-filled fields: latencyMs, source).
 */
export const GRADING_SYSTEM = `You are Cyra, an expert Amazon returns condition-grader.
You inspect a photo of a returned product and assess its resale condition.
You are precise, conservative, and you ONLY output valid JSON — no prose, no markdown fences.`;

export function gradingUserPrompt(context: {
  title: string;
  category: string;
  reason: string;
  photoCount?: number;
}): string {
  const n = context.photoCount ?? 1;
  const photoLine =
    n > 1
      ? `You are given ${n} photos of the SAME item from different angles (side, top, outsole). Inspect all of them together and grade the single item.`
      : `Inspect the photo and grade the item.`;
  return `Grade this returned item for resale.

Item: ${context.title}
Category: ${context.category}
Customer return reason: "${context.reason}"

${photoLine}

Return ONLY this JSON object (no other text):
{
  "conditionGrade": one of "Like-New" | "Very Good" | "Good" | "Acceptable" | "Damaged",
  "conditionScore": integer 0-100,
  "confidence": integer 0-100,
  "defects": [ { "id": "d1", "label": "short defect name", "severity": "minor"|"moderate"|"major", "box": { "x": 0-1, "y": 0-1, "w": 0-1, "h": 0-1 } } ],
  "checks": [ { "label": "short check name", "passed": true|false } ],
  "graderModel": "Amazon Nova Pro"
}

Rules:
- "box" coordinates are RELATIVE to the image (0 = left/top, 1 = right/bottom).
- Include 1-3 inspection checks relevant to this category (e.g. completeness, authenticity, functional damage).
- If the return reason is a fit/preference issue (e.g. "too small"), it is NOT a defect — grade on physical condition only.
- Be conservative but fair; minor cosmetic wear still maps to "Like-New" or "Very Good".`;
}

/**
 * DECISION — Nova reasons over the seeded evaluations and returns the trace +
 * verdict. It must pick the fate with the highest netValue and stay grounded.
 */
export const DECISION_SYSTEM = `You are Cyra, an autonomous Amazon returns-routing agent.
Given a grading result and pre-computed expected-value math for each possible fate,
you choose the destination that MAXIMIZES net recovered value, and you explain your
reasoning as a concise step-by-step trace. You stay strictly grounded in the numbers
provided — never invent values. You ONLY output valid JSON — no prose, no markdown.`;

export function decisionUserPrompt(
  grading: Grading,
  evaluations: FateEvaluation[],
): string {
  const evalLines = evaluations
    .map(
      (e) =>
        `- ${e.fate}: recovery ₹${e.recoveryValue}, refurb ₹${e.refurbCost}, logistics ₹${e.logisticsCost}, net ₹${e.netValue}, ${e.carbonDeltaKg}kg CO2e saved, ~${e.timeToSellDays}d to sell`,
    )
    .join("\n");

  return `A returned item has been graded:
- Condition: ${grading.conditionGrade} (score ${grading.conditionScore}, confidence ${grading.confidence}%)
- Defects: ${grading.defects.map((d) => d.label).join(", ") || "none significant"}

Expected-value math for each possible fate (already computed — use these EXACT numbers):
${evalLines}

Choose the fate with the HIGHEST net value. Return ONLY this JSON object:
{
  "reasoningTrace": [ 8-9 short lines, each one analytical step, in this style:
      "Analyzing returned item: <name>…",
      "Condition: <grade> — <confidence>% confidence.",
      "Return reason parsed → resellable or not.",
      "Retrieving comparable active listings…",
      "Computing expected value across 5 fates…",
      "<one line listing the net values>",
      "<one line explaining why the winner maximizes recovery>",
      "Sustainability: +<kg> CO₂e saved.",
      "Decision: <FATE> via <channel>. Confidence <n>%." ],
  "chosenFate": "Resell" | "Refurbish" | "Donate" | "Recycle" | "Exchange",
  "confidence": integer 0-100,
  "channel": "a plausible Amazon resale channel, e.g. Amazon Warehouse Deals",
  "rationale": "1-2 sentence justification grounded in the numbers",
  "carbonSavedKg": number (the chosen fate's CO2e saved)
}

Keep every number consistent with the math above. Use ₹ for currency in the trace.`;
}
