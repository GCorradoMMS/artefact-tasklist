"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { PAGE_SIZE } from "@/lib/constants";
import { formatDateTime } from "@/lib/format-date";
import {
  removeTaskFromList,
  restoreTaskList,
  snapshotTaskList,
} from "@/lib/task-cache";
import type { Task } from "@/lib/types";
import { trpc } from "@/trpc/provider";
import { InboxIcon, PencilIcon, SpinnerIcon, TrashIcon } from "./icons";
import { StatusMessage } from "./status-message";
import {
  buttonIcon,
  buttonIconDanger,
  buttonPrimary,
  cx,
  panel,
  panelHeader,
} from "./ui";

type Feedback = { tone: "success" | "error"; message: string } | null;

/**
 * Client-side task list.
 *
 * The first page is prefetched on the server (see `app/page.tsx`) and
 * hydrated into the cache below, so the list renders without a client-side
 * fetch. Scrolling near the bottom triggers `fetchNextPage`, which loads the
 * remaining pages incrementally (infinite scroll).
 *
 * Deleting is optimistic: the task leaves the list the moment the action is
 * triggered, the cache is rolled back if the server rejects the mutation,
 * and the reconciliation refetch runs in the background without blocking.
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
    // Remove the task from the cache immediately so the UI responds at once.
    onMutate: async ({ id }) => {
      // Stop any in-flight list refetch from overwriting the optimistic write.
      await utils.task.list.cancel();
      const previous = snapshotTaskList(utils.task.list);
      removeTaskFromList(utils.task.list, id);
      return { previous };
    },
    onSuccess: () => {
      setFeedback({ tone: "success", message: "Task deleted." });
      // The optimistic removal can leave page boundaries with one item of
      // slack; reconcile them with a background refetch (never awaited, so
      // it can't delay the interaction). A failure is surfaced, not hidden.
      utils.task.list.invalidate().catch(() => {
        setFeedback({
          tone: "error",
          message: "Could not refresh the task list. Please reload the page.",
        });
      });
    },
    onError: (error, _variables, context) => {
      // Roll the optimistic removal back so the task reappears unchanged.
      if (context?.previous) {
        restoreTaskList(utils.task.list, context.previous);
      }
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
  const isEmpty = tasks.length === 0;
  const deletingId = deleteTask.isPending ? deleteTask.variables?.id : undefined;

  return (
    <div className="space-y-3">
      {feedback && (
        <StatusMessage tone={feedback.tone}>{feedback.message}</StatusMessage>
      )}

      {isEmpty ? (
        <EmptyState />
      ) : (
        <section aria-label="Tasks" className={panel}>
          <header className={panelHeader}>
            Showing {tasks.length} of {total} {total === 1 ? "task" : "tasks"}
          </header>
          <ul className="divide-y divide-ink-100">
            {tasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                isDeleting={deletingId === task.id}
                onDelete={() => deleteTask.mutate({ id: task.id })}
              />
            ))}
          </ul>
        </section>
      )}

      {isFetchingNextPage && (
        <div
          role="status"
          className="flex items-center justify-center gap-2 py-3 text-sm text-ink-600"
        >
          <SpinnerIcon className="animate-spin" />
          Loading more tasks…
        </div>
      )}
      {tasks.length > 0 && !hasNextPage && !isFetchingNextPage && (
        <p className="py-4 text-center font-mono text-caption text-ink-500">
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

function TaskRow({
  task,
  isDeleting,
  onDelete,
}: {
  task: Task;
  isDeleting: boolean;
  onDelete: () => void;
}) {
  return (
    <li
      aria-busy={isDeleting}
      className={cx(
        "group px-4 py-3.5 transition duration-150 hover:bg-accent-500/[0.04]",
        isDeleting && "pointer-events-none opacity-50",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="break-words text-body font-medium text-ink-900">
            {task.title}
          </h2>
          {task.description && (
            <p className="mt-1 line-clamp-2 whitespace-pre-line break-words text-body text-ink-500">
              {task.description}
            </p>
          )}
          <p className="mt-2 font-mono text-caption text-ink-500">
            Created {formatDateTime(task.createdAt)}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Link
            href={`/tasks/${task.id}/edit`}
            aria-label="Edit task"
            title="Edit"
            className={buttonIcon}
          >
            <PencilIcon />
          </Link>
          <button
            type="button"
            onClick={onDelete}
            disabled={isDeleting}
            aria-label="Delete task"
            title="Delete"
            className={cx(buttonIcon, buttonIconDanger)}
          >
            {isDeleting ? (
              <SpinnerIcon className="animate-spin" />
            ) : (
              <TrashIcon />
            )}
          </button>
        </div>
      </div>
    </li>
  );
}

function EmptyState() {
  return (
    <section
      aria-label="No tasks"
      className={cx(
        panel,
        "flex flex-col items-center px-6 py-16 text-center sm:py-20",
      )}
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-br from-accent-50 via-white to-[#f6edf3] text-accent-600 inset-ring-1 inset-ring-accent-500/10">
        <InboxIcon size={24} />
      </span>
      <h2 className="mt-5 font-display text-display-xl text-ink-900 text-balance">
        No tasks yet
      </h2>
      <p className="mt-1.5 text-body-lg text-ink-500 text-pretty max-w-sm">
        Create your first task to get started.
      </p>
      <Link href="/tasks/new" className={cx("mt-6", buttonPrimary)}>
        New task
      </Link>
    </section>
  );
}
