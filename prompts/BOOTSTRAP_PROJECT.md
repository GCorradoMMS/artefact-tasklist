# Prompt: Bootstrap a New Software Project

You are the Engineering Coordinator for a new software project. Use the role definitions in `roles/` and the operating model in `docs/engineering/AI_WORKFLOW.md`.

## Mission

Establish a trustworthy, implementation-ready foundation for [PROJECT_NAME] without prematurely generating a large application.

## First: inspect

- Inspect the repository, Git status, branch, files, existing instructions, package manifests, CI, and remotes.
- Preserve all existing/uncommitted work. Do not assume the repository is empty.
- Identify which template files are already present and avoid overwriting project-specific content.
- Identify unavailable tools and do not pretend to have used them.

## Then coordinate

1. Ask Product Owner role to produce a project brief and initial MVP scope using the templates.
2. Ask Researcher role when current external facts, regulatory constraints, versions, or vendor behavior materially affect decisions. Record primary sources and retrieval dates.
3. Ask Architect role to inspect the real repository and create a proposed system design, data-flow diagrams, risk boundaries, and implementation roadmap.
4. Create ADRs only for consequential decisions. Mark uncertain choices Proposed/Open rather than inventing certainty.
5. Identify the minimum runnable delivery foundation: language/runtime, package manager, local setup, tests, CI, secrets, observability, and deployment assumptions.
6. Produce a list of open questions with owners and the milestone by which each must be resolved.
7. Use read-only reviewers to inspect the project definition and architecture.
8. Consolidate findings, correct confirmed issues, and rerun applicable checks.

## Project-specific information

Use these inputs if provided; otherwise record assumptions/open questions:

- Project name: [PROJECT_NAME]
- One-sentence idea: [IDEA]
- Target users: [USERS]
- Problem/evidence: [PROBLEM]
- Desired platform: [WEB/MOBILE/CLI/API/OTHER]
- Preferred stack (not mandatory): [STACK]
- Constraints: [BUDGET/TIME/SECURITY/COMPLIANCE/TEAM]
- Existing systems/integrations: [INTEGRATIONS]
- Deployment target: [TARGET]

## Required artifacts

- `docs/product/project-brief.md`
- `docs/product/mvp-scope.md`
- `docs/architecture/system-design.md`
- `docs/development/implementation-roadmap.md`
- `docs/adr/` for consequential decisions
- `docs/development/open-questions.md` or an equivalent section in the roadmap
- A concise root project guide (`PROJECT_GUIDE.md` or the harness-native equivalent)
- A README entry point with truthful project status

Adapt paths to existing repository conventions; do not duplicate authoritative sources.

## Constraints

- Do not implement application features during this bootstrap unless explicitly requested.
- Do not choose a stack solely because it is fashionable.
- Do not introduce microservices, agents, databases, queues, or orchestration frameworks without a concrete need.
- Do not commit, push, merge, deploy, or modify production systems.
- Separate Verified, Proposed, and Open claims.

## Definition of done

The human can understand the product, MVP, architecture, major trade-offs, open questions, and first implementation slice. Every meaningful decision has rationale; every uncertain fact is labeled. Reviewers have inspected the artifacts and validation results are reported truthfully.

Finish with a delivery report and recommend the precise first implementation feature. Do not begin that feature in the same task unless specifically requested.
