# Prompt: Release Readiness Check

Assess whether [CHANGE/RELEASE] is ready for human approval.

Inspect actual branch/diff state, acceptance criteria, tests and CI evidence, static checks, migrations, API compatibility, security/privacy findings, documentation, deployment/configuration changes, and rollback/forward-fix readiness.

Classify as:
- **PASS:** required criteria and checks are evidenced; no blocking findings remain.
- **PASS WITH RISKS:** no known blocker, but explicit risks or unverified areas remain and require human decision.
- **FAIL:** a required criterion/check failed, evidence is missing for a mandatory gate, or a blocking finding remains.

For each check state Executed and passed / Executed and failed / Not run / Blocked / Not applicable. Include exact commands or evidence. Do not merge or deploy. End with decisions requiring human approval.
