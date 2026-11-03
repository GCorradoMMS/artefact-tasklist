import { TRPCError } from "@trpc/server";
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

  // Load the task on the server through the tRPC caller. Only a missing
  // task maps to the 404 page; any other failure propagates to the route
  // error boundary so real server faults stay visible.
  const task = await api.task.byId({ id }).catch((error: unknown) => {
    if (error instanceof TRPCError && error.code === "NOT_FOUND") notFound();
    throw error;
  });

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
