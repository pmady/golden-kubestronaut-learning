# CKAD - Certified Kubernetes Application Developer

[![CKAD](https://img.shields.io/badge/CNCF-CKAD-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)](https://training.linuxfoundation.org/certification/certified-kubernetes-application-developer-ckad/)

The **Certified Kubernetes Application Developer (CKAD)** exam certifies that candidates can design, build, and deploy cloud native applications for Kubernetes.

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
| [Application Design and Build](./01-application-design-build.md) | 20% |
| [Application Deployment](./02-application-deployment.md) | 20% |
| [Application Observability and Maintenance](./03-application-observability-maintenance.md) | 15% |
| [Application Environment, Configuration and Security](./04-application-environment-config-security.md) | 25% |
| [Services and Networking](./05-services-networking.md) | 20% |

## Prerequisites

- Basic understanding of Kubernetes concepts
- Familiarity with YAML syntax
- Linux command line proficiency
- Container fundamentals (Docker)

## Study Resources

### Official Resources

- [CKAD Exam Curriculum](https://github.com/cncf/curriculum/blob/master/CKAD_Curriculum.pdf)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Kubernetes Tasks](https://kubernetes.io/docs/tasks/)

### Recommended Courses

- [Kubernetes for Developers (LFD259)](https://training.linuxfoundation.org/training/kubernetes-for-developers/)
- [CKAD with Tests - Udemy](https://www.udemy.com/course/certified-kubernetes-application-developer/)

### Practice Resources

- [Killercoda CKAD Scenarios](https://killercoda.com/ckad) ⭐ **Highly Recommended**
- [Kubernetes Playground](https://labs.play-with-k8s.com/)
- [killer.sh CKAD Simulator](https://killer.sh/ckad)

## Quick Navigation

- [01 - Application Design and Build](./01-application-design-build.md)
- [02 - Application Deployment](./02-application-deployment.md)
- [03 - Application Observability and Maintenance](./03-application-observability-maintenance.md)
- [04 - Application Environment, Configuration and Security](./04-application-environment-config-security.md)
- [05 - Services and Networking](./05-services-networking.md)
- [Sample Practice Questions](./sample-questions.md)

## Exam Environment

The CKAD exam provides:

- Access to multiple Kubernetes clusters
- `kubectl` with auto-completion enabled
- Access to Kubernetes documentation (kubernetes.io)
- A Linux terminal environment

### Allowed Resources During Exam

- [kubernetes.io/docs](https://kubernetes.io/docs/)
- [kubernetes.io/blog](https://kubernetes.io/blog/)
- [helm.sh/docs](https://helm.sh/docs/)

## Exam Tips

1. **Practice kubectl imperative commands** - They save significant time
2. **Master YAML generation** - Use `kubectl run --dry-run=client -o yaml`
3. **Know vim/nano basics** - You'll edit YAML files frequently
4. **Use aliases** - Set up `alias k=kubectl` and enable auto-completion
5. **Bookmark important docs** - Prepare bookmarks for quick access
6. **Time management** - Don't spend too long on any single question
7. **Practice on Killercoda** - Free hands-on scenarios at [killercoda.com/ckad](https://killercoda.com/ckad)

## Useful kubectl Commands

```bash
# Set alias
alias k=kubectl

# Enable auto-completion
source <(kubectl completion bash)
complete -o default -F __start_kubectl k

# Generate YAML templates
k run nginx --image=nginx --dry-run=client -o yaml > pod.yaml
k create deployment nginx --image=nginx --dry-run=client -o yaml > deploy.yaml
k create service clusterip nginx --tcp=80:80 --dry-run=client -o yaml > svc.yaml

# Quick pod creation
k run nginx --image=nginx --port=80 --labels=app=web

# Expose deployment
k expose deployment nginx --port=80 --target-port=80 --type=ClusterIP

# Scale deployment
k scale deployment nginx --replicas=3

# Set resources
k set resources deployment nginx --limits=cpu=200m,memory=512Mi

# Rollout commands
k rollout status deployment/nginx
k rollout history deployment/nginx
k rollout undo deployment/nginx
```

## Registration

[Register for CKAD Exam](https://training.linuxfoundation.org/certification/certified-kubernetes-application-developer-ckad/)
