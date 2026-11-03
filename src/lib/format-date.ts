/**
 * Formats a timestamp in UTC so the markup rendered on the server matches the
 * markup rendered on the client (avoids hydration mismatches caused by
 * different time zones between server and browser).
 */
export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(date);
}
