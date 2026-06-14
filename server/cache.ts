import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CACHE_DIR = path.resolve(__dirname, "../src/data/cached");

export type CacheName = "grading" | "decision";

/** Read the committed/last-good cached result. Never throws. */
export async function readCache<T>(name: CacheName): Promise<T | null> {
  try {
    const raw = await fs.readFile(path.join(CACHE_DIR, `${name}.json`), "utf-8");
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`[cache] could not read ${name}.json`, err);
    return null;
  }
}

/**
 * Persist a good live result so it becomes the new fallback / pre-warm.
 * Never throws — caching failure must not break the API response.
 */
export async function writeCache(name: CacheName, data: unknown): Promise<void> {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
    await fs.writeFile(
      path.join(CACHE_DIR, `${name}.json`),
      JSON.stringify(data, null, 2),
      "utf-8",
    );
  } catch (err) {
    console.warn(`[cache] could not write ${name}.json`, err);
  }
}
