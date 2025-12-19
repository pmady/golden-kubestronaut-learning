# KCNA Hands-on Lab Exercises

These labs reinforce KCNA concepts through practical exercises. While KCNA is a multiple-choice exam, hands-on experience helps solidify understanding.

## Prerequisites

- Access to a Kubernetes cluster (minikube, kind, or cloud)
- kubectl installed and configured
- Basic terminal/command line knowledge

---

## Lab 1: Kubernetes Architecture Exploration

**Objective:** Understand Kubernetes cluster components

### Tasks

1. **Explore control plane components:**

```bash
# List all pods in kube-system namespace
kubectl get pods -n kube-system

# Describe the API server pod
kubectl describe pod -n kube-system -l component=kube-apiserver

# Check etcd pod
kubectl describe pod -n kube-system -l component=etcd
```

2. **Examine node components:**

```bash
# List all nodes
kubectl get nodes -o wide

# Describe a node to see kubelet info
kubectl describe node <node-name>

# Check node conditions
kubectl get nodes -o jsonpath='{.items[*].status.conditions}'
```

3. **Verify cluster health:**

```bash
# Check component statuses
kubectl get componentstatuses

# Check cluster info
kubectl cluster-info
```

<details>
<summary>Expected Outcome</summary>

You should see:
- Control plane pods: kube-apiserver, etcd, kube-controller-manager, kube-scheduler
- Node components: kubelet, kube-proxy
- Cluster is healthy with all components running

</details>

---

## Lab 2: Pod Lifecycle and Management

**Objective:** Understand pod creation, states, and lifecycle

### Tasks

1. **Create a simple pod:**

```bash
# Create pod imperatively
kubectl run nginx-pod --image=nginx:latest

# Verify pod is running
kubectl get pod nginx-pod -w
```

2. **Create pod from YAML:**

```yaml
# Save as simple-pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: multi-container-pod
  labels:
    app: demo
spec:
  containers:
  - name: nginx
    image: nginx:latest
    ports:
    - containerPort: 80
  - name: sidecar
    image: busybox
    command: ['sh', '-c', 'while true; do echo "sidecar running"; sleep 10; done']
```

```bash
kubectl apply -f simple-pod.yaml
kubectl get pod multi-container-pod
kubectl logs multi-container-pod -c sidecar
```

3. **Explore pod states:**

```bash
# Create a pod that will fail
kubectl run failing-pod --image=nonexistent:image

# Watch the pod status
kubectl get pod failing-pod -w

# Check events
kubectl describe pod failing-pod
```

4. **Cleanup:**

```bash
kubectl delete pod nginx-pod multi-container-pod failing-pod
```

<details>
<summary>Expected Outcome</summary>

- Pods transition through Pending → ContainerCreating → Running
- Failed pods show ImagePullBackOff or ErrImagePull
- Multi-container pods run all containers in same pod

</details>

---

## Lab 3: Deployments and ReplicaSets

**Objective:** Understand deployment strategies and scaling

### Tasks

1. **Create a deployment:**

```bash
kubectl create deployment web-app --image=nginx:1.19 --replicas=3
kubectl get deployment web-app
kubectl get replicaset
kubectl get pods -l app=web-app
```

2. **Scale the deployment:**

```bash
# Scale up
kubectl scale deployment web-app --replicas=5
kubectl get pods -l app=web-app

# Scale down
kubectl scale deployment web-app --replicas=2
kubectl get pods -l app=web-app
```

3. **Update the deployment:**

```bash
# Update image
kubectl set image deployment/web-app nginx=nginx:1.20

# Watch rollout
kubectl rollout status deployment/web-app

# Check rollout history
kubectl rollout history deployment/web-app
```

4. **Rollback:**

```bash
# Rollback to previous version
kubectl rollout undo deployment/web-app

# Verify
kubectl describe deployment web-app | grep Image
```

5. **Cleanup:**

```bash
kubectl delete deployment web-app
```

<details>
<summary>Expected Outcome</summary>

- Deployment manages ReplicaSet which manages Pods
- Scaling adjusts pod count
- Rolling updates replace pods gradually
- Rollback reverts to previous ReplicaSet

</details>

---

## Lab 4: Services and Networking

**Objective:** Understand Kubernetes service types

### Tasks

1. **Create deployment and ClusterIP service:**

```bash
kubectl create deployment web --image=nginx --replicas=3
kubectl expose deployment web --port=80 --type=ClusterIP
kubectl get svc web
```

2. **Test ClusterIP service:**

```bash
# Create a test pod
kubectl run test-pod --image=busybox --rm -it --restart=Never -- wget -qO- http://web
```

3. **Create NodePort service:**

```bash
kubectl expose deployment web --port=80 --type=NodePort --name=web-nodeport
kubectl get svc web-nodeport
```

4. **Explore service endpoints:**

```bash
kubectl get endpoints web
kubectl describe svc web
```

5. **Cleanup:**

```bash
kubectl delete deployment web
kubectl delete svc web web-nodeport
```

<details>
<summary>Expected Outcome</summary>

- ClusterIP: Internal cluster access only
- NodePort: External access via node IP + port
- Services load balance across pod endpoints

</details>

---

## Lab 5: ConfigMaps and Secrets

**Objective:** Understand configuration management

### Tasks

1. **Create ConfigMap:**

```bash
# From literal
kubectl create configmap app-config --from-literal=APP_ENV=production --from-literal=LOG_LEVEL=info

# View ConfigMap
kubectl get configmap app-config -o yaml
```

2. **Create Secret:**

```bash
# Create secret
kubectl create secret generic db-secret --from-literal=DB_USER=admin --from-literal=DB_PASS=secretpassword

# View secret (base64 encoded)
kubectl get secret db-secret -o yaml
```

3. **Use in Pod:**

```yaml
# Save as config-pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: config-demo
spec:
  containers:
  - name: app
    image: busybox
    command: ['sh', '-c', 'echo "Env: $APP_ENV, User: $DB_USER" && sleep 3600']
    env:
    - name: APP_ENV
      valueFrom:
        configMapKeyRef:
          name: app-config
          key: APP_ENV
    - name: DB_USER
      valueFrom:
        secretKeyRef:
          name: db-secret
          key: DB_USER
```

```bash
kubectl apply -f config-pod.yaml
kubectl logs config-demo
```

4. **Cleanup:**

```bash
kubectl delete pod config-demo
kubectl delete configmap app-config
kubectl delete secret db-secret
```

<details>
<summary>Expected Outcome</summary>

- ConfigMaps store non-sensitive configuration
- Secrets store sensitive data (base64 encoded)
- Both can be injected as environment variables or volumes

</details>

---

## Lab 6: Namespaces and Resource Quotas

**Objective:** Understand multi-tenancy basics

### Tasks

1. **Create namespace:**

```bash
kubectl create namespace dev-team
kubectl get namespaces
```

2. **Deploy to namespace:**

```bash
kubectl create deployment nginx --image=nginx -n dev-team
kubectl get pods -n dev-team
```

3. **Create ResourceQuota:**

```yaml
# Save as quota.yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: dev-quota
  namespace: dev-team
spec:
  hard:
    pods: "5"
    requests.cpu: "2"
    requests.memory: 2Gi
    limits.cpu: "4"
    limits.memory: 4Gi
```

```bash
kubectl apply -f quota.yaml
kubectl describe resourcequota dev-quota -n dev-team
```

4. **Test quota limits:**

```bash
# Try to create more pods than allowed
kubectl create deployment test --image=nginx --replicas=10 -n dev-team
kubectl get pods -n dev-team
kubectl describe deployment test -n dev-team
```

5. **Cleanup:**

```bash
kubectl delete namespace dev-team
```

<details>
<summary>Expected Outcome</summary>

- Namespaces provide logical isolation
- ResourceQuotas limit resource consumption per namespace
- Pods exceeding quota won't be scheduled

</details>

---

## Cleanup All Resources

```bash
kubectl delete all --all
kubectl delete configmap --all
kubectl delete secret --all
```

---

## Additional Practice Resources

- [Killercoda KCNA Scenarios](https://killercoda.com/kcna)
- [Play with Kubernetes](https://labs.play-with-k8s.com/)
- [Kubernetes Official Tutorials](https://kubernetes.io/docs/tutorials/)

---

[← Back to KCNA Overview](../kcna/README.md)
