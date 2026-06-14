# 01 — Design System

The app must read instantly as **"Amazon, but a sleek internal AI console."** Reference: Linear / Vercel dashboards (dark, dense, premium) wearing Amazon's brand colors.

## Color tokens (official Amazon hexes)
Wire into `tailwind.config` (`theme.extend.colors`) and as CSS variables.

| Token | Hex | Use |
|---|---|---|
| `ink` | `#131A22` | app background |
| `squid` | `#232F3E` | cards, nav rail, top bar |
| `slate` | `#37475A` | borders, dividers, muted surfaces |
| `orange` | `#FF9900` | accent, active nav, CTAs, key highlights |
| `link` | `#146EB4` | links, secondary data, chart series 2 |
| `sky` | `#00A8E1` | info accents, chart series 1, "live" dots |
| `gold` | `#FEBD69` | sparing highlights (ratings/credits/badges) |
| `success` | `#2BB673` | "saved", positive deltas, check ticks |
| `danger` | `#E5564E` | preventable / return-risk flags |
| `text` | `#FFFFFF` / `#C9D1D9` muted | primary / secondary text |

Rules: orange is the **accent**, never a large background fill. Dark surfaces + white text. Soft elevation: 1px `slate` borders + a subtle glow on hero cards, e.g. `0 0 0 1px #37475A, 0 8px 40px -12px rgba(255,153,0,.15)`.

## Typography
- **Inter** (closest free stand-in for Amazon "Ember"). Install via `@fontsource/inter` or Google Fonts. Weights 400/500/600/700.
- Page titles 28–34px/600; section labels 12–13px uppercase tracked; body 14–15px; numbers/IDs in a monospace stack.
- Kinetic/animated type ONLY on the Hero headline (Screen 1).

## App shell
- **Left nav rail** (`squid`, ~240px): **Cyra** wordmark (orange) at top, then nav items (lucide icons + active state = orange left-border + orange text + subtle bg): Inbox, Decision, Listings, Buyers, Prevention, Impact. Footer chip: "HackOnAmazon · Cyra v0.1".
- **Top bar** (`squid`, ~56px): left = screen title/breadcrumb; right = a faux search field, a pulsing **"Live"** dot + "Returns stream: active", and a round avatar.
- **Content area**: `ink` bg, max-width container, generous padding.

## ModelBadge (the visible-AWS element — important for judges)
A small pill component, placed on the **live panels (Screens 3 & 4)** and reused by Person 2 for consistency.
```ts
type ModelBadgeProps = {
  label?: string;       // default "Amazon Bedrock · Nova Pro"
  state?: "idle" | "calling" | "done" | "fallback"; // controls the dot
  modelId?: string;     // e.g. "amazon.nova-pro-v1:0" shown small/mono on hover or beneath
};
```
- Visual: a rounded `squid` pill with a 1px `slate` border, a small AWS-orange/`sky` status dot (pulsing when `calling`, solid `success` when `done`, `gold` when `fallback`), the label in white, and the `modelId` in muted mono.
- This is how the judge *sees* that real AWS is in play. Keep it tasteful, top-right of the relevant panel.

## Components & libraries
- Base UI (button/card/table/dialog/tabs/badge/tooltip/progress): **shadcn/ui**, themed to the palette.
- Icons: **lucide-react**. Charts: **recharts** (Person 2). Flourishes: see `docs/02_MOTION_KIT.md`.

## Motion & accessibility baseline
- Hover + press feedback on all interactive elements (200–300ms).
- Honor **`prefers-reduced-motion`** (Framer `useReducedMotion()` + a global CSS fallback) — mention in README; maturity signal.
- Readable contrast: white on `ink`/`squid` only; never `slate` text on `squid`.

## Demo-capture sizing
16:9 desktop, design for ~1440×900. Keep hero content in a centered safe area (room for Screen Studio auto-zoom). Animated numbers (scores, EV, counters) should be large and legible.
