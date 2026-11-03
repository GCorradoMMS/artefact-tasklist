import { randomUUID } from "node:crypto";
import type { Task, TaskCursor, TaskPage } from "@/lib/types";

export type CreateTaskInput = { title: string; description?: string | null };
export type UpdateTaskInput = { title?: string; description?: string | null };
export type ListTasksInput = { cursor?: TaskCursor | null; limit: number };

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
      { title: "Audit third-party dependencies for vulnerabilities" },
      { title: "Draft the quarterly OKR review" },
      { title: "Set up error tracking alerts", description: "Route new exceptions to the on-call channel." },
      { title: "Document the deployment runbook" },
      { title: "Reduce bundle size on the landing page" },
      { title: "Interview candidates for the backend role" },
      { title: "Replace hardcoded strings with translations" },
      { title: "Test the password reset flow end to end" },
      { title: "Reorganize the design token structure" },
      { title: "Backfill the missing analytics events" },
      { title: "Review the incident postmortem draft" },
      { title: "Ship the dark theme for the dashboard" },
      { title: "Configure rate limiting on public endpoints", description: "Start conservative and loosen based on real traffic." },
      { title: "Update the architecture diagram" },
      { title: "Clean up stale feature flags" },
      { title: "Benchmark the new caching layer" },
      { title: "Migrate cron jobs to the scheduler service" },
      { title: "Proofread the release notes" },
      { title: "Add empty states to report pages" },
      { title: "Investigate the spike in signup drop-offs" },
      { title: "Refresh the sandbox dataset" },
      { title: "Pair with support on the billing tickets" },
      { title: "Draft the accessibility remediation plan" },
      { title: "Rotate the staging credentials" },
      { title: "Add keyboard shortcuts for the editor" },
      { title: "Review the vendor contract renewal" },
      { title: "Split the monolith build pipeline" },
      { title: "Update the on-call rotation" },
      { title: "Measure cold start times on the API" },
      { title: "Consolidate duplicate UI components" },
      { title: "Prepare the customer advisory board deck" },
      { title: "Fix time zone handling in the scheduler" },
      { title: "Archive the legacy repositories" },
      { title: "Test the mobile app on low-end devices" },
      { title: "Draft the data retention policy" },
      { title: "Improve search relevance for product names" },
      { title: "Set up the internal status page" },
      { title: "Review the quarterly infrastructure spend" },
      { title: "Add retry logic to webhook delivery", description: "Exponential backoff, capped at five attempts." },
      { title: "Rewrite the confusing onboarding copy" },
      { title: "Inventory the unused API endpoints" },
      { title: "Plan the migration off the legacy queue" },
      { title: "Shadow a customer success call" },
      { title: "Update the threat model for the auth service" },
      { title: "Compress the marketing site assets" },
      { title: "Wire up the new feature flag dashboard" },
      { title: "Reconcile the staging and production configs" },
      { title: "Document the local troubleshooting guide" },
      { title: "Review open pull requests from the community" },
      { title: "Set up load testing for the checkout path" },
      { title: "Fix the flaky end-to-end test suite" },
      { title: "Draft the engineering blog post" },
      { title: "Audit the permissions matrix" },
      { title: "Add skeleton loaders to the tables" },
      { title: "Evaluate self-hosting the analytics stack" },
      { title: "Refresh the API rate limit documentation" },
      { title: "Track down the memory leak in the worker" },
      { title: "Plan the deprecation of API v1", description: "Announce ninety days ahead of the cutoff." },
      { title: "Review the design system contribution flow" },
      { title: "Update the seating chart for the new office" },
      { title: "Verify the disaster recovery procedure" },
      { title: "Clean up orphaned uploads in object storage" },
      { title: "Consolidate the duplicated utility modules" },
      { title: "Sketch the notification preferences screen" },
      { title: "Check license compliance for new dependencies" },
      { title: "Improve form validation error messages" },
      { title: "Set up preview deployments for pull requests" },
      { title: "Review the security questionnaire from procurement" },
      { title: "Migrate the docs site to the new template" },
      { title: "Analyze the support ticket categories" },
      { title: "Add pagination to the admin activity log" },
      { title: "Update the sandbox rate limits" },
      { title: "Confirm the observability dashboards cover SLOs" },
      { title: "Plan the team offsite agenda" },
      { title: "Review the year-end infrastructure checklist" },
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
   * Returns one page of tasks, newest first, using keyset pagination: the
   * cursor is the sort key of the previous page's last item, and only items
   * strictly older than it can appear on this page. Unlike offset slicing,
   * inserts and deletes between page fetches cannot duplicate or skip rows.
   * `nextCursor` is `null` when the collection has no more items, which
   * tells the client to stop requesting pages.
   */
  list({ cursor, limit }: ListTasksInput): TaskPage {
    const sorted = [...this.tasks].sort((a, b) => {
      const delta = b.createdAt.getTime() - a.createdAt.getTime();
      if (delta !== 0) return delta;
      // Stable tiebreak for identical timestamps (id descending).
      return a.id < b.id ? 1 : a.id > b.id ? -1 : 0;
    });

    const remaining = cursor
      ? sorted.filter((task) => this.sortsAfterCursor(task, cursor))
      : sorted;
    const items = remaining.slice(0, limit);
    const last = items[items.length - 1];
    const nextCursor =
      last && remaining.length > limit
        ? { createdAt: last.createdAt.getTime(), id: last.id }
        : null;
    return { items, nextCursor, total: sorted.length };
  }

  /** True when `task` is strictly older than `cursor` in the sort order. */
  private sortsAfterCursor(task: Task, cursor: TaskCursor): boolean {
    const taskMs = task.createdAt.getTime();
    if (taskMs !== cursor.createdAt) return taskMs < cursor.createdAt;
    return task.id < cursor.id;
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
