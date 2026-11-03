# ADR-0005: Keyset cursor pagination for the infinite list

- **Status:** Accepted (revised 2026-11-03: originally offset-based, changed after independent code review)
- **Date:** 2026-11-03
- **Decision owners:** Project owner
- **Related:** `src/server/store.ts`, `src/lib/task-schemas.ts`, `src/components/task-list.tsx`, `docs/architecture/system-design.md`

## Context

The list loads incrementally (infinite scroll) and needs a pagination contract. The data source is an in-memory array sorted newest-first (id descending as tiebreak), and tasks can be created or deleted while the user scrolls.

## Decision drivers

- Pages must stay correct when the collection changes between page fetches (no duplicated or skipped rows).
- Simple, correct termination signal for the client.
- Bounded, validated inputs (`limit` ≤ 50, cursor shape validated).

## Options considered

### Option A — Offset cursor (initial implementation)
- Benefits: trivial slicing and termination.
- Costs/risks: unstable under mutation — a create/delete between page fetches shifts every later offset, duplicating or skipping rows in already-scrolled lists (confirmed as a real defect by code review).

### Option B — Keyset cursor (selected)
- Benefits: the cursor is the sort key of the previous page's last item (`createdAt` in epoch millis + `id`); every page returns only items strictly older than it, so inserts/deletes between fetches cannot shift page boundaries. A deleted cursor item degrades gracefully (its key simply excludes everything up to that sort position).
- Costs/risks: slightly more store logic (key comparison with tiebreak).

## Decision

`taskStore.list` pages by keyset: it sorts a copy newest-first (id desc tiebreak), keeps only items strictly older than the cursor's sort key, slices `limit` items, and returns `nextCursor` as the sort key of the page's last item — `null` exactly when no older items remain. The client feeds `nextCursor` back unchanged and stops on `null`. Every mutation still invalidates the list query to refresh already-loaded pages.

## Consequences

### Positive
- Scrolled lists remain correct under concurrent creates/deletes (verified at runtime: a task created between two page fetches does not appear in the next page).
- Cursor values are plain JSON (epoch millis + string id) — no transformer edge cases over the wire.

### Negative / trade-offs
- Key comparison logic in the store (one small private method).

### Neutral / operational
- Mutations still refetch loaded pages to reflect totals and removals.

## Security and privacy implications

Cursor fields are individually validated server-side (non-negative integer timestamp, non-empty id); no data exposure concerns.

## Validation and revisit criteria

Regression evidence: `task.list` with a page's last-item key returns only strictly older tasks; creating a task between fetches never injects it into a subsequent page; a numeric (old-format) cursor is rejected with `BAD_REQUEST`. Revisit only if ordering requirements change (e.g. user-configurable sort), keeping the same keyset principle.
