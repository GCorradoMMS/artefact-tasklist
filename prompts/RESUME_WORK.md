# Prompt: Resume an Existing Task

Resume [TASK/FEATURE/MILESTONE] from the actual current state.

1. Inspect repository state, branch, working tree, recent commits, active plans, and any task/session notes.
2. Inspect the actual files and outputs before assuming a previous agent completed work. Distinguish completed, partial, failed, and unverified steps.
3. Identify the last confirmed gate and the next outstanding action.
4. Preserve all existing and unrelated changes. Do not repeat completed work without reason.
5. Continue the documented workflow from the current state. Use small commands and batches for validations.
6. Run missing checks, complete relevant reviews, and resolve confirmed findings.
7. Report exact current state, actions performed, commands/results, unresolved risks, and next step.

Do not commit, push, merge, deploy, or discard changes unless explicitly authorized.
