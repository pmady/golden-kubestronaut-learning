# Platform Security (16%)

This domain covers securing the underlying platform and infrastructure for Kubernetes.

## Supply Chain Security

### Image Security

#### Trusted Registries

```yaml
# OPA/Gatekeeper policy to enforce trusted registries
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
      - "gcr.io/my-project/"
      - "docker.io/library/"
```

#### Image Signing and Verification

```bash
# Sign image with cosign
cosign sign --key cosign.key gcr.io/my-project/my-app:v1

# Verify image signature
cosign verify --key cosign.pub gcr.io/my-project/my-app:v1
```

#### Software Bill of Materials (SBOM)

```bash
# Generate SBOM with syft
syft nginx:1.21 -o spdx-json > nginx-sbom.json

# Scan SBOM for vulnerabilities
grype sbom:nginx-sbom.json
```

### Build Pipeline Security

```text
┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
│  Code   │ → │  Build  │ → │  Scan   │ → │  Sign   │
│ Commit  │   │  Image  │   │  Image  │   │  Image  │
└─────────┘   └─────────┘   └─────────┘   └─────────┘
     │             │             │             │
     ▼             ▼             ▼             ▼
  SAST/SCA    Dockerfile     Trivy/        Cosign/
  scanning    best practices  Grype        Notary
```

### Dependency Management

- Pin dependency versions
- Use lock files
- Scan dependencies for vulnerabilities
- Monitor for new CVEs

## GitOps Security

### Repository Security

- Enable branch protection
- Require code reviews
- Sign commits with GPG
- Use CODEOWNERS files

### Secrets in GitOps

**Never store secrets in Git!**

Solutions:

| Tool | Description |
|------|-------------|
| **Sealed Secrets** | Encrypt secrets for Git storage |
| **SOPS** | Encrypt files with various KMS |
| **External Secrets** | Sync from external secret stores |
| **Vault** | Dynamic secrets management |

```yaml
# Sealed Secret example
apiVersion: bitnami.com/v1alpha1
kind: SealedSecret
metadata:
  name: my-secret
spec:
  encryptedData:
    password: AgBy3i4OJSWK+PiTySYZZA9rO43...
```

### GitOps Deployment Security

```yaml
# Argo CD Application with sync policy
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: my-app
spec:
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - Validate=true
      - CreateNamespace=false
```

## Observability and Security

### Audit Logging

```yaml
# Audit policy
apiVersion: audit.k8s.io/v1
kind: Policy
rules:
- level: RequestResponse
  resources:
  - group: ""
    resources: ["secrets", "configmaps"]
- level: Metadata
  resources:
  - group: ""
    resources: ["pods", "services"]
- level: None
  users: ["system:kube-proxy"]
  verbs: ["watch"]
```

### Audit Log Levels

| Level | Description |
|-------|-------------|
| **None** | Don't log |
| **Metadata** | Log request metadata only |
| **Request** | Log metadata and request body |
| **RequestResponse** | Log metadata, request, and response |

### Security Monitoring

```yaml
# Falco rule example
- rule: Terminal shell in container
  desc: Detect shell opened in container
  condition: >
    spawned_process and container and
    shell_procs and proc.tty != 0
  output: >
    Shell opened in container
    (user=%user.name container=%container.name
    shell=%proc.name parent=%proc.pname)
  priority: WARNING
```

### Log Aggregation

```text
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Pods      │     │   Fluentd   │     │   Elastic   │
│  (stdout)   │ ──► │  /Fluent Bit│ ──► │   /Loki     │
└─────────────┘     └─────────────┘     └─────────────┘
                                              │
                                              ▼
                                        ┌─────────────┐
                                        │   Grafana   │
                                        │   /Kibana   │
                                        └─────────────┘
```

## Certificate Management

### PKI in Kubernetes

```text
                    ┌─────────────┐
                    │   Root CA   │
                    └──────┬──────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
    ┌─────▼─────┐    ┌─────▼─────┐    ┌─────▼─────┐
    │ API Server│    │   etcd    │    │  Kubelet  │
    │   Cert    │    │   Cert    │    │   Cert    │
    └───────────┘    └───────────┘    └───────────┘
```

### cert-manager

```yaml
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: my-app-tls
spec:
  secretName: my-app-tls-secret
  issuerRef:
    name: letsencrypt-prod
    kind: ClusterIssuer
  dnsNames:
    - my-app.example.com
  duration: 2160h  # 90 days
  renewBefore: 360h  # 15 days
```

### Certificate Rotation

- Automate certificate rotation
- Monitor certificate expiration
- Use short-lived certificates
- Implement proper revocation

## Service Mesh Security

### mTLS with Istio

```yaml
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
  namespace: istio-system
spec:
  mtls:
    mode: STRICT
```

### Authorization Policies

```yaml
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: frontend-policy
  namespace: default
spec:
  selector:
    matchLabels:
      app: frontend
  action: ALLOW
  rules:
  - from:
    - source:
        principals: ["cluster.local/ns/default/sa/backend"]
    to:
    - operation:
        methods: ["GET", "POST"]
        paths: ["/api/*"]
```

## Infrastructure as Code Security

### Terraform Security

```hcl
# Secure Kubernetes cluster configuration
resource "google_container_cluster" "primary" {
  name     = "my-cluster"
  location = "us-central1"

  # Enable security features
  enable_shielded_nodes = true
  
  master_authorized_networks_config {
    cidr_blocks {
      cidr_block   = "10.0.0.0/8"
      display_name = "internal"
    }
  }

  private_cluster_config {
    enable_private_nodes    = true
    enable_private_endpoint = false
    master_ipv4_cidr_block  = "172.16.0.0/28"
  }
}
```

### Policy as Code

Tools for enforcing security policies:

| Tool | Description |
|------|-------------|
| **OPA/Gatekeeper** | General-purpose policy engine |
| **Kyverno** | Kubernetes-native policy engine |
| **Checkov** | IaC security scanner |
| **tfsec** | Terraform security scanner |

## Key Concepts to Remember

1. **Supply chain security** - Verify and sign images
2. **GitOps** - Never store secrets in Git
3. **Audit logging** - Enable and monitor
4. **Certificate management** - Automate rotation
5. **Service mesh** - mTLS for service-to-service

## Practice Questions

1. What is an SBOM and why is it important?
2. How should secrets be managed in a GitOps workflow?
3. What are the four audit log levels in Kubernetes?
4. What does mTLS provide in a service mesh?
5. Name two policy-as-code tools for Kubernetes.

---

[← Previous: Kubernetes Threat Model](./04-kubernetes-threat-model.md) | [Back to KCSA Overview](./README.md) | [Next: Compliance and Security Frameworks →](./06-compliance-security-frameworks.md)
