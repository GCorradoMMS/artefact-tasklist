# UI/UX Spec — "Quiet Aurora" layout, screens & components

**Product:** Task Manager · **Author:** Agent 5 — UI/UX Specialist · **Date:** 2026-11-03
**Upstream:** `DESIGN_DIRECTION.md` (rulings binding) · **Siblings:** `VISUAL_DESIGN_SPEC.md`, `TYPOGRAPHY_SPEC.md`, `BRANDING_SPEC.md`

**Token dependencies.** Classes below use placeholder token families finalized by sibling specs:
`ink-*` (tinted neutrals, steps mirror today's `neutral-*` 1:1), `atmos-*` (single atmospheric hue),
`success-*` / `danger-*` (muted semantics), `shadow-panel` (layered panel shadow), `font-display`
(display serif) — all defined in `VISUAL_DESIGN_SPEC.md` / `TYPOGRAPHY_SPEC.md` / `BRANDING_SPEC.md`.
If a sibling final value differs (e.g., display step, shadow recipe), **the sibling spec wins**; the
class strings here are the mechanically implementable fallback. `accent-*` is unchanged except where noted.

---

## 1. App shell — persistent app header

**New file:** `src/components/app-header.tsx` (client component, `usePathname` for CTA gating).
**Mounted once** in `src/app/layout.tsx`, above `<Providers>{children}</Providers>`. No footer, no nav.

```tsx
<header className="sticky top-0 z-40 border-b border-ink-200/60 bg-white/70 backdrop-blur-sm">
  <div className="mx-auto flex h-14 w-full max-w-2xl items-center justify-between px-4">
    <Link href="/" className={cx("inline-flex items-center gap-2 rounded-lg", focusRing)}>
      <LogoMark className="h-7 w-7" />   {/* per BRANDING_SPEC (mark + sanctioned gradient) */}
      <span className="font-display text-[15px] font-medium tracking-tight text-ink-900">
        Task Manager
      </span>
    </Link>
    {pathname === "/" && (
      <Link href="/tasks/new" className={buttonPrimary}>
        <PlusIcon /> New task
      </Link>
    )}
  </div>
</header>
```

- **Height:** `h-14` (56px) on all viewports — one value, no breakpoint jump.
- **Container:** `max-w-2xl px-4` on every route — global chrome aligns to the page frame (list
  column), not per-route; form pages (`max-w-xl`) still read as centered under one frame.
- **Right slot decision:** primary **"New task" CTA, gated to the list route** (`pathname === "/"`).
  Always-visible CTA matters with 100 tasks of infinite scroll; on create/edit forms it would
  compete with the submit button, and on the error page it is noise — so it hides there. The home
  page's own CTA is **removed** (see §8) so the CTA exists exactly once.
- **Sticky — decision & 3-line justification:** (1) With infinite scroll over 100 tasks, sticky keeps
  brand + primary CTA reachable with no scroll-to-top. (2) `bg-white/70 backdrop-blur-sm` is the
  featherweight wash the direction sanctions, and the header is the *only* blur surface (§8.4).
  (3) Panels stay opaque white per ruling, so there is no glass-on-glass stacking; no scroll-linked
  shadow/animation, only the constant hairline border — it cannot read as dashboard chrome.
- **Mobile:** identical height and layout; lockup 28px mark + wordmark fits 320px; no menu, no
  hamburger, no secondary items, ever.
- **Contrast:** `ink-900` wordmark over ≥70% white wash passes AA; hairline is decoration only.

## 2. Spacing & rhythm system (4/8 grid, locked)

| Token | Value | Notes |
|---|---|---|
| Page container | `mx-auto w-full max-w-2xl px-4 py-10 sm:py-14` (list, error) / `max-w-xl` (forms) | **Unchanged, now identical on all four surfaces** — error page drops its `py-16` outlier |
| App-header height | `h-14` (56) | Sticky, in-flow — content needs no offset |
| Back link → h1 | `mb-4` (16) | Was `mb-5` |
| h1 → subtitle | `mt-1` (4) | Was `mt-0.5` |
| Page-header block → content | `mb-8` (32) | Was `mb-6` (home header) / `mb-6` (form subtitle) |
| Panel inner padding | `p-5 sm:p-6` | **Audit verdict: keep. Locked.** |
| List row padding | `px-4 py-3.5` | **Audit verdict: keep. Locked** (14px vertical suits 1–2-line rows) |
| panelHeader padding | `px-4 py-2.5` | Keep (matches row x-inset); color/typography retuned only |
| Banner → panel gap | `space-y-3` (12) | Keep (banner hugs its panel) |
| Form field rhythm | `space-y-5`, label `mb-1.5`, submit row `gap-2.5 pt-1` | Keep |
| Empty state padding | `px-6 py-16 sm:py-20` | Larger stage for the display moment |

## 3. Screen-by-screen changes

### 3.1 Home — `src/app/page.tsx`

| Element | Old | New |
|---|---|---|
| `<main>` | `mx-auto w-full max-w-2xl px-4 py-10 sm:py-14` | unchanged |
| Header row | `mb-6 flex flex-wrap items-end justify-between gap-x-4 gap-y-3` | `mb-8` plain block — flex row and CTA removed |
| h1 "Tasks" | `text-xl font-semibold tracking-tight text-neutral-900` | `font-display text-3xl font-medium leading-tight tracking-tight text-ink-900 sm:text-4xl` |
| Subtitle | `mt-0.5 text-sm text-neutral-500` | `mt-1 text-sm text-ink-500` + new copy (§9) |
| "New task" button + `PlusIcon`/`buttonPrimary` imports | in page header | **removed** — lives in app header |
| Suspense/TaskList | — | unchanged |

Display step: final size/weight per `TYPOGRAPHY_SPEC.md`; fallback above uses Tailwind steps.

### 3.2 New task — `src/app/tasks/new/page.tsx`

| Element | Old | New |
|---|---|---|
| `<main>` | `max-w-xl px-4 py-10 sm:py-14` | unchanged |
| Back link | `mb-5 inline-flex items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-neutral-900` | new `backLink` recipe (below) + `mb-4` |
| h1 "Create a new task" | `text-xl font-semibold tracking-tight` | same display classes as home h1 |
| Subtitle | `mt-0.5 mb-6 text-sm text-neutral-500` | `mt-1 mb-8 text-sm text-ink-500`, copy unchanged |
| Panel | `panel` + `p-5 sm:p-6` | unchanged (recipe updates apply) |

### 3.3 Edit task — `src/app/tasks/[id]/edit/page.tsx`
Identical to 3.2 (same back-link recipe, h1 "Edit task", subtitle copy unchanged). Keep `loading.tsx` in sync via `TaskFormSkeleton` recipe updates. Also update `TaskFormSkeleton`'s inline back-link to the new recipe styling.

**New shared recipe** in `src/components/ui.ts` (unifies 3 back-link call sites, adds the missing focus ring — a11y-floor fix):

```ts
export const backLink = cx(
  "inline-flex items-center gap-1.5 rounded-md text-sm text-ink-500",
  "transition-colors duration-150 hover:text-ink-900",
  focusRing,
);
```

### 3.4 Error — `src/app/error.tsx` (restructured to the page-header pattern)

| Element | Old | New |
|---|---|---|
| `<main>` | `max-w-2xl px-4 py-16` | `max-w-2xl px-4 py-10 sm:py-14` |
| Structure | everything inside one panel | **h1 + subtitle as page header, panel below holds icon + message + actions** |
| h1 | `text-sm font-semibold` inside panel | `font-display text-3xl font-medium leading-tight tracking-tight text-ink-900 sm:text-4xl` — "Something went wrong" |
| Subtitle (new slot) | — | `mt-1 mb-8 text-sm text-ink-500` — "An unexpected error interrupted this view." |
| Panel | `${panel} p-5 sm:p-6` | unchanged wrapper; inner: `flex items-start gap-3` |
| Alert icon | `text-red-600` | `text-danger-600` (fallback `text-red-600`) |
| Message | `h1`-adjacent text-sm `text-neutral-500` | `min-w-0 break-words text-sm leading-6 text-ink-700` (`error.message`, semantic source of truth) |
| Actions | `mt-5 flex gap-2.5` — Try again / Back to tasks | unchanged labels & recipes |

## 4. Component refinements — `src/components/ui.ts` recipes

**Primary button** — solid accent per direction §7.5 (a gradient here is explicitly overruled; the
sanctioned polish is the accent-tinted shadow whisper):

```ts
export const buttonPrimary = cx(
  "inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-accent-600 px-3.5 text-sm font-medium text-white",
  "shadow-sm shadow-accent-600/25",
  "transition duration-150 hover:bg-accent-700 active:bg-accent-800 active:shadow-none",
  focusRing,
  "disabled:pointer-events-none disabled:opacity-55 disabled:shadow-none",
);
```

**Secondary button** (tinted wash instead of gray-on-gray):

```ts
"… rounded-lg border border-ink-200 bg-white px-3.5 … text-ink-700",
"transition duration-150 hover:border-ink-300 hover:bg-ink-50 hover:text-ink-900",
```

**Icon button** — 40px touch target on mobile, compact 32px from `sm:` up; accent-tinted hover:

```ts
export const buttonIcon = cx(
  "inline-flex h-10 w-10 items-center justify-center rounded-lg text-ink-400 sm:h-8 sm:w-8",
  "transition duration-150 hover:bg-accent-500/10 hover:text-ink-700",
  focusRing,
  "disabled:pointer-events-none disabled:opacity-50",
);
export const buttonIconDanger = "hover:bg-red-500/10 hover:text-red-600"; // → danger tokens
```

**Heights audit:** keep `h-9` (36px) for standard buttons — passes WCAG 2.5.8 and matches input
height for row alignment. Icon buttons get the mobile-only 40px bump (§6).

**Inputs** — 12px radius, softened resting border, focus pattern unchanged:

```ts
export const inputBase = cx(
  "w-full rounded-xl border border-ink-200/80 bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400",
  "transition duration-150 hover:border-ink-300",
  "focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/15",
);
```
`inputField = cx(inputBase, "h-9 py-0")` unchanged; `inputError` structure unchanged, hues → `danger-*`.

**Panel** — 12px radius, tinted hairline, layered shadow (`shadow-panel` recipe from VISUAL spec;
inline fallback `shadow-[0_1px_2px_rgb(28_25_51/0.04),0_12px_32px_-12px_rgb(99_91_255/0.12)]`):

```ts
export const panel = "overflow-hidden rounded-xl border border-ink-200/70 bg-white shadow-panel";
```

**panelHeader** — de-tinted to white, mono microcopy (typography is the separator now):

```ts
export const panelHeader =
  "border-b border-ink-100 bg-white px-4 py-2.5 font-mono text-xs font-medium text-ink-500";
```

**Skeleton base** — re-tinted to the ink ramp, radius matches the 8–10px tier; `animate-pulse` kept:

```ts
export const skeleton = "animate-pulse rounded-lg bg-ink-200/60";
```

`focusRing` and `cx` unchanged.

### 4.1 Task list — `src/components/task-list.tsx`

| Element | Old | New |
|---|---|---|
| Row `<li>` | `group px-4 py-3.5 transition-opacity duration-150 hover:bg-neutral-50/75` | `group px-4 py-3.5 transition duration-150 hover:bg-accent-500/[0.04]` (4% accent wash; `transition` covers the delete opacity fade too) |
| Deleting state | `pointer-events-none opacity-50` | unchanged |
| Title / description | `text-neutral-900` / `text-neutral-500` | `text-ink-900` / `text-ink-500` |
| Timestamp | `mt-2 text-xs text-neutral-400` | `mt-2 font-mono text-xs text-ink-400` |
| Row divide | `divide-y divide-neutral-100` | `divide-y divide-ink-100` (lighter than panel outline) |
| Count header | via `panelHeader` | recipe update applies — string "Showing X of Y tasks" untouched |
| Loading more | `py-3 … text-neutral-500` | color → `text-ink-500`; spinner/behavior unchanged |
| End of list | `py-3 text-center text-xs text-neutral-400` | `py-4 text-center font-mono text-xs text-ink-400` |

### 4.2 Empty state

```tsx
<section aria-label="No tasks" className={cx(panel, "flex flex-col items-center px-6 py-16 text-center sm:py-20")}>
  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-50 via-white to-atmos-100 text-accent-600 ring-1 ring-inset ring-accent-500/10">
    <InboxIcon size={24} />
  </span>
  <h2 className="mt-5 font-display text-xl font-medium tracking-tight text-ink-900 sm:text-2xl">No tasks yet</h2>
  <p className="mt-1.5 text-sm text-ink-500">Create your first task to get started.</p>
  <Link href="/tasks/new" className={cx("mt-6", buttonPrimary)}>New task</Link>
</section>
```
The tile gradient is sanctioned: the atmospheric hue is permitted in empty-state illustration
(direction §7.2), and this is illustration, not chrome. Icon 11×11 circle → 14×14 rounded-2xl tile.

### 4.3 Banners — `src/components/status-message.tsx`
Keep `role`, `animate-fade-in`, icon placement, `px-3 py-2.5 text-sm`. Changes only: `rounded-md`
→ `rounded-lg`; hues → muted semantic tokens (`border-success-200 bg-success-50 text-success-800`,
icon `text-success-600`; `danger-*` equivalents; fallback: keep current green/red until tokens land).

### 4.4 Skeletons — `src/components/skeletons.tsx`
`TaskListSkeleton` / `TaskFormSkeleton` inherit the new `panel`, `panelHeader`, `skeleton`, row and
divide styles automatically — structure is already layout-matched, change nothing structural.
Only edits: `divide-neutral-100` → `divide-ink-100`; `TaskFormSkeleton` back link → `backLink`
recipe styling (`mb-4`, `text-ink-400`, no hover, keep `aria-hidden tabIndex={-1}`); skeleton row
paddings stay `px-4 py-3.5` to match rows.

## 5. Responsive rules

- **Max-widths verified:** `max-w-2xl` / `max-w-xl` + `px-4` fit 320px; unchanged.
- **Header:** fixed `h-14` at every breakpoint; lockup + "New task" fit side-by-side at 320px
  (lockup ≈ 150px, CTA ≈ 96px); `justify-between` absorbs the slack — no wrap, no stacking.
- **Home header:** no longer a wrapping flex row — single text block, stacks by construction.
- **Touch targets:** icon buttons `h-10 w-10` (<640px) → 40px; standard buttons keep `h-9`
  (36px, WCAG 2.5.8-passing); inputs `h-9`. No tap-target below 36px anywhere.
- **Display h1 on mobile:** `text-3xl` (30px) at 320px — "Create a new task" fits one line at
  `max-w-xl`; longer strings wrap gracefully under `leading-tight`. `sm:text-4xl` (36px) from 640px.
- **Error page:** same header pattern as forms; panel is the only element that resizes.

## 6. State & motion

- **Transition budget:** all transitions stay `duration-150`. New washes (rows 4% accent, icon
  buttons 10% accent, secondary `ink-50`) ride the existing `transition` — no new durations.
- **Focus visibility:** `focusRing` unchanged (accent ring, AA over aurora and over white panels);
  **added** to back links via the new recipe (was a gap).
- **Motion kept:** banner `animate-fade-in`, skeletons `animate-pulse`, spinners `animate-spin`,
  delete-row `opacity-50` fade. **No new animation**, and none on the header (static sticky).
- **`prefers-reduced-motion`:** verify `globals.css` gates `animate-fade-in` / `animate-pulse` /
  `animate-spin` (existing discipline — confirm it still covers the renamed/tinted pieces).
- **Z-index:** header `z-40` is the only elevated layer; nothing else sets z-index.
- **Hover discipline:** hover affects background/text color only — no lift, no scale, no shadow-on-hover.

## 7. Clutter reductions

1. **Home page CTA removed** — "New task" lives only in the app header (one instance, always visible); kills the wrapping flex header row on home.
2. **Error page de-duplicated** — icon/message/h1 no longer share one panel; h1 + subtitle become the standard page header, the panel holds only evidence + actions.
3. **panelHeader de-tinted** (`bg-neutral-50/60` → white) — one less gray band; hairline + mono do the work.
4. **"End of the list." kept but demoted** to mono microcopy with `py-4` — a quiet completion cue, not a banner.
5. **Back links kept** (explicit nav beats logo-as-home; the header lockup is a bonus path) but unified into one recipe with fixed `mb-4`.
6. **`py-16` outlier on error page removed** — one page-padding value across all surfaces.
7. **Affirmed non-additions:** no sidebar, no footer, no breadcrumbs, no stats, no nav menus, no avatars/settings slot in the header.

## 8. Microcopy changes

| Surface | Old | New |
|---|---|---|
| Home subtitle | "A simple task manager backed by a tRPC API." | **"Plan, add, and complete your daily work."** |
| Error subtitle (new slot) | — | **"An unexpected error interrupted this view."** |

**Everything else stays byte-identical:** "Tasks", "New task", "Tasks" (back links), "Create a new
task", "Edit task", both form subtitles, all labels/placeholders/errors, "Create task"/"Creating…" /
"Created"/"Save changes"/"Saving…"/"Cancel", "Showing X of Y tasks", "Task deleted.", "End of the
list.", "Loading more tasks…", "No tasks yet", "Create your first task to get started.", "Something
went wrong", "Try again", "Back to tasks", all aria-labels/roles. Product name untouched.

## 9. Implementer handoff checklist

- [ ] **`src/app/layout.tsx`** — mount `<AppHeader />` above `<Providers>`; replace `bg-neutral-50` with the aurora layer per `VISUAL_DESIGN_SPEC.md`; add `font-display` variable next to `geistSans`.
- [ ] **`src/components/app-header.tsx` (new)** — sticky `h-14` bar, exact classes in §1; lockup (mark per BRANDING_SPEC) + `usePathname === "/"`-gated primary CTA; `z-40`.
- [ ] **`src/components/ui.tsx`→`ui.ts`** — apply all recipe rewrites in §4 (primary/secondary/icon buttons, `inputBase`, `panel`, `panelHeader`, `skeleton`) and add the `backLink` recipe.
- [ ] **`src/app/page.tsx`** — display h1 + `mt-1`/`mb-8` rhythm, new subtitle copy, delete the page-level "New task" button, `Link`/`PlusIcon`/`buttonPrimary` imports.
- [ ] **`src/app/tasks/new/page.tsx`** — back link → `backLink` + `mb-4`; display h1; subtitle `mt-1 mb-8 text-ink-500`.
- [ ] **`src/app/tasks/[id]/edit/page.tsx`** — same three changes as new page.
- [ ] **`src/app/error.tsx`** — restructure to page-header pattern (§3.4), unify padding to `py-10 sm:py-14`.
- [ ] **`src/components/task-list.tsx`** — accent row wash, mono timestamp, `divide-ink-100`, mono end-of-list, `text-ink-*` swaps (§4.1).
- [ ] **`src/components/task-list.tsx`** — rebuild EmptyState per §4.2 (14×14 gradient tile, display h2, `sm:py-20`, `mt-6` CTA).
- [ ] **`src/components/status-message.tsx`** — `rounded-lg` + muted `success-*`/`danger-*` tokens; keep roles and fade-in.
- [ ] **`src/components/skeletons.tsx`** — swap divide color, align back-link to recipe, verify paddings still match rows (`px-4 py-3.5`).
- [ ] **`src/app/globals.css` / `@theme`** — define `shadow-panel`, `font-display`, semantic tokens; confirm `prefers-reduced-motion` covers all `animate-*` utilities.
- [ ] **QA pass** — one "New task" instance per route; opaque panels everywhere except header; focus rings visible over aurora; no functional/a11y regressions; zero new dependencies.
