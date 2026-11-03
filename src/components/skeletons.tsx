import Link from "next/link";
import { ArrowLeftIcon } from "./icons";
import { cx, panel, panelHeader, skeleton } from "./ui";

/** Single skeleton block (pair with size utilities). */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cx(skeleton, className)} />;
}

/**
 * Layout-matched skeleton for the task list panel, used as the streaming
 * fallback on the home page so the final render swaps in without shift.
 */
export function TaskListSkeleton() {
  return (
    <div role="status" aria-label="Loading tasks">
      <section className={panel}>
        <div className={panelHeader}>
          <Skeleton className="h-3 w-32" />
        </div>
        <div className="divide-y divide-neutral-100">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="px-4 py-3.5">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="mt-2 h-3.5 w-2/3" />
              <Skeleton className="mt-2.5 h-3 w-24" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/** Layout-matched skeleton for the create/edit form pages. */
export function TaskFormSkeleton() {
  return (
    <div role="status" aria-label="Loading task">
      <Link
        href="/"
        aria-hidden="true"
        tabIndex={-1}
        className="mb-5 inline-flex items-center gap-1.5 text-sm text-neutral-400"
      >
        <ArrowLeftIcon size={14} /> Tasks
      </Link>
      <section className={panel}>
        <div className="space-y-5 p-5 sm:p-6">
          <div>
            <Skeleton className="mb-1.5 h-4 w-12" />
            <Skeleton className="h-9 w-full" />
          </div>
          <div>
            <Skeleton className="mb-1.5 h-4 w-24" />
            <Skeleton className="h-24 w-full" />
          </div>
          <div className="flex gap-2.5 pt-1">
            <Skeleton className="h-9 w-28" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
      </section>
    </div>
  );
}
