---
title: 'Groundhog Day: Giving AI Agents Persistent Memory'
description: 'How I use structured backlogs to give AI coding assistants the memory they need to work autonomously, including running overnight builds while I sleep.'
pubDate: 2026-01-28
heroImage: '/blog/groundhog.png'
tags: ['ai', 'agents', 'claude', 'productivity', 'software-development']
---

![Groundhog Day](/blog/groundhog.png)

# The Overnight Experiment

Earlier this week I [posted on LinkedIn](https://www.linkedin.com/posts/dave-tashner_last-night-i-checked-my-claude-credits-and-activity-7421541312056782848-DN_Z?utm_source=share&utm_medium=member_desktop&rcm=ACoAAAJ7ZvsBTK6jVpQ2wrX1XB2XzZtw-wjGJzw) about a little experiment I ran with multiagentic coding assistants that blew my mind - I was able to build a full website with a fleet of agents in my sleep. Literally.

This whole thing started by experimenting with Claude Code to see if I could migrate an old Javascript website to Typescript. When Claude did the whole site in one shot, I started rapidly expanding my idea of what was possible and became much more ambitious. I've been working on a few different projects now with Claude Code, including an iOS game for my daughter, a new website for a local business, an automated infrastructure provisioning demo and another side website.

There was some interest in more detail about the workflow I used, so I'm writing that up here. I'd love to hear how others are experimenting with these workflows.

# The Limitation I Kept Hitting

If you've used AI coding assistants for any length of time, you've probably experienced this frustration: every new session starts from zero. The agent doesn't always remember what you discussed yesterday. It doesn't know which approach you rejected, which architectural decisions you made, or what's already been tried. Not unlike an engineer who's just joined a new team and is trying really hard to get up-to-speed and make the boss happy.

So you re-explain. You re-provide context. You paste in previous conversations. It works, but it doesn't scale. It certainly doesn't let you hand off work overnight.

The other common problem I've experienced with AI (particularly after long sessions) is context rot. The primary thesis behind context rot is that **AI performance degrades significantly and unpredictably as input length increases**. Indeed, [MIT research](https://direct.mit.edu/tacl/article/doi/10.1162/tacl_a_00638/119630/Lost-in-the-Middle-How-Language-Models-Use-Long) found that _"performance can degrade significantly when changing the position of relevant information, indicating that current language models do not robustly make use of information in long input contexts."_

If you've had a long chat with ChatGPT or tried to build a full website or application in one session, you may have experienced this. Context windows balloon during extended sessions as every file read, every error message, and every back-and-forth exchange piles up. Hallucinations abound. Frustration boils over. Projects die.

The truth is, the models aren't the bottleneck. The lack of memory is.

# Three Versions of Me (and Every AI Agent)

Here's how I think about it.

An agent with no context is me at 8:30 on Monday morning. I'm staring at my laptop, trying to piece together what happened last week and what I'm supposed to be working on next. The coffee hasn't kicked in yet. I know I work here. Beyond that, everything's a bit fuzzy. I'll figure it out eventually, but we're going to waste the first hour getting oriented.

An agent with a full context window after a long session is me at 4:30 on Friday afternoon. I'm overloaded with information, half of which is no longer relevant. My brain is making connections that don't actually exist. I'm one more Slack message away from mass hallucination. Technically I have all the context, but I'm not exactly operating at peak performance.

An agent with a structured, well-formed, up-to-date backlog to review on startup? That's me walking into work wearing a cape. I know exactly what needs to happen. Decisions are documented. Dependencies are clear. Blockers are flagged. I'm not fumbling around trying to reconstruct state from memory. I'm executing.

Most of us don't get to be cape-wearing-me very often. The backlog is usually stale, the notes are incomplete, and we spend our Monday mornings in a fog (that's not just me right?). The agents have the same problem, except they don't even get to keep the foggy memories. Every session is Monday morning, forever.

Unless you give them something better to wake up to.

# External Memory as the Solution

AI agents are already capable of writing code, running tests, fixing failures, and iterating. What they can't do on their own is remember what comes next, what's blocked, and why certain decisions were made.

The solution I landed on isn't smarter AI. It's better external memory in the form of a structured backlog that any agent can pick up, understand, and execute against. [Steve Yegge published](https://steve-yegge.medium.com/introducing-beads-a-coding-agent-memory-system-637d7d92514a) a tool called "[beads](https://github.com/steveyegge/beads)" that I've been using for this purpose. I think Dan Lorenc uses GitHub issues which is also appealing for a future experiment. Anthropic rolled out their own [update for Claude Code this week called Tasks](https://www.threads.com/@boris_cherny/post/DT15_lHjmWS/were-turning-todos-into-tasks-in-claude-code-today-were-upgrading-todos-in) designed to solve this problem.

A backlog in beads format is just a JSONL file (one JSON object per line) that lives in your repository. Each item has fields for status, dependencies, blockers, and acceptance criteria.

# How I've Been Working

For the past month, my workflow has looked like this:

I start a session focused purely on planning. No code. I tell the agent explicitly: _"I only want to focus on a complete and thorough backlog."_ I give the agent permission to ask me any clarifying questions before it starts. We discuss the project until we've captured everything I care about: test coverage, CI/CD (continuous integration and deployment pipelines), monitoring, hosting, design, disaster recovery.

Once we've taken a first pass, I close that session and open a new session with a persona. _"You are an expert web designer; evaluate this backlog for clarity and completeness. Identify any gaps or improvements that would result in a more modern, functional application. Add items to the backlog to track your improvement suggestions. Ask me any clarifying questions before you begin. Do not implement any code, backlog review and improvements only."_ You can replace that persona with 'expert cyber security engineer' or 'site reliability engineer' or 'general counsel'. Maybe all of them.

I structure work as Epics and Stories with dependencies. An Epic is a large body of work, like "Set up CI/CD pipeline." Stories are individual deliverables within that Epic, like "Configure GitHub Actions workflow" or "Add security scanning step." Dependencies and blockers are explicit. Priorities are assigned.

When a story's implementation requires an architectural decision, it gets documented in a separate decision record and the story is blocked until I approve a decision. Stories requiring my approval stay marked as blocked until I review them.

Once planning is thorough, any agent in any session can pick up the next unblocked item and execute it. The backlog becomes the memory. I only interact with the backlog through the agent. If I want to ask about our current progress, I have the agent generate a markdown table summarizing the status of epics and stories. If I want to add new work, I have the agent use beads to add new work. No. Touching. The. Backlog! Agents only!

The key insight from my experience: planning and execution are separate phases with different approval models. Planning requires my judgment. I need to be in the loop for scope, priorities, and architectural choices. Execution against a well-defined backlog? That can run autonomously, at least for certain types of work. Continuous Integration is super important here (not that it wasn't before). You must have thorough, rock solid tests and automation to validate that the code functions as intended, otherwise it's unsafe (whether it was AI generated or not).

# What Makes a Backlog "Agent-Ready"

Not every task list enables this kind of handoff. I've found the backlog needs:

1. **Clear acceptance criteria.** The agent needs to know when it's done. Given / When / Then is helpful because it makes testing easier and it's not tedious for the agents.
2. **Explicit dependencies.** What work must complete before this work can start?
3. **Blockers called out.** What requires human input? Don't let the agent spin on something it can't resolve.
4. **Decision records for context.** When the agent encounters a choice point, it should be able to find your documented reasoning.
5. **Handoff notes.** What was the agent working on when the session ended? What should the next session pick up?

This is more upfront work than I typically do when I'm coding something myself. I'm trading time spent supervising for time spent planning.

# The Limitations (I Promised I'd Get Here)

I want to be clear about what this doesn't solve:

Auto-approve in the agent workflow doesn't mean auto-merge to most production environments (yet). The backlog quality is everything. A vague backlog produces vague implementations. Garbage in, garbage out. Some work resists decomposition. Novel problems, ambiguous requirements, and judgment calls still need me in the loop. I'm not eliminating my involvement; I'm shifting where I spend my attention.

This worked well for a simple, unregulated website where the cost of a mistake is low and easy to fix. Your mileage will vary depending on your domain, your risk tolerance, and how well you can decompose your work into discrete, well-defined chunks.

# What This Means for How I Work

The overnight run wasn't magic. It was the result of spending time on planning that I would have skipped if I were coding it myself. The backlog served as the interface between my intent and the agent's capability.

I've started thinking about backlogs differently now. They're not just project management artifacts. They're the API contract between me and my AI collaborators. The clearer the contract, the more I can delegate.

If you're treating AI assistants as fancy autocomplete, there's more leverage available. The real unlock, at least in my experience, is treating them as collaborators who can work independently as long as you've written work items they can understand.

The "Friday 4:30pm" agent with a full context window isn't just overwhelmed; according to [this research](https://research.trychroma.com/context-rot) (and a lot more), it's actively performing worse on retrieval tasks. Structured external memory (your backlog) sidesteps context rot entirely.

Your AI agents don't need better memory built in. They need better backlogs. Give them something worth waking up to, and they'll stop living the same Monday morning over and over again.

---

**References:**

- [Dan Lorenc's Multiclaude](https://dlorenc.medium.com/a-gentle-introduction-to-multiclaude-36491514ba89)
- [Steve Yegge's beads](https://github.com/steveyegge/beads)
- [Lost in the Middle: How Language Models Use Long Contexts](https://direct.mit.edu/tacl/article/doi/10.1162/tacl_a_00638/119630/Lost-in-the-Middle-How-Language-Models-Use-Long)
