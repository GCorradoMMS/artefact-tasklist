# ADR-0003: In-memory store as a `globalThis`-cached singleton

- **Status:** Accepted
- **Date:** 2026-11-03
- **Decision owners:** Project owner
- **Related:** `src/server/store.ts`, `docs/architecture/system-design.md` (invariant 5)

## Context

Persistence is out of scope for this iteration, but task data must still be consistent across all server-side entry points. Next.js bundles server modules **per route**, so a naive module-level singleton produces one store copy per bundle: page renders and route handlers would see different data.

## Decision drivers

- One shared data set per server process, across every route bundle.
- Survive development hot reloads.
- Keep the future persistence swap local to a single file.

## Options considered

### Option A — Module-level singleton only
- Benefits: simplest code.
- Costs/risks: per-route bundles each instantiate their own store; API-created tasks are invisible to SSR pages (verified defect during development).

### Option B — `globalThis`-cached singleton (selected)
- Benefits: all bundles in the process share one instance; hot-reload safe; all storage logic confined to one class.
- Costs/risks: data lifetime equals process lifetime; multi-instance/serverless deployments would diverge.

## Decision

`TaskStore` is instantiated once and cached on `globalThis`; every server module imports the same `taskStore` export. The store exposes `list/get/create/update/delete` and seeds fictional tasks on first construction.

## Consequences

### Positive
- Consistent reads and writes across SSR pages and route handlers (verified in production build).
- Swapping the class internals for a database requires no changes in the router or components.

### Negative / trade-offs
- Every restart wipes user data (accepted; disclosed in the README and project brief).
- Horizontal scaling would give each instance different data — the single-instance assumption is explicit.

### Neutral / operational
- The home page must stay `force-dynamic` precisely because this store is mutable and process-local (system design invariant #4).

## Security and privacy implications

No data leaves the process except to the requesting browser. No secrets involved.

## Validation and revisit criteria

All reads/writes go through the single `taskStore` export; a persistence change should touch only `store.ts`. If a change fans out beyond that file, the boundary eroded. Revisit (with a new ADR) when persistence or multi-instance deployment is introduced.
