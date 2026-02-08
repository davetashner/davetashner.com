---
title: 'Stringer: Bootstrapping AI Agents on Legacy Codebases'
description: 'How a CPU-based CLI tool extracts actionable signals from mature repositories, giving AI agents the structured context they need without wasting inference tokens.'
pubDate: 2026-02-08
heroImage: '/blog/stringer.png'
tags: ['ai', 'agents', 'legacy-code', 'software-development', 'devops']
---

# Stringer: Bootstrapping AI Agents on Legacy Codebases

## Dave Tashner

### February 7, 2026

Often when I talk to engineers about using AI at work, I hear some version of the same objection. "That's great for greenfield, but our codebase is 15 years old and has 200k lines of code."

I get it. It's not an unreasonable position. If you've tried pointing an AI coding assistant at a large, mature codebase and said "help me," you've probably experienced the result. The agent spends twenty minutes reading files, asks a few confused questions, and then produces something that doesn't quite fit. Or it confidently refactors a module it doesn't understand and breaks three things in the process.

When that session ends, you get to do the same context-building exercise again tomorrow.

In my [last post](https://davetashner.com/blog/groundhog-day-memory-for-agents/), I wrote about giving AI agents persistent memory through structured backlogs. Instead of letting agents start every session from scratch, you give them a backlog of well-defined work items with dependencies, blockers, and acceptance criteria. The backlog becomes the memory. That workflow works extremely well for greenfield development.

But it has an assumption baked into it. It assumes you have a git-based backlog. On a brand new project, that's fine. You spend a session on planning, the agent files issues as it goes, and the dependency graph grows organically. On a mature codebase with no git-based backlog? The agent boots up and has nothing. No context about the 47 TODOs scattered through the code. No awareness of the half-finished refactor sitting in a stale branch. No idea that one developer wrote every line of the payments module and left the company six months ago. The backlog is probably in Jira or GitHub issues, but it's not immediately reachable by the AI.

This is the cold-start problem, and it's one of the major reasons why AI agents struggle with legacy codebases.

### The Expensive Way to Solve It

The obvious approach is to let the LLM figure it out. Point the agent at the codebase, let it read every file, trace dependencies, build a mental model of the architecture. Some tools do exactly this. It works, sort of.

The problem isn’t just inference cost, though that adds up quickly. The deeper cost is that you're burning the agent's most valuable resource, its context window, on reconnaissance. On a codebase with thousands of files, that's millions of tokens consumed just to build an understanding that will evaporate when the session ends. If the session runs long enough, you hit the context rot problem I described in my last post. The agent becomes Friday-afternoon-me; overloaded with information, half of which is no longer relevant, making connections that don't actually exist.

Here was my thought though...the signals that matter most for getting started on a legacy codebase aren't hidden. They're sitting right there in the project repository. You just need something to collect them without burning inference to do it.

### Signals Hiding in Plain Sight

Most codebases already contain actionable signals, even if the backlog isn't stored in git.

Git history tells you which files change constantly (high churn, probably fragile), which commits got reverted (something went wrong), and which branches went stale (someone started something and didn't finish). None of this requires an LLM to detect. It's just data sitting in the commit log.

Developers leave TODO and FIXME comments as breadcrumbs. Sometimes they leave them years ago and never come back. Those comments are actionable work items with file paths and line numbers attached. They just aren't structured in a way that an agent can pick up and execute against.

Some files have grown too large. Some modules have no tests. Some directories have every line written by a single author, which means if that person wins the lottery tomorrow, nobody else knows how that code works.

Open GitHub issues and pull request review comments represent work that someone already identified as necessary but never got around to finishing.

These are all signals. They don't require deep architectural understanding to find. They don't require inference. They require a scanner that knows where to look and how to format what it finds into something an agent can use.

### What Stringer Does

Stringer is a CLI tool that scans a repository and extracts these signals, then outputs them as structured beads that agents can immediately work against. Stringer runs entirely on CPU — no API calls, no inference tokens. You point it at a repo, walk away, and come back to a pile of structured signals. The only cost is the electricity to spin your fan.

The basic flow is very easy to trigger:

stringer scan . | bd import -i -
Under the hood, Stringer runs multiple collectors in parallel:

A TODO collector finds TODO, FIXME, HACK, XXX, BUG, and OPTIMIZE comments, enriches them with git blame data, and scores confidence based on age and severity.
A git log collector identifies reverts, high-churn files, and stale branches.
A patterns collector flags oversized files and low-test-coverage modules.
A lottery-risk collector highlights directories dominated by a single author.
A GitHub collector imports open issues, pull requests, and unresolved review comments.

Signals are deduplicated using content-based hashing so repeated scans produce stable IDs. Confidence scores map to priorities. Output is JSONL compatible with the Beads CLI, with optional JSON or Markdown output.

After import, any agent that runs bd ready gets a prioritized list of real work items with context about where they came from and why they matter — without spending its first session reading the entire repo.

Stringer isn’t an AI tool. It doesn’t understand your architecture. It’s grep and git blame with opinions, wrapped in a pipeline that produces structured output. The intelligence comes later, when the agent picks up the work and executes.

Built With the Workflow It Enables
Stringer itself was built using the backlog-driven agentic workflow I described in my last post. I started with planning — no code — and built a structured backlog with the agent. Each session picked up the next unblocked story, implemented it, opened a PR, and moved on.

From the first commit, quality was enforced structurally. Branch protection required CI to pass before anything could merge. Tests, static analysis, race detection, license checks, vulnerability scanning, coverage floors, PR size limits, and semver enforcement all ran on every pull request. When a check failed, the agent fixed it and resubmitted.

The speed wasn’t the point. The point was that the workflow scales because guardrails are automated. Agents aren’t special because they’re smart; they’re useful because they’re compliant with structure.

### What This Means for Legacy Codebases

The complaint was never really "AI can't work on old code." The complaint was "AI doesn't have enough context to be useful."

You don't solve the context problem by feeding the entire codebase into a context window. You solve it by giving the agent a structured starting point, something it can read in seconds and orient around immediately.

Run stringer once to mine the signals that are already sitting in your repo. Import them as a backlog. Now agents start with a map of real problems instead of a blank slate. As they work, they add new items and the backlog grows organically.

This isn't the only thing you need. You still want good CLAUDE.md or AGENTS.md files that describe your architecture and conventions. You still want CI. You still want to do the planning work I described in my last post for any significant new feature. But you're no longer starting from absolute zero. The agent's first session isn't spent fumbling through files trying to figure out where the bodies are buried. It already has a map.

### Limitations and What’s Next

If a TODO moves, its hash changes and may create a duplicate bead that needs cleanup. There’s no LLM pass yet to cluster related signals or infer dependencies. And the output quality depends on the quality of the signals already in your codebase.

Planned work includes clustering, confidence-based filtering, monorepo support, and auto-generated AGENTS.md scaffolds.

The cold-start problem isn’t a model limitation. It’s an information problem. The signals have been in your codebase for years. Stringer just structures them so agents can finally use them.

Try it on your own repo and see what turns up. There’s usually more signal hiding in plain sight than you expect.
