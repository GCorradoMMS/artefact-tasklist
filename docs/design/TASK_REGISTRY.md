# Task Registry — Visual Enhancement

**Orchestrator-owned.** Status: pending → in-progress → done / blocked. One owner: Agent 6 —
Frontend Implementer executes T1–T7 sequentially (overlapping files forbid parallel execution).
T8 is the orchestrator's QA phase.

| ID | Objective | Files | Depends on | Status |
|----|-----------|-------|------------|--------|
| T1 | Design tokens + aurora background | `src/app/globals.css` | — | done |
| T2 | Font loading (Fraunces, Geist Mono, Geist) + body classes | `src/app/layout.tsx` | T1 | done |
| T3 | Brand: LogoMark/BrandLockup component, icon.svg, delete favicon.ico, metadata/viewport | `src/components/brand.tsx` (new), `src/app/icon.svg` (new), `src/app/favicon.ico` (delete), `src/app/layout.tsx` | T2 | done |
| T4 | Shared recipe overhaul + `backLink` | `src/components/ui.ts` | T1 | done |
| T5 | App header component + mount | `src/components/app-header.tsx` (new), `src/app/layout.tsx` | T3, T4 | done |
| T6 | Pages: home / new / edit / error to page-header pattern | `src/app/page.tsx`, `src/app/tasks/new/page.tsx`, `src/app/tasks/[id]/edit/page.tsx`, `src/app/error.tsx` | T4, T5 | done |
| T7 | Components: task list, empty state, form, banners, skeletons | `src/components/task-list.tsx`, `task-form.tsx`, `status-message.tsx`, `skeletons.tsx` | T4 | done |
| T8 | Visual QA: build, lint, greps, screenshots, contrast, console | — | T1–T7 | done |

## Acceptance criteria (global)

- Spec sources: `docs/design/{DESIGN_DIRECTION,VISUAL_DESIGN_SPEC,TYPOGRAPHY_SPEC,BRANDING_SPEC,UI_UX_SPEC,CONSOLIDATION_RULINGS}.md`. Rulings doc wins on conflict.
- No functional changes: routes, tRPC calls, cache ops, validation, aria roles, event handlers untouched.
- No new runtime dependencies; no `tailwind.config.js`; no dark-mode classes.
- `grep -rE "neutral-|green-|red-" src/` → 0 hits (in className strings); no `text-xl` used as h1; `font-display` only on wordmark/h1s/empty-state headline.
- `npm run build` and `npm run lint` pass; no console errors at runtime.
- Favicon: bold white check on violet tile legible at 16px; only one icon link emitted.
- Responsive verified at 1280px and 390px (plus 320px header-fit reasoning in R1).

## Per-task acceptance (condensed — full detail in specs + rulings)

- **T1:** ink/success/danger ramps, `--color-accent` alias, radius + shadow token overrides, 7-step type scale, `@theme inline` font mappings, `body::before/::after` aurora block verbatim (VISUAL §5), `::selection` + reduced-motion intact.
- **T2:** TYPOGRAPHY §2.1 font block verbatim; all three `.variable` classes on `<body>`; body bg/text → ink tokens.
- **T3:** BRANDING §2 SVG verbatim with `useId()` gradient id; `icon.svg` byte-exact per §5; favicon.ico deleted; BRANDING §6 metadata + viewport with R9 values.
- **T4:** All recipe rewrites per UI_UX §4 **as amended by R4–R8, R10–R12**; `backLink` per R5.
- **T5:** UI_UX §1 header with R1 lockup; `z-40`; CTA gated to `/`.
- **T6:** UI_UX §3.1–3.4 with R2 h1/subtitles, R5 back links, R9 copy; home CTA + flex header removed; error page restructured.
- **T7:** UI_UX §4.1–4.4 with R4/R5/R7/R8/R11/R12; empty state per R3.
