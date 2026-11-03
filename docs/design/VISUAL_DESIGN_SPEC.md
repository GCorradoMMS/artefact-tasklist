# Visual Design Spec — "Quiet Aurora"

**Product:** Task Manager · **Author:** Agent 4 — Visual Design Specialist · **Date:** 2026-11-03
**Upstream:** `DESIGN_DIRECTION.md` (rulings followed, not re-litigated) · **Status:** Final values. Ready to implement.
**Scope:** tokens, background recipe, surface treatments. Typography → `TYPOGRAPHY_SPEC.md`; brand assets → `BRANDING_SPEC.md`. Light mode only — no `dark:` variants anywhere.

---

## 1. Palette overview

Four hue families, total (direction §7.2 cap):

| Family | Role | Notes |
|---|---|---|
| **Accent** (indigo-violet) | Only interactive color | Existing ramp kept verbatim; anchored at accent-600 |
| **Ink** (violet-gray) | All text, borders, neutral surfaces | Replaces every stock `neutral-*` |
| **Aurora Rose** (atmospheric) | Background wash + empty-state illustration only | Raw rgba values, never in chrome/controls |
| **Success / Danger** (muted, ink-leaning) | Feedback only | Replaces stock `green-*` / `red-*` |

## 2. Ink ramp + neutral migration

```css
/* Violet-gray neutrals — every gray shares the accent's undertone (hue ~248). */
--color-ink-50:  #f7f7fb;
--color-ink-100: #eeeef7;
--color-ink-200: #dfdfec;
--color-ink-300: #c8c8dd;
--color-ink-400: #a1a1b8;
--color-ink-500: #73738c;
--color-ink-600: #62627c;
--color-ink-700: #4d4d66;
--color-ink-800: #39394f;
--color-ink-900: #262637;
--color-ink-950: #1e1e33;
```

Mechanical 1:1 swap for the implementer (covers every current `neutral-*` hit in ui.ts, task-list.tsx, task-form.tsx, status-message.tsx, skeletons.tsx, layout.tsx, page.tsx, tasks/*/page.tsx, error.tsx):

| Current | New | Typical roles in this codebase |
|---|---|---|
| `neutral-50` | `ink-50` | body bg (becomes aurora base), hover washes, panel-header tint, empty-state glyph bg |
| `neutral-100` | `ink-100` | `divide-y` row lines, icon-button hover bg |
| `neutral-200` | `ink-200` | resting borders (panel, inputs, secondary button, glyph ring), skeleton fill |
| `neutral-300` | `ink-300` | hover borders only |
| `neutral-400` | `ink-400` | **decorative only**: placeholders, faint glyphs, "(optional)". Never body copy |
| `neutral-500` | `ink-500` | secondary text: row descriptions, subtitles, footer/empty-state copy, panel microcopy |
| `neutral-600` | `ink-600` | (unused today) strong secondary text |
| `neutral-700` | `ink-700` | form labels, secondary-button text, icon hover text |
| `neutral-800` | `ink-800` | (unused today) |
| `neutral-900` | `ink-900` | primary text: h1s, row titles, body copy, back-link hover |

**Two role exceptions to the mechanical swap (both AA-driven):**
1. Text sitting **directly on the aurora** (page subtitles, back-links) → use `ink-600` idle, `hover:text-ink-900`. Washes darken the effective bg enough to push ink-500 under 4.5:1.
2. Metadata text (`text-xs` timestamps in rows) → step up to `ink-500` (4.6:1) instead of ink-400 (2.5:1). Current `neutral-400` timestamps were a pre-existing AA miss; this closes it.

## 3. Accent

Kept **exactly** as-is (direction §7.2: keep; tuning permitted but not needed — the ramp is already periwinkle-bright in the mids and 600 passes AA with white text). One alias added:

```css
/* Accent palette: unchanged. Primary anchored at accent-600. */
--color-accent-50:  #eef0fe;
--color-accent-100: #e0e3fd;
--color-accent-200: #c6cbfb;
--color-accent-300: #a3aaf8;
--color-accent-400: #7f86f3;
--color-accent-500: #5b63e8;
--color-accent-600: #4a51d4;
--color-accent-700: #3e44b4;
--color-accent-800: #33398f;
--color-accent-900: #2b2f72;
--color-accent: var(--color-accent-600); /* default alias → bg-accent, ring-accent */
```

## 4. Atmospheric hue — "Aurora Rose"

**Pick: rose** (not peach — cool rose harmonizes with the violet undertone; peach pulls the page toward sunset-landing-page). One hue, raw values only, used inside the gradient below and optionally in the empty-state illustration. Never a token in chrome.

- Wash core: `#f0b0c0` → used as `rgb(240 176 192 / α)`, α 0.10–0.14
- Extreme tint for illustration fills: `#f6edf3` (what the 0.14 wash blends to over ink-50)

## 5. Background recipe — paste-ready

Zero JSX changes: two fixed pseudo-elements on `body`. `::before` = washes, `::after` = dot grain (later sibling ⇒ dots composite **above** washes). `position: fixed` on the element itself replaces `background-attachment: fixed` (no iOS jank). `z-index: -1` puts both behind all body content; `pointer-events: none` makes them inert. Worst-case saturation lift over base (violet pool center blends to ≈ `#e3e5fa`) ≈ 5–6% — inside the §8.2 ceiling.

```css
/* ── "Quiet Aurora" fixed background (light mode only) ───────────────
   body::before = pastel washes · body::after = 1px dot grain.
   Both: fixed, non-interactive, behind content. No animation.        */
body::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  /* Base: ink-50. */
  background-color: var(--color-ink-50);
  background-repeat: no-repeat;
  /* Top→bottom: settle-to-base fade, violet pool (upper-left, primary),
     violet echo (upper-right), rose pool (low-right). */
  background-image:
    linear-gradient(to bottom, rgb(247 247 251 / 0) 70%, rgb(247 247 251 / 0.85) 100%),
    radial-gradient(72rem 52rem at 14% -6%, rgb(127 134 243 / 0.16) 0%, rgb(127 134 243 / 0) 62%),
    radial-gradient(64rem 44rem at 88% 10%, rgb(163 170 248 / 0.10) 0%, rgb(163 170 248 / 0) 60%),
    radial-gradient(68rem 48rem at 82% 64%, rgb(240 176 192 / 0.14) 0%, rgb(240 176 192 / 0) 64%);
}

body::after {
  content: "";
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  /* 1px accent-600 dots on a 24px cell. Element opacity is the only knob. */
  background-image: radial-gradient(circle, var(--color-accent-600) 1px, transparent 1px);
  background-size: 24px 24px;
  opacity: 0.035; /* ≈3.5% effective dot alpha — ruling ceiling is 4% */
  /* Grain fades out below the first viewport. */
  -webkit-mask-image: linear-gradient(to bottom, #000 0%, #000 70vh, transparent 105vh);
  mask-image: linear-gradient(to bottom, #000 0%, #000 70vh, transparent 105vh);
}
```

**Motion:** none proposed, none permitted — no `@keyframes`, no parallax, no scroll-driven effects on either layer. `prefers-reduced-motion` therefore needs no new coverage for the background. If dots ever visibly moiré, swap the `::after` layer for an inline-SVG noise data-URI at the same opacity — never both textures.

## 6. Semantic colors

Muted, ink-leaning; behavior identical to today (banner roles, error input states, destructive hover).

```css
/* Success — sage-leaning. */
--color-success-50:  #f2f8f4;
--color-success-100: #e3f0e8;
--color-success-200: #c4e0cf;
--color-success-400: #5f9e7c;
--color-success-500: #478a68;
--color-success-600: #387557;
--color-success-800: #23513c;

/* Danger — muted brick-red. */
--color-danger-50:  #fbf3f3;
--color-danger-100: #f6e4e4;
--color-danger-200: #ecc7c7;
--color-danger-400: #c96a6a;
--color-danger-500: #b5504f;
--color-danger-600: #a03e3e;
--color-danger-800: #6e2626;
```

Banner triads (slot-for-slot replacement in `status-message.tsx`):

| Slot | Success | Danger |
|---|---|---|
| banner bg | `bg-success-50` | `bg-danger-50` |
| banner border | `border-success-200` | `border-danger-200` |
| banner text | `text-success-800` | `text-danger-800` |
| banner icon | `text-success-600` | `text-danger-600` |
| hover tint (if ever needed) | `success-100` | `danger-100` |

Other danger slots: `inputError` border idle/hover `danger-400`, focus `danger-500` + `ring-danger-500/15`; form helper error text `text-danger-600`; `buttonIconDanger` → `hover:bg-danger-50 hover:text-danger-600`.

## 7. Surfaces & components

All recipes stay in `src/components/ui.ts`; panels/inputs remain **opaque white** (§8.4).

| Surface | Recipe |
|---|---|
| **Panel** | `rounded-xl border border-ink-200/80 bg-white shadow-lg` (hairline translucent so it sits on the aurora) |
| **Panel header** | `border-b border-ink-200/70 bg-ink-50/60 px-4 py-2.5 text-xs font-medium text-ink-600` (de-tinted near-white; ink-600 for AA margin over the wash) |
| **Row hover** | `hover:bg-accent-50/70` (≈4.6% accent tint — direction's 3–5% band; rows keep no shadow at rest) |
| **Input idle** | `rounded-xl border-ink-200 bg-white` + `placeholder:text-ink-400` |
| **Input hover** | `hover:border-ink-300` |
| **Input focus** | unchanged pattern: `focus:border-accent-500 focus:ring-2 focus:ring-accent-500/15` |
| **Input error** | `border-danger-400 hover:border-danger-400 focus:border-danger-500 focus:ring-danger-500/15` |
| **Button primary** | `rounded-lg bg-accent-600 text-white shadow-accent`, hover `accent-700`, active `accent-800`. **Flat — no gradient** (§8.2 reserves gradient for the logo mark); the accent shadow is the sanctioned "whisper" |
| **Button secondary** | `rounded-lg border-ink-200 bg-white text-ink-700`, hover `border-ink-300 bg-ink-50 text-ink-900`. Flat, no shadow |
| **Button icon (ghost)** | `rounded-lg text-ink-400`, hover `bg-ink-100 text-ink-700`; danger variant per §6. Flat |
| **Banner** | `rounded-lg` + triads above; keep `animate-fade-in` |
| **Skeletons** | `rounded-md bg-ink-200/70`, `divide-ink-100`; keep pulse + reduced-motion override |
| **Selection** | unchanged: `::selection { background-color: var(--color-accent-100); }` |
| **Focus ring** | unchanged `focusRing` recipe (border accent-500 + ring accent-500/35). Verified visible over the aurora: the full-strength border is the 3:1-compliant indicator; the soft ring is reinforcement |

## 8. Radii tokens

```css
--radius-sm: 0.375rem; /* 6px  — chips, tiny badges */
--radius-md: 0.5rem;   /* 8px  — skeletons */
--radius-lg: 0.625rem; /* 10px — buttons, icon buttons, banners (override of default 8px) */
--radius-xl: 0.75rem;  /* 12px — panels, inputs, textareas */
```

Bigger surface ⇒ bigger radius, always from the scale; status pills stay `rounded-full`.

## 9. Shadow tokens

All tinted (ink-900 = `rgb(38 38 55)`, accent-600 = `rgb(74 81 212)`, accent-800 = `rgb(43 47 114)`) so they sit naturally on the pastel ground. Philosophy: one soft base + one whisper.

```css
--shadow-xs: 0 1px 2px rgb(38 38 55 / 0.04);
--shadow-sm: 0 1px 2px rgb(38 38 55 / 0.06);
--shadow-md: 0 1px 2px rgb(38 38 55 / 0.05), 0 4px 12px rgb(74 81 212 / 0.05);
/* Panels: tight soft base + wide accent-tinted whisper. */
--shadow-lg: 0 1px 2px rgb(38 38 55 / 0.06), 0 2px 4px rgb(74 81 212 / 0.04), 0 12px 32px rgb(74 81 212 / 0.08);
/* Primary CTA whisper. Buttons are otherwise flat. */
--shadow-accent: 0 1px 2px rgb(43 47 114 / 0.30), 0 1px 4px rgb(74 81 212 / 0.18);
```

Rows, inputs, and secondary/icon buttons carry **no** shadow at rest.

## 10. Contrast verification

WCAG 2.x relative luminance, ±0.1. AA normal = 4.5, AA large/UI = 3.0.

| Pair | Ratio | Verdict |
|---|---|---|
| ink-900 text / white | 14.8:1 | ✅ AAA — body, titles |
| ink-700 text / white | 8.2:1 | ✅ — labels, secondary button |
| ink-600 text / white | 5.4:1 | ✅ — aurora-level secondary text, panel microcopy |
| ink-600 text / ink-50 | 5.1:1 | ✅ — panel header on tint |
| ink-500 text / white | 4.6:1 | ✅ AA — row descriptions, timestamps |
| ink-400 / white | 2.5:1 | ⚠️ decorative only (placeholders, glyphs); parity with current neutral-400 — never body copy |
| white text / accent-600 | 6.1:1 | ✅ AA — primary button |
| white text / accent-700 (hover) | 7.8:1 | ✅ |
| success-800 / success-50 | 8.4:1 | ✅ — banner text |
| success-600 icon / success-50 | 5.1:1 | ✅ |
| danger-800 / danger-50 | 9.8:1 | ✅ — banner text |
| danger-600 / white (helper text) | 6.5:1 | ✅ |
| danger-400 border / white | 3.7:1 | ✅ UI 3:1 (improves on current red-400 ≈ 2.1) |
| accent-500 focus border / ink-50 | 4.5:1 | ✅ UI 3:1 — ring visible over aurora |

## 11. Don'ts

1. No gradients on panels, buttons, inputs, or text — background layer and logo mark only.
2. No dark mode, no `dark:` classes, no second theme block.
3. No animated/parallaxed background; no noise + dots together (dots first; noise only as moiré fallback); no mesh gradients; dot opacity ceiling 4%.
4. Aurora Rose never appears in chrome or controls — background + empty-state illustration only.
5. ink-400 never for readable copy; page-level text on the aurora uses ink-600+, not ink-500.
6. No shadows on rows/inputs at rest; no shadows outside the token scale (§5 principle: nothing off-scale).
7. No new dependencies; no `tailwind.config.js` — every token is a `@theme` entry in `globals.css`.

## Implementer handoff checklist

- [ ] `src/app/globals.css` — extend `@theme` with ink, success, danger ramps; `--color-accent` alias; radius + shadow tokens (§2, 3, 6, 8, 9). Accent values unchanged.
- [ ] `src/app/globals.css` — append the §5 aurora block (`body::before` washes + `body::after` dots) verbatim; leave `::selection` and reduced-motion blocks intact.
- [ ] `src/app/layout.tsx` — body: `bg-neutral-50` → `bg-ink-50`, `text-neutral-900` → `text-ink-900`.
- [ ] `src/components/ui.ts` — neutral→ink swap in all recipes per §2 table, plus: `panel` → `rounded-xl border-ink-200/80 shadow-lg`; `panelHeader` → `border-ink-200/70 bg-ink-50/60 text-ink-600`; `buttonPrimary` → `rounded-lg shadow-accent`; `buttonSecondary`/`buttonIcon` → `rounded-lg` + ink colors; `inputBase`/`inputField` → `rounded-xl border-ink-200 hover:border-ink-300`; `inputError` → §6 danger slots; `buttonIconDanger` → `hover:bg-danger-50 hover:text-danger-600`; `skeleton` → `rounded-md bg-ink-200/70`.
- [ ] `src/components/status-message.tsx` — green→success / red→danger triads per §6 table; `rounded-md` → `rounded-lg`.
- [ ] `src/components/task-list.tsx` — neutral→ink; row hover → `hover:bg-accent-50/70`; timestamps → `text-ink-500`; empty-state glyph circle → `border-ink-200 bg-ink-50 text-ink-400`.
- [ ] `src/components/task-form.tsx` — labels → `text-ink-700`, "(optional)" → `text-ink-400`, helper error text → `text-danger-600`.
- [ ] `src/app/page.tsx`, `src/app/tasks/new/page.tsx`, `src/app/tasks/[id]/edit/page.tsx`, `src/app/error.tsx` — neutral→ink per §2; aurora-level subtitles/back-links idle at `text-ink-600`, hover `text-ink-900`.
- [ ] `src/components/skeletons.tsx` — `divide-neutral-100` → `divide-ink-100`; shimmer label stays `text-ink-400` (decorative).
- [ ] QA sweep: `grep -r "neutral-\|green-\|red-" src/` returns 0 hits; no `dark:` classes; exactly one texture layer; panels opaque white; light-only output.
