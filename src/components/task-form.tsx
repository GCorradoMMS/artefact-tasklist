"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createTaskSchema } from "@/lib/task-schemas";
import type { Task } from "@/lib/types";
import { trpc } from "@/trpc/provider";
import { StatusMessage } from "./status-message";

type Feedback = { tone: "success" | "error"; message: string } | null;
type FieldErrors = { title?: string; description?: string };

interface TaskFormProps {
  /** "create" shows a blank form; "edit" starts from an existing task. */
  mode: "create" | "edit";
  task?: Task;
}

/**
 * Form used to create and edit tasks.
 *
 * Field state is managed with hooks (`useState`) and validated with the same
 * Zod schemas the backend uses, so the user gets immediate feedback before a
 * request is even sent. Server errors are surfaced in the same banner.
 */
export function TaskForm({ mode, task }: TaskFormProps) {
  const router = useRouter();
  const utils = trpc.useUtils();

  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [feedback, setFeedback] = useState<Feedback>(null);
  const redirectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cancel a pending redirect if the user navigates away before it fires.
  useEffect(() => {
    return () => {
      if (redirectTimer.current) clearTimeout(redirectTimer.current);
    };
  }, []);

  const createTask = trpc.task.create.useMutation({
    onSuccess: async (created) => {
      setFeedback({
        tone: "success",
        message: `Task "${created.title}" created successfully.`,
      });
      // Refresh the list cache, give the user a moment to see the
      // confirmation, then navigate back to the list.
      await utils.task.list.invalidate();
      redirectTimer.current = setTimeout(() => router.push("/"), 800);
    },
    onError: (error) => {
      setFeedback({ tone: "error", message: error.message });
    },
  });

  const updateTask = trpc.task.update.useMutation({
    onSuccess: async (updated) => {
      setFeedback({
        tone: "success",
        message: `Task "${updated.title}" updated successfully.`,
      });
      await utils.task.list.invalidate();
    },
    onError: (error) => {
      setFeedback({ tone: "error", message: error.message });
    },
  });

  // Keep the submit disabled after a successful create until the redirect
  // fires, so the same task cannot be submitted twice.
  const isSubmitting =
    createTask.isPending ||
    updateTask.isPending ||
    (mode === "create" && createTask.isSuccess);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Client-side validation with the shared schemas; the backend validates
    // the exact same payload again before touching the store. `description`
    // is always sent as a string so clearing the field clears it on the
    // server too (the store normalizes "" to null).
    const parsed = createTaskSchema.safeParse({ title, description });

    if (!parsed.success) {
      const errors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if ((field === "title" || field === "description") && !errors[field]) {
          errors[field] = issue.message;
        }
      }
      setFieldErrors(errors);
      setFeedback(null);
      return;
    }

    setFieldErrors({});
    setFeedback(null);

    if (mode === "create") {
      createTask.mutate(parsed.data);
    } else if (task) {
      updateTask.mutate({ id: task.id, ...parsed.data });
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {feedback && (
        <StatusMessage tone={feedback.tone}>{feedback.message}</StatusMessage>
      )}

      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="What needs to be done?"
          aria-invalid={Boolean(fieldErrors.title)}
          aria-describedby={fieldErrors.title ? "title-error" : undefined}
          className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
        />
        {fieldErrors.title && (
          <p id="title-error" className="mt-1 text-xs text-red-600">
            {fieldErrors.title}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium">
          Description{" "}
          <span className="font-normal text-neutral-400">(optional)</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Add more details…"
          aria-invalid={Boolean(fieldErrors.description)}
          aria-describedby={
            fieldErrors.description ? "description-error" : undefined
          }
          className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
        />
        {fieldErrors.description && (
          <p id="description-error" className="mt-1 text-xs text-red-600">
            {fieldErrors.description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? mode === "create"
              ? "Creating…"
              : "Saving…"
            : mode === "create"
              ? createTask.isSuccess
                ? "Created"
                : "Create task"
              : "Save changes"}
        </button>
        <Link
          href="/"
          className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-100"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
