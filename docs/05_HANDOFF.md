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

## Repo structure
```
src/
  components/ motion/ (reusable kit) · layout/ (AppShell, NavRail, TopBar, ModelBadge, ProductImage) · ui/ (shadcn)
  data/       types + seed (buyers, prevention, stats) + cached/grading.json + cached/decision.json
  lib/        api.ts (gradeItem, decideFate) · utils.ts
  screens/    Hero, Inbox, Grade, Decision, Listing, Buyers, Prevention, Impact, Architecture, Kit
  App.tsx     (routing)
server/       index.ts (/api/grade, /api/decide) · bedrock.ts · cache.ts · prompts.ts
public/demo/  product images (user-supplied)
e2e/          flow.spec.ts (12 test specs covering all 8 screens + Architecture + full flow)
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

## Where Person 2 completed
Screens 5–8 are now **fully implemented** with production-quality polish:
- All screens match `docs/04_SCREENS.md` specs exactly
- All numbers match `docs/03_DATA_MODEL.md` (single source of truth)
- Reuse Person 1's motion kit components throughout
- Page transitions working smoothly via Framer Motion
- "Saved from landfill" confetti celebration on Impact screen (initial + scale toggle)
- Consistent `ModelBadge`/AWS branding across all screens
- **Architecture View** (`/architecture`) ready for video's 2-second stack showcase
- E2E test suite extended with comprehensive coverage (12 specs total)

## Next steps for deployment
1. **Deploy** to Vercel/Amplify:
   - Map `server/` Express endpoints to serverless functions
   - Set AWS credentials in host environment variables (never commit to repo)
   - Configure `VITE_API_URL` if API runs on different domain
2. **Pre-warm live calls** before video recording:
   - Run grading + decision flows 1-2 times to populate cache
   - Verify cached responses are instant (sub-100ms) for smooth demo
3. **QA full 8-screen flow** with AWS configured:
   - Hero → Inbox → Grade → Decision → Listing → Buyers → Prevention → Impact
   - Verify zero console errors throughout
   - Test reduced motion support (prefers-reduced-motion)
4. **Record demo video** (Screen Studio recommended):
   - 2-second Architecture View beat to show AWS stack
   - Full flow showing both live AI moments (grading + decision with ModelBadge)
   - Finale on Impact screen with scale toggle + Climate Pledge reveal

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

## ✅ Person 2 delivered (status)
- **Screen 5 (Listing)**: Auto-generated listing card with pricing (₹2,499, discount badge), Product Passport timeline (4 steps: Returned → Graded → Defect Noted → Listed), authenticity + carbon badges, clickable thumbnail switching (3 images), "Find buyers →" CTA. Uses `RevealCard`, `ProductImage`, cached grading/decision data.
- **Screen 6 (Buyers)**: 3 buyer cards with `ConfidenceRing` match scores (94/88/81%), signal text, budgets, Green Credits badges (~120 each), "Notify with Green Credits" buttons. Tech tag shows "Amazon Nova Multimodal Embeddings". Summary stats row. CTA to Prevention.
- **Screen 7 (Prevention)**: Recharts pie chart for return reason clusters (Sizing 45%, Damage 16%, Inaccurate 14%, Other 25%), flagged SKU table with SKU-4471 highlighted (22% return rate, 61% "smaller than expected"), before/after catalog fix diff card (seeded from `prevention.ts`), animated -38% reduction gauge. CTA to Impact.
- **Screen 8 (Impact)**: 4 animated counter tiles (₹4.2L recovered, 1,043 kg CO₂e diverted, 58% preventable, 96/100 saved), "Project to Amazon scale" toggle that re-animates to $2B+ / 1M+ tonnes and reveals Climate Pledge panel (net-zero 2040), canvas-confetti celebration on initial land + toggle. Customer win message.
- **Architecture View** (`/architecture`): 4-layer stack diagram (AI/Intelligence, Event Processing, Data/Storage, Frontend), data flow pipeline (Return Event → Nova Grading → Nova Decision → Second Life), key capabilities stats (Sub-5s, 99.9%, ∞ scale), CTAs to Impact + Console. Built for video's 2-second stack beat.
- **Global Polish**: Page transitions already working (Person 1's infrastructure), reduced motion support verified across all new screens, consistent ModelBadge + AWS branding, thumbnail click state management on Listing.
- **E2E Tests Extended**: Replaced "Screens 5-8 stubs" test with 5 new comprehensive tests covering Listing (product card + passport + thumbnails), Buyers (3 cards + rings + scores), Prevention (chart + table + diff + gauge), Impact (counters + toggle + Climate Pledge), Architecture (stack layers + data flow). Extended full flow test to go Hero → Impact (all 8 screens). All 12 tests pass with zero console errors.

### Run gate (kept green)
- `npm run typecheck` ✓ · `npm run build` ✓ · `npx playwright test` ✓ (12 specs, **8 workers**, fallback mode).
- E2E lives in `e2e/flow.spec.ts`: All 8 screens individually tested, full 8-screen flow (Hero → Impact), Architecture view, `/_kit`, and API endpoints. **Before first run: `npx playwright install` to download browser binaries.**

### Still needs the owner (Person 1 flagged)
- Drop real shoe photos into `public/demo/shoe-1.jpg` (+2,3) for the live grade.
- AWS: credits → enable Nova access → IAM keys → `.env` → $5 billing alarm (steps in `README.md`).

## AWS / cost
Bedrock (Nova) is pay-per-token but a demo's usage is pennies; new-account + HackOn/AWS-Educate **credits** should cover it, and a **$5 billing alarm** is set. Pre-warm the two live calls before recording so they're cached/instant (and so you don't re-bill on every take). `.env` holds keys locally; on deploy use the host's env vars (never commit keys).
