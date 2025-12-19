# Job and CronJob YAML Templates

Ready-to-use Job and CronJob templates for CKAD exam.

---

## Basic Job

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: basic-job
spec:
  template:
    spec:
      containers:
      - name: job
        image: busybox
        command: ['sh', '-c', 'echo "Hello from Job" && sleep 10']
      restartPolicy: Never
  backoffLimit: 4
```

---

## Parallel Job

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: parallel-job
spec:
  completions: 5
  parallelism: 2
  template:
    spec:
      containers:
      - name: worker
        image: busybox
        command: ['sh', '-c', 'echo "Processing item" && sleep 5']
      restartPolicy: Never
```

---

## Job with Deadline

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: deadline-job
spec:
  activeDeadlineSeconds: 100
  backoffLimit: 3
  template:
    spec:
      containers:
      - name: job
        image: busybox
        command: ['sh', '-c', 'echo "Running..." && sleep 30']
      restartPolicy: Never
```

---

## Basic CronJob

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: basic-cronjob
spec:
  schedule: "*/5 * * * *"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: cron
            image: busybox
            command: ['sh', '-c', 'date; echo "Hello from CronJob"']
          restartPolicy: OnFailure
```

---

## CronJob with History Limits

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: backup-cronjob
spec:
  schedule: "0 2 * * *"
  successfulJobsHistoryLimit: 3
  failedJobsHistoryLimit: 1
  concurrencyPolicy: Forbid
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: backup
            image: busybox
            command: ['sh', '-c', 'echo "Running backup..."']
          restartPolicy: OnFailure
```

---

## CronJob with Suspend

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: suspended-cronjob
spec:
  schedule: "0 * * * *"
  suspend: true
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: job
            image: busybox
            command: ['sh', '-c', 'echo "This job is suspended"']
          restartPolicy: OnFailure
```

---

[← Back to Home](../README.md)
