# Cluster Setup (10%)

This domain covers securing Kubernetes cluster components and network security.

## Network Policies

### Default Deny All Ingress

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-ingress
  namespace: default
spec:
  podSelector: {}
  policyTypes:
  - Ingress
```

### Default Deny All Egress

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-egress
  namespace: default
spec:
  podSelector: {}
  policyTypes:
  - Egress
```

### Default Deny All Traffic

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
  namespace: default
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
```

### Allow Specific Ingress

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-frontend-to-backend
  namespace: default
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
    - namespaceSelector:
        matchLabels:
          name: production
    ports:
    - protocol: TCP
      port: 8080
```

### Allow DNS Egress

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-dns-egress
  namespace: default
spec:
  podSelector: {}
  policyTypes:
  - Egress
  egress:
  - to:
    - namespaceSelector: {}
      podSelector:
        matchLabels:
          k8s-app: kube-dns
    ports:
    - protocol: UDP
      port: 53
    - protocol: TCP
      port: 53
```

## CIS Kubernetes Benchmark

### kube-bench

Tool to check Kubernetes against CIS benchmarks.

```bash
# Run kube-bench
kube-bench run --targets=master
kube-bench run --targets=node
kube-bench run --targets=etcd

# Run specific checks
kube-bench run --targets=master --check=1.1.1

# Output as JSON
kube-bench run --json
```

### Common CIS Findings

| Check | Description | Fix |
|-------|-------------|-----|
| 1.1.1 | API server pod spec permissions | `chmod 600 /etc/kubernetes/manifests/kube-apiserver.yaml` |
| 1.2.1 | Anonymous auth disabled | `--anonymous-auth=false` |
| 1.2.6 | RBAC enabled | `--authorization-mode=RBAC` |
| 4.1.1 | kubelet service file permissions | `chmod 600 /etc/systemd/system/kubelet.service.d/10-kubeadm.conf` |

## Ingress Security

### TLS Ingress

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: secure-ingress
  annotations:
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  ingressClassName: nginx
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
            name: secure-service
            port:
              number: 443
```

### Create TLS Secret

```bash
# Generate self-signed certificate
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout tls.key -out tls.crt -subj "/CN=secure.example.com"

# Create secret
kubectl create secret tls tls-secret --cert=tls.crt --key=tls.key
```

## Cluster Component Security

### Secure API Server

```yaml
# /etc/kubernetes/manifests/kube-apiserver.yaml
spec:
  containers:
  - command:
    - kube-apiserver
    - --anonymous-auth=false
    - --authorization-mode=Node,RBAC
    - --enable-admission-plugins=NodeRestriction,PodSecurityPolicy
    - --audit-log-path=/var/log/kubernetes/audit/audit.log
    - --audit-policy-file=/etc/kubernetes/audit-policy.yaml
    - --encryption-provider-config=/etc/kubernetes/encryption-config.yaml
    - --tls-cert-file=/etc/kubernetes/pki/apiserver.crt
    - --tls-private-key-file=/etc/kubernetes/pki/apiserver.key
    - --client-ca-file=/etc/kubernetes/pki/ca.crt
```

### Secure etcd

```yaml
# /etc/kubernetes/manifests/etcd.yaml
spec:
  containers:
  - command:
    - etcd
    - --cert-file=/etc/kubernetes/pki/etcd/server.crt
    - --key-file=/etc/kubernetes/pki/etcd/server.key
    - --trusted-ca-file=/etc/kubernetes/pki/etcd/ca.crt
    - --client-cert-auth=true
    - --peer-cert-file=/etc/kubernetes/pki/etcd/peer.crt
    - --peer-key-file=/etc/kubernetes/pki/etcd/peer.key
    - --peer-trusted-ca-file=/etc/kubernetes/pki/etcd/ca.crt
    - --peer-client-cert-auth=true
```

### Secure kubelet

```yaml
# /var/lib/kubelet/config.yaml
authentication:
  anonymous:
    enabled: false
  webhook:
    enabled: true
  x509:
    clientCAFile: /etc/kubernetes/pki/ca.crt
authorization:
  mode: Webhook
readOnlyPort: 0
```

## Encryption at Rest

### Encryption Configuration

```yaml
# /etc/kubernetes/encryption-config.yaml
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

### Enable Encryption

```bash
# Generate encryption key
head -c 32 /dev/urandom | base64

# Add to API server
# --encryption-provider-config=/etc/kubernetes/encryption-config.yaml

# Encrypt existing secrets
kubectl get secrets --all-namespaces -o json | kubectl replace -f -
```

### Verify Encryption

```bash
# Check if secrets are encrypted in etcd
ETCDCTL_API=3 etcdctl get /registry/secrets/default/my-secret \
  --endpoints=https://127.0.0.1:2379 \
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \
  --cert=/etc/kubernetes/pki/etcd/server.crt \
  --key=/etc/kubernetes/pki/etcd/server.key | hexdump -C
```

## GUI Element Security

### Disable Kubernetes Dashboard (if not needed)

```bash
# Delete dashboard
kubectl delete ns kubernetes-dashboard

# Or restrict access with NetworkPolicy
```

### Secure Dashboard Access

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: dashboard-policy
  namespace: kubernetes-dashboard
spec:
  podSelector:
    matchLabels:
      k8s-app: kubernetes-dashboard
  policyTypes:
  - Ingress
  ingress:
  - from:
    - ipBlock:
        cidr: 10.0.0.0/8
    ports:
    - protocol: TCP
      port: 443
```

## Key Concepts to Remember

1. **Network Policies** - Default deny, allow specific traffic
2. **CIS Benchmarks** - Use kube-bench to verify compliance
3. **TLS everywhere** - Encrypt all cluster communication
4. **Encryption at rest** - Encrypt secrets in etcd
5. **Disable anonymous auth** - Require authentication

## Practice Questions

1. How do you create a default deny all network policy?
2. What tool checks Kubernetes against CIS benchmarks?
3. How do you enable encryption at rest for secrets?
4. What flag disables anonymous authentication on the API server?
5. How do you verify secrets are encrypted in etcd?

---

[Back to CKS Overview](./README.md) | [Next: Cluster Hardening →](./02-cluster-hardening.md)
