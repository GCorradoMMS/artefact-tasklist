# MVP Scope — Task Manager

## MVP objective

A single-page task manager where the list is server-rendered and then extended by infinite scroll, with full CRUD via tRPC, shared validation, and visible feedback for every operation — running locally with zero external services.

## Capabilities

| ID | Capability | User value | Acceptance criteria | Priority |
|---|---|---|---|---|
| CAP-01 | List tasks (SSR + infinite scroll) | See current tasks instantly and load more as they scroll | Home page HTML contains the first page of tasks; scrolling near the bottom fetches the next page; total shown ("Showing X of Y") | Must |
| CAP-02 | Create task | Record new things to do | `/tasks/new` form creates a task; success feedback shown; blank title blocked client- and server-side; redirects to the list | Must |
| CAP-03 | Edit task | Correct or complete task details | `/tasks/[id]/edit` pre-fills the form from the server; saving shows success feedback; missing id renders 404 | Must |
| CAP-04 | Delete task | Remove obsolete items | Delete button per card in the list; pending state on the row; success/error banner; list refreshes | Must |
| CAP-05 | Validation and error handling | Trustworthy behavior on bad input | API rejects blank/oversized fields with descriptive messages; update/delete of unknown id returns NOT_FOUND; UI surfaces backend errors | Must |
| CAP-06 | Documentation | Easy setup and comprehension | README explains stack, how it works, and how to run; key code decisions commented | Should |

## Non-functional requirements

| Area | Requirement | Measurement/verification |
|---|---|---|
| Security | No secrets or personal data in the repo; user-rendered content is escaped by React (no raw HTML) | Repo audit; code inspection |
| Reliability | Errors from any mutation/query are surfaced, never silent | Code inspection: mutation `onError`, route `error.tsx` |
| Performance | First page server-rendered; subsequent pages fetched on demand (10/page) | Code inspection: `prefetchInfinite`, `PAGE_SIZE` |
| Accessibility | Labels bound to inputs; feedback banners use `role="status"`/`role="alert"` | Code inspection: `task-form.tsx`, `status-message.tsx` |
| Privacy | No data leaves the server except to the user's own browser; all content fictional | Architecture review |
| Operability | Standard npm scripts: `dev`, `build`, `start`, `lint` | `npm run lint`, `npm run build` pass |

## Explicit exclusions

- Database or any persistent storage.
- Authentication, authorization, multi-tenancy.
- Task ordering controls, tags, due dates, search/filter.
- Deployment configuration (Docker, CI/CD, hosting).

## Release acceptance

- [x] All Must capabilities meet acceptance criteria.
- [x] Critical security/privacy risks addressed (no secrets; no personal data; content escaping by default).
- [x] Required checks pass (`npm run lint`, `npm run build`).
- [x] Setup and operational documentation is accurate (README).
- [x] Known limitations are disclosed (in-memory store, single-instance assumption, offset-based cursor).
