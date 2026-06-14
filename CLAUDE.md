# CLAUDE.md — Cyra Console (Person 1 build · Option B: live AWS AI)

> Claude Code loads this file automatically. Read it fully, then read every file in `docs/` before writing any code.

## What we're building
**Cyra** is our entry for **HackOn with Amazon 6.0**, theme *"Second Life Commerce: AI-Powered Returns & Sustainable Resale."* Cyra is an autonomous **returns-decision + prevention brain**: it grades a returned product in seconds, routes it to its highest-value second life (resell / refurbish / donate / recycle / exchange) using real expected-value math, lists it, and feeds return reasons back upstream to prevent the next return.

**This repo is the DEMO prototype — a web app called "Cyra Console."** Its job is to (a) look like a funded startup, (b) run flawlessly for a **3–4 minute screen-recorded demo**, and (c) **visibly use AWS** — this is an AWS hackathon and judges expect real AWS usage.

## The Option B principle (read carefully)
**The two hero AI moments are LIVE Amazon Bedrock (Nova) calls; everything else is seeded.**
- **Live:** condition **grading** (Screen 3, real multimodal Nova call on the product photo) and the routing **decision reasoning** (Screen 4, real Nova call that reasons over the seeded comparables and picks the fate).
- **Seeded:** the expected-value numbers/comps, buyer matching, prevention, dashboards, and all filler data — so the visuals are stable.
- **Never breaks on camera:** every live call uses **cache-and-fallback** — call Bedrock, cache the last good response, and on any error/timeout return the cached result instantly. A committed baseline cache means the app runs fully even before AWS is configured. We **pre-warm** the live calls right before recording.

Honest framing we can say on camera and in the repo: *"Grading and the routing decision are live Amazon Bedrock Nova calls; the dataset is synthetic, and the agent plugs into Amazon's real signals via AgentCore Gateway."* Do not fake AI output — show the genuine Nova result (the seeded numbers are only the offline fallback).

## CRITICAL architecture rule — credentials are server-side only
**Never call Bedrock from the browser and never put AWS keys in front-end code** (it's a security hole and won't work). Build a tiny **server-side proxy** (a small Node/Express server in `server/`) that holds the AWS credentials and exposes `/api/grade` and `/api/decide`. The React app fetches those endpoints. The proxy does the Bedrock call + cache-and-fallback. For deploy these map to serverless functions (Person 2's job) — you just build the dev server.

## Team split — build ONLY Person 1's scope
Two people, sequential.
- **Person 1 (me): foundation + front half + the live AI.** Scaffold, Amazon theme, the reusable **motion kit**, the **data layer**, the **Bedrock proxy + cache/fallback**, and **Screens 1–4** (Hero, Returns Inbox, Live Grading, Decision Theater) — with grading and decision genuinely live.
- **Person 2 (later): back half + ship.** Screens 5–8, global polish, deploy, video.

**Do NOT build Screens 5–8.** Stub them with `TODO(Person 2)`, working routes, and nav links. Hand off a documented, reusable kit + a working Bedrock proxy.

## Golden rules (strict)
1. **Tell me what to do — never assume, never hesitate.** Any time I must act in the real world (install Node/tools, create/configure AWS, apply credits, enable a Bedrock model, set a billing alarm, create IAM keys, add image files, set an env var, run a command, sign into a component registry, deploy), **STOP and give me exact, numbered, copy-pasteable steps.** Assume I'll do nothing you don't spell out. Never pretend a manual step is done. If blocked on me, say so and say exactly what unblocks you.
2. **Live where it shows, seeded everywhere else, never breaks.** Follow the Option B principle above: live Bedrock Nova on grading + decision, cache-and-fallback on both, committed baseline cache, seeded for the rest.
3. **Credentials server-side only.** Bedrock is called from `server/`, never the browser.
4. **Make AWS visible.** Put a small "Amazon Bedrock · Nova Pro" badge (with a subtle live dot) on the live panels (Screens 3 & 4), and surface the model id. (See design system doc.)
5. **Stay in my lane.** Person 1 scope only. Screens 5–8 = stubs.
6. **Verify as you go.** Work phase by phase; after each, run the app, confirm zero console errors, tell me exactly what I should see, update the todo list, and pause for my OK.
7. **Quality bar.** Amazon-themed dark operations console, smooth purposeful motion (200–500ms), generous spacing, no jank. If it looks like a student project, it's wrong.

## Tech stack
- **React + Vite + TypeScript**, **Tailwind**, **shadcn/ui**, **Framer Motion**
- **Magic UI / Aceternity / react-bits** (animated flourishes — see `docs/02_MOTION_KIT.md`)
- **React Router**, **recharts** (Person 2), **lucide-react**, **Inter**
- **Server / AWS:** a tiny **Express** server in `server/` + **`@aws-sdk/client-bedrock-runtime`**, **dotenv**, and **concurrently** (run app + API together). Bedrock region default **us-east-1** (tell me if Nova access differs by region).
- Prefer the versions `shadcn` init currently expects; if you hit version friction, choose the most compatible/stable combo and tell me what you picked.

## Reference docs (read all before coding)
- `docs/01_DESIGN_SYSTEM.md` — Amazon palette, tokens, typography, app shell, the AWS "ModelBadge", accessibility
- `docs/02_MOTION_KIT.md` — the 6 reusable animated components (core handoff)
- `docs/03_DATA_MODEL.md` — types, seed data, the canonical demo return, **the Bedrock proxy + live calls + cache/fallback**
- `docs/04_SCREENS.md` — Screens 1–4 (with live calls) + stubs 5–8 + routing
- `docs/05_HANDOFF.md` — what Person 2 receives (keep updated)

## Testing discipline (non-negotiable — owner's standing rule)
**Every flow I build gets e2e tests, and I run them myself before handing anything back.** The owner must be able to test confidently knowing Claude already verified it — no "it's done" followed by it not working.
- Stack: **Playwright** (`e2e/`, `playwright.config.ts`). `npx playwright test` boots the full app (Vite + Express via `npm run dev`) and runs the demo flow in **fallback mode** (no AWS) so tests are deterministic.
- Tests run under `reducedMotion: "reduce"` → typewriter/count-up resolve instantly (fast + also covers the accessibility path).
- Before reporting any work complete I run, at minimum: `npm run typecheck`, `npm run build`, and `npx playwright test` — and only hand off when all pass. If something fails and I can't fix it, I say so explicitly.
- New screen/flow ⇒ new or extended spec in `e2e/`. Keep the suite green.

## Build phases
0. **Preflight + scaffold** — Node check (+ fix instructions); Vite+TS+Tailwind; deps; Amazon theme + Inter + app shell (left nav + top bar) + all 8 routes (5–8 stubbed). Run it.
1. **Motion kit** — 6 components + `/_kit` showcase.
2. **Data layer** — types + seed data + canonical hero return (incl. seeded comps/EV the decision call reasons over).
3. **Bedrock proxy + AWS setup** — `server/` with `/api/grade` & `/api/decide` (Nova via aws-sdk) + cache-and-fallback util + committed baseline cache so it runs offline. **STOP and walk me through AWS: apply credits → enable Nova model access in Bedrock → create IAM keys → `.env` (gitignored, with `.env.example`) → set a $5 billing alarm.** App must run before I finish this.
4. **Screen 1 (Hero) + Screen 2 (Returns Inbox).**
5. **Screen 3 (Live Grading)** — real Nova call on the shoe photo via `/api/grade`, with the animated grading sequence + the Bedrock/Nova badge; cached fallback wired.
6. **Screen 4 (Decision Theater)** — the hero screen: real Nova reasoning via `/api/decide` streamed line-by-line, AnimatedBeam tool calls, seeded EV bars (Resell highlighted), verdict + confidence ring + carbon badge + the Bedrock/Nova badge; cached fallback + a replay button. Make it perfect.
7. **Handoff** — update `docs/05_HANDOFF.md` + write `README.md` (incl. how to run app + API, and the AWS env).

## Canonical demo (source of truth = `docs/03_DATA_MODEL.md`)
Hero item: returned **men's running shoes (SKU-4471)**, reason **"too small."** Live grading should land ~**Like-New**; decision should land **Resell via Amazon Warehouse Deals (~91% confidence, +1.8 kg CO₂e saved)** because the seeded comps favor it. **Display the genuine live values**; if they differ slightly from the example numbers in the docs, use the real ones (and tell me, so I can match the PRD). The seeded values are the offline fallback.

## Definition of done (Person 1)
- App + API boot together (`npm run dev`) with zero errors; runs even with no AWS (cached fallback).
- App shell + all 8 routes; 5–8 are labelled stubs.
- 6 motion-kit components built, documented, on `/_kit`.
- Screens 1–4 complete and on-theme; **grading (3) and decision (4) make real Bedrock Nova calls** with cache/fallback and a visible Bedrock/Nova badge.
- AWS set up (credits + model access + keys + billing alarm) with my confirmation.
- `README.md` + `docs/05_HANDOFF.md` let Person 2 run and extend immediately.

Start by reading `docs/`, then give me a short plan + todo list and your Phase 0 preflight instructions — and wait for my OK before scaffolding.
