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
  "inline-flex h-9 items-center justify-center gap-1.5 rounded-md bg-accent-600 px-3.5 text-sm font-medium text-white",
  "transition duration-150 hover:bg-accent-700 active:bg-accent-800",
  focusRing,
  "disabled:pointer-events-none disabled:opacity-55",
);

/** Bordered neutral action (secondary, cancel). */
export const buttonSecondary = cx(
  "inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-neutral-200 bg-white px-3.5 text-sm font-medium text-neutral-700",
  "transition duration-150 hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900",
  focusRing,
  "disabled:pointer-events-none disabled:opacity-55",
);

/** Compact ghost icon button for row-level actions (edit, delete). */
export const buttonIcon = cx(
  "inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-400",
  "transition duration-150 hover:bg-neutral-100 hover:text-neutral-700",
  focusRing,
  "disabled:pointer-events-none disabled:opacity-50",
);

/** Danger tint applied on top of `buttonIcon` for destructive actions. */
export const buttonIconDanger = "hover:bg-red-50 hover:text-red-600";

/** Text inputs and textareas. */
export const inputBase = cx(
  "w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400",
  "transition duration-150 hover:border-neutral-300",
  "focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/15",
);

/** Error variant layered on top of `inputBase` (pair with `aria-invalid`). */
export const inputError =
  "border-red-400 hover:border-red-400 focus:border-red-500 focus:ring-red-500/15";

/** Single-height variant of `inputBase`. */
export const inputField = cx(inputBase, "h-9 py-0");

/** Card-like surface used by the task list panel and forms. */
export const panel =
  "overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-xs";

/** Tinted header bar inside a `panel` (list count, panel titles). */
export const panelHeader =
  "border-b border-neutral-200/80 bg-neutral-50/60 px-4 py-2.5 text-xs font-medium text-neutral-500";

/** Base look for skeleton placeholders (pair with size/spacing utilities). */
export const skeleton = "animate-pulse rounded-md bg-neutral-200/70";
