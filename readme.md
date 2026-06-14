# Cyra Console

**Autonomous returns intelligence for Amazon** — our entry for **HackOn with Amazon 6.0** (*Second Life Commerce: AI-Powered Returns & Sustainable Resale*).

Cyra grades a returned product in seconds, routes it to its highest-value second life (resell / refurbish / donate / recycle / exchange) using real expected-value math, and feeds return reasons upstream to prevent the next return.

> **Option B — live where it shows, seeded everywhere else, never breaks.**
> The two hero AI moments are **genuine Amazon Bedrock (Nova Pro) calls**: condition **grading** (Screen 3) and the routing **decision** (Screen 4). Everything else is seeded for stable visuals. Every live call uses **cache-and-fallback**, so the app runs fully — even with no AWS configured — and never breaks on camera.

---

## Quick start

```bash
npm install
cp .env.example .env     # optional — fill AWS keys to go LIVE (see below)
npm run dev              # runs the Vite app + Express API together (concurrently)
# open http://localhost:5173
```

**The app runs with zero setup.** Without AWS credentials the Bedrock proxy returns the committed cached responses (`src/data/cached/*.json`) as fallback. Add credentials to make grading + decision genuinely live.

Demo flow: **`/` → `/inbox` → click the highlighted return → `/grade/RTN-10481` → `/decision/RTN-10481`**.

### Scripts
| Command | What it does |
|---|---|
| `npm run dev` | App (5173) + API (8787) together; Vite proxies `/api` → API |
| `npm run dev:web` / `npm run dev:server` | Run either half alone |
| `npm run build` | Typecheck + production build |
| `npm run typecheck` | TypeScript, no emit |
| `npx playwright test` | Full e2e suite (8 workers, boots app+API, fallback mode) |

---

## Going LIVE with AWS Bedrock (Nova)

Live calls are **server-side only** — AWS keys never reach the browser. The Express proxy in `server/` holds them and exposes `/api/grade` + `/api/decide`.

1. **Apply your AWS credits** (HackOn / AWS Educate) to your account, and make sure the account has a valid payment method.
2. **Verify Nova model access:** AWS Console → **Amazon Bedrock** (region **us-east-1**) → *Model access*. Amazon's own models (Nova) are **enabled by default** — confirm **Amazon Nova Pro** shows **Access granted**. (If not, *Modify model access* → tick Nova Pro → Submit. No Marketplace/use-case form is needed for Amazon models.)
3. **Create an IAM user** with the **`AmazonBedrockFullAccess`** policy → *Security credentials* → **Create access key** (use case: *Application running outside AWS*). Save the key pair.
4. **Fill `.env`** (gitignored):
   ```
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=...
   AWS_SECRET_ACCESS_KEY=...
   NOVA_MODEL_ID=us.amazon.nova-pro-v1:0
   ```
   ⚠️ Use the **`us.` inference-profile id** (`us.amazon.nova-pro-v1:0`), not the bare `amazon.nova-pro-v1:0` — Nova on-demand requires the regional inference profile or it errors with *"on-demand throughput isn't supported."*
5. **Set a $5 billing alarm:** CloudWatch (region **us-east-1**) → *Alarms* → *Create alarm* → metric **Billing → Total Estimated Charges (USD)** → threshold **5** → notify your email (confirm the SNS subscription email).
6. **Add product photos** for the live grade: drop 1–3 running-shoe images into `public/demo/` as `shoe-1.jpg`, `shoe-2.jpg`, `shoe-3.jpg`. The grade call sends `shoe-1.*` to Nova. (Without them, the screen shows a neutral placeholder and the grade falls back to cache.)
7. Restart `npm run dev`. The API logs `Bedrock: LIVE`, and the **ModelBadge** on Screens 3 & 4 shows a green **live** dot. Each good live result is written back to `src/data/cached/*.json` as the new fallback / pre-warm.

**Pre-warm before recording:** open `/grade/RTN-10481` and `/decision/RTN-10481` once so the latest live results are cached and instant during takes (and you don't re-bill every take).

---

## Architecture

```
Browser (React/Vite)  ──fetch /api──▶  Express proxy (server/)  ──aws-sdk──▶  Amazon Bedrock · Nova Pro
        │                                       │
        └── committed fallback cache ◀──────────┴── writes last-good result back to cache
```

- **Live:** Screen 3 grading (`/api/grade`, multimodal Nova over the product photo), Screen 4 decision reasoning (`/api/decide`, Nova reasons over seeded EV math). Both cache-and-fallback.
- **Seeded:** EV numbers/comps, buyers, prevention, dashboards, filler returns.
- **Source of truth for all demo numbers:** `docs/03_DATA_MODEL.md`.

## Project layout
```
src/
  components/ motion/  — AnimatedNumber, AnimatedBar, RevealCard, StreamingText,
                          ConfidenceRing, StatusPill, AnimatedBeam   (live at /_kit)
              layout/  — AppShell, NavRail, TopBar, ModelBadge, CursorGlow, Backgrounds
              ui/      — button, card, badge, tooltip, progress, tabs (shadcn-style)
  data/                — types + seed data + cached/grading.json + cached/decision.json
  lib/api.ts           — gradeItem(), decideFate()  (front-end fetch + guard)
  screens/             — Hero, Inbox, Grade, Decision (1–4) + Listing/Buyers/Prevention/Impact stubs + Kit
server/                — index.ts (/api/grade, /api/decide) · bedrock.ts · cache.ts · prompts.ts
public/demo/           — product images (user-supplied: shoe-1.jpg …)
e2e/                   — Playwright specs (full demo flow + API)
```

## Testing
Every flow is covered by Playwright e2e (`e2e/flow.spec.ts`) and **run before handoff**. The suite boots the real app + API in fallback mode (deterministic, no AWS) under `prefers-reduced-motion`, with **8 parallel workers**.

```bash
npx playwright test          # 8 specs: Hero, Inbox, Grade, Decision, full flow, stubs, /_kit, API
```

## Accessibility
Honors `prefers-reduced-motion` (Framer `useReducedMotion()` + a global CSS fallback): animations resolve to their final state instantly. The custom cursor glow is disabled for reduced motion and coarse pointers.

## Status / ownership
**Person 1 (this build):** scaffold, Amazon theme, motion kit, data layer, Bedrock proxy + cache/fallback, Screens 1–4 (3 & 4 live). **Person 2:** Screens 5–8 (currently clean `TODO(Person 2)` stubs with working routes), global polish, deploy, video. See `docs/05_HANDOFF.md`.
