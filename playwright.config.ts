import { defineConfig, devices } from "@playwright/test";

/**
 * E2E config. Boots the full app (Vite web + Express API via `npm run dev`)
 * and runs the demo flow against it. Fallback mode (no AWS) is exercised by
 * default so tests are deterministic and never depend on live Bedrock.
 */
export default defineConfig({
  testDir: "./e2e",
  // owner runs 8 parallel workers — Mac handles it; tests are independent
  // (fallback mode does no cache writes, so parallel runs stay clean).
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 8,
  reporter: [["list"]],
  timeout: 30_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: "http://localhost:5173",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    // deterministic + fast: typewriter/count-up resolve to final state instantly,
    // and this also exercises the prefers-reduced-motion code paths.
    reducedMotion: "reduce",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    stdout: "ignore",
    stderr: "pipe",
  },
});
