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
        "flex animate-fade-in items-start gap-2.5 rounded-md border px-3 py-2.5 text-sm",
        tone === "success"
          ? "border-green-200 bg-green-50 text-green-800"
          : "border-red-200 bg-red-50 text-red-800",
      )}
    >
      {tone === "success" ? (
        <CheckCircleIcon className="mt-0.5 shrink-0 text-green-600" />
      ) : (
        <AlertCircleIcon className="mt-0.5 shrink-0 text-red-600" />
      )}
      <span className="leading-5">{children}</span>
    </div>
  );
}
