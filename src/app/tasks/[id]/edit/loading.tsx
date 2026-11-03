import { TaskFormSkeleton } from "@/components/skeletons";

/** Streaming fallback shown while the edit page loads its task on the server. */
export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-xl px-4 py-10 sm:py-14">
      <TaskFormSkeleton />
    </main>
  );
}
