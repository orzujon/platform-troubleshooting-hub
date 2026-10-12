# OpsField — Platform Troubleshooting Workbench

**Find the failure, not just the command.**

Live site: https://orzujon.github.io/platform-troubleshooting-hub/

OpsField is an interactive, browser-based reference for Linux and platform engineering on-call, VMware learning, and senior DevOps interview preparation. It is a static website: it never executes commands or connects to servers.

## What is included

- Guided, branching incident diagnosis that adapts to observed symptoms.
- Searchable command library with explanations and safety limitations.
- Error decoder with plausible causes and next evidence-gathering steps.
- Repeatable runbooks for service discovery, networking, systemd, storage, containers and Kubernetes.
- Realistic break-and-fix lab simulations with optional hints and solutions.
- Scenario-based interview questions and explanations.
- Incident notebook with Markdown exports, saved only in browser storage.
- Responsive phone layout and optional offline caching after first successful load.

## How to respond to an incident

1. Clarify the environment, actual endpoint, error, scope, ownership and timeline.
2. Follow decision-tree questions based on observed evidence rather than assumptions.
3. Check commands and runbooks to narrow the likely failure boundary.
4. Record findings, make authorised changes with a rollback plan, and verify from the affected user's perspective.
5. Export a sanitised incident report for team handover.

## Lab case: Ubuntu on VMware

The initial reference case was an active systemd service running Python and listening on 127.0.0.1:8080. The key lesson: a healthy process listening only on loopback is not necessarily reachable from another machine. Process IDs and transient host details in screenshots are not stable.

## Source files

- index.html — application HTML shell
- ops-style.css — responsive styling
- ops-data.js — guided diagnostic tree, errors, commands, labs, runbooks and interview questions
- ops-app.js — interactive UI logic, search, browser-local notes and progress
- sw.js, icon.svg, manifest.webmanifest — offline caching and mobile installation
- .github/workflows/deploy.yml — GitHub Pages publication on main branch updates

## Deployment

In GitHub Settings > Pages, choose GitHub Actions as the deployment source. Push to main to trigger the deployment workflow.

## Privacy and operational safety

This is an educational tool, not live monitoring, an SSH client or an automated fixer. Saved notes/progress live in local browser storage and do not sync across devices. Export notes before clearing browser data. Avoid placing production secrets, personal information, customer data or internal host inventories in this public repository. Read-only commands are preferred during investigation; do not restart services or edit infrastructure without assessing scope and obtaining permission.

MIT License.
