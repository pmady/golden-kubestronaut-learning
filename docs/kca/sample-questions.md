# KCA Sample Practice Questions

## Practice Resources

- [Kyverno Documentation](https://kyverno.io/docs/)
- [Kyverno Playground](https://playground.kyverno.io/)

---

## Fundamentals (15%)

### Question 1
What are the main policy types in Kyverno?

<details>
<summary>Show Solution</summary>

1. **Validate** - Check resources against rules, block non-compliant
2. **Mutate** - Modify resources automatically
3. **Generate** - Create additional resources
4. **VerifyImages** - Verify container image signatures

</details>

### Question 2
What is the difference between ClusterPolicy and Policy?

<details>
<summary>Show Solution</summary>

- **ClusterPolicy** - Cluster-scoped, applies to all namespaces
- **Policy** - Namespace-scoped, applies only to its namespace

```yaml
# ClusterPolicy - cluster-wide
apiVersion: kyverno.io/v1
kind: ClusterPolicy

# Policy - namespace-scoped
apiVersion: kyverno.io/v1
kind: Policy
metadata:
  namespace: my-namespace
```

</details>

---

## Policy Authoring (30%)

### Question 3
Create a validation policy that requires all pods to have resource limits.

<details>
<summary>Show Solution</summary>

```yaml
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
          kinds:
          - Pod
    validate:
      message: "Resource limits are required"
      pattern:
        spec:
          containers:
          - resources:
              limits:
                memory: "?*"
                cpu: "?*"
```

</details>

### Question 4
Create a mutation policy that adds a default label to all pods.

<details>
<summary>Show Solution</summary>

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: add-default-label
spec:
  rules:
  - name: add-team-label
    match:
      any:
      - resources:
          kinds:
          - Pod
    mutate:
      patchStrategicMerge:
        metadata:
          labels:
            team: default
```

</details>

### Question 5
Create a policy that generates a NetworkPolicy for each new namespace.

<details>
<summary>Show Solution</summary>

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: generate-netpol
spec:
  rules:
  - name: generate-default-deny
    match:
      any:
      - resources:
          kinds:
          - Namespace
    generate:
      apiVersion: networking.k8s.io/v1
      kind: NetworkPolicy
      name: default-deny
      namespace: "{{request.object.metadata.name}}"
      data:
        spec:
          podSelector: {}
          policyTypes:
          - Ingress
          - Egress
```

</details>

### Question 6
Create a policy to verify image signatures using cosign.

<details>
<summary>Show Solution</summary>

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: verify-images
spec:
  validationFailureAction: Enforce
  rules:
  - name: verify-signature
    match:
      any:
      - resources:
          kinds:
          - Pod
    verifyImages:
    - imageReferences:
      - "ghcr.io/myorg/*"
      attestors:
      - entries:
        - keys:
            publicKeys: |
              -----BEGIN PUBLIC KEY-----
              ...
              -----END PUBLIC KEY-----
```

</details>

---

## Policy Application (20%)

### Question 7
What is the difference between Enforce and Audit modes?

<details>
<summary>Show Solution</summary>

- **Enforce** - Block non-compliant resources from being created
- **Audit** - Allow resources but report violations in policy reports

```yaml
spec:
  validationFailureAction: Enforce  # Block violations
  # or
  validationFailureAction: Audit    # Report only
```

Use Audit mode for testing policies before enforcement.

</details>

### Question 8
How do you exclude certain resources from a policy?

<details>
<summary>Show Solution</summary>

```yaml
spec:
  rules:
  - name: my-rule
    match:
      any:
      - resources:
          kinds:
          - Pod
    exclude:
      any:
      - resources:
          namespaces:
          - kube-system
      - resources:
          selector:
            matchLabels:
              skip-policy: "true"
```

</details>

### Question 9
How do you use preconditions in a policy?

<details>
<summary>Show Solution</summary>

```yaml
spec:
  rules:
  - name: check-image-tag
    match:
      any:
      - resources:
          kinds:
          - Pod
    preconditions:
      all:
      - key: "{{request.operation}}"
        operator: NotEquals
        value: DELETE
      - key: "{{request.object.metadata.labels.environment}}"
        operator: Equals
        value: production
    validate:
      message: "Production pods must use specific tags"
      pattern:
        spec:
          containers:
          - image: "*/myapp:v*"
```

</details>

---

## Policy Operations (15%)

### Question 10
How do you view policy reports?

<details>
<summary>Show Solution</summary>

```bash
# View cluster-wide policy reports
kubectl get clusterpolicyreport

# View namespace policy reports
kubectl get policyreport -n my-namespace

# Get detailed report
kubectl get policyreport -n my-namespace -o yaml

# Check specific policy violations
kubectl get policyreport -A -o jsonpath='{.items[*].results[?(@.result=="fail")]}'
```

</details>

### Question 11
How do you troubleshoot a policy that isn't working?

<details>
<summary>Show Solution</summary>

```bash
# Check policy status
kubectl get clusterpolicy my-policy -o yaml

# Check Kyverno logs
kubectl logs -n kyverno -l app.kubernetes.io/name=kyverno

# Test policy with dry-run
kubectl apply -f pod.yaml --dry-run=server

# Use Kyverno CLI to test
kyverno apply policy.yaml --resource pod.yaml
```

</details>

---

## Advanced Concepts (20%)

### Question 12
How do you use variables and context in policies?

<details>
<summary>Show Solution</summary>

```yaml
spec:
  rules:
  - name: use-variables
    match:
      any:
      - resources:
          kinds:
          - Pod
    context:
    - name: allowedRegistries
      configMap:
        name: allowed-registries
        namespace: kyverno
    validate:
      message: "Image must be from allowed registry"
      deny:
        conditions:
          any:
          - key: "{{request.object.spec.containers[0].image}}"
            operator: AnyNotIn
            value: "{{allowedRegistries.data.registries}}"
```

</details>

### Question 13
How do you use JMESPath expressions in Kyverno?

<details>
<summary>Show Solution</summary>

```yaml
spec:
  rules:
  - name: check-labels
    match:
      any:
      - resources:
          kinds:
          - Pod
    validate:
      message: "Missing required labels"
      deny:
        conditions:
          any:
          - key: "{{ request.object.metadata.labels | keys(@) | length(@) }}"
            operator: LessThan
            value: 2
```

Common JMESPath functions:
- `length()` - Get array/string length
- `keys()` - Get object keys
- `contains()` - Check if array contains value
- `to_string()` - Convert to string

</details>

### Question 14
Create a policy that validates pod security based on namespace labels.

<details>
<summary>Show Solution</summary>

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: enforce-pod-security
spec:
  validationFailureAction: Enforce
  rules:
  - name: restricted-namespace
    match:
      any:
      - resources:
          kinds:
          - Pod
          namespaceSelector:
            matchLabels:
              security: restricted
    validate:
      message: "Pods in restricted namespaces must run as non-root"
      pattern:
        spec:
          securityContext:
            runAsNonRoot: true
          containers:
          - securityContext:
              allowPrivilegeEscalation: false
```

</details>

---

## Exam Tips

1. **Know policy types** - Validate, Mutate, Generate, VerifyImages
2. **Understand match/exclude** - How to target specific resources
3. **Practice pattern matching** - Wildcards, anchors, operators
4. **Know validation modes** - Enforce vs Audit
5. **Understand policy reports** - How to view and interpret

---

[← Back to KCA Overview](./README.md)
