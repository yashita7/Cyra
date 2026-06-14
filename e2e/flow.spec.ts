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

test("Full demo flow Hero → Inbox → Grade → Decision (no console errors)", async ({
  page,
}) => {
  const errors = trackErrors(page);

  await page.goto("/");
  await page.getByRole("button", { name: /Open Console/i }).click();
  await page.getByText("Men's Road Running Shoes — Size 9").click();
  await expect(page).toHaveURL(/\/grade\/RTN-10481$/);

  const runDecision = page.getByRole("button", { name: /Run decision/i });
  await expect(runDecision).toBeEnabled({ timeout: 15000 });
  await runDecision.click();

  await expect(page).toHaveURL(/\/decision\/RTN-10481$/);
  await expect(page.getByText("RESELL", { exact: true })).toBeVisible({ timeout: 15000 });

  // proceed into the Person 2 stub
  await page.getByRole("button", { name: /Create listing/i }).click();
  await expect(page).toHaveURL(/\/listing\/RTN-10481$/);
  await expect(page.getByText(/Coming soon/)).toBeVisible();

  expect(errors, errors.join("\n")).toEqual([]);
});

test("Screens 5–8 stubs route cleanly", async ({ page }) => {
  const routes: [string, string][] = [
    ["/listing/RTN-10481", "Auto-Listing + Product Passport"],
    ["/buyers/RTN-10481", "Buyer Match"],
    ["/prevention", "Prevention Dashboard"],
    ["/impact", "Impact Dashboard"],
  ];
  for (const [path, heading] of routes) {
    await page.goto(path);
    // level 2 = the screen heading (TopBar title is h1)
    await expect(
      page.getByRole("heading", { name: heading, level: 2 }),
    ).toBeVisible();
    await expect(page.getByText(/Coming soon/)).toBeVisible();
  }
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
