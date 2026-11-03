/**
 * Shared domain types used by both the tRPC backend and the React client.
 */
export type Task = {
  id: string;
  title: string;
  /** Optional longer description. `null` when the task has no description. */
  description: string | null;
  createdAt: Date;
};

/**
 * Sort key of the last item on a page. The client sends it back as `cursor`
 * to fetch the page that follows it stably, even if the collection changes
 * between page fetches.
 */
export type TaskCursor = {
  createdAt: number;
  id: string;
};

export type TaskPage = {
  items: Task[];
  /** Cursor for the next page, or `null` when this is the last page. */
  nextCursor: TaskCursor | null;
  total: number;
};
