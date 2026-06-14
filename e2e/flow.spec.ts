import { test, expect, type Page } from "@playwright/test";

/**
 * End-to-end coverage of Person 1's scope:
 *  - the demo flow Hero → Inbox → Grade (live/fallback) → Decision
 *  - the two live AI panels render genuine results + the Bedrock ModelBadge
 *  - Person 2 stubs route cleanly
 *  - the motion-kit showcase renders
 *  - no console errors across the whole journey
 *
 * Runs against fallback mode (no AWS creds) so it's deterministic.
 */

/** Collect page console errors; ignore benign noise. */
function trackErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      const t = msg.text();
      // the api helper intentionally warns when the proxy is unreachable; ignore
      if (t.includes("favicon") || t.includes("[cyra]")) return;
      errors.push(t);
    }
  });
  page.on("pageerror", (err) => errors.push(err.message));
  return errors;
}

test("Screen 1 — Hero renders headline + CTA", async ({ page }) => {
  const errors = trackErrors(page);
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /its best second life/i }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: /Open Console/i })).toBeVisible();
  await expect(page.getByText(/Autonomous returns intelligence/i)).toBeVisible();
  // product surface must NOT read like a hackathon entry
  await expect(page.getByText(/HackOn/i)).toHaveCount(0);
  await expect(page.getByText(/Powered by/i)).toHaveCount(0);
  expect(errors, errors.join("\n")).toEqual([]);
});

test("Screen 2 — Inbox shows stats + hero return card", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Open Console/i }).click();
  await expect(page).toHaveURL(/\/inbox$/);
  await expect(
    page.getByRole("heading", { name: "Returns Inbox", level: 2 }),
  ).toBeVisible();
  // hero card present and tagged NEW
  await expect(page.getByText("Men's Road Running Shoes — Size 9")).toBeVisible();
  await expect(page.getByText("NEW", { exact: true })).toBeVisible();
  // stat tiles
  await expect(page.getByText("Pending")).toBeVisible();
  await expect(page.getByText("Auto-resolved today")).toBeVisible();
});

test("Screen 3 — Live Grading produces a grade + ModelBadge + enabled CTA", async ({
  page,
}) => {
  await page.goto("/inbox");
  await page.getByText("Men's Road Running Shoes — Size 9").click();
  await expect(page).toHaveURL(/\/grade\/RTN-10481$/);

  // the Bedrock badge is present (visible AWS)
  await expect(page.getByText("Amazon Bedrock · Nova Pro").first()).toBeVisible();

  // grading result reveals
  await expect(page.getByText("Like-New").first()).toBeVisible({ timeout: 15000 });
  await expect(page.getByText("Inspection checklist")).toBeVisible();
  await expect(page.getByText(/Graded by Amazon Nova Pro/)).toBeVisible();

  // all three photo angles are shown as switchable thumbnails
  const thumbs = page.getByRole("button", { name: /View photo/i });
  await expect(thumbs).toHaveCount(3);
  await thumbs.nth(1).click(); // switch to photo 2 — should not crash
  await thumbs.nth(0).click(); // back to the graded photo

  // CTA becomes enabled
  const cta = page.getByRole("button", { name: /Run decision/i });
  await expect(cta).toBeEnabled({ timeout: 15000 });
});

test("Screen 4 — Decision Theater streams reasoning + lands on RESELL", async ({
  page,
}) => {
  await page.goto("/decision/RTN-10481");

  // Bedrock badge + EV bars
  await expect(page.getByText("Amazon Bedrock · Nova Pro").first()).toBeVisible();
  await expect(page.getByText("Expected value across 5 fates")).toBeVisible();

  // reasoning trace appears (reduced motion → all lines at once)
  await expect(page.getByText(/Decision: RESELL/i)).toBeVisible({ timeout: 15000 });

  // EV bars for all five fates
  for (const fate of ["Resell", "Refurbish", "Exchange", "Donate", "Recycle"]) {
    await expect(page.getByText(fate, { exact: true })).toBeVisible();
  }

  // verdict card
  await expect(page.getByRole("heading", { name: /Routing/ })).toBeVisible();
  await expect(page.getByText("RESELL", { exact: true })).toBeVisible({ timeout: 15000 });
  await expect(
    page.getByText("Amazon Warehouse Deals", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("+1.8 kg CO₂e saved", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: /Create listing/i })).toBeVisible();
});

test("Full demo flow Hero → Inbox → Grade → Decision → Listing → Buyers → Prevention → Impact (no console errors)", async ({
  page,
}) => {
  const errors = trackErrors(page);

  // Hero → Inbox
  await page.goto("/");
  await page.getByRole("button", { name: /Open Console/i }).click();
  await expect(page).toHaveURL(/\/inbox$/);

  // Inbox → Grade
  await page.getByText("Men's Road Running Shoes — Size 9").click();
  await expect(page).toHaveURL(/\/grade\/RTN-10481$/);

  // Grade → Decision
  const runDecision = page.getByRole("button", { name: /Run decision/i });
  await expect(runDecision).toBeEnabled({ timeout: 15000 });
  await runDecision.click();
  await expect(page).toHaveURL(/\/decision\/RTN-10481$/);
  await expect(page.getByText("RESELL", { exact: true })).toBeVisible({ timeout: 15000 });

  // Decision → Listing
  await page.getByRole("button", { name: /Create listing/i }).click();
  await expect(page).toHaveURL(/\/listing\/RTN-10481$/);
  await expect(page.getByText("₹2,499")).toBeVisible();

  // Listing → Buyers
  await page.getByRole("button", { name: /Find buyers/i }).click();
  await expect(page).toHaveURL(/\/buyers\/RTN-10481$/);
  await expect(page.getByText("94%")).toBeVisible();

  // Buyers → Prevention
  await page.getByRole("button", { name: /View prevention insights/i }).click();
  await expect(page).toHaveURL(/\/prevention$/);
  await expect(page.getByText("SKU-4471")).toBeVisible();

  // Prevention → Impact
  await page.getByRole("button", { name: /See impact/i }).click();
  await expect(page).toHaveURL(/\/impact$/);
  await expect(page.getByText("₹4.2L")).toBeVisible({ timeout: 5000 });

  expect(errors, errors.join("\n")).toEqual([]);
});

test("Screen 5 — Listing renders product card + Product Passport + thumbnail switching", async ({
  page,
}) => {
  const errors = trackErrors(page);
  await page.goto("/listing/RTN-10481");

  // Screen title
  await expect(
    page.getByRole("heading", { name: /Men's Road Running Shoes/i }),
  ).toBeVisible();

  // Listing card with price
  await expect(page.getByText("₹2,499")).toBeVisible();
  await expect(page.getByText("Like-New")).toBeVisible();
  await expect(page.getByText("Amazon Warehouse Deals")).toBeVisible();
  await expect(page.getByText("+1.8 kg CO₂e saved")).toBeVisible();

  // Product Passport timeline
  await expect(page.getByText("Product Passport")).toBeVisible();
  await expect(page.getByText("Item Returned")).toBeVisible();
  await expect(page.getByText("Graded Like-New")).toBeVisible();
  await expect(page.getByText("Listed for Resale")).toBeVisible();

  // Thumbnail switching works (3 thumbnails should be present)
  const thumbs = page.locator("button").filter({ has: page.locator("img") });
  const thumbnailCount = await thumbs.count();
  expect(thumbnailCount).toBeGreaterThanOrEqual(3);

  // Click thumbnail #2 to switch view
  await thumbs.nth(1).click();
  // Should not crash (verified by no errors)

  // CTA button
  await expect(page.getByRole("button", { name: /Find buyers/i })).toBeVisible();

  expect(errors, errors.join("\n")).toEqual([]);
});

test("Screen 6 — Buyers shows 3 buyer cards with match scores + ConfidenceRings", async ({
  page,
}) => {
  const errors = trackErrors(page);
  await page.goto("/buyers/RTN-10481");

  // Screen title
  await expect(
    page.getByRole("heading", { name: /AI-matched buyers/i }),
  ).toBeVisible();

  // Tech tag for Nova Embeddings
  await expect(
    page.getByText(/Amazon Nova Multimodal Embeddings/i),
  ).toBeVisible();

  // All three buyer cards with expected match scores
  await expect(page.getByText("94%")).toBeVisible(); // top match score
  await expect(page.getByText("88%")).toBeVisible();
  await expect(page.getByText("81%")).toBeVisible();

  // ConfidenceRings rendered (SVG elements)
  const rings = page.locator("svg circle[stroke]");
  expect(await rings.count()).toBeGreaterThanOrEqual(3);

  // Green Credits badges
  await expect(page.getByText(/Earn.*Green Credits/i).first()).toBeVisible();

  // Notify buttons
  const notifyButtons = page.getByRole("button", { name: /Send offer/i });
  expect(await notifyButtons.count()).toBe(3);

  // Summary stats
  await expect(page.getByText("3")).toBeVisible(); // matched buyers count
  await expect(page.getByText("Matched buyers")).toBeVisible();

  // CTA
  await expect(
    page.getByRole("button", { name: /View prevention insights/i }),
  ).toBeVisible();

  expect(errors, errors.join("\n")).toEqual([]);
});

test("Screen 7 — Prevention shows chart + flagged SKU table + before/after diff + gauge", async ({
  page,
}) => {
  const errors = trackErrors(page);
  await page.goto("/prevention");

  // Screen title
  await expect(
    page.getByRole("heading", { name: /Upstream Prevention Intelligence/i }),
  ).toBeVisible();

  // Return reason cluster chart (recharts renders via SVG)
  await expect(page.getByText("Return reason clusters")).toBeVisible();
  const chartSvg = page.locator("svg").first();
  await expect(chartSvg).toBeVisible();

  // Flagged SKU table with SKU-4471 highlighted
  await expect(page.getByText("Flagged SKUs")).toBeVisible();
  await expect(page.getByText("SKU-4471")).toBeVisible();
  await expect(page.getByText("22%")).toBeVisible(); // return rate
  await expect(page.getByText("smaller than expected")).toBeVisible();
  await expect(page.getByText("(61% of returns)")).toBeVisible();

  // Before/After diff card
  await expect(page.getByText("Agent-written catalog fix")).toBeVisible();
  await expect(page.getByText(/True to size/i)).toBeVisible(); // before
  await expect(page.getByText(/order half a size up/i)).toBeVisible(); // after

  // Projected reduction gauge (-38%)
  await expect(page.getByText("Projected impact")).toBeVisible();
  await expect(page.getByText("38%")).toBeVisible();
  await expect(page.getByText("fewer returns")).toBeVisible();

  // CTA
  await expect(page.getByRole("button", { name: /See impact/i })).toBeVisible();

  expect(errors, errors.join("\n")).toEqual([]);
});

test("Screen 8 — Impact shows 4 counters + scale toggle + Climate Pledge", async ({
  page,
}) => {
  const errors = trackErrors(page);
  await page.goto("/impact");

  // Screen title
  await expect(
    page.getByRole("heading", { name: /Real-Time Sustainability Impact/i }),
  ).toBeVisible();

  // Scale toggle button
  const scaleToggle = page.getByRole("button", {
    name: /Toggle Amazon scale projection/i,
  });
  await expect(scaleToggle).toBeVisible();

  // Four counter tiles (all should have AnimatedNumber rendered)
  await expect(page.getByText("Value Recovered")).toBeVisible();
  await expect(page.getByText("CO₂ Diverted")).toBeVisible();
  await expect(page.getByText("Preventable Returns")).toBeVisible();
  await expect(page.getByText("Units Saved")).toBeVisible();

  // Initial values (non-scaled)
  await expect(page.getByText("₹4.2L")).toBeVisible({ timeout: 5000 });
  await expect(page.getByText("1,043 kg")).toBeVisible();
  await expect(page.getByText("58%")).toBeVisible();
  await expect(page.getByText("96/100")).toBeVisible();

  // Click scale toggle
  await scaleToggle.click();

  // Scaled values appear
  await expect(page.getByText("$2B+")).toBeVisible({ timeout: 3000 });
  await expect(page.getByText("1M+")).toBeVisible();

  // Climate Pledge panel reveals
  await expect(page.getByText(/Climate Pledge/i)).toBeVisible();
  await expect(page.getByText(/net-zero carbon by 2040/i)).toBeVisible();

  expect(errors, errors.join("\n")).toEqual([]);
});

test("Architecture view renders stack layers and data flow", async ({ page }) => {
  const errors = trackErrors(page);
  await page.goto("/architecture");

  // Screen title
  await expect(
    page.getByRole("heading", { name: "Cyra Architecture" }),
  ).toBeVisible();

  // All 4 stack layers
  await expect(page.getByText("AI & Intelligence Layer")).toBeVisible();
  await expect(page.getByText("Event Processing & Orchestration")).toBeVisible();
  await expect(page.getByText("Data & Storage Layer")).toBeVisible();
  await expect(page.getByText("Frontend & Experience")).toBeVisible();

  // Key AWS services mentioned
  await expect(page.getByText(/Amazon Bedrock AgentCore/i)).toBeVisible();
  await expect(page.getByText(/Amazon Nova Pro/i)).toBeVisible();
  await expect(page.getByText(/Amazon Nova Multimodal Embeddings/i)).toBeVisible();
  await expect(page.getByText(/Amazon DynamoDB/i)).toBeVisible();

  // Data flow diagram
  await expect(page.getByText("Data flow")).toBeVisible();
  await expect(page.getByText("Return Event")).toBeVisible();
  await expect(page.getByText("Nova Grading")).toBeVisible();
  await expect(page.getByText("Nova Decision")).toBeVisible();
  await expect(page.getByText("Second Life")).toBeVisible();

  // Key capabilities stats
  await expect(page.getByText("Sub-5s")).toBeVisible();
  await expect(page.getByText("99.9%")).toBeVisible();

  // CTAs
  await expect(
    page.getByRole("button", { name: /View Impact Dashboard/i }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: /Open Console/i })).toBeVisible();

  expect(errors, errors.join("\n")).toEqual([]);
});

test("/_kit motion-kit showcase renders all components", async ({ page }) => {
  const errors = trackErrors(page);
  await page.goto("/_kit");
  for (const name of [
    "AnimatedNumber",
    "ConfidenceRing",
    "AnimatedBar",
    "StatusPill",
    "StreamingText",
    "ModelBadge (the visible-AWS pill)",
    "AnimatedBeam",
  ]) {
    await expect(page.getByText(name, { exact: true })).toBeVisible();
  }
  expect(errors, errors.join("\n")).toEqual([]);
});

test("API — health + grade + decide return fallback in no-AWS mode", async ({
  request,
}) => {
  const health = await request.get("/api/health");
  expect(health.ok()).toBeTruthy();
  expect((await health.json()).ok).toBe(true);

  const grade = await request.post("/api/grade", { data: { itemId: "RTN-10481" } });
  const g = await grade.json();
  expect(g.conditionGrade).toBe("Like-New");
  expect(g.source).toBe("fallback");

  const decide = await request.post("/api/decide", { data: {} });
  const d = await decide.json();
  expect(d.chosenFate).toBe("Resell");
  expect(d.source).toBe("fallback");
});
