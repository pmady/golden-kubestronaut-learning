# CGOA Sample Practice Questions

## Practice Resources

- [OpenGitOps](https://opengitops.dev/)
- [Flux Documentation](https://fluxcd.io/docs/)
- [Argo CD Documentation](https://argo-cd.readthedocs.io/)

---

## GitOps Terminology (20%)

### Question 1
What are the four principles of GitOps according to OpenGitOps?

<details>
<summary>Show Solution</summary>

1. **Declarative** - A system managed by GitOps must have its desired state expressed declaratively
2. **Versioned and Immutable** - Desired state is stored in a way that enforces immutability, versioning, and retains a complete version history
3. **Pulled Automatically** - Software agents automatically pull the desired state declarations from the source
4. **Continuously Reconciled** - Software agents continuously observe actual system state and attempt to apply the desired state

</details>

### Question 2
What is "drift" in GitOps terminology?

<details>
<summary>Show Solution</summary>

**Drift** refers to when the actual state of a system diverges from the desired state defined in Git. This can happen when:
- Manual changes are made directly to the cluster
- External processes modify resources
- Failed reconciliation attempts

GitOps tools detect drift and can automatically reconcile to restore the desired state.

</details>

### Question 3
What is the difference between "push" and "pull" based GitOps?

<details>
<summary>Show Solution</summary>

**Push-based:**
- CI/CD pipeline pushes changes to the cluster
- Pipeline needs cluster credentials
- Less secure (credentials in CI)

**Pull-based (GitOps preferred):**
- Agent in cluster pulls changes from Git
- No external access to cluster needed
- More secure (agent has cluster access)
- Continuous reconciliation

</details>

---

## GitOps Principles (30%)

### Question 4
Why is declarative configuration important in GitOps?

<details>
<summary>Show Solution</summary>

Declarative configuration is important because:
- **Predictability** - You describe WHAT you want, not HOW to get there
- **Idempotency** - Applying the same config multiple times yields the same result
- **Version control** - Easy to track changes over time
- **Rollback** - Simple to revert to previous states
- **Auditability** - Clear record of desired state at any point

</details>

### Question 5
How does GitOps handle secrets management?

<details>
<summary>Show Solution</summary>

Common approaches:
1. **Sealed Secrets** - Encrypt secrets that can only be decrypted in cluster
2. **SOPS** - Mozilla's Secrets OPerationS for encrypting files
3. **External Secrets Operator** - Sync secrets from external vaults
4. **Vault** - HashiCorp Vault integration
5. **Cloud KMS** - AWS KMS, GCP KMS, Azure Key Vault

Best practice: Never store plain-text secrets in Git.

</details>

### Question 6
What is continuous reconciliation?

<details>
<summary>Show Solution</summary>

**Continuous reconciliation** is the process where GitOps agents:
1. Continuously monitor the actual state of the system
2. Compare it with the desired state in Git
3. Automatically apply changes to match desired state
4. Report any drift or failures

This ensures the system always converges to the desired state, even after manual changes or failures.

</details>

---

## Related Practices (16%)

### Question 7
How does GitOps relate to Infrastructure as Code (IaC)?

<details>
<summary>Show Solution</summary>

**Relationship:**
- IaC defines infrastructure declaratively (Terraform, Pulumi, CloudFormation)
- GitOps applies IaC principles to application deployment
- Both use version control as source of truth
- GitOps adds continuous reconciliation

**Key difference:**
- IaC typically uses push-based deployment
- GitOps uses pull-based with continuous reconciliation

</details>

### Question 8
What is the relationship between GitOps and CI/CD?

<details>
<summary>Show Solution</summary>

**CI (Continuous Integration):**
- Build and test code
- Create artifacts (images, packages)
- Update Git with new versions

**CD with GitOps:**
- Git is the source of truth for deployments
- GitOps agent pulls and deploys changes
- Separation of concerns: CI builds, GitOps deploys

**Benefits:**
- Clear audit trail
- Easy rollbacks
- Consistent deployments

</details>

---

## GitOps Patterns (20%)

### Question 9
What are common Git repository structures for GitOps?

<details>
<summary>Show Solution</summary>

**Monorepo:**
```
repo/
├── apps/
│   ├── app1/
│   └── app2/
├── infrastructure/
└── clusters/
    ├── dev/
    ├── staging/
    └── prod/
```

**Polyrepo:**
- Separate repos for apps, infrastructure, and cluster config
- More isolation but harder to manage

**Environment branches:**
- main → production
- staging → staging
- develop → development

</details>

### Question 10
How do you handle environment promotion in GitOps?

<details>
<summary>Show Solution</summary>

**Common patterns:**

1. **Directory-based:**
```
environments/
├── dev/
├── staging/
└── prod/
```

2. **Branch-based:**
- Merge from dev → staging → prod branches

3. **Tag-based:**
- Tag releases for promotion

4. **PR-based promotion:**
- Create PR to promote changes between environments

</details>

### Question 11
What is the "App of Apps" pattern?

<details>
<summary>Show Solution</summary>

The **App of Apps** pattern uses a parent Application that manages child Applications:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: apps
spec:
  source:
    path: apps/
  # This directory contains Application manifests
```

Benefits:
- Centralized management
- Hierarchical organization
- Easier bootstrapping
- Consistent configuration

</details>

---

## Tooling (14%)

### Question 12
Compare Flux CD and Argo CD.

<details>
<summary>Show Solution</summary>

| Feature | Flux CD | Argo CD |
|---------|---------|---------|
| Architecture | Toolkit of controllers | Monolithic with UI |
| UI | Separate (Weave GitOps) | Built-in |
| Multi-tenancy | Native | Via Projects |
| Helm support | HelmRelease CRD | Native |
| Kustomize | Native | Native |
| Image automation | Built-in | Separate (Argo Image Updater) |

Both implement GitOps principles effectively.

</details>

### Question 13
Bootstrap Flux CD in a cluster.

<details>
<summary>Show Solution</summary>

```bash
# Install Flux CLI
curl -s https://fluxcd.io/install.sh | sudo bash

# Bootstrap with GitHub
flux bootstrap github \
  --owner=my-org \
  --repository=fleet-infra \
  --branch=main \
  --path=clusters/my-cluster \
  --personal

# Check status
flux check
```

</details>

### Question 14
What is a Flux Kustomization?

<details>
<summary>Show Solution</summary>

```yaml
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: my-app
  namespace: flux-system
spec:
  interval: 10m
  path: ./apps/my-app
  prune: true
  sourceRef:
    kind: GitRepository
    name: flux-system
  healthChecks:
  - apiVersion: apps/v1
    kind: Deployment
    name: my-app
    namespace: default
```

It defines what to deploy, from where, and how often to reconcile.

</details>

---

## Exam Tips

1. **Know the four GitOps principles** - These are fundamental
2. **Understand push vs pull** - Why pull is preferred
3. **Know secret management options** - Sealed Secrets, SOPS, External Secrets
4. **Understand repository patterns** - Monorepo vs polyrepo
5. **Compare Flux and Argo CD** - Key differences and similarities

---

[← Back to CGOA Overview](./README.md)
