# CNPA Sample Practice Questions

## Practice Resources

- [Platform Engineering](https://platformengineering.org/)
- [CNCF Platforms White Paper](https://tag-app-delivery.cncf.io/whitepapers/platforms/)

---

## Platform Engineering Fundamentals (20%)

### Question 1
What is an Internal Developer Platform (IDP)?

<details>
<summary>Show Solution</summary>

An **Internal Developer Platform (IDP)** is a self-service layer that enables developers to:
- Deploy applications without deep infrastructure knowledge
- Access standardized tooling and workflows
- Follow organizational best practices automatically
- Reduce cognitive load on development teams

Key components:
- Service catalog
- Self-service portal
- Automated workflows
- Golden paths/templates

</details>

### Question 2
What are "Golden Paths" in platform engineering?

<details>
<summary>Show Solution</summary>

**Golden Paths** are opinionated, supported ways to build and deploy applications that:
- Represent best practices
- Are fully supported by the platform team
- Reduce decision fatigue for developers
- Include security and compliance by default

Example: A golden path for deploying a microservice might include:
- Pre-configured CI/CD pipeline
- Standard observability setup
- Security scanning
- Deployment to Kubernetes

</details>

### Question 3
What is "Platform as a Product"?

<details>
<summary>Show Solution</summary>

**Platform as a Product** means treating the internal platform like a product:
- Developers are customers
- Focus on user experience
- Gather feedback and iterate
- Measure adoption and satisfaction
- Have a product roadmap

Key practices:
- User research with developers
- Documentation and onboarding
- Support channels
- Regular releases and improvements

</details>

---

## Developer Experience (20%)

### Question 4
What components make up a good developer portal?

<details>
<summary>Show Solution</summary>

A developer portal typically includes:
- **Service Catalog** - List of available services and APIs
- **Documentation** - Technical docs, guides, tutorials
- **Templates** - Scaffolding for new projects
- **Self-Service** - Provisioning resources without tickets
- **Search** - Find services, docs, and owners
- **Ownership** - Who owns what service

Tools: Backstage, Port, Cortex

</details>

### Question 5
How do you measure developer experience?

<details>
<summary>Show Solution</summary>

Key metrics:
- **DORA Metrics** - Deployment frequency, lead time, MTTR, change failure rate
- **Developer Satisfaction** - Surveys, NPS scores
- **Time to First Deploy** - How long for new developers to deploy
- **Self-Service Adoption** - % of requests handled without tickets
- **Cognitive Load** - Number of tools/systems developers must know

</details>

### Question 6
What is a Service Catalog?

<details>
<summary>Show Solution</summary>

A **Service Catalog** is a centralized inventory of:
- All services in the organization
- APIs and their documentation
- Service ownership and contacts
- Dependencies between services
- Health and status information

Benefits:
- Discoverability
- Reduced duplication
- Clear ownership
- Dependency management

</details>

---

## Infrastructure and Operations (25%)

### Question 7
How does GitOps relate to platform engineering?

<details>
<summary>Show Solution</summary>

GitOps enables platform engineering by:
- **Declarative Infrastructure** - Git as source of truth
- **Self-Service** - Developers submit PRs for changes
- **Audit Trail** - All changes tracked in Git history
- **Automation** - Changes automatically applied
- **Rollback** - Easy revert to previous state

Tools: Argo CD, Flux CD

</details>

### Question 8
What is multi-tenancy in platform context?

<details>
<summary>Show Solution</summary>

**Multi-tenancy** allows multiple teams to share platform resources:

Isolation levels:
- **Namespace-based** - Separate namespaces per team
- **Cluster-based** - Separate clusters per team
- **Virtual clusters** - vCluster for isolation

Considerations:
- Resource quotas
- Network policies
- RBAC
- Cost allocation

</details>

### Question 9
What Infrastructure as Code tools are commonly used?

<details>
<summary>Show Solution</summary>

Common IaC tools:
- **Terraform** - Multi-cloud infrastructure
- **Pulumi** - IaC with programming languages
- **Crossplane** - Kubernetes-native IaC
- **AWS CDK** - AWS infrastructure
- **Ansible** - Configuration management

Platform teams often provide:
- Terraform modules
- Crossplane compositions
- Pre-approved configurations

</details>

---

## Security and Compliance (20%)

### Question 10
How do platforms enforce security policies?

<details>
<summary>Show Solution</summary>

Security enforcement methods:
- **Policy as Code** - OPA/Gatekeeper, Kyverno
- **Admission Controllers** - Validate/mutate resources
- **Supply Chain Security** - Image signing, SBOM
- **Network Policies** - Default deny, microsegmentation
- **RBAC** - Least privilege access

Platforms embed security in golden paths so developers get security by default.

</details>

### Question 11
What is shift-left security?

<details>
<summary>Show Solution</summary>

**Shift-left security** moves security earlier in the development lifecycle:

- **Design** - Threat modeling
- **Code** - SAST, secrets scanning
- **Build** - Image scanning, SBOM
- **Deploy** - Policy enforcement
- **Runtime** - Monitoring, detection

Platform teams enable shift-left by:
- Integrating security tools in CI/CD
- Providing secure templates
- Automating compliance checks

</details>

---

## Observability and Monitoring (15%)

### Question 12
What observability capabilities should a platform provide?

<details>
<summary>Show Solution</summary>

Platform observability includes:
- **Metrics** - Prometheus, Grafana dashboards
- **Logs** - Centralized logging (Loki, ELK)
- **Traces** - Distributed tracing (Jaeger, Tempo)
- **Alerts** - Alertmanager, PagerDuty integration
- **Dashboards** - Pre-built for common patterns

Platforms should provide:
- Auto-instrumentation
- Standard dashboards
- Alert templates
- SLO tracking

</details>

### Question 13
How do you implement SLOs in a platform?

<details>
<summary>Show Solution</summary>

SLO implementation:
1. **Define SLIs** - Latency, availability, error rate
2. **Set SLO targets** - 99.9% availability
3. **Calculate error budgets** - Allowed downtime
4. **Monitor and alert** - Track against targets
5. **Report** - Dashboards and reviews

Tools:
- Prometheus + recording rules
- Sloth for SLO generation
- OpenSLO specification

</details>

---

## Exam Tips

1. **Understand IDP concepts** - Self-service, golden paths, platform as product
2. **Know developer experience metrics** - DORA, satisfaction, adoption
3. **Understand GitOps** - How it enables platform capabilities
4. **Know policy enforcement** - OPA, Kyverno, admission controllers
5. **Understand observability** - Three pillars, SLOs, error budgets

---

[← Back to CNPA Overview](./README.md)
