# PCA Hands-on Lab Exercises

These labs provide hands-on experience with Prometheus and observability concepts for the PCA exam.

## Prerequisites

- Docker or Kubernetes cluster
- Prometheus installed
- Grafana (optional)

---

## Lab 1: Prometheus Setup and Configuration

**Objective:** Install and configure Prometheus

### Docker Setup

```bash
# Create prometheus config
cat <<EOF > prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']
EOF

# Run Prometheus
docker run -d \
  --name prometheus \
  -p 9090:9090 \
  -v $(pwd)/prometheus.yml:/etc/prometheus/prometheus.yml \
  prom/prometheus
```

### Kubernetes Setup

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
data:
  prometheus.yml: |
    global:
      scrape_interval: 15s
    scrape_configs:
      - job_name: 'kubernetes-pods'
        kubernetes_sd_configs:
          - role: pod
        relabel_configs:
          - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
            action: keep
            regex: true
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: prometheus
spec:
  replicas: 1
  selector:
    matchLabels:
      app: prometheus
  template:
    metadata:
      labels:
        app: prometheus
    spec:
      containers:
      - name: prometheus
        image: prom/prometheus:v2.47.0
        ports:
        - containerPort: 9090
        volumeMounts:
        - name: config
          mountPath: /etc/prometheus
      volumes:
      - name: config
        configMap:
          name: prometheus-config
```

### Tasks

```bash
# Access Prometheus UI
open http://localhost:9090

# Check targets
curl http://localhost:9090/api/v1/targets

# Check config
curl http://localhost:9090/api/v1/status/config
```

---

## Lab 2: PromQL Queries

**Objective:** Master PromQL query language

### Basic Queries

```promql
# Instant vector - current value
up

# Range vector - values over time
up[5m]

# Filter by label
up{job="prometheus"}

# Regex matching
up{job=~"prom.*"}

# Negative matching
up{job!="prometheus"}
```

### Aggregation Functions

```promql
# Sum all values
sum(up)

# Sum by label
sum by (job) (up)

# Count instances
count(up)

# Average
avg(rate(http_requests_total[5m]))

# Top 5
topk(5, rate(http_requests_total[5m]))

# Bottom 5
bottomk(5, rate(http_requests_total[5m]))
```

### Rate and Increase

```promql
# Rate - per-second rate of increase
rate(http_requests_total[5m])

# Irate - instant rate (last two samples)
irate(http_requests_total[5m])

# Increase - total increase over time range
increase(http_requests_total[1h])
```

### Mathematical Operations

```promql
# Percentage
100 * (1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes))

# Division with default
http_requests_total / ignoring(code) group_left http_requests_total{code="200"} or vector(0)

# Offset - compare to past
rate(http_requests_total[5m]) - rate(http_requests_total[5m] offset 1h)
```

### Tasks

```bash
# Execute queries via API
curl 'http://localhost:9090/api/v1/query?query=up'
curl 'http://localhost:9090/api/v1/query_range?query=up&start=2023-01-01T00:00:00Z&end=2023-01-01T01:00:00Z&step=15s'
```

---

## Lab 3: Recording Rules

**Objective:** Create recording rules for efficiency

### Recording Rules Configuration

```yaml
# rules/recording_rules.yml
groups:
  - name: example_recording_rules
    interval: 30s
    rules:
      - record: job:http_requests_total:rate5m
        expr: sum by (job) (rate(http_requests_total[5m]))
      
      - record: instance:node_cpu_utilization:ratio
        expr: 1 - avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m]))
      
      - record: instance:node_memory_utilization:ratio
        expr: 1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)
```

### Update Prometheus Config

```yaml
# prometheus.yml
global:
  scrape_interval: 15s

rule_files:
  - "rules/*.yml"

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']
```

### Tasks

```bash
# Reload Prometheus config
curl -X POST http://localhost:9090/-/reload

# Check rules
curl http://localhost:9090/api/v1/rules

# Query recorded metric
curl 'http://localhost:9090/api/v1/query?query=job:http_requests_total:rate5m'
```

---

## Lab 4: Alerting Rules

**Objective:** Configure alerting rules

### Alert Rules Configuration

```yaml
# rules/alerting_rules.yml
groups:
  - name: example_alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) > 0.1
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value | humanizePercentage }} for {{ $labels.instance }}"
      
      - alert: InstanceDown
        expr: up == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Instance {{ $labels.instance }} down"
          description: "{{ $labels.instance }} of job {{ $labels.job }} has been down for more than 1 minute."
      
      - alert: HighMemoryUsage
        expr: instance:node_memory_utilization:ratio > 0.9
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage on {{ $labels.instance }}"
          description: "Memory usage is {{ $value | humanizePercentage }}"
```

### Alertmanager Configuration

```yaml
# alertmanager.yml
global:
  resolve_timeout: 5m

route:
  group_by: ['alertname', 'severity']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 1h
  receiver: 'slack-notifications'
  routes:
    - match:
        severity: critical
      receiver: 'pagerduty'

receivers:
  - name: 'slack-notifications'
    slack_configs:
      - api_url: 'https://hooks.slack.com/services/xxx'
        channel: '#alerts'
        
  - name: 'pagerduty'
    pagerduty_configs:
      - service_key: 'xxx'

inhibit_rules:
  - source_match:
      severity: 'critical'
    target_match:
      severity: 'warning'
    equal: ['alertname', 'instance']
```

### Tasks

```bash
# Check alerts
curl http://localhost:9090/api/v1/alerts

# Check Alertmanager
curl http://localhost:9093/api/v2/alerts
```

---

## Lab 5: Exporters

**Objective:** Deploy and configure exporters

### Node Exporter

```bash
# Docker
docker run -d \
  --name node-exporter \
  -p 9100:9100 \
  --pid="host" \
  -v "/:/host:ro,rslave" \
  prom/node-exporter \
  --path.rootfs=/host
```

### Blackbox Exporter

```yaml
# blackbox.yml
modules:
  http_2xx:
    prober: http
    timeout: 5s
    http:
      valid_http_versions: ["HTTP/1.1", "HTTP/2.0"]
      valid_status_codes: []
      method: GET
      follow_redirects: true
  
  tcp_connect:
    prober: tcp
    timeout: 5s
```

```bash
# Run Blackbox Exporter
docker run -d \
  --name blackbox-exporter \
  -p 9115:9115 \
  -v $(pwd)/blackbox.yml:/config/blackbox.yml \
  prom/blackbox-exporter \
  --config.file=/config/blackbox.yml
```

### Prometheus Config for Blackbox

```yaml
scrape_configs:
  - job_name: 'blackbox-http'
    metrics_path: /probe
    params:
      module: [http_2xx]
    static_configs:
      - targets:
        - https://google.com
        - https://github.com
    relabel_configs:
      - source_labels: [__address__]
        target_label: __param_target
      - source_labels: [__param_target]
        target_label: instance
      - target_label: __address__
        replacement: blackbox-exporter:9115
```

---

## Lab 6: Application Instrumentation

**Objective:** Instrument applications with Prometheus metrics

### Python Application

```python
from prometheus_client import start_http_server, Counter, Histogram, Gauge
import time
import random

# Define metrics
REQUEST_COUNT = Counter('app_requests_total', 'Total requests', ['method', 'endpoint'])
REQUEST_LATENCY = Histogram('app_request_latency_seconds', 'Request latency', ['endpoint'])
ACTIVE_REQUESTS = Gauge('app_active_requests', 'Active requests')

@REQUEST_LATENCY.labels(endpoint='/api').time()
def process_request():
    ACTIVE_REQUESTS.inc()
    REQUEST_COUNT.labels(method='GET', endpoint='/api').inc()
    time.sleep(random.uniform(0.1, 0.5))
    ACTIVE_REQUESTS.dec()

if __name__ == '__main__':
    start_http_server(8000)
    while True:
        process_request()
        time.sleep(1)
```

### Go Application

```go
package main

import (
    "net/http"
    "github.com/prometheus/client_golang/prometheus"
    "github.com/prometheus/client_golang/prometheus/promhttp"
)

var (
    requestsTotal = prometheus.NewCounterVec(
        prometheus.CounterOpts{
            Name: "app_requests_total",
            Help: "Total number of requests",
        },
        []string{"method", "endpoint"},
    )
    
    requestDuration = prometheus.NewHistogramVec(
        prometheus.HistogramOpts{
            Name:    "app_request_duration_seconds",
            Help:    "Request duration in seconds",
            Buckets: prometheus.DefBuckets,
        },
        []string{"endpoint"},
    )
)

func init() {
    prometheus.MustRegister(requestsTotal)
    prometheus.MustRegister(requestDuration)
}

func main() {
    http.Handle("/metrics", promhttp.Handler())
    http.ListenAndServe(":8080", nil)
}
```

---

## Lab 7: Grafana Dashboards

**Objective:** Create Grafana dashboards

### Run Grafana

```bash
docker run -d \
  --name grafana \
  -p 3000:3000 \
  grafana/grafana
```

### Dashboard JSON

```json
{
  "dashboard": {
    "title": "Application Metrics",
    "panels": [
      {
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(app_requests_total[5m])",
            "legendFormat": "{{method}} {{endpoint}}"
          }
        ]
      },
      {
        "title": "Request Latency P99",
        "type": "stat",
        "targets": [
          {
            "expr": "histogram_quantile(0.99, rate(app_request_latency_seconds_bucket[5m]))"
          }
        ]
      }
    ]
  }
}
```

---

## Additional Practice Resources

- [Prometheus Documentation](https://prometheus.io/docs/)
- [PromQL Tutorial](https://prometheus.io/docs/prometheus/latest/querying/basics/)
- [Grafana Tutorials](https://grafana.com/tutorials/)

---

[← Back to PCA Overview](../pca/README.md)
