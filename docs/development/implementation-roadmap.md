# Implementation Roadmap — Task Manager

**Status:** MVP delivered | **Last updated:** 2026-11-03

## Delivered (MVP)

| Slice | Outcome | Validation |
|---|---|---|
| SL-01 Foundation | Next.js 15 (App Router) project scaffold, TypeScript strict, Tailwind v4, ESLint 9 | `npm run lint`, `npm run build` pass |
| SL-02 Backend | tRPC v11 router with task CRUD, shared Zod schemas, in-memory store with seed data, `/api/trpc` route handler | Procedure-level checks against the production server (list, create, update, delete, validation, NOT_FOUND) |
| SL-03 List experience | SSR first page (RSC prefetch + hydration), infinite scroll via IntersectionObserver, delete with feedback | Rendered HTML inspection; UI interaction tests |
| SL-04 Forms | Create and edit pages with controlled form, shared validation, success/error feedback, 404 for missing tasks | UI interaction tests; direct URL check for unknown id |
| SL-05 Docs & workflow | README, project brief, MVP scope, system design, ADRs, delivery report | Documentation review |

## Known limitations (accepted for MVP)

- In-memory storage: data resets on server restart; each server instance holds its own data.
- Keyset cursor (sort key of the last returned item) keeps pages stable under mutations; ordering requirements beyond newest-first would need a redesign.
- No automated tests configured; verification is manual + lint/build.

## Next useful steps (backlog, not scheduled)

1. Add a persistence layer (SQLite via an ORM) behind the same store interface — requires ADR revisit (ADR-0003).
2. Add automated tests: unit tests for the task router/store (including cursor pagination edge cases), one end-to-end smoke test of the CRUD journey.
3. Add CI (lint + build on push).
4. Small polish backlog from code review: per-row delete pending state, auto-dismiss for edit-page success feedback.
