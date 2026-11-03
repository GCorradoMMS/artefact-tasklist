import type { ReactNode } from "react";

export type StatusTone = "success" | "error";

/**
 * Inline banner used to give the user immediate feedback about the result of
 * an operation (success confirmation or error message).
 */
export function StatusMessage({
  tone,
  children,
}: {
  tone: StatusTone;
  children: ReactNode;
}) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={
        tone === "success"
          ? "rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
          : "rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
      }
    >
      {children}
    </div>
  );
}
