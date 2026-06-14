// Vercel serverless function wrapper for Express API
import express from "express";
import cors from "cors";
import {
  bedrockMeta,
  decideWithNova,
  gradeWithNova,
  hasCredentials,
} from "../server/bedrock.js";
import { readCache, writeCache } from "../server/cache.js";
import { heroReturn } from "../src/data/returns.js";
import { heroEvaluations } from "../src/data/comps.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    bedrock: hasCredentials() ? "configured" : "no-credentials (fallback mode)",
    region: bedrockMeta.REGION,
    model: bedrockMeta.MODEL_ID,
  });
});

/**
 * POST /api/grade — LIVE Amazon Nova grading with cache-and-fallback.
 */
app.post("/api/grade", async (_req, res) => {
  const fallback = await readCache("grading");

  if (!hasCredentials()) {
    return res.json(fallback ?? { source: "fallback" });
  }

  const started = Date.now();
  try {
    const grading = await gradeWithNova({
      title: heroReturn.title,
      category: heroReturn.category,
      reason: heroReturn.reason,
    });
    grading.latencyMs = Date.now() - started;
    await writeCache("grading", grading);
    console.log(`[grade] live ✓ ${grading.conditionGrade} in ${grading.latencyMs}ms`);
    return res.json(grading);
  } catch (err) {
    console.warn("[grade] live failed → fallback:", err.message);
    return res.json(fallback ?? { source: "fallback" });
  }
});

/**
 * POST /api/decide — LIVE Amazon Nova decision reasoning with cache-and-fallback.
 */
app.post("/api/decide", async (req, res) => {
  const fallback = await readCache("decision");
  const grading = req.body?.grading;
  const evaluations = req.body?.evaluations ?? heroEvaluations;

  if (!hasCredentials() || !grading) {
    return res.json(fallback ?? { source: "fallback" });
  }

  try {
    const decision = await decideWithNova(grading, evaluations);
    await writeCache("decision", decision);
    console.log(`[decide] live ✓ ${decision.chosenFate} @ ${decision.confidence}%`);
    return res.json(decision);
  } catch (err) {
    console.warn("[decide] live failed → fallback:", err.message);
    return res.json(fallback ?? { source: "fallback" });
  }
});

// Export for Vercel serverless
export default app;
