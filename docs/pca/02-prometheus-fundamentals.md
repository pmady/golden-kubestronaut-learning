# Prometheus Fundamentals (20%)

## Overview

This domain covers Prometheus architecture, configuration, scraping, data model, labels, and understanding Prometheus limitations.

## Prometheus Architecture

### Core Components

```
┌─────────────────────────────────────────────────────────────┐
│                     Prometheus Server                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │  Retrieval  │  │    TSDB     │  │    HTTP Server      │ │
│  │  (Scraper)  │──│  (Storage)  │──│  (PromQL, API)      │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
         │                                      │
         ▼                                      ▼
┌─────────────────┐                  ┌─────────────────────┐
│     Targets     │                  │   Visualization     │
│  (Exporters,    │                  │   (Grafana, etc.)   │
│   Applications) │                  └─────────────────────┘
└─────────────────┘                           │
         │                                    ▼
         ▼                          ┌─────────────────────┐
┌─────────────────┐                 │   Alertmanager      │
│   Pushgateway   │                 │   (Notifications)   │
│  (Short-lived   │                 └─────────────────────┘
│   jobs)         │
└─────────────────┘
```

### Component Descriptions

| Component | Purpose |
|-----------|---------|
| **Prometheus Server** | Core component that scrapes and stores metrics |
| **TSDB** | Time Series Database for efficient storage |
| **Retrieval** | Scrapes metrics from configured targets |
| **HTTP Server** | Serves PromQL queries and API requests |
| **Alertmanager** | Handles alerts, routing, and notifications |
| **Pushgateway** | Accepts pushed metrics from short-lived jobs |
| **Exporters** | Expose metrics from third-party systems |

## Configuration

### Basic Configuration Structure

```yaml
# prometheus.yml
global:
  scrape_interval: 15s      # How often to scrape targets
  evaluation_interval: 15s  # How often to evaluate rules
  scrape_timeout: 10s       # Timeout for scrape requests

# Alertmanager configuration
alerting:
  alertmanagers:
    - static_configs:
        - targets:
            - alertmanager:9093

# Rule files
rule_files:
  - "rules/*.yml"
  - "alerts/*.yml"

# Scrape configurations
scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']
```

### Scrape Configuration Options

```yaml
scrape_configs:
  - job_name: 'example'
    # Override global settings
    scrape_interval: 30s
    scrape_timeout: 10s
    
    # Metrics path (default: /metrics)
    metrics_path: /metrics
    
    # Scheme (http or https)
    scheme: https
    
    # Basic authentication
    basic_auth:
      username: admin
      password: secret
    
    # TLS configuration
    tls_config:
      ca_file: /path/to/ca.crt
      cert_file: /path/to/client.crt
      key_file: /path/to/client.key
    
    # Static targets
    static_configs:
      - targets: ['host1:9090', 'host2:9090']
        labels:
          env: production
          team: backend
```

### Relabeling Configuration

Relabeling allows modifying labels before scraping or storing.

```yaml
scrape_configs:
  - job_name: 'kubernetes-pods'
    kubernetes_sd_configs:
      - role: pod
    
    relabel_configs:
      # Keep only pods with annotation
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true
      
      # Replace metrics path
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
        action: replace
        target_label: __metrics_path__
        regex: (.+)
      
      # Add namespace label
      - source_labels: [__meta_kubernetes_namespace]
        action: replace
        target_label: namespace
      
      # Drop specific labels
      - action: labeldrop
        regex: __meta_kubernetes_pod_label_(.+)
```

## Data Model

### Time Series Structure

Every time series is uniquely identified by:
- **Metric name**: Describes what is being measured
- **Labels**: Key-value pairs for dimensions

```
<metric_name>{<label_name>=<label_value>, ...}

# Examples
http_requests_total{method="GET", status="200", path="/api"}
node_cpu_seconds_total{cpu="0", mode="idle"}
```

### Metric Naming Conventions

```
# Format: <namespace>_<name>_<unit>_<suffix>

# Good examples
http_requests_total              # Counter
http_request_duration_seconds    # Histogram
node_memory_bytes_total          # Gauge
process_cpu_seconds_total        # Counter

# Suffixes
_total    - Counter
_count    - Number of observations (histogram/summary)
_sum      - Sum of observations (histogram/summary)
_bucket   - Histogram bucket
_info     - Info metric (gauge with value 1)
```

### Label Best Practices

```yaml
# Good labels - low cardinality
http_requests_total{method="GET", status="200"}
http_requests_total{method="POST", status="201"}

# Bad labels - high cardinality (avoid!)
http_requests_total{user_id="12345", request_id="abc-123"}
```

**Cardinality Warning:** Each unique label combination creates a new time series. High cardinality can cause performance issues.

## Metric Types

### Counter

A cumulative metric that only increases (or resets to zero on restart).

```promql
# Raw counter value
http_requests_total

# Rate of increase per second
rate(http_requests_total[5m])

# Total increase over time window
increase(http_requests_total[1h])
```

### Gauge

A metric that can go up or down.

```promql
# Current value
node_memory_MemAvailable_bytes

# Changes over time
delta(node_memory_MemAvailable_bytes[1h])

# Derivative (rate of change)
deriv(node_memory_MemAvailable_bytes[1h])
```

### Histogram

Samples observations and counts them in configurable buckets.

```promql
# Bucket counts
http_request_duration_seconds_bucket{le="0.1"}
http_request_duration_seconds_bucket{le="0.5"}
http_request_duration_seconds_bucket{le="+Inf"}

# Calculate percentiles
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))

# Average duration
rate(http_request_duration_seconds_sum[5m]) / rate(http_request_duration_seconds_count[5m])
```

### Summary

Similar to histogram but calculates quantiles on the client side.

```promql
# Pre-calculated quantiles
go_gc_duration_seconds{quantile="0.5"}
go_gc_duration_seconds{quantile="0.9"}
go_gc_duration_seconds{quantile="0.99"}
```

**Histogram vs Summary:**
| Feature | Histogram | Summary |
|---------|-----------|---------|
| Quantile calculation | Server-side (PromQL) | Client-side |
| Aggregatable | Yes | No |
| Bucket configuration | Required | Not needed |
| Accuracy | Depends on buckets | Configurable |

## Exposition Format

### Text Format

```
# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="GET",status="200"} 1234 1609459200000
http_requests_total{method="POST",status="201"} 567

# HELP node_cpu_seconds_total CPU time spent in each mode
# TYPE node_cpu_seconds_total counter
node_cpu_seconds_total{cpu="0",mode="idle"} 123456.78
node_cpu_seconds_total{cpu="0",mode="user"} 45678.90
```

### Format Components

```
# HELP <metric_name> <description>
# TYPE <metric_name> <type>
<metric_name>{<labels>} <value> [<timestamp>]
```

## Prometheus Limitations

### Storage Limitations

- **Local storage only**: No built-in clustering
- **Retention**: Limited by disk space
- **No long-term storage**: Use remote write for long-term

```yaml
# Storage configuration
storage:
  tsdb:
    path: /prometheus/data
    retention.time: 15d
    retention.size: 50GB
```

### Scalability Limitations

- **Single server**: Prometheus is designed for single-server operation
- **High availability**: Requires running multiple instances
- **Federation**: For hierarchical scaling

```yaml
# Federation configuration
scrape_configs:
  - job_name: 'federate'
    honor_labels: true
    metrics_path: '/federate'
    params:
      'match[]':
        - '{job="prometheus"}'
        - '{__name__=~"job:.*"}'
    static_configs:
      - targets:
          - 'prometheus-1:9090'
          - 'prometheus-2:9090'
```

### Other Limitations

| Limitation | Workaround |
|------------|------------|
| No event logging | Use logging systems (Loki, ELK) |
| Pull-only model | Pushgateway for batch jobs |
| No built-in auth | Use reverse proxy |
| Single-node | Federation, Thanos, Cortex |

## Remote Write/Read

### Remote Write Configuration

```yaml
remote_write:
  - url: "http://remote-storage:9201/write"
    queue_config:
      max_samples_per_send: 1000
      batch_send_deadline: 5s
    write_relabel_configs:
      - source_labels: [__name__]
        regex: 'expensive_metric_.*'
        action: drop
```

### Remote Read Configuration

```yaml
remote_read:
  - url: "http://remote-storage:9201/read"
    read_recent: true
```

## Practice Questions

1. What are the main components of Prometheus architecture?
2. What is the difference between `scrape_interval` and `evaluation_interval`?
3. How do you configure basic authentication for a scrape target?
4. What is the purpose of relabeling in Prometheus?
5. What are the four metric types in Prometheus?
6. Why should you avoid high-cardinality labels?
7. What is the difference between histogram and summary metrics?
8. How can you scale Prometheus for high availability?

## Navigation

- [← Back to Observability Concepts](./01-observability-concepts.md)
- [Next: PromQL →](./03-promql.md)
