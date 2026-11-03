# Design Direction — "Quiet Aurora"

**Product:** Task Manager · **Author:** Agent 1 — Design Director · **Date:** 2026-11-03
**Downstream specs:** `VISUAL_DESIGN_SPEC.md`, `TYPOGRAPHY_SPEC.md`, `BRANDING_SPEC.md`
**Status:** Direction set. Specialists elaborate; do not re-litigate rulings in §8 without director sign-off.

---

## 1. Executive summary

"Task Manager" is visually competent but anonymous: a flat `bg-neutral-50` page, stock hueless neutrals, the default Next.js favicon, no app chrome, and typography limited to one sans at one modest display size. The direction — **Quiet Aurora** — keeps the product's crisp engineering character and gives it atmosphere: a barely-there pastel gradient sky behind a precise, ink-on-paper interface. The indigo-violet accent stays and is grounded by newly tinted neutrals; one display serif is introduced for brand and headline moments only; a slim app header finally gives the product a face; and the component language graduates from default-Tailwind (uniform `md` radii, `xs` shadows) to a deliberate system of softer large radii, layered soft shadows, and hairline tinted borders. **Dark mode is explicitly out of scope** (justified in §9).

## 2. Product & audience

A personal-scale task manager: one list with infinite scroll, create/edit forms, delete with optimistic feedback, an empty state, and an error boundary. In-memory backend, 100 seeded tasks — a focused tool, not a platform. The audience is individual users (and evaluators of engineering craft) who expect a modern SaaS feel: calm, elegant, obviously intentional. Every visual decision should read as "a small product made with care," not "a template" and not "a toy."

## 3. Current-state weaknesses

1. **Zero atmosphere.** Flat `bg-neutral-50` behind a white panel is the most generic possible frame; the app is indistinguishable from an unthemed demo.
2. **No brand presence.** Default Next.js favicon, no header, no logo; "Task Manager" exists only in the browser tab, while the visible h1 says "Tasks". The product has no face.
3. **Flat type hierarchy.** Page h1 at `text-xl` barely rises above body copy; timestamps, counters and panel headers all use the same sans — no rhythm, no voice, no display moment anywhere.
4. **Isolated accent.** The indigo-violet ramp is good, but stock `neutral-*` grays share none of its hue, so the accent floats untethered; stock green/red banners are slightly garish next to a refined accent.
5. **Template-grade component defaults.** Uniform `rounded-md`, `shadow-xs`, untinted borders — nothing is wrong, nothing is decided. This is exactly the "generic AI dashboard" failure mode.
6. **No depth language.** Panels are flat white rectangles; row hover is gray-on-gray; the empty state is a generic circle + inbox glyph with no personality.
7. **Inconsistent framing.** List, form, and error pages differ in header treatment, spacing, and back-link placement; there is no page-header pattern or vertical rhythm to inherit.

## 4. Design concept — "Quiet Aurora"

A soft atmosphere above, precise ink below. The interface is a sheet of paper suspended in early-morning light: the air behind it is tinted and gently grained, the sheet itself is white, sharp and quietly shadowed, and everything written on it is set in confident ink with a single violet accent.

Three layers, bottom-up:

1. **Aurora** (page background) — a fixed, ultra-low-saturation pastel gradient: indigo-violet light pooling from the top, one complementary soft hue low in the frame, fading to near-white; dusted with a 1px dotted grid at whisper opacity.
2. **Paper** (surfaces) — opaque white panels with soft layered shadows and tinted hairline borders. Crisp artifacts floating on the aurora.
3. **Ink** (content) — violet-tinted near-black text, one interactive accent, and a single display serif reserved for the moments that deserve a voice.

## 5. Design principles

1. **Soft setting, crisp subject.** Atmosphere lives only in the background layer. Every UI surface stays opaque, high-contrast, and sharp. Never soften the chrome itself.
2. **One accent, deep support.** Indigo-violet remains the only interactive color; neutrals are re-tinted toward its hue so the whole page reads as one family. Supporting hues exist for atmosphere and illustration only — never for controls.
3. **Quiet, not invisible.** Gradients, dots, and shadows should register on first glance and be forgotten within seconds. If a treatment can be described as "loud," halve it rather than defend it.
4. **Type is the brand.** The wordmark and headlines carry the personality; body text stays an invisible workhorse. One display voice, used sparingly, is worth more than three decorative families.
5. **Deliberate geometry.** Radii, shadows, and spacing come from named scales, not per-element judgment. Larger surfaces earn larger radii and softer shadows; nothing gets a value that isn't on a scale.
6. **Respect the engineering.** The app's restraint and accessibility discipline (focus rings, reduced motion, semantic roles, layout-matched skeletons) are features. The new skin must not cost them anything.

## 6. Visual priorities (ranked)

1. **Background atmosphere** (gradient + dotted grain) — the single change that transforms the first impression.
2. **Brand presence** — app header, wordmark lockup, logo mark, favicon.
3. **Typography system** — display face, real headline scale, mono micro-metadata.
4. **Panel/surface treatment** — radius scale, layered shadows, tinted hairline borders.
5. **Palette refinement** — tinted "ink" neutrals, muted semantic pair, atmospheric hue.
6. **Micro-polish** — row hover washes, empty state, skeletons, status banner harmonization.

## 7. Directional decisions

### 7.1 Background

- **DO:** Apply one fixed (non-scrolling) background layer at the body/root: two soft radial pastel pools — accent-tinted light entering from the top of the viewport, one supporting soft hue lower in the frame — each dissolving into near-white; total saturation lift over white stays around 6% or less.
- **DO:** Bake a dotted grid into the same fixed layer: ~1px dots on a 20–24px cell, accent/ink hue, ≤4% opacity, masked so it fades out below the first viewport. Pure CSS gradients; noise, if ever used, as an inline SVG data-URI only.
- **DON'T:** Put gradients on panels, buttons, or text; animate or parallax the background; stack multiple textures; use a 5-hue mesh gradient; drift toward "purple SaaS landing page."

### 7.2 Palette

- **DO:** Keep the indigo-violet accent ramp (it's a strong, defensible identity; primary stays anchored at accent-600). Specialists may tune mid stops slightly brighter/periwinkle.
- **DO:** Introduce a custom cool violet-gray **ink** neutral ramp (9–10 steps, replacing stock `neutral-*` for text, borders, and surfaces) so every gray shares the accent's undertone.
- **DO:** Add exactly **one** supporting atmospheric hue (soft rose or warm peach — specialist picks) used only in the background composition and empty-state illustration. Retune success green / danger red to the same muted, ink-leaning family; behavior unchanged.
- **DON'T:** Add interactive colors per feature; use the atmospheric hue anywhere in UI chrome; exceed four hue families total (accent, ink, atmospheric, semantics).
- **Dark mode:** **No** (see §9).
- Final hex values belong in `VISUAL_DESIGN_SPEC.md`, not here.

### 7.3 Typography

- **DO:** Keep **Geist Sans** as the UI workhorse — body, rows, inputs, buttons, banners.
- **DO:** Add **one display family** for brand and headlines. Recommendation: a characterful optical-size serif — **Fraunces** is the primary candidate (Instrument Serif / Newsreader as alternates). Reserved strictly for: wordmark, page h1s, empty-state headline.
- **DO:** Add **Geist Mono** (same type system, cheap) for micro-metadata: timestamps, "Showing X of Y", counters, panel-header microcopy. Never for body or buttons.
- **DO:** Rebuild the scale with ~4 named steps (display / title / body / micro); raise page h1 from `text-xl` to a genuine display step at desktop with tightened tracking and a fixed subtitle style.
- **DON'T:** Serif in inputs, buttons, or banners; more than three families (display + Geist Sans + Geist Mono); more than two weights per family; loading fonts outside `next/font`.
- `TYPOGRAPHY_SPEC.md` finalizes family, weights, scale, line-heights, fallback metrics.

### 7.4 Branding

- **DO:** Concept — a **rounded-square mark** (soft squircle radius) in the accent — solid or a subtle accent-500→700 gradient, the one sanctioned gradient inside chrome — containing a single bold checkmark or a two-line checklist glyph. The mark doubles as the favicon.
- **DO:** Wordmark — "Task Manager" set in the display face, medium weight, tight tracking; lockup = mark + wordmark side by side in the app header. Let the home h1 stay functional ("Tasks") while the header carries the brand.
- **DON'T:** Rename or reword the product; use emoji or clipart; design mark detail that dies at 16px; produce multiple competing logo variants.
- **Acceptance test for the favicon:** legible as a bold single check at 16×16.
- Final assets and lockups belong in `BRANDING_SPEC.md` (SVG mark + favicon set including an `icon.svg` and raster fallback).

### 7.5 Component language

- **Radius scale, two tiers:** panels/cards/inputs move to **12px-class (`rounded-xl`)**; buttons and icon buttons to an **8–10px tier (`rounded-lg`)**; status pills fully rounded. Bigger surface ⇒ bigger radius, always from the scale.
- **Shadow philosophy — "one soft base + one whisper":** panels get a layered shadow (tight low shadow plus a wide, diffuse, accent-tinted shadow at very low opacity); the primary button may carry a whisper of accent shadow; rows and inputs carry **no** shadow at rest. Buttons otherwise stay flat (border/color shifts).
- **Borders:** hairlines tinted to the ink ramp at low alpha (translucent) so they harmonize with the gradient instead of graying it; internal divide lines lighter than the panel outline.
- **Inputs:** keep white background and the existing focus-ring pattern (it's good); soften the resting border one step; adopt the larger radius; error behavior unchanged.
- **Buttons:** primary stays solid accent-600 (no gradients); audit the h-9 padding once; icon-button hovers become accent-tinted washes (destructive stays red-tinted).
- **Rows:** hover shifts from gray to an accent-tinted wash at ~3–5% alpha; skeletons re-tint to the ink ramp.
- **panelHeader / banners:** de-tint panel headers (white or near-white) with mono microcopy; retune banner green/red to the muted semantic family; keep roles and the fade-in animation.
- **Glassmorphism:** panels and inputs stay **opaque white**. At most the app header may use a frosted/blur treatment.

### 7.6 Layout

- **DO:** Add a slim **persistent app header** (~56–60px): brand lockup left, a minimal right slot (may stay empty or hold the primary "New task" affordance — specialist decides), hairline bottom border, featherweight background (transparent-to-white wash or subtle blur). It must not read as a "dashboard navbar."
- **DO:** Standardize the page-header pattern: back-link (where applicable) → h1 → one-line subtitle → content, with fixed margins on all four surfaces (home, new, edit, error).
- **DO:** Keep max-widths (`max-w-2xl` list / `max-w-xl` forms — right for a focused tool). Unify top padding (≥ `sm:py-14`) and set content-block spacing on a 4/8-based rhythm; audit list-row padding once, then lock it.
- **DON'T:** Add a sidebar, footer nav, multi-column layout, or stats widgets. This stays a single-purpose tool.

## 8. Conflict pre-rulings

1. **Display serif vs. all-sans.** *Ruling: serif wins, narrowly scoped* — wordmark, page h1s, empty-state headline only. If it misbehaves below ~24px or destabilizes the wordmark lockup, the fallback ruling is a characterful grotesque (e.g., Bricolage Grotesque) for the display role — **never** a third family.
2. **Gradient saturation vs. minimalism.** *Ruling: minimalism wins.* The aurora caps at ~6% saturation lift over white; UI chrome carries zero gradient except the logo mark. Any proposal where the gradient is identifiable from across the room gets toned down, not justified.
3. **Dots vs. noise texture.** *Ruling: pick exactly one* — the dotted grid is recommended (crisper, matches the ink metaphor); noise only if dots visibly moiré. Never both. Either way: ≤4% opacity, accent/ink-tinted, fixed layer only, absent from panels and inputs.
4. **Translucency/glass vs. opaque surfaces.** *Ruling: opaque wins.* Panels and inputs stay solid white; blur is permitted only on the app header.

## 9. Scope guardrails

- **Name is fixed:** "Task Manager" — no renaming, rewording, or tagline inventions.
- **Light-mode only.** No dark mode. Justification: it doubles the palette/spec surface for a small utility; the aurora concept is inherently light-native (pastels die on dark); and Tailwind v4's CSS-first `@theme` makes a future theme cheap — adding one now would ship a half-tuned second palette instead of one excellent one.
- **No functional changes:** routes, data flow, tRPC caching, optimistic deletes, infinite scroll, validation, and a11y semantics are preserved exactly.
- **No new runtime dependencies.** Fonts via `next/font/google` only; textures via CSS or inline SVG data-URIs only.
- **Accessibility floor:** visible focus rings over the new background, AA contrast for all text and interactive states, `prefers-reduced-motion` respected, semantic roles untouched.
- **No architecture rewrite:** keep class recipes in `ui.ts`; no component-library abstraction.
- All final values live in the downstream spec documents, never in this one.

## 10. Handoff notes

**Visual Systems specialist → `VISUAL_DESIGN_SPEC.md`.** Deliver the final numbers: refined accent ramp (keep 50–900, tuning permitted), the new ink neutral ramp, the atmospheric hue, muted success/error pair, plus tokens for background gradient stops, dot geometry (size/cell/opacity/mask), radius scale, shadow recipes, and border alphas. Your job is to convert the "≤6% saturation, ≤4% dot opacity" feel from this document into concrete, reproducible values.

**Typography specialist → `TYPOGRAPHY_SPEC.md`.** Pick and prove the display face (Fraunces first candidate — verify the wordmark lockup and h1 at narrow viewports before committing), define the four-step scale, mono metadata rules, and `next/font` loading with tuned fallback metrics; explicitly retire the `text-xl`-as-h1 pattern.

**Branding specialist → `BRANDING_SPEC.md`.** Design the rounded-square check/checklist mark, the wordmark lockups (header, standalone), and the favicon set — 16px legibility is the acceptance test. Coordinate with the typography specialist on the wordmark face; the mark may use the one sanctioned chrome gradient.

**Layout & Components specialist.** Implement the app header, the page-header pattern across all four surfaces, the `ui.ts` recipe updates (radii, shadows, tinted borders, hover washes), panel treatment, panel-header mono microcopy, and skeleton/banner harmonization. Keep the class-recipe architecture; resist any urge to introduce component abstractions.

**Integration/QA reviewer.** Verify the guardrails hold: AA contrast with the new tinted neutrals, focus-ring visibility against the aurora background, reduced-motion coverage for any new animation, exactly one texture layer, opaque panels, light-only output, zero dependency additions, and no functional regressions anywhere.
