# Prompt: Prepare a Commit Plan

Inspect the actual working-tree diff and index. Do not alter files or execute Git write operations.

Propose a small sequence of logical commits using the project's commit convention. For each commit provide a message, files/change group, rationale, dependencies, and checks relevant to that slice.

Do not split changes arbitrarily. Keep tests with the behavior they verify unless there is a clear reason to separate them. Identify unrelated changes and exclude them from the proposed feature commits. Warn if a clean sequence cannot be produced without preserving or isolating unrelated user work.
