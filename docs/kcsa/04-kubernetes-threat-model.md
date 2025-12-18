# Kubernetes Threat Model (16%)

This domain covers threat modeling concepts and common attack vectors in Kubernetes environments.

## Threat Modeling Frameworks

### STRIDE Model

| Threat | Description | Kubernetes Example |
|--------|-------------|-------------------|
| **S**poofing | Impersonating something or someone | Stolen service account token |
| **T**ampering | Modifying data or code | Modifying ConfigMaps or Secrets |
| **R**epudiation | Denying actions | Disabled audit logging |
| **I**nformation Disclosure | Exposing information | Secrets in environment variables |
| **D**enial of Service | Disrupting service | Resource exhaustion attacks |
| **E**levation of Privilege | Gaining higher privileges | Container escape |

### MITRE ATT&CK for Containers

Key tactics relevant to Kubernetes:

| Tactic | Description |
|--------|-------------|
| **Initial Access** | Gaining entry to the cluster |
| **Execution** | Running malicious code |
| **Persistence** | Maintaining access |
| **Privilege Escalation** | Gaining higher privileges |
| **Defense Evasion** | Avoiding detection |
| **Credential Access** | Stealing credentials |
| **Discovery** | Learning about the environment |
| **Lateral Movement** | Moving through the cluster |
| **Impact** | Disrupting operations |

## Common Attack Vectors

### Control Plane Attacks

```text
┌─────────────────────────────────────────────────────┐
│                  Attack Vectors                      │
├─────────────────────────────────────────────────────┤
│  • Exposed API Server                               │
│  • Weak authentication                              │
│  • Misconfigured RBAC                               │
│  • Unencrypted etcd                                 │
│  • Compromised certificates                         │
└─────────────────────────────────────────────────────┘
```

### Node-Level Attacks

- **Kubelet exploitation** - Anonymous access, read-only port
- **Container escape** - Privileged containers, host mounts
- **Node compromise** - SSH access, unpatched vulnerabilities

### Pod-Level Attacks

- **Malicious images** - Backdoored or vulnerable images
- **Sidecar injection** - Unauthorized container injection
- **Resource abuse** - Cryptomining, DoS

### Network-Based Attacks

- **Man-in-the-middle** - Unencrypted traffic
- **Pod-to-pod attacks** - No network policies
- **Service impersonation** - DNS spoofing

## Kubernetes Attack Scenarios

### Scenario 1: Compromised Container

```text
Attacker gains shell in container
         │
         ▼
┌─────────────────────┐
│ Enumerate environment│
│ - Service account   │
│ - Environment vars  │
│ - Mounted secrets   │
└─────────┬───────────┘
         │
         ▼
┌─────────────────────┐
│ Access Kubernetes API│
│ - List pods         │
│ - Read secrets      │
│ - Create resources  │
└─────────┬───────────┘
         │
         ▼
┌─────────────────────┐
│ Lateral movement    │
│ - Access other pods │
│ - Pivot to nodes    │
└─────────────────────┘
```

### Scenario 2: Supply Chain Attack

```text
┌─────────────────┐     ┌─────────────────┐
│ Compromised     │     │ Vulnerable      │
│ Base Image      │     │ Dependency      │
└────────┬────────┘     └────────┬────────┘
         │                       │
         └───────────┬───────────┘
                     │
                     ▼
            ┌─────────────────┐
            │ Application     │
            │ Container       │
            └────────┬────────┘
                     │
                     ▼
            ┌─────────────────┐
            │ Production      │
            │ Cluster         │
            └─────────────────┘
```

### Scenario 3: Privilege Escalation

```text
Limited Service Account
         │
         ▼
┌─────────────────────┐
│ Find misconfigured  │
│ RBAC permissions    │
└─────────┬───────────┘
         │
         ▼
┌─────────────────────┐
│ Create privileged   │
│ pod or escalate     │
└─────────┬───────────┘
         │
         ▼
┌─────────────────────┐
│ Access node or      │
│ cluster resources   │
└─────────────────────┘
```

## Threat Mitigation Strategies

### API Server Protection

```yaml
# Restrict API access
--anonymous-auth=false
--authorization-mode=Node,RBAC
--enable-admission-plugins=NodeRestriction,PodSecurity
--audit-log-path=/var/log/audit.log
```

### Network Segmentation

```yaml
# Default deny all traffic
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
```

### Pod Security

```yaml
# Restricted pod configuration
apiVersion: v1
kind: Pod
metadata:
  name: secure-pod
spec:
  securityContext:
    runAsNonRoot: true
    seccompProfile:
      type: RuntimeDefault
  containers:
  - name: app
    image: app:v1
    securityContext:
      allowPrivilegeEscalation: false
      readOnlyRootFilesystem: true
      capabilities:
        drop: ["ALL"]
```

### Runtime Security

Tools for runtime threat detection:

| Tool | Purpose |
|------|---------|
| **Falco** | Runtime security monitoring |
| **Sysdig** | Container visibility |
| **Aqua** | Full lifecycle security |
| **Prisma Cloud** | Cloud native security |

## Security Scanning

### Image Scanning

```bash
# Example: Trivy scanner
trivy image nginx:1.21
trivy image --severity HIGH,CRITICAL nginx:1.21
```

### Configuration Scanning

```bash
# Example: kubesec
kubesec scan pod.yaml

# Example: kube-bench (CIS benchmarks)
kube-bench run --targets master
```

### Vulnerability Categories

| Category | Examples |
|----------|----------|
| **CVE** | Known vulnerabilities |
| **Misconfigurations** | Privileged containers, no limits |
| **Secrets exposure** | Hardcoded credentials |
| **Compliance** | CIS benchmark failures |

## Incident Response

### Detection

- Monitor audit logs
- Runtime security alerts
- Anomaly detection
- Network traffic analysis

### Containment

- Isolate compromised pods
- Revoke credentials
- Apply network policies
- Cordon affected nodes

### Eradication

- Remove malicious workloads
- Patch vulnerabilities
- Rotate secrets
- Update images

### Recovery

- Restore from backups
- Redeploy clean workloads
- Verify security posture
- Document lessons learned

## Key Concepts to Remember

1. **STRIDE** - Six categories of threats
2. **MITRE ATT&CK** - Comprehensive attack framework
3. **Defense in depth** - Multiple security layers
4. **Least privilege** - Minimize permissions
5. **Runtime security** - Detect threats in real-time

## Practice Questions

1. What does STRIDE stand for?
2. Name three common Kubernetes attack vectors.
3. How can you detect a compromised container at runtime?
4. What is the first step in incident response?
5. Why is supply chain security important in Kubernetes?

---

[← Previous: Kubernetes Security Fundamentals](./03-kubernetes-security-fundamentals.md) | [Back to KCSA Overview](./README.md) | [Next: Platform Security →](./05-platform-security.md)
