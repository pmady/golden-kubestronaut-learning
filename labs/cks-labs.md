# CKS Hands-on Lab Exercises

These labs simulate real CKS exam scenarios focused on Kubernetes security.

## Prerequisites

- Kubernetes cluster with admin access
- kubectl configured
- Tools: trivy, falco, apparmor, seccomp

---

## Lab 1: Network Policies

**Objective:** Implement network segmentation

### Default Deny All

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
  namespace: secure-ns
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
```

### Allow Specific Traffic

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-frontend-to-backend
  namespace: secure-ns
spec:
  podSelector:
    matchLabels:
      app: backend
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: frontend
    ports:
    - protocol: TCP
      port: 8080
```

### Tasks

```bash
# Create namespace
kubectl create namespace secure-ns

# Deploy apps
kubectl create deployment frontend --image=nginx -n secure-ns
kubectl create deployment backend --image=nginx -n secure-ns
kubectl label deployment frontend app=frontend -n secure-ns
kubectl label deployment backend app=backend -n secure-ns

# Apply policies
kubectl apply -f default-deny-all.yaml
kubectl apply -f allow-frontend-to-backend.yaml

# Test connectivity
kubectl exec -n secure-ns deploy/frontend -- curl backend:80 --max-time 2
```

---

## Lab 2: Pod Security Standards

**Objective:** Enforce pod security using admission controllers

### Restricted Pod Security Standard

```bash
# Label namespace for restricted enforcement
kubectl label namespace secure-ns \
  pod-security.kubernetes.io/enforce=restricted \
  pod-security.kubernetes.io/warn=restricted \
  pod-security.kubernetes.io/audit=restricted
```

### Compliant Pod

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secure-pod
  namespace: secure-ns
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 1000
    seccompProfile:
      type: RuntimeDefault
  containers:
  - name: app
    image: nginx
    securityContext:
      allowPrivilegeEscalation: false
      capabilities:
        drop:
        - ALL
      readOnlyRootFilesystem: true
    volumeMounts:
    - name: tmp
      mountPath: /tmp
    - name: cache
      mountPath: /var/cache/nginx
    - name: run
      mountPath: /var/run
  volumes:
  - name: tmp
    emptyDir: {}
  - name: cache
    emptyDir: {}
  - name: run
    emptyDir: {}
```

### Non-Compliant Pod (will be rejected)

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: insecure-pod
  namespace: secure-ns
spec:
  containers:
  - name: app
    image: nginx
    securityContext:
      privileged: true  # This will be rejected
```

---

## Lab 3: RBAC Configuration

**Objective:** Implement least-privilege access

### Create ServiceAccount and Role

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: app-sa
  namespace: default
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: pod-reader
  namespace: default
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "list", "watch"]
- apiGroups: [""]
  resources: ["pods/log"]
  verbs: ["get"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: read-pods
  namespace: default
subjects:
- kind: ServiceAccount
  name: app-sa
  namespace: default
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io
```

### Test RBAC

```bash
# Create resources
kubectl apply -f rbac.yaml

# Test as service account
kubectl auth can-i get pods --as=system:serviceaccount:default:app-sa
kubectl auth can-i delete pods --as=system:serviceaccount:default:app-sa
kubectl auth can-i get secrets --as=system:serviceaccount:default:app-sa
```

---

## Lab 4: Image Security with Trivy

**Objective:** Scan container images for vulnerabilities

### Install Trivy

```bash
# Install trivy
curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin
```

### Scan Images

```bash
# Scan nginx image
trivy image nginx:latest

# Scan with severity filter
trivy image --severity HIGH,CRITICAL nginx:latest

# Scan and fail on critical
trivy image --exit-code 1 --severity CRITICAL nginx:latest

# Scan local image
trivy image --input myapp.tar
```

### ImagePolicyWebhook (Admission Controller)

```yaml
apiVersion: v1
kind: Config
clusters:
- name: image-checker
  cluster:
    server: https://image-policy-webhook:443
    certificate-authority: /etc/kubernetes/pki/webhook-ca.crt
users:
- name: api-server
  user:
    client-certificate: /etc/kubernetes/pki/apiserver.crt
    client-key: /etc/kubernetes/pki/apiserver.key
contexts:
- context:
    cluster: image-checker
    user: api-server
  name: image-checker
current-context: image-checker
```

---

## Lab 5: Runtime Security with Falco

**Objective:** Detect runtime threats

### Install Falco

```bash
# Add Helm repo
helm repo add falcosecurity https://falcosecurity.github.io/charts
helm repo update

# Install Falco
helm install falco falcosecurity/falco \
  --namespace falco --create-namespace \
  --set falcosidekick.enabled=true
```

### Custom Falco Rules

```yaml
# Save as custom-rules.yaml
- rule: Detect Shell in Container
  desc: Detect shell execution in container
  condition: >
    spawned_process and container and
    proc.name in (bash, sh, zsh, ksh)
  output: >
    Shell spawned in container
    (user=%user.name container=%container.name shell=%proc.name)
  priority: WARNING

- rule: Detect Sensitive File Access
  desc: Detect access to sensitive files
  condition: >
    open_read and container and
    fd.name in (/etc/shadow, /etc/passwd)
  output: >
    Sensitive file accessed
    (user=%user.name file=%fd.name container=%container.name)
  priority: CRITICAL
```

### Test Falco

```bash
# Trigger shell detection
kubectl exec -it <pod-name> -- /bin/bash

# Check Falco logs
kubectl logs -n falco -l app.kubernetes.io/name=falco
```

---

## Lab 6: Secrets Management

**Objective:** Secure secrets handling

### Encrypt Secrets at Rest

```yaml
# /etc/kubernetes/enc/enc.yaml
apiVersion: apiserver.config.k8s.io/v1
kind: EncryptionConfiguration
resources:
- resources:
  - secrets
  providers:
  - aescbc:
      keys:
      - name: key1
        secret: <base64-encoded-32-byte-key>
  - identity: {}
```

```bash
# Generate encryption key
head -c 32 /dev/urandom | base64

# Update API server manifest
# Add to kube-apiserver.yaml:
# --encryption-provider-config=/etc/kubernetes/enc/enc.yaml

# Verify encryption
kubectl get secrets -A -o json | kubectl replace -f -
ETCDCTL_API=3 etcdctl get /registry/secrets/default/my-secret | hexdump -C
```

### External Secrets (Vault Integration)

```yaml
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: vault-secret
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: vault-backend
    kind: SecretStore
  target:
    name: my-secret
  data:
  - secretKey: password
    remoteRef:
      key: secret/data/myapp
      property: password
```

---

## Lab 7: Audit Logging

**Objective:** Configure Kubernetes audit logging

### Audit Policy

```yaml
# /etc/kubernetes/audit-policy.yaml
apiVersion: audit.k8s.io/v1
kind: Policy
rules:
- level: None
  resources:
  - group: ""
    resources: ["endpoints", "services", "services/status"]
- level: None
  users: ["system:kube-proxy"]
  verbs: ["watch"]
  resources:
  - group: ""
    resources: ["endpoints", "services", "services/status"]
- level: RequestResponse
  resources:
  - group: ""
    resources: ["secrets", "configmaps"]
- level: Metadata
  resources:
  - group: ""
    resources: ["pods", "deployments"]
- level: Request
  omitStages:
  - RequestReceived
  resources:
  - group: ""
    resources: ["pods/log", "pods/status"]
```

### Enable Audit Logging

```yaml
# Add to kube-apiserver.yaml
spec:
  containers:
  - command:
    - kube-apiserver
    - --audit-policy-file=/etc/kubernetes/audit-policy.yaml
    - --audit-log-path=/var/log/kubernetes/audit.log
    - --audit-log-maxage=30
    - --audit-log-maxbackup=10
    - --audit-log-maxsize=100
```

---

## Lab 8: AppArmor and Seccomp

**Objective:** Apply kernel security profiles

### AppArmor Profile

```bash
# Create AppArmor profile
cat <<EOF | sudo tee /etc/apparmor.d/k8s-deny-write
#include <tunables/global>
profile k8s-deny-write flags=(attach_disconnected) {
  #include <abstractions/base>
  file,
  deny /tmp/** w,
  deny /var/tmp/** w,
}
EOF

# Load profile
sudo apparmor_parser -r /etc/apparmor.d/k8s-deny-write
```

### Pod with AppArmor

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: apparmor-pod
  annotations:
    container.apparmor.security.beta.kubernetes.io/app: localhost/k8s-deny-write
spec:
  containers:
  - name: app
    image: busybox
    command: ['sh', '-c', 'sleep 3600']
```

### Seccomp Profile

```json
{
  "defaultAction": "SCMP_ACT_ERRNO",
  "architectures": ["SCMP_ARCH_X86_64"],
  "syscalls": [
    {
      "names": ["read", "write", "exit", "exit_group", "openat", "close", "fstat", "mmap", "mprotect", "munmap", "brk", "rt_sigaction", "rt_sigprocmask", "ioctl", "access", "pipe", "select", "sched_yield", "mremap", "msync", "mincore", "madvise", "shmget", "shmat", "shmctl", "dup", "dup2", "pause", "nanosleep", "getitimer", "alarm", "setitimer", "getpid", "sendfile", "socket", "connect", "accept", "sendto", "recvfrom", "sendmsg", "recvmsg", "shutdown", "bind", "listen", "getsockname", "getpeername", "socketpair", "setsockopt", "getsockopt", "clone", "fork", "vfork", "execve", "wait4", "kill", "uname", "semget", "semop", "semctl", "shmdt", "msgget", "msgsnd", "msgrcv", "msgctl", "fcntl", "flock", "fsync", "fdatasync", "truncate", "ftruncate", "getdents", "getcwd", "chdir", "fchdir", "rename", "mkdir", "rmdir", "creat", "link", "unlink", "symlink", "readlink", "chmod", "fchmod", "chown", "fchown", "lchown", "umask", "gettimeofday", "getrlimit", "getrusage", "sysinfo", "times", "ptrace", "getuid", "syslog", "getgid", "setuid", "setgid", "geteuid", "getegid", "setpgid", "getppid", "getpgrp", "setsid", "setreuid", "setregid", "getgroups", "setgroups", "setresuid", "getresuid", "setresgid", "getresgid", "getpgid", "setfsuid", "setfsgid", "getsid", "capget", "capset", "rt_sigpending", "rt_sigtimedwait", "rt_sigqueueinfo", "rt_sigsuspend", "sigaltstack", "utime", "mknod", "uselib", "personality", "ustat", "statfs", "fstatfs", "sysfs", "getpriority", "setpriority", "sched_setparam", "sched_getparam", "sched_setscheduler", "sched_getscheduler", "sched_get_priority_max", "sched_get_priority_min", "sched_rr_get_interval", "mlock", "munlock", "mlockall", "munlockall", "vhangup", "modify_ldt", "pivot_root", "_sysctl", "prctl", "arch_prctl", "adjtimex", "setrlimit", "chroot", "sync", "acct", "settimeofday", "mount", "umount2", "swapon", "swapoff", "reboot", "sethostname", "setdomainname", "ioperm", "create_module", "init_module", "delete_module", "get_kernel_syms", "query_module", "quotactl", "nfsservctl", "getpmsg", "putpmsg", "afs_syscall", "tuxcall", "security", "gettid", "readahead", "setxattr", "lsetxattr", "fsetxattr", "getxattr", "lgetxattr", "fgetxattr", "listxattr", "llistxattr", "flistxattr", "removexattr", "lremovexattr", "fremovexattr", "tkill", "time", "futex", "sched_setaffinity", "sched_getaffinity", "set_thread_area", "io_setup", "io_destroy", "io_getevents", "io_submit", "io_cancel", "get_thread_area", "lookup_dcookie", "epoll_create", "epoll_ctl_old", "epoll_wait_old", "remap_file_pages", "getdents64", "set_tid_address", "restart_syscall", "semtimedop", "fadvise64", "timer_create", "timer_settime", "timer_gettime", "timer_getoverrun", "timer_delete", "clock_settime", "clock_gettime", "clock_getres", "clock_nanosleep", "exit_group", "epoll_wait", "epoll_ctl", "tgkill", "utimes", "vserver", "mbind", "set_mempolicy", "get_mempolicy", "mq_open", "mq_unlink", "mq_timedsend", "mq_timedreceive", "mq_notify", "mq_getsetattr", "kexec_load", "waitid", "add_key", "request_key", "keyctl", "ioprio_set", "ioprio_get", "inotify_init", "inotify_add_watch", "inotify_rm_watch", "migrate_pages", "openat", "mkdirat", "mknodat", "fchownat", "futimesat", "newfstatat", "unlinkat", "renameat", "linkat", "symlinkat", "readlinkat", "fchmodat", "faccessat", "pselect6", "ppoll", "unshare", "set_robust_list", "get_robust_list", "splice", "tee", "sync_file_range", "vmsplice", "move_pages", "utimensat", "epoll_pwait", "signalfd", "timerfd_create", "eventfd", "fallocate", "timerfd_settime", "timerfd_gettime", "accept4", "signalfd4", "eventfd2", "epoll_create1", "dup3", "pipe2", "inotify_init1", "preadv", "pwritev", "rt_tgsigqueueinfo", "perf_event_open", "recvmmsg", "fanotify_init", "fanotify_mark", "prlimit64", "name_to_handle_at", "open_by_handle_at", "clock_adjtime", "syncfs", "sendmmsg", "setns", "getcpu", "process_vm_readv", "process_vm_writev", "kcmp", "finit_module", "sched_setattr", "sched_getattr", "renameat2", "seccomp", "getrandom", "memfd_create", "kexec_file_load", "bpf"],
      "action": "SCMP_ACT_ALLOW"
    }
  ]
}
```

### Pod with Seccomp

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: seccomp-pod
spec:
  securityContext:
    seccompProfile:
      type: Localhost
      localhostProfile: profiles/custom.json
  containers:
  - name: app
    image: busybox
    command: ['sh', '-c', 'sleep 3600']
```

---

## Additional Practice Resources

- [Killer.sh CKS Simulator](https://killer.sh/)
- [Killercoda CKS Scenarios](https://killercoda.com/cks)
- [Kubernetes Security Documentation](https://kubernetes.io/docs/concepts/security/)

---

[← Back to CKS Overview](../cks/README.md)
