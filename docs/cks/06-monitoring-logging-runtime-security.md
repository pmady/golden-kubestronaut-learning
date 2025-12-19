# Monitoring, Logging and Runtime Security (20%)

This domain covers runtime security monitoring, audit logging, behavioral analysis, and threat detection in Kubernetes environments.

## Overview

Runtime security focuses on detecting and preventing threats while workloads are running. Key areas include:
- Behavioral analysis and anomaly detection
- Audit logging for compliance and forensics
- Container immutability enforcement
- System call monitoring

## Falco - Runtime Threat Detection

Falco is a CNCF project that provides runtime security by monitoring system calls and detecting anomalous behavior.

### Install Falco

```bash
# Using Helm
helm repo add falcosecurity https://falcosecurity.github.io/charts
helm repo update
helm install falco falcosecurity/falco \
  --namespace falco \
  --create-namespace \
  --set falcosidekick.enabled=true

# Verify installation
kubectl get pods -n falco
kubectl logs -n falco -l app.kubernetes.io/name=falco
```

### Falco Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Kubernetes Node                       │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐ │
│  │  Container  │    │  Container  │    │  Container  │ │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘ │
│         │                  │                  │         │
│         └──────────────────┼──────────────────┘         │
│                            │ System Calls               │
│                            ▼                            │
│  ┌─────────────────────────────────────────────────────┐│
│  │                    Linux Kernel                      ││
│  │  ┌─────────────────────────────────────────────┐   ││
│  │  │     eBPF/Kernel Module (Falco Driver)       │   ││
│  │  └─────────────────────────────────────────────┘   ││
│  └─────────────────────────────────────────────────────┘│
│                            │                            │
│                            ▼                            │
│  ┌─────────────────────────────────────────────────────┐│
│  │                   Falco Engine                       ││
│  │  ┌─────────┐  ┌─────────┐  ┌─────────────────────┐ ││
│  │  │  Rules  │  │ Filters │  │  Alert Generation   │ ││
│  │  └─────────┘  └─────────┘  └─────────────────────┘ ││
│  └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

### Falco Rules Structure

```yaml
# Rule components
- rule: <rule_name>           # Unique rule identifier
  desc: <description>         # Human-readable description
  condition: <filter>         # Sysdig filter expression
  output: <message>           # Alert message with fields
  priority: <level>           # EMERGENCY, ALERT, CRITICAL, ERROR, WARNING, NOTICE, INFO, DEBUG
  tags: [<tag1>, <tag2>]      # Optional categorization
  enabled: true/false         # Enable/disable rule
```

### Common Falco Rules

```yaml
# Detect shell spawning in containers
- rule: Terminal shell in container
  desc: A shell was used as the entrypoint/exec point into a container
  condition: >
    spawned_process and container
    and shell_procs
    and proc.tty != 0
    and container_entrypoint
  output: >
    Shell spawned in container
    (user=%user.name user_loginuid=%user.loginuid %container.info
    shell=%proc.name parent=%proc.pname cmdline=%proc.cmdline
    terminal=%proc.tty container_id=%container.id image=%container.image.repository)
  priority: WARNING
  tags: [container, shell, mitre_execution]

# Detect writes to sensitive directories
- rule: Write below etc
  desc: An attempt to write to /etc directory
  condition: >
    write and container
    and fd.directory = /etc
  output: >
    File written to /etc in container
    (user=%user.name command=%proc.cmdline
    file=%fd.name container=%container.name image=%container.image.repository)
  priority: ERROR
  tags: [filesystem, mitre_persistence]

# Detect package management in containers
- rule: Package management in container
  desc: Package management tool executed in container
  condition: >
    spawned_process and container
    and package_mgmt_procs
  output: >
    Package management process launched in container
    (user=%user.name command=%proc.cmdline container=%container.name)
  priority: ERROR
  tags: [process, software_mgmt]

# Detect sensitive file access
- rule: Read sensitive file
  desc: Sensitive file was read
  condition: >
    open_read and container
    and (fd.name startswith /etc/shadow or
         fd.name startswith /etc/passwd or
         fd.name startswith /etc/sudoers)
  output: >
    Sensitive file opened for reading
    (user=%user.name file=%fd.name container=%container.name)
  priority: WARNING
  tags: [filesystem, mitre_credential_access]

# Detect outbound connections to unusual ports
- rule: Unexpected outbound connection
  desc: Outbound connection to non-standard port
  condition: >
    outbound and container
    and not (fd.sport in (80, 443, 53, 8080, 8443))
  output: >
    Unexpected outbound connection
    (command=%proc.cmdline connection=%fd.name container=%container.name)
  priority: NOTICE
  tags: [network, mitre_exfiltration]
```

### Custom Falco Rules

```yaml
# /etc/falco/rules.d/custom-rules.yaml
- rule: Crypto mining detected
  desc: Detect crypto mining processes
  condition: >
    spawned_process and container
    and (proc.name in (xmrig, minerd, cpuminer, cgminer))
  output: >
    Crypto mining process detected
    (user=%user.name command=%proc.cmdline container=%container.name)
  priority: CRITICAL
  tags: [cryptomining, mitre_resource_hijacking]

- rule: Kubectl exec detected
  desc: Detect kubectl exec into containers
  condition: >
    spawned_process and container
    and proc.name = "runc"
    and proc.cmdline contains "exec"
  output: >
    Kubectl exec detected (container=%container.name cmdline=%proc.cmdline)
  priority: WARNING
  tags: [exec, mitre_execution]
```

### Falco Commands

```bash
# Check Falco status
systemctl status falco

# View Falco logs
kubectl logs -n falco -l app.kubernetes.io/name=falco -f

# Test Falco rules
kubectl exec -it <pod> -- /bin/sh  # Should trigger shell alert

# Reload rules
kill -1 $(pidof falco)

# Check rule syntax
falco -V /etc/falco/rules.d/custom-rules.yaml
```

## Kubernetes Audit Logging

Audit logging records all requests to the Kubernetes API server for security analysis and compliance.

### Audit Stages

| Stage | Description |
|-------|-------------|
| **RequestReceived** | Event generated when request is received |
| **ResponseStarted** | Response headers sent, body not yet sent |
| **ResponseComplete** | Response body completed |
| **Panic** | Events generated when panic occurs |

### Audit Levels

| Level | Description |
|-------|-------------|
| **None** | Don't log events |
| **Metadata** | Log request metadata only |
| **Request** | Log metadata and request body |
| **RequestResponse** | Log metadata, request, and response bodies |

### Comprehensive Audit Policy

```yaml
apiVersion: audit.k8s.io/v1
kind: Policy
rules:
  # Don't log read-only endpoints
  - level: None
    nonResourceURLs:
      - /healthz*
      - /version
      - /swagger*
      - /readyz*
      - /livez*

  # Don't log watch requests (too verbose)
  - level: None
    verbs: ["watch"]
    resources:
      - group: ""
        resources: ["events"]

  # Log secret access at Metadata level (don't log secret data)
  - level: Metadata
    resources:
      - group: ""
        resources: ["secrets", "configmaps"]

  # Log pod exec/attach at RequestResponse level
  - level: RequestResponse
    resources:
      - group: ""
        resources: ["pods/exec", "pods/attach", "pods/portforward"]

  # Log authentication events
  - level: RequestResponse
    resources:
      - group: "authentication.k8s.io"
        resources: ["tokenreviews"]

  # Log authorization events
  - level: RequestResponse
    resources:
      - group: "authorization.k8s.io"
        resources: ["subjectaccessreviews", "selfsubjectaccessreviews"]

  # Log RBAC changes
  - level: RequestResponse
    resources:
      - group: "rbac.authorization.k8s.io"
        resources: ["roles", "rolebindings", "clusterroles", "clusterrolebindings"]

  # Log node and namespace changes
  - level: RequestResponse
    resources:
      - group: ""
        resources: ["nodes", "namespaces"]

  # Log service account token creation
  - level: RequestResponse
    resources:
      - group: ""
        resources: ["serviceaccounts/token"]

  # Default: log at Metadata level
  - level: Metadata
    omitStages:
      - RequestReceived
```

### Enable Audit Logging on API Server

```yaml
# /etc/kubernetes/manifests/kube-apiserver.yaml
apiVersion: v1
kind: Pod
metadata:
  name: kube-apiserver
  namespace: kube-system
spec:
  containers:
  - command:
    - kube-apiserver
    # Audit configuration
    - --audit-policy-file=/etc/kubernetes/audit/audit-policy.yaml
    - --audit-log-path=/var/log/kubernetes/audit/audit.log
    - --audit-log-maxage=30
    - --audit-log-maxbackup=10
    - --audit-log-maxsize=100
    # Optional: webhook backend
    # - --audit-webhook-config-file=/etc/kubernetes/audit/webhook-config.yaml
    volumeMounts:
    - mountPath: /etc/kubernetes/audit
      name: audit-config
      readOnly: true
    - mountPath: /var/log/kubernetes/audit
      name: audit-log
  volumes:
  - hostPath:
      path: /etc/kubernetes/audit
      type: DirectoryOrCreate
    name: audit-config
  - hostPath:
      path: /var/log/kubernetes/audit
      type: DirectoryOrCreate
    name: audit-log
```

### Analyze Audit Logs

```bash
# View all audit events
cat /var/log/kubernetes/audit/audit.log | jq .

# Find delete operations
cat /var/log/kubernetes/audit/audit.log | jq 'select(.verb=="delete")'

# Find secret access
cat /var/log/kubernetes/audit/audit.log | jq 'select(.objectRef.resource=="secrets")'

# Find failed requests
cat /var/log/kubernetes/audit/audit.log | jq 'select(.responseStatus.code >= 400)'

# Find requests by user
cat /var/log/kubernetes/audit/audit.log | jq 'select(.user.username=="system:admin")'

# Find pod exec events
cat /var/log/kubernetes/audit/audit.log | jq 'select(.objectRef.subresource=="exec")'

# Find RBAC changes
cat /var/log/kubernetes/audit/audit.log | jq 'select(.objectRef.apiGroup=="rbac.authorization.k8s.io")'

# Count events by verb
cat /var/log/kubernetes/audit/audit.log | jq -r '.verb' | sort | uniq -c | sort -rn
```

### Audit Log Entry Structure

```json
{
  "kind": "Event",
  "apiVersion": "audit.k8s.io/v1",
  "level": "RequestResponse",
  "auditID": "unique-id",
  "stage": "ResponseComplete",
  "requestURI": "/api/v1/namespaces/default/pods",
  "verb": "create",
  "user": {
    "username": "admin",
    "groups": ["system:masters"]
  },
  "sourceIPs": ["192.168.1.100"],
  "objectRef": {
    "resource": "pods",
    "namespace": "default",
    "name": "nginx",
    "apiVersion": "v1"
  },
  "responseStatus": {
    "code": 201
  },
  "requestObject": { },
  "responseObject": { },
  "requestReceivedTimestamp": "2024-01-15T10:30:00.000000Z",
  "stageTimestamp": "2024-01-15T10:30:00.100000Z"
}
```

## Container Immutability

Immutable containers prevent runtime modifications, reducing attack surface.

### Read-Only Root Filesystem

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: immutable-pod
spec:
  containers:
  - name: app
    image: nginx:1.21
    securityContext:
      readOnlyRootFilesystem: true
      allowPrivilegeEscalation: false
      runAsNonRoot: true
      runAsUser: 1000
      capabilities:
        drop:
          - ALL
    volumeMounts:
    # Mount writable directories as needed
    - name: tmp
      mountPath: /tmp
    - name: var-run
      mountPath: /var/run
    - name: var-cache-nginx
      mountPath: /var/cache/nginx
  volumes:
  - name: tmp
    emptyDir: {}
  - name: var-run
    emptyDir: {}
  - name: var-cache-nginx
    emptyDir: {}
```

### Enforce Immutability with Pod Security Standards

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: production
  labels:
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/audit: restricted
    pod-security.kubernetes.io/warn: restricted
```

## Sysdig and Other Tools

### Sysdig for Troubleshooting

```bash
# Capture system calls
sysdig -c topprocs_cpu

# Monitor container activity
sysdig -c topcontainers_cpu

# Watch file opens in container
sysdig -c echo_fds container.name=nginx

# Monitor network connections
sysdig -c topconns

# Capture to file for analysis
sysdig -w capture.scap
sysdig -r capture.scap
```

## Key Concepts Summary

| Concept | Description | Tool/Feature |
|---------|-------------|--------------|
| **Runtime Detection** | Monitor running containers for threats | Falco |
| **Audit Logging** | Record API server activity | Kubernetes Audit |
| **Immutability** | Prevent runtime modifications | readOnlyRootFilesystem |
| **Behavioral Analysis** | Detect anomalous behavior | Falco rules |
| **System Call Monitoring** | Track kernel-level activity | eBPF, Sysdig |

## Practice Exercises

1. Install Falco and trigger a shell alert
2. Create a custom Falco rule to detect file writes to /tmp
3. Configure audit logging to capture secret access
4. Analyze audit logs to find failed authentication attempts
5. Create an immutable pod with read-only filesystem

---

[← Previous: Supply Chain Security](./05-supply-chain-security.md) | [Back to CKS Overview](./README.md) | [Next: Sample Questions →](./sample-questions.md)
