# 05 — Handoff to Person 2

> Claude Code: keep this accurate as you build. Person 2 reads ONLY this + the running app.

## How to run
```
npm install
cp .env.example .env        # then fill AWS keys (see AWS section)
npm run dev                 # runs the Vite app + the Express API together (concurrently)
# open the printed localhost URL
```
The app runs **even with no AWS** — the Bedrock proxy returns committed cached responses (`src/data/cached/*.json`) as fallback. With AWS configured, grading + decision are live.

## Repo structure (fill in actuals)
```
src/
  components/ motion/ (reusable kit) · layout/ (AppShell, NavRail, TopBar, ModelBadge) · ui/ (shadcn)
  data/       types + seed + cached/grading.json + cached/decision.json
  lib/        api.ts (gradeItem, decideFate)
  screens/    Hero, Inbox, Grade, Decision + stubs Listing/Buyers/Prevention/Impact
  routes.tsx
server/       index.ts (/api/grade, /api/decide) · bedrock.ts · cache.ts · prompts.ts
public/demo/  product images (user-supplied)
```

## What's LIVE vs SEEDED (Option B)
- **Live Amazon Bedrock (Nova):** Screen 3 grading (`/api/grade`) and Screen 4 decision reasoning (`/api/decide`). Both cache-and-fallback. A `<ModelBadge>` shows the model + live/fallback state.
- **Seeded:** EV numbers/comps, buyers, prevention, dashboards, filler returns.
- **Do not** add live calls to the browser; everything AWS goes through `server/`.

## Motion kit API (reuse — don't rewrite)
`AnimatedNumber`, `AnimatedBar`, `RevealCard`, `StreamingText`, `ConfidenceRing`, `StatusPill` (+ `ModelBadge`). Full props in `docs/02_MOTION_KIT.md`; live at **`/_kit`**. Person 2 especially reuses `AnimatedNumber` (Impact + scale toggle), `ConfidenceRing` (buyer scores), `RevealCard` (grids), `AnimatedBar`/recharts (charts), `StatusPill`, `ModelBadge`.

## Data model
Source of truth = `docs/03_DATA_MODEL.md`. Person 2's screens read:
- Screen 5: hero `ReturnItem` (`RTN-10481`).
- Screen 6: `buyers.ts` (94/88/81 + Green Credits).
- Screen 7: `prevention.ts` (SKU-4471, 22% return rate, 61% "smaller than expected", before/after fix, 38% reduction).
- Screen 8: `stats.ts` (₹4.2L, 1,043 kg CO₂e, 58% preventable, 96/100; scale → $2B+, 1M+ tonnes, Climate Pledge).

## Where Person 2 plugs in
Screens 5–8 stubbed in `src/screens/` (`TODO(Person 2)`, working routes/CTAs). Build per `docs/04_SCREENS.md` using the existing motion kit + theme. Then: page transitions across all 8 screens, the "saved from landfill" celebration, consistent `ModelBadge`/AWS branding, a clean **architecture slide** (Bedrock AgentCore + Nova + data layer) for the video's 2-sec stack beat, **deploy** (Vercel/Amplify — map `server/` to serverless functions, keep AWS keys in host env vars), full happy-path QA with **live calls pre-warmed** (so they're cached + instant), and the **video** (Screen Studio).

## Shared north-star (both of us)
- Show the **customer** win (cheaper trustworthy refurbished, Green Credits, fewer painful returns).
- Flawless on camera; flash the AWS stack + "runs on Free Tier, scales to Amazon volume."
- Honest: "grading + decision are live Amazon Bedrock Nova calls; dataset synthetic; plugs into Amazon's real data via AgentCore Gateway."
- Every number matches `docs/03_DATA_MODEL.md`.

## ✅ Person 1 delivered (status)
- Scaffold: React+Vite+TS, Tailwind (Amazon palette), Inter, app shell (NavRail + TopBar), all 8 routes + `/_kit`. Custom cursor glow + animated Hero background.
- Motion kit (7): `AnimatedNumber`, `AnimatedBar`, `RevealCard`, `StreamingText`, `ConfidenceRing`, `StatusPill`, `AnimatedBeam` — all on `/_kit`, all reduced-motion aware. Plus `ModelBadge`.
- Data layer: `types.ts`, `returns.ts` (hero + 14 fillers), `comps.ts` (heroEvaluations + comps), `buyers.ts`, `prevention.ts`, `stats.ts`, committed `cached/grading.json` + `cached/decision.json`, `lib/api.ts`.
- Bedrock proxy: `server/` (`index.ts`, `bedrock.ts`, `cache.ts`, `prompts.ts`) — Nova via `@aws-sdk/client-bedrock-runtime`, strict-JSON parsing, **cache-and-fallback**, writes last-good back to cache. Runs offline before AWS is configured.
- Screens 1–4 complete and on-theme; **3 & 4 make real Nova calls** with the visible `ModelBadge` (live/fallback dot) and cached fallback. Screen 4 has Replay.
- Screens 5–8 = clean `TODO(Person 2)` stubs with working routes/CTAs and a `ModelBadge` placeholder where relevant.

### Run gate (kept green — see CLAUDE.md "Testing discipline")
- `npm run typecheck` ✓ · `npm run build` ✓ · `npx playwright test` ✓ (8 specs, **8 workers**, fallback mode).
- E2E lives in `e2e/flow.spec.ts`: Hero, Inbox, Grade, Decision, full demo flow (asserts no console errors), stubs route cleanly, `/_kit`, and the API endpoints. **Person 2: extend this suite for Screens 5–8 and keep it green.**

### Still needs the owner (Person 1 flagged)
- Drop real shoe photos into `public/demo/shoe-1.jpg` (+2,3) for the live grade.
- AWS: credits → enable Nova access → IAM keys → `.env` → $5 billing alarm (steps in `README.md`).

## AWS / cost
Bedrock (Nova) is pay-per-token but a demo's usage is pennies; new-account + HackOn/AWS-Educate **credits** should cover it, and a **$5 billing alarm** is set. Pre-warm the two live calls before recording so they're cached/instant (and so you don't re-bill on every take). `.env` holds keys locally; on deploy use the host's env vars (never commit keys).
