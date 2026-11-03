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

export type TaskPage = {
  items: Task[];
  /** Offset cursor for the next page, or `null` when this is the last page. */
  nextCursor: number | null;
  total: number;
};
