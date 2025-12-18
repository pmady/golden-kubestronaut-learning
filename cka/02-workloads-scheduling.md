# Workloads & Scheduling (15%)

This domain covers managing workloads and understanding Kubernetes scheduling.

## Deployments

### Creating Deployments

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 1
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.21
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "64Mi"
            cpu: "250m"
          limits:
            memory: "128Mi"
            cpu: "500m"
```

### Deployment Commands

```bash
# Create deployment
kubectl create deployment nginx --image=nginx:1.21 --replicas=3

# Scale deployment
kubectl scale deployment nginx --replicas=5

# Update image
kubectl set image deployment/nginx nginx=nginx:1.22

# Rollout commands
kubectl rollout status deployment/nginx
kubectl rollout history deployment/nginx
kubectl rollout undo deployment/nginx
kubectl rollout undo deployment/nginx --to-revision=2
kubectl rollout pause deployment/nginx
kubectl rollout resume deployment/nginx
```

## DaemonSets

Ensures all (or some) nodes run a copy of a Pod.

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: fluentd
  namespace: kube-system
spec:
  selector:
    matchLabels:
      name: fluentd
  template:
    metadata:
      labels:
        name: fluentd
    spec:
      tolerations:
      - key: node-role.kubernetes.io/control-plane
        operator: Exists
        effect: NoSchedule
      containers:
      - name: fluentd
        image: fluentd:v1.14
        volumeMounts:
        - name: varlog
          mountPath: /var/log
      volumes:
      - name: varlog
        hostPath:
          path: /var/log
```

## StatefulSets

For stateful applications requiring stable network identities and persistent storage.

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mysql
spec:
  serviceName: mysql
  replicas: 3
  selector:
    matchLabels:
      app: mysql
  template:
    metadata:
      labels:
        app: mysql
    spec:
      containers:
      - name: mysql
        image: mysql:8.0
        ports:
        - containerPort: 3306
        volumeMounts:
        - name: data
          mountPath: /var/lib/mysql
        env:
        - name: MYSQL_ROOT_PASSWORD
          valueFrom:
            secretKeyRef:
              name: mysql-secret
              key: password
  volumeClaimTemplates:
  - metadata:
      name: data
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 10Gi
```

## Scheduling

### Node Selectors

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  nodeSelector:
    disktype: ssd
  containers:
  - name: nginx
    image: nginx
```

### Node Affinity

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: topology.kubernetes.io/zone
            operator: In
            values:
            - us-east-1a
            - us-east-1b
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 1
        preference:
          matchExpressions:
          - key: disktype
            operator: In
            values:
            - ssd
  containers:
  - name: nginx
    image: nginx
```

### Pod Affinity and Anti-Affinity

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: web-server
spec:
  affinity:
    podAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
      - labelSelector:
          matchExpressions:
          - key: app
            operator: In
            values:
            - cache
        topologyKey: kubernetes.io/hostname
    podAntiAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 100
        podAffinityTerm:
          labelSelector:
            matchExpressions:
            - key: app
              operator: In
              values:
              - web-server
          topologyKey: kubernetes.io/hostname
  containers:
  - name: web
    image: nginx
```

### Taints and Tolerations

```bash
# Add taint to node
kubectl taint nodes node1 key=value:NoSchedule
kubectl taint nodes node1 key=value:NoExecute
kubectl taint nodes node1 key=value:PreferNoSchedule

# Remove taint
kubectl taint nodes node1 key=value:NoSchedule-
```

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  tolerations:
  - key: "key"
    operator: "Equal"
    value: "value"
    effect: "NoSchedule"
  - key: "key"
    operator: "Exists"
    effect: "NoExecute"
    tolerationSeconds: 3600
  containers:
  - name: nginx
    image: nginx
```

### Taint Effects

| Effect | Description |
|--------|-------------|
| `NoSchedule` | New pods won't be scheduled |
| `PreferNoSchedule` | Scheduler tries to avoid |
| `NoExecute` | Evicts existing pods |

## Resource Management

### Resource Requests and Limits

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: resource-demo
spec:
  containers:
  - name: app
    image: nginx
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"
```

### LimitRange

```yaml
apiVersion: v1
kind: LimitRange
metadata:
  name: resource-limits
  namespace: default
spec:
  limits:
  - type: Container
    default:
      cpu: "500m"
      memory: "256Mi"
    defaultRequest:
      cpu: "100m"
      memory: "128Mi"
    max:
      cpu: "2"
      memory: "1Gi"
    min:
      cpu: "50m"
      memory: "64Mi"
```

### ResourceQuota

```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: compute-quota
  namespace: default
spec:
  hard:
    requests.cpu: "4"
    requests.memory: "8Gi"
    limits.cpu: "8"
    limits.memory: "16Gi"
    pods: "10"
    configmaps: "10"
    secrets: "10"
```

## Static Pods

Static pods are managed directly by kubelet on a specific node.

```bash
# Default static pod path
/etc/kubernetes/manifests/

# Check kubelet config for static pod path
cat /var/lib/kubelet/config.yaml | grep staticPodPath

# Create static pod
cat <<EOF > /etc/kubernetes/manifests/static-nginx.yaml
apiVersion: v1
kind: Pod
metadata:
  name: static-nginx
spec:
  containers:
  - name: nginx
    image: nginx
EOF
```

## Multiple Schedulers

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: custom-scheduler-pod
spec:
  schedulerName: my-custom-scheduler
  containers:
  - name: nginx
    image: nginx
```

## Manual Scheduling

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: manual-pod
spec:
  nodeName: node01  # Bypass scheduler
  containers:
  - name: nginx
    image: nginx
```

## Labels and Selectors

```bash
# Add label
kubectl label nodes node1 disktype=ssd
kubectl label pods nginx env=prod

# Remove label
kubectl label nodes node1 disktype-

# Show labels
kubectl get nodes --show-labels
kubectl get pods -l env=prod
kubectl get pods -l 'env in (prod,dev)'
```

## Key Concepts to Remember

1. **Deployments** - Declarative updates for Pods
2. **DaemonSets** - One pod per node
3. **StatefulSets** - Stable network identity and storage
4. **Node Affinity** - Schedule based on node labels
5. **Taints/Tolerations** - Repel pods from nodes
6. **Static Pods** - Managed by kubelet directly

## Practice Questions

1. How do you create a DaemonSet that runs on all nodes including control plane?
2. What is the difference between nodeSelector and nodeAffinity?
3. How do you taint a node to prevent scheduling?
4. Where are static pod manifests stored?
5. How do you schedule a pod to a specific node?

---

[← Previous: Cluster Architecture](./01-cluster-architecture.md) | [Back to CKA Overview](./README.md) | [Next: Services & Networking →](./03-services-networking.md)
