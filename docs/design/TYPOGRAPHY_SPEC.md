# Typography Spec — "Quiet Aurora"

**Product:** Task Manager · **Author:** Agent 3 — Typography Specialist · **Date:** 2026-11-03
**Upstream:** `DESIGN_DIRECTION.md` §7.3, §8.1 · **Downstream implementer:** this file is paste-ready.

---

## 1. Selection & rationale

**Families (final):** Geist Sans (UI workhorse, unchanged) · **Fraunces** (display serif) · Geist Mono (micro-metadata).

**Fraunces vs. Instrument Serif vs. Newsreader — decision: Fraunces.**
Fraunces is the only candidate that scores on all four axes. (1) *Small-size legibility (20–30px):* Fraunces ships a true optical-size axis (opsz 9–144); browsers apply `font-optical-sizing: auto`, so at 24–30px it renders sturdier, lower-contrast letterforms — exactly what a UI h1 needs. (2) *opsz support:* Instrument Serif has **no** opsz axis (fixed display cut) and reads thin/fragile at 24px; Newsreader has opsz 6–72 but its small cut is a bland text face. (3) *Character at large sizes:* Fraunces' slightly wonky old-style forms give the wordmark and empty state a memorable voice — "type is the brand" (§5.4); Newsreader is elegant but anonymous-editorial, the closest of the three to "template serif." (4) *Loading:* Instrument Serif is smallest (~25KB) but **weight 400 only** — it cannot produce the medium-weight wordmark §7.4 mandates, killing it; Newsreader variable costs roughly the same as Fraunces with none of the personality payoff. Fraunces variable latin (wght + opsz) lands ~60–75KB — acceptable for a face scoped to three surface types.
Per §8.1: display usage is confined to ≥20px sizes, so the "misbehaves below ~24px" fallback trigger (Bricolage Grotesque) should never fire.

**Weight discipline (≤2 per family, §7.3):** Fraunces → 500 (wordmark, h1) and 600 (display-xl moments). Geist Sans → 400/500/600 (existing). Geist Mono → 400/500. Fraunces italic and the `SOFT`/`WONK` axes are **not** loaded.

## 2. Font loading config (paste verbatim)

No new dependencies — all three faces come from `next/font/google` (built into Next.js 15).

### 2.1 `src/app/layout.tsx`

```tsx
import { Geist, Geist_Mono, Fraunces } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const frauncesDisplay = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz"], // loads the full 9–144 optical-size range; without this the file is pinned to one optical size
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${frauncesDisplay.variable} ${geistMono.variable} min-h-dvh bg-neutral-50 font-sans text-neutral-900 antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

Notes:
- All three omit `weight` → variable fonts, full `wght` range in one file each; weight discipline is enforced by tokens/usage, not by loading.
- `display: "swap"` is already the next/font default; stated explicitly for robustness against future default changes.
- Do **not** set `adjustFontFallback: false` (default `true` is what generates the metric-matched fallback — see §7).
- next/font variable names (`--font-fraunces`, `--font-geist-mono`) are deliberately distinct from the `@theme` keys (`--font-display`, `--font-mono`) — same convention as the existing `--font-geist-sans` → `--font-sans` pair; a theme key referencing an identically named next/font var reads as a circular reference.

### 2.2 `src/app/globals.css` — `@theme inline` family mappings

```css
@theme inline {
  --font-sans: var(--font-geist-sans);
  --font-display: var(--font-fraunces);
  --font-mono: var(--font-geist-mono);
}
```

`font-display` / `font-mono` Tailwind utilities become available immediately.

## 3. Type scale tokens (paste verbatim into `@theme`)

Tailwind v4 pairs `--line-height`, `--letter-spacing`, and `--font-weight` onto each `text-*` utility, so one class carries size + leading + tracking + weight. Family is applied via `font-display` / `font-sans` / `font-mono` (Tailwind has no `--text-*--font-family` pair — by design). Defaults (`--text-sm`, `--text-xs`, …) are **not** redefined.

```css
@theme {
  /* Display moments — Fraunces. Wordmark, page h1s, empty-state headline only. */
  --text-display-xl: 1.875rem; /* 30px — empty-state headline; wordmark option, see §4 */
  --text-display-xl--line-height: 2.25rem;
  --text-display-xl--letter-spacing: -0.02em;
  --text-display-xl--font-weight: 600;

  --text-h1: 1.75rem; /* 28px — all page h1s. Retires text-xl-as-h1. */
  --text-h1--line-height: 2.125rem;
  --text-h1--letter-spacing: -0.02em;
  --text-h1--font-weight: 500;

  /* Section / inline headings — Geist Sans */
  --text-h2: 1.125rem; /* 18px */
  --text-h2--line-height: 1.5rem;
  --text-h2--letter-spacing: -0.01em;
  --text-h2--font-weight: 600;

  /* Body ramp — Geist Sans */
  --text-body-lg: 1rem; /* 16px — subtitles, empty-state body */
  --text-body-lg--line-height: 1.625rem;
  --text-body-lg--letter-spacing: 0em;
  --text-body-lg--font-weight: 400;

  --text-body: 0.875rem; /* 14px — rows, inputs, buttons, banners */
  --text-body--line-height: 1.25rem;
  --text-body--letter-spacing: 0em;
  --text-body--font-weight: 400;

  /* Metadata — Geist Sans or Geist Mono */
  --text-caption: 0.75rem; /* 12px — timestamps, counter, errors */
  --text-caption--line-height: 1rem;
  --text-caption--letter-spacing: 0em;
  --text-caption--font-weight: 400;

  /* Micro microcopy — Geist Mono, uppercase, tracking baked in */
  --text-micro: 0.6875rem; /* 11px — panel-header label only; never body/interactive */
  --text-micro--line-height: 0.875rem;
  --text-micro--letter-spacing: 0.06em;
  --text-micro--font-weight: 500;
}
```

| Token | Size | Line-height | Tracking | Weight | Family |
| --- | --- | --- | --- | --- | --- |
| `text-display-xl` | 30px | 36px (1.2) | −0.02em | 600 | Fraunces |
| `text-h1` | 28px | 34px (1.21) | −0.02em | 500 | Fraunces |
| `text-h2` | 18px | 24px (1.33) | −0.01em | 600 | Geist Sans |
| `text-body-lg` | 16px | 26px (1.63) | 0 | 400 | Geist Sans |
| `text-body` | 14px | 20px (1.43) | 0 | 400 | Geist Sans |
| `text-caption` | 12px | 16px (1.33) | 0 | 400 | Sans or Mono |
| `text-micro` | 11px | 14px (1.27) | +0.06em | 500 | Geist Mono, uppercase |

## 4. Hierarchy mapping (element → classes)

Colors reference the ink ramp from `VISUAL_DESIGN_SPEC.md` (`ink-900` … `ink-400`); until that lands, the existing `neutral-*` classes map 1:1 (`neutral-900→ink-900`, `700→ink-700`, `500→ink-500`, `400→ink-400`).

| Surface | Classes | Notes |
| --- | --- | --- |
| Wordmark (app header) | `font-display text-h1` | 500/−0.02em baked in token; §7.4 mandates medium+tight. If BRANDING_SPEC's header is ≥64px tall it may promote to `text-display-xl`; 56–60px headers stay at `text-h1` |
| Page h1 — "Tasks", "Create a new task", "Edit task" | `font-display text-h1 text-ink-900 text-balance` | `text-xl font-semibold` retired everywhere |
| Page subtitle (fixed style) | `text-body-lg text-ink-500 text-pretty` | one line, `mt-0.5` |
| Error page h1 | `font-display text-h1 text-ink-900` | promoted from `text-sm font-semibold` |
| Empty-state headline "No tasks yet" | `font-display text-display-xl text-ink-900 text-balance` | the app's one 600-weight display moment |
| Empty-state body | `text-body-lg text-ink-500 text-pretty max-w-sm` | |
| Task row title (h2) | `text-body font-medium text-ink-900` | stays 14px — rows are list content, not heading moments; `font-medium` overrides token's 400 |
| Task row description | `text-body text-ink-500 line-clamp-2` | |
| Row timestamp "Created {date}" | `font-mono text-caption text-ink-400` | mono per §5 |
| List counter "Showing X of Y tasks" | `font-mono text-caption text-ink-400` | mono per §5 |
| Panel header microcopy | `font-mono text-micro text-ink-400 uppercase` | de-tinted header per §7.5; tracking baked into token |
| Form field labels | `text-body font-medium text-ink-700` | unchanged size |
| Inputs / textarea | `text-body text-ink-900 placeholder:text-ink-400` | sans only |
| Buttons | `text-body font-medium` | sans only |
| Status banners | `text-body text-ink-700` | |
| Form errors | `text-caption font-medium text-[danger-token]` | red from VISUAL_DESIGN_SPEC's muted semantic pair |
| Back-links | `text-body text-ink-500 hover:text-ink-900` | |
| Footer "loaded all" line | `text-caption text-ink-400` | |
| Skeletons | no new type styles | keep each skeleton's line-height equal to the text it stands in for (`text-body` metrics); re-tint via ink ramp (visual spec) |

## 5. Numbers & data

- All metadata numerals (timestamps, counter) are **Geist Mono**. Monospaced fonts are inherently tabular — digits align across rows with no extra utility. `tabular-nums` is redundant inside `font-mono`; don't stack it.
- Use Tailwind's `tabular-nums` utility only when a changing number lives in a **sans** context (none today; e.g. a future inline count next to a title). It emits `font-variant-numeric: tabular-nums`; Geist Sans supports `tnum`.
- Prefer `font-variant-numeric` utilities over raw `font-feature-settings` (composable, won't clobber other features).
- `slashed-zero` on timestamps: optional taste call, default **off** — decide once timestamps show O/0 ambiguity in QA.

## 6. Accessibility notes

- **Minimum sizes:** nothing below 12px carries essential or interactive content. `text-micro` (11px) is reserved for the decorative uppercase panel-header label; never for timestamps, counters, buttons, or errors.
- **Contrast:** AA (4.5:1) for every text/background pair — 11px micro included, since it falls under the "small text" rule. Timestamps and the counter are essential info: if the visual spec's `ink-400` misses 4.5:1 on white, they use `ink-500` instead. Ink ramp values are owned by `VISUAL_DESIGN_SPEC.md`; this spec only sets the floor.
- **Line length:** paragraphs ≤ ~65–75ch. Subtitles and empty-state body live inside `max-w-2xl` / `max-w-sm`, which already satisfies this; keep it true if copy grows.
- **`text-balance`** on h1s and the empty-state headline (short titles today; insurance for longer ones). **`text-pretty`** on subtitles, empty-state body, and banner paragraphs. Neither on `line-clamp` descriptions, inputs, or buttons.
- Focus rings, reduced-motion behavior, and semantic roles are untouched by this spec; token swaps must not change interactive geometry (button `h-9`, input padding stay).
- Screen readers unaffected: this is a class-level restyle; heading order (h1 → h2 rows) stays semantic.

## 7. Performance notes

- **Added weight (estimate):** Fraunces variable latin, wght + opsz axes ≈ 60–75KB woff2 (opsz adds ~10–15KB over wght-only); Geist Mono variable latin ≈ 45–50KB. Total ≈ **+105–125KB woff2**, one-time, served from `/_next/static` with immutable caching. Three families ≈ 145–170KB total — fine for a face reserved to three surface types.
- **No CLS:** next/font (default `adjustFontFallback: true`) generates a size-adjusted local fallback face with matched `ascent-override`/`size-adjust` metrics, so the swap-in reflows by near-zero. Killing this flag removes the compensation — never do it.
- **No FOUC strategy:** self-hosted via next/font (no third-party request, CSP-friendly), `<link rel="preload">` emitted automatically, `display: "swap"` renders metric-matched fallback text immediately and swaps atomically. `subsets: ["latin"]` keeps every file minimal.
- Turbopack-compatible: next/font resolution happens at build time; zero runtime cost. Do not add `@import`/`<link>` Google Fonts CSS, self-hosted `.woff2` files, or any font npm package.

## 8. Don'ts

- No serif (Fraunces) in inputs, buttons, banners, row content, or timestamps — display face is wordmark + h1s + empty-state headline, nothing else, and never below 20px.
- No Geist Mono for body copy, buttons, or descriptions — metadata only.
- No fourth family, no Fraunces italic, no `SOFT`/`WONK` axes, no manual `font-variation-settings` (it disables `font-optical-sizing: auto` — let the browser pick the optical size).
- No sizes below `text-micro`; no `text-micro` on essential or interactive text.
- Do not redefine default Tailwind tokens (`--text-sm`, `--text-xl`, …); add named tokens and migrate usages. Retire `text-xl`-as-h1 completely.
- No uppercase or positive letter-spacing on body text; `text-balance` never on body copy.
- No fonts loaded outside `next/font`; no new dependencies.

## Implementer handoff checklist

- [ ] `src/app/layout.tsx` — replace the font block with §2.1 verbatim (add `Fraunces`, `Geist_Mono`, wire all three `.variable` classes onto `<body>`).
- [ ] `src/app/globals.css` — extend the `@theme inline` block with `--font-display` and `--font-mono` mappings (§2.2).
- [ ] `src/app/globals.css` — paste the §3 type-scale tokens into the existing `@theme` block.
- [ ] `src/app/page.tsx` — h1 → `font-display text-h1`, subtitle → `text-body-lg`, counter → `font-mono text-caption`, panel header → `font-mono text-micro uppercase` (§4).
- [ ] `src/app/tasks/new/page.tsx` + `src/app/tasks/[id]/edit/page.tsx` — same h1/subtitle/back-link token swaps (§4).
- [ ] `src/components/task-list.tsx` — row title/description/timestamp, empty-state headline (`font-display text-display-xl`) + body, delete-confirm h2 → `text-h2`, footer caption (§4).
- [ ] `src/components/ui.ts` — button/input/banner/panelHeader recipes adopt the §4 token classes (keep `h-9` and paddings).
- [ ] `src/components/task-form.tsx` + `src/app/error.tsx` + `src/components/skeletons.tsx` — labels/errors → `text-caption`, error-page h1 → `font-display text-h1`, skeleton boxes keep `text-body` metrics.
