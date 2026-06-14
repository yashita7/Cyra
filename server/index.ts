import "dotenv/config";
import express from "express";
import cors from "cors";
import {
  bedrockMeta,
  decideWithNova,
  gradeWithNova,
  hasCredentials,
} from "./bedrock.js";
import { readCache, writeCache } from "./cache.js";
import { heroReturn } from "../src/data/returns.js";
import { heroEvaluations } from "../src/data/comps.js";
import type { Decision, Grading } from "../src/data/types";

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const PORT = Number(process.env.API_PORT || 8787);

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
 * Always returns a Grading (never errors to the client).
 */
app.post("/api/grade", async (_req, res) => {
  const fallback = await readCache<Grading>("grading");

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
    await writeCache("grading", grading); // last-good becomes new fallback
    console.log(`[grade] live ✓ ${grading.conditionGrade} in ${grading.latencyMs}ms`);
    return res.json(grading);
  } catch (err) {
    console.warn("[grade] live failed → fallback:", (err as Error).message);
    return res.json(fallback ?? { source: "fallback" });
  }
});

/**
 * POST /api/decide — LIVE Amazon Nova decision reasoning with cache-and-fallback.
 * Body: { grading, evaluations }. Always returns a Decision.
 */
app.post("/api/decide", async (req, res) => {
  const fallback = await readCache<Decision>("decision");
  const grading: Grading | undefined = req.body?.grading;
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
    console.warn("[decide] live failed → fallback:", (err as Error).message);
    return res.json(fallback ?? { source: "fallback" });
  }
});

app.listen(PORT, () => {
  console.log(`\n  ⚡ Cyra API on http://localhost:${PORT}`);
  console.log(
    `  Bedrock: ${hasCredentials() ? "LIVE (credentials found)" : "FALLBACK MODE (no AWS creds — using committed cache)"}`,
  );
  console.log(`  Region: ${bedrockMeta.REGION} · Model: ${bedrockMeta.MODEL_ID}\n`);
});
