# CKS - Certified Kubernetes Security Specialist

[![CKS](https://img.shields.io/badge/CNCF-CKS-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)](https://training.linuxfoundation.org/certification/certified-kubernetes-security-specialist/)

The **Certified Kubernetes Security Specialist (CKS)** exam certifies that candidates have the skills, knowledge, and competency to perform a broad range of best practices for securing container-based applications and Kubernetes platforms during build, deployment, and runtime.

## 📥 Download Study Guide

[![PDF Download](https://img.shields.io/badge/PDF-Download-red?style=for-the-badge&logo=adobeacrobatreader&logoColor=white)](/pdf/CKS_Study_Guide.pdf)

**Get the complete CKS Study Guide as a printable PDF:**
- 📚 All chapters combined into one document
- 📑 Printer-friendly formatting with table of contents
- 🔖 Page numbers and navigation
- 📱 Optimized for offline study

[Download CKS Study Guide PDF](/pdf/CKS_Study_Guide.pdf)

## Exam Overview

| Detail | Information |
|--------|-------------|
| **Exam Format** | Performance-based (hands-on) |
| **Number of Questions** | 15-20 |
| **Duration** | 2 hours |
| **Passing Score** | 67% |
| **Certification Validity** | 2 years |
| **Cost** | $395 USD |
| **Retake Policy** | 1 free retake |
| **Kubernetes Version** | 1.30 |
| **Prerequisite** | Must hold valid CKA certification |

## Exam Domains & Weights

| Domain | Weight |
|--------|--------|
| [Cluster Setup](./01-cluster-setup.md) | 10% |
| [Cluster Hardening](./02-cluster-hardening.md) | 15% |
| [System Hardening](./03-system-hardening.md) | 15% |
| [Minimize Microservice Vulnerabilities](./04-minimize-microservice-vulnerabilities.md) | 20% |
| [Supply Chain Security](./05-supply-chain-security.md) | 20% |
| [Monitoring, Logging and Runtime Security](./06-monitoring-logging-runtime-security.md) | 20% |

## Prerequisites

- **Valid CKA certification** (required)
- Strong Kubernetes administration skills
- Understanding of Linux security concepts
- Familiarity with container security

## Study Resources

### Official Resources

- [CKS Exam Curriculum](https://github.com/cncf/curriculum/blob/master/CKS_Curriculum.pdf)
- [Kubernetes Security Documentation](https://kubernetes.io/docs/concepts/security/)
- [Kubernetes Security Best Practices](https://kubernetes.io/docs/concepts/security/overview/)

### Recommended Courses

- [Kubernetes Security Essentials (LFS260)](https://training.linuxfoundation.org/training/kubernetes-security-essentials-lfs260/)
- [CKS with Practice Tests - Udemy](https://www.udemy.com/course/certified-kubernetes-security-specialist/)

### Practice Resources

- [Killercoda CKS Scenarios](https://killercoda.com/killer-shell-cks) ⭐ **Highly Recommended**
- [killer.sh CKS Simulator](https://killer.sh/cks) - Included with exam registration

## Quick Navigation

- [01 - Cluster Setup](./01-cluster-setup.md)
- [02 - Cluster Hardening](./02-cluster-hardening.md)
- [03 - System Hardening](./03-system-hardening.md)
- [04 - Minimize Microservice Vulnerabilities](./04-minimize-microservice-vulnerabilities.md)
- [05 - Supply Chain Security](./05-supply-chain-security.md)
- [06 - Monitoring, Logging and Runtime Security](./06-monitoring-logging-runtime-security.md)
- [Sample Practice Questions](./sample-questions.md)

## Exam Environment

The CKS exam provides:

- Access to multiple Kubernetes clusters
- `kubectl` with auto-completion enabled
- Access to Kubernetes documentation (kubernetes.io)
- A Linux terminal environment
- Root access via `sudo`
- Security tools pre-installed

### Allowed Resources During Exam

- [kubernetes.io/docs](https://kubernetes.io/docs/)
- [kubernetes.io/blog](https://kubernetes.io/blog/)
- [trivy.dev/docs](https://trivy.dev/docs/)
- [falco.org/docs](https://falco.org/docs/)
- [aquasecurity.github.io/trivy](https://aquasecurity.github.io/trivy/)

## Exam Tips

1. **Master security contexts** - runAsUser, runAsNonRoot, capabilities
2. **Know Network Policies** - Default deny, allow specific traffic
3. **Understand RBAC deeply** - Least privilege principle
4. **Practice with security tools** - Trivy, Falco, AppArmor, seccomp
5. **Know Pod Security Standards** - privileged, baseline, restricted
6. **Practice image scanning** - Trivy for vulnerability detection
7. **Understand audit logging** - Configure and analyze audit logs
8. **Practice on [Killercoda](https://killercoda.com/killer-shell-cks)** - Free hands-on scenarios

## Security Tools Overview

| Tool | Purpose |
|------|---------|
| **Trivy** | Container image vulnerability scanning |
| **Falco** | Runtime security monitoring |
| **AppArmor** | Linux security module for access control |
| **seccomp** | System call filtering |
| **OPA/Gatekeeper** | Policy enforcement |
| **kube-bench** | CIS Kubernetes benchmark |

## Useful Commands

```bash
# Set alias
alias k=kubectl

# Enable auto-completion
source <(kubectl completion bash)
complete -o default -F __start_kubectl k

# Check API server audit logs
cat /var/log/kubernetes/audit/audit.log | jq .

# Scan image with Trivy
trivy image nginx:1.21

# Check seccomp profiles
ls /var/lib/kubelet/seccomp/

# View AppArmor profiles
aa-status

# Check Pod Security Standards
kubectl label namespace default pod-security.kubernetes.io/enforce=restricted

# RBAC verification
kubectl auth can-i --list --as system:serviceaccount:default:mysa
kubectl auth can-i create pods --as jane

# Network Policy testing
kubectl exec -it test-pod -- nc -zv target-service 80
```

## Registration

[Register for CKS Exam](https://training.linuxfoundation.org/certification/certified-kubernetes-security-specialist/)

> **Note**: You must hold a valid CKA certification before taking the CKS exam.
