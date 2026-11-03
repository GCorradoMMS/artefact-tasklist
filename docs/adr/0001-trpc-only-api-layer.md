# ADR-0001: tRPC v11 as the only API layer, typed end-to-end

- **Status:** Accepted
- **Date:** 2026-11-03
- **Decision owners:** Project owner
- **Related:** `docs/architecture/system-design.md`, `src/server/root.ts`, `src/trpc/server.ts`, `src/app/api/trpc/[trpc]/route.ts`

## Context

The application needs a CRUD API consumed by both React Server Components (server render) and client components (mutations, infinite scroll). The options were a hand-written REST layer, a GraphQL server, or tRPC.

## Decision drivers

- End-to-end type safety between router and UI with no schema duplication.
- Small single-team app; minimal dependency and code surface preferred.
- Server Components should call the API in-process (no HTTP self-calls).
- Typed, meaningful errors (e.g. `NOT_FOUND`) usable in server control flow.

## Options considered

### Option A — REST controllers + a hand-written typed client
- Benefits: universal HTTP surface, easy external consumption.
- Costs/risks: duplicated request/response types, manual client code, no compile-time contract.

### Option B — tRPC router (selected)
- Benefits: one router consumed two ways (in-process caller for RSCs; HTTP fetch adapter for client hooks), client hooks typed from `AppRouter`, Zod validation built into procedures.
- Costs/risks: HTTP surface is tRPC-shaped (only TypeScript consumers are comfortable); server/client TypeScript builds are coupled.

## Decision

tRPC v11 is the only API style. The root router (`src/server/root.ts`) is mounted once under `/api/trpc` via the fetch adapter and is also exposed to Server Components through `createCallerFactory`.

## Consequences

### Positive
- Compile-time contract enforcement; adding a procedure requires no manual client sync.
- Typed errors flow into server control flow (`byId` NOT_FOUND → 404 page).
- No second schema/client layer to maintain.

### Negative / trade-offs
- Not a stable public API for non-TypeScript consumers.
- Router type changes can break client compilation (acceptable: same repo, same types).

### Neutral / operational
- superjson must stay configured on both the router and the client link (see system design invariant #3).

## Security and privacy implications

All procedures are public with an empty context; there is no auth. The designed extension point for it is a `protectedProcedure` middleware in `src/server/trpc.ts`. No personal data crosses the API (fictional content only).

## Validation and revisit criteria

Adding a procedure (e.g. `task.toggleDone`) touches only the router and compiles in the client with no manual client code. If a non-TypeScript consumer or a public API is ever required, revisit this decision.
