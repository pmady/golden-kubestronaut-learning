# Argo CD Fundamentals

Comprehensive guide to Argo CD for CAPA certification.

---

## Overview

Argo CD is a declarative GitOps continuous delivery tool for Kubernetes:

- **Declarative** - Application definitions in Git
- **Automated** - Sync applications automatically
- **Auditable** - Git history as audit log
- **Multi-cluster** - Manage multiple clusters

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Argo CD Server                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │  API Server │  │  Repo Server│  │ Application │     │
│  │             │  │             │  │ Controller  │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────────────────────┘
         │                 │                 │
         ▼                 ▼                 ▼
    ┌─────────┐      ┌─────────┐      ┌─────────┐
    │   UI    │      │   Git   │      │  K8s    │
    │   CLI   │      │  Repos  │      │ Cluster │
    └─────────┘      └─────────┘      └─────────┘
```

### Components

- **API Server** - gRPC/REST API, Web UI, CLI
- **Repository Server** - Clones Git repos, generates manifests
- **Application Controller** - Monitors applications, syncs state

---

## Installation

```bash
# Create namespace
kubectl create namespace argocd

# Install Argo CD
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Get admin password
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d

# Port forward UI
kubectl port-forward svc/argocd-server -n argocd 8080:443

# Install CLI
curl -sSL -o argocd https://github.com/argoproj/argo-cd/releases/latest/download/argocd-linux-amd64
chmod +x argocd
sudo mv argocd /usr/local/bin/

# Login
argocd login localhost:8080
```

---

## Application Resource

### Basic Application

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: guestbook
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/argoproj/argocd-example-apps.git
    targetRevision: HEAD
    path: guestbook
  destination:
    server: https://kubernetes.default.svc
    namespace: guestbook
```

### Application with Helm

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: nginx
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://charts.bitnami.com/bitnami
    chart: nginx
    targetRevision: 15.0.0
    helm:
      values: |
        replicaCount: 2
        service:
          type: ClusterIP
  destination:
    server: https://kubernetes.default.svc
    namespace: nginx
```

### Application with Kustomize

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: kustomize-app
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/myorg/myapp.git
    targetRevision: HEAD
    path: overlays/production
    kustomize:
      images:
      - myapp=myregistry/myapp:v1.0.0
  destination:
    server: https://kubernetes.default.svc
    namespace: production
```

---

## Sync Policies

### Automated Sync

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: auto-sync-app
spec:
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
      allowEmpty: false
    syncOptions:
    - CreateNamespace=true
    - PruneLast=true
    retry:
      limit: 5
      backoff:
        duration: 5s
        factor: 2
        maxDuration: 3m
```

### Sync Options

| Option | Description |
|--------|-------------|
| `prune` | Delete resources not in Git |
| `selfHeal` | Auto-sync when drift detected |
| `CreateNamespace` | Create namespace if missing |
| `PruneLast` | Prune after sync |
| `ApplyOutOfSyncOnly` | Only sync out-of-sync resources |

---

## Projects

```yaml
apiVersion: argoproj.io/v1alpha1
kind: AppProject
metadata:
  name: production
  namespace: argocd
spec:
  description: Production applications
  sourceRepos:
  - 'https://github.com/myorg/*'
  destinations:
  - namespace: 'prod-*'
    server: https://kubernetes.default.svc
  clusterResourceWhitelist:
  - group: ''
    kind: Namespace
  namespaceResourceWhitelist:
  - group: '*'
    kind: '*'
  roles:
  - name: developer
    policies:
    - p, proj:production:developer, applications, get, production/*, allow
    - p, proj:production:developer, applications, sync, production/*, allow
```

---

## ApplicationSet

```yaml
apiVersion: argoproj.io/v1alpha1
kind: ApplicationSet
metadata:
  name: cluster-apps
  namespace: argocd
spec:
  generators:
  - list:
      elements:
      - cluster: dev
        url: https://dev.example.com
      - cluster: staging
        url: https://staging.example.com
      - cluster: prod
        url: https://prod.example.com
  template:
    metadata:
      name: '{{cluster}}-app'
    spec:
      project: default
      source:
        repoURL: https://github.com/myorg/myapp.git
        targetRevision: HEAD
        path: 'envs/{{cluster}}'
      destination:
        server: '{{url}}'
        namespace: myapp
```

---

## CLI Commands

```bash
# Application management
argocd app list
argocd app get <app-name>
argocd app create <app-name> --repo <repo> --path <path> --dest-server <server> --dest-namespace <ns>
argocd app sync <app-name>
argocd app delete <app-name>

# Sync operations
argocd app sync <app-name> --prune
argocd app sync <app-name> --force
argocd app diff <app-name>

# History and rollback
argocd app history <app-name>
argocd app rollback <app-name> <revision>

# Project management
argocd proj list
argocd proj get <project-name>
```

---

[← Back to CAPA Overview](./README.md)
