import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTaskSchema,
  listTasksSchema,
  updateTaskSchema,
} from "@/lib/task-schemas";
import { publicProcedure, router } from "@/server/trpc";
import { taskStore } from "@/server/store";

/**
 * Task CRUD endpoints.
 *
 * Input validation runs on the shared schemas in `lib/task-schemas.ts`;
 * an invalid payload never reaches the handler and is automatically turned
 * into a tRPC BAD_REQUEST error with a descriptive message.
 */
export const taskRouter = router({
  /** Paginated task list, newest first (used by the infinite scroll). */
  list: publicProcedure
    .input(listTasksSchema)
    .query(({ input }) => taskStore.list(input)),

  /** Fetch a single task by id, or fail with NOT_FOUND. */
  byId: publicProcedure
    .input(z.object({ id: z.string().min(1, "Task id is required.") }))
    .query(({ input }) => {
      const task = taskStore.get(input.id);
      if (!task) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No task found with id "${input.id}".`,
        });
      }
      return task;
    }),

  /** Create a task. `title` is required and must not be blank. */
  create: publicProcedure
    .input(createTaskSchema)
    .mutation(({ input }) => taskStore.create(input)),

  /** Update an existing task, or fail with NOT_FOUND. */
  update: publicProcedure.input(updateTaskSchema).mutation(({ input }) => {
    const { id, ...data } = input;
    const task = taskStore.update(id, data);
    if (!task) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Cannot update: no task found with id "${id}".`,
      });
    }
    return task;
  }),

  /** Remove an existing task, or fail with NOT_FOUND. */
  delete: publicProcedure
    .input(z.object({ id: z.string().min(1, "Task id is required.") }))
    .mutation(({ input }) => {
      const task = taskStore.delete(input.id);
      if (!task) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Cannot delete: no task found with id "${input.id}".`,
        });
      }
      return task;
    }),
});
