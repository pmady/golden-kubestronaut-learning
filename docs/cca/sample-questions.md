# CCA Sample Practice Questions

## Practice Resources

- [Cilium Documentation](https://docs.cilium.io/)
- [Isovalent Labs](https://isovalent.com/labs/)

---

## Network Policy (20%)

### Question 1
Create a CiliumNetworkPolicy that allows only HTTP traffic from pods with label app=frontend to pods with label app=backend.

<details>
<summary>Show Solution</summary>

```yaml
apiVersion: cilium.io/v2
kind: CiliumNetworkPolicy
metadata:
  name: allow-frontend-http
spec:
  endpointSelector:
    matchLabels:
      app: backend
  ingress:
  - fromEndpoints:
    - matchLabels:
        app: frontend
    toPorts:
    - ports:
      - port: "80"
        protocol: TCP
      rules:
        http:
        - method: "GET"
```

</details>

### Question 2
Create a policy that denies all egress traffic except DNS.

<details>
<summary>Show Solution</summary>

```yaml
apiVersion: cilium.io/v2
kind: CiliumNetworkPolicy
metadata:
  name: deny-egress-except-dns
spec:
  endpointSelector: {}
  egress:
  - toEndpoints:
    - matchLabels:
        k8s:io.kubernetes.pod.namespace: kube-system
        k8s-app: kube-dns
    toPorts:
    - ports:
      - port: "53"
        protocol: UDP
```

</details>

### Question 3
Create an L7 policy that only allows GET requests to /api/v1/*.

<details>
<summary>Show Solution</summary>

```yaml
apiVersion: cilium.io/v2
kind: CiliumNetworkPolicy
metadata:
  name: l7-api-policy
spec:
  endpointSelector:
    matchLabels:
      app: api-server
  ingress:
  - toPorts:
    - ports:
      - port: "80"
        protocol: TCP
      rules:
        http:
        - method: "GET"
          path: "/api/v1/.*"
```

</details>

---

## Hubble & Observability (15%)

### Question 4
How do you enable Hubble in a Cilium installation?

<details>
<summary>Show Solution</summary>

```bash
# Using Helm
helm upgrade cilium cilium/cilium \
  --namespace kube-system \
  --set hubble.enabled=true \
  --set hubble.relay.enabled=true \
  --set hubble.ui.enabled=true

# Or using cilium CLI
cilium hubble enable --ui
```

</details>

### Question 5
Use Hubble CLI to observe flows from namespace "production".

<details>
<summary>Show Solution</summary>

```bash
hubble observe --namespace production

# With filters
hubble observe --namespace production --verdict DROPPED
hubble observe --namespace production --protocol TCP --port 80
```

</details>

### Question 6
How do you view the service dependency map?

<details>
<summary>Show Solution</summary>

```bash
# Access Hubble UI
kubectl port-forward -n kube-system svc/hubble-ui 12000:80

# Or use CLI for service map data
hubble observe --namespace default -o json | jq
```

</details>

---

## Cilium CLI (15%)

### Question 7
Check the status of Cilium in the cluster.

<details>
<summary>Show Solution</summary>

```bash
cilium status

# Detailed status
cilium status --verbose
```

</details>

### Question 8
Run connectivity tests to verify Cilium is working correctly.

<details>
<summary>Show Solution</summary>

```bash
cilium connectivity test
```

</details>

### Question 9
List all Cilium endpoints in the cluster.

<details>
<summary>Show Solution</summary>

```bash
cilium endpoint list

# Or using kubectl
kubectl get ciliumendpoints -A
```

</details>

---

## eBPF (10%)

### Question 10
What is eBPF and why does Cilium use it?

<details>
<summary>Show Solution</summary>

**eBPF (extended Berkeley Packet Filter)** is a technology that allows running sandboxed programs in the Linux kernel without changing kernel source code.

Cilium uses eBPF for:
- High-performance packet processing
- Network policy enforcement at kernel level
- Load balancing without kube-proxy
- Deep observability without overhead
- Security enforcement

</details>

### Question 11
How does Cilium replace kube-proxy?

<details>
<summary>Show Solution</summary>

```bash
# Install Cilium with kube-proxy replacement
helm install cilium cilium/cilium \
  --namespace kube-system \
  --set kubeProxyReplacement=true \
  --set k8sServiceHost=<API_SERVER_IP> \
  --set k8sServicePort=<API_SERVER_PORT>
```

Cilium uses eBPF to implement:
- ClusterIP services
- NodePort services
- LoadBalancer services
- ExternalIPs

</details>

---

## Cluster Mesh (10%)

### Question 12
What is Cilium Cluster Mesh used for?

<details>
<summary>Show Solution</summary>

Cilium Cluster Mesh enables:
- Multi-cluster connectivity
- Cross-cluster service discovery
- Global network policies
- Shared services across clusters
- High availability across clusters

</details>

### Question 13
Enable Cluster Mesh on a Cilium installation.

<details>
<summary>Show Solution</summary>

```bash
# Enable Cluster Mesh
cilium clustermesh enable

# Connect to another cluster
cilium clustermesh connect --destination-context <other-cluster-context>

# Check status
cilium clustermesh status
```

</details>

---

## BGP & External Networking (10%)

### Question 14
Configure Cilium BGP peering.

<details>
<summary>Show Solution</summary>

```yaml
apiVersion: cilium.io/v2alpha1
kind: CiliumBGPPeeringPolicy
metadata:
  name: bgp-peering
spec:
  nodeSelector:
    matchLabels:
      bgp: enabled
  virtualRouters:
  - localASN: 65000
    exportPodCIDR: true
    neighbors:
    - peerAddress: "10.0.0.1/32"
      peerASN: 65001
```

</details>

---

## Architecture (10%)

### Question 15
What are the main components of Cilium?

<details>
<summary>Show Solution</summary>

1. **Cilium Agent** - Runs on each node, manages eBPF programs
2. **Cilium Operator** - Manages cluster-wide operations
3. **Cilium CNI** - Container Network Interface plugin
4. **Hubble** - Observability platform
5. **Cilium CLI** - Command-line tool

</details>

---

## Exam Tips

1. **Know CiliumNetworkPolicy syntax** - L3/L4 and L7 policies
2. **Practice with Hubble** - Observing flows and troubleshooting
3. **Understand eBPF basics** - Why it's used, benefits
4. **Know cilium CLI commands** - status, connectivity test, endpoint list
5. **Understand identity-based security** - How Cilium identifies pods

---

[← Back to CCA Overview](./README.md)
