# Consolidation Rulings — "Quiet Aurora"

**Author:** Agent 1 — Design Director (orchestration consolidation pass) · **Date:** 2026-11-03
**Status:** Binding. Where the five specs disagree, THIS document wins. Everything else in the specs stands.

The specialist specs were written in parallel and are ~95% coherent. This pass resolves every
detected conflict and locks the final class strings. Numbered rulings; each names the loser.

---

## R1 — Wordmark size (resolves BRANDING §3 vs TYPOGRAPHY §4 vs UI_UX §1)

**Wordmark = `font-display text-xl font-medium tracking-[-0.01em] text-ink-900`.**
20px, weight 500, −0.01em tracking. Size-stable at every viewport (BRANDING wins; the
`text-h1`-sized wordmark from TYPOGRAPHY and the 15px sketch in UI_UX lose).

Reason: mobile-fit math. At 320px the header holds lockup (28px mark + 10px gap + wordmark) plus
the route-gated "New task" CTA. A 28px Fraunces wordmark measures ≈230px lockup + ≈100px CTA >
288px available; 20px measures ≈175px + 100px = 275px — fits. Brand presence stays strong (the
header is the only brand surface), and Fraunces' `opsz` axis keeps 20px sturdy.

Header lockup final: `<Link href="/">` · `inline-flex items-center gap-2.5 rounded-lg` +
`focusRing` · `<LogoMark size={28} className="shrink-0" />` · wordmark `<span aria-hidden>` with
the classes above. Link carries `aria-label="Task Manager — home"`.

## R2 — Page h1 scale (resolves TYPOGRAPHY §3 vs UI_UX §3)

**All page h1s = `font-display text-h1 text-ink-900 text-balance`.** One step (28px/34px, weight
500, −0.02em baked in the token) at every viewport — no `sm:` jump. TYPOGRAPHY wins (it owns the
scale); UI_UX's `text-3xl sm:text-4xl` fallback loses. "Create a new task" fits one line at
320px in Fraunces 28px (~230px).

**Page subtitles = `text-body-lg text-ink-600 text-pretty`** (16px; TYPOGRAPHY's step wins, but
color ink-600 per R5 — they sit on the aurora). Fixed rhythm (UI_UX §2 stands): back link
`mb-4` → h1 → subtitle `mt-1` → content `mb-8`.

## R3 — Empty state (resolves TYPOGRAPHY §4 vs UI_UX §4.2)

Headline: **`font-display text-display-xl text-ink-900 text-balance`** (30px, weight 600 baked).
TYPOGRAPHY wins on type. Body: **`text-body-lg text-ink-500`** (on white panel).
Tile: UI_UX's 56px (`h-14 w-14 rounded-xl` — radius from the scale, not `rounded-2xl`) gradient
tile `bg-gradient-to-br from-accent-50 via-white to-[#f6edf3]` + `text-accent-600` + inset ring
`ring-1 ring-inset ring-accent-500/10`. `#f6edf3` is Aurora Rose's extreme tint (VISUAL §4) —
sanctioned as illustration. CTA `mt-6`. Padding `px-6 py-16 sm:py-20`.

## R4 — Panel header + counter (resolves VISUAL §7 vs UI_UX §4 vs TYPOGRAPHY §4)

**`panelHeader` = `border-b border-ink-100 bg-white px-4 py-2.5 font-mono text-caption font-medium text-ink-500`.**
White (UI_UX wins over VISUAL's `bg-ink-50/60` tint — clutter reduction #3). The counter
("Showing X of Y tasks") is **essential** info → never `text-micro`/uppercase/ink-400: it renders
at `text-caption` in `text-ink-500` (AA 4.6:1). String byte-identical.

## R5 — Secondary text on the aurora (resolves VISUAL §2-exception vs TYPOGRAPHY §4/UI_UX)

VISUAL's AA-driven exception wins everywhere: **text resting directly on the aurora background
idles at `text-ink-600`, hovers to `text-ink-900`.** Applies to: page subtitles, back links,
"Loading more tasks…". `backLink` recipe final:
`cx("inline-flex items-center gap-1.5 rounded-md text-body text-ink-600", "transition-colors duration-150 hover:text-ink-900", focusRing)`.
Text on **white panels** stays `text-ink-500` (row descriptions, empty-state body).
**Timestamps = `mt-2 font-mono text-caption text-ink-500`** (ink-400 loses — 2.5:1 fails AA;
VISUAL exception #2 + TYPOGRAPHY §6 floor agree).
"End of the list." = `py-4 text-center font-mono text-caption text-ink-500`.

## R6 — Shadow tokens (resolves VISUAL §9 vs UI_UX §4)

VISUAL wins: override `--shadow-xs/sm/md/lg` in `@theme` with VISUAL §9 values + add
`--shadow-accent`. `panel` = `overflow-hidden rounded-xl border border-ink-200/80 bg-white shadow-lg`.
`buttonPrimary` carries `shadow-accent` (not `shadow-sm shadow-accent-600/25`).
No `shadow-panel` alias. Rows/inputs/secondary/icon buttons: no shadow at rest.

## R7 — Icon buttons (VISUAL §7 vs UI_UX §4; direction §7.5)

Direction's "accent-tinted washes" wins:
`buttonIcon = cx("inline-flex h-10 w-10 items-center justify-center rounded-lg text-ink-400 sm:h-8 sm:w-8", "transition duration-150 hover:bg-accent-500/10 hover:text-ink-700", focusRing, "disabled:pointer-events-none disabled:opacity-50")`.
`buttonIconDanger = "hover:bg-danger-500/10 hover:text-danger-600"` (danger mirrors the accent
pattern; VISUAL's `danger-50` variant loses). Mobile 40px targets stand (UI_UX).

## R8 — Skeletons (VISUAL §7 vs UI_UX §4)

`skeleton = "animate-pulse rounded-md bg-ink-200/70"` — radius-md tier (8px) per VISUAL §8;
VISUAL wins on alpha. `divide-ink-100` everywhere.

## R9 — Metadata & theme color (BRANDING §6 + VISUAL §2)

`themeColor: "#f7f7fb"` (aurora base ink-50; BRANDING's provisional `#fbfbfe` resolved).
Metadata description: `"A simple task manager backed by a tRPC API."` (BRANDING's unified
string). Home subtitle copy per UI_UX §8: **"Plan, add, and complete your daily work."**
Error subtitle (new): **"An unexpected error interrupted this view."** All other strings
byte-identical.

## R10 — Borders (VISUAL §7 internal)

Panels `border-ink-200/80`; panel header `border-ink-100`; **inputs idle `border-ink-200`**
(solid — affordance needs more presence than hairlines); hover borders `border-ink-300`.

## R11 — Row hover (VISUAL §7 vs UI_UX §4.1)

`hover:bg-accent-500/[0.04]` — exact 4% per direction ceiling (UI_UX's arbitrary-alpha wins over
VISUAL's `accent-50/70`). Row `<li>` transitions switch `transition-opacity` → `transition`.

## R12 — Misc locks

- `StatusMessage`: `rounded-lg` + triads (success: `border-success-200 bg-success-50 text-success-800`, icon `text-success-600`; danger equivalents per VISUAL §6 table). Form errors `text-caption font-medium text-danger-600`.
- `inputError` = `border-danger-400 hover:border-danger-400 focus:border-danger-500 focus:ring-danger-500/15`.
- Form labels: `text-body font-medium text-ink-700`; "(optional)" stays `text-ink-400` (decorative).
- Empty-state tile radius: `rounded-xl` (scale discipline).
- Reduced-motion block in globals.css unchanged (`animate-fade-in`, `animate-pulse` covered; spinners untouched).
- Loading.tsx / TaskFormSkeleton: back-link placeholder adopts `backLink` colors but stays `text-ink-400`, no hover (decorative, `aria-hidden`).

## Implementation order (binding)

1. `globals.css` tokens + aurora → 2. `layout.tsx` fonts/metadata/body → 3. brand assets +
header → 4. `ui.ts` recipes → 5. pages → 6. components (list/form/banners/skeletons) →
7. QA sweep. See `TASK_REGISTRY.md` for the atomic breakdown.
