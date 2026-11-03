import type { Metadata } from "next";
import { TaskForm } from "@/components/task-form";

export const metadata: Metadata = {
  title: "New task",
};

export default function NewTaskPage() {
  return (
    <main className="mx-auto w-full max-w-xl px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight">Create a new task</h1>
      <p className="mt-1 mb-6 text-sm text-neutral-500">
        Fill in the details below. The title is required.
      </p>
      <TaskForm mode="create" />
    </main>
  );
}
