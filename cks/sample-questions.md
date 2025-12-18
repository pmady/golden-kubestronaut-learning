# CKS Sample Practice Questions

> **Disclaimer**: These are sample practice questions created for study purposes only. They are NOT actual exam questions and are designed to help you test your understanding of CKS concepts.

## Practice Resources

- **[Killercoda CKS Scenarios](https://killercoda.com/killer-shell-cks)** ⭐ Free hands-on practice
- **[killer.sh CKS Simulator](https://killer.sh/cks)** - Included with exam registration

---

## Section 1: Cluster Setup (10%)

### Question 1.1 - Network Policy

Create a NetworkPolicy named `deny-all` in namespace `secure` that denies all ingress and egress traffic.

<details>
<summary>Show Solution</summary>

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all
  namespace: secure
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
```

</details>

### Question 1.2 - CIS Benchmark

Run kube-bench to check the master node against CIS benchmarks.

<details>
<summary>Show Solution</summary>

```bash
kube-bench run --targets=master
```

</details>

---

## Section 2: Cluster Hardening (15%)

### Question 2.1 - RBAC

Create a Role named `pod-reader` that allows get, list, watch on pods. Bind it to user `jane`.

<details>
<summary>Show Solution</summary>

```bash
kubectl create role pod-reader --verb=get,list,watch --resource=pods
kubectl create rolebinding read-pods --role=pod-reader --user=jane
```

</details>

### Question 2.2 - ServiceAccount

Create a Pod that doesn't auto-mount the ServiceAccount token.

<details>
<summary>Show Solution</summary>

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: no-token-pod
spec:
  automountServiceAccountToken: false
  containers:
  - name: nginx
    image: nginx
```

</details>

---

## Section 3: System Hardening (15%)

### Question 3.1 - AppArmor

Create a Pod with AppArmor profile `k8s-deny-write` applied.

<details>
<summary>Show Solution</summary>

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: apparmor-pod
  annotations:
    container.apparmor.security.beta.kubernetes.io/nginx: localhost/k8s-deny-write
spec:
  containers:
  - name: nginx
    image: nginx
```

</details>

### Question 3.2 - seccomp

Create a Pod using RuntimeDefault seccomp profile.

<details>
<summary>Show Solution</summary>

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: seccomp-pod
spec:
  securityContext:
    seccompProfile:
      type: RuntimeDefault
  containers:
  - name: nginx
    image: nginx
```

</details>

---

## Section 4: Minimize Microservice Vulnerabilities (20%)

### Question 4.1 - Security Context

Create a Pod that runs as non-root with read-only filesystem and drops all capabilities.

<details>
<summary>Show Solution</summary>

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secure-pod
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 1000
  containers:
  - name: nginx
    image: nginx
    securityContext:
      readOnlyRootFilesystem: true
      allowPrivilegeEscalation: false
      capabilities:
        drop:
        - ALL
```

</details>

### Question 4.2 - Pod Security Standards

Apply the restricted Pod Security Standard to namespace `production`.

<details>
<summary>Show Solution</summary>

```bash
kubectl label namespace production \
  pod-security.kubernetes.io/enforce=restricted \
  pod-security.kubernetes.io/audit=restricted \
  pod-security.kubernetes.io/warn=restricted
```

</details>

---

## Section 5: Supply Chain Security (20%)

### Question 5.1 - Image Scanning

Scan image `nginx:1.21` for HIGH and CRITICAL vulnerabilities using Trivy.

<details>
<summary>Show Solution</summary>

```bash
trivy image --severity HIGH,CRITICAL nginx:1.21
```

</details>

### Question 5.2 - Allowed Registries

Create an OPA Gatekeeper constraint to only allow images from `gcr.io/myproject/`.

<details>
<summary>Show Solution</summary>

```yaml
apiVersion: constraints.gatekeeper.sh/v1beta1
kind: K8sAllowedRepos
metadata:
  name: allowed-repos
spec:
  match:
    kinds:
      - apiGroups: [""]
        kinds: ["Pod"]
  parameters:
    repos:
      - "gcr.io/myproject/"
```

</details>

---

## Section 6: Monitoring, Logging and Runtime Security (20%)

### Question 6.1 - Audit Logging

Configure API server to log all secret access at Metadata level.

<details>
<summary>Show Solution</summary>

```yaml
apiVersion: audit.k8s.io/v1
kind: Policy
rules:
  - level: Metadata
    resources:
      - group: ""
        resources: ["secrets"]
```

Add to kube-apiserver:
```
--audit-policy-file=/etc/kubernetes/audit-policy.yaml
--audit-log-path=/var/log/kubernetes/audit/audit.log
```

</details>

### Question 6.2 - Falco

Write a Falco rule to detect shell spawning in containers.

<details>
<summary>Show Solution</summary>

```yaml
- rule: Shell in container
  desc: Detect shell spawned in container
  condition: spawned_process and container and shell_procs
  output: Shell spawned (user=%user.name container=%container.name)
  priority: WARNING
```

</details>

---

## Exam Tips

1. **Practice on [Killercoda](https://killercoda.com/killer-shell-cks)**
2. **Know Trivy** for image scanning
3. **Master Network Policies** - default deny patterns
4. **Understand RBAC** deeply
5. **Practice with Falco** rules
6. **Know audit logging** configuration

---

[← Back to CKS Overview](./README.md)
