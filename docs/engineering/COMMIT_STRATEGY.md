# Branch, Commit, and Pull Request Strategy

## Branches

Use short-lived branches from the agreed base branch:

- `feat/<issue-or-id>-<slug>` — feature.
- `fix/<issue-or-id>-<slug>` — bug fix.
- `docs/<slug>` — documentation-only change.
- `refactor/<slug>` — behavior-preserving refactor.
- `chore/<slug>` — tooling/build/maintenance.

Adapt to the host team's convention if one exists.

## Commits

Use logical, reviewable commits. Conventional Commits are recommended:

`<type>(<optional-scope>): <imperative summary>`

Common types: `feat`, `fix`, `docs`, `test`, `refactor`, `perf`, `build`, `ci`, `chore`, `revert`.

Guidelines:

- A commit should represent one coherent change, not an arbitrary number of files.
- Keep tests with the behavior they verify unless a clear dependency justifies separation.
- Do not split one small change into many ceremonial commits.
- A feature may reasonably contain several commits: contract/schema, implementation, tests, docs, or independently useful slices.
- Keep each commit buildable where practical; avoid commits that knowingly leave the branch broken.
- Review staged diffs before committing.
- Never include unrelated working-tree changes.
- Do not rewrite shared history or force-push without explicit authorization.

## Pull Requests

A PR should describe problem, solution, scope, tests, architecture decisions, data/API changes, security/privacy implications, rollout concerns, and known risks.

Prefer one PR per coherent feature or fix. Keep PRs small enough to review; split large work into independently understandable slices.

## AI-generated changes

The PR author remains accountable for the change regardless of whether code was written by a human or agent. Review for behavior and evidence, not authorship. State which checks ran and do not paste unverified model claims as facts.
