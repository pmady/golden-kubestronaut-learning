# Security Concepts Flashcards

Quick reference flashcards for Kubernetes security concepts (KCSA/CKS).

---

## RBAC

### Q: What are the four RBAC resources?

<details>
<summary>Answer</summary>

- **Role** - Namespace-scoped permissions
- **ClusterRole** - Cluster-scoped permissions
- **RoleBinding** - Binds Role to subjects in namespace
- **ClusterRoleBinding** - Binds ClusterRole cluster-wide

</details>

### Q: What are RBAC subjects?

<details>
<summary>Answer</summary>

- **User** - Human user (external)
- **Group** - Set of users
- **ServiceAccount** - Pod identity

</details>

### Q: What verbs are available in RBAC?

<details>
<summary>Answer</summary>

- get, list, watch (read)
- create, update, patch, delete (write)
- deletecollection
- use (for PodSecurityPolicies)
- bind, escalate (for Roles)

</details>

---

## Network Security

### Q: What does a default-deny NetworkPolicy look like?

<details>
<summary>Answer</summary>

```yaml
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

</details>

### Q: What are the NetworkPolicy selectors?

<details>
<summary>Answer</summary>

- **podSelector** - Select pods by labels
- **namespaceSelector** - Select namespaces by labels
- **ipBlock** - Select IP CIDR ranges

</details>

---

## Pod Security

### Q: What are the Pod Security Standards?

<details>
<summary>Answer</summary>

- **Privileged** - Unrestricted, no restrictions
- **Baseline** - Minimally restrictive, prevents known escalations
- **Restricted** - Heavily restricted, best practices

</details>

### Q: What security context fields prevent privilege escalation?

<details>
<summary>Answer</summary>

```yaml
securityContext:
  runAsNonRoot: true
  runAsUser: 1000
  allowPrivilegeEscalation: false
  readOnlyRootFilesystem: true
  capabilities:
    drop:
    - ALL
```

</details>

### Q: What is a privileged container?

<details>
<summary>Answer</summary>

A container with full access to host:
- All capabilities
- Access to all devices
- Can modify host kernel
- **Should be avoided in production**

</details>

---

## Secrets Management

### Q: How are Kubernetes secrets encoded?

<details>
<summary>Answer</summary>

Base64 encoded (NOT encrypted by default)

```bash
# Encode
echo -n 'password' | base64

# Decode
echo 'cGFzc3dvcmQ=' | base64 -d
```

</details>

### Q: How to encrypt secrets at rest?

<details>
<summary>Answer</summary>

Configure EncryptionConfiguration:

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: EncryptionConfiguration
resources:
- resources:
  - secrets
  providers:
  - aescbc:
      keys:
      - name: key1
        secret: <base64-key>
  - identity: {}
```

</details>

---

## Image Security

### Q: What is image scanning?

<details>
<summary>Answer</summary>

Analyzing container images for:
- Known vulnerabilities (CVEs)
- Misconfigurations
- Malware
- Compliance issues

Tools: Trivy, Clair, Anchore

</details>

### Q: What is image signing?

<details>
<summary>Answer</summary>

Cryptographically signing images to verify:
- Image authenticity
- Image integrity
- Publisher identity

Tools: Cosign, Notary

</details>

---

## Runtime Security

### Q: What is Falco?

<details>
<summary>Answer</summary>

Cloud-native runtime security tool:
- Detects abnormal behavior
- Uses kernel-level system calls
- Rule-based detection
- Real-time alerts

</details>

### Q: What is AppArmor?

<details>
<summary>Answer</summary>

Linux security module that:
- Restricts program capabilities
- Controls file access
- Controls network access
- Uses profiles (enforce/complain mode)

</details>

### Q: What is Seccomp?

<details>
<summary>Answer</summary>

Secure Computing Mode:
- Filters system calls
- Reduces attack surface
- Profiles define allowed syscalls
- RuntimeDefault profile recommended

</details>

---

## Supply Chain Security

### Q: What is SBOM?

<details>
<summary>Answer</summary>

Software Bill of Materials:
- List of all components in software
- Dependencies and versions
- Licenses
- Helps track vulnerabilities

</details>

### Q: What are the 4Cs of Cloud Native Security?

<details>
<summary>Answer</summary>

- **Cloud** - Infrastructure security
- **Cluster** - Kubernetes security
- **Container** - Image and runtime security
- **Code** - Application security

</details>

---

## Audit Logging

### Q: What are the audit log levels?

<details>
<summary>Answer</summary>

- **None** - Don't log
- **Metadata** - Log request metadata only
- **Request** - Log metadata + request body
- **RequestResponse** - Log metadata + request + response

</details>

### Q: What stages are logged?

<details>
<summary>Answer</summary>

- **RequestReceived** - When request is received
- **ResponseStarted** - Response headers sent
- **ResponseComplete** - Response body sent
- **Panic** - Panic occurred

</details>

---

[← Back to Home](../README.md)
