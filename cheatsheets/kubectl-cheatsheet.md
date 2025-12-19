# kubectl Cheat Sheet

Comprehensive kubectl command reference for Kubernetes exams.

---

## Essential Aliases

```bash
# Add to ~/.bashrc or ~/.zshrc
alias k=kubectl
alias kgp='kubectl get pods'
alias kgs='kubectl get svc'
alias kgd='kubectl get deploy'
alias kgn='kubectl get nodes'
alias kga='kubectl get all'
alias kd='kubectl describe'
alias ke='kubectl edit'
alias kl='kubectl logs'
alias kx='kubectl exec -it'
alias kaf='kubectl apply -f'
alias kdel='kubectl delete'

# Shortcuts
export do='--dry-run=client -o yaml'
export now='--force --grace-period=0'
```

---

## Context & Namespace

```bash
# View current context
kubectl config current-context

# List all contexts
kubectl config get-contexts

# Switch context
kubectl config use-context <context-name>

# Set default namespace
kubectl config set-context --current --namespace=<namespace>

# View config
kubectl config view
```

---

## Pod Operations

```bash
# Create pod
kubectl run nginx --image=nginx
kubectl run nginx --image=nginx --port=80
kubectl run nginx --image=nginx --labels="app=web,env=prod"

# Generate YAML
kubectl run nginx --image=nginx $do > pod.yaml

# Get pods
kubectl get pods
kubectl get pods -o wide
kubectl get pods -A
kubectl get pods --show-labels
kubectl get pods -l app=nginx
kubectl get pods --sort-by='.metadata.creationTimestamp'

# Describe pod
kubectl describe pod nginx

# Delete pod
kubectl delete pod nginx
kubectl delete pod nginx $now

# Execute in pod
kubectl exec nginx -- ls /
kubectl exec -it nginx -- /bin/bash
kubectl exec nginx -c sidecar -- cat /log

# Logs
kubectl logs nginx
kubectl logs nginx -f
kubectl logs nginx --previous
kubectl logs nginx -c sidecar
kubectl logs -l app=nginx --all-containers

# Copy files
kubectl cp nginx:/etc/nginx/nginx.conf ./nginx.conf
kubectl cp ./file.txt nginx:/tmp/file.txt
```

---

## Deployment Operations

```bash
# Create deployment
kubectl create deployment nginx --image=nginx
kubectl create deployment nginx --image=nginx --replicas=3

# Generate YAML
kubectl create deployment nginx --image=nginx $do > deploy.yaml

# Scale
kubectl scale deployment nginx --replicas=5

# Update image
kubectl set image deployment/nginx nginx=nginx:1.20

# Rollout
kubectl rollout status deployment/nginx
kubectl rollout history deployment/nginx
kubectl rollout undo deployment/nginx
kubectl rollout undo deployment/nginx --to-revision=2
kubectl rollout pause deployment/nginx
kubectl rollout resume deployment/nginx

# Set resources
kubectl set resources deployment nginx --limits=cpu=200m,memory=512Mi
kubectl set resources deployment nginx --requests=cpu=100m,memory=256Mi
```

---

## Service Operations

```bash
# Expose deployment
kubectl expose deployment nginx --port=80 --type=ClusterIP
kubectl expose deployment nginx --port=80 --type=NodePort
kubectl expose deployment nginx --port=80 --type=LoadBalancer
kubectl expose deployment nginx --port=80 --target-port=8080

# Generate YAML
kubectl expose deployment nginx --port=80 $do > svc.yaml

# Get services
kubectl get svc
kubectl get svc -o wide
kubectl get endpoints nginx

# Create service manually
kubectl create service clusterip nginx --tcp=80:80
kubectl create service nodeport nginx --tcp=80:80
```

---

## ConfigMap & Secret

```bash
# Create ConfigMap
kubectl create configmap myconfig --from-literal=key1=value1
kubectl create configmap myconfig --from-file=config.txt
kubectl create configmap myconfig --from-file=mykey=config.txt
kubectl create configmap myconfig --from-env-file=env.txt

# Create Secret
kubectl create secret generic mysecret --from-literal=password=secret
kubectl create secret generic mysecret --from-file=ssh-key=~/.ssh/id_rsa
kubectl create secret docker-registry regcred \
  --docker-server=https://index.docker.io/v1/ \
  --docker-username=user \
  --docker-password=pass

# View
kubectl get configmap myconfig -o yaml
kubectl get secret mysecret -o yaml
kubectl get secret mysecret -o jsonpath='{.data.password}' | base64 -d
```

---

## Namespace & ResourceQuota

```bash
# Create namespace
kubectl create namespace dev

# Create ResourceQuota
kubectl create quota dev-quota --hard=pods=10,cpu=4,memory=8Gi -n dev

# Create LimitRange
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: LimitRange
metadata:
  name: default-limits
spec:
  limits:
  - default:
      memory: 256Mi
      cpu: 200m
    defaultRequest:
      memory: 128Mi
      cpu: 100m
    type: Container
EOF
```

---

## RBAC

```bash
# Create ServiceAccount
kubectl create serviceaccount mysa

# Create Role
kubectl create role pod-reader --verb=get,list,watch --resource=pods

# Create ClusterRole
kubectl create clusterrole pod-reader --verb=get,list,watch --resource=pods

# Create RoleBinding
kubectl create rolebinding read-pods --role=pod-reader --serviceaccount=default:mysa

# Create ClusterRoleBinding
kubectl create clusterrolebinding read-pods --clusterrole=pod-reader --serviceaccount=default:mysa

# Check permissions
kubectl auth can-i get pods
kubectl auth can-i get pods --as=system:serviceaccount:default:mysa
kubectl auth can-i --list
```

---

## Jobs & CronJobs

```bash
# Create Job
kubectl create job myjob --image=busybox -- echo "Hello"

# Create CronJob
kubectl create cronjob mybackup --image=busybox --schedule="0 2 * * *" -- echo "Backup"

# Get jobs
kubectl get jobs
kubectl get cronjobs
```

---

## Node Operations

```bash
# Get nodes
kubectl get nodes
kubectl get nodes -o wide
kubectl describe node worker1

# Labels
kubectl label node worker1 disktype=ssd
kubectl label node worker1 disktype-

# Taints
kubectl taint nodes worker1 dedicated=special:NoSchedule
kubectl taint nodes worker1 dedicated-

# Drain & Cordon
kubectl cordon worker1
kubectl uncordon worker1
kubectl drain worker1 --ignore-daemonsets --delete-emptydir-data
```

---

## Output Formatting

```bash
# Output formats
kubectl get pods -o wide
kubectl get pods -o yaml
kubectl get pods -o json
kubectl get pods -o name
kubectl get pods -o custom-columns=NAME:.metadata.name,STATUS:.status.phase

# JSONPath
kubectl get pods -o jsonpath='{.items[*].metadata.name}'
kubectl get nodes -o jsonpath='{.items[*].status.addresses[0].address}'
kubectl get pods -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.status.phase}{"\n"}{end}'

# Sort
kubectl get pods --sort-by='.metadata.creationTimestamp'
kubectl get pods --sort-by='.status.containerStatuses[0].restartCount'
```

---

## Debugging

```bash
# Events
kubectl get events
kubectl get events --sort-by='.lastTimestamp'
kubectl get events -w

# Resource usage
kubectl top nodes
kubectl top pods
kubectl top pods --containers

# Debug pod
kubectl run debug --image=busybox --rm -it --restart=Never -- sh
kubectl run debug --image=nicolaka/netshoot --rm -it --restart=Never -- bash

# Port forward
kubectl port-forward pod/nginx 8080:80
kubectl port-forward svc/nginx 8080:80

# Proxy
kubectl proxy --port=8001
```

---

## Quick YAML Generation

```bash
# Pod
kubectl run nginx --image=nginx $do > pod.yaml

# Deployment
kubectl create deployment nginx --image=nginx $do > deploy.yaml

# Service
kubectl expose deployment nginx --port=80 $do > svc.yaml

# Job
kubectl create job myjob --image=busybox $do -- echo hello > job.yaml

# ConfigMap
kubectl create configmap myconfig --from-literal=key=value $do > cm.yaml

# Secret
kubectl create secret generic mysecret --from-literal=pass=secret $do > secret.yaml
```

---

[← Back to Home](../README.md)
