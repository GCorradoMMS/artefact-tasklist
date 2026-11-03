# Visual Enhancement Report — Task Manager

**Workflow:** Visual Enhancement & UI Refinement · **Date:** 2026-11-03
**Design concept:** "Quiet Aurora" · **Verdict:** ✅ Complete — implemented, validated, approved

---

## 1. Summary of visual changes

The app went from a flat, anonymous `neutral-50` demo look to a deliberately designed product:
a fixed pastel **aurora background** (violet pools + a rose pool + 1px dotted grain at 3.5%
opacity), a **brand presence** for the first time (logo mark + Fraunces wordmark in a slim
sticky app header, custom SVG favicon), a real **typography system** (Geist Sans workhorse +
Fraunces display + Geist Mono metadata, 7-step scale replacing ad-hoc sizes), and a coherent
**component language** (violet-tinted "ink" neutrals, two-tier radii 10px/12px, layered
accent-tinted shadows, tinted hairline borders, muted semantic colors, accent-washed hovers,
40px mobile touch targets). Zero functional changes: routes, tRPC data flow, optimistic
deletes, infinite scroll, validation, and a11y semantics are untouched.

## 2. Design direction

"**Quiet Aurora**" — three layers, bottom-up: (1) **Aurora**, a fixed, ultra-low-saturation
pastel gradient sky dusted with a 1px dotted grid that fades below the first viewport;
(2) **Paper**, opaque white panels with soft layered shadows and tinted hairline borders;
(3) **Ink**, violet-tinted near-black text with a single indigo-violet interactive accent and
one display serif reserved for wordmark, page h1s, and the empty state. Light mode only (dark
mode explicitly ruled out for scope; the pastel concept is light-native). Principles: soft
setting/crisp subject; one accent, deep support; quiet not invisible; type is the brand;
deliberate geometry; respect the engineering. Full rationale in
`docs/design/DESIGN_DIRECTION.md`; binding conflict resolutions in
`docs/design/CONSOLIDATION_RULINGS.md` (12 rulings, e.g. wordmark size fixed by 320px-fit
math, timestamps lifted `ink-400→ink-500` for AA).

## 3. Typography

- **Geist Sans** — body, rows, inputs, buttons, banners (kept; `next/font/google`, variable).
- **Fraunces** — display serif, `opsz` axis loaded, weight 500 (wordmark, h1s) / 600
  (empty-state headline). Chosen over Instrument Serif (no opsz, 400-only) and Newsreader
  (anonymous). Never below 20px, never in inputs/buttons/banners.
- **Geist Mono** — timestamps, list counter, panel microcopy (inherently tabular digits).
- Type scale tokens (`--text-display-xl/h1/h2/body-lg/body/caption/micro`) carry size,
  line-height, letter-spacing and weight; page h1s rose from `text-xl` to a 28px display step.
- Loading: all via `next/font` (self-hosted, preloaded, `display: "swap"`, metric-matched
  fallbacks → no CLS/FOUC). Added weight ≈ 105–125KB one-time. No new dependencies.

## 4. Color palette

| Family | Role | Values |
|---|---|---|
| Accent (indigo-violet) | only interactive color; primary anchored at `accent-600` | kept verbatim `#eef0fe→#2b2f72` + `--color-accent` alias |
| Ink (violet-gray, hue ≈248) | all text, borders, neutral surfaces; replaces every `neutral-*` | `--color-ink-50 #f7f7fb → ink-950 #1e1e33` |
| Aurora Rose (atmospheric) | background wash + empty-state tile only, never chrome | `rgb(240 176 192 / .14)`, tint `#f6edf3` |
| Success (sage) / Danger (brick) | banners, input errors, destructive hover | `--color-success-*`, `--color-danger-*` |

All essential text pairs ≥ 4.5:1 (AA): ink-900/white 14.8, ink-700/white 8.2, ink-600/white 5.4,
ink-500/white 4.6, white/accent-600 6.1, banner triads 8.4–9.8. `ink-400` (2.5:1) is restricted
to decorative glyphs/placeholders/"(optional)".

## 5. Background implementation

Paste-ready CSS in `src/app/globals.css`: `body::before` (fixed, `z-index:-1`,
`pointer-events:none`) lays ink-50 base + three radial washes (violet upper-left α.16, violet
echo upper-right α.10, rose low-right α.14) with a settle-to-base linear fade;
`body::after` adds the 1px accent-600 dot grid (24px cell, opacity 0.035, masked out below
~105vh). Fixed positioning instead of `background-attachment` (no iOS jank). No animation;
`prefers-reduced-motion` unaffected. Saturation lift over white stays ≈5–6%.

## 6. Branding & favicon

- **Logo mark**: 32×32 rounded square (rx 8), diagonal accent-500→700 gradient — the one
  sanctioned chrome gradient — with a bold 3.5-unit white check. Lives in
  `src/components/brand.tsx` as `<LogoMark>` (server component, optional `title` for a11y,
  `gradientId` prop instead of `useId()` — sanctioned deviation to avoid client JS).
- **Lockup**: `<BrandLockup>` = 28px mark + "Task Manager" wordmark (`font-display text-xl`,
  weight 500, −0.01em, `ink-900`), whole lockup links home with `aria-label`.
- **Header**: new sticky `h-14` app bar (`bg-white/70 backdrop-blur-sm` — the only blur
  surface per ruling), hairline `border-ink-200/60`, container aligned to the `max-w-2xl`
  column, route-gated "New task" CTA on `/` only. Wordmark size (20px) was fixed by 320px
  mobile-fit math (Ruling R1).
- **Favicon**: `favicon.ico` deleted; `src/app/icon.svg` (byte-exact spec SVG) serves via App
  Router convention — single `<link rel="icon">` emitted, 200 OK. **16px legibility test
  passed** (bold check on violet tile, see `screenshots/final/favicon-legibility.png`).
- **Metadata**: title template kept; description unified to "A simple task manager backed by a
  tRPC API."; `viewport.themeColor = "#f7f7fb"` (aurora base). Per-page titles untouched.

## 7. Components & pages modified

- **`ui.ts` recipes**: `buttonPrimary` (+`shadow-accent` whisper, `rounded-lg`), secondary/
  icon buttons (ink colors, accent wash hovers, `h-10 sm:h-8` icon touch targets), inputs
  (`rounded-xl`, softened border, unchanged focus pattern), `panel` (`rounded-xl border-ink-200/80
  shadow-lg`), `panelHeader` (white, mono caption counter), `skeleton` (ink tint), new
  `backLink` (adds the previously missing focus ring).
- **Home**: display h1, new subtitle copy "Plan, add, and complete your daily work.", page CTA
  removed (lives once in the header), `mb-8` rhythm.
- **New/Edit**: unified page-header pattern (backLink `mb-4` → h1 → subtitle `mb-8`), copy
  byte-identical otherwise.
- **Error**: restructured to the page-header pattern ("Something went wrong" as display h1 +
  new subtitle; panel holds icon `danger-600` + message + actions); padding outlier removed.
- **Task list**: 4% accent row wash, `divide-ink-100`, mono ink-500 timestamps/counter/end
  marker, ink-600 aurora-level secondary text; **empty state** redesigned (56px gradient tile
  with Aurora Rose tint + inset ring, Fraunces 30px headline, `sm:py-20` stage).
- **Banners**: `rounded-lg`, muted success/danger triads; roles and fade-in kept.
- **Form**: labels/errors retokenized (`text-body`/`text-caption`, `danger-600`).
- **Skeletons**: layout-matched to every recipe change; decorative placeholder styling.

## 8. Files created / modified / deleted

**Created:** `docs/design/{DESIGN_DIRECTION,BRANDING_SPEC,TYPOGRAPHY_SPEC,VISUAL_DESIGN_SPEC,UI_UX_SPEC,CONSOLIDATION_RULINGS,TASK_REGISTRY}.md`,
`docs/design/screenshots/{baseline,final}/*.png` (14 evidence captures),
`src/components/brand.tsx`, `src/components/app-header.tsx`, `src/app/icon.svg`.
**Modified:** `src/app/globals.css`, `src/app/layout.tsx`, `src/app/page.tsx`,
`src/app/error.tsx`, `src/app/tasks/new/page.tsx`, `src/app/tasks/[id]/edit/page.tsx`,
`src/components/{ui,task-list,task-form,status-message,skeletons}.tsx`.
**Deleted:** `src/app/favicon.ico`.
**Untouched (functional):** `src/server/**`, `src/lib/**`, `src/trpc/**`, `next.config.ts`,
`package.json` (no new dependencies).

## 9. Build & test results

| Gate | Result |
|---|---|
| `npm run lint` | ✅ clean |
| `npm run build` (Turbopack) | ✅ passes; `/icon.svg` registered; 5/5 pages generated |
| Legacy-color grep (`neutral-|green-|red-` in classes) | ✅ 0 hits |
| `text-xl` outside wordmark | ✅ 0 hits |
| `dark:` classes | ✅ 0 hits |
| `font-display` surfaces | ✅ exactly wordmark + 4 h1s + empty state |
| Runtime console (6 page×viewport combos) | ✅ zero errors, zero failed requests |
| Functional smoke (create → update → delete via UI) | ✅ API 200s, banners, list updates |
| Favicon 16px legibility | ✅ passed |
| Responsive 1280px & 390px | ✅ verified (header fits 320px by R1 math) |

## 10. Visual evidence

`docs/design/screenshots/baseline/` (pre-change) vs `final/` (post-change): home, new, edit at
1280px and 390px; plus `final/empty-desktop.png` (empty state display moment) and
`final/favicon-legibility.png` (16/32/64px mark). QA found and fixed one regression during
validation: the brand SVG was pasted with kebab-case attributes (`stop-color` etc.) causing
React DOM warnings — corrected to camelCase, re-verified clean.

## 11. Task status

- **Completed (T1–T8):** design direction; 4 specialist specs; conflict consolidation; tokens +
  aurora; fonts; brand assets + favicon + metadata; recipes; app header; 4 pages; 5 shared
  components; build/lint/greps/browser QA; correction task (SVG attributes) fixed and
  re-validated.
- **Partially completed:** none.
- **Uncompleted / out of scope:** dark mode (ruled out by direction §9); unstyled default
  **404/not-found page** (no `not-found.tsx` existed before or after — pre-existing behavior,
  flagged as a candidate future task); error boundary verified by code review only (not
  triggerable in dev without injecting a fault).

## 12. Outstanding issues & limitations

1. Default Next.js 404 page remains unstyled (pre-existing; small follow-up: add
   `src/app/not-found.tsx` in the same page-header pattern).
2. The header CTA is gated to `/` by design; on form pages "New task" is intentionally absent
   to avoid competing with submit (documented in UI_UX §1).
3. `LogoMark` uses a static gradient id (single instance per page); if the mark is ever
   rendered multiple times in one document, pass distinct `gradientId` props.
4. Fraunces/Geist Mono add ≈105–125KB woff2 one-time (cached, preloaded, swap-safe) — accepted
   by the typography spec's performance budget.
5. In-memory store reseeds to 100 tasks on server restart (pre-existing behavior, unchanged).
