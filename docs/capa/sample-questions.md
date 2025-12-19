# CAPA Sample Practice Questions

## Practice Resources

- [Argo CD Documentation](https://argo-cd.readthedocs.io/)
- [Killercoda Argo Scenarios](https://killercoda.com/)

---

## Argo CD (40%)

### Question 1
Create an Argo CD Application that deploys from a Git repository.

<details>
<summary>Show Solution</summary>

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: my-app
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/org/repo.git
    targetRevision: HEAD
    path: manifests
  destination:
    server: https://kubernetes.default.svc
    namespace: default
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

</details>

### Question 2
How do you sync an application manually using the CLI?

<details>
<summary>Show Solution</summary>

```bash
argocd app sync my-app

# With prune
argocd app sync my-app --prune

# Force sync
argocd app sync my-app --force
```

</details>

### Question 3
Configure an Application to use a Helm chart with custom values.

<details>
<summary>Show Solution</summary>

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: helm-app
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://charts.example.com
    chart: my-chart
    targetRevision: 1.0.0
    helm:
      values: |
        replicaCount: 3
        image:
          tag: latest
      parameters:
      - name: service.type
        value: LoadBalancer
  destination:
    server: https://kubernetes.default.svc
    namespace: default
```

</details>

### Question 4
What are the different sync statuses in Argo CD?

<details>
<summary>Show Solution</summary>

**Sync Status:**
- **Synced** - Live state matches desired state
- **OutOfSync** - Live state differs from desired state
- **Unknown** - Unable to determine sync status

**Health Status:**
- **Healthy** - Resource is healthy
- **Progressing** - Resource is not healthy but could become healthy
- **Degraded** - Resource is degraded
- **Suspended** - Resource is suspended
- **Missing** - Resource does not exist
- **Unknown** - Health status unknown

</details>

---

## Argo Workflows (25%)

### Question 5
Create a simple Argo Workflow with two sequential steps.

<details>
<summary>Show Solution</summary>

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Workflow
metadata:
  generateName: hello-world-
spec:
  entrypoint: main
  templates:
  - name: main
    steps:
    - - name: step1
        template: hello
    - - name: step2
        template: world
  - name: hello
    container:
      image: alpine
      command: [echo, "Hello"]
  - name: world
    container:
      image: alpine
      command: [echo, "World"]
```

</details>

### Question 6
Create a DAG workflow with parallel tasks.

<details>
<summary>Show Solution</summary>

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Workflow
metadata:
  generateName: dag-workflow-
spec:
  entrypoint: main
  templates:
  - name: main
    dag:
      tasks:
      - name: A
        template: task
      - name: B
        template: task
        dependencies: [A]
      - name: C
        template: task
        dependencies: [A]
      - name: D
        template: task
        dependencies: [B, C]
  - name: task
    container:
      image: alpine
      command: [echo, "Running task"]
```

</details>

### Question 7
Pass parameters between workflow steps.

<details>
<summary>Show Solution</summary>

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Workflow
metadata:
  generateName: param-workflow-
spec:
  entrypoint: main
  templates:
  - name: main
    steps:
    - - name: generate
        template: gen-output
    - - name: consume
        template: use-output
        arguments:
          parameters:
          - name: message
            value: "{{steps.generate.outputs.parameters.result}}"
  - name: gen-output
    container:
      image: alpine
      command: [sh, -c, "echo 'Hello' > /tmp/result.txt"]
    outputs:
      parameters:
      - name: result
        valueFrom:
          path: /tmp/result.txt
  - name: use-output
    inputs:
      parameters:
      - name: message
    container:
      image: alpine
      command: [echo, "{{inputs.parameters.message}}"]
```

</details>

---

## Argo Rollouts (20%)

### Question 8
Create a Canary rollout that shifts 20% traffic initially.

<details>
<summary>Show Solution</summary>

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: canary-rollout
spec:
  replicas: 5
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: app
        image: my-app:v2
  strategy:
    canary:
      steps:
      - setWeight: 20
      - pause: {duration: 1m}
      - setWeight: 50
      - pause: {duration: 1m}
      - setWeight: 80
      - pause: {duration: 1m}
```

</details>

### Question 9
Create a Blue-Green rollout.

<details>
<summary>Show Solution</summary>

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: bluegreen-rollout
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: app
        image: my-app:v2
  strategy:
    blueGreen:
      activeService: my-app-active
      previewService: my-app-preview
      autoPromotionEnabled: false
```

</details>

### Question 10
Promote or abort a rollout using kubectl.

<details>
<summary>Show Solution</summary>

```bash
# Promote rollout
kubectl argo rollouts promote my-rollout

# Abort rollout
kubectl argo rollouts abort my-rollout

# Retry rollout
kubectl argo rollouts retry my-rollout

# Check status
kubectl argo rollouts status my-rollout
```

</details>

---

## Argo Events (15%)

### Question 11
Create an EventSource for GitHub webhooks.

<details>
<summary>Show Solution</summary>

```yaml
apiVersion: argoproj.io/v1alpha1
kind: EventSource
metadata:
  name: github-eventsource
spec:
  github:
    example:
      repositories:
      - owner: my-org
        names:
        - my-repo
      webhook:
        endpoint: /push
        port: "12000"
        method: POST
      events:
      - push
      apiToken:
        name: github-token
        key: token
```

</details>

### Question 12
Create a Sensor that triggers a workflow on events.

<details>
<summary>Show Solution</summary>

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Sensor
metadata:
  name: github-sensor
spec:
  dependencies:
  - name: github-dep
    eventSourceName: github-eventsource
    eventName: example
  triggers:
  - template:
      name: workflow-trigger
      k8s:
        operation: create
        source:
          resource:
            apiVersion: argoproj.io/v1alpha1
            kind: Workflow
            metadata:
              generateName: github-workflow-
            spec:
              entrypoint: main
              templates:
              - name: main
                container:
                  image: alpine
                  command: [echo, "Triggered by GitHub"]
```

</details>

---

## Exam Tips

1. **Know Argo CD Application spec** - source, destination, syncPolicy
2. **Understand sync strategies** - automated vs manual, prune, selfHeal
3. **Practice Workflow templates** - steps, DAG, parameters, artifacts
4. **Know Rollout strategies** - canary steps, blue-green services
5. **Understand event-driven architecture** - EventSource, Sensor, Trigger

---

[← Back to CAPA Overview](./README.md)
