import { z } from "zod";
import { PAGE_SIZE } from "./constants";

/**
 * Zod schemas shared by the backend (tRPC input validation) and the frontend
 * (form validation), so the exact same rules run on both sides.
 */
export const taskTitleSchema = z
  .string()
  .trim()
  .min(1, "Title is required.")
  .max(120, "Title must be at most 120 characters.");

export const taskDescriptionSchema = z
  .string()
  .trim()
  .max(1000, "Description must be at most 1000 characters.");

export const createTaskSchema = z.object({
  title: taskTitleSchema,
  description: taskDescriptionSchema.optional(),
});

export const updateTaskSchema = z
  .object({
    id: z.string().min(1, "Task id is required."),
    title: taskTitleSchema.optional(),
    description: taskDescriptionSchema.optional(),
  })
  .refine(
    (data) => data.title !== undefined || data.description !== undefined,
    { message: "Provide at least one field to update." },
  );

/** Sort key of the last item of a page (see `TaskCursor`). */
export const taskCursorSchema = z.object({
  createdAt: z.number().int().min(0),
  id: z.string().min(1),
});

export const listTasksSchema = z.object({
  /** Sort key of the last item of the previous page (`nextCursor`). */
  cursor: taskCursorSchema.nullish(),
  limit: z.number().int().min(1).max(50).default(PAGE_SIZE),
});
