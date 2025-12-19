# Kubernetes Concepts Flashcards

Quick reference flashcards for Kubernetes architecture and concepts.

---

## Architecture Components

### Q: What are the control plane components?

<details>
<summary>Answer</summary>

- **kube-apiserver** - API frontend, handles REST operations
- **etcd** - Key-value store for cluster data
- **kube-scheduler** - Assigns pods to nodes
- **kube-controller-manager** - Runs controller processes
- **cloud-controller-manager** - Cloud-specific controllers

</details>

### Q: What are the node components?

<details>
<summary>Answer</summary>

- **kubelet** - Agent that runs on each node, manages pods
- **kube-proxy** - Network proxy, maintains network rules
- **Container runtime** - Runs containers (containerd, CRI-O)

</details>

### Q: What is etcd?

<details>
<summary>Answer</summary>

Distributed key-value store that stores all cluster data including:
- Cluster state
- Configuration
- Secrets
- Service discovery information

</details>

### Q: What does the kube-scheduler do?

<details>
<summary>Answer</summary>

Watches for newly created pods with no assigned node and selects a node based on:
- Resource requirements
- Hardware/software constraints
- Affinity/anti-affinity rules
- Taints and tolerations
- Data locality

</details>

---

## Workload Resources

### Q: What is a Pod?

<details>
<summary>Answer</summary>

Smallest deployable unit in Kubernetes. Contains:
- One or more containers
- Shared storage (volumes)
- Shared network (IP address)
- Specification for how to run containers

</details>

### Q: What is a ReplicaSet?

<details>
<summary>Answer</summary>

Ensures a specified number of pod replicas are running at any time.
- Maintains desired replica count
- Creates/deletes pods as needed
- Usually managed by Deployments

</details>

### Q: What is a Deployment?

<details>
<summary>Answer</summary>

Provides declarative updates for Pods and ReplicaSets:
- Rolling updates
- Rollbacks
- Scaling
- Pause/resume updates

</details>

### Q: What is a StatefulSet?

<details>
<summary>Answer</summary>

Manages stateful applications with:
- Stable, unique network identifiers
- Stable, persistent storage
- Ordered, graceful deployment and scaling
- Ordered, automated rolling updates

</details>

### Q: What is a DaemonSet?

<details>
<summary>Answer</summary>

Ensures all (or some) nodes run a copy of a pod:
- Node monitoring agents
- Log collectors
- Storage daemons
- Automatically adds pods to new nodes

</details>

### Q: What is a Job?

<details>
<summary>Answer</summary>

Creates pods that run to completion:
- Batch processing
- One-time tasks
- Tracks successful completions
- Can run multiple pods in parallel

</details>

### Q: What is a CronJob?

<details>
<summary>Answer</summary>

Creates Jobs on a schedule (cron format):
- Scheduled backups
- Report generation
- Periodic cleanup tasks

</details>

---

## Services & Networking

### Q: What are the Service types?

<details>
<summary>Answer</summary>

- **ClusterIP** - Internal cluster IP (default)
- **NodePort** - Exposes on each node's IP at static port
- **LoadBalancer** - Cloud provider load balancer
- **ExternalName** - Maps to external DNS name

</details>

### Q: What is an Ingress?

<details>
<summary>Answer</summary>

Manages external access to services:
- HTTP/HTTPS routing
- Load balancing
- SSL/TLS termination
- Name-based virtual hosting

</details>

### Q: What is a NetworkPolicy?

<details>
<summary>Answer</summary>

Controls traffic flow between pods:
- Ingress rules (incoming traffic)
- Egress rules (outgoing traffic)
- Pod selectors
- Namespace selectors

</details>

---

## Storage

### Q: What is a PersistentVolume (PV)?

<details>
<summary>Answer</summary>

Cluster-wide storage resource:
- Provisioned by admin or dynamically
- Independent of pod lifecycle
- Has capacity, access modes, reclaim policy

</details>

### Q: What is a PersistentVolumeClaim (PVC)?

<details>
<summary>Answer</summary>

Request for storage by a user:
- Requests specific size and access mode
- Binds to matching PV
- Used by pods to mount storage

</details>

### Q: What are the access modes for PV?

<details>
<summary>Answer</summary>

- **ReadWriteOnce (RWO)** - Single node read-write
- **ReadOnlyMany (ROX)** - Multiple nodes read-only
- **ReadWriteMany (RWX)** - Multiple nodes read-write
- **ReadWriteOncePod (RWOP)** - Single pod read-write

</details>

### Q: What is a StorageClass?

<details>
<summary>Answer</summary>

Describes storage "classes" for dynamic provisioning:
- Provisioner (e.g., kubernetes.io/aws-ebs)
- Parameters (type, zone, etc.)
- Reclaim policy
- Volume binding mode

</details>

---

## Configuration

### Q: What is a ConfigMap?

<details>
<summary>Answer</summary>

Stores non-confidential configuration data:
- Key-value pairs
- Configuration files
- Can be used as environment variables or volumes
- Not encrypted

</details>

### Q: What is a Secret?

<details>
<summary>Answer</summary>

Stores sensitive data:
- Passwords, tokens, keys
- Base64 encoded (not encrypted by default)
- Can be encrypted at rest
- Used as env vars or volumes

</details>

---

## Security

### Q: What is RBAC?

<details>
<summary>Answer</summary>

Role-Based Access Control:
- **Role** - Namespace-scoped permissions
- **ClusterRole** - Cluster-scoped permissions
- **RoleBinding** - Binds Role to users/groups
- **ClusterRoleBinding** - Binds ClusterRole to users/groups

</details>

### Q: What is a ServiceAccount?

<details>
<summary>Answer</summary>

Identity for processes running in pods:
- Provides authentication to API server
- Can be assigned RBAC permissions
- Token mounted in pods

</details>

### Q: What are Pod Security Standards?

<details>
<summary>Answer</summary>

- **Privileged** - Unrestricted policy
- **Baseline** - Minimally restrictive, prevents known escalations
- **Restricted** - Heavily restricted, security best practices

</details>

---

## Scheduling

### Q: What are Taints and Tolerations?

<details>
<summary>Answer</summary>

**Taints** - Applied to nodes, repel pods
**Tolerations** - Applied to pods, allow scheduling on tainted nodes

Effects:
- NoSchedule - Don't schedule
- PreferNoSchedule - Try not to schedule
- NoExecute - Evict existing pods

</details>

### Q: What is Node Affinity?

<details>
<summary>Answer</summary>

Constrains pods to nodes with specific labels:
- **requiredDuringSchedulingIgnoredDuringExecution** - Hard requirement
- **preferredDuringSchedulingIgnoredDuringExecution** - Soft preference

</details>

### Q: What is Pod Affinity/Anti-Affinity?

<details>
<summary>Answer</summary>

**Affinity** - Schedule pods together (same node/zone)
**Anti-Affinity** - Schedule pods apart (different nodes/zones)

Use cases:
- Co-locate related pods
- Spread for high availability

</details>

---

[← Back to Home](../README.md)
