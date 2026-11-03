# AI-Assisted Engineering Workflow

## 1. Operating principles

1. **Human owns intent and accountability.** Humans set product direction, approve architecture with significant consequences, accept risk, and authorize merge/release.
2. **Repository is durable context.** Decisions, requirements, architecture, plans, and operational knowledge belong in versioned project documents—not only in chat history.
3. **Small, bounded tasks.** Break broad goals into vertical slices with observable acceptance criteria.
4. **Verification is part of implementation.** Tests, static analysis, builds, security checks, and manual validation are planned before code is written.
5. **Specialize where it helps.** Use multiple agents when the work has independent concerns or needs independent review. Avoid multi-agent ceremony for tiny tasks.
6. **Least privilege.** Agents receive only the tools and permissions necessary for their role.
7. **Evidence over confidence.** Reports distinguish executed checks, inferred conclusions, assumptions, and unverified items.
8. **One editor per shared workspace.** Parallel analysis is usually safe; concurrent edits to the same working tree are not.
9. **No silent scope changes.** New requirements go through human approval or a documented change in scope.

## 2. Project creation workflow

### Phase A — Repository reconnaissance

- Inspect the repository, branch, working tree, existing files, and remote configuration.
- Identify existing product, architecture, security, and engineering constraints.
- Preserve unrelated changes. Do not assume an empty repository.
- Identify missing facts and required research.

### Phase B — Product discovery

Product Owner prepares `project-brief.md` and initial `mvp-scope.md`:

- Problem, users, current alternatives, desired outcomes.
- Core user journeys and proposed capabilities.
- Acceptance criteria and measurable success signals.
- Explicit non-goals, assumptions, risks, and dependencies.

Human reviews product direction before expensive implementation.

### Phase C — Technical discovery and architecture

Architect and Researcher (when needed):

- Compare feasible architectural options and stack compatibility.
- Identify trust boundaries, data ownership, integrations, operational concerns, and non-functional requirements.
- Create system-design documentation and ADRs for consequential decisions.
- Record verified facts, proposals, and open questions separately.
- Break the roadmap into incremental, testable milestones.

Human approves consequential choices: data model, identity/security model, public API, infrastructure, vendor lock-in, cost, privacy, and irreversible migrations.

### Phase D — Delivery foundation

Build only the foundation required by the MVP:

- Reproducible local development environment.
- Formatting, lint, type/static analysis, and baseline tests.
- CI pipeline and build process.
- Configuration and secret-handling conventions.
- Minimal observability and health checks appropriate to the project.
- Contribution, branch, and pull-request conventions.

Avoid adding infrastructure merely because it appears in a technology checklist.

### Phase E — Incremental feature delivery

Use the feature workflow in section 3 for each vertical slice. Keep a plan for larger work in `docs/plans/active/` and move completed plans to `docs/plans/completed/`.

## 3. Feature workflow

1. **Intake:** Coordinator classifies the task by size, risk, and uncertainty.
2. **Product definition:** For user-facing or behavior-changing work, PO writes a feature brief and testable acceptance criteria. Skip formal PO work for trivial refactors or obvious small fixes.
3. **Technical plan:** Architect reviews the current code and proposes a bounded implementation plan when the change is non-trivial, cross-cutting, or risky.
4. **Decision gate:** Human approves scope and material trade-offs. ADRs record consequential decisions.
5. **Implementation:** One Implementer owns code changes in the shared working tree. Work in small steps and add tests.
6. **Local verification:** Run relevant tests, formatters, linters, type/static analysis, and builds. Report exact commands/results.
7. **Independent review:** Dispatch reviewers according to risk. Code, QA, and security reviews may run in parallel because they inspect independently.
8. **Triage:** Coordinator verifies findings against code and evidence. Confirmed issues go to the Implementer. Speculative findings are not automatically fixed; they are investigated or recorded.
9. **Re-review:** Review affected areas after fixes. Re-run relevant checks.
10. **Documentation review:** Check docs, contracts, diagrams, configuration, and runbooks affected by the change.
11. **CI and delivery report:** Confirm CI evidence, summarize the diff, tests, review dispositions, risks, and proposed commits.
12. **Human approval:** Human approves the PR, merge, release, and any production operation.

## 4. Risk-based workflow modes

### Fast path — small, low-risk task

Examples: typo, isolated documentation correction, straightforward local bug with a clear regression test.

Use one agent or implementer, run focused checks, inspect the diff, and report. Formal PO and architecture phases are unnecessary.

### Standard path — normal feature

Examples: new endpoint, UI flow, business rule, non-trivial refactor, database-backed feature.

Use PO (if behavior changes), Architect, Implementer, Code Reviewer, QA Reviewer, Documentation Reviewer as relevant. Add Security Reviewer when user data, authorization, external input, credentials, or sensitive flows are involved.

### High-risk path — security, data, infrastructure, or architectural change

Examples: auth/permissions, payments, sensitive data, cryptography, migrations/backfills, public API breaking change, deployment architecture, multi-tenant isolation.

Require explicit threat/risk analysis, architecture decision, security review, QA/failure testing, rollback/forward-fix plan, independent validation, and human approval before merge or release. Add database, reliability, UX, or release specialists as relevant.

## 5. Handoff contracts

Every role handoff must include enough context to work independently:

- Task and desired outcome.
- Relevant product/technical documents.
- Current repository/branch/diff state.
- Constraints and decisions already made.
- Expected output format.
- Files or areas in scope and out of scope.
- Checks already run and their real results.

Do not assume subagents share conversation history. Pass a concise, self-contained brief or point to durable files.

## 6. Review and finding lifecycle

- Reviewers are read-only by default.
- Findings include severity, location, evidence, scenario, impact, remediation, and test suggestion.
- Coordinator verifies each finding; no majority vote substitutes for technical investigation.
- Confirmed Critical/High findings block completion. Medium findings normally require a fix or explicit human acceptance. Low findings may be fixed or entered as debt.
- Rejected findings must have a reason and evidence.
- Re-review fixes that affect the original concern.

## 7. Completion report

Every standard/high-risk task ends with:

- Summary and scope.
- Changed files/components.
- Acceptance criteria status.
- Tests/checks run with exact commands and outcomes.
- Review findings and disposition.
- Migration/API/security/operational implications.
- Known limitations and unverified areas.
- Documentation updates.
- Proposed commit sequence.
- Next recommended task.

## 8. Orchestration model

Default to a **coordinator-led, hub-and-spoke workflow**: the human speaks primarily to the Coordinator; the Coordinator delegates focused work to specialists and consolidates outputs. This can be implemented through subagents, separate sessions, task queues, or manual prompting. The architecture is harness-independent.

Do not introduce a dedicated multi-agent framework for development orchestration unless it solves a demonstrated coordination problem. The coding harness may already provide delegation, tool use, approvals, and context management.
