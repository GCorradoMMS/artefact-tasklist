# Branding Spec — Task Manager

**Product:** Task Manager · **Author:** Agent 2 — Branding Specialist · **Date:** 2026-11-03
**Upstream:** `DESIGN_DIRECTION.md` ("Quiet Aurora", §7.4 Branding) · **Siblings:** `VISUAL_DESIGN_SPEC.md`, `TYPOGRAPHY_SPEC.md`
**Status:** Final. Brand decisions below are locked; token names marked *pending* resolve when the sibling specs land.

---

## 1. Brand summary

Task Manager's brand is a single gesture: **one violet tile, one white check**. The mark is a
rounded square filled with the only sanctioned gradient in chrome (accent-500 → accent-700),
carrying one bold checkmark. The wordmark is "Task Manager" set live in the display serif,
medium weight, tight tracking. The lockup (mark + wordmark) lives exclusively in the app
header; the mark alone is the favicon. Nothing else in the product is branded — no footer
marks, no splash art, no secondary variants. The name is fixed: **"Task Manager"** — never
renamed, reworded, or abbreviated.

## 2. Logo mark

Canonical geometry (viewBox `0 0 32 32`). This exact markup is the source of truth for the
component, the favicon, and any future export.

```svg
<svg viewBox="0 0 32 32" role="img" aria-label="Task Manager">
  <defs>
    <linearGradient id="tm-mark" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#5b63e8" />  <!-- accent-500 -->
      <stop offset="1" stop-color="#3e44b4" />  <!-- accent-700 -->
    </linearGradient>
  </defs>
  <rect width="32" height="32" rx="8" fill="url(#tm-mark)" />
  <path d="M8.5 16.5 14 22l9.5-11.5"
        fill="none" stroke="#ffffff" stroke-width="3.5"
        stroke-linecap="round" stroke-linejoin="round" />
</svg>
```

**Geometry rationale**

- **Tile:** `32×32` with `rx="8"` (25% corner) — the soft-squircle read the direction calls
  for; scales to a 4px corner at 16px, matching modern favicon silhouettes.
- **Gradient:** diagonal 135° (`x1/y1 = 0,0 → x2/y2 = 1,1`), accent-500 `#5b63e8` → accent-700
  `#3e44b4` — values taken verbatim from `globals.css`. Subtle at every size; at 16px it reads
  as a solid violet tile, which is fine (the acceptance test is the check, not the gradient).
  This is the direction's **one sanctioned gradient inside chrome**.
- **Check:** a three-point polyline `8.5,16.5 → 14,22 → 23.5,10.5`, `stroke-width 3.5`
  (≈11% of tile width → **1.75px at 16px**: bold, single-glyph, passes the acceptance test),
  round caps/joins. Bounds are optically centered (effective ink center ≈ 16, 16.25).
  White `#ffffff` for maximum contrast on both gradient stops (AA+ as a graphic).
- **No detail below 16px threshold:** two elements total (tile + check). Nothing else ships.

### Component contract — `src/components/brand.tsx` (spec only; implementer writes the file)

```tsx
type LogoMarkProps = {
  size?: number;       // default 24; rendered as width={size} height={size}, square
  className?: string;  // passthrough, e.g. "shrink-0"
  title?: string;      // accessible name; omit → aria-hidden (decorative, e.g. inside lockup)
};

type BrandLockupProps = {
  href?: string;       // default "/"; whole lockup is a link home
};
```

Implementation rules for the implementer:

- Render the SVG markup from §2 verbatim; generate `id` for `linearGradient` with React
  `useId()` (multiple `<LogoMark>` instances must not collide on `tm-mark`).
- `<LogoMark title="Task Manager">` adds `role="img"` + `<title>`; without `title`, set
  `aria-hidden="true"`.
- `<BrandLockup>` = `<Link href="/">` wrapping `<LogoMark size={28} />` + wordmark `<span>`
  (§3), flex row, `aria-label="Task Manager — home"` on the link, wordmark `aria-hidden`
  (name carried by the link label, avoids double announcement).

## 3. Wordmark

- Text: **"Task Manager"** — exact string, title case. Never uppercase, never italic,
  never letter-spaced apart from the rule below.
- Face: the display serif from `TYPOGRAPHY_SPEC.md` via its `font-display` token (Fraunces
  primary candidate; family is the typography specialist's ruling — this spec does not pick it).
- Weight: **500 (medium)**, per direction §7.4. Do not use 700; do not add a third weight.
- Tracking: **-0.01em** (`tracking-tight` class). Nothing tighter at header size.
- Size: **20px (`text-xl`)** in the header lockup. No other size is sanctioned in-product.
- Rendered as **live text**, not outlined SVG — selectable, real font via `next/font`, no
  text-as-image.
- Color: token **`ink-900`** (hex *pending* `VISUAL_DESIGN_SPEC.md`). Provisional while the
  ink ramp is unlanded: `text-neutral-900`. Never accent-tinted, never gray, never gradient text.

## 4. Lockup layout

- Structure: flex row, `items-center`, **gap 10px (`gap-2.5`)** — mark 28×28 left, wordmark right.
- Header slot: the persistent app header (Layout specialist, ~56–60px tall, hairline bottom
  border) carries the lockup at its left edge, aligned to the content max-width column.
- **Size-stable across breakpoints:** 28px mark / 20px wordmark at every viewport. The
  lockup fits comfortably in 56px header height at 320px wide; deliberately no responsive
  scaling, no compact variant. One lockup, one size.
- No other lockups exist: no stacked (vertical) version, no mark-above-text version, no
  wordmark-only usage, no reversed (light-on-dark) version. Light mode only.

## 5. Favicon

Replace the stock raster with the framework convention: **delete `src/app/favicon.ico`** and
add **`src/app/icon.svg`** (App Router file convention; served at `/icon.svg`, wired into
`<link rel="icon">` automatically, crisp at every size). Exact final file content:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" role="img" aria-label="Task Manager">
  <defs>
    <linearGradient id="tm-mark" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#5b63e8" />
      <stop offset="1" stop-color="#3e44b4" />
    </linearGradient>
  </defs>
  <rect width="32" height="32" rx="8" fill="url(#tm-mark)" />
  <path d="M8.5 16.5 14 22l9.5-11.5"
        fill="none" stroke="#ffffff" stroke-width="3.5"
        stroke-linecap="round" stroke-linejoin="round" />
</svg>
```

- `favicon.ico` **must** be deleted, not left alongside — App Router would emit two icon
  links and browsers may prefer the blurry 32px raster.
- Optional legacy fallback (only if pre-SVG-favicon Safari support is required): add
  `src/app/apple-icon.png` (180×180) exported from this same geometry. Default: skip it;
  `icon.svg` alone is the plan.
- **Acceptance test (from direction §7.4):** at 16×16 the mark reads as a bold single white
  check on a violet tile. Verify in a real browser tab before sign-off.

## 6. Metadata spec

Exact replacement for the `metadata` export in `src/app/layout.tsx`. Note Next.js 15:
`themeColor` lives in the **`viewport`** export, not `metadata`.

```ts
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: {
    default: "Task Manager",
    template: "%s | Task Manager",
  },
  description: "A simple task manager backed by a tRPC API.",
};

export const viewport: Viewport = {
  // Provisional aurora base (near-white with a whisper of accent).
  // Final hex comes from VISUAL_DESIGN_SPEC.md's background token — swap then.
  themeColor: "#fbfbfe",
};
```

- Description is **unified** to the existing tagline "A simple task manager backed by a tRPC
  API." — the current layout copy ("…built with Next.js and tRPC.") and the tagline differ;
  this spec makes the tagline the single canonical string everywhere. Meaning preserved, no
  new taglines invented.
- Per-page titles stay exactly as they are: `"New task"` / `"Edit task"` render through the
  template as "New task | Task Manager" / "Edit task | Task Manager". Do not touch them.
- No `icons` entry in metadata needed — `src/app/icon.svg` is picked up by convention.

## 7. Usage rules

**Wordmark**

- Appears in exactly one place: the app header lockup. The home h1 stays "Tasks" (functional,
  sans) — the header, not the h1, carries the brand.
- Serif + medium weight + tight tracking + `ink-900` (provisional `text-neutral-900`), always.
- Never renders below 20px in-product; if a future surface needs smaller, redesign there, don't shrink.

**Icon consistency (existing set stays)**

- `src/components/icons.tsx` is untouched: 24×24 grid, `strokeWidth 1.75`, `currentColor`,
  stroke-only, Lucide-style. The logo mark does **not** join that family and must not be
  added to `icons.tsx`.
- Mark exceptions (sanctioned, and only these): fill/gradient instead of stroke; fixed brand
  colors instead of `currentColor`; own file `brand.tsx`. It never inherits text color.
- The mark's check glyph is not a reusable "check icon" — row/UI checks keep
  `CheckCircleIcon`. Never substitute one for the other.
- The mark is never placed inside a button, banner, or input; its only in-app home is the
  header lockup.

## 8. Don'ts

1. Don't rename, reword, abbreviate, or translate "Task Manager".
2. Don't add variants: no monochrome mark, no dark-mode mark, no outline mark, no animated
   mark, no stacked lockup, no wordmark-only lockup. (If a strictly monochrome context ever
   appears, the single fallback is the tile in solid `#4a51d4` (accent-600) — not a new variant.)
3. Don't use the accent gradient anywhere except the mark tile; don't add drop shadows,
   glows, borders, or inner highlights to the mark.
4. Don't set the wordmark in Geist Sans, uppercase, letterspaced-wide, or in accent color.
5. Don't keep `favicon.ico` next to `icon.svg`; don't ship emoji/clipart/logomarks from
   icon libraries as the brand.
6. Don't scale the lockup responsively or introduce compact/large sizes.

## Implementer handoff checklist

- [ ] Create `src/components/brand.tsx` with `<LogoMark>` and `<BrandLockup>` per §2 contract; paste the §2 SVG verbatim; gradient `id` via `useId()`.
- [ ] Delete `src/app/favicon.ico`.
- [ ] Create `src/app/icon.svg` with the exact §5 content (byte-for-byte).
- [ ] Replace `metadata` in `src/app/layout.tsx` with the §6 object and add the `viewport` export (`themeColor: "#fbfbfe"` provisional).
- [ ] Render `<BrandLockup />` in the new app header at locked sizes (28px mark · 20px wordmark · 10px gap) — coordinate with the Layout specialist.
- [ ] Leave per-page titles "New task" / "Edit task" untouched; confirm template output "… | Task Manager".
- [ ] After `VISUAL_DESIGN_SPEC.md` / `TYPOGRAPHY_SPEC.md` land, swap provisional tokens: wordmark `text-neutral-900` → `text-ink-900` + `font-display`, and `themeColor` → final background hex.
- [ ] Acceptance test: favicon legible as a bold single check at 16×16 in a real browser tab.
