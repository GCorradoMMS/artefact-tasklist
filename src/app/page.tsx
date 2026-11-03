import { Suspense } from "react";
import Link from "next/link";
import { PAGE_SIZE } from "@/lib/constants";
import { TaskList } from "@/components/task-list";
import { TaskListSkeleton } from "@/components/skeletons";
import { PlusIcon } from "@/components/icons";
import { buttonPrimary } from "@/components/ui";
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
      <header className="mb-6 flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-neutral-900">
            Tasks
          </h1>
          <p className="mt-0.5 text-sm text-neutral-500">
            A simple task manager backed by a tRPC API.
          </p>
        </div>
        <Link href="/tasks/new" className={buttonPrimary}>
          <PlusIcon />
          New task
        </Link>
      </header>
      <HydrateClient>
        <Suspense fallback={<TaskListSkeleton />}>
          <TaskList />
        </Suspense>
      </HydrateClient>
    </main>
  );
}
