import {
  QueryClient,
  defaultShouldDehydrateQuery,
} from "@tanstack/react-query";

/** Factory shared by the client provider and the server-side RSC setup. */
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Treat data as fresh for 30s to avoid redundant refetches while
        // navigating between pages.
        staleTime: 30 * 1000,
      },
      dehydrate: {
        // Serialize still-pending queries too, so data prefetched in Server
        // Components is always handed over to the client cache.
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === "pending",
      },
    },
  });
}
