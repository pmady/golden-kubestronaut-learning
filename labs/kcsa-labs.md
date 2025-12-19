# KCSA Hands-on Lab Exercises

These labs reinforce KCSA security concepts. While KCSA is multiple-choice, hands-on experience helps understand security principles.

## Prerequisites

- Kubernetes cluster access
- kubectl configured
- Basic security knowledge

---

## Lab 1: RBAC Exploration

**Objective:** Understand Kubernetes RBAC

### Tasks

1. **Explore existing roles:**

```bash
# List ClusterRoles
kubectl get clusterroles | head -20

# Describe admin role
kubectl describe clusterrole admin

# List RoleBindings
kubectl get rolebindings -A
kubectl get clusterrolebindings | head -20
```

2. **Create custom role:**

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: pod-viewer
  namespace: default
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "list", "watch"]
```

3. **Test permissions:**

```bash
kubectl auth can-i list pods --as=system:serviceaccount:default:test-sa
kubectl auth can-i delete pods --as=system:serviceaccount:default:test-sa
kubectl auth can-i --list --as=system:serviceaccount:default:test-sa
```

<details>
<summary>Expected Outcome</summary>

- Understand role structure and permissions
- Can test what actions are allowed for different identities

</details>

---

## Lab 2: Network Policy Basics

**Objective:** Understand network segmentation

### Default Deny Policy

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-ingress
  namespace: test-ns
spec:
  podSelector: {}
  policyTypes:
  - Ingress
```

### Allow Specific Ingress

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-from-frontend
  namespace: test-ns
spec:
  podSelector:
    matchLabels:
      app: backend
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: frontend
    ports:
    - protocol: TCP
      port: 80
```

### Tasks

```bash
# Create namespace and deploy apps
kubectl create namespace test-ns
kubectl create deployment frontend --image=nginx -n test-ns
kubectl create deployment backend --image=nginx -n test-ns
kubectl label deployment frontend app=frontend -n test-ns
kubectl label deployment backend app=backend -n test-ns

# Apply network policies
kubectl apply -f default-deny-ingress.yaml
kubectl apply -f allow-from-frontend.yaml

# Test connectivity
kubectl exec -n test-ns deploy/frontend -- curl backend --max-time 2
```

---

## Lab 3: Pod Security Context

**Objective:** Understand security contexts

### Secure Pod Configuration

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secure-pod
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 1000
    runAsGroup: 3000
    fsGroup: 2000
  containers:
  - name: app
    image: busybox
    command: ['sh', '-c', 'id && sleep 3600']
    securityContext:
      allowPrivilegeEscalation: false
      readOnlyRootFilesystem: true
      capabilities:
        drop:
        - ALL
```

### Tasks

```bash
kubectl apply -f secure-pod.yaml
kubectl exec secure-pod -- id
kubectl exec secure-pod -- touch /test  # Should fail
```

---

## Lab 4: Secrets Management

**Objective:** Understand Kubernetes secrets

### Create and Use Secrets

```bash
# Create secret
kubectl create secret generic db-creds \
  --from-literal=username=admin \
  --from-literal=password=secret123

# View secret (base64 encoded)
kubectl get secret db-creds -o yaml

# Decode secret
kubectl get secret db-creds -o jsonpath='{.data.password}' | base64 -d
```

### Mount Secret in Pod

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secret-pod
spec:
  containers:
  - name: app
    image: busybox
    command: ['sh', '-c', 'cat /secrets/password && sleep 3600']
    volumeMounts:
    - name: secret-vol
      mountPath: /secrets
      readOnly: true
  volumes:
  - name: secret-vol
    secret:
      secretName: db-creds
```

---

## Lab 5: Service Account Security

**Objective:** Understand service account tokens

### Disable Auto-mounting

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: no-token-sa
automountServiceAccountToken: false
---
apiVersion: v1
kind: Pod
metadata:
  name: no-token-pod
spec:
  serviceAccountName: no-token-sa
  containers:
  - name: app
    image: busybox
    command: ['sh', '-c', 'ls /var/run/secrets/kubernetes.io/serviceaccount/ 2>&1 || echo "No token mounted" && sleep 3600']
```

### Tasks

```bash
kubectl apply -f no-token-sa.yaml
kubectl exec no-token-pod -- ls /var/run/secrets/kubernetes.io/serviceaccount/
```

---

## Lab 6: Image Security

**Objective:** Understand container image security

### Check Image Details

```bash
# Pull and inspect image
docker pull nginx:latest
docker inspect nginx:latest | jq '.[0].Config'

# Check for vulnerabilities (if trivy installed)
trivy image nginx:latest --severity HIGH,CRITICAL
```

### Use Specific Image Tags

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: versioned-pod
spec:
  containers:
  - name: app
    image: nginx:1.25.3  # Use specific version, not :latest
    imagePullPolicy: IfNotPresent
```

---

## Lab 7: Audit Logging Review

**Objective:** Understand Kubernetes audit logs

### Sample Audit Log Entry

```json
{
  "kind": "Event",
  "apiVersion": "audit.k8s.io/v1",
  "level": "RequestResponse",
  "stage": "ResponseComplete",
  "requestURI": "/api/v1/namespaces/default/secrets",
  "verb": "create",
  "user": {
    "username": "admin",
    "groups": ["system:masters"]
  },
  "sourceIPs": ["192.168.1.100"],
  "objectRef": {
    "resource": "secrets",
    "namespace": "default",
    "name": "my-secret"
  },
  "responseStatus": {
    "code": 201
  }
}
```

### Analyze Audit Logs

```bash
# If audit logging is enabled
sudo cat /var/log/kubernetes/audit.log | jq 'select(.verb=="create" and .objectRef.resource=="secrets")'

# Count events by verb
sudo cat /var/log/kubernetes/audit.log | jq -r '.verb' | sort | uniq -c
```

---

## Lab 8: Supply Chain Security

**Objective:** Understand software supply chain

### Verify Image Signatures (Cosign)

```bash
# Install cosign
go install github.com/sigstore/cosign/v2/cmd/cosign@latest

# Verify signed image
cosign verify --key cosign.pub myregistry/myimage:v1

# Sign an image
cosign sign --key cosign.key myregistry/myimage:v1
```

### Generate SBOM

```bash
# Using syft
syft nginx:latest -o json > nginx-sbom.json

# Using trivy
trivy image nginx:latest --format spdx-json > nginx-sbom.spdx.json
```

---

## Security Checklist

- [ ] RBAC configured with least privilege
- [ ] Network policies restrict pod communication
- [ ] Pods run as non-root
- [ ] Secrets encrypted at rest
- [ ] Service account tokens not auto-mounted when not needed
- [ ] Images from trusted registries
- [ ] Image tags are specific (not :latest)
- [ ] Audit logging enabled
- [ ] Pod security standards enforced

---

## Additional Practice Resources

- [Kubernetes Security Documentation](https://kubernetes.io/docs/concepts/security/)
- [CNCF Security Whitepaper](https://github.com/cncf/tag-security)
- [Killercoda Security Scenarios](https://killercoda.com/)

---

[← Back to KCSA Overview](../kcsa/README.md)
