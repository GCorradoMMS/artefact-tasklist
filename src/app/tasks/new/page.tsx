import type { Metadata } from "next";
import Link from "next/link";
import { TaskForm } from "@/components/task-form";
import { ArrowLeftIcon } from "@/components/icons";
import { backLink, cx, panel } from "@/components/ui";

export const metadata: Metadata = {
  title: "New task",
};

export default function NewTaskPage() {
  return (
    <main className="mx-auto w-full max-w-xl px-4 py-10 sm:py-14">
      <Link href="/" className={cx(backLink, "mb-4")}>
        <ArrowLeftIcon size={14} />
        Tasks
      </Link>
      <h1 className="font-display text-h1 text-ink-900 text-balance">
        Create a new task
      </h1>
      <p className="mt-1 mb-8 text-body-lg text-ink-600 text-pretty">
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
