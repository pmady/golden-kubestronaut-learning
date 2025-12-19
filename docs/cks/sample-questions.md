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

### Question 6.3 - Container Immutability

Create a Pod with a read-only root filesystem that can still write to /tmp.

<details>
<summary>Show Solution</summary>

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: immutable-pod
spec:
  containers:
  - name: app
    image: nginx
    securityContext:
      readOnlyRootFilesystem: true
    volumeMounts:
    - name: tmp
      mountPath: /tmp
  volumes:
  - name: tmp
    emptyDir: {}
```

</details>

### Question 6.4 - Analyze Audit Logs

Find all secret access events in the audit log.

<details>
<summary>Show Solution</summary>

```bash
cat /var/log/kubernetes/audit/audit.log | jq 'select(.objectRef.resource=="secrets")'

# Or find specific operations on secrets
cat /var/log/kubernetes/audit/audit.log | jq 'select(.objectRef.resource=="secrets" and .verb=="get")'
```

</details>

---

## Section 7: Additional Practice Questions

### Question 7.1 - Ingress TLS

Create an Ingress with TLS termination using a secret named `tls-secret`.

<details>
<summary>Show Solution</summary>

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: secure-ingress
spec:
  tls:
  - hosts:
    - secure.example.com
    secretName: tls-secret
  rules:
  - host: secure.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: my-service
            port:
              number: 80
```

</details>

### Question 7.2 - RuntimeClass with gVisor

Create a RuntimeClass for gVisor and a Pod that uses it.

<details>
<summary>Show Solution</summary>

```yaml
apiVersion: node.k8s.io/v1
kind: RuntimeClass
metadata:
  name: gvisor
handler: runsc
---
apiVersion: v1
kind: Pod
metadata:
  name: sandboxed-pod
spec:
  runtimeClassName: gvisor
  containers:
  - name: app
    image: nginx
```

</details>

### Question 7.3 - Encrypt etcd Data

Configure encryption at rest for secrets in etcd.

<details>
<summary>Show Solution</summary>

```yaml
# /etc/kubernetes/enc/enc.yaml
apiVersion: apiserver.config.k8s.io/v1
kind: EncryptionConfiguration
resources:
  - resources:
      - secrets
    providers:
      - aescbc:
          keys:
            - name: key1
              secret: <base64-encoded-32-byte-key>
      - identity: {}
```

Add to kube-apiserver:
```
--encryption-provider-config=/etc/kubernetes/enc/enc.yaml
```

</details>

### Question 7.4 - Verify Image Signature

Use cosign to verify an image signature.

<details>
<summary>Show Solution</summary>

```bash
# Verify image signature
cosign verify --key cosign.pub gcr.io/myproject/myimage:v1

# Generate a key pair
cosign generate-key-pair

# Sign an image
cosign sign --key cosign.key gcr.io/myproject/myimage:v1
```

</details>

### Question 7.5 - Restrict Syscalls with Seccomp

Create a Pod that blocks the `chmod` syscall using a custom seccomp profile.

<details>
<summary>Show Solution</summary>

```json
// /var/lib/kubelet/seccomp/profiles/block-chmod.json
{
  "defaultAction": "SCMP_ACT_ALLOW",
  "syscalls": [
    {
      "names": ["chmod", "fchmod", "fchmodat"],
      "action": "SCMP_ACT_ERRNO"
    }
  ]
}
```

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: seccomp-pod
spec:
  securityContext:
    seccompProfile:
      type: Localhost
      localhostProfile: profiles/block-chmod.json
  containers:
  - name: app
    image: nginx
```

</details>

### Question 7.6 - Network Policy for Database

Create a NetworkPolicy that only allows pods with label `app=backend` to access pods with label `app=database` on port 5432.

<details>
<summary>Show Solution</summary>

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: db-policy
spec:
  podSelector:
    matchLabels:
      app: database
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: backend
    ports:
    - protocol: TCP
      port: 5432
```

</details>

### Question 7.7 - Admission Controller Webhook

Which admission controllers should be enabled for security?

<details>
<summary>Show Solution</summary>

Essential security admission controllers:
- `NodeRestriction` - Limits kubelet permissions
- `PodSecurity` - Enforces Pod Security Standards
- `AlwaysPullImages` - Forces image pull on every pod start
- `DenyServiceExternalIPs` - Prevents external IP assignment

Enable in kube-apiserver:
```
--enable-admission-plugins=NodeRestriction,PodSecurity,AlwaysPullImages
```

</details>

### Question 7.8 - Investigate Compromised Pod

A pod is suspected of being compromised. What steps would you take?

<details>
<summary>Show Solution</summary>

```bash
# 1. Isolate the pod with NetworkPolicy
kubectl apply -f - <<EOF
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: isolate-pod
spec:
  podSelector:
    matchLabels:
      app: compromised
  policyTypes:
  - Ingress
  - Egress
EOF

# 2. Check pod events and logs
kubectl describe pod <pod-name>
kubectl logs <pod-name>

# 3. Check running processes
kubectl exec <pod-name> -- ps aux

# 4. Check network connections
kubectl exec <pod-name> -- netstat -tulpn

# 5. Check audit logs
cat /var/log/kubernetes/audit/audit.log | jq 'select(.objectRef.name=="<pod-name>")'

# 6. Check Falco alerts
kubectl logs -n falco -l app.kubernetes.io/name=falco | grep <pod-name>
```

</details>

---

## Exam Tips

1. **Practice on [Killercoda](https://killercoda.com/killer-shell-cks)** - Free hands-on scenarios
2. **Use [killer.sh](https://killer.sh/cks)** - Included with exam registration
3. **Know Trivy** for image scanning - `trivy image --severity HIGH,CRITICAL`
4. **Master Network Policies** - Default deny patterns, ingress/egress rules
5. **Understand RBAC** deeply - Roles, ClusterRoles, bindings
6. **Practice with Falco** rules - Rule syntax, common detections
7. **Know audit logging** configuration - Policy levels, API server flags
8. **Understand Pod Security Standards** - privileged, baseline, restricted
9. **Practice seccomp and AppArmor** - Profile application
10. **Know encryption at rest** - etcd encryption configuration

## Quick Reference Commands

```bash
# Image scanning
trivy image nginx:latest

# Check CIS benchmarks
kube-bench run --targets=master

# Create secret
kubectl create secret generic my-secret --from-literal=password=secret

# Apply NetworkPolicy
kubectl apply -f networkpolicy.yaml

# Check RBAC
kubectl auth can-i create pods --as=jane

# View audit logs
cat /var/log/kubernetes/audit/audit.log | jq .

# Check Falco logs
kubectl logs -n falco -l app.kubernetes.io/name=falco
```

---

[← Back to CKS Overview](./README.md)
