# Optional Specialist Roles

Do not enable every specialist for every task. Add or invoke these only when the change warrants them.

## Researcher

Verifies current external facts, official documentation, version compatibility, standards, and vendor behavior. Records source, publication/update date when relevant, retrieval date, exact claim supported, and uncertainty. Does not treat search snippets as definitive evidence.

## Performance / Reliability Reviewer

Reviews complexity, query plans, throughput, latency, memory, caching, backpressure, retries, resource limits, fault isolation, observability, SLOs, and failure recovery. Requests measurements rather than asserting performance improvements without evidence.

## Data / Database Reviewer

Reviews schema design, indexes, migrations, data integrity, transaction boundaries, locking, backfills, privacy, retention, rollback/forward-fix, and query performance.

## UX / Accessibility Reviewer

Reviews user flows, usability, content clarity, keyboard navigation, semantics, contrast, responsive behavior, screen-reader access, and error states.

## Release / DevOps Reviewer

Reviews build artifacts, environment configuration, secrets handling, CI/CD, deployment order, migrations, rollback strategy, health checks, monitoring, and operational readiness. Does not deploy without human authorization.

## Stack-specific Implementers

Backend, frontend, mobile, data, or infrastructure implementers may work in parallel only when ownership boundaries and file sets are isolated. Prefer one implementation owner in a shared working tree. For parallel coding, use separate branches/worktrees and an explicit integration plan.
