# kubectl Command Flashcards

Quick reference flashcards for kubectl commands. Test yourself by hiding the answers!

---

## Pod Operations

### Q: Create a pod named 'nginx' with nginx image

<details>
<summary>Answer</summary>

```bash
kubectl run nginx --image=nginx
```

</details>

### Q: Create a pod with specific port exposed

<details>
<summary>Answer</summary>

```bash
kubectl run nginx --image=nginx --port=80
```

</details>

### Q: Get pods in all namespaces

<details>
<summary>Answer</summary>

```bash
kubectl get pods -A
# or
kubectl get pods --all-namespaces
```

</details>

### Q: Get pod YAML output

<details>
<summary>Answer</summary>

```bash
kubectl get pod nginx -o yaml
```

</details>

### Q: Delete pod immediately (force)

<details>
<summary>Answer</summary>

```bash
kubectl delete pod nginx --force --grace-period=0
```

</details>

### Q: Execute command in pod

<details>
<summary>Answer</summary>

```bash
kubectl exec nginx -- ls /
kubectl exec -it nginx -- /bin/bash
```

</details>

### Q: Get pod logs

<details>
<summary>Answer</summary>

```bash
kubectl logs nginx
kubectl logs nginx -f  # follow
kubectl logs nginx --previous  # previous container
```

</details>

---

## Deployment Operations

### Q: Create deployment with 3 replicas

<details>
<summary>Answer</summary>

```bash
kubectl create deployment nginx --image=nginx --replicas=3
```

</details>

### Q: Scale deployment

<details>
<summary>Answer</summary>

```bash
kubectl scale deployment nginx --replicas=5
```

</details>

### Q: Update deployment image

<details>
<summary>Answer</summary>

```bash
kubectl set image deployment/nginx nginx=nginx:1.20
```

</details>

### Q: Rollback deployment

<details>
<summary>Answer</summary>

```bash
kubectl rollout undo deployment/nginx
kubectl rollout undo deployment/nginx --to-revision=2
```

</details>

### Q: Check rollout status

<details>
<summary>Answer</summary>

```bash
kubectl rollout status deployment/nginx
kubectl rollout history deployment/nginx
```

</details>

---

## Service Operations

### Q: Expose deployment as ClusterIP service

<details>
<summary>Answer</summary>

```bash
kubectl expose deployment nginx --port=80 --type=ClusterIP
```

</details>

### Q: Expose as NodePort

<details>
<summary>Answer</summary>

```bash
kubectl expose deployment nginx --port=80 --type=NodePort
```

</details>

### Q: Get service endpoints

<details>
<summary>Answer</summary>

```bash
kubectl get endpoints nginx
```

</details>

---

## ConfigMap & Secret

### Q: Create ConfigMap from literal

<details>
<summary>Answer</summary>

```bash
kubectl create configmap myconfig --from-literal=key1=value1 --from-literal=key2=value2
```

</details>

### Q: Create ConfigMap from file

<details>
<summary>Answer</summary>

```bash
kubectl create configmap myconfig --from-file=config.txt
kubectl create configmap myconfig --from-file=mykey=config.txt
```

</details>

### Q: Create Secret from literal

<details>
<summary>Answer</summary>

```bash
kubectl create secret generic mysecret --from-literal=password=secret123
```

</details>

### Q: Decode secret value

<details>
<summary>Answer</summary>

```bash
kubectl get secret mysecret -o jsonpath='{.data.password}' | base64 -d
```

</details>

---

## Namespace & Context

### Q: Create namespace

<details>
<summary>Answer</summary>

```bash
kubectl create namespace dev
```

</details>

### Q: Set default namespace for context

<details>
<summary>Answer</summary>

```bash
kubectl config set-context --current --namespace=dev
```

</details>

### Q: Get current context

<details>
<summary>Answer</summary>

```bash
kubectl config current-context
```

</details>

### Q: Switch context

<details>
<summary>Answer</summary>

```bash
kubectl config use-context my-cluster
```

</details>

---

## YAML Generation

### Q: Generate pod YAML without creating

<details>
<summary>Answer</summary>

```bash
kubectl run nginx --image=nginx --dry-run=client -o yaml > pod.yaml
```

</details>

### Q: Generate deployment YAML

<details>
<summary>Answer</summary>

```bash
kubectl create deployment nginx --image=nginx --dry-run=client -o yaml > deploy.yaml
```

</details>

### Q: Generate service YAML

<details>
<summary>Answer</summary>

```bash
kubectl expose deployment nginx --port=80 --dry-run=client -o yaml > svc.yaml
```

</details>

---

## Troubleshooting

### Q: Describe resource for events

<details>
<summary>Answer</summary>

```bash
kubectl describe pod nginx
kubectl describe node worker-1
```

</details>

### Q: Get events sorted by time

<details>
<summary>Answer</summary>

```bash
kubectl get events --sort-by='.lastTimestamp'
```

</details>

### Q: Check resource usage

<details>
<summary>Answer</summary>

```bash
kubectl top pods
kubectl top nodes
```

</details>

### Q: Debug with temporary pod

<details>
<summary>Answer</summary>

```bash
kubectl run debug --image=busybox --rm -it --restart=Never -- sh
```

</details>

---

[← Back to Home](../README.md)
