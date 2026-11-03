"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createTaskSchema } from "@/lib/task-schemas";
import { insertCreatedTask, updateTaskInList } from "@/lib/task-cache";
import type { Task } from "@/lib/types";
import { trpc } from "@/trpc/provider";
import { StatusMessage } from "./status-message";
import {
  buttonPrimary,
  buttonSecondary,
  cx,
  inputBase,
  inputError,
  inputField,
} from "./ui";

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
 *
 * Both mutations write their server-confirmed result straight into the list
 * cache (`lib/task-cache.ts`): the list reflects the change instantly and no
 * blocking refetch or artificial delay runs before navigating back.
 */
export function TaskForm({ mode, task }: TaskFormProps) {
  const router = useRouter();
  const utils = trpc.useUtils();

  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [feedback, setFeedback] = useState<Feedback>(null);

  const createTask = trpc.task.create.useMutation({
    onSuccess: (created) => {
      // The store returns the persisted task, so we can update the cache
      // directly instead of waiting for a refetch, and navigate right away.
      insertCreatedTask(utils.task.list, created);
      router.push("/");
    },
    onError: (error) => {
      setFeedback({ tone: "error", message: error.message });
    },
  });

  const updateTask = trpc.task.update.useMutation({
    onSuccess: (updated) => {
      // Swap the updated task into every cached page; no refetch needed
      // because updates never change the sort order or the total.
      updateTaskInList(utils.task.list, updated);
      setFeedback({
        tone: "success",
        message: `Task "${updated.title}" updated.`,
      });
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
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {feedback && (
        <StatusMessage tone={feedback.tone}>{feedback.message}</StatusMessage>
      )}

      <div>
        <label
          htmlFor="title"
          className="mb-1.5 block text-sm font-medium text-neutral-700"
        >
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
          className={cx(inputField, fieldErrors.title && inputError)}
        />
        {fieldErrors.title && (
          <p id="title-error" className="mt-1.5 text-xs text-red-600">
            {fieldErrors.title}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="mb-1.5 block text-sm font-medium text-neutral-700"
        >
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
          className={cx(inputBase, fieldErrors.description && inputError)}
        />
        {fieldErrors.description && (
          <p id="description-error" className="mt-1.5 text-xs text-red-600">
            {fieldErrors.description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2.5 pt-1">
        <button
          type="submit"
          disabled={isSubmitting}
          className={buttonPrimary}
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
        <Link href="/" className={buttonSecondary}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
