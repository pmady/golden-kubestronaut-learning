# Platform Engineering Fundamentals

Comprehensive guide to platform engineering for CNPE certification.

---

## Overview

Platform Engineering focuses on building Internal Developer Platforms (IDPs) that:

- **Abstract complexity** - Hide infrastructure details
- **Enable self-service** - Developers provision resources independently
- **Standardize** - Consistent patterns across teams
- **Automate** - Reduce manual operations

---

## Key Concepts

### Internal Developer Platform (IDP)

An IDP provides:

- Self-service infrastructure provisioning
- Standardized deployment pipelines
- Observability and monitoring
- Security and compliance guardrails

### Platform Team Responsibilities

- Build and maintain platform components
- Define golden paths for common workflows
- Provide documentation and support
- Measure and improve developer experience

---

## Crossplane

Crossplane extends Kubernetes to manage cloud resources:

### Installation

```bash
# Install Crossplane
kubectl create namespace crossplane-system
helm repo add crossplane-stable https://charts.crossplane.io/stable
helm install crossplane crossplane-stable/crossplane -n crossplane-system

# Install AWS provider
kubectl apply -f - <<EOF
apiVersion: pkg.crossplane.io/v1
kind: Provider
metadata:
  name: provider-aws
spec:
  package: xpkg.upbound.io/crossplane-contrib/provider-aws:v0.40.0
EOF
```

### Composite Resources

```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: CompositeResourceDefinition
metadata:
  name: databases.platform.example.com
spec:
  group: platform.example.com
  names:
    kind: Database
    plural: databases
  versions:
  - name: v1
    served: true
    referenceable: true
    schema:
      openAPIV3Schema:
        type: object
        properties:
          spec:
            type: object
            properties:
              size:
                type: string
                enum: [small, medium, large]
              engine:
                type: string
                enum: [postgres, mysql]
```

### Composition

```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: Composition
metadata:
  name: database-aws
spec:
  compositeTypeRef:
    apiVersion: platform.example.com/v1
    kind: Database
  resources:
  - name: rds-instance
    base:
      apiVersion: rds.aws.crossplane.io/v1beta1
      kind: Instance
      spec:
        forProvider:
          region: us-east-1
          dbInstanceClass: db.t3.micro
          engine: postgres
          masterUsername: admin
    patches:
    - fromFieldPath: spec.size
      toFieldPath: spec.forProvider.dbInstanceClass
      transforms:
      - type: map
        map:
          small: db.t3.micro
          medium: db.t3.small
          large: db.t3.medium
```

---

## Backstage

Backstage is a developer portal platform:

### Features

- **Software Catalog** - Track all services and resources
- **Templates** - Scaffold new projects
- **TechDocs** - Documentation as code
- **Plugins** - Extensible architecture

### Catalog Entity

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: my-service
  description: My microservice
  annotations:
    github.com/project-slug: myorg/my-service
    backstage.io/techdocs-ref: dir:.
spec:
  type: service
  lifecycle: production
  owner: team-platform
  system: my-system
  dependsOn:
  - resource:my-database
  providesApis:
  - my-api
```

### Software Template

```yaml
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: microservice-template
  title: Microservice Template
spec:
  owner: team-platform
  type: service
  parameters:
  - title: Service Details
    properties:
      name:
        type: string
        title: Service Name
      owner:
        type: string
        title: Owner Team
  steps:
  - id: fetch
    name: Fetch Template
    action: fetch:template
    input:
      url: ./skeleton
      values:
        name: ${{ parameters.name }}
  - id: publish
    name: Publish to GitHub
    action: publish:github
    input:
      repoUrl: github.com?owner=myorg&repo=${{ parameters.name }}
```

---

## Platform Patterns

### Golden Paths

Pre-defined, well-supported ways to accomplish common tasks:

1. **Service Creation** - Template with CI/CD, monitoring, logging
2. **Database Provisioning** - Self-service with guardrails
3. **Environment Management** - Dev, staging, production workflows

### Self-Service Infrastructure

```yaml
# Developer requests database
apiVersion: platform.example.com/v1
kind: Database
metadata:
  name: my-app-db
  namespace: my-team
spec:
  size: medium
  engine: postgres
```

### Platform APIs

Expose platform capabilities through Kubernetes CRDs:

- Databases
- Message queues
- Storage buckets
- DNS entries
- Certificates

---

## Best Practices

1. **Start small** - Begin with highest-impact capabilities
2. **Measure adoption** - Track developer satisfaction
3. **Document everything** - Self-service requires good docs
4. **Iterate based on feedback** - Platform is a product
5. **Maintain golden paths** - Keep them up to date

---

[← Back to CNPE Overview](./README.md)
