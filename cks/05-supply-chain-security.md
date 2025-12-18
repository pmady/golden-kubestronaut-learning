# Supply Chain Security (20%)

This domain covers securing the software supply chain including image security, static analysis, and image signing.

## Image Vulnerability Scanning

### Trivy

```bash
# Scan image
trivy image nginx:1.21

# Scan with severity filter
trivy image --severity HIGH,CRITICAL nginx:1.21

# Scan and fail on vulnerabilities
trivy image --exit-code 1 --severity CRITICAL nginx:1.21

# Scan local image
trivy image --input image.tar

# Output as JSON
trivy image -f json -o results.json nginx:1.21

# Scan filesystem
trivy fs /path/to/project

# Scan Kubernetes resources
trivy k8s --report summary cluster
```

### Trivy Output Example

```text
nginx:1.21 (debian 11.2)
========================
Total: 125 (UNKNOWN: 0, LOW: 85, MEDIUM: 26, HIGH: 12, CRITICAL: 2)

┌──────────────────┬────────────────┬──────────┬───────────────────┐
│     Library      │ Vulnerability  │ Severity │  Installed Version│
├──────────────────┼────────────────┼──────────┼───────────────────┤
│ libssl1.1        │ CVE-2022-0778  │ HIGH     │ 1.1.1k-1+deb11u1  │
│ openssl          │ CVE-2022-0778  │ HIGH     │ 1.1.1k-1+deb11u1  │
└──────────────────┴────────────────┴──────────┴───────────────────┘
```

### Integrate Trivy in CI/CD

```yaml
# GitHub Actions example
- name: Scan image
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: 'myimage:${{ github.sha }}'
    format: 'table'
    exit-code: '1'
    severity: 'CRITICAL,HIGH'
```

## Image Signing and Verification

### Cosign

```bash
# Generate key pair
cosign generate-key-pair

# Sign image
cosign sign --key cosign.key myregistry/myimage:v1

# Verify image
cosign verify --key cosign.pub myregistry/myimage:v1

# Sign with keyless (OIDC)
cosign sign myregistry/myimage:v1

# Verify keyless signature
cosign verify myregistry/myimage:v1
```

### Image Policy Webhook

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingWebhookConfiguration
metadata:
  name: image-policy-webhook
webhooks:
- name: image-policy.example.com
  rules:
  - apiGroups: [""]
    apiVersions: ["v1"]
    operations: ["CREATE", "UPDATE"]
    resources: ["pods"]
  clientConfig:
    service:
      name: image-policy-webhook
      namespace: kube-system
      path: "/validate"
    caBundle: <base64-encoded-ca-cert>
  admissionReviewVersions: ["v1"]
  sideEffects: None
```

## Minimize Base Image Footprint

### Use Minimal Base Images

```dockerfile
# Bad: Full OS image
FROM ubuntu:22.04

# Better: Slim image
FROM python:3.11-slim

# Best: Distroless
FROM gcr.io/distroless/python3

# Best: Scratch (for static binaries)
FROM scratch
```

### Multi-stage Builds

```dockerfile
# Build stage
FROM golang:1.21 AS builder
WORKDIR /app
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o myapp

# Runtime stage
FROM gcr.io/distroless/static:nonroot
COPY --from=builder /app/myapp /myapp
USER nonroot:nonroot
ENTRYPOINT ["/myapp"]
```

### Image Best Practices

| Practice | Description |
|----------|-------------|
| Use specific tags | Avoid `latest`, use version tags |
| Use minimal base | distroless, alpine, scratch |
| Multi-stage builds | Reduce final image size |
| Run as non-root | Use USER instruction |
| No secrets in image | Use runtime secrets |
| Scan regularly | Integrate scanning in CI/CD |

## Secure Image Registries

### Private Registry Authentication

```bash
# Create registry secret
kubectl create secret docker-registry regcred \
  --docker-server=myregistry.io \
  --docker-username=user \
  --docker-password=pass \
  --docker-email=user@example.com
```

### Use ImagePullSecrets

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: private-image-pod
spec:
  containers:
  - name: app
    image: myregistry.io/myimage:v1
  imagePullSecrets:
  - name: regcred
```

### ServiceAccount with ImagePullSecrets

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: my-sa
imagePullSecrets:
- name: regcred
```

## Allowlist Registries

### OPA Gatekeeper Policy

```yaml
apiVersion: templates.gatekeeper.sh/v1
kind: ConstraintTemplate
metadata:
  name: k8sallowedrepos
spec:
  crd:
    spec:
      names:
        kind: K8sAllowedRepos
      validation:
        openAPIV3Schema:
          type: object
          properties:
            repos:
              type: array
              items:
                type: string
  targets:
    - target: admission.k8s.gatekeeper.sh
      rego: |
        package k8sallowedrepos

        violation[{"msg": msg}] {
          container := input.review.object.spec.containers[_]
          not startswith(container.image, input.parameters.repos[_])
          msg := sprintf("Container image %v is not from an allowed registry", [container.image])
        }
---
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
      - "myregistry.io/"
```

## Static Analysis

### Kubesec

```bash
# Scan Kubernetes manifest
kubesec scan pod.yaml

# Scan with HTTP API
curl -sSX POST --data-binary @pod.yaml https://v2.kubesec.io/scan
```

### Kubesec Output

```json
{
  "score": 0,
  "scoring": {
    "critical": [
      {
        "id": "CapSysAdmin",
        "selector": "containers[] .securityContext .capabilities .add == SYS_ADMIN",
        "reason": "CAP_SYS_ADMIN is the most privileged capability"
      }
    ],
    "advise": [
      {
        "id": "ApparmorAny",
        "selector": ".metadata .annotations .\"container.apparmor.security.beta.kubernetes.io/nginx\"",
        "reason": "Well defined AppArmor policies may provide greater protection"
      }
    ]
  }
}
```

### Conftest (OPA for Config Files)

```bash
# Test Kubernetes manifests
conftest test deployment.yaml

# With custom policy
conftest test --policy ./policy deployment.yaml
```

### Example Conftest Policy

```rego
# policy/deployment.rego
package main

deny[msg] {
  input.kind == "Deployment"
  not input.spec.template.spec.securityContext.runAsNonRoot
  msg := "Containers must run as non-root"
}

deny[msg] {
  input.kind == "Deployment"
  container := input.spec.template.spec.containers[_]
  not container.resources.limits
  msg := sprintf("Container %v must have resource limits", [container.name])
}
```

## Dockerfile Security

### Dockerfile Best Practices

```dockerfile
# Use specific version
FROM python:3.11-slim-bookworm

# Create non-root user
RUN groupadd -r appgroup && useradd -r -g appgroup appuser

# Set working directory
WORKDIR /app

# Copy only necessary files
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY --chown=appuser:appgroup . .

# Switch to non-root user
USER appuser

# Use ENTRYPOINT for main command
ENTRYPOINT ["python", "app.py"]
```

### Hadolint (Dockerfile Linter)

```bash
# Lint Dockerfile
hadolint Dockerfile

# Ignore specific rules
hadolint --ignore DL3008 Dockerfile
```

## Key Concepts to Remember

1. **Trivy** - Image vulnerability scanning
2. **Cosign** - Image signing and verification
3. **Minimal images** - distroless, alpine, scratch
4. **Multi-stage builds** - Reduce image size
5. **Registry allowlisting** - OPA Gatekeeper policies

## Practice Questions

1. How do you scan an image for HIGH and CRITICAL vulnerabilities with Trivy?
2. How do you sign an image with Cosign?
3. What is the benefit of using distroless base images?
4. How do you create an OPA policy to allowlist registries?
5. What tool lints Dockerfiles for security issues?

---

[← Previous: Minimize Microservice Vulnerabilities](./04-minimize-microservice-vulnerabilities.md) | [Back to CKS Overview](./README.md) | [Next: Monitoring, Logging and Runtime Security →](./06-monitoring-logging-runtime-security.md)
