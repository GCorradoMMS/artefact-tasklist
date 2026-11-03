# System Design — Task Manager

- **Status:** Current
- **Date:** 2026-11-03
- **Scope truth:** Verified against the working tree; future proposals are marked as such.

## 1. Overview

A single-user task manager built with Next.js 15 (App Router), tRPC v11, TanStack Query v5, Zod v4, superjson, and Tailwind v4. Persistence is intentionally out of scope: tasks live in an in-memory store whose lifetime equals the server process lifetime. There is no auth, no database, and no CI pipeline.

The defining property of the design is **end-to-end type safety through one router**: the same `AppRouter` type serves (a) direct in-process calls from React Server Components via a tRPC caller, and (b) HTTP calls from client components via the `/api/trpc` route handler.

## 2. Component boundaries

```
┌────────────────────────── Browser ──────────────────────────┐
│  Client layer ("use client")                                │
│   src/trpc/provider.tsx      Providers: tRPC client +       │
│                              QueryClient (httpBatchLink,    │
│                              superjson)                     │
│   src/components/task-list.tsx   list + infinite scroll     │
│                              + delete                       │
│   src/components/task-form.tsx   create/edit form           │
│   src/components/status-message.tsx  feedback banner        │
└───────────────┬─────────────────────────────────────────────┘
                │ HTTP (superjson)          hydration payload
                ▼                                ▲
┌────────────────────────── Next.js server ───────────────────┐
│  HTTP adapter                                               │
│   src/app/api/trpc/[trpc]/route.ts                          │
│     fetchRequestHandler → appRouter (GET + POST)            │
│                                                             │
│  RSC layer                                                  │
│   src/trpc/server.ts ("server-only")                        │
│     caller  = createCallerFactory(appRouter)(ctx)           │
│     trpc    = prefetch helpers, HydrateClient               │
│     getQueryClient = cache(makeQueryClient)  (per request)  │
│   src/trpc/query-client.ts  shared QueryClient factory      │
│   src/app/page.tsx, src/app/tasks/[id]/edit/page.tsx        │
│                                                             │
│  API layer                                                  │
│   src/server/root.ts        appRouter = { task: taskRouter }│
│   src/server/routers/task.ts  list/byId/create/update/delete│
│   src/server/trpc.ts        initTRPC, superjson, empty ctx  │
│                                                             │
│  Data layer                                                 │
│   src/server/store.ts       TaskStore, globalThis singleton │
└─────────────────────────────────────────────────────────────┘
┌──────────────── Shared contract (imported by all) ──────────┐
│  src/lib/types.ts        Task, TaskPage                     │
│  src/lib/task-schemas.ts Zod: create/update/list schemas    │
│  src/lib/constants.ts    PAGE_SIZE = 10                     │
│  src/lib/format-date.ts  UTC/en-US date formatting          │
└─────────────────────────────────────────────────────────────┘
```

Boundary rules (verified in code):

- `src/trpc/server.ts` starts with `import "server-only"`, so it cannot leak into the client bundle. The client imports only the **type** `AppRouter` from `src/server/root.ts`.
- The client never calls the store directly; every mutation crosses the Zod-validated tRPC boundary.
- `src/lib/*` has no framework imports and is safe on both sides.

## 3. Data flows

### 3.1 SSR first render (`GET /`)

```
Browser GET /
 └─ src/app/page.tsx  (export const dynamic = "force-dynamic")
     ├─ void trpc.task.list.prefetchInfinite({ limit: PAGE_SIZE })
     │    └─ caller (in-process function call, no HTTP)
     │        └─ taskRouter.list → taskStore.list({cursor, limit})
     │            └─ sorts a copy by createdAt desc, slices, returns
     │               { items, nextCursor, total }
     ├─ result stored in the per-request QueryClient (React cache())
     └─ HTML streamed with <HydrateClient> payload
         (dehydrate includes still-pending queries)
Browser hydrates
 └─ Providers mounts QueryClient (useState(makeQueryClient))
     └─ HydrateClient replays the query into the client cache
         └─ TaskList useSuspenseInfiniteQuery({limit}) resolves from
            hydrated cache → first paint has data, no client fetch on
            mount (staleTime 30s keeps it fresh)
```

Invariant: the client hook input must exactly match the prefetch input (`{ limit: PAGE_SIZE }`) or the hydrated cache is missed and a second request fires.

### 3.2 Infinite scroll

```
TaskList (src/components/task-list.tsx)
 └─ IntersectionObserver on a sentinel div, rootMargin 240px
     └─ hasNextPage && !isFetchingNextPage → fetchNextPage()
         └─ httpBatchLink → /api/trpc/task.list  { cursor, limit }
             └─ route.ts fetchRequestHandler → taskRouter.list
                 └─ taskStore.list → tasks strictly older than the
                    cursor's sort key; nextCursor = sort key of this
                    page's last item (null on the last page)
 └─ TanStack appends the page; UI renders data.pages.flatMap(p => p.items)
 └─ nextCursor === null → "End of the list." (sentinel unrendered)
```

The server caps `limit` at 50 (`src/lib/task-schemas.ts`). The keyset cursor keeps pages stable when tasks are created or deleted between page fetches (see ADR-0005).

### 3.3 Create mutation

```
/tasks/new → TaskForm mode="create"
submit
 ├─ createTaskSchema.safeParse locally (src/components/task-form.tsx)
 │    └─ fail → field errors (title/description), no request sent
 └─ pass → trpc.task.create.useMutation
     └─ HTTP → Zod parses again on the server (BAD_REQUEST if invalid)
         └─ taskStore.create → { id: randomUUID(), title,
             description: description || null, createdAt: new Date() }
 onSuccess (client)
  ├─ success banner
  ├─ await utils.task.list.invalidate()   ← refetches all loaded pages
  └─ setTimeout 800ms → router.push("/")
```

### 3.4 Edit flow

```
/tasks/[id]/edit (async RSC)
 └─ const { id } = await params
 └─ const task = await api.task.byId({ id }) → notFound() on NOT_FOUND
     └─ direct caller → taskStore.get(id)
         └─ missing → TRPCError NOT_FOUND → Next 404 page
 └─ <TaskForm mode="edit" task={task} />
submit
 └─ updateTaskSchema parse → trpc.task.update({ id, ...data })
     └─ server: taskStore.update → NOT_FOUND if missing
 onSuccess: banner + list invalidation; the user stays on the page
 (create navigates back to the list, edit does not — intentional)
```

### 3.5 Delete flow

```
TaskList row → deleteTask.mutate({ id })  (button disabled while pending;
 row shows "Deleting…" via deleteTask.variables.id)
 └─ HTTP → taskStore.delete → NOT_FOUND if missing
 onSuccess: banner + list invalidation
 onError: error.message banner (error banners persist; success
 auto-dismisses after 4s)
```

## 4. Key invariants

1. **Dual validation, server is authoritative.** The same Zod schemas (`src/lib/task-schemas.ts`) run in the form for UX and in the router as the trust boundary. The server parse must never be removed or bypassed.
2. **One empty-value shape.** `Task.description` is `string | null`; the store normalizes `"" → null`. New write paths must preserve this.
3. **Dates are `Date` end-to-end and rendered deterministically.** superjson is attached at the router (`server/trpc.ts`) **and** mirrored on the client link (`provider.tsx`); both must stay in sync or `createdAt` breaks over the wire. All display formatting goes through `formatDateTime` (UTC, `en-US`) so SSR markup equals client markup — do not format dates with locale-dependent methods in components.
4. **First page must exist at SSR.** `src/app/page.tsx` is `force-dynamic`; if the page ever becomes statically prerendered, the list freezes at build time because the store is mutable and process-local.
5. **One store instance per server process.** `taskStore` is cached on `globalThis` so Next.js's per-route server bundles and dev hot reloads share one array. Do not instantiate `TaskStore` anywhere else.
6. **Ordering and pagination contract.** `list` returns newest-first by `createdAt` desc (id descending as tiebreak); `nextCursor` is the **sort key** (`createdAt` ms + `id`) of the page's last item and is `null` exactly on the last page; clients stop on `null`. Keyset pagination keeps pages stable under concurrent mutations (ADR-0005).
7. **Suspense-based loading.** The list uses `useSuspenseInfiniteQuery`; `data` is always defined in `TaskList`. Loading is owned by `<Suspense>` in `page.tsx`, errors by `src/app/error.tsx`.

## 5. Known risks and mitigations

Mitigations marked *proposed* are not implemented.

| # | Risk | Impact | Mitigation |
|---|------|--------|------------|
| R1 | In-memory store: data lost on restart; diverges across server instances; unbounded growth | Data loss, multi-instance inconsistency | Accepted for MVP by design. *Proposed:* when persistence is added, `TaskStore` is the single swap point — keep its interface stable. |
| R2 | ~~Offset cursor is unstable under concurrent mutations~~ **Fixed:** keyset cursors adopted (ADR-0005) — the cursor is the sort key of the page's last item, so inserts/deletes between page fetches can no longer duplicate or skip rows | — | Verified at runtime: a task created between two page fetches does not appear in the next page. |
| R3 | Every mutation invalidates `task.list`, refetching all loaded pages of the infinite query | Cost grows with scroll depth | Fine at the current scale. *Proposed:* optimistic updates instead of full invalidation. |
| R4 | Edit page converts backend errors to 404; only `NOT_FOUND` should map to 404 (fixed — see ADR-0001 validation) | Real server faults look like missing tasks | Fixed: only `TRPCError` with code `NOT_FOUND` triggers `notFound()`; other errors propagate to the route error boundary. |
| R5 | No auth/authorization: all procedures are public, context is empty | Any caller can mutate all data | Accepted for MVP. *Proposed:* `protectedProcedure` middleware in `server/trpc.ts` is the designed extension point when auth arrives. |
| R6 | superjson transformer configured in two places (server init + client link); drift silently corrupts `Date` fields | Runtime serialization bugs | Documented invariant #3. *Proposed:* a test asserting a `Date` round-trips through the HTTP adapter. |
| R7 | No tests, no CI | Regressions undetected | Flagged in the roadmap as the top follow-up. |
