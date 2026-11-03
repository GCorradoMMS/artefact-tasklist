import { Suspense } from "react";
import { PAGE_SIZE } from "@/lib/constants";
import { TaskList } from "@/components/task-list";
import { TaskListSkeleton } from "@/components/skeletons";
import { HydrateClient, trpc } from "@/trpc/server";

// The task list lives in memory and changes on every mutation, so the page
// is rendered per request instead of being statically prerendered at build.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Prefetch the first page on the server and await it: the query lands in
  // the per-request cache before rendering, so the task list is serialized
  // inline with the page (no skeleton flash) and <HydrateClient> replays
  // that data into the client cache so no extra request is needed on mount.
  await trpc.task.list.prefetchInfinite({ limit: PAGE_SIZE });

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10 sm:py-14">
      <header className="mb-8">
        <h1 className="font-display text-h1 text-ink-900 text-balance">
          Tasks
        </h1>
        <p className="mt-1 text-body-lg text-ink-600 text-pretty">
          Plan, add, and complete your daily work.
        </p>
      </header>
      <HydrateClient>
        <Suspense fallback={<TaskListSkeleton />}>
          <TaskList />
        </Suspense>
      </HydrateClient>
    </main>
  );
}
