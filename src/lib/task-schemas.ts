import { z } from "zod";

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

export const updateTaskSchema = z.object({
  id: z.string().min(1, "Task id is required."),
  title: taskTitleSchema.optional(),
  description: taskDescriptionSchema.optional(),
});

export const listTasksSchema = z.object({
  /** Offset cursor returned by the previous page (`nextCursor`). */
  cursor: z.number().int().min(0).nullish(),
  limit: z.number().int().min(1).max(50).default(10),
});
