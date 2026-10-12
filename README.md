# OpsField — Platform Troubleshooting Workbench

**Interactive, evidence-first troubleshooting for Linux, networking, systemd, Kubernetes, VMware, on-call and senior engineer interviews.**

**Live:** https://orzujon.github.io/platform-troubleshooting-hub/

OpsField is a fast static reference; **it does not connect to servers, execute commands, read credentials, or provide live monitoring**. The aim is to make engineers ask the right questions, distinguish a symptom from a cause, and collect reproducible evidence.

## What is inside?

| Module | Function |
| --- | --- |
| **Decision tree** | Capture incident context and follow branching diagnostic questions based on observed results; produces next read-only checks and working hypotheses. |
| **Command explorer** | Search 50 commands with purpose, interpretation, common flags, safety labels and illustrative outputs for representative commands. |
| **Error decoder** | 15 explanations including connection refused, 203/EXEC, 502, 503, 504, OOM, CrashLoopBackOff, ImagePullBackOff, and full disks. |
| **Runbooks** | 10 investigation paths (discovery, networking, systemd, storage, Kubernetes, VMware and more) with explicit verification criteria. |
| **Break-and-fix labs** | 8 scenario-based exercises with supplied sample evidence, progressive hints and hidden explanations. |
| **Interview practice** | 12 scenario questions with answers, rationale and locally stored scores. |
| **Incident notebook** | Autosave locally, save up to 50 incident snapshots, reload previous reports, and export a Markdown incident report. |

All reference cases are educational examples. Terminal output in example boxes is explicitly marked **illustrative**. The highlighted Ubuntu lab information is a past observation, not a live feed.

## How to use it on call

1. **Confirm scope:** Which service, environment, exact URL/IP/port, user impact, onset and recent change?
2. **Find the owner:** Service catalog, DNS, load-balancer routing, deployment inventory, monitoring and application team.
3. **Run targeted read-only checks:** Validate the actual host, listener, PID/process, service unit, logs and network path.
4. **Build and test hypotheses:** Distinguish observed signal, possible cause and confirmed root cause.
5. **Mitigate safely:** Follow access/change policy, retain rollback, verify via the original user path.
6. **Document:** Save your reasoning in the incident notebook, export Markdown and redact any confidential data before sharing.

Example: A service may be *active* under systemd and listening on **127.0.0.1:8080**, while a remote request to **VM-IP:8080** is refused. A healthy process does not prove that every network endpoint is reachable.

## Project architecture

Plain HTML/CSS/JavaScript with no build step, tracking, backend, external scripts or framework dependencies.

- \`index.html\`: semantic page shell and navigation.
- \`ops-style.css\`: responsive dark/light UI.
- \`ops-data.js\`: manually curated commands, incidents, labs, interview questions and diagnostic graph.
- \`ops-app.js\`: browser interactions, search, history, markdown export and local persistence.
- \`sw.js\`: offline cache for repeat use after a successful initial online visit.
- \`manifest.webmanifest\`, \`icon.svg\`: browser-install metadata and icon.
- \`.github/workflows/deploy.yml\`: publish to GitHub Pages on main.
- \`.github/workflows/check.yml\`, \`tests/smoke.test.cjs\`: zero-dependency smoke tests.

## Local development

\`\`\`bash
git clone https://github.com/orzujon/platform-troubleshooting-hub.git
cd platform-troubleshooting-hub
python3 -m http.server 8000
\`\`\`

Then visit http://127.0.0.1:8000/.

Run tests with Node 22 or newer:

\`\`\`bash
node --check ops-app.js
node --check ops-data.js
node tests/smoke.test.cjs
\`\`\`

## Publishing

A push/merge into \`main\` automatically triggers GitHub Pages deployment using GitHub Actions. See **Settings → Pages** to choose **GitHub Actions** as the publishing source. The public site is at the link above.

## Data & safety

- All notes, practice progress and incident snapshots are stored in this browser's \`localStorage\`. They are **not synced or backed up**. Clearing site data deletes them.
- Offline caching works after the initial successful load while cached resources remain available. Updates need connectivity.
- **Do not put secrets, production host inventories, customer data or sensitive logs into your publicly accessible repository or this notebook on shared devices.**
- Command examples containing \`SERVICE\`, \`HOST\`, \`PORT\`, \`POD\` or \`NAMESPACE\` are placeholders; confirm targets before using them.
- \`systemctl restart\`, \`daemon-reload\` and other potentially disruptive commands are identified as changes. A copy button is not an approval to run them.
- This is an educational/on-call aid, not a guaranteed exhaustive diagnostic system. In particular, outcomes of troubleshooting decision trees are **hypotheses** until independently verified.

## Extending OpsField

Add new records to \`ops-data.js\`, verify their explanation and safe command semantics, and ensure each node in the decision tree points to an existing node. Add a lab using a realistic alert, observed output, next question, optional hints, explanation and recovery verification. Run the tests before merging.

If contributing from real incidents, **redact** company names, private IPs, account numbers, sensitive logs and credential material.
