import type { ReactNode } from "react";
import { AlertCircleIcon, CheckCircleIcon } from "./icons";
import { cx } from "./ui";

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
      className={cx(
        "flex animate-fade-in items-start gap-2.5 rounded-lg border px-3 py-2.5 text-sm",
        tone === "success"
          ? "border-success-200 bg-success-50 text-success-800"
          : "border-danger-200 bg-danger-50 text-danger-800",
      )}
    >
      {tone === "success" ? (
        <CheckCircleIcon className="mt-0.5 shrink-0 text-success-600" />
      ) : (
        <AlertCircleIcon className="mt-0.5 shrink-0 text-danger-600" />
      )}
      <span className="leading-5">{children}</span>
    </div>
  );
}
