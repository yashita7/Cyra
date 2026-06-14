# 02 — Motion Kit (core handoff to Person 2)

Build these as **reusable, documented, standalone** components in `src/components/motion/`. Person 2 reuses all of them. Engine: **Framer Motion**. Default easing spring/`easeOut`; durations **200–500ms**; respect `useReducedMotion()` (reduced → show final state instantly). Add a **`/_kit` route** rendering each with sample props.

> Note: these are presentation components and stay UI-only. The live Bedrock data (from `/api/grade`, `/api/decide`) is fed *into* them by Screens 3 & 4 — e.g. `StreamingText` renders the reasoning lines the decision endpoint returns; `AnimatedNumber` shows the score the grading endpoint returns.

## Components

### 1. `<AnimatedNumber />` — count-up on view
```ts
type AnimatedNumberProps = { value: number; durationMs?: number; /*1200*/
  format?: "int" | "currencyINR" | "currencyUSD" | "compact" | "percent";
  prefix?: string; suffix?: string; className?: string };
```
Re-animates when `value` changes (Impact scale toggle uses this). Base: `useMotionValue` + `animate()`, or Magic UI NumberTicker.

### 2. `<AnimatedBar />` — fills to its share of `max` on view
```ts
type AnimatedBarProps = { value: number; max: number; label?: string; valueLabel?: string;
  color?: string; /*orange*/ delayMs?: number; highlighted?: boolean /*winner glow*/ };
```

### 3. `<RevealCard />` — fade+slide, stagger support
```ts
type RevealCardProps = { delayMs?: number; index?: number; className?: string; children: React.ReactNode };
```
Framer `variants`; ~80ms between items, ~300ms each.

### 4. `<StreamingText />` — typewriter / line-by-line (heart of Decision Theater)
```ts
type StreamingTextProps = { lines: string[]; charsPerSec?: number /*~45*/;
  perLineDelayMs?: number; onDone?: () => void; cursor?: boolean; className?: string };
```
Types each line, pauses, next; auto-scrolls. Reduced-motion → all at once. **Screen 4 feeds it the reasoning lines returned by `/api/decide`.**

### 5. `<ConfidenceRing />` — animated circular progress (SVG)
```ts
type ConfidenceRingProps = { value: number; size?: number /*96*/; label?: string;
  sublabel?: string; color?: string /*orange; success if >=90*/; durationMs?: number /*900*/ };
```
Reused for decision confidence AND Person 2's buyer match scores.

### 6. `<StatusPill />` — animated status chip
```ts
type Status = "queued" | "grading" | "deciding" | "listed" | "saved" | "flagged";
type StatusPillProps = { status: Status; pulse?: boolean; className?: string };
```
Colors: queued=`slate`, grading=`sky`, deciding=`orange`, listed=`link`, saved=`success`, flagged=`danger`. Animate on change.

## Plus: AnimatedBeam (Decision Theater tool calls)
Install **Magic UI `AnimatedBeam`** to draw glowing connectors from a central "agent" node to tool nodes (Comps, Refurb Cost, Carbon, Inventory) that light up in sequence as the reasoning streams.

## Install notes (tell me if anything blocks you)
- `npm i framer-motion lucide-react recharts @fontsource/inter canvas-confetti`
- shadcn: `npx shadcn@latest init` then add `button card table dialog tabs badge tooltip progress`.
- Magic UI / Aceternity / react-bits = copy-paste or shadcn-registry installs. Exact registry URLs change; **if a component needs a specific URL, an account, or a manual copy, STOP and tell me exactly what to fetch/paste.** Where faster/safer, just implement it directly in Framer Motion — your call, but tell me what you did.
