# 04 — Screens (1–4 build now, 3 & 4 live; 5–8 stubs)

## Routing map
| Path | Screen | Owner |
|---|---|---|
| `/` | 1 — Hero / landing | **Person 1** |
| `/inbox` | 2 — Returns Inbox | **Person 1** |
| `/grade/:id` | 3 — Live Grading (LIVE Nova) | **Person 1** |
| `/decision/:id` | 4 — Decision Theater (LIVE Nova, HERO) | **Person 1** |
| `/listing/:id` | 5 — Listing + Passport | Person 2 (stub) |
| `/buyers/:id` | 6 — Buyer Match | Person 2 (stub) |
| `/prevention` | 7 — Prevention Dashboard (HERO) | Person 2 (stub) |
| `/impact` | 8 — Impact Dashboard (HERO) | Person 2 (stub) |
| `/_kit` | Motion-kit showcase | Person 1 (dev) |

Demo flow: **`/` → `/inbox` → click hero return → `/grade/RTN-10481` → `/decision/RTN-10481`**. Smooth Framer page transitions; each screen has a primary button to the next.

---

## Screen 1 — Hero / landing (3–5s)
Centered **Cyra** wordmark + kinetic headline **"Every return, its best second life."** Subline "Autonomous returns intelligence for Amazon." Subtle on-brand animated background (Aceternity beams/grid, low-key). Orange CTA **"Open Console →"** → `/inbox`. A small trust row: "Powered by Amazon Bedrock AgentCore · Nova · Kiro" (text). Fast title card, don't linger.

## Screen 2 — Returns Inbox
Title "Returns Inbox" + a pulsing `StatusPill` "Stream active". Top strip of stat tiles (`AnimatedNumber`): Pending 14 · Auto-resolved today 312 · Recovery today ₹4.2L · Preventable 58% (consistent with `stats.ts`). A staggered grid of **return cards** (`RevealCard`): thumbnail, title, SKU, reason, order value, `StatusPill`. The **hero card (SKU-4471, "too small")** is first, clearly clickable (orange ring / "New" tag). Click → `/grade/RTN-10481`.

## Screen 3 — Live Grading (LIVE Amazon Nova)
Two columns. **Left:** product photo(s) (`public/demo/`, placeholder if absent). **Right:** grading panel with a **`<ModelBadge>` top-right** ("Amazon Bedrock · Nova Pro").
On mount: call `gradeItem()` → `/api/grade` (real Nova). While awaiting, the badge dot pulses (`calling`), `StatusPill` = grading, a scanning shimmer runs over the image. On result:
1. **Defect boxes draw in** from `defects[]` (animated rect stroke + label).
2. **Condition score counts up** (`AnimatedNumber`) to the returned score; grade badge reveals; **confidence** via a small `ConfidenceRing`.
3. **Checks tick green** one by one (`RevealCard` + success check).
4. Line: "Graded by Amazon Nova Pro · {latencyMs/1000}s". Badge → `done` (or `fallback` styling + a quiet "cached" note if the call fell back).
5. CTA **"Run decision →"** → `/decision/RTN-10481`.
Use the live `Grading`; on any failure the endpoint already returns the cached fallback (UI shows `source:"fallback"` via the badge). Show genuine values.

## Screen 4 — Decision Theater (LIVE Nova · HERO — make it perfect)
Layout: a central **agent node** with `AnimatedBeam` to tool nodes (Comps, Refurb Cost, Carbon, Inventory); a reasoning stream; the EV comparison; the verdict. **`<ModelBadge>` top-right.**
On mount: call `decideFate(grading, heroEvaluations)` → `/api/decide` (real Nova reasoning). Then choreograph:
1. **Reasoning stream** (`StreamingText`) types the returned `reasoningTrace` line-by-line — live agent thinking.
2. As lines hit, **tool nodes light up** in sequence via AnimatedBeam (Comps → Refurb Cost → Carbon → Inventory), each pulsing when "called".
3. **EV table**: the 5 `heroEvaluations` render as `AnimatedBar`s (labels like "₹2,499"), staggered; **Resell** is `highlighted` (winner glow).
4. **Verdict card** slides in: **RESELL** · channel **Amazon Warehouse Deals** · `ConfidenceRing` at the returned confidence (~91%) · green **"+1.8 kg CO₂e saved"** badge · the `rationale`.
5. Caption near the math: **"Decision computed live on Amazon Bedrock — grounded in the numbers, not guessed."**
6. CTA **"Create listing →"** → `/listing/RTN-10481` (Person 2 stub).
Pacing ~8–12s so it films well; add a **Replay** button for retakes; reduced-motion shows final state. On failure, endpoint returns cached decision (badge shows `fallback`).

---

## Screens 5–8 — STUBS ONLY (Person 2 builds)
Each: screen title, one-line description, a `TODO(Person 2)` banner, working nav + incoming CTA, and (where trivial) static placeholder cards from seed data. **No real animation/logic.** Keep a `<ModelBadge>` placeholder where relevant for visual consistency.
- **5 `/listing/:id`** — "Auto-Listing + Product Passport." Skeletons; seed hero item.
- **6 `/buyers/:id`** — "Buyer Match." 3 buyer-card skeletons (`buyers.ts`).
- **7 `/prevention`** — "Prevention Dashboard." Note: reason clusters, flagged-SKU table (`prevention.ts`: SKU-4471, 22%, 61% "smaller than expected"), before/after fix, −38% gauge.
- **8 `/impact`** — "Impact Dashboard." Note: count-up counters (`stats.ts`) + "Project to Amazon scale" toggle → $2B+ / 1M+ tonnes / Climate Pledge.

Leave `// TODO(Person 2): build per docs/05_HANDOFF.md` in each stub.
