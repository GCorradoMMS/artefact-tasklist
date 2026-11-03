/**
 * Shared class recipes for the design system.
 *
 * Keeping the strings here (instead of a component abstraction) lets plain
 * `<button>` and `<Link>` elements stay in place while guaranteeing that
 * every interactive surface shares the same sizing, radius, focus ring and
 * hover behavior.
 */
export const cx = (
  ...classes: Array<string | false | null | undefined>
): string => classes.filter(Boolean).join(" ");

/** Consistent keyboard focus indicator (accent ring + accent border). */
export const focusRing =
  "focus-visible:border-accent-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/35";

/** Solid accent action (primary CTA, form submit). */
export const buttonPrimary = cx(
  "inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-accent-600 px-3.5 text-body font-medium text-white",
  "shadow-accent",
  "transition duration-150 hover:bg-accent-700 active:bg-accent-800 active:shadow-none",
  focusRing,
  "disabled:pointer-events-none disabled:opacity-55 disabled:shadow-none",
);

/** Bordered neutral action (secondary, cancel). */
export const buttonSecondary = cx(
  "inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-ink-200 bg-white px-3.5 text-body font-medium text-ink-700",
  "transition duration-150 hover:border-ink-300 hover:bg-ink-50 hover:text-ink-900",
  focusRing,
  "disabled:pointer-events-none disabled:opacity-55",
);

/** Compact ghost icon button for row-level actions (edit, delete). */
export const buttonIcon = cx(
  "inline-flex h-10 w-10 items-center justify-center rounded-lg text-ink-400 sm:h-8 sm:w-8",
  "transition duration-150 hover:bg-accent-500/10 hover:text-ink-700",
  focusRing,
  "disabled:pointer-events-none disabled:opacity-50",
);

/** Danger tint applied on top of `buttonIcon` for destructive actions. */
export const buttonIconDanger = "hover:bg-danger-500/10 hover:text-danger-600";

/** Text inputs and textareas. */
export const inputBase = cx(
  "w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-body text-ink-900 placeholder:text-ink-400",
  "transition duration-150 hover:border-ink-300",
  "focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/15",
);

/** Error variant layered on top of `inputBase` (pair with `aria-invalid`). */
export const inputError =
  "border-danger-400 hover:border-danger-400 focus:border-danger-500 focus:ring-danger-500/15";

/** Single-height variant of `inputBase`. */
export const inputField = cx(inputBase, "h-9 py-0");

/** Card-like surface used by the task list panel and forms. */
export const panel =
  "overflow-hidden rounded-xl border border-ink-200/80 bg-white shadow-lg";

/** Header bar inside a `panel` (list count, panel titles). */
export const panelHeader =
  "border-b border-ink-100 bg-white px-4 py-2.5 font-mono text-caption font-medium text-ink-500";

/** Base look for skeleton placeholders (pair with size/spacing utilities). */
export const skeleton = "animate-pulse rounded-md bg-ink-200/70";

/** Navigation link back to the list (aurora-level text idles at ink-600). */
export const backLink = cx(
  "inline-flex items-center gap-1.5 rounded-md text-body text-ink-600",
  "transition-colors duration-150 hover:text-ink-900",
  focusRing,
);
