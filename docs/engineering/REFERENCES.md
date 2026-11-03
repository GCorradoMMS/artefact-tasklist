# References and Research Basis

This template is informed by the following published material. The sources describe practices and examples, not a universal mandatory workflow. Re-check current documentation before adopting tool-specific configuration.

1. **OpenAI — Harness engineering: leveraging Codex in an agent-first world** (11 Feb 2026). Describes repository knowledge as a structured system of record, concise agent instructions as an index, explicit plans, feedback loops, and humans steering while agents execute. https://openai.com/index/harness-engineering/
2. **OpenAI — A practical guide to building agents** (15 Jan 2026). Recommends clear instructions, bounded tools and guardrails; notes that one agent may be sufficient and multi-agent decomposition adds overhead unless complexity warrants it. https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/
3. **Anthropic — Claude Code power user tips** (current help article). Covers planning, parallel work, verification, specialist review, hooks, and permissions. These are vendor-specific examples, but many underlying practices are portable. https://support.claude.com/en/articles/14554000-claude-code-power-user-tips
4. **Google Cloud — 2025 DORA report overview** (23 Sep 2025). Reports survey-based AI adoption and discusses use of AI in software delivery. Adoption figures describe surveyed professionals and should not be treated as proof that any particular agent workflow improves outcomes. https://blog.google/innovation-and-ai/technology/developers-tools/dora-report-2025/
5. **Anthropic — The 2026 state of AI agents, current landscape**. Survey-based observations on agent deployment and coding-agent use. Use the methodology and sample details from the full report before drawing broad conclusions. https://claude.com/resources/guides/the-2026-state-of-ai-agents-report/research-insights-part-i-the-current-landscape

## Interpretation

The reusable pattern is not a fixed number of agents. It is explicit task definition, bounded permissions, durable repository context, incremental execution, independent verification, and human accountability. Teams should evaluate outcomes (quality, reliability, lead time, rework, cost) rather than count agents or generated lines.
