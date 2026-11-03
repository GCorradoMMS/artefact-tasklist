import { TRPCError } from "@trpc/server";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TaskForm } from "@/components/task-form";
import { ArrowLeftIcon } from "@/components/icons";
import { panel } from "@/components/ui";
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
      <Link
        href="/"
        className="mb-5 inline-flex items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-neutral-900"
      >
        <ArrowLeftIcon size={14} />
        Tasks
      </Link>
      <h1 className="text-xl font-semibold tracking-tight text-neutral-900">
        Edit task
      </h1>
      <p className="mt-0.5 mb-6 text-sm text-neutral-500">
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
