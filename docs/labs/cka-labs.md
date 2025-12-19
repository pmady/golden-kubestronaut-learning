# CKA Hands-on Lab Exercises

These labs simulate real CKA exam scenarios. Practice these exercises to build hands-on skills for the performance-based exam.

## Prerequisites

- Kubernetes cluster (kubeadm, minikube, or kind)
- kubectl configured
- Root/sudo access for cluster operations

---

## Lab 1: Cluster Installation with kubeadm

**Objective:** Install a Kubernetes cluster using kubeadm

### Tasks

1. **Initialize control plane:**

```bash
# On control plane node
sudo kubeadm init --pod-network-cidr=10.244.0.0/16

# Set up kubeconfig
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

2. **Install CNI (Calico):**

```bash
kubectl apply -f https://raw.githubusercontent.com/projectcalico/calico/v3.26.0/manifests/calico.yaml
```

3. **Join worker nodes:**

```bash
# On worker nodes (use token from kubeadm init output)
sudo kubeadm join <control-plane-ip>:6443 --token <token> \
    --discovery-token-ca-cert-hash sha256:<hash>
```

4. **Verify cluster:**

```bash
kubectl get nodes
kubectl get pods -n kube-system
```

<details>
<summary>Expected Outcome</summary>

- Control plane initialized successfully
- CNI installed and running
- Worker nodes joined and Ready
- All system pods running

</details>

---

## Lab 2: ETCD Backup and Restore

**Objective:** Backup and restore etcd cluster data

### Tasks

1. **Create test data:**

```bash
kubectl create namespace backup-test
kubectl create deployment nginx --image=nginx -n backup-test
kubectl get all -n backup-test
```

2. **Backup etcd:**

```bash
# Find etcd pod and get certs location
kubectl describe pod -n kube-system etcd-<node-name>

# Backup etcd
ETCDCTL_API=3 etcdctl snapshot save /tmp/etcd-backup.db \
  --endpoints=https://127.0.0.1:2379 \
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \
  --cert=/etc/kubernetes/pki/etcd/server.crt \
  --key=/etc/kubernetes/pki/etcd/server.key

# Verify backup
ETCDCTL_API=3 etcdctl snapshot status /tmp/etcd-backup.db --write-out=table
```

3. **Simulate data loss:**

```bash
kubectl delete namespace backup-test
kubectl get namespace backup-test  # Should not exist
```

4. **Restore etcd:**

```bash
# Stop kube-apiserver (move manifest)
sudo mv /etc/kubernetes/manifests/kube-apiserver.yaml /tmp/

# Restore snapshot
ETCDCTL_API=3 etcdctl snapshot restore /tmp/etcd-backup.db \
  --data-dir=/var/lib/etcd-restored

# Update etcd manifest to use new data-dir
sudo sed -i 's|/var/lib/etcd|/var/lib/etcd-restored|g' /etc/kubernetes/manifests/etcd.yaml

# Restore kube-apiserver
sudo mv /tmp/kube-apiserver.yaml /etc/kubernetes/manifests/

# Verify restoration
kubectl get namespace backup-test
kubectl get deployment -n backup-test
```

<details>
<summary>Expected Outcome</summary>

- Backup created successfully
- After restore, backup-test namespace and deployment exist again

</details>

---

## Lab 3: Cluster Upgrade

**Objective:** Upgrade Kubernetes cluster version

### Tasks

1. **Check current version:**

```bash
kubectl get nodes
kubeadm version
```

2. **Upgrade control plane:**

```bash
# Update package repo
sudo apt update
sudo apt-cache madison kubeadm

# Upgrade kubeadm
sudo apt-mark unhold kubeadm
sudo apt-get install -y kubeadm=1.28.0-00
sudo apt-mark hold kubeadm

# Plan upgrade
sudo kubeadm upgrade plan

# Apply upgrade
sudo kubeadm upgrade apply v1.28.0

# Upgrade kubelet and kubectl
sudo apt-mark unhold kubelet kubectl
sudo apt-get install -y kubelet=1.28.0-00 kubectl=1.28.0-00
sudo apt-mark hold kubelet kubectl

sudo systemctl daemon-reload
sudo systemctl restart kubelet
```

3. **Upgrade worker nodes:**

```bash
# Drain node
kubectl drain <worker-node> --ignore-daemonsets --delete-emptydir-data

# On worker node: upgrade kubeadm, kubelet, kubectl
# Then uncordon
kubectl uncordon <worker-node>
```

4. **Verify upgrade:**

```bash
kubectl get nodes
```

<details>
<summary>Expected Outcome</summary>

- All nodes upgraded to new version
- Cluster functioning normally after upgrade

</details>

---

## Lab 4: Troubleshooting Broken Cluster

**Objective:** Diagnose and fix cluster issues

### Scenario 1: Kubelet Not Running

```bash
# Check kubelet status
sudo systemctl status kubelet

# Check logs
sudo journalctl -u kubelet -f

# Common fixes:
sudo systemctl start kubelet
sudo systemctl enable kubelet
```

### Scenario 2: API Server Not Responding

```bash
# Check API server pod
sudo crictl ps | grep kube-apiserver

# Check manifest
sudo cat /etc/kubernetes/manifests/kube-apiserver.yaml

# Check logs
sudo crictl logs <container-id>
```

### Scenario 3: Node NotReady

```bash
# Check node conditions
kubectl describe node <node-name>

# Check kubelet on node
ssh <node> "sudo systemctl status kubelet"

# Check CNI
kubectl get pods -n kube-system | grep -E "calico|flannel|weave"
```

### Scenario 4: Pods Pending

```bash
# Check pod events
kubectl describe pod <pod-name>

# Check scheduler
kubectl get pods -n kube-system | grep scheduler

# Check node resources
kubectl describe nodes | grep -A5 "Allocated resources"
```

<details>
<summary>Troubleshooting Checklist</summary>

1. Check component status: `kubectl get componentstatuses`
2. Check node status: `kubectl get nodes`
3. Check system pods: `kubectl get pods -n kube-system`
4. Check kubelet: `systemctl status kubelet`
5. Check logs: `journalctl -u kubelet`

</details>

---

## Lab 5: Workload Scheduling

**Objective:** Control pod placement using various scheduling methods

### Tasks

1. **Node Selector:**

```bash
# Label node
kubectl label node <node-name> disktype=ssd

# Create pod with nodeSelector
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: nginx-ssd
spec:
  nodeSelector:
    disktype: ssd
  containers:
  - name: nginx
    image: nginx
EOF

kubectl get pod nginx-ssd -o wide
```

2. **Node Affinity:**

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-affinity
spec:
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: disktype
            operator: In
            values:
            - ssd
  containers:
  - name: nginx
    image: nginx
```

3. **Taints and Tolerations:**

```bash
# Taint a node
kubectl taint nodes <node-name> dedicated=special:NoSchedule

# Create pod with toleration
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: nginx-toleration
spec:
  tolerations:
  - key: "dedicated"
    operator: "Equal"
    value: "special"
    effect: "NoSchedule"
  containers:
  - name: nginx
    image: nginx
EOF
```

4. **Cleanup:**

```bash
kubectl delete pod nginx-ssd nginx-affinity nginx-toleration
kubectl taint nodes <node-name> dedicated-
kubectl label node <node-name> disktype-
```

<details>
<summary>Expected Outcome</summary>

- Pods scheduled only on nodes matching criteria
- Taints prevent scheduling unless tolerated

</details>

---

## Lab 6: Services and Networking

**Objective:** Configure various service types and network policies

### Tasks

1. **Create deployment and services:**

```bash
kubectl create deployment web --image=nginx --replicas=3

# ClusterIP
kubectl expose deployment web --port=80 --name=web-clusterip

# NodePort
kubectl expose deployment web --port=80 --type=NodePort --name=web-nodeport

# Verify
kubectl get svc
```

2. **Create NetworkPolicy:**

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all
  namespace: default
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
```

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-web
  namespace: default
spec:
  podSelector:
    matchLabels:
      app: web
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          access: allowed
    ports:
    - protocol: TCP
      port: 80
```

3. **Test NetworkPolicy:**

```bash
# This should fail (no label)
kubectl run test --image=busybox --rm -it --restart=Never -- wget -qO- --timeout=2 http://web-clusterip

# This should work (has label)
kubectl run test --image=busybox --rm -it --restart=Never --labels="access=allowed" -- wget -qO- http://web-clusterip
```

4. **Cleanup:**

```bash
kubectl delete deployment web
kubectl delete svc web-clusterip web-nodeport
kubectl delete networkpolicy deny-all allow-web
```

---

## Lab 7: Storage - PV and PVC

**Objective:** Configure persistent storage

### Tasks

1. **Create PersistentVolume:**

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv-hostpath
spec:
  capacity:
    storage: 1Gi
  accessModes:
  - ReadWriteOnce
  hostPath:
    path: /tmp/pv-data
  persistentVolumeReclaimPolicy: Retain
```

2. **Create PersistentVolumeClaim:**

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pvc-hostpath
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 500Mi
```

3. **Use PVC in Pod:**

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pv-pod
spec:
  containers:
  - name: app
    image: nginx
    volumeMounts:
    - mountPath: /data
      name: storage
  volumes:
  - name: storage
    persistentVolumeClaim:
      claimName: pvc-hostpath
```

4. **Verify:**

```bash
kubectl get pv,pvc
kubectl exec pv-pod -- ls /data
kubectl exec pv-pod -- sh -c "echo 'test data' > /data/test.txt"
kubectl exec pv-pod -- cat /data/test.txt
```

5. **Cleanup:**

```bash
kubectl delete pod pv-pod
kubectl delete pvc pvc-hostpath
kubectl delete pv pv-hostpath
```

---

## Additional Practice Resources

- [Killer.sh CKA Simulator](https://killer.sh/) (included with exam)
- [Killercoda CKA Scenarios](https://killercoda.com/cka)
- [Kubernetes the Hard Way](https://github.com/kelseyhightower/kubernetes-the-hard-way)

---

[← Back to CKA Overview](../cka/README.md)
