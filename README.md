# Task Manager

A minimal task management application built with **Next.js 15** (App Router) and **tRPC v11**. The backend keeps tasks in memory and exposes a fully type-safe CRUD API, while the frontend renders the list with server-side rendering and supports incremental loading (infinite scroll).

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 15 (App Router, React 19, TypeScript) |
| API | tRPC v11 (fetch adapter, server-side caller, React Query bindings) |
| Validation | Zod (schemas shared between backend and frontend) |
| State / data fetching | TanStack Query v5 |
| Styling | Tailwind CSS v4 |
| Serialization | superjson (preserves `Date` values over the wire) |

## Getting started

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app starts with a set of sample tasks so the list and the infinite scroll have content right away.

Other scripts:

```bash
npm run build   # production build (Turbopack)
npm run start   # serve the production build
npm run lint    # ESLint
```

## How it works

### Backend (tRPC)

- `src/server/trpc.ts` initializes tRPC (with `superjson` attached so `Date` fields keep their type end to end).
- `src/server/routers/task.ts` defines the task procedures listed below. Inputs are validated with the shared Zod schemas; invalid payloads never reach the handlers and become `BAD_REQUEST` errors with descriptive messages.
- `src/server/store.ts` is the in-memory store. Data intentionally does not survive server restarts. The instance is cached on `globalThis` because Next.js bundles server modules per route — this guarantees the page renders and the route handlers share the same data in one server process.
- `src/app/api/trpc/[trpc]/route.ts` hosts the API under `/api/trpc` using the fetch adapter.

| Procedure | Type | Behavior |
| --- | --- | --- |
| `task.list` | query | Paginated list, newest first (`cursor` + `limit`), returns `nextCursor` and `total` |
| `task.byId` | query | Single task, `NOT_FOUND` if the id does not exist |
| `task.create` | mutation | Creates a task; `title` is required and must not be blank |
| `task.update` | mutation | Updates an existing task, `NOT_FOUND` if the id does not exist |
| `task.delete` | mutation | Removes an existing task, `NOT_FOUND` if the id does not exist |

### Frontend

- **Task list (`src/app/page.tsx`)** — a Server Component prefetches the first page with `trpc.task.list.prefetchInfinite` and wraps the list in `<HydrateClient>`, so the HTML response already contains the tasks and no client-side fetch is needed on mount. The page is `force-dynamic` because the in-memory data changes on every mutation.
- **Infinite scroll (`src/components/task-list.tsx`)** — an `IntersectionObserver` watches a sentinel element below the list and calls `fetchNextPage` when it approaches the viewport, loading pages incrementally with cursor-based pagination.
- **Create/edit form (`src/components/task-form.tsx`)** — one component for both modes, with controlled inputs managed by hooks. It validates with the same Zod schemas the API uses, so blank titles are rejected before a request is sent, and server errors are surfaced in the same banner.
- **Feedback** — success messages auto-dismiss after a few seconds; errors stay visible. Delete buttons show a `Deleting…` pending state while the request is in flight. Route-level errors (including tRPC errors thrown while suspended) land in `src/app/error.tsx` with a retry action.
- **Timestamps** are formatted in UTC so the server-rendered and client-rendered markup always match (no hydration mismatches).

### Project structure

```text
src/
├── app/
│   ├── api/trpc/[trpc]/route.ts   # tRPC HTTP endpoint (fetch adapter)
│   ├── tasks/new/page.tsx         # create task page
│   ├── tasks/[id]/edit/page.tsx   # edit task page (404 when the task is missing)
│   ├── error.tsx                  # route error boundary
│   ├── layout.tsx                 # tRPC + React Query providers
│   └── page.tsx                   # task list (SSR + infinite scroll)
├── components/
│   ├── status-message.tsx         # success/error feedback banner
│   ├── task-form.tsx              # shared create/edit form
│   └── task-list.tsx              # client list with infinite scroll and delete
├── lib/
│   ├── constants.ts               # page size
│   ├── format-date.ts             # UTC-safe date formatting
│   ├── task-schemas.ts            # Zod schemas shared by API and forms
│   └── types.ts                   # Task / TaskPage domain types
├── server/
│   ├── routers/task.ts            # task procedures (CRUD)
│   ├── root.ts                    # root router + AppRouter type
│   ├── store.ts                   # in-memory task store
│   └── trpc.ts                    # tRPC initialization
└── trpc/
    ├── provider.tsx               # client-side tRPC + React Query provider
    ├── query-client.ts            # QueryClient factory (SSR-aware)
    └── server.ts                  # server caller + RSC hydration helpers
```

## Limitations

- Data is stored in memory by design: it resets when the server restarts, and running multiple server instances would each hold their own data.
- Cursor pagination is offset-based, which is enough for a fixed-size in-memory collection.
