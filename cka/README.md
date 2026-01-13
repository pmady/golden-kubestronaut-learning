# CKA - Certified Kubernetes Administrator

[![CKA](https://img.shields.io/badge/CNCF-CKA-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)](https://training.linuxfoundation.org/certification/certified-kubernetes-administrator-cka/)

The **Certified Kubernetes Administrator (CKA)** exam certifies that candidates have the skills, knowledge, and competency to perform the responsibilities of Kubernetes administrators.

## 📥 Download Study Guide

[![PDF Download](https://img.shields.io/badge/PDF-Download-red?style=for-the-badge&logo=adobeacrobatreader&logoColor=white)](/pdf/CKA_Study_Guide.pdf)

**Get the complete CKA Study Guide as a printable PDF:**
- 📚 All chapters combined into one document
- 📑 Printer-friendly formatting with table of contents
- 🔖 Page numbers and navigation
- 📱 Optimized for offline study

[Download CKA Study Guide PDF](/pdf/CKA_Study_Guide.pdf)

## Exam Overview

| Detail | Information |
|--------|-------------|
| **Exam Format** | Performance-based (hands-on) |
| **Number of Questions** | 15-20 |
| **Duration** | 2 hours |
| **Passing Score** | 66% |
| **Certification Validity** | 3 years |
| **Cost** | $395 USD |
| **Retake Policy** | 1 free retake |
| **Kubernetes Version** | 1.30 |

## Exam Domains & Weights

| Domain | Weight |
|--------|--------|
| [Cluster Architecture, Installation & Configuration](./01-cluster-architecture.md) | 25% |
| [Workloads & Scheduling](./02-workloads-scheduling.md) | 15% |
| [Services & Networking](./03-services-networking.md) | 20% |
| [Storage](./04-storage.md) | 10% |
| [Troubleshooting](./05-troubleshooting.md) | 30% |

## Prerequisites

- Strong Linux command line skills
- Understanding of Kubernetes architecture
- Experience with containerization (Docker)
- Basic networking knowledge

## Study Resources

### Official Resources

- [CKA Exam Curriculum](https://github.com/cncf/curriculum/blob/master/CKA_Curriculum.pdf)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Kubernetes Tasks](https://kubernetes.io/docs/tasks/)

### Recommended Courses

- [Kubernetes Fundamentals (LFS258)](https://training.linuxfoundation.org/training/kubernetes-fundamentals/)
- [CKA with Practice Tests - Udemy](https://www.udemy.com/course/certified-kubernetes-administrator-with-practice-tests/)

### Practice Resources

- [Killercoda CKA Scenarios](https://killercoda.com/cka) ⭐ **Highly Recommended**
- [killer.sh CKA Simulator](https://killer.sh/cka) - Included with exam registration
- [Kubernetes Playground](https://labs.play-with-k8s.com/)

## Quick Navigation

- [01 - Cluster Architecture, Installation & Configuration](./01-cluster-architecture.md)
- [02 - Workloads & Scheduling](./02-workloads-scheduling.md)
- [03 - Services & Networking](./03-services-networking.md)
- [04 - Storage](./04-storage.md)
- [05 - Troubleshooting](./05-troubleshooting.md)
- [Sample Practice Questions](./sample-questions.md)

## Exam Environment

The CKA exam provides:

- Access to multiple Kubernetes clusters
- `kubectl` with auto-completion enabled
- Access to Kubernetes documentation (kubernetes.io)
- A Linux terminal environment
- Root access via `sudo`

### Allowed Resources During Exam

- [kubernetes.io/docs](https://kubernetes.io/docs/)
- [kubernetes.io/blog](https://kubernetes.io/blog/)
- [helm.sh/docs](https://helm.sh/docs/)

## Exam Tips

1. **Master cluster administration** - Know how to bootstrap clusters with kubeadm
2. **Practice troubleshooting** - 30% of the exam focuses on this
3. **Know etcd backup/restore** - Critical for cluster recovery
4. **Understand RBAC** - Role, ClusterRole, RoleBinding, ClusterRoleBinding
5. **Practice certificate management** - TLS certificates for cluster components
6. **Use aliases** - Set up `alias k=kubectl` and enable auto-completion
7. **Bookmark important docs** - Prepare bookmarks for quick access
8. **Practice on [Killercoda](https://killercoda.com/cka)** - Free hands-on scenarios

## Useful kubectl Commands

```bash
# Set alias
alias k=kubectl

# Enable auto-completion
source <(kubectl completion bash)
complete -o default -F __start_kubectl k

# Cluster info
kubectl cluster-info
kubectl get nodes -o wide
kubectl get componentstatuses

# Context management
kubectl config get-contexts
kubectl config use-context <context-name>
kubectl config set-context --current --namespace=<namespace>

# Resource management
kubectl api-resources
kubectl explain pod.spec.containers

# Quick operations
kubectl run nginx --image=nginx --dry-run=client -o yaml
kubectl create deployment nginx --image=nginx --dry-run=client -o yaml
kubectl expose deployment nginx --port=80 --type=NodePort

# Troubleshooting
kubectl describe node <node-name>
kubectl logs <pod-name> -c <container-name>
kubectl exec -it <pod-name> -- /bin/sh
kubectl top nodes
kubectl top pods
```

## Cluster Administration Commands

```bash
# Kubeadm commands
kubeadm init --pod-network-cidr=10.244.0.0/16
kubeadm join <master-ip>:6443 --token <token> --discovery-token-ca-cert-hash <hash>
kubeadm token create --print-join-command

# Certificate management
kubeadm certs check-expiration
kubeadm certs renew all

# etcd backup
ETCDCTL_API=3 etcdctl snapshot save /backup/etcd-snapshot.db \
  --endpoints=https://127.0.0.1:2379 \
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \
  --cert=/etc/kubernetes/pki/etcd/server.crt \
  --key=/etc/kubernetes/pki/etcd/server.key

# etcd restore
ETCDCTL_API=3 etcdctl snapshot restore /backup/etcd-snapshot.db \
  --data-dir=/var/lib/etcd-restore

# Node maintenance
kubectl drain <node-name> --ignore-daemonsets --delete-emptydir-data
kubectl cordon <node-name>
kubectl uncordon <node-name>

# Upgrade cluster
kubeadm upgrade plan
kubeadm upgrade apply v1.30.0
```

## Registration

[Register for CKA Exam](https://training.linuxfoundation.org/certification/certified-kubernetes-administrator-cka/)
