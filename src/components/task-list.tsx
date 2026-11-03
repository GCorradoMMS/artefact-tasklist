"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { PAGE_SIZE } from "@/lib/constants";
import { formatDateTime } from "@/lib/format-date";
import type { Task } from "@/lib/types";
import { trpc } from "@/trpc/provider";
import { StatusMessage } from "./status-message";

type Feedback = { tone: "success" | "error"; message: string } | null;

/**
 * Client-side task list.
 *
 * The first page is prefetched on the server (see `app/page.tsx`) and
 * hydrated into the cache below, so the list renders without a client-side
 * fetch. Scrolling near the bottom triggers `fetchNextPage`, which loads the
 * remaining pages incrementally (infinite scroll).
 */
export function TaskList() {
  const utils = trpc.useUtils();
  const [feedback, setFeedback] = useState<Feedback>(null);

  // useSuspenseInfiniteQuery guarantees data is defined; loading and error
  // states are handled by the <Suspense> boundary and the route error page.
  const [data, query] = trpc.task.list.useSuspenseInfiniteQuery(
    { limit: PAGE_SIZE },
    { getNextPageParam: (lastPage) => lastPage.nextCursor },
  );

  const deleteTask = trpc.task.delete.useMutation({
    onSuccess: async () => {
      setFeedback({ tone: "success", message: "Task deleted successfully." });
      // Refetch the loaded pages so the list reflects the removal.
      await utils.task.list.invalidate();
    },
    onError: (error) => {
      // Surface backend errors (e.g. deleting a task that no longer exists).
      setFeedback({ tone: "error", message: error.message });
    },
  });

  // Success feedback auto-dismisses after a few seconds; errors stay visible.
  useEffect(() => {
    if (feedback?.tone !== "success") return;
    const timer = setTimeout(() => setFeedback(null), 4000);
    return () => clearTimeout(timer);
  }, [feedback]);

  // Infinite scroll: observe a sentinel element below the list and load the
  // next page when it approaches the viewport.
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const { fetchNextPage, hasNextPage, isFetchingNextPage } = query;
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries.some((entry) => entry.isIntersecting) &&
          hasNextPage &&
          !isFetchingNextPage
        ) {
          // Surface failures explicitly: with suspense hooks, an error thrown
          // after data is already loaded does not reach the route error
          // boundary, so a failed page load would otherwise be silent.
          fetchNextPage().catch(() => {
            setFeedback({
              tone: "error",
              message: "Could not load more tasks. Please scroll to try again.",
            });
          });
        }
      },
      // Start loading slightly before the sentinel becomes visible.
      { rootMargin: "240px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const tasks: Task[] = data.pages.flatMap((page) => page.items);
  const total = data.pages[0]?.total ?? 0;
  const deletingId = deleteTask.isPending ? deleteTask.variables?.id : undefined;

  return (
    <div className="space-y-3">
      {feedback && (
        <StatusMessage tone={feedback.tone}>{feedback.message}</StatusMessage>
      )}

      {tasks.length === 0 ? (
        <div className="rounded-lg border border-dashed border-neutral-300 bg-white py-12 text-center">
          <p className="text-neutral-500">No tasks yet.</p>
          <Link
            href="/tasks/new"
            className="mt-2 inline-block font-medium text-blue-600 hover:underline"
          >
            Create your first task
          </Link>
        </div>
      ) : (
        <>
          <p className="text-sm text-neutral-500">
            Showing {tasks.length} of {total} {total === 1 ? "task" : "tasks"}
          </p>
          {tasks.map((task) => (
            <article
              key={task.id}
              className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="min-w-0 text-base font-semibold break-words">
                  {task.title}
                </h2>
                <div className="flex shrink-0 gap-2">
                  <Link
                    href={`/tasks/${task.id}/edit`}
                    className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => deleteTask.mutate({ id: task.id })}
                    disabled={deleteTask.isPending}
                    className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deletingId === task.id ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </div>
              {task.description && (
                <p className="mt-1 text-sm whitespace-pre-line break-words text-neutral-600">
                  {task.description}
                </p>
              )}
              <p className="mt-2 text-xs text-neutral-400">
                Created {formatDateTime(task.createdAt)}
              </p>
            </article>
          ))}
        </>
      )}

      {isFetchingNextPage && (
        <p className="py-3 text-center text-sm text-neutral-500">
          Loading more tasks…
        </p>
      )}
      {tasks.length > 0 && !hasNextPage && !isFetchingNextPage && (
        <p className="py-3 text-center text-sm text-neutral-400">
          End of the list.
        </p>
      )}
      {/* Sentinel observed by the IntersectionObserver above. */}
      {hasNextPage && (
        <div ref={sentinelRef} aria-hidden="true" className="h-1" />
      )}
    </div>
  );
}
