import { initTRPC } from "@trpc/server";
import superjson from "superjson";

/**
 * tRPC initialization. This app has no auth/session, so no per-request
 * context is required and the context type stays empty.
 *
 * `superjson` is attached at the router level (and mirrored on the client
 * link) so `Date` values like `createdAt` are serialized correctly over the
 * wire and keep their type end to end.
 */
const t = initTRPC.create({ transformer: superjson });

export const router = t.router;
export const publicProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;
export const createTRPCContext = async () => ({});
