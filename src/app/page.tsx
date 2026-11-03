import { Suspense } from "react";
import Link from "next/link";
import { PAGE_SIZE } from "@/lib/constants";
import { TaskList } from "@/components/task-list";
import { HydrateClient, trpc } from "@/trpc/server";

// The task list lives in memory and changes on every mutation, so the page
// is rendered per request instead of being statically prerendered at build.
export const dynamic = "force-dynamic";

export default function HomePage() {
  // Prefetch the first page on the server: the HTML response already
  // contains the task list, and <HydrateClient> replays that data into the
  // client cache so no extra request is needed on mount.
  void trpc.task.list.prefetchInfinite({ limit: PAGE_SIZE });

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10">
      <header className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
          <p className="mt-1 text-sm text-neutral-500">
            A simple task manager backed by a tRPC API.
          </p>
        </div>
        <Link
          href="/tasks/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          New task
        </Link>
      </header>
      <HydrateClient>
        <Suspense
          fallback={<p className="py-12 text-center text-neutral-500">Loading tasks…</p>}
        >
          <TaskList />
        </Suspense>
      </HydrateClient>
    </main>
  );
}
