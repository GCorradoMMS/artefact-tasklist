# Project Brief — Task Manager

**Status:** Accepted | **Owner:** Project owner | **Last updated:** 2026-11-03

## 1. Elevator pitch

A minimal task management web application: users create, list, edit, and remove tasks through a clean interface, backed by a fully type-safe tRPC API with in-memory storage.

## 2. Problem and evidence

- Problem: people need a simple way to keep track of things they need to do.
- Who experiences it: any individual user who wants a lightweight task list.
- Current alternatives/workarounds: sticky notes, spreadsheets, or heavier project-management tools.
- Evidence that the problem matters: task lists are a proven, widely understood productivity pattern.

## 3. Target users and jobs-to-be-done

| User/persona | Context | Need/job | Expected outcome |
|---|---|---|---|
| Individual user | Personal productivity, desktop browser | Record and organize things to do | A fast, readable list that can be updated without friction |

## 4. Product value

Simplicity and speed: no accounts, no database, no setup beyond `npm install`. The list is rendered server-side so it appears instantly, and every operation gives immediate visual feedback.

## 5. Core journeys

1. Open the app and see the current tasks, newest first (server-rendered first page, then infinite scroll).
2. Create a task with a title and optional description; blank titles are rejected with a clear message.
3. Edit an existing task and save the changes; delete a task directly from the list with confirmation feedback.

## 6. Goals and non-goals

### Goals
- CRUD for tasks over an end-to-end type-safe tRPC API.
- Consistent validation rules shared between API and forms (Zod).
- Meaningful errors for invalid input and missing records.
- SSR first render, incremental loading (infinite scroll), and clear loading/success/failure feedback.

### Non-goals
- Persistence across server restarts (in-memory by design).
- Authentication, multi-user data, sharing, or collaboration.
- Deployment/infrastructure concerns (local execution is the target).

## 7. Constraints

- Budget/cost: none (no paid services).
- Time: delivered in a single iteration.
- Platform/runtime: Node.js 20+, web browser; npm as package manager.
- Compliance/privacy/security: no personal data collected; all seed content fictional; no secrets in the repository.
- Integrations: none (no external services or databases).
- Team/operational constraints: single-developer scale; keep the dependency set minimal.

## 8. Success measures

| Metric | Definition | Baseline | Target | How measured |
|---|---|---:|---:|---|
| CRUD coverage | Required operations implemented via tRPC | 0 | 5/5 procedures | Code inspection (`src/server/routers/task.ts`) |
| Validation parity | Same Zod schemas used by API and forms | 0 | 100% of task fields | Code inspection (`src/lib/task-schemas.ts`) |
| First render | Task list present in server-rendered HTML | — | First page in HTML response | `curl` the home page and grep a task title |
| Quality checks | Lint and production build pass | — | 0 errors | `npm run lint`, `npm run build` |

## 9. Assumptions and open questions

| ID | Question/assumption | Impact | Owner | Resolution needed by |
|---|---|---|---|---|
| OQ-01 | In-memory storage is acceptable for this product iteration (data resets on restart) | Medium | Project owner | Before any production use |
| OQ-02 | Single-server deployment assumption: data is not shared across multiple instances | Medium | Project owner | Before scaling horizontally |

## 10. Approval

- Product direction approved by: Project owner
- Date: 2026-11-03
- Explicitly deferred decisions: persistence layer, authentication, deployment target
