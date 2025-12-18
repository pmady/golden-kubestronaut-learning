# Services & Networking (20%)

This domain covers Kubernetes networking concepts, Services, DNS, and network policies.

## Services

### Service Types

| Type | Description |
|------|-------------|
| `ClusterIP` | Internal cluster IP (default) |
| `NodePort` | Exposes on each node's IP at a static port (30000-32767) |
| `LoadBalancer` | External load balancer (cloud provider) |
| `ExternalName` | Maps to external DNS name |

### ClusterIP Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  type: ClusterIP
  selector:
    app: myapp
  ports:
  - port: 80
    targetPort: 8080
    protocol: TCP
```

### NodePort Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-nodeport
spec:
  type: NodePort
  selector:
    app: myapp
  ports:
  - port: 80
    targetPort: 8080
    nodePort: 30080
```

### LoadBalancer Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-loadbalancer
spec:
  type: LoadBalancer
  selector:
    app: myapp
  ports:
  - port: 80
    targetPort: 8080
```

### Headless Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: headless-service
spec:
  clusterIP: None
  selector:
    app: myapp
  ports:
  - port: 80
    targetPort: 8080
```

### Service Commands

```bash
# Create service
kubectl expose deployment nginx --port=80 --target-port=8080 --type=ClusterIP

# Create NodePort service
kubectl expose deployment nginx --port=80 --type=NodePort

# Get endpoints
kubectl get endpoints my-service
```

## DNS in Kubernetes

### Service DNS

```text
<service-name>.<namespace>.svc.cluster.local

Examples:
- my-service.default.svc.cluster.local
- my-service.default.svc
- my-service.default
- my-service (within same namespace)
```

### Pod DNS

```text
<pod-ip-dashed>.<namespace>.pod.cluster.local

Example:
- 10-244-0-5.default.pod.cluster.local
```

### CoreDNS

```bash
# Check CoreDNS pods
kubectl get pods -n kube-system -l k8s-app=kube-dns

# Check CoreDNS ConfigMap
kubectl get configmap coredns -n kube-system -o yaml

# Test DNS resolution
kubectl run test --image=busybox:1.36 --rm -it -- nslookup kubernetes
```

## Ingress

### Ingress Resource

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-ingress
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
            name: myapp-service
            port:
              number: 80
```

### Path-based Routing

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: path-ingress
spec:
  ingressClassName: nginx
  rules:
  - host: myapp.example.com
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: api-service
            port:
              number: 80
      - path: /web
        pathType: Prefix
        backend:
          service:
            name: web-service
            port:
              number: 80
```

### TLS Ingress

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: tls-ingress
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - myapp.example.com
    secretName: tls-secret
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
              number: 80
```

### Ingress Commands

```bash
# Create ingress
kubectl create ingress my-ingress \
  --rule="myapp.example.com/=myapp-service:80" \
  --class=nginx

# With TLS
kubectl create ingress my-ingress \
  --rule="myapp.example.com/=myapp-service:80,tls=tls-secret" \
  --class=nginx
```

## Network Policies

### Default Deny All Ingress

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all-ingress
  namespace: default
spec:
  podSelector: {}
  policyTypes:
  - Ingress
```

### Default Deny All Egress

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all-egress
  namespace: default
spec:
  podSelector: {}
  policyTypes:
  - Egress
```

### Allow Specific Ingress

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-frontend
  namespace: default
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
    - namespaceSelector:
        matchLabels:
          name: production
    ports:
    - protocol: TCP
      port: 8080
```

### Allow Egress to Specific Pods and DNS

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-egress
  namespace: default
spec:
  podSelector:
    matchLabels:
      app: backend
  policyTypes:
  - Egress
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: database
    ports:
    - protocol: TCP
      port: 5432
  - to:  # Allow DNS
    ports:
    - protocol: UDP
      port: 53
```

### IP Block

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-external
spec:
  podSelector:
    matchLabels:
      app: web
  policyTypes:
  - Ingress
  ingress:
  - from:
    - ipBlock:
        cidr: 10.0.0.0/8
        except:
        - 10.0.1.0/24
```

## CNI (Container Network Interface)

### Common CNI Plugins

| Plugin | Description |
|--------|-------------|
| **Flannel** | Simple overlay network |
| **Calico** | Network policy support, BGP |
| **Weave** | Mesh network |
| **Cilium** | eBPF-based networking |

### CNI Configuration

```bash
# CNI config location
/etc/cni/net.d/

# CNI binaries
/opt/cni/bin/

# Check CNI plugin
ls /etc/cni/net.d/
cat /etc/cni/net.d/10-flannel.conflist
```

## Cluster Networking

### Pod Networking

```bash
# View pod IPs
kubectl get pods -o wide

# Check pod network
kubectl exec -it nginx -- ip addr
kubectl exec -it nginx -- ip route
```

### Service Networking

```bash
# Check service CIDR
kubectl cluster-info dump | grep -m 1 service-cluster-ip-range

# Check kube-proxy mode
kubectl logs -n kube-system -l k8s-app=kube-proxy | grep "Using"
```

### Port Forwarding

```bash
# Forward pod port
kubectl port-forward pod/nginx 8080:80

# Forward service port
kubectl port-forward svc/nginx 8080:80

# Forward to all interfaces
kubectl port-forward --address 0.0.0.0 pod/nginx 8080:80
```

## Key Concepts to Remember

1. **ClusterIP** - Default, internal only
2. **NodePort** - External access via node IP:port (30000-32767)
3. **LoadBalancer** - Cloud provider load balancer
4. **Ingress** - HTTP/HTTPS routing, requires controller
5. **Network Policies** - Default allow, explicit deny
6. **CoreDNS** - Cluster DNS service

## Practice Questions

1. What is the default Service type in Kubernetes?
2. How do you create a Service that exposes a deployment externally?
3. What is the DNS name format for a Service?
4. How do you create a NetworkPolicy that denies all ingress traffic?
5. What is the difference between Ingress and LoadBalancer Service?

---

[← Previous: Workloads & Scheduling](./02-workloads-scheduling.md) | [Back to CKA Overview](./README.md) | [Next: Storage →](./04-storage.md)
