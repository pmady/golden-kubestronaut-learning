# CKAD Hands-on Lab Exercises

These labs simulate real CKAD exam scenarios focused on application development and deployment.

## Prerequisites

- Kubernetes cluster access
- kubectl configured
- Familiarity with YAML

---

## Lab 1: Pod Design Patterns

**Objective:** Create pods with various design patterns

### Multi-Container Pod

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: multi-container
spec:
  containers:
  - name: app
    image: nginx
    ports:
    - containerPort: 80
  - name: sidecar
    image: busybox
    command: ['sh', '-c', 'while true; do wget -qO- http://localhost:80 >> /var/log/access.log; sleep 5; done']
    volumeMounts:
    - name: logs
      mountPath: /var/log
  volumes:
  - name: logs
    emptyDir: {}
```

### Init Container

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: init-demo
spec:
  initContainers:
  - name: init-service
    image: busybox
    command: ['sh', '-c', 'until nslookup myservice; do echo waiting; sleep 2; done']
  containers:
  - name: app
    image: nginx
```

### Tasks

```bash
kubectl apply -f multi-container.yaml
kubectl logs multi-container -c sidecar
kubectl exec multi-container -c app -- cat /usr/share/nginx/html/index.html
```

<details>
<summary>Expected Outcome</summary>

- Multi-container pod runs both containers
- Init container runs before main container
- Sidecar continuously logs access

</details>

---

## Lab 2: Deployments and Rolling Updates

**Objective:** Manage deployments with various update strategies

### Tasks

1. **Create deployment:**

```bash
kubectl create deployment webapp --image=nginx:1.19 --replicas=4
kubectl get deployment webapp -o yaml > webapp.yaml
```

2. **Configure rolling update strategy:**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: webapp
spec:
  replicas: 4
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 1
  selector:
    matchLabels:
      app: webapp
  template:
    metadata:
      labels:
        app: webapp
    spec:
      containers:
      - name: nginx
        image: nginx:1.19
        ports:
        - containerPort: 80
        readinessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5
```

3. **Perform rolling update:**

```bash
kubectl set image deployment/webapp nginx=nginx:1.20
kubectl rollout status deployment/webapp
kubectl rollout history deployment/webapp
```

4. **Rollback:**

```bash
kubectl rollout undo deployment/webapp
kubectl rollout undo deployment/webapp --to-revision=1
```

5. **Pause and resume:**

```bash
kubectl rollout pause deployment/webapp
kubectl set image deployment/webapp nginx=nginx:1.21
kubectl rollout resume deployment/webapp
```

---

## Lab 3: Jobs and CronJobs

**Objective:** Create batch workloads

### Job

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: pi-job
spec:
  completions: 3
  parallelism: 2
  backoffLimit: 4
  template:
    spec:
      containers:
      - name: pi
        image: perl
        command: ["perl", "-Mbignum=bpi", "-wle", "print bpi(2000)"]
      restartPolicy: Never
```

### CronJob

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: backup-job
spec:
  schedule: "*/5 * * * *"
  successfulJobsHistoryLimit: 3
  failedJobsHistoryLimit: 1
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: backup
            image: busybox
            command: ['sh', '-c', 'echo "Backup completed at $(date)"']
          restartPolicy: OnFailure
```

### Tasks

```bash
kubectl apply -f pi-job.yaml
kubectl get jobs -w
kubectl logs job/pi-job

kubectl apply -f backup-job.yaml
kubectl get cronjobs
kubectl get jobs --watch
```

---

## Lab 4: ConfigMaps and Secrets

**Objective:** Manage application configuration

### ConfigMap from file

```bash
# Create config file
cat <<EOF > app.properties
database.host=mysql.default.svc
database.port=3306
log.level=INFO
EOF

kubectl create configmap app-config --from-file=app.properties
```

### ConfigMap as environment variables

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: config-env-pod
spec:
  containers:
  - name: app
    image: busybox
    command: ['sh', '-c', 'echo "DB: $DB_HOST:$DB_PORT" && sleep 3600']
    env:
    - name: DB_HOST
      valueFrom:
        configMapKeyRef:
          name: app-config
          key: database.host
    - name: DB_PORT
      valueFrom:
        configMapKeyRef:
          name: app-config
          key: database.port
```

### ConfigMap as volume

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: config-vol-pod
spec:
  containers:
  - name: app
    image: busybox
    command: ['sh', '-c', 'cat /config/app.properties && sleep 3600']
    volumeMounts:
    - name: config
      mountPath: /config
  volumes:
  - name: config
    configMap:
      name: app-config
```

### Secret

```bash
kubectl create secret generic db-credentials \
  --from-literal=username=admin \
  --from-literal=password=secretpass123
```

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secret-pod
spec:
  containers:
  - name: app
    image: busybox
    command: ['sh', '-c', 'echo "User: $DB_USER" && sleep 3600']
    env:
    - name: DB_USER
      valueFrom:
        secretKeyRef:
          name: db-credentials
          key: username
    - name: DB_PASS
      valueFrom:
        secretKeyRef:
          name: db-credentials
          key: password
```

---

## Lab 5: Probes and Resource Management

**Objective:** Configure health checks and resource limits

### Liveness and Readiness Probes

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: probe-demo
spec:
  containers:
  - name: app
    image: nginx
    ports:
    - containerPort: 80
    livenessProbe:
      httpGet:
        path: /healthz
        port: 80
      initialDelaySeconds: 10
      periodSeconds: 5
      failureThreshold: 3
    readinessProbe:
      httpGet:
        path: /ready
        port: 80
      initialDelaySeconds: 5
      periodSeconds: 3
    resources:
      requests:
        memory: "64Mi"
        cpu: "100m"
      limits:
        memory: "128Mi"
        cpu: "200m"
```

### LimitRange

```yaml
apiVersion: v1
kind: LimitRange
metadata:
  name: default-limits
spec:
  limits:
  - default:
      memory: "256Mi"
      cpu: "200m"
    defaultRequest:
      memory: "128Mi"
      cpu: "100m"
    type: Container
```

---

## Lab 6: Services and Ingress

**Objective:** Expose applications

### Create services

```bash
kubectl create deployment web --image=nginx --replicas=3
kubectl expose deployment web --port=80 --target-port=80 --name=web-svc
kubectl expose deployment web --port=80 --type=NodePort --name=web-nodeport
```

### Ingress

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: web-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  rules:
  - host: myapp.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: web-svc
            port:
              number: 80
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: api-svc
            port:
              number: 8080
```

---

## Lab 7: Security Context

**Objective:** Configure pod security

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: security-demo
spec:
  securityContext:
    runAsUser: 1000
    runAsGroup: 3000
    fsGroup: 2000
  containers:
  - name: app
    image: busybox
    command: ['sh', '-c', 'id && sleep 3600']
    securityContext:
      allowPrivilegeEscalation: false
      readOnlyRootFilesystem: true
      capabilities:
        drop:
        - ALL
    volumeMounts:
    - name: tmp
      mountPath: /tmp
  volumes:
  - name: tmp
    emptyDir: {}
```

### Tasks

```bash
kubectl apply -f security-demo.yaml
kubectl exec security-demo -- id
kubectl exec security-demo -- touch /tmp/test  # Should work
kubectl exec security-demo -- touch /test      # Should fail (read-only)
```

---

## Lab 8: Helm Basics

**Objective:** Deploy applications using Helm

```bash
# Add repo
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

# Search charts
helm search repo nginx

# Install chart
helm install my-nginx bitnami/nginx

# List releases
helm list

# Upgrade with values
helm upgrade my-nginx bitnami/nginx --set replicaCount=3

# Rollback
helm rollback my-nginx 1

# Uninstall
helm uninstall my-nginx
```

---

## Additional Practice Resources

- [Killer.sh CKAD Simulator](https://killer.sh/)
- [Killercoda CKAD Scenarios](https://killercoda.com/ckad)
- [CKAD Exercises GitHub](https://github.com/dgkanatsios/CKAD-exercises)

---

[← Back to CKAD Overview](../ckad/README.md)
