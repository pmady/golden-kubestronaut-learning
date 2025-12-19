# CNPE Sample Practice Questions

## Practice Resources

- [Platform Engineering](https://platformengineering.org/)
- [Kubernetes Operators](https://kubernetes.io/docs/concepts/extend-kubernetes/operator/)
- [Killercoda Scenarios](https://killercoda.com/)

---

## Platform Design (20%)

### Question 1
Design a multi-tenant platform architecture for 50 development teams.

<details>
<summary>Show Solution</summary>

**Architecture considerations:**

1. **Isolation Strategy:**
   - Namespace per team with resource quotas
   - Network policies for isolation
   - RBAC per namespace

2. **Resource Management:**
   ```yaml
   apiVersion: v1
   kind: ResourceQuota
   metadata:
     name: team-quota
     namespace: team-alpha
   spec:
     hard:
       requests.cpu: "10"
       requests.memory: 20Gi
       limits.cpu: "20"
       limits.memory: 40Gi
       pods: "50"
   ```

3. **Shared Services:**
   - Centralized logging (Loki)
   - Metrics (Prometheus/Thanos)
   - Ingress controller
   - Certificate management

4. **Self-Service:**
   - Namespace provisioning via GitOps
   - Template-based deployments
   - Developer portal (Backstage)

</details>

### Question 2
How do you design APIs for a platform?

<details>
<summary>Show Solution</summary>

**Platform API Design Principles:**

1. **Use Kubernetes-native APIs:**
   ```yaml
   apiVersion: platform.example.com/v1
   kind: Application
   metadata:
     name: my-app
   spec:
     image: myapp:v1
     replicas: 3
     ingress:
       enabled: true
       host: myapp.example.com
   ```

2. **Abstract complexity:**
   - Hide infrastructure details
   - Provide sensible defaults
   - Allow overrides when needed

3. **Versioning:**
   - Use API versioning (v1alpha1, v1beta1, v1)
   - Maintain backward compatibility
   - Deprecation policy

4. **Documentation:**
   - OpenAPI specs
   - Examples for common use cases

</details>

---

## Platform Implementation (30%)

### Question 3
Create a Kubernetes Operator that manages a custom Application resource.

<details>
<summary>Show Solution</summary>

```go
// Controller reconcile function
func (r *ApplicationReconciler) Reconcile(ctx context.Context, req ctrl.Request) (ctrl.Result, error) {
    var app platformv1.Application
    if err := r.Get(ctx, req.NamespacedName, &app); err != nil {
        return ctrl.Result{}, client.IgnoreNotFound(err)
    }

    // Create Deployment
    deployment := &appsv1.Deployment{
        ObjectMeta: metav1.ObjectMeta{
            Name:      app.Name,
            Namespace: app.Namespace,
        },
        Spec: appsv1.DeploymentSpec{
            Replicas: &app.Spec.Replicas,
            Selector: &metav1.LabelSelector{
                MatchLabels: map[string]string{"app": app.Name},
            },
            Template: corev1.PodTemplateSpec{
                ObjectMeta: metav1.ObjectMeta{
                    Labels: map[string]string{"app": app.Name},
                },
                Spec: corev1.PodSpec{
                    Containers: []corev1.Container{{
                        Name:  app.Name,
                        Image: app.Spec.Image,
                    }},
                },
            },
        },
    }

    if err := ctrl.SetControllerReference(&app, deployment, r.Scheme); err != nil {
        return ctrl.Result{}, err
    }

    if err := r.Create(ctx, deployment); err != nil {
        if !errors.IsAlreadyExists(err) {
            return ctrl.Result{}, err
        }
    }

    return ctrl.Result{}, nil
}
```

</details>

### Question 4
Implement GitOps for platform configuration.

<details>
<summary>Show Solution</summary>

**Repository Structure:**
```
platform-config/
├── clusters/
│   ├── production/
│   │   ├── flux-system/
│   │   └── kustomization.yaml
│   └── staging/
├── infrastructure/
│   ├── controllers/
│   ├── configs/
│   └── kustomization.yaml
└── tenants/
    ├── team-alpha/
    │   ├── namespace.yaml
    │   ├── rbac.yaml
    │   └── quota.yaml
    └── team-beta/
```

**Flux Kustomization:**
```yaml
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: infrastructure
  namespace: flux-system
spec:
  interval: 10m
  sourceRef:
    kind: GitRepository
    name: platform-config
  path: ./infrastructure
  prune: true
  healthChecks:
  - apiVersion: apps/v1
    kind: Deployment
    name: ingress-nginx-controller
    namespace: ingress-nginx
```

</details>

### Question 5
Create a Crossplane Composition for provisioning databases.

<details>
<summary>Show Solution</summary>

```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: Composition
metadata:
  name: postgresql-aws
spec:
  compositeTypeRef:
    apiVersion: database.platform.io/v1
    kind: PostgreSQLInstance
  resources:
  - name: rds-instance
    base:
      apiVersion: rds.aws.crossplane.io/v1beta1
      kind: Instance
      spec:
        forProvider:
          engine: postgres
          engineVersion: "14"
          instanceClass: db.t3.medium
          allocatedStorage: 20
          publiclyAccessible: false
    patches:
    - fromFieldPath: spec.storageGB
      toFieldPath: spec.forProvider.allocatedStorage
    - fromFieldPath: spec.size
      toFieldPath: spec.forProvider.instanceClass
      transforms:
      - type: map
        map:
          small: db.t3.small
          medium: db.t3.medium
          large: db.t3.large
---
apiVersion: apiextensions.crossplane.io/v1
kind: CompositeResourceDefinition
metadata:
  name: postgresqlinstances.database.platform.io
spec:
  group: database.platform.io
  names:
    kind: PostgreSQLInstance
    plural: postgresqlinstances
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
              storageGB:
                type: integer
```

</details>

---

## Platform Operations (25%)

### Question 6
Implement a cluster upgrade strategy with zero downtime.

<details>
<summary>Show Solution</summary>

**Blue-Green Cluster Upgrade:**

1. **Preparation:**
   ```bash
   # Create new cluster with updated version
   eksctl create cluster -f new-cluster.yaml
   
   # Install platform components
   flux bootstrap github --context=new-cluster ...
   ```

2. **Migration:**
   ```bash
   # Sync workloads via GitOps
   # Update DNS weights gradually
   
   # Route 10% traffic to new cluster
   aws route53 change-resource-record-sets \
     --hosted-zone-id $ZONE_ID \
     --change-batch file://weighted-10.json
   ```

3. **Validation:**
   ```bash
   # Monitor error rates
   # Check application health
   # Verify data consistency
   ```

4. **Cutover:**
   ```bash
   # Route 100% to new cluster
   # Decommission old cluster
   ```

</details>

### Question 7
Design a disaster recovery plan for a platform.

<details>
<summary>Show Solution</summary>

**DR Strategy:**

1. **Backup:**
   ```yaml
   # Velero backup schedule
   apiVersion: velero.io/v1
   kind: Schedule
   metadata:
     name: daily-backup
   spec:
     schedule: "0 2 * * *"
     template:
       includedNamespaces:
       - "*"
       excludedNamespaces:
       - kube-system
       storageLocation: aws-backup
       ttl: 720h
   ```

2. **Recovery Targets:**
   - RPO: 1 hour (data loss tolerance)
   - RTO: 4 hours (recovery time)

3. **DR Runbook:**
   - Restore cluster from backup
   - Verify DNS failover
   - Test application functionality
   - Notify stakeholders

4. **Regular Testing:**
   - Monthly DR drills
   - Documented procedures
   - Post-mortem reviews

</details>

---

## Security and Governance (15%)

### Question 8
Implement policy-as-code for platform governance.

<details>
<summary>Show Solution</summary>

**Kyverno Policies:**

```yaml
# Require resource limits
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: require-limits
spec:
  validationFailureAction: Enforce
  rules:
  - name: check-limits
    match:
      any:
      - resources:
          kinds: [Pod]
    validate:
      message: "Resource limits required"
      pattern:
        spec:
          containers:
          - resources:
              limits:
                memory: "?*"
                cpu: "?*"

---
# Require approved registries
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: allowed-registries
spec:
  validationFailureAction: Enforce
  rules:
  - name: check-registry
    match:
      any:
      - resources:
          kinds: [Pod]
    validate:
      message: "Images must be from approved registries"
      pattern:
        spec:
          containers:
          - image: "gcr.io/myorg/* | docker.io/myorg/*"
```

</details>

### Question 9
Implement RBAC for platform teams.

<details>
<summary>Show Solution</summary>

```yaml
# Platform Admin Role
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: platform-admin
rules:
- apiGroups: ["*"]
  resources: ["*"]
  verbs: ["*"]

---
# Team Developer Role
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: team-developer
  namespace: team-alpha
rules:
- apiGroups: ["", "apps", "batch"]
  resources: ["pods", "deployments", "services", "configmaps", "secrets", "jobs"]
  verbs: ["get", "list", "watch", "create", "update", "delete"]
- apiGroups: [""]
  resources: ["pods/log", "pods/exec"]
  verbs: ["get", "create"]

---
# Bind to team
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: team-alpha-developers
  namespace: team-alpha
subjects:
- kind: Group
  name: team-alpha-devs
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: team-developer
  apiGroup: rbac.authorization.k8s.io
```

</details>

---

## Developer Experience (10%)

### Question 10
Design a self-service namespace provisioning system.

<details>
<summary>Show Solution</summary>

**GitOps-based Provisioning:**

1. **Request Template:**
   ```yaml
   # teams/team-gamma/namespace-request.yaml
   apiVersion: platform.io/v1
   kind: TeamNamespace
   metadata:
     name: team-gamma
   spec:
     team: gamma
     owners:
     - user1@example.com
     - user2@example.com
     resourceQuota:
       cpu: "20"
       memory: 40Gi
     networkPolicy: restricted
   ```

2. **Controller generates:**
   - Namespace
   - ResourceQuota
   - NetworkPolicy
   - RBAC bindings
   - Default LimitRange

3. **Workflow:**
   - Developer submits PR
   - Automated validation
   - Approval from platform team
   - Merge triggers provisioning

</details>

---

## Exam Tips

1. **Know Kubernetes deeply** - Operators, controllers, CRDs
2. **Practice GitOps** - Flux, Argo CD configurations
3. **Understand IaC** - Crossplane, Terraform
4. **Know policy tools** - Kyverno, OPA/Gatekeeper
5. **Practice troubleshooting** - Logs, events, debugging

---

[← Back to CNPE Overview](./README.md)
