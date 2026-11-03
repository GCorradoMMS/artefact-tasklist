# Prompt: Review Current Changes

Perform an independent, read-only review of [BRANCH/PR/DIFF]. Inspect the diff and relevant surrounding code, tests, and project rules.

Use the following lenses as appropriate: correctness/maintainability, security/privacy, QA/acceptance criteria, data/API compatibility, performance/reliability, documentation/operations.

For each finding include severity, location, evidence, failure or attack scenario, impact, remediation, and regression test. Separate Confirmed from Likely and Needs Verification. Do not modify files. Do not report style preferences as defects unless project rules or material maintainability are affected.

Also report what you did not inspect and which checks were not run. Do not claim a complete security audit from a source review.
