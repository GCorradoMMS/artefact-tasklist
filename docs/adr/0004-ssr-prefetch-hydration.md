# ADR-0004: RSC prefetch + hydration for first render; HTTP for mutations

- **Status:** Accepted
- **Date:** 2026-11-03
- **Decision owners:** Project owner
- **Related:** `src/app/page.tsx`, `src/trpc/server.ts`, `src/trpc/query-client.ts`, `src/trpc/provider.tsx`

## Context

The task list must be visible in the server-rendered HTML (no loading flash, no client fetch waterfall) while remaining a live client component that supports infinite scroll and mutations.

## Decision drivers

- First paint contains data; zero client-side `task.list` fetch on mount.
- Client component must hydrate from the same data the server rendered.
- Mutations need cache invalidation in one place.

## Options considered

### Option A — Client-side fetching only
- Benefits: simplest plumbing.
- Costs/risks: empty HTML on first load, loading flash, no SSR.

### Option B — Server fetch + props drilling
- Benefits: easy to reason about.
- Costs/risks: props-based seeding of an infinite query is fragile; bypasses the cache/hydration model.

### Option C — RSC prefetch + `HydrateClient` (selected)
- Benefits: the page prefetches page 1 in-process (`trpc.task.list.prefetchInfinite`), `createHydrationHelpers` replays it into the client cache, and pending-query dehydration guarantees the handoff; reads happen wherever cheapest (RSC caller for the edit page, HTTP for scroll), while all writes stay client-side through `httpBatchLink`.
- Costs/risks: the plumbing is the most intricate part of the repo — per-request `QueryClient` via React `cache()`, pending-dehydration config, superjson on both sides, and prefetch/hook inputs must match exactly (silent double fetch or hydration miss otherwise).

## Decision

The home page uses `prefetchInfinite` + `<HydrateClient>` + `useSuspenseInfiniteQuery`; the edit page uses the server caller (`api.task.byId`); all mutations run client-side via HTTP with `utils.task.list.invalidate()` on success.

## Consequences

### Positive
- First HTML render already contains the task list; no client fetch on mount (staleTime 30s).
- Cache invalidation lives in one place (`useUtils`).

### Negative / trade-offs
- Several silent failure modes (double fetch, hydration misses) that a plain client-fetch design would not have; documented as invariants in the system design.

### Neutral / operational
- `<Suspense>` owns loading; `src/app/error.tsx` owns errors.

## Security and privacy implications

Same trust boundary as any tRPC usage: the HTTP procedures remain the only write path; the RSC caller never bypasses validation.

## Validation and revisit criteria

A cold load of `/` shows task rows in the HTML with no `task.list` XHR on mount (network tab). If a client-side refetch fires on every load, the prefetch/hydration pairing regressed.
