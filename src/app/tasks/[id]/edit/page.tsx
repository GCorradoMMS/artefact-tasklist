import { TRPCError } from "@trpc/server";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TaskForm } from "@/components/task-form";
import { ArrowLeftIcon } from "@/components/icons";
import { backLink, cx, panel } from "@/components/ui";
import { api } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Edit task",
};

export default async function EditTaskPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Load the task on the server through the tRPC caller. Only a missing
  // task maps to the 404 page; any other failure propagates to the route
  // error boundary so real server faults stay visible.
  const task = await api.task.byId({ id }).catch((error: unknown) => {
    if (error instanceof TRPCError && error.code === "NOT_FOUND") notFound();
    throw error;
  });

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-10 sm:py-14">
      <Link href="/" className={cx(backLink, "mb-4")}>
        <ArrowLeftIcon size={14} />
        Tasks
      </Link>
      <h1 className="font-display text-h1 text-ink-900 text-balance">
        Edit task
      </h1>
      <p className="mt-1 mb-8 text-body-lg text-ink-600 text-pretty">
        Update the details below and save your changes.
      </p>
      <section className={panel}>
        <div className="p-5 sm:p-6">
          <TaskForm mode="edit" task={task} />
        </div>
      </section>
    </main>
  );
}
