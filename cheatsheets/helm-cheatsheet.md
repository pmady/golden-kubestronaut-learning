# Helm Cheat Sheet

Comprehensive Helm command reference for CKAD exam.

---

## Repository Management

```bash
# Add repository
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo add stable https://charts.helm.sh/stable

# Update repositories
helm repo update

# List repositories
helm repo list

# Remove repository
helm repo remove bitnami

# Search repository
helm search repo nginx
helm search repo bitnami/nginx --versions
```

---

## Chart Operations

```bash
# Search hub
helm search hub wordpress

# Show chart info
helm show chart bitnami/nginx
helm show values bitnami/nginx
helm show readme bitnami/nginx
helm show all bitnami/nginx

# Download chart
helm pull bitnami/nginx
helm pull bitnami/nginx --untar
helm pull bitnami/nginx --version 13.2.0
```

---

## Installation

```bash
# Install chart
helm install myrelease bitnami/nginx

# Install with custom values
helm install myrelease bitnami/nginx -f values.yaml
helm install myrelease bitnami/nginx --set replicaCount=3
helm install myrelease bitnami/nginx --set service.type=NodePort

# Install in namespace
helm install myrelease bitnami/nginx -n mynamespace
helm install myrelease bitnami/nginx -n mynamespace --create-namespace

# Install with specific version
helm install myrelease bitnami/nginx --version 13.2.0

# Dry run
helm install myrelease bitnami/nginx --dry-run

# Generate name
helm install bitnami/nginx --generate-name

# Wait for ready
helm install myrelease bitnami/nginx --wait --timeout 5m
```

---

## Upgrade & Rollback

```bash
# Upgrade release
helm upgrade myrelease bitnami/nginx
helm upgrade myrelease bitnami/nginx -f values.yaml
helm upgrade myrelease bitnami/nginx --set replicaCount=5

# Install or upgrade
helm upgrade --install myrelease bitnami/nginx

# Rollback
helm rollback myrelease
helm rollback myrelease 1
helm rollback myrelease 2

# History
helm history myrelease
```

---

## Release Management

```bash
# List releases
helm list
helm list -A
helm list -n mynamespace
helm list --all

# Get release info
helm get all myrelease
helm get values myrelease
helm get manifest myrelease
helm get notes myrelease
helm get hooks myrelease

# Release status
helm status myrelease

# Uninstall
helm uninstall myrelease
helm uninstall myrelease -n mynamespace
helm uninstall myrelease --keep-history
```

---

## Chart Development

```bash
# Create new chart
helm create mychart

# Lint chart
helm lint mychart

# Template rendering
helm template myrelease mychart
helm template myrelease mychart -f values.yaml
helm template myrelease mychart --debug

# Package chart
helm package mychart
helm package mychart --version 1.0.0

# Dependency management
helm dependency update mychart
helm dependency build mychart
helm dependency list mychart
```

---

## Chart Structure

```
mychart/
├── Chart.yaml          # Chart metadata
├── values.yaml         # Default values
├── charts/             # Dependencies
├── templates/          # Template files
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   ├── _helpers.tpl    # Template helpers
│   ├── NOTES.txt       # Post-install notes
│   └── tests/
└── .helmignore         # Files to ignore
```

---

## Template Functions

```yaml
# Values reference
{{ .Values.replicaCount }}
{{ .Release.Name }}
{{ .Release.Namespace }}
{{ .Chart.Name }}
{{ .Chart.Version }}

# Default values
{{ .Values.image.tag | default "latest" }}

# Quote strings
{{ .Values.name | quote }}

# Conditionals
{{- if .Values.ingress.enabled }}
...
{{- end }}

# Loops
{{- range .Values.hosts }}
- {{ . }}
{{- end }}

# Include template
{{- include "mychart.fullname" . }}
```

---

## Common Values Override

```yaml
# values.yaml
replicaCount: 3

image:
  repository: nginx
  tag: "1.25"
  pullPolicy: IfNotPresent

service:
  type: ClusterIP
  port: 80

ingress:
  enabled: true
  hosts:
    - host: myapp.example.com
      paths:
        - path: /
          pathType: Prefix

resources:
  limits:
    cpu: 200m
    memory: 256Mi
  requests:
    cpu: 100m
    memory: 128Mi
```

---

[← Back to Home](../README.md)
