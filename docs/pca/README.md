# PCA - Prometheus Certified Associate

[![PCA](https://img.shields.io/badge/CNCF-PCA-E6522C?style=for-the-badge&logo=prometheus&logoColor=white)](https://training.linuxfoundation.org/certification/prometheus-certified-associate/)

The **Prometheus Certified Associate (PCA)** exam demonstrates an engineer's foundational knowledge of observability and skills using Prometheus, the open source systems monitoring and alerting toolkit.

## Exam Overview

| Detail | Information |
|--------|-------------|
| **Exam Format** | Multiple Choice |
| **Number of Questions** | 60 |
| **Duration** | 90 minutes |
| **Passing Score** | 75% |
| **Certification Validity** | 3 years |
| **Cost** | $250 USD |
| **Retake Policy** | 1 free retake |

## Exam Domains & Weights

| Domain | Weight |
|--------|--------|
| [Observability Concepts](./01-observability-concepts.md) | 18% |
| [Prometheus Fundamentals](./02-prometheus-fundamentals.md) | 20% |
| [PromQL](./03-promql.md) | 28% |
| [Instrumentation and Exporters](./04-instrumentation-exporters.md) | 16% |
| [Alerting & Dashboarding](./05-alerting-dashboarding.md) | 18% |

## Prerequisites

- Basic understanding of Linux command line
- Familiarity with containerized environments (Docker/Kubernetes)
- General understanding of monitoring concepts
- Basic knowledge of YAML configuration

## Study Resources

### Official Resources

- [PCA Exam Curriculum](https://github.com/cncf/curriculum/blob/master/PCA_Curriculum.pdf)
- [Prometheus Documentation](https://prometheus.io/docs/)
- [Prometheus GitHub Repository](https://github.com/prometheus/prometheus)

### Recommended Courses

- [Monitoring Systems and Services with Prometheus (LFS241)](https://training.linuxfoundation.org/training/monitoring-systems-and-services-with-prometheus-lfs241/)
- [PromLabs Training](https://training.promlabs.com/)

### Practice Resources

- [Prometheus Playground](https://prometheus.io/docs/prometheus/latest/getting_started/)
- [PromQL Basics](https://prometheus.io/docs/prometheus/latest/querying/basics/)
- [Grafana Play](https://play.grafana.org/)

## Exam Tips

1. **Understand the Three Pillars of Observability**: Logs, Metrics, and Traces
2. **Master PromQL**: This is 28% of the exam - practice writing queries
3. **Know SLA/SLO/SLI**: Understand the differences and relationships
4. **Practice with Real Prometheus**: Set up a local instance and experiment
5. **Understand Push vs Pull**: Know when to use each approach
6. **Learn Alertmanager**: Configuration, routing, and notification channels

## Key Topics to Master

### Observability Concepts
- Metrics, Logs, and Traces
- Push vs Pull model
- Service Discovery
- SLAs, SLOs, and SLIs

### Prometheus Architecture
- Prometheus Server components
- Time Series Database (TSDB)
- Scrape configuration
- Data model and labels

### PromQL
- Selectors and matchers
- Aggregation operators
- Rate and increase functions
- Histogram queries

### Exporters
- Node Exporter
- Blackbox Exporter
- Custom exporters
- Client libraries

### Alerting
- Alert rules
- Alertmanager configuration
- Routing and grouping
- Notification channels

## Navigation

- [Next: Observability Concepts →](./01-observability-concepts.md)
