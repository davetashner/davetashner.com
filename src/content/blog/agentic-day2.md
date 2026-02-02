---
title: 'Engineering Leadership in the Age of Agentic Coding: Why Day-2 Still Belongs to Humans'
description: 'Shipping software is not the same as owning its behavior in production. As coding costs approach zero, the real challenge shifts to planning, operations, and accountability.'
pubDate: 2026-01-20
heroImage: '/blog/2am-on-call.png'
tags:
  ['ai', 'agents', 'engineering-leadership', 'devops', 'software-development']
---

There's no denying it anymore: agentic coding is real, accelerating fast, and by the end of 2027 it's reasonable to expect that most routine coding tasks will be automated. Within a year, today's AI-assisted workflows will feel as outdated as last year's CI pipelines. What already feels transformative today will soon be table stakes. Engineers and leaders who aren't actively learning how to work with these systems are already behind the curve.

But here's the part that gets lost in a lot of the discourse:

**Shipping software is not the same thing as owning its behavior in production.**

Production operations (especially in regulated, high-stakes environments) still require deep, ongoing human engagement.

## Coding is compressing. Operations are _expanding_.

![Where Engineering Time Goes](/blog/where-engineering-time-goes.png)

[Industry data](https://www.idc.com/) already shows that writing code is a minority share of engineering work. An IDC study found that application coding accounts for roughly 16% of developers' time, with the majority spent on CI/CD, monitoring, security, and operational support. This distribution predates widespread agentic coding.

Agentic systems are remarkably good at writing code. Given clear intent, they can scaffold services, wire integrations, and generate tests at a speed that would have been unimaginable even two years ago.

What they don't magically solve (and may never fully solve) is **day-2 reality**:

- Being on-call when symptoms don't match dashboards
- Coordinating incidents across technical, vendor, and business boundaries
- Interpreting weak or conflicting signals in partially observable systems
- Operating under compliance constraints that intentionally limit automation

Most production systems today were designed for **humans to operate**: dashboards, runbooks, change approvals, incident bridges, postmortems. Even when agents are involved, humans remain accountable (legally, operationally, and ethically) for outcomes.

That's not a failure of AI. It's a reminder that software was designed to solve human problems and lives inside socio-technical systems, not just codebases.

## The real shift: leaders must use AI too throughout the SDLC

One of the quiet but profound changes happening right now is this:

**Engineering leaders now have direct access to the same analytical leverage as their teams, and with it, the same responsibility to use it.**

There's no excuse anymore not to:

- Clone the repo
- Point an AI at it
- Ask hard questions about architecture, security, reliability, performance, cost, operability, and tech debt
- Evaluate the backlog for alignment with organizational strategy

If agents and engineers are generating large volumes of code quickly, leaders who _don't_ actively evaluate that output are taking on invisible risk.

This isn't micromanagement. It's how leaders prevent invisible risk from compounding at machine speed.

Leaders are still on the hook for:

- Unsafe releases
- Sloppy implementations
- Over-permissioned infrastructure
- Under-tested systems
- Fragile operational models

Most of the "danger" people attribute to agents actually comes from **insufficient human-agent iteration before delivery** rather than from the use of agents themselves.

## Planning is no longer optional. It's _the_ multiplier

As coding costs approach zero, **the cost of bad planning dominates system outcomes**.

The highest-leverage human work now happens before agents start implementing:

- Refining backlogs with unambiguous intent
- Capturing architectural decisions (ADRs)
- Defining threat models and compliance constraints
- Designing test strategies, rollout plans, and rollback paths
- Creating clear operational expectations: observability, runbooks, dry-run modes

Agents should be building software that is:

- Intuitive to operate 24x7
- Easy for new engineers to reason about
- Safe by default in production

But that only happens if humans provide the context they themselves would need to operate the system and store that context somewhere durable for future agents to reference.

## Guardrails matter more than ever

Using agents in DevOps and production environments is tempting. That big migration could be so much easier if the agents just understood production! It's also unsafe at scale without **extremely well-defined and battle-tested controls**.

In many regulated industries, agents _cannot_ have unrestricted access to debugging tools or production systems. Human approval isn't a bug; it's a feature.

The future likely involves more agent loops in operations, but getting there requires:

- Clear action boundaries
- Auditable policies
- Human-in-the-loop approval for destructive actions
- Intentional cleanup and "ops debt" backlogs

This is evolution, not a big-bang rewrite.

## So what does this mean for engineering leaders?

A few practical shifts I expect to matter most:

1. **Leaders must be fluent AI users.** Not to code directly, but to evaluate systems continuously.
2. **Backlog quality becomes a core competency.** Vague intent produces dangerous output.
3. **Design artifacts matter again.** ADRs, threat models, SRE docs, and FinOps plans are vital for future human and agent users of the system. They are the link to understanding how the system was _intended_ to function.
4. **Ops empathy becomes a leadership skill.** Software must be operable by humans. The proliferation of AI-generated products will require a huge increase in operational maintainability in order for the same ops team to effectively manage a wider surface area.
5. **Outcome ownership doesn't change**, even if the code wasn't typed by a person.

Agentic coding isn't the end of engineering leadership or software development. If anything, it raises the bar.

The teams that thrive won't be the ones that ship the fastest; they'll be the ones that **plan well, operate safely, and use AI deliberately rather than passively**. Day-2 is where intent meets consequences. The question is whether we design for it, or let it surprise us.
