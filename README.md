# OpsField — Platform Troubleshooting Workbench

**Find the failure, not just the command.** OpsField is an interactive, browser-based reference for on-call platform engineers and for realistic troubleshooting interview practice.

It is a static website, **not a live terminal**. It never executes commands or connects to servers. You decide which command to run after verifying host, permissions, environment and change impact.

## Features

| Area | What it does |
|---|---|
| **Incident triage** | Ask first-response questions, classify symptoms, identify the next safe checks, and copy a handoff summary. |
| **Runbooks** | Investigate common incidents: network refusal, systemd failures, DNS, HTTP 5xx, CPU, OOM, disk, permissions, SSH, containers, Kubernetes and VMware. |
| **Error decoder** | Search error strings (e.g. `203/EXEC`, `curl: (7)`, `502`, `NXDOMAIN`, `ImagePullBackOff`) and distinguish symptoms from confirmed causes. |
| **Command library** | Explanations, flags, expected evidence, copy buttons, command risk labels and favourites. |
| **Break & fix labs** | Self-guided fault injection, progressive hints, recovery explanations and locally tracked completion. |
| **Interview mode** | Scenario-based questions with explanations and scoring. |
| **Incident notes** | Locally auto-saved structured report with Markdown export. |
| **Global search** | Ctrl/Cmd + K; searches errors, commands, runbooks and labs. |

It supports a dark/light theme, phone screens, keyboard navigation, and an installable offline-capable PWA on HTTPS once the GitHub Pages site has been visited. Everything works without a JavaScript framework, cloud backend or account.

## Quick start

Open `index.html` in your browser. Or, from the project folder, run a local web server:

```bash
python3 -m http.server 8088
```

Then open `http://localhost:8088`. This command only serves the site locally; **OpsField does not run the diagnostic commands displayed in the UI**.

## Publish free on GitHub Pages

1. On GitHub create a **new public repository** named `platform-troubleshooting-hub`. Do **not** add a README when creating it if you intend to upload this full project at once.
2. Upload the contents of this project (including the hidden `.github/workflows/deploy.yml` file), or push using Git (see below).
3. Open the repository **Settings → Pages** and select **GitHub Actions** as the build and deployment source.
4. Open the **Actions** tab and verify the `Deploy static site to GitHub Pages` workflow runs successfully. GitHub may require you to enable workflows when publishing for the first time.
5. Your site will appear at `https://YOUR-GITHUB-USERNAME.github.io/platform-troubleshooting-hub/` once GitHub completes deployment.

Git CLI alternative (for an empty repo):

```bash
git init
git branch -M main
git add .
git commit -m "Initial interactive troubleshooting workbench"
git remote add origin https://github.com/YOUR-GITHUB-USERNAME/platform-troubleshooting-hub.git
git push -u origin main
```

**GitHub Pages visibility:** A public repository makes its published site publicly accessible. Do not add confidential bank names, internal addresses, secrets, customer information or real incident logs. Even for private repositories, Pages exposure depends on plan and configuration.

## File structure

```text
platform-troubleshooting-hub/
├── index.html                # Accessible HTML entry point
├── styles.css                # Responsive light/dark design
├── data.js                   # All commands, errors, runbooks, labs, interview scenarios
├── app.js                    # Routing, interactivity, notes, local persistence, search
├── assets/icon.svg           # Project icon
├── .nojekyll                 # Disable default Jekyll processing
├── .github/workflows/
│   └── deploy.yml            # GitHub Pages deployment
├── runbooks/
│   ├── 001-discover-service.md
│   ├── 002-connection-refused.md
│   └── 003-systemd-203-exec.md
└── docs/
    └── CONTRIBUTING.md       # How to add safely verified knowledge
```

## First observed lab case (verified by shared Ubuntu VM output)

On an Ubuntu Server 26.04.1 VM running on VMware, `systemctl list-units --type=service --state=running` listed `lab-web.service`, `systemctl --failed` returned no failed units, and `sudo ss -lntp` showed `python3` listening on `127.0.0.1:8080`.

**Finding:** A locally healthy listener bound only to loopback does not necessarily accept requests sent from a different machine to the VM's non-loopback address. This is an *observed network configuration*, not proof that the Python service is broken. See [runbook 002](runbooks/002-connection-refused.md).

For public-safe documentation, identifying VM IDs and the complete process inventory have been excluded.

## Use it on your phone / offline

After deployment, open the HTTPS Pages site in your mobile browser, then use **Add to Home Screen** / **Install app** when your browser offers it. The service worker caches the site for offline reference after the first successful visit. Your incident notes and learning progress stay only on that device/browser, not in GitHub. Offline mode cannot provide live monitoring or fetch updates until you reconnect.

## How to grow the knowledge base

Edit structured records in `data.js`:

- `commands`: exact syntax, flags, clue, read-only/changes-live-state label.
- `errors`: signal, **possible** causes, first check and differentiating evidence.
- `runbooks`: first questions, hypotheses, ordered observations, verification and escalation.
- `labs`: safe setup, mission, progressive hints, solution and verification.
- `questions`: interview prompt, options, answer and reasoning.

No build step is needed. Check `node --check data.js && node --check app.js` and manually test in a browser.

## Security and safety

- The site has **no analytics**, no backend and no outbound API calls. Progress and incident note drafts use `localStorage` in your own browser, not GitHub; clear your browser data and they are gone.
- Sample diagnostic commands are suggestions, not autonomous actions. `<placeholder>` values must be replaced.
- Some commands require sudo; confirm scope, approval and impact. Restarting a service does **not** automatically prove root cause is resolved.
- Avoid `chmod 777`, indiscriminate `kill -9`, firewall flushing, disk-fill attacks or blind restarts on production.
- For destructive labs, take a disposable VMware snapshot first. Never deliberately stress, reconfigure or damage a real shared/production host.
- Follow your employer's incident response policy and avoid storing restricted data in public reports.

## Roadmap

The first version provides usable coverage, **not an exhaustive list of every infrastructure problem**. Good future additions: ESXi/vSphere vCenter scenarios, PCF/Cloud Foundry, Kubernetes networking, certificates, TLS chains, cloud IAM, database dependencies, observability dashboards, resource-pressure evidence templates, advanced failure trees, and automated documentation tests.

## License

MIT License. See `LICENSE`.