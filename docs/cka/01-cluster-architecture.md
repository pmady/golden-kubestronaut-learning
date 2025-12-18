# Cluster Architecture, Installation & Configuration (25%)

This domain covers Kubernetes cluster architecture, installation, and configuration.

## Kubernetes Architecture

### Control Plane Components

| Component | Description |
|-----------|-------------|
| **kube-apiserver** | Frontend for the Kubernetes control plane |
| **etcd** | Consistent and highly-available key-value store |
| **kube-scheduler** | Watches for newly created Pods and assigns nodes |
| **kube-controller-manager** | Runs controller processes |
| **cloud-controller-manager** | Embeds cloud-specific control logic |

### Node Components

| Component | Description |
|-----------|-------------|
| **kubelet** | Agent that runs on each node |
| **kube-proxy** | Network proxy that runs on each node |
| **Container Runtime** | Software responsible for running containers |

### Architecture Diagram

```text
┌─────────────────────────────────────────────────────────────┐
│                      Control Plane                           │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐│
│  │ API Server  │ │   etcd      │ │ Controller Manager      ││
│  └─────────────┘ └─────────────┘ └─────────────────────────┘│
│  ┌─────────────┐ ┌─────────────────────────────────────────┐│
│  │  Scheduler  │ │ Cloud Controller Manager (optional)     ││
│  └─────────────┘ └─────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
┌─────────────▼───┐ ┌────────▼────────┐ ┌────▼────────────┐
│   Worker Node   │ │   Worker Node   │ │   Worker Node   │
│  ┌───────────┐  │ │  ┌───────────┐  │ │  ┌───────────┐  │
│  │  kubelet  │  │ │  │  kubelet  │  │ │  │  kubelet  │  │
│  ├───────────┤  │ │  ├───────────┤  │ │  ├───────────┤  │
│  │kube-proxy │  │ │  │kube-proxy │  │ │  │kube-proxy │  │
│  ├───────────┤  │ │  ├───────────┤  │ │  ├───────────┤  │
│  │ Container │  │ │  │ Container │  │ │  │ Container │  │
│  │  Runtime  │  │ │  │  Runtime  │  │ │  │  Runtime  │  │
│  └───────────┘  │ │  └───────────┘  │ │  └───────────┘  │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

## Cluster Installation with kubeadm

### Prerequisites

```bash
# Disable swap
sudo swapoff -a
sudo sed -i '/ swap / s/^\(.*\)$/#\1/g' /etc/fstab

# Load kernel modules
cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
overlay
br_netfilter
EOF

sudo modprobe overlay
sudo modprobe br_netfilter

# Set sysctl parameters
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-iptables  = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward                 = 1
EOF

sudo sysctl --system
```

### Install Container Runtime (containerd)

```bash
# Install containerd
sudo apt-get update
sudo apt-get install -y containerd

# Configure containerd
sudo mkdir -p /etc/containerd
containerd config default | sudo tee /etc/containerd/config.toml

# Enable SystemdCgroup
sudo sed -i 's/SystemdCgroup = false/SystemdCgroup = true/g' /etc/containerd/config.toml

sudo systemctl restart containerd
sudo systemctl enable containerd
```

### Install kubeadm, kubelet, kubectl

```bash
# Add Kubernetes apt repository
sudo apt-get update
sudo apt-get install -y apt-transport-https ca-certificates curl

curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.30/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg

echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.30/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list

# Install packages
sudo apt-get update
sudo apt-get install -y kubelet kubeadm kubectl
sudo apt-mark hold kubelet kubeadm kubectl
```

### Initialize Control Plane

```bash
# Initialize cluster
sudo kubeadm init --pod-network-cidr=10.244.0.0/16

# Configure kubectl for regular user
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config

# Install CNI (Flannel example)
kubectl apply -f https://github.com/flannel-io/flannel/releases/latest/download/kube-flannel.yml
```

### Join Worker Nodes

```bash
# On control plane, get join command
kubeadm token create --print-join-command

# On worker node
sudo kubeadm join <control-plane-ip>:6443 --token <token> \
  --discovery-token-ca-cert-hash sha256:<hash>
```

## Cluster Upgrade

### Upgrade Control Plane

```bash
# Check available versions
sudo apt-cache madison kubeadm

# Upgrade kubeadm
sudo apt-mark unhold kubeadm
sudo apt-get update && sudo apt-get install -y kubeadm=1.30.0-1.1
sudo apt-mark hold kubeadm

# Plan upgrade
sudo kubeadm upgrade plan

# Apply upgrade
sudo kubeadm upgrade apply v1.30.0

# Upgrade kubelet and kubectl
sudo apt-mark unhold kubelet kubectl
sudo apt-get update && sudo apt-get install -y kubelet=1.30.0-1.1 kubectl=1.30.0-1.1
sudo apt-mark hold kubelet kubectl

# Restart kubelet
sudo systemctl daemon-reload
sudo systemctl restart kubelet
```

### Upgrade Worker Nodes

```bash
# Drain node (from control plane)
kubectl drain <node-name> --ignore-daemonsets --delete-emptydir-data

# On worker node - upgrade kubeadm
sudo apt-mark unhold kubeadm
sudo apt-get update && sudo apt-get install -y kubeadm=1.30.0-1.1
sudo apt-mark hold kubeadm

# Upgrade node config
sudo kubeadm upgrade node

# Upgrade kubelet and kubectl
sudo apt-mark unhold kubelet kubectl
sudo apt-get update && sudo apt-get install -y kubelet=1.30.0-1.1 kubectl=1.30.0-1.1
sudo apt-mark hold kubelet kubectl

sudo systemctl daemon-reload
sudo systemctl restart kubelet

# Uncordon node (from control plane)
kubectl uncordon <node-name>
```

## etcd Backup and Restore

### Backup etcd

```bash
# Using etcdctl
ETCDCTL_API=3 etcdctl snapshot save /backup/etcd-snapshot.db \
  --endpoints=https://127.0.0.1:2379 \
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \
  --cert=/etc/kubernetes/pki/etcd/server.crt \
  --key=/etc/kubernetes/pki/etcd/server.key

# Verify backup
ETCDCTL_API=3 etcdctl snapshot status /backup/etcd-snapshot.db --write-out=table
```

### Restore etcd

```bash
# Stop kube-apiserver (if running as static pod, move manifest)
sudo mv /etc/kubernetes/manifests/kube-apiserver.yaml /tmp/

# Restore snapshot
ETCDCTL_API=3 etcdctl snapshot restore /backup/etcd-snapshot.db \
  --data-dir=/var/lib/etcd-restore

# Update etcd manifest to use new data directory
# Edit /etc/kubernetes/manifests/etcd.yaml
# Change: --data-dir=/var/lib/etcd-restore

# Restore kube-apiserver
sudo mv /tmp/kube-apiserver.yaml /etc/kubernetes/manifests/
```

## RBAC (Role-Based Access Control)

### Role and RoleBinding (Namespace-scoped)

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: default
  name: pod-reader
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "watch", "list"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: read-pods
  namespace: default
subjects:
- kind: User
  name: jane
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io
```

### ClusterRole and ClusterRoleBinding (Cluster-scoped)

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: secret-reader
rules:
- apiGroups: [""]
  resources: ["secrets"]
  verbs: ["get", "watch", "list"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: read-secrets-global
subjects:
- kind: Group
  name: managers
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: secret-reader
  apiGroup: rbac.authorization.k8s.io
```

### RBAC Commands

```bash
# Create role
kubectl create role pod-reader --verb=get,list,watch --resource=pods

# Create rolebinding
kubectl create rolebinding read-pods --role=pod-reader --user=jane

# Create clusterrole
kubectl create clusterrole node-reader --verb=get,list,watch --resource=nodes

# Create clusterrolebinding
kubectl create clusterrolebinding read-nodes --clusterrole=node-reader --user=jane

# Check permissions
kubectl auth can-i create pods --as jane
kubectl auth can-i list nodes --as jane
kubectl auth can-i --list --as jane
```

## Certificates

### View Certificate Details

```bash
# View certificate
openssl x509 -in /etc/kubernetes/pki/apiserver.crt -text -noout

# Check certificate expiration
kubeadm certs check-expiration

# Renew certificates
kubeadm certs renew all
```

### Certificate Locations

| Certificate | Path |
|-------------|------|
| CA | `/etc/kubernetes/pki/ca.crt` |
| API Server | `/etc/kubernetes/pki/apiserver.crt` |
| API Server Key | `/etc/kubernetes/pki/apiserver.key` |
| etcd CA | `/etc/kubernetes/pki/etcd/ca.crt` |
| etcd Server | `/etc/kubernetes/pki/etcd/server.crt` |

## Key Concepts to Remember

1. **Control Plane** - API Server, etcd, Scheduler, Controller Manager
2. **kubeadm** - Tool to bootstrap clusters
3. **etcd** - Cluster state storage, backup/restore critical
4. **RBAC** - Role, ClusterRole, RoleBinding, ClusterRoleBinding
5. **Certificates** - TLS for secure communication

## Practice Questions

1. How do you initialize a Kubernetes cluster with kubeadm?
2. What is the command to backup etcd?
3. How do you upgrade a cluster from 1.29 to 1.30?
4. What is the difference between Role and ClusterRole?
5. How do you check if a user can perform an action?

---

[Back to CKA Overview](./README.md) | [Next: Workloads & Scheduling →](./02-workloads-scheduling.md)
