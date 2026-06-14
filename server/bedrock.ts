import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Decision, FateEvaluation, Grading } from "../src/data/types";
import {
  DECISION_SYSTEM,
  GRADING_SYSTEM,
  decisionUserPrompt,
  gradingUserPrompt,
} from "./prompts.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REGION = process.env.AWS_REGION || "us-east-1";
// Nova on-demand requires a regional inference-profile id (us-east-1 → "us." prefix),
// not the bare model id. Overridable via NOVA_MODEL_ID.
const MODEL_ID = process.env.NOVA_MODEL_ID || "us.amazon.nova-pro-v1:0";

export function hasCredentials(): boolean {
  return Boolean(
    process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY,
  );
}

let client: BedrockRuntimeClient | null = null;
function getClient(): BedrockRuntimeClient {
  if (!client) client = new BedrockRuntimeClient({ region: REGION });
  return client;
}

interface NovaContent {
  text?: string;
  image?: { format: string; source: { bytes: string } };
}

/** Low-level Nova InvokeModel call. Returns the model's text output. */
async function invokeNova(
  system: string,
  content: NovaContent[],
  maxTokens = 1200,
): Promise<string> {
  const body = {
    system: [{ text: system }],
    messages: [{ role: "user", content }],
    inferenceConfig: { maxTokens, temperature: 0.3, topP: 0.9 },
  };

  const res = await getClient().send(
    new InvokeModelCommand({
      modelId: MODEL_ID,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify(body),
    }),
  );

  const decoded = JSON.parse(new TextDecoder().decode(res.body));
  const text: string =
    decoded?.output?.message?.content?.[0]?.text ??
    decoded?.content?.[0]?.text ??
    "";
  return text;
}

/** Robustly pull the first JSON object out of a model response. */
function parseJSON<T>(raw: string): T {
  const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("no JSON object in response");
  return JSON.parse(cleaned.slice(start, end + 1)) as T;
}

/** Load ALL available demo product photos as base64 for the multimodal grade. */
async function loadDemoImages(): Promise<{ bytes: string; format: string }[]> {
  const dir = path.resolve(__dirname, "../public/demo");
  const names = [
    "shoe-1.jpg", "shoe-1.jpeg", "shoe-1.png",
    "shoe-2.jpg", "shoe-2.jpeg", "shoe-2.png",
    "shoe-3.jpg", "shoe-3.jpeg", "shoe-3.png",
  ];
  const images: { bytes: string; format: string }[] = [];
  const seen = new Set<string>();
  for (const name of names) {
    const stem = name.replace(/\.[^.]+$/, ""); // shoe-1, shoe-2, shoe-3
    if (seen.has(stem)) continue;
    try {
      const buf = await fs.readFile(path.join(dir, name));
      images.push({
        bytes: buf.toString("base64"),
        format: name.endsWith(".png") ? "png" : "jpeg",
      });
      seen.add(stem);
    } catch {
      /* try next extension / file */
    }
  }
  return images;
}

/** LIVE grading via Nova (multimodal). Throws on any failure — caller falls back. */
export async function gradeWithNova(context: {
  title: string;
  category: string;
  reason: string;
}): Promise<Grading> {
  const images = await loadDemoImages();
  const content: NovaContent[] = [
    { text: gradingUserPrompt({ ...context, photoCount: images.length }) },
  ];
  // send every angle so Nova grades the real item across all photos
  for (const img of images) {
    content.push({ image: { format: img.format, source: { bytes: img.bytes } } });
  }

  const text = await invokeNova(GRADING_SYSTEM, content, 1000);
  const parsed = parseJSON<Omit<Grading, "latencyMs" | "source">>(text);

  return {
    ...parsed,
    graderModel: parsed.graderModel || "Amazon Nova Pro",
    latencyMs: 0, // filled by caller
    source: "live",
  };
}

/** LIVE decision reasoning via Nova. Throws on any failure — caller falls back. */
export async function decideWithNova(
  grading: Grading,
  evaluations: FateEvaluation[],
): Promise<Decision> {
  const text = await invokeNova(
    DECISION_SYSTEM,
    [{ text: decisionUserPrompt(grading, evaluations) }],
    1400,
  );
  const parsed = parseJSON<
    Pick<
      Decision,
      "reasoningTrace" | "chosenFate" | "confidence" | "channel" | "rationale" | "carbonSavedKg"
    >
  >(text);

  return {
    ...parsed,
    evaluations,
    decidedModel: "Amazon Nova Pro",
    source: "live",
  };
}

export const bedrockMeta = { REGION, MODEL_ID };
