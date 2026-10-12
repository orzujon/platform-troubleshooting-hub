/* OpsField v2: curated reference data, edited as evidence changes. */
window.OpsData = {
  "commands": [
    {
      "id": "cmd01",
      "category": "Discovery",
      "command": "hostnamectl",
      "purpose": "Identify operating system, kernel, hostname and virtualisation.",
      "interpretation": "Verify you're on the intended host/environment before proceeding.",
      "risk": "read"
    },
    {
      "id": "cmd02",
      "category": "Discovery",
      "command": "id && whoami",
      "purpose": "Identify current user, UID and groups.",
      "interpretation": "Having sudo does not mean your account is root.",
      "risk": "read"
    },
    {
      "id": "cmd03",
      "category": "Discovery",
      "command": "systemctl list-units --type=service --state=running",
      "purpose": "Show currently running systemd service units.",
      "interpretation": "It excludes inactive/failed services and non-systemd applications.",
      "risk": "read"
    },
    {
      "id": "cmd04",
      "category": "Discovery",
      "command": "systemctl list-units --type=service --all",
      "purpose": "Show loaded services including inactive and failed units.",
      "interpretation": "Use list-unit-files to find installed definitions not loaded.",
      "risk": "read"
    },
    {
      "id": "cmd05",
      "category": "Discovery",
      "command": "systemctl --failed",
      "purpose": "Find systemd units in failed state.",
      "interpretation": "Zero failed units does not establish application health.",
      "risk": "read"
    },
    {
      "id": "cmd06",
      "category": "Discovery",
      "command": "systemctl list-unit-files --type=service",
      "purpose": "List known unit files and enablement settings.",
      "interpretation": "Enabled means boot integration, not necessarily running.",
      "risk": "read"
    },
    {
      "id": "cmd07",
      "category": "Discovery",
      "command": "sudo ss -lntp",
      "purpose": "Map listening TCP ports to local IPs and owning PIDs.",
      "interpretation": "127.0.0.1 listens only locally; absence of listener matters.",
      "risk": "read"
    },
    {
      "id": "cmd08",
      "category": "Discovery",
      "command": "ps auxww",
      "purpose": "List running processes with full commands.",
      "interpretation": "An exited application will not appear.",
      "risk": "read"
    },
    {
      "id": "cmd09",
      "category": "Discovery",
      "command": "ps -fp PID",
      "purpose": "Inspect one process and its parent.",
      "interpretation": "Replace PID with the number reported by ss or top.",
      "risk": "read"
    },
    {
      "id": "cmd10",
      "category": "Discovery",
      "command": "readlink -f /proc/PID/exe",
      "purpose": "Locate executable for a running Linux process.",
      "interpretation": "Requires permissions to inspect process metadata.",
      "risk": "read"
    },
    {
      "id": "cmd11",
      "category": "Services",
      "command": "systemctl status SERVICE --no-pager",
      "purpose": "Inspect current unit state, PID, recent failure and exit code.",
      "interpretation": "Look for Active, Main PID, Result and ExecStart.",
      "risk": "read"
    },
    {
      "id": "cmd12",
      "category": "Services",
      "command": "systemctl cat SERVICE",
      "purpose": "Display unit file and drop-in configuration.",
      "interpretation": "Read this before assuming the executable location.",
      "risk": "read"
    },
    {
      "id": "cmd13",
      "category": "Services",
      "command": "systemctl show SERVICE -p ExecStart -p MainPID -p User",
      "purpose": "Show effective start command, PID and account.",
      "interpretation": "Effective properties may differ from a single unit file.",
      "risk": "read"
    },
    {
      "id": "cmd14",
      "category": "Services",
      "command": "journalctl -u SERVICE --since '30 min ago' --no-pager",
      "purpose": "Read service logs around incident onset.",
      "interpretation": "Cross-reference timestamps and the first causal error.",
      "risk": "read"
    },
    {
      "id": "cmd15",
      "category": "Services",
      "command": "journalctl -b -p err --no-pager",
      "purpose": "Inspect error-priority events from current boot.",
      "interpretation": "Useful for system-wide startup issues.",
      "risk": "read"
    },
    {
      "id": "cmd16",
      "category": "Services",
      "command": "sudo systemctl daemon-reload",
      "purpose": "Reload changed systemd unit definitions.",
      "interpretation": "Does not restart the application.",
      "risk": "change"
    },
    {
      "id": "cmd17",
      "category": "Services",
      "command": "sudo systemctl restart SERVICE",
      "purpose": "Stop then start one service.",
      "interpretation": "Disruptive: require authorisation and rollback plan in production.",
      "risk": "change"
    },
    {
      "id": "cmd18",
      "category": "Services",
      "command": "systemctl is-active SERVICE",
      "purpose": "Ask whether systemd considers a service active.",
      "interpretation": "Active alone does not prove HTTP readiness.",
      "risk": "read"
    },
    {
      "id": "cmd19",
      "category": "Networking",
      "command": "ip -br addr",
      "purpose": "Show interfaces and bound IPs.",
      "interpretation": "Compare VM address with ticket destination.",
      "risk": "read"
    },
    {
      "id": "cmd20",
      "category": "Networking",
      "command": "ip route",
      "purpose": "Inspect routing table and default gateway.",
      "interpretation": "Identify missing routes or wrong network paths.",
      "risk": "read"
    },
    {
      "id": "cmd21",
      "category": "Networking",
      "command": "getent hosts HOSTNAME",
      "purpose": "Resolve hostname using system name services.",
      "interpretation": "Compare actual DNS answer to expected destination.",
      "risk": "read"
    },
    {
      "id": "cmd22",
      "category": "Networking",
      "command": "resolvectl status",
      "purpose": "Inspect systemd-resolved DNS servers and search domains.",
      "interpretation": "Useful when getent resolution fails.",
      "risk": "read"
    },
    {
      "id": "cmd23",
      "category": "Networking",
      "command": "curl -v --connect-timeout 5 http://HOST:PORT/",
      "purpose": "Test TCP/HTTP and display connection details.",
      "interpretation": "Preserve exact host and scheme; do not invent ports.",
      "risk": "read"
    },
    {
      "id": "cmd24",
      "category": "Networking",
      "command": "curl -I https://HOSTNAME/",
      "purpose": "Read HTTP response headers.",
      "interpretation": "HEAD may be unsupported; retry GET when necessary.",
      "risk": "read"
    },
    {
      "id": "cmd25",
      "category": "Networking",
      "command": "nc -vz -w 3 HOST PORT",
      "purpose": "Test whether TCP connection can be established.",
      "interpretation": "Successful TCP connection does not imply app readiness.",
      "risk": "read"
    },
    {
      "id": "cmd26",
      "category": "Networking",
      "command": "sudo ss -ntp",
      "purpose": "Inspect active TCP connections and processes.",
      "interpretation": "Use for established sessions and socket troubleshooting.",
      "risk": "read"
    },
    {
      "id": "cmd27",
      "category": "Networking",
      "command": "tracepath HOSTNAME",
      "purpose": "Inspect probable route path (if installed).",
      "interpretation": "Intermediate network devices may hide hops.",
      "risk": "read"
    },
    {
      "id": "cmd28",
      "category": "Networking",
      "command": "sudo ufw status verbose",
      "purpose": "Check Ubuntu uncomplicated firewall status.",
      "interpretation": "Also check other firewall systems and upstream controls.",
      "risk": "read"
    },
    {
      "id": "cmd29",
      "category": "Resources",
      "command": "uptime",
      "purpose": "Check load average and uptime.",
      "interpretation": "Load average includes tasks waiting on I/O, not just CPU.",
      "risk": "read"
    },
    {
      "id": "cmd30",
      "category": "Resources",
      "command": "top",
      "purpose": "Inspect CPU use, memory and processes interactively.",
      "interpretation": "Press c for command lines and q to exit.",
      "risk": "read"
    },
    {
      "id": "cmd31",
      "category": "Resources",
      "command": "ps -eo pid,comm,%cpu,%mem,rss --sort=-%cpu | head",
      "purpose": "Identify current high-CPU process candidates.",
      "interpretation": "CPU figures are a sample/average; verify under load.",
      "risk": "read"
    },
    {
      "id": "cmd32",
      "category": "Resources",
      "command": "free -h",
      "purpose": "Inspect available memory and swap.",
      "interpretation": "'available' is more meaningful than raw 'free'.",
      "risk": "read"
    },
    {
      "id": "cmd33",
      "category": "Resources",
      "command": "sudo journalctl -k --since '1 hour ago' | grep -i -E 'out of memory|killed process'",
      "purpose": "Search kernel log for OOM kill evidence.",
      "interpretation": "A missing match does not exclude container-specific OOM.",
      "risk": "read"
    },
    {
      "id": "cmd34",
      "category": "Resources",
      "command": "df -h",
      "purpose": "Identify filesystem utilisation.",
      "interpretation": "Check the mount that actually holds application data.",
      "risk": "read"
    },
    {
      "id": "cmd35",
      "category": "Resources",
      "command": "df -i",
      "purpose": "Identify inode exhaustion even with free bytes.",
      "interpretation": "Many tiny files can consume all inodes.",
      "risk": "read"
    },
    {
      "id": "cmd36",
      "category": "Resources",
      "command": "sudo du -xhd1 /var",
      "purpose": "Find large directories on /var filesystem.",
      "interpretation": "-x stays on one filesystem; avoid scanning sensitive trees casually.",
      "risk": "read"
    },
    {
      "id": "cmd37",
      "category": "Resources",
      "command": "sudo lsof +L1",
      "purpose": "Find open but deleted files occupying disk.",
      "interpretation": "Check service impact before closing any file handles.",
      "risk": "read"
    },
    {
      "id": "cmd38",
      "category": "Resources",
      "command": "lsblk -f",
      "purpose": "Inspect disks, filesystem types and mountpoints.",
      "interpretation": "Snapshot the VM before storage fault injection.",
      "risk": "read"
    },
    {
      "id": "cmd39",
      "category": "Containers",
      "command": "docker ps -a",
      "purpose": "List Docker containers including exited ones.",
      "interpretation": "Container not shown in systemd units as an app service.",
      "risk": "read"
    },
    {
      "id": "cmd40",
      "category": "Containers",
      "command": "docker logs --tail 100 CONTAINER",
      "purpose": "Read recent Docker container logs.",
      "interpretation": "Replace placeholder with container name or ID.",
      "risk": "read"
    },
    {
      "id": "cmd41",
      "category": "Containers",
      "command": "docker inspect CONTAINER",
      "purpose": "Read container configuration, mounts and state.",
      "interpretation": "Output can contain secrets; do not publish it raw.",
      "risk": "read"
    },
    {
      "id": "cmd42",
      "category": "Kubernetes",
      "command": "kubectl get pods -A -o wide",
      "purpose": "Find pods, namespace, status and node.",
      "interpretation": "Confirm correct cluster context first.",
      "risk": "read"
    },
    {
      "id": "cmd43",
      "category": "Kubernetes",
      "command": "kubectl config current-context",
      "purpose": "Identify active Kubernetes target cluster.",
      "interpretation": "An essential safety check before modifying workloads.",
      "risk": "read"
    },
    {
      "id": "cmd44",
      "category": "Kubernetes",
      "command": "kubectl describe pod POD -n NAMESPACE",
      "purpose": "Review conditions, probes, image pulls and events.",
      "interpretation": "Look for the first failing condition, not just pod status.",
      "risk": "read"
    },
    {
      "id": "cmd45",
      "category": "Kubernetes",
      "command": "kubectl logs POD -n NAMESPACE --previous",
      "purpose": "Inspect previous terminated container logs.",
      "interpretation": "Useful for CrashLoopBackOff; may be empty if no previous instance.",
      "risk": "read"
    },
    {
      "id": "cmd46",
      "category": "Kubernetes",
      "command": "kubectl get svc,ingress -n NAMESPACE",
      "purpose": "Find Kubernetes service/ingress routing endpoints.",
      "interpretation": "Trace ingress to service selectors and endpoints.",
      "risk": "read"
    },
    {
      "id": "cmd47",
      "category": "Kubernetes",
      "command": "kubectl get endpointslices -n NAMESPACE",
      "purpose": "Inspect service endpoint discovery.",
      "interpretation": "An empty slice can indicate no ready backends.",
      "risk": "read"
    },
    {
      "id": "cmd48",
      "category": "VMware",
      "command": "vmware-toolbox-cmd -v",
      "purpose": "Check VMware Tools version inside a guest.",
      "interpretation": "Guest command; not an ESXi management command.",
      "risk": "read"
    },
    {
      "id": "cmd49",
      "category": "VMware",
      "command": "esxcli vm process list",
      "purpose": "List VMs running on an ESXi host shell.",
      "interpretation": "ESXi-only, requires authorised host access.",
      "risk": "read"
    },
    {
      "id": "cmd50",
      "category": "VMware",
      "command": "esxcli storage filesystem list",
      "purpose": "List ESXi storage volumes/datastores.",
      "interpretation": "ESXi-only: inspect datastore capacity and mount status.",
      "risk": "read"
    }
  ],
  "errors": [
    {
      "id": "err0",
      "title": "Connection refused",
      "category": "Networking",
      "meaning": "The TCP destination actively rejected the connection, commonly because nothing listens there.",
      "causes": "Wrong IP/port; process down; loopback-only bind; firewall reject.",
      "commands": [
        "getent hosts HOSTNAME",
        "sudo ss -lntp"
      ],
      "next": "Compare localhost and remote IP tests. A refused connection does not by itself identify the missing process."
    },
    {
      "id": "err1",
      "title": "Connection timed out",
      "category": "Networking",
      "meaning": "The TCP connection was not established before timeout.",
      "causes": "Firewall drop; missing route; unreachable node; upstream/network failure.",
      "commands": [
        "ip route",
        "curl -v --connect-timeout 5 http://HOST:PORT/"
      ],
      "next": "Check reachability along the path and whether SYN traffic reaches destination."
    },
    {
      "id": "err2",
      "title": "Name or service not known",
      "category": "DNS",
      "meaning": "Hostname could not be resolved.",
      "causes": "Typo; unavailable DNS record; wrong search domain; resolver failure.",
      "commands": [
        "getent hosts HOSTNAME",
        "resolvectl status"
      ],
      "next": "Validate the exact hostname and DNS configuration before changing anything."
    },
    {
      "id": "err3",
      "title": "status=203/EXEC",
      "category": "systemd",
      "meaning": "systemd could not execute the configured ExecStart program.",
      "causes": "Missing binary; wrong path; permission denied; malformed executable or shebang.",
      "commands": [
        "systemctl cat SERVICE",
        "journalctl -u SERVICE --since '30 min ago' --no-pager"
      ],
      "next": "Find the underlying exec error, verify file path and executable permissions, then change and restart safely."
    },
    {
      "id": "err4",
      "title": "status=1/FAILURE",
      "category": "systemd",
      "meaning": "The process exited with code 1; the code is application-specific.",
      "causes": "Bad config, missing dependency, failed startup checks, permission issues.",
      "commands": [
        "journalctl -u SERVICE --since '30 min ago' --no-pager",
        "systemctl cat SERVICE"
      ],
      "next": "Read the application error; exit 1 alone is not root cause."
    },
    {
      "id": "err5",
      "title": "HTTP 502 Bad Gateway",
      "category": "HTTP",
      "meaning": "A gateway/proxy received an invalid response from an upstream.",
      "causes": "Origin down, wrong upstream port, TLS mismatch, premature closure.",
      "commands": [
        "sudo ss -lntp",
        "curl -v --connect-timeout 5 http://HOST:PORT/"
      ],
      "next": "Identify gateway and upstream separately; test upstream directly."
    },
    {
      "id": "err6",
      "title": "HTTP 503 Service Unavailable",
      "category": "HTTP",
      "meaning": "Service cannot currently handle the request.",
      "causes": "No ready backends; overload; maintenance; dependency failure.",
      "commands": [
        "systemctl status SERVICE --no-pager",
        "kubectl get endpointslices -n NAMESPACE"
      ],
      "next": "Determine which layer generated the 503 before restarting anything."
    },
    {
      "id": "err7",
      "title": "HTTP 504 Gateway Timeout",
      "category": "HTTP",
      "meaning": "Gateway timed out waiting for upstream.",
      "causes": "Slow service, stuck dependency, congested network, too-short timeout.",
      "commands": [
        "top",
        "curl -v --connect-timeout 5 http://HOST:PORT/"
      ],
      "next": "Compare gateway timeout and direct upstream response times."
    },
    {
      "id": "err8",
      "title": "Permission denied",
      "category": "Linux",
      "meaning": "The requested operation lacks sufficient permissions.",
      "causes": "Filesystem mode; ownership; ACL; sudo policy; SELinux/AppArmor.",
      "commands": [
        "id && whoami",
        "ps -fp PID"
      ],
      "next": "Inspect user, groups and parent directory traversal permissions; do not chmod 777."
    },
    {
      "id": "err9",
      "title": "No space left on device",
      "category": "Storage",
      "meaning": "Filesystem allocation failed.",
      "causes": "Full filesystem; inode exhaustion; deleted open files.",
      "commands": [
        "df -h",
        "df -i"
      ],
      "next": "Identify exact mount first, then consumers; avoid deleting live logs blindly."
    },
    {
      "id": "err10",
      "title": "OOMKilled / exit 137",
      "category": "Memory",
      "meaning": "A process/container may have been killed due to memory pressure; exit 137 also has other causes.",
      "causes": "Memory limit exceeded; host pressure; SIGKILL from another source.",
      "commands": [
        "free -h",
        "sudo journalctl -k --since '1 hour ago' | grep -i -E 'out of memory|killed process'"
      ],
      "next": "Correlate kernel/container events with limits and process usage."
    },
    {
      "id": "err11",
      "title": "CrashLoopBackOff",
      "category": "Kubernetes",
      "meaning": "Kubernetes is backing off repeated container restarts.",
      "causes": "Application crash; bad command; missing config; failed liveness probe.",
      "commands": [
        "kubectl describe pod POD -n NAMESPACE",
        "kubectl logs POD -n NAMESPACE --previous"
      ],
      "next": "Read last terminated container logs and Events to identify why it restarted."
    },
    {
      "id": "err12",
      "title": "ImagePullBackOff",
      "category": "Kubernetes",
      "meaning": "Kubernetes cannot obtain a container image.",
      "causes": "Wrong image tag; registry permissions; network failure; image pull secrets.",
      "commands": [
        "kubectl describe pod POD -n NAMESPACE",
        "kubectl get pods -A -o wide"
      ],
      "next": "Look at Events for registry error and verify image reference/credentials."
    },
    {
      "id": "err13",
      "title": "Read-only file system",
      "category": "Storage",
      "meaning": "Kernel or mount settings prohibit writes.",
      "causes": "Intentionally read-only mount; filesystem remounted after error; underlying storage problem.",
      "commands": [
        "lsblk -f",
        "sudo journalctl -k --since '1 hour ago' | grep -i -E 'out of memory|killed process'"
      ],
      "next": "Inspect mount and kernel I/O errors before attempting remount."
    },
    {
      "id": "err14",
      "title": "SSH Permission denied (publickey)",
      "category": "SSH",
      "meaning": "Server rejected SSH authentication.",
      "causes": "Missing key; wrong identity; account disabled; server policy.",
      "commands": [
        "id && whoami",
        "journalctl -u SERVICE --since '30 min ago' --no-pager"
      ],
      "next": "Client ssh -vvv and server SSH logs reveal which auth method failed."
    }
  ],
  "questions": [
    {
      "id": "q0",
      "q": "Application unavailable, which question comes first?",
      "options": [
        "Which process should I kill?",
        "What exact endpoint, environment, scope and error are affected?",
        "Can I restart all web services?",
        "Is the developer sure?"
      ],
      "correct": 1,
      "why": "Locate the right workload and blast radius before interacting with infrastructure."
    },
    {
      "id": "q1",
      "q": "systemctl is active, but remote curl gets connection refused. Next?",
      "options": [
        "Restart systemd",
        "Check bind address and target IP/port using ss",
        "Delete DNS records",
        "Increase CPU"
      ],
      "correct": 1,
      "why": "An active unit can bind only to 127.0.0.1 or a different port."
    },
    {
      "id": "q2",
      "q": "What does 203/EXEC prove?",
      "options": [
        "Python is missing everywhere",
        "The unit could not execute ExecStart",
        "DNS has failed",
        "The VM is out of storage"
      ],
      "correct": 1,
      "why": "Check path, execute permission, shebang and detailed journal message."
    },
    {
      "id": "q3",
      "q": "Which command first identifies a TCP listener owner?",
      "options": [
        "sudo ss -lntp",
        "df -h",
        "ls -la /",
        "whoami"
      ],
      "correct": 0,
      "why": "ss maps listening ports, addresses and owning PIDs."
    },
    {
      "id": "q4",
      "q": "Which is the safest response to 95% disk use?",
      "options": [
        "rm -rf /var/log",
        "Reboot immediately",
        "Confirm affected mount and find consumers before changes",
        "Disable journald"
      ],
      "correct": 2,
      "why": "First verify mount, inodes, directories and open deleted files."
    },
    {
      "id": "q5",
      "q": "HA versus vMotion?",
      "options": [
        "Both preserve running processes after hardware failure",
        "HA restarts workloads after failure; vMotion live-migrates healthy workloads",
        "HA is a DNS service",
        "vMotion requires VM shutdown"
      ],
      "correct": 1,
      "why": "Availability after failure and planned live movement are different guarantees."
    },
    {
      "id": "q6",
      "q": "What does a Kubernetes CrashLoopBackOff tell you?",
      "options": [
        "The application code is definitely broken",
        "The cluster is out of CPU",
        "Repeated container restarts; investigate previous logs and events",
        "DNS always failed"
      ],
      "correct": 2,
      "why": "Crash reason may be app, probe, command, permissions or dependency."
    },
    {
      "id": "q7",
      "q": "Why is checking kubectl context a production safety step?",
      "options": [
        "It improves speed",
        "It ensures your commands target the intended cluster",
        "It restarts kubelet",
        "It repairs TLS"
      ],
      "correct": 1,
      "why": "A correct command against the wrong environment is still a production incident."
    },
    {
      "id": "q8",
      "q": "HTTP 502 from reverse proxy: what do you check?",
      "options": [
        "Proxy/upstream boundary and upstream health",
        "Only browser cache",
        "Always restart database",
        "VMware Tools version"
      ],
      "correct": 0,
      "why": "Identify which layer generated the error and whether origin answers directly."
    },
    {
      "id": "q9",
      "q": "The service is healthy locally but fails externally. Likely area?",
      "options": [
        "Local process memory only",
        "Bind addresses, firewalls, LB and network path",
        "Filesystem permissions only",
        "System time"
      ],
      "correct": 1,
      "why": "Compare exact paths and ports from both origins."
    },
    {
      "id": "q10",
      "q": "One ESXi host fails and HA restarts VMs. What is required?",
      "options": [
        "Zero downtime is guaranteed",
        "Enough capacity and accessible required storage on survivors",
        "No vCenter or cluster configuration",
        "DNS SRV record"
      ],
      "correct": 1,
      "why": "HA requires compatible cluster settings, restart capacity and suitable storage."
    },
    {
      "id": "q11",
      "q": "What makes a good incident report?",
      "options": [
        "A list of commands only",
        "A plausible story without logs",
        "Timeline, impact, evidence, cause, remediation, verification, prevention",
        "A public copy of raw secrets"
      ],
      "correct": 2,
      "why": "Evidence-based handover and prevention matter more than volume."
    }
  ],
  "labs": [
    {
      "id": "lab01",
      "name": "Mystery process on port 8080",
      "domain": "Linux",
      "difficulty": "Beginner",
      "report": "Customer calls 192.168.112.129:8080 and receives Connection refused. You do not know the application name.",
      "output": "sudo ss -lntp\nLISTEN 127.0.0.1:8080 users:((\"python3\",pid=2863,fd=3))\nsystemctl list-units --type=service --state=running\n... lab-web.service active running",
      "ask": "Why can the service be active yet unavailable via the VM IP?",
      "hints": [
        "Compare 127.0.0.1 against 192.168.112.129.",
        "Listener binding limits which interface accepts traffic."
      ],
      "solution": "Python listens only on the VM's loopback interface. A remote connection to VM-IP:8080 does not reach that listener. Diagnose exposure and security requirements before changing the bind address.",
      "verify": "Compare curl http://127.0.0.1:8080 on VM with curl http://VM-IP:8080 from Windows."
    },
    {
      "id": "lab02",
      "name": "systemd 203/EXEC",
      "domain": "systemd",
      "difficulty": "Beginner",
      "report": "Application is unavailable immediately after a service unit deployment.",
      "output": "lab-web.service: Failed at step EXEC spawning /usr/bin/python-not-real: No such file or directory\nMain process exited, status=203/EXEC",
      "ask": "Which file and configuration do you check before restarting?",
      "hints": [
        "Look at systemctl cat lab-web.",
        "Find the configured ExecStart path and verify existence."
      ],
      "solution": "Correct ExecStart to a valid executable after verifying it with command -v/ls. Run systemctl daemon-reload, restart the unit and validate its endpoint. This lab intentionally demonstrates a bad unit, not a reason to blindly restart.",
      "verify": "systemctl is-active lab-web && curl http://127.0.0.1:8080"
    },
    {
      "id": "lab03",
      "name": "Unknown service down",
      "domain": "Discovery",
      "difficulty": "Intermediate",
      "report": "An incident ticket contains only: 'Website down on port 9090'. No service name provided.",
      "output": "sudo ss -lntp | grep ':9090'  # no output\nsystemctl --failed\napi-gateway.service loaded failed failed",
      "ask": "How do you prove which service should own port 9090?",
      "hints": [
        "The missing listener cannot reveal a PID.",
        "Inspect api-gateway unit and installed configs for port 9090."
      ],
      "solution": "Inspect systemctl cat api-gateway, journalctl -u api-gateway and deployment/service inventory. Search relevant configuration for 9090. Do not equate one failed service with ownership until the mapping is verified.",
      "verify": "After approved remediation, ss -lntp shows the expected listener and curl verifies the endpoint."
    },
    {
      "id": "lab04",
      "name": "Filesystem 100% full",
      "domain": "Storage",
      "difficulty": "Intermediate",
      "report": "An application cannot write logs. User reports 'No space left on device'.",
      "output": "df -h\n/dev/sdb1  8G  8G  0 100% /var\ndf -i\n/dev/sdb1 500K 12K 488K 3% /var",
      "ask": "What do you inspect next, without deleting anything?",
      "hints": [
        "The /var filesystem is full in bytes, not inodes.",
        "Compare du -xhd1 /var and lsof +L1."
      ],
      "solution": "Investigate data consumers on /var, including deleted open files. Plan safe cleanup/offload with service owners; deleting files blindly can destroy evidence or active data.",
      "verify": "df -h shows recovered headroom and the original application write succeeds."
    },
    {
      "id": "lab05",
      "name": "Kubernetes CrashLoopBackOff",
      "domain": "Kubernetes",
      "difficulty": "Intermediate",
      "report": "A Kubernetes pod repeatedly starts and fails after a deployment.",
      "output": "kubectl get pod\npayments-7f49   0/1 CrashLoopBackOff\nkubectl describe pod\nLast State: Terminated   Reason: Error  Exit Code: 1",
      "ask": "How do you distinguish failed probe, app crash and configuration issue?",
      "hints": [
        "Exit code alone is not root cause.",
        "Use kubectl logs --previous and describe Events."
      ],
      "solution": "Gather previous container logs and pod events, identify the earliest meaningful error, inspect config/probes and correlate with the recent deployment.",
      "verify": "Pod stays Ready, restarts stop increasing and a real request through Service/Ingress succeeds."
    },
    {
      "id": "lab06",
      "name": "DNS resolution failure",
      "domain": "Networking",
      "difficulty": "Intermediate",
      "report": "curl cannot resolve api.internal.example, while curl by numeric IP connects.",
      "output": "curl: (6) Could not resolve host: api.internal.example\ngetent hosts api.internal.example\n# no result",
      "ask": "Which layer is broken and which evidence distinguishes missing DNS record from local resolver problems?",
      "hints": [
        "Inspect getent result and resolvectl status.",
        "Compare the expected DNS zone and which DNS server was queried."
      ],
      "solution": "The failure is name resolution, not proven network loss. Verify spelling, DNS record and search domain, resolver configuration and connectivity to resolver.",
      "verify": "getent hosts resolves the intended address and the same hostname-based curl reaches the correct service."
    },
    {
      "id": "lab07",
      "name": "CPU saturation and latency",
      "domain": "Performance",
      "difficulty": "Advanced",
      "report": "Users report intermittent 504s and latency. Machine is online.",
      "output": "uptime\nload average: 8.5, 9.1, 8.7\ntop\nPID 4216 java 187% CPU",
      "ask": "What additional checks prevent an incorrect CPU-only diagnosis?",
      "hints": [
        "Check CPU count and distinguish CPU from I/O waiting.",
        "Correlate process spikes, thread stacks and upstream timeouts."
      ],
      "solution": "High load and process CPU are clues, not proof of sole cause. Review CPU saturation vs available cores, I/O wait, request metrics, process traces and dependencies before changing limits.",
      "verify": "Request latency/timeout rate return to baseline across external monitors."
    },
    {
      "id": "lab08",
      "name": "VMware host maintenance",
      "domain": "VMware",
      "difficulty": "Advanced",
      "report": "A physical ESXi host requires maintenance but runs production VMs.",
      "output": "Host A: 14 VMs; Host B: 78% memory use; shared datastore accessible",
      "ask": "What must be verified before scheduling live migrations and what happens if Host A dies instead?",
      "hints": [
        "Check destination capacity, compatibility, networking and storage access.",
        "vMotion and HA are different operations."
      ],
      "solution": "For planned maintenance verify vMotion prerequisites, capacity and cluster constraints. If host unexpectedly dies, HA may restart affected VMs on surviving hosts with downtime, assuming capacity and accessible storage.",
      "verify": "Confirm migrated VMs serve requests and physical host can enter maintenance safely."
    }
  ],
  "runbooks": [
    {
      "name": "Unknown application or host",
      "domain": "Discovery",
      "symptom": "You only have an endpoint or IP:port, and need to find ownership.",
      "checks": [
        "Confirm hostname, environment, URL and owner via inventory/deployments",
        "Verify correct host: hostnamectl / ip -br addr",
        "Discover live listeners with sudo ss -lntp",
        "Map PID to command and unit; if absent search failed services/configs",
        "Correlate service logs with user incident timestamp"
      ],
      "verify": "Map endpoint → target host → process/service → app owner with evidence."
    },
    {
      "name": "Connection refused",
      "domain": "Networking",
      "symptom": "Client TCP connect is rejected.",
      "checks": [
        "Resolve destination and confirm exact port",
        "Test from client and locally on target",
        "Inspect sudo ss -lntp for interface binding",
        "If no listener, check systemctl --failed and service logs",
        "Inspect firewall reject and proxy/LB configuration"
      ],
      "verify": "External request to intended endpoint succeeds, not only localhost."
    },
    {
      "name": "Connection timeout",
      "domain": "Networking",
      "symptom": "Client waits and never connects.",
      "checks": [
        "Check DNS resolution separately",
        "Confirm local IP and routing",
        "Test TCP with timeout; identify hop where traffic stops",
        "Check network firewalls and listener presence",
        "Coordinate packet captures only when authorised"
      ],
      "verify": "Connections establish reliably and dependency response meets latency target."
    },
    {
      "name": "systemd service fails to start",
      "domain": "systemd",
      "symptom": "Unit fails on startup or restart.",
      "checks": [
        "systemctl status SERVICE --no-pager",
        "journalctl -u SERVICE --since '30 min ago' --no-pager",
        "systemctl cat SERVICE; confirm ExecStart/User/Environment",
        "Inspect executable, permissions, configuration and dependencies",
        "Make approved fix, daemon-reload if unit changed, restart and verify"
      ],
      "verify": "Unit active with expected process and application-level health check passes."
    },
    {
      "name": "HTTP 502 / 503 / 504",
      "domain": "HTTP",
      "symptom": "Gateway responds with server error.",
      "checks": [
        "Identify where HTTP code was generated (LB/proxy/app)",
        "Check gateway access/error logs and upstream destination",
        "Test upstream directly (authorised)",
        "Inspect service readiness, timeout, connection pools and resource pressure",
        "Compare timeline with deploy/config changes"
      ],
      "verify": "Success from full client→gateway→upstream path with stable rates."
    },
    {
      "name": "Out of disk space",
      "domain": "Storage",
      "symptom": "Write failures, full filesystem or inodes.",
      "checks": [
        "df -h and df -i on relevant mount",
        "du -xhd1 on that filesystem",
        "lsof +L1 for deleted files still open",
        "Check storage health and log retention policy",
        "Execute reviewed cleanup/expansion only after owner agreement"
      ],
      "verify": "Capacity headroom maintained and original write path successful."
    },
    {
      "name": "Memory pressure / OOM",
      "domain": "Memory",
      "symptom": "Service killed or restarting, host under pressure.",
      "checks": [
        "free -h and process RSS",
        "Inspect kernel OOM entries and container status",
        "Check memory limits and workload change",
        "Look for leaks, bursts, swap/eviction pressure",
        "Fix workload/limits with rollback plan"
      ],
      "verify": "Memory stable under realistic workload and no new OOM events."
    },
    {
      "name": "Kubernetes CrashLoopBackOff",
      "domain": "Kubernetes",
      "symptom": "Pod restarts repeatedly and cannot become Ready.",
      "checks": [
        "kubectl config current-context",
        "kubectl get pods -A -o wide",
        "kubectl describe pod POD -n NAMESPACE",
        "kubectl logs POD -n NAMESPACE --previous",
        "Investigate app errors, probes, config and dependencies"
      ],
      "verify": "Pod Ready, no repeated restarts, service requests succeed."
    },
    {
      "name": "SSH cannot connect",
      "domain": "SSH",
      "symptom": "Remote terminal connection fails.",
      "checks": [
        "Confirm host/IP with inventory and known maintenance",
        "Distinguish timeout, refused and permission denied",
        "If console access available: ss -lntp | grep :22",
        "systemctl status ssh and journalctl -u ssh",
        "Inspect host firewall, SSH config and auth policies safely"
      ],
      "verify": "Authorised SSH client connects using intended authentication without loosening security."
    },
    {
      "name": "VMware ESXi host failure",
      "domain": "VMware",
      "symptom": "VMs unreachable after hypervisor incident.",
      "checks": [
        "Confirm host/VM state via authorised vCenter/ESXi inventory",
        "Review host alarms, storage and network health",
        "Check HA events and restart progress",
        "Verify surviving host capacity and datastore access",
        "Check each recovered application's external health"
      ],
      "verify": "VMs are running on healthy hosts and application SLIs recovered."
    }
  ],
  "tree": {
    "start": {
      "q": "What is your observed failure?",
      "help": "Do not infer a root cause from the alert title. Pick what the requester or monitor actually reports.",
      "options": [
        [
          "Hostname does not resolve",
          "dns1"
        ],
        [
          "Connection refused",
          "ref1"
        ],
        [
          "Connection timed out",
          "time1"
        ],
        [
          "HTTP 5xx error",
          "http1"
        ],
        [
          "App slow / high latency",
          "slow1"
        ],
        [
          "Service will not start",
          "svc1"
        ],
        [
          "Kubernetes restarting",
          "kube1"
        ],
        [
          "Don't know the endpoint owner",
          "unknown1"
        ]
      ]
    },
    "dns1": {
      "q": "Does getent hosts HOSTNAME return an address?",
      "cmd": [
        "getent hosts HOSTNAME",
        "resolvectl status"
      ],
      "options": [
        [
          "No answer",
          "dnsNo"
        ],
        [
          "Unexpected IP",
          "dnsWrong"
        ],
        [
          "Expected IP",
          "dnsYes"
        ]
      ]
    },
    "dnsNo": {
      "leaf": "Name resolution is failing",
      "hypothesis": "Missing/wrong record, search domain or DNS resolver issue.",
      "cmd": [
        "resolvectl status",
        "getent hosts HOSTNAME"
      ],
      "verify": "Validate authoritative record and resolver route, then retest by hostname."
    },
    "dnsWrong": {
      "leaf": "Wrong destination from DNS",
      "hypothesis": "Stale DNS, split-horizon record, wrong search domain or misconfigured service discovery.",
      "cmd": [
        "getent hosts HOSTNAME",
        "ip route"
      ],
      "verify": "Confirm intended answer with DNS/app owner before changing records."
    },
    "dnsYes": {
      "leaf": "DNS appears to work here",
      "hypothesis": "Move to TCP/HTTP investigation. Another client may see different DNS results.",
      "cmd": [
        "curl -v --connect-timeout 5 http://HOST:PORT/"
      ],
      "verify": "Compare DNS results from affected and unaffected clients."
    },
    "ref1": {
      "q": "On the destination host, is any process listening at the expected port?",
      "cmd": [
        "sudo ss -lntp",
        "ip -br addr"
      ],
      "options": [
        [
          "No listener",
          "refNo"
        ],
        [
          "127.0.0.1 only",
          "refLoop"
        ],
        [
          "Expected externally reachable address",
          "refYes"
        ]
      ]
    },
    "refNo": {
      "q": "Does systemctl --failed show an expected service?",
      "cmd": [
        "systemctl --failed",
        "systemctl list-unit-files --type=service"
      ],
      "options": [
        [
          "Yes: failed service",
          "refFailed"
        ],
        [
          "No obvious failed unit",
          "refUnknown"
        ]
      ]
    },
    "refFailed": {
      "leaf": "Investigate failed service",
      "hypothesis": "Start configuration, dependency, permissions or executable failure.",
      "cmd": [
        "systemctl status SERVICE --no-pager",
        "journalctl -u SERVICE --since '30 min ago' --no-pager",
        "systemctl cat SERVICE"
      ],
      "verify": "Fix demonstrated fault; confirm listener and external endpoint after approval."
    },
    "refUnknown": {
      "leaf": "Discover service ownership before repair",
      "hypothesis": "Workload might be containerised, manually launched, or expected on another machine.",
      "cmd": [
        "ps auxww",
        "docker ps -a",
        "systemctl list-units --type=service --all"
      ],
      "verify": "Use service inventory/deployment records to map port to owner."
    },
    "refLoop": {
      "leaf": "Likely loopback binding mismatch",
      "hypothesis": "App accepts 127.0.0.1 only, not VM external IP; may be intentional behind proxy.",
      "cmd": [
        "sudo ss -lntp",
        "curl -v --connect-timeout 5 http://127.0.0.1:PORT/"
      ],
      "verify": "Check intended architecture. Change binding only if allowed; test from client network."
    },
    "refYes": {
      "leaf": "Listener present: verify actual network path",
      "hypothesis": "Target IP mismatch, firewall rejection, LB routing, or active socket backlog issue.",
      "cmd": [
        "ip -br addr",
        "sudo ufw status verbose",
        "curl -v --connect-timeout 5 http://HOST:PORT/"
      ],
      "verify": "Compare client-side and local connection attempts before concluding."
    },
    "time1": {
      "q": "Can the destination host be reached through another approved management path?",
      "cmd": [
        "ip route",
        "ip -br addr"
      ],
      "options": [
        [
          "Host not reachable",
          "timeHost"
        ],
        [
          "Host reachable, port times out",
          "timePort"
        ]
      ]
    },
    "timeHost": {
      "leaf": "Investigate routing, host state and firewall path",
      "hypothesis": "Host down, routing error, dropped traffic or ACL blocking transit.",
      "cmd": [
        "ip route",
        "tracepath HOSTNAME"
      ],
      "verify": "Correlate route and firewall telemetry with target VM/host status."
    },
    "timePort": {
      "leaf": "Likely filtering or service path fault",
      "hypothesis": "Firewall drop, LB path, application/network overload or wrong port.",
      "cmd": [
        "sudo ss -lntp",
        "curl -v --connect-timeout 5 http://HOST:PORT/"
      ],
      "verify": "Test from multiple vantage points and inspect network filters."
    },
    "http1": {
      "q": "Can you reach the origin application directly, bypassing the gateway?",
      "cmd": [
        "curl -v --connect-timeout 5 http://HOST:PORT/"
      ],
      "options": [
        [
          "Origin succeeds",
          "httpGateway"
        ],
        [
          "Origin also errors or times out",
          "httpOrigin"
        ]
      ]
    },
    "httpGateway": {
      "leaf": "Suspect gateway configuration or upstream path",
      "hypothesis": "Proxy target, TLS, health checks, timeout or gateway-specific issue.",
      "cmd": [
        "sudo ss -lntp",
        "journalctl -u SERVICE --since '30 min ago' --no-pager"
      ],
      "verify": "Check proxy/upstream logs and validate full request path."
    },
    "httpOrigin": {
      "leaf": "Suspect application or dependency",
      "hypothesis": "Application crash, readiness, saturation or downstream dependency.",
      "cmd": [
        "systemctl status SERVICE --no-pager",
        "top",
        "journalctl -u SERVICE --since '30 min ago' --no-pager"
      ],
      "verify": "Find first causal app error and restore both origin and gateway."
    },
    "slow1": {
      "q": "Does the host show a clear CPU, memory or disk bottleneck?",
      "cmd": [
        "uptime",
        "top",
        "free -h",
        "df -h"
      ],
      "options": [
        [
          "Yes, resource pressure",
          "slowRes"
        ],
        [
          "No obvious local bottleneck",
          "slowDep"
        ]
      ]
    },
    "slowRes": {
      "leaf": "Quantify resource saturation and source",
      "hypothesis": "Runaway process, memory leak, disk pressure or I/O waits.",
      "cmd": [
        "ps -eo pid,comm,%cpu,%mem,rss --sort=-%cpu | head",
        "free -h",
        "df -h"
      ],
      "verify": "Compare metrics with baseline and response-time improvement."
    },
    "slowDep": {
      "leaf": "Trace application and dependencies",
      "hypothesis": "DB pool saturation, network delay, lock contention, slow upstream or gateway timeout.",
      "cmd": [
        "sudo ss -ntp",
        "curl -v --connect-timeout 5 http://HOST:PORT/"
      ],
      "verify": "Correlate request traces, external dependencies and queueing."
    },
    "svc1": {
      "q": "What does systemctl status show?",
      "cmd": [
        "systemctl status SERVICE --no-pager",
        "journalctl -u SERVICE --since '30 min ago' --no-pager"
      ],
      "options": [
        [
          "203/EXEC or cannot execute",
          "svcExec"
        ],
        [
          "Other exit or startup failure",
          "svcOther"
        ]
      ]
    },
    "svcExec": {
      "leaf": "ExecStart execution failure",
      "hypothesis": "Missing/invalid binary, no execute permission or broken interpreter.",
      "cmd": [
        "systemctl cat SERVICE",
        "systemctl show SERVICE -p ExecStart -p User"
      ],
      "verify": "Inspect path/permissions, correct unit with approval, daemon-reload and restart."
    },
    "svcOther": {
      "leaf": "Use journal and dependency evidence",
      "hypothesis": "Application config, permission, port conflict or startup dependency.",
      "cmd": [
        "journalctl -u SERVICE --since '30 min ago' --no-pager",
        "sudo ss -lntp"
      ],
      "verify": "Identify app-level cause before restarting."
    },
    "kube1": {
      "q": "What does pod Events or Last State show?",
      "cmd": [
        "kubectl config current-context",
        "kubectl describe pod POD -n NAMESPACE",
        "kubectl logs POD -n NAMESPACE --previous"
      ],
      "options": [
        [
          "Image pull / registry failure",
          "kubeImage"
        ],
        [
          "Crash or probe failure",
          "kubeCrash"
        ],
        [
          "Scheduling / volume failure",
          "kubeSched"
        ]
      ]
    },
    "kubeImage": {
      "leaf": "Resolve image acquisition",
      "hypothesis": "Missing tag, registry access, pull secret or image architecture mismatch.",
      "cmd": [
        "kubectl describe pod POD -n NAMESPACE"
      ],
      "verify": "Image pulled successfully and pod becomes Ready."
    },
    "kubeCrash": {
      "leaf": "Investigate previous termination",
      "hypothesis": "Bad startup command, app error, unhealthy probe, missing config or dependency.",
      "cmd": [
        "kubectl logs POD -n NAMESPACE --previous",
        "kubectl describe pod POD -n NAMESPACE"
      ],
      "verify": "No ongoing restarts and service responds."
    },
    "kubeSched": {
      "leaf": "Investigate scheduler and storage events",
      "hypothesis": "Node capacity, taints, PVC binding or volume mounting issue.",
      "cmd": [
        "kubectl describe pod POD -n NAMESPACE",
        "kubectl get pods -A -o wide"
      ],
      "verify": "Pod scheduled, volumes mounted and application healthy."
    },
    "unknown1": {
      "q": "Do you know which physical/virtual host or cluster serves the endpoint?",
      "cmd": [
        "getent hosts HOSTNAME",
        "sudo ss -lntp"
      ],
      "options": [
        [
          "Yes, I have host access",
          "unknownHost"
        ],
        [
          "No, ownership unknown",
          "unknownOwner"
        ]
      ]
    },
    "unknownHost": {
      "leaf": "Build endpoint-to-process map",
      "hypothesis": "Use sockets→PID→process→systemd unit or container. Failed apps need inventory/config inspection.",
      "cmd": [
        "sudo ss -lntp",
        "ps auxww",
        "systemctl --failed",
        "docker ps -a"
      ],
      "verify": "Document correct host, app owner, listener address, and deployment source."
    },
    "unknownOwner": {
      "leaf": "Return to infrastructure inventory",
      "hypothesis": "Service catalog, DNS, LB, monitoring or deployment records are needed. Do not scan random production hosts.",
      "cmd": [
        "getent hosts HOSTNAME"
      ],
      "verify": "Confirm owning team and actual target before connecting."
    }
  }
};
