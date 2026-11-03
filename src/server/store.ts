import { randomUUID } from "node:crypto";
import type { Task, TaskPage } from "@/lib/types";

export type CreateTaskInput = { title: string; description?: string | null };
export type UpdateTaskInput = { title?: string; description?: string | null };
export type ListTasksInput = { cursor?: number | null; limit: number };

/**
 * In-memory task store.
 *
 * Data lives in a plain array and is intentionally not persisted: it is lost
 * whenever the server process restarts.
 *
 * Next.js bundles server modules per route, so relying on a module-level
 * singleton alone would create one store copy per route bundle. Caching the
 * instance on `globalThis` guarantees every bundle in the same server
 * process (page renders and route handlers) shares the same data — and it
 * also survives hot reloads in development.
 */
class TaskStore {
  private tasks: Task[] = [];

  constructor() {
    this.seed();
  }

  /** Seeds fictional tasks so the list and the infinite scroll have content on a fresh start. */
  private seed() {
    const seedData: Array<{ title: string; description?: string }> = [
      { title: "Set up the development environment", description: "Install the LTS Node.js version and clone the repository." },
      { title: "Draft the project roadmap" },
      { title: "Review pull requests from last week" },
      { title: "Write API documentation", description: "Document the public endpoints and their error codes." },
      { title: "Fix navigation bar overflow on mobile" },
      { title: "Prepare the weekly status report" },
      { title: "Refactor authentication helpers" },
      { title: "Update dependency versions" },
      { title: "Add loading states to the dashboard" },
      { title: "Clean up unused CSS rules" },
      { title: "Schedule the next team sync", description: "Find a slot that works for both time zones." },
      { title: "Collect feedback from beta users" },
      { title: "Optimize database queries" },
      { title: "Design the onboarding email sequence" },
      { title: "Verify nightly backups are running" },
      { title: "Update the contributing guide" },
      { title: "Investigate intermittent CI failures", description: "Started after the runner image upgrade." },
      { title: "Migrate images to a CDN" },
      { title: "Write unit tests for the checkout flow" },
      { title: "Review analytics dashboard metrics" },
      { title: "Archive completed projects" },
      { title: "Renew SSL certificates" },
      { title: "Prototype the settings page layout" },
      { title: "Organize the shared drive" },
      { title: "Plan the next release" },
    ];

    const now = Date.now();
    seedData.forEach((seed, index) => {
      this.tasks.push({
        id: randomUUID(),
        title: seed.title,
        description: seed.description ?? null,
        // Spread creation dates into the past so the list has a realistic,
        // stable order (newest first).
        createdAt: new Date(now - index * 4 * 60 * 60 * 1000),
      });
    });
  }

  /**
   * Returns one page of tasks, newest first, using offset-based pagination.
   * `nextCursor` is `null` when the collection has no more items, which
   * tells the client to stop requesting pages.
   */
  list({ cursor, limit }: ListTasksInput): TaskPage {
    const offset = cursor ?? 0;
    const sorted = [...this.tasks].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
    const items = sorted.slice(offset, offset + limit);
    const nextCursor =
      offset + limit < sorted.length ? offset + limit : null;
    return { items, nextCursor, total: sorted.length };
  }

  get(id: string): Task | undefined {
    return this.tasks.find((task) => task.id === id);
  }

  create({ title, description }: CreateTaskInput): Task {
    const task: Task = {
      id: randomUUID(),
      title,
      // Normalize empty strings to null so "no description" has one shape.
      description: description || null,
      createdAt: new Date(),
    };
    this.tasks.push(task);
    return task;
  }

  update(id: string, input: UpdateTaskInput): Task | undefined {
    const task = this.get(id);
    if (!task) return undefined;
    if (input.title !== undefined) task.title = input.title;
    if (input.description !== undefined) task.description = input.description || null;
    return task;
  }

  delete(id: string): Task | undefined {
    const index = this.tasks.findIndex((task) => task.id === id);
    if (index === -1) return undefined;
    return this.tasks.splice(index, 1)[0];
  }
}

const globalForStore = globalThis as unknown as { __taskStore?: TaskStore };

export const taskStore = globalForStore.__taskStore ?? new TaskStore();
globalForStore.__taskStore = taskStore;
