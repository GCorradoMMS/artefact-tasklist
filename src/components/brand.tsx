import Link from "next/link";
import { focusRing, cx } from "./ui";

type LogoMarkProps = {
  /** Rendered as width/height, square. */
  size?: number;
  /** Passthrough, e.g. "shrink-0". */
  className?: string;
  /** Accessible name; omit → aria-hidden (decorative, e.g. inside the lockup). */
  title?: string;
  /**
   * Static gradient id instead of useId() so the mark stays a server
   * component; a single instance renders per page, so ids cannot collide.
   */
  gradientId?: string;
};

/** The brand mark: one violet tile, one white check. */
export function LogoMark({
  size = 24,
  className,
  title,
  gradientId = "tm-mark",
}: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      className={className}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          {/* accent-500 → accent-700 */}
          <stop offset="0" stopColor="#5b63e8" />
          <stop offset="1" stopColor="#3e44b4" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill={`url(#${gradientId})`} />
      <path
        d="M8.5 16.5 14 22l9.5-11.5"
        fill="none"
        stroke="#ffffff"
        strokeWidth={3.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {title ? <title>{title}</title> : null}
    </svg>
  );
}

type BrandLockupProps = {
  /** Whole lockup is a link; defaults to "/". */
  href?: string;
};

/** Mark + wordmark lockup — lives exclusively in the app header. */
export function BrandLockup({ href = "/" }: BrandLockupProps) {
  return (
    <Link
      href={href}
      aria-label="Task Manager — home"
      className={cx("inline-flex items-center gap-2.5 rounded-lg", focusRing)}
    >
      <LogoMark size={28} className="shrink-0" />
      <span
        aria-hidden="true"
        className="font-display text-xl font-medium tracking-[-0.01em] text-ink-900"
      >
        Task Manager
      </span>
    </Link>
  );
}
