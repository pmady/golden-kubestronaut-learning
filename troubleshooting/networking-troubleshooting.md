# Networking Troubleshooting Scenarios

Real-world networking troubleshooting scenarios for CKA/CKS exam preparation.

---

## Scenario 1: DNS Resolution Failing

### Problem

```bash
$ kubectl exec test-pod -- nslookup kubernetes
;; connection timed out; no servers could be reached
```

### Diagnosis Steps

```bash
# 1. Check CoreDNS pods
kubectl get pods -n kube-system -l k8s-app=kube-dns

# 2. Check CoreDNS logs
kubectl logs -n kube-system -l k8s-app=kube-dns

# 3. Check CoreDNS service
kubectl get svc -n kube-system kube-dns

# 4. Check endpoints
kubectl get endpoints -n kube-system kube-dns
```

### Solutions

<details>
<summary>CoreDNS pods not running</summary>

```bash
# Check pod status
kubectl get pods -n kube-system -l k8s-app=kube-dns

# Restart CoreDNS
kubectl rollout restart deployment coredns -n kube-system
```

</details>

<details>
<summary>CoreDNS ConfigMap issue</summary>

```bash
# Check ConfigMap
kubectl get configmap coredns -n kube-system -o yaml

# Fix configuration errors
kubectl edit configmap coredns -n kube-system
```

</details>

---

## Scenario 2: Pod Cannot Reach External Network

### Problem

```bash
$ kubectl exec test-pod -- curl https://google.com
curl: (6) Could not resolve host: google.com
```

### Diagnosis Steps

```bash
# 1. Check pod DNS config
kubectl exec test-pod -- cat /etc/resolv.conf

# 2. Check if pod can reach DNS
kubectl exec test-pod -- nslookup google.com

# 3. Check network policies
kubectl get networkpolicy -A

# 4. Check node networking
kubectl get nodes -o wide
```

### Solutions

<details>
<summary>NetworkPolicy blocking egress</summary>

```yaml
# Allow egress to external
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-external
spec:
  podSelector:
    matchLabels:
      app: test
  policyTypes:
  - Egress
  egress:
  - to:
    - ipBlock:
        cidr: 0.0.0.0/0
        except:
        - 10.0.0.0/8
```

</details>

---

## Scenario 3: Service ClusterIP Not Working

### Problem

```bash
$ kubectl exec test-pod -- curl http://my-service:80
curl: (7) Failed to connect to my-service port 80
```

### Diagnosis Steps

```bash
# 1. Check service
kubectl get svc my-service -o wide

# 2. Check endpoints
kubectl get endpoints my-service

# 3. Check kube-proxy
kubectl get pods -n kube-system -l k8s-app=kube-proxy

# 4. Check iptables rules
sudo iptables -t nat -L KUBE-SERVICES | grep my-service
```

### Solutions

<details>
<summary>No endpoints</summary>

```bash
# Check selector matches pod labels
kubectl get svc my-service -o jsonpath='{.spec.selector}'
kubectl get pods --show-labels

# Fix pod labels
kubectl label pod my-pod app=myapp --overwrite
```

</details>

<details>
<summary>kube-proxy not running</summary>

```bash
# Check kube-proxy pods
kubectl get pods -n kube-system -l k8s-app=kube-proxy

# Restart kube-proxy
kubectl rollout restart daemonset kube-proxy -n kube-system
```

</details>

---

## Scenario 4: Ingress Not Routing Traffic

### Problem

```bash
$ curl http://myapp.example.com
502 Bad Gateway
```

### Diagnosis Steps

```bash
# 1. Check Ingress resource
kubectl get ingress myapp-ingress -o yaml

# 2. Check Ingress controller pods
kubectl get pods -n ingress-nginx

# 3. Check Ingress controller logs
kubectl logs -n ingress-nginx -l app.kubernetes.io/name=ingress-nginx

# 4. Check backend service
kubectl get svc myapp-service
kubectl get endpoints myapp-service
```

### Solutions

<details>
<summary>Backend service not found</summary>

```bash
# Verify service name in Ingress matches actual service
kubectl get svc
kubectl get ingress myapp-ingress -o yaml | grep serviceName
```

</details>

<details>
<summary>Wrong port configuration</summary>

```yaml
# Ensure port matches service port
spec:
  rules:
  - host: myapp.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: myapp-service
            port:
              number: 80  # Must match service port
```

</details>

---

## Scenario 5: CNI Plugin Issues

### Problem

Pods stuck in ContainerCreating, network not available

### Diagnosis Steps

```bash
# 1. Check CNI pods
kubectl get pods -n kube-system | grep -E "calico|flannel|weave|cilium"

# 2. Check CNI configuration
ls /etc/cni/net.d/

# 3. Check kubelet logs for CNI errors
sudo journalctl -u kubelet | grep -i cni
```

### Solutions

<details>
<summary>CNI not installed</summary>

```bash
# Install Calico
kubectl apply -f https://raw.githubusercontent.com/projectcalico/calico/v3.26.0/manifests/calico.yaml

# Or install Flannel
kubectl apply -f https://github.com/flannel-io/flannel/releases/latest/download/kube-flannel.yml
```

</details>

<details>
<summary>CNI pods crashing</summary>

```bash
# Check CNI pod logs
kubectl logs -n kube-system <cni-pod-name>

# Delete and let it recreate
kubectl delete pod -n kube-system <cni-pod-name>
```

</details>

---

## Network Debugging Commands

```bash
# Test DNS
kubectl run dns-test --image=busybox --rm -it --restart=Never -- nslookup kubernetes

# Test connectivity
kubectl run curl-test --image=curlimages/curl --rm -it --restart=Never -- curl -v http://service:port

# Check pod network
kubectl exec pod-name -- ip addr
kubectl exec pod-name -- ip route

# Check service endpoints
kubectl get endpoints service-name

# Debug with netshoot
kubectl run netshoot --image=nicolaka/netshoot --rm -it --restart=Never -- bash
```

---

[← Back to Home](../README.md)
