# Observability Concepts (18%)

## Overview

This domain covers the foundational concepts of observability, including the three pillars (metrics, logs, traces), service discovery, and understanding SLAs, SLOs, and SLIs.

## The Three Pillars of Observability

### 1. Metrics

Metrics are numerical values that measure some aspect of a system over intervals of time.

**Characteristics:**
- Aggregatable and compressible
- Low storage overhead
- Good for alerting and trending
- Examples: CPU usage, request count, error rate

**Prometheus Metric Types:**
```
# Counter - only increases (resets on restart)
http_requests_total{method="GET", status="200"} 1234

# Gauge - can go up or down
temperature_celsius{location="server_room"} 23.5

# Histogram - samples observations into buckets
http_request_duration_seconds_bucket{le="0.1"} 24054
http_request_duration_seconds_bucket{le="0.5"} 33444
http_request_duration_seconds_sum 53423
http_request_duration_seconds_count 144320

# Summary - similar to histogram with quantiles
go_gc_duration_seconds{quantile="0.5"} 0.000107458
go_gc_duration_seconds{quantile="0.9"} 0.000262326
```

### 2. Logs

Logs are immutable records that describe discrete events that have happened over time.

**Characteristics:**
- High cardinality data
- Detailed context for debugging
- Higher storage requirements
- Examples: Application errors, access logs, audit trails

**Log Levels:**
- **DEBUG**: Detailed information for debugging
- **INFO**: General operational information
- **WARN**: Warning conditions
- **ERROR**: Error conditions
- **FATAL/CRITICAL**: Severe errors causing shutdown

### 3. Traces

Traces are records of the full paths or sequences of events that occur as requests flow through a system.

**Key Concepts:**
- **Trace**: Complete journey of a request through the system
- **Span**: A single operation within a trace
- **Context Propagation**: Passing trace context between services

```
Trace ID: abc123
├── Span 1: API Gateway (10ms)
│   ├── Span 2: Auth Service (5ms)
│   └── Span 3: Backend Service (50ms)
│       ├── Span 4: Database Query (30ms)
│       └── Span 5: Cache Lookup (2ms)
```

## Push vs Pull Model

### Pull Model (Prometheus Default)

Prometheus actively scrapes metrics from targets at regular intervals.

**Advantages:**
- Prometheus controls scrape timing
- Easy to detect if a target is down
- No need for targets to know about Prometheus
- Simpler target configuration

**Configuration Example:**
```yaml
scrape_configs:
  - job_name: 'node'
    static_configs:
      - targets: ['localhost:9100']
    scrape_interval: 15s
```

### Push Model (Pushgateway)

Applications push metrics to an intermediary (Pushgateway).

**Use Cases:**
- Short-lived batch jobs
- Jobs behind firewalls
- Legacy systems that can't expose endpoints

**When to Use Push:**
```yaml
# Push metrics to Pushgateway
echo "job_completion_time $(date +%s)" | curl --data-binary @- http://pushgateway:9091/metrics/job/batch_job
```

**Important:** Pushgateway should NOT be used as a general metrics aggregator.

## Service Discovery

Service discovery automatically finds and monitors targets without manual configuration.

### Static Configuration
```yaml
scrape_configs:
  - job_name: 'static_targets'
    static_configs:
      - targets: ['server1:9090', 'server2:9090']
```

### Kubernetes Service Discovery
```yaml
scrape_configs:
  - job_name: 'kubernetes-pods'
    kubernetes_sd_configs:
      - role: pod
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true
```

### File-based Service Discovery
```yaml
scrape_configs:
  - job_name: 'file_sd'
    file_sd_configs:
      - files:
          - '/etc/prometheus/targets/*.json'
        refresh_interval: 5m
```

### DNS Service Discovery
```yaml
scrape_configs:
  - job_name: 'dns_sd'
    dns_sd_configs:
      - names:
          - 'myservice.example.com'
        type: 'A'
        port: 9090
```

## SLAs, SLOs, and SLIs

### Service Level Agreement (SLA)

A formal agreement between a service provider and customer defining expected service levels.

**Example:**
> "The service will be available 99.9% of the time, measured monthly. If availability falls below this threshold, customers will receive a 10% credit."

### Service Level Objective (SLO)

Internal targets that teams aim to achieve to meet SLAs.

**Example:**
```
SLO: 99.95% availability (stricter than SLA)
SLO: 95th percentile latency < 200ms
SLO: Error rate < 0.1%
```

### Service Level Indicator (SLI)

The actual metrics used to measure service performance.

**Common SLIs:**
```promql
# Availability SLI
sum(rate(http_requests_total{status!~"5.."}[5m])) / sum(rate(http_requests_total[5m]))

# Latency SLI (95th percentile)
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))

# Error Rate SLI
sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m]))
```

### Error Budgets

The acceptable amount of unreliability based on SLO.

```
SLO: 99.9% availability
Error Budget: 0.1% (43.2 minutes/month)

If error budget is exhausted:
- Freeze feature releases
- Focus on reliability improvements
```

## Key Concepts Summary

| Concept | Description | Example |
|---------|-------------|---------|
| **Metrics** | Numerical measurements over time | CPU usage, request count |
| **Logs** | Discrete event records | Error messages, access logs |
| **Traces** | Request flow through system | Distributed transaction path |
| **Pull** | Prometheus scrapes targets | Default Prometheus model |
| **Push** | Targets push to gateway | Batch jobs, short-lived processes |
| **SLA** | Customer agreement | 99.9% uptime guarantee |
| **SLO** | Internal target | 99.95% availability target |
| **SLI** | Actual measurement | Current availability percentage |

## Practice Questions

1. What are the three pillars of observability?
2. When should you use the Pushgateway instead of the pull model?
3. What is the difference between an SLA and an SLO?
4. Name three types of service discovery supported by Prometheus.
5. What is a span in the context of distributed tracing?

## Navigation

- [← Back to Overview](./README.md)
- [Next: Prometheus Fundamentals →](./02-prometheus-fundamentals.md)
