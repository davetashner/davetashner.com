---
title: 'Stringer: Bootstrapping AI Agents on Legacy Codebases'
description: 'How a CPU-based CLI tool extracts actionable signals from mature repositories, giving AI agents the structured context they need without wasting inference tokens.'
pubDate: 2026-02-08
heroImage: '/blog/stringer.png'
tags: ['ai', 'agents', 'legacy-code', 'software-development', 'devops']
---

# The Problem with Legacy Codebases

Engineers frequently resist using AI on mature codebases, saying "That's great for greenfield, but our codebase is 15 years old and has 200k lines of code." This objection reflects a real challenge: when pointed at large systems, AI agents spend excessive time reading files, ask confused questions, and produce solutions that don't fit existing architecture. Each session requires starting the context-building process anew.

# The Cold-Start Problem

I [previously discussed](/blog/groundhog-day-memory-for-agents/) using structured backlogs to give agents persistent memory. However, mature codebases without git-based backlogs present a challenge — agents boot up with no awareness of scattered TODOs, half-finished refactors, or institutional knowledge about code ownership.

# Why Reading Everything Fails

The obvious approach — letting AI read the entire codebase to build understanding — wastes the agent's context window on reconnaissance. This consumes millions of tokens just to construct knowledge that disappears when the session ends, while risking "context rot" where overloaded agents make false connections.

# Hidden Signals in Code

Most repositories contain actionable signals already:

- **Git history** reveals high-churn files, reverted commits, and stale branches
- **Developer comments** mark TODOs and FIXMEs with file paths and line numbers
- **Code metrics** identify oversized files and low-test-coverage modules
- **Author patterns** highlight single-developer dependencies ("lottery risk")
- **GitHub issues** represent already-identified work items

These signals require no inference to extract — just structured collection.

# What Stringer Does

Stringer is a CPU-based CLI tool that scans repositories and extracts these signals as structured items agents can immediately work against. The basic command is simple:

```bash
stringer scan . | bd import -i -
```

Multiple collectors run in parallel:

- **TODO collector** enriches comments with git blame data and confidence scoring
- **Git log collector** identifies reverts, high-churn files, and stale branches
- **Patterns collector** flags oversized files and low-test-coverage modules
- **Lottery-risk collector** highlights single-author directories
- **GitHub collector** imports issues, PRs, and review comments

Output uses content-based hashing for deduplication and maps confidence scores to priorities, producing JSONL compatible with the [Beads CLI](https://github.com/steveyegge/beads).

# Building Stringer Itself

Stringer was built using the backlog-driven agentic workflow it enables. The project started with planning, created a structured backlog, and had agents pick up unblocked stories each session. Guardrails like branch protection, CI requirements, tests, coverage floors, and PR size limits were automated from the first commit.

# Impact on Legacy Codebases

The real complaint isn't that "AI can't work on old code" — it's that agents lack sufficient context. The solution isn't feeding entire codebases into context windows, but providing structured starting points readable in seconds. Running Stringer once mines existing signals and creates a prioritized backlog of real problems, allowing agents to start with a map rather than a blank slate.

# What's Next

Future work includes signal clustering, confidence-based filtering, monorepo support, and auto-generated documentation scaffolds. Current limitations include potential duplicate beads when TODOs move and dependency inference requiring LLM processing.

---

The cold-start problem is an information architecture challenge, not a model limitation. Signals exist in codebases already — Stringer structures them so agents can use them effectively.
