# Quickstart: use this workflow in a new project

This guide explains how to apply the AI-Assisted Engineering template to a new repository. It is intentionally independent of any coding-agent harness, model provider, or agent framework.

The template defines **responsibilities and workflow behavior**. Your chosen harness determines how those responsibilities are represented as agents, subagents, commands, skills, rules, or reusable prompts.

## 1. Create or prepare the repository

1. Create the project repository, or open the existing repository you intend to use.
2. Start from the repository root.
3. Inspect the current Git state before copying anything:

   ```bash
   git status --short
   git branch --show-current
   ```

4. Preserve existing files and uncommitted changes. Do not overwrite an existing `README`, project guide, agent instructions, or harness configuration without reviewing and merging them.
5. Copy the template contents into the repository root. If the repository already has a documentation or agent-instruction convention, adapt the paths rather than creating competing sources of truth.

A typical result looks like this:

```text
my-project/
├── PROJECT_GUIDE.md
├── QUICKSTART.md
├── roles/
├── prompts/
├── docs/
│   ├── engineering/
│   └── templates/
└── ...existing project files...
```

## 2. Tell your coding agent how to use the template

Open your chosen coding agent at the repository root. Send the following setup instruction to its primary agent/coordinator. It works as a starting prompt for different harnesses; adapt only the mechanics of agent invocation to what the harness actually supports.

```text
You are the Engineering Coordinator for this repository.

Before doing any work, read:
- PROJECT_GUIDE.md
- docs/engineering/AI_WORKFLOW.md
- docs/engineering/QUALITY_GATES.md
- docs/engineering/PERMISSIONS_AND_TOOLS.md
- docs/engineering/COMMIT_STRATEGY.md
- all relevant role definitions in roles/

Inspect the actual repository, Git status, existing instructions, manifests,
CI configuration, and available tools. Preserve all existing work. Do not
assume the repository is empty and do not overwrite project-specific files.

Configure this repository's AI-assisted development workflow using the
capabilities of the current harness. Map the responsibilities in roles/ to
native agents, subagents, reusable instructions, or prompts as appropriate.
Do not assume a feature or capability exists in the harness unless verified.
If native delegation is unavailable, explain the limitation and use a
sequential role-based workflow with explicit handoffs.

Keep the workflow harness-agnostic at the documentation and role level.
Harness-specific configuration may be added separately and must not replace
the canonical role definitions or project guide.

Use least-privilege permissions:
- Coordinator: inspect, plan, delegate, and consolidate.
- Product Owner and Architect: read and produce planning artifacts, not
  application code.
- Implementer: edit only within the approved task scope.
- Reviewers: read-only by default.
- Git commit, push, merge, deploy, destructive operations, and production
  changes require explicit human authorization.

Do not install extra tools, MCP servers, dependencies, or frameworks merely
because they are mentioned in examples. Recommend them only when a concrete
project need exists, and explain the required permissions and risks.

Do not implement product features yet. First report:
1. Which template files were found and read.
2. Which agent roles can be represented natively by this harness.
3. Which roles require sequential/manual invocation.
4. Which permissions and tool boundaries are actually enforceable.
5. Any conflicts with existing repository instructions.
6. The minimal changes needed to make this workflow usable here.
7. The exact next action for project discovery.

Do not claim agents, tools, or permissions are configured until verified.
Do not commit, push, merge, or deploy.
```

## 3. Fill in the project brief

Before asking for implementation, provide the coordinator with the project context. Use `docs/templates/PROJECT_BRIEF.md` as the source template.

At minimum, clarify:

- **Project name:** the working name of the product or system.
- **Idea:** a one- or two-sentence description.
- **Problem:** who has the problem and why it matters.
- **Users:** primary users and relevant stakeholders.
- **Platform:** web app, mobile app, API, CLI, library, internal tool, or another form.
- **Preferred stack:** technologies you prefer, while allowing the architect to challenge them.
- **Constraints:** budget, deadline, skills, hosting, security, compliance, and operational limits.
- **Integrations:** external services, APIs, data sources, and existing systems.
- **Success:** what observable outcome would make the project useful.

Do not invent answers to unknowns. Ask the Product Owner to mark them as assumptions or open questions.

## 4. Run project discovery and architecture

Use `prompts/BOOTSTRAP_PROJECT.md` with the coordinator. The coordinator should:

1. Inspect the repository and preserve existing work.
2. Ask the Product Owner to define the problem, users, project brief, MVP, and acceptance criteria.
3. Use a Researcher role when current external facts, technical versions, regulations, vendor behavior, or product comparisons materially affect decisions. Verify primary sources and record dates.
4. Ask the Architect to evaluate the stack, propose system boundaries, identify risks, and create an implementation roadmap.
5. Create ADRs for consequential decisions only. Mark unresolved choices as Proposed or Open.
6. Define the smallest useful, runnable first delivery slice.
7. Ask relevant read-only reviewers to challenge the brief and architecture.
8. Resolve confirmed findings and rerun applicable checks.

### Expected discovery artifacts

Adapt paths to the existing repository, but establish one authoritative home for each:

- `docs/product/project-brief.md`
- `docs/product/mvp-scope.md`
- `docs/architecture/system-design.md`
- `docs/development/implementation-roadmap.md`
- `docs/development/open-questions.md` or an equivalent roadmap section
- `docs/adr/` for consequential architecture decisions
- A concise root project guide with verified stack and quality commands
- A README that accurately describes the current project status

Do not scaffold a large application during discovery. The output of discovery is an approved direction and a concrete first implementation task.

## 5. Approve the foundation, then start the first feature

Review the discovery delivery report yourself. Confirm that:

- The problem and target users are understandable.
- MVP scope and explicit non-goals are clear.
- The proposed architecture is appropriate for the actual constraints.
- Important trade-offs and open questions are visible.
- The first implementation slice is small, testable, and valuable.

Only after that approval, use `prompts/START_FEATURE.md` for the first implementation feature. The usual first slice establishes a reproducible development foundation: runtime, package management, local setup, a minimal working path, automated checks, and CI where appropriate.

Do not assume every project needs Docker, a database, queues, microservices, or cloud infrastructure. Let the project's needs and deployment model determine the foundation.

## 6. Repeat the feature workflow

For every new feature or meaningful change:

1. Describe the user or system outcome and invoke the feature workflow.
2. Product Owner clarifies acceptance criteria when the scope or expected behavior is ambiguous.
3. Architect plans the change when it crosses boundaries, introduces dependencies, affects data, or has meaningful risk.
4. Implementer makes the smallest coherent change and adds/updates tests.
5. Independent reviewers inspect the diff based on risk.
6. The implementer addresses confirmed findings.
7. Run deterministic checks and inspect their real output.
8. Update relevant documentation and ADRs.
9. Produce a delivery report and proposed commit sequence.
10. You approve commits, PR merge, release, and deployment.

Use `prompts/RESUME_WORK.md` when continuing interrupted work, `prompts/REVIEW_CHANGES.md` for a review-only pass, `prompts/RELEASE_CHECK.md` for release readiness, and `prompts/COMMIT_PLAN.md` to propose logical commits.

## 7. Choose the right workflow depth

Do not involve every role in every change.

| Workflow | Use when | Typical participants |
|---|---|---|
| **Fast path** | Small, isolated, low-risk fix, wording change, or straightforward refactor | Coordinator/Implementer, relevant tests, one focused reviewer if needed |
| **Standard** | Normal feature or behavior change | Product Owner as needed, Architect as needed, Implementer, QA or Code Reviewer, Documentation Reviewer when docs/contracts change |
| **High-risk** | Authentication, authorization, sensitive data, cryptography, payments, migrations, infrastructure, concurrency, or major architectural changes | Product Owner, Architect, Implementer, Security Reviewer, QA, Code Reviewer, plus relevant specialist |

The coordinator should explain why a role was included or skipped for non-trivial work. A role may be performed by the same model in a separate review pass for low-risk work, but high-risk reviews should be independent where possible. Never treat multiple model opinions as a substitute for executable tests or human risk acceptance.

## 8. Git, commits, and human approval

- Use a branch for a feature or coherent change when the repository workflow supports it.
- Keep commits small and logically grouped; do not force one commit per file or agent.
- Use the convention documented in `docs/engineering/COMMIT_STRATEGY.md`.
- Ask for a commit plan after implementation and review, not before the diff exists.
- Inspect staged changes before committing.
- Do not use broad staging such as `git add .` when unrelated changes may exist.
- Never create commits, push, merge, deploy, force-push, or discard user changes without explicit authorization for the current task.

## 9. MCPs and external tools are optional

MCP servers, browser automation, issue trackers, code-hosting integrations, and documentation search are capabilities—not mandatory setup steps.

Add a tool only when it improves a real workflow. Before enabling it:

1. Confirm what the server can access and modify.
2. Apply least-privilege permissions and read-only mode where possible.
3. Decide which roles need the tool.
4. Test a harmless read operation.
5. Record setup and security implications in the project guide if it becomes a durable dependency.

A connected MCP server does not mean every subagent can use it. Verify tool availability and permissions for the specific agent/harness.

## 10. What a completed task must report

Every non-trivial task should end with a delivery report containing:

- Requested outcome and acceptance criteria.
- Files and components changed.
- Important design decisions and trade-offs.
- Tests and checks actually executed, with results.
- Reviews performed and confirmed findings.
- Known limitations and unverified areas.
- Documentation/ADR updates.
- Proposed commit sequence.
- The next useful action.

A task is not complete merely because code was generated or an agent says it is done. Completion requires evidence appropriate to the risk of the change.
