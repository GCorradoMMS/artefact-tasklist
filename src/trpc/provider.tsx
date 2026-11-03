"use client";

import { useState, type ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import superjson from "superjson";
import type { AppRouter } from "@/server/root";
import { makeQueryClient } from "./query-client";

/** Client-side tRPC hooks (typed React Query wrappers for each procedure). */
export const trpc = createTRPCReact<AppRouter>();

/**
 * Wraps the app with the tRPC and React Query contexts. Client components
 * call procedures over HTTP through the batch link below; `superjson` lets
 * `Date` fields (e.g. `createdAt`) survive the round trip.
 */
export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(makeQueryClient);
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [httpBatchLink({ url: "/api/trpc", transformer: superjson })],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
