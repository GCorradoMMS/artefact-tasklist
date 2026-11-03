# Quality Gates

Apply checks proportionally to change risk. Replace example categories with actual project commands in `PROJECT_GUIDE.md`.

## Gate 1 — Scope and design

- [ ] User/problem and intended behavior are clear when applicable.
- [ ] Acceptance criteria are observable and testable.
- [ ] Scope and non-goals are explicit for non-trivial work.
- [ ] Architecture, data, API, security, and migration impacts are considered.
- [ ] Material assumptions and open questions are recorded.

## Gate 2 — Implementation

- [ ] Change is limited to approved scope.
- [ ] Existing conventions and architecture are respected.
- [ ] Tests cover new behavior and relevant regressions.
- [ ] Validation, errors, authorization, and failure paths are handled.
- [ ] No secrets or sensitive data are committed or logged.
- [ ] Dependencies and configuration changes are justified.

## Gate 3 — Automated verification

Run applicable checks and record exact commands/results:

- [ ] Unit tests.
- [ ] Integration/contract tests.
- [ ] End-to-end tests for critical user flows.
- [ ] Formatter/linter.
- [ ] Static analysis/type checking.
- [ ] Build/package validation.
- [ ] Migration/schema checks.
- [ ] Security/dependency scanning where configured.
- [ ] Performance/load checks for material performance changes.

A skipped check is not a pass. A test suite that did not execute is not evidence.

## Gate 4 — Independent review

- [ ] Code review completed when change is non-trivial.
- [ ] Security review completed when risk warrants it.
- [ ] QA acceptance-criteria coverage reviewed.
- [ ] Documentation checked when behavior/contracts/operations changed.
- [ ] Findings have dispositions and evidence.

## Gate 5 — Delivery readiness

- [ ] Working tree and diff reviewed; unrelated work preserved.
- [ ] Required CI checks passed.
- [ ] API and migration compatibility assessed.
- [ ] Rollout, rollback, or forward-fix approach documented when needed.
- [ ] User-facing and operational documentation updated.
- [ ] Delivery report is complete.
- [ ] Human approval obtained before merge/release.

## Severity definitions

- **Critical:** immediate severe compromise, major data loss, or systemic outage. Stop release.
- **High:** serious exploitable vulnerability, unauthorized data access, significant correctness failure, or high-probability severe regression. Block merge/release.
- **Medium:** material bug, missing control, or meaningful maintainability/reliability concern. Fix or obtain explicit human acceptance.
- **Low:** limited impact, non-blocking defect, or cleanup opportunity. Fix when proportionate or track as debt.
- **Informational:** observation or improvement suggestion without an actionable defect.

## Evidence standard

Reports must distinguish: `Executed and passed`, `Executed and failed`, `Not run`, `Blocked`, and `Not applicable`. Include command, environment, and concise output/result. Never convert a recommendation into a test result.
