# ADR-0002: Shared Zod schemas as the single validation contract

- **Status:** Accepted
- **Date:** 2026-11-03
- **Decision owners:** Project owner
- **Related:** `src/lib/task-schemas.ts`, `src/server/routers/task.ts`, `src/components/task-form.tsx`

## Context

Task input (title, description, pagination) must be validated on the server (trust boundary) and in the form (user experience). Duplicating the rules in two places invites drift.

## Decision drivers

- Blank titles must be impossible on both sides.
- Field-level, immediate feedback in the form without a round trip.
- One authoritative definition of "valid task".

## Options considered

### Option A — Two independent validations (form checks + API checks)
- Benefits: freedom to tune each side independently.
- Costs/risks: rules drift; the API may accept what the form rejects or vice versa.

### Option B — Shared Zod schemas (selected)
- Benefits: one file owns the rules; the form gets the exact same messages; the server schema stays the trust boundary.
- Costs/risks: form validation is constrained to the API schema's shape and messages; stricter server-only or laxer client-only rules would require splitting schemas later.

## Decision

`src/lib/task-schemas.ts` exports all task input schemas and is imported by both the router (via `.input(...)`, which turns failures into tRPC `BAD_REQUEST`) and `TaskForm` (via `safeParse` before any request).

## Consequences

### Positive
- Server and client can never disagree about what a valid task is.
- Invalid payloads never reach handlers; the form never sends payloads the server would reject.

### Negative / trade-offs
- Changing a rule changes UX and API behavior simultaneously (by design).

### Neutral / operational
- Whitespace-only titles are rejected because the schema trims before checking length.

## Security and privacy implications

The server-side parse is the trust boundary and must never be removed, even though the client validates first. No personal data is involved.

## Validation and revisit criteria

Submitting an invalid payload directly to `/api/trpc/task.create` (bypassing the form) fails with a descriptive validation error, and the form never produces a request the server would reject. If server and client rules need to diverge, split the schemas deliberately with a new ADR.
