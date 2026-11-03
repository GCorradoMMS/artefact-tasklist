import type { Metadata } from "next";
import Link from "next/link";
import { TaskForm } from "@/components/task-form";
import { ArrowLeftIcon } from "@/components/icons";
import { panel } from "@/components/ui";

export const metadata: Metadata = {
  title: "New task",
};

export default function NewTaskPage() {
  return (
    <main className="mx-auto w-full max-w-xl px-4 py-10 sm:py-14">
      <Link
        href="/"
        className="mb-5 inline-flex items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-neutral-900"
      >
        <ArrowLeftIcon size={14} />
        Tasks
      </Link>
      <h1 className="text-xl font-semibold tracking-tight text-neutral-900">
        Create a new task
      </h1>
      <p className="mt-0.5 mb-6 text-sm text-neutral-500">
        Fill in the details below. The title is required.
      </p>
      <section className={panel}>
        <div className="p-5 sm:p-6">
          <TaskForm mode="create" />
        </div>
      </section>
    </main>
  );
}
