import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createTRPCContext } from "@/server/trpc";
import { appRouter } from "@/server/root";

/**
 * Next.js Route Handler that exposes the tRPC router under /api/trpc.
 * The catch-all `[trpc]` segment lets a single handler serve every procedure.
 */
const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createTRPCContext(),
    onError({ error }) {
      // Server-side visibility for API failures (they would otherwise only
      // surface in the browser).
      console.error(error);
    },
  });

export { handler as GET, handler as POST };
