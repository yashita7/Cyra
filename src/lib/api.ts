import type { Decision, FateEvaluation, Grading } from "@/data/types";
import gradingFallback from "@/data/cached/grading.json";
import decisionFallback from "@/data/cached/decision.json";

/**
 * Front-end fetch helpers → the server-side Bedrock proxy.
 * The proxy ALWAYS returns something (cache-and-fallback), but we also guard
 * here so the UI never throws even if the dev server isn't running at all.
 */

const TIMEOUT_MS = 20000;

async function postJSON<T>(url: string, body: unknown, fallback: T): Promise<T> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } catch (err) {
    // Server unreachable → use the committed baseline so the demo never breaks.
    console.warn(`[cyra] ${url} unreachable, using committed fallback`, err);
    return fallback;
  }
}

/** Screen 3 — LIVE Amazon Nova grading of the product photo. */
export async function gradeItem(itemId: string): Promise<Grading> {
  return postJSON<Grading>(
    "/api/grade",
    { itemId },
    gradingFallback as Grading,
  );
}

/** Screen 4 — LIVE Amazon Nova decision reasoning over the seeded evaluations. */
export async function decideFate(
  grading: Grading,
  evaluations: FateEvaluation[],
): Promise<Decision> {
  return postJSON<Decision>(
    "/api/decide",
    { grading, evaluations },
    decisionFallback as Decision,
  );
}
