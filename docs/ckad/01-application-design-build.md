# Application Design and Build (20%)

This domain covers designing and building cloud native applications for Kubernetes.

## Container Images

### Building Container Images

```dockerfile
# Example Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8080

USER 1000

CMD ["python", "app.py"]
```

### Multi-stage Builds

```dockerfile
# Build stage
FROM golang:1.21 AS builder
WORKDIR /app
COPY . .
RUN CGO_ENABLED=0 go build -o myapp

# Runtime stage
FROM alpine:3.18
COPY --from=builder /app/myapp /myapp
ENTRYPOINT ["/myapp"]
```

### Image Best Practices

- Use specific image tags, not `latest`
- Use minimal base images (alpine, distroless)
- Run as non-root user
- Use multi-stage builds to reduce image size
- Scan images for vulnerabilities

## Jobs and CronJobs

### Job

A Job creates one or more Pods and ensures they complete successfully.

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: pi-job
spec:
  completions: 3
  parallelism: 2
  backoffLimit: 4
  activeDeadlineSeconds: 100
  template:
    spec:
      containers:
      - name: pi
        image: perl:5.34
        command: ["perl", "-Mbignum=bpi", "-wle", "print bpi(2000)"]
      restartPolicy: Never
```

**Key Fields:**

| Field | Description |
|-------|-------------|
| `completions` | Number of successful completions required |
| `parallelism` | Number of pods running in parallel |
| `backoffLimit` | Number of retries before marking as failed |
| `activeDeadlineSeconds` | Maximum time for the job |
| `restartPolicy` | Must be `Never` or `OnFailure` |

### CronJob

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: backup-cronjob
spec:
  schedule: "0 2 * * *"  # Daily at 2 AM
  concurrencyPolicy: Forbid
  successfulJobsHistoryLimit: 3
  failedJobsHistoryLimit: 1
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: backup
            image: backup-tool:v1
            command: ["/bin/sh", "-c", "backup.sh"]
          restartPolicy: OnFailure
```

**Cron Schedule Format:**

```text
┌───────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌───────────── day of month (1 - 31)
│ │ │ ┌───────────── month (1 - 12)
│ │ │ │ ┌───────────── day of week (0 - 6)
│ │ │ │ │
* * * * *
```

**Concurrency Policies:**

| Policy | Description |
|--------|-------------|
| `Allow` | Allow concurrent jobs (default) |
| `Forbid` | Skip new job if previous is still running |
| `Replace` | Replace currently running job with new one |

## Multi-Container Pods

### Sidecar Pattern

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: app-with-sidecar
spec:
  containers:
  - name: app
    image: myapp:v1
    volumeMounts:
    - name: logs
      mountPath: /var/log/app
  - name: log-shipper
    image: fluentd:v1
    volumeMounts:
    - name: logs
      mountPath: /var/log/app
  volumes:
  - name: logs
    emptyDir: {}
```

### Init Containers

Init containers run before app containers start:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: app-with-init
spec:
  initContainers:
  - name: init-db
    image: busybox:1.36
    command: ['sh', '-c', 'until nc -z db-service 5432; do sleep 2; done']
  - name: init-config
    image: busybox:1.36
    command: ['sh', '-c', 'wget -O /config/app.conf http://config-server/app.conf']
    volumeMounts:
    - name: config
      mountPath: /config
  containers:
  - name: app
    image: myapp:v1
    volumeMounts:
    - name: config
      mountPath: /config
  volumes:
  - name: config
    emptyDir: {}
```

### Ambassador Pattern

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: app-with-ambassador
spec:
  containers:
  - name: app
    image: myapp:v1
    env:
    - name: DB_HOST
      value: "localhost"
    - name: DB_PORT
      value: "5432"
  - name: ambassador
    image: ambassador-proxy:v1
    ports:
    - containerPort: 5432
```

### Adapter Pattern

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: app-with-adapter
spec:
  containers:
  - name: app
    image: legacy-app:v1
    volumeMounts:
    - name: logs
      mountPath: /var/log
  - name: adapter
    image: log-adapter:v1
    volumeMounts:
    - name: logs
      mountPath: /var/log
```

## Volumes

### emptyDir

Temporary storage that exists for the Pod's lifetime:

```yaml
volumes:
- name: cache
  emptyDir: {}
- name: memory-cache
  emptyDir:
    medium: Memory
    sizeLimit: 100Mi
```

### hostPath

Mount a file or directory from the host node:

```yaml
volumes:
- name: host-data
  hostPath:
    path: /data
    type: DirectoryOrCreate
```

### PersistentVolumeClaim

```yaml
volumes:
- name: data
  persistentVolumeClaim:
    claimName: my-pvc
```

## Kubectl Imperative Commands

### Create Resources Quickly

```bash
# Create a pod
kubectl run nginx --image=nginx --port=80

# Create a deployment
kubectl create deployment nginx --image=nginx --replicas=3

# Create a job
kubectl create job pi --image=perl -- perl -Mbignum=bpi -wle 'print bpi(2000)'

# Create a cronjob
kubectl create cronjob backup --image=backup --schedule="0 2 * * *" -- /bin/sh -c 'backup.sh'

# Generate YAML
kubectl run nginx --image=nginx --dry-run=client -o yaml > pod.yaml
```

## Key Concepts to Remember

1. **Jobs** - Run to completion, use `restartPolicy: Never` or `OnFailure`
2. **CronJobs** - Scheduled jobs using cron syntax
3. **Init containers** - Run before main containers, must complete successfully
4. **Sidecar pattern** - Helper container alongside main app
5. **Multi-stage builds** - Reduce image size

## Practice Questions

1. How do you create a Job that runs 5 completions with 2 parallel pods?
2. What is the difference between init containers and sidecar containers?
3. How do you generate YAML for a pod without creating it?
4. What cron schedule runs every Monday at 3 AM?
5. What happens if a CronJob's concurrencyPolicy is set to Forbid?

---

[Back to CKAD Overview](./README.md) | [Next: Application Deployment →](./02-application-deployment.md)
