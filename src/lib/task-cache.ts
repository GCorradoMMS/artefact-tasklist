import { PAGE_SIZE } from "./constants";
import type { Task } from "./types";
import type { trpc } from "@/trpc/provider";

type ListUtils = ReturnType<typeof trpc.useUtils>["task"]["list"];
type ListSnapshot = ReturnType<ListUtils["getInfiniteData"]>;

/** Canonical input used by the infinite list query (must match the hook). */
const listInput = { limit: PAGE_SIZE } as const;

/**
 * Surgical cache writes for the task list infinite query.
 *
 * Mutations return the affected task, so instead of awaiting a full
 * invalidation (which refetches every loaded page sequentially) we write the
 * confirmed result straight into the cache. Invalidation, when needed at
 * all, runs in the background without blocking the UI.
 */

/**
 * Inserts a server-confirmed created task at the top of page 1 and bumps
 * the total. When page 1 overflows, the cursor is re-anchored to its new
 * last item, so the pushed-out task is still reachable on the next page
 * fetch — pagination stays consistent without any refetch.
 */
export function insertCreatedTask(utils: ListUtils, created: Task): void {
  utils.setInfiniteData(listInput, (data) => {
    if (!data) return data;
    const [first, ...rest] = data.pages;
    if (!first || first.items.some((task) => task.id === created.id)) {
      return data;
    }
    const items = [created, ...first.items];
    const overflow = items.length > PAGE_SIZE;
    const pageItems = overflow ? items.slice(0, PAGE_SIZE) : items;
    const last = pageItems[pageItems.length - 1];
    return {
      pageParams: data.pageParams,
      pages: [
        {
          items: pageItems,
          total: first.total + 1,
          // Anchor the cursor to the new last item so the overflow task is
          // included by the next "load more" fetch instead of being skipped.
          nextCursor:
            overflow && last
              ? { createdAt: last.createdAt.getTime(), id: last.id }
              : first.nextCursor,
        },
        ...rest,
      ],
    };
  });
}

/** Replaces an existing task in every cached page with its updated version. */
export function updateTaskInList(utils: ListUtils, updated: Task): void {
  utils.setInfiniteData(listInput, (data) => {
    if (!data) return data;
    let changed = false;
    const pages = data.pages.map((page) => {
      const index = page.items.findIndex((task) => task.id === updated.id);
      if (index === -1) return page;
      changed = true;
      const items = [...page.items];
      items[index] = updated;
      return { ...page, items };
    });
    return changed ? { pageParams: data.pageParams, pages } : data;
  });
}

/**
 * Optimistically removes a task from every cached page and decrements the
 * total on page 1. Page boundaries are only reconciled by the background
 * invalidation that follows a successful delete.
 */
export function removeTaskFromList(utils: ListUtils, id: string): void {
  utils.setInfiniteData(listInput, (data) => {
    if (!data) return data;
    let removed = false;
    const pages = data.pages.map((page, pageIndex) => {
      if (!page.items.some((task) => task.id === id)) return page;
      removed = true;
      return {
        ...page,
        items: page.items.filter((task) => task.id !== id),
        // Only page 1 carries the collection total.
        total:
          pageIndex === 0 ? Math.max(0, page.total - 1) : page.total,
      };
    });
    return removed ? { pageParams: data.pageParams, pages } : data;
  });
}

/** Snapshot of the current list cache, used to roll back optimistic writes. */
export function snapshotTaskList(utils: ListUtils): ListSnapshot {
  return utils.getInfiniteData(listInput);
}

/** Restores a snapshot taken by `snapshotTaskList` (error rollback). */
export function restoreTaskList(
  utils: ListUtils,
  snapshot: ListSnapshot,
): void {
  utils.setInfiniteData(listInput, snapshot);
}
