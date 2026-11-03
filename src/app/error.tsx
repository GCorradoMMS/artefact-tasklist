"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircleIcon } from "@/components/icons";
import { buttonPrimary, buttonSecondary, panel } from "@/components/ui";

/**
 * Route-level error boundary: catches render/data errors (including tRPC
 * errors thrown inside Suspense boundaries) and shows a friendly message
 * with a retry action.
 */
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10 sm:py-14">
      <h1 className="font-display text-h1 text-ink-900 text-balance">
        Something went wrong
      </h1>
      <p className="mt-1 mb-8 text-body-lg text-ink-600 text-pretty">
        An unexpected error interrupted this view.
      </p>
      <div className={`${panel} p-5 sm:p-6`}>
        <div className="flex items-start gap-3">
          <AlertCircleIcon
            size={20}
            className="mt-0.5 shrink-0 text-danger-600"
          />
          <p className="min-w-0 break-words text-sm leading-6 text-ink-700">
            {error.message}
          </p>
        </div>
        <div className="mt-5 flex gap-2.5">
          <button type="button" onClick={reset} className={buttonPrimary}>
            Try again
          </button>
          <Link href="/" className={buttonSecondary}>
            Back to tasks
          </Link>
        </div>
      </div>
    </main>
  );
}
