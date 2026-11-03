import "server-only";

import { cache } from "react";
import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { appRouter } from "@/server/root";
import { createCallerFactory, createTRPCContext } from "@/server/trpc";
import { makeQueryClient } from "./query-client";

// Stable per-request query client getter (required by the RSC helpers).
const getQueryClient = cache(makeQueryClient);

/**
 * Server-side caller: lets Server Components invoke tRPC procedures directly
 * (no HTTP round trip) while rendering.
 */
const caller = createCallerFactory(appRouter)(createTRPCContext);
export const api = caller;

/**
 * RSC integration: `trpc` exposes `.prefetch` / `.prefetchInfiniteQuery`
 * helpers for Server Components and `HydrateClient` replays that data into
 * the client cache, so the first client render is already populated without
 * an extra client-side fetch.
 */
export const { trpc, HydrateClient } = createHydrationHelpers<typeof appRouter>(
  caller,
  getQueryClient,
);
