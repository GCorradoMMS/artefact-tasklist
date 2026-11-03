# Prompt: Start a Feature

Act as the Engineering Coordinator. Deliver the feature below using the project's documented AI workflow.

**Feature request:** [DESCRIBE_REQUEST]
**Issue/reference:** [OPTIONAL]
**Risk hints:** [SECURITY / DATA / API / MIGRATION / PERFORMANCE / NONE KNOWN]

1. Inspect Git status, current branch, project guide, product scope, relevant ADRs, existing code, and active plans. Preserve unrelated changes.
2. Classify the task as Fast, Standard, or High-risk. Explain why.
3. For product behavior changes, ask Product Owner role for a feature brief and testable acceptance criteria. For trivial fixes, use the human request as sufficient intent and do not create needless paperwork.
4. For non-trivial/cross-cutting work, ask Architect role for a bounded technical plan, alternatives, risks, and test strategy. Create/update ADR only for consequential decisions.
5. Present material ambiguity, data/API/security impact, and scope changes to the human before implementation.
6. Assign one Implementer as the editor in the shared working tree. Break work into small, verifiable vertical slices.
7. Require tests and execute relevant checks. Record exact commands and results.
8. Dispatch independent read-only reviews appropriate to risk. Code and QA review are usually useful for non-trivial changes; security review is required when trust, identity, authorization, sensitive data, external input, or cryptography is involved.
9. Verify and triage findings. Fix confirmed issues, document rejected findings, and re-review affected areas.
10. Have Documentation Reviewer check affected docs/contracts/diagrams/runbooks.
11. Produce a delivery report and proposed commit sequence.

Do not let agents silently expand scope. Do not fabricate validation. Do not commit, push, merge, deploy, or perform destructive operations without explicit human approval.
