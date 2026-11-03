import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TaskForm } from "@/components/task-form";
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

  // Load the task on the server through the tRPC caller; if it does not
  // exist, the backend NOT_FOUND error is converted into the 404 page.
  const task = await api.task.byId({ id }).catch(() => notFound());

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight">Edit task</h1>
      <p className="mt-1 mb-6 text-sm text-neutral-500">
        Update the details below and save your changes.
      </p>
      <TaskForm mode="edit" task={task} />
    </main>
  );
}
