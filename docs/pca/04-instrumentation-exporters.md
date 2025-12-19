# Instrumentation and Exporters (16%)

## Overview

This domain covers client libraries, instrumentation best practices, exporters, and metric naming conventions.

## Client Libraries

Prometheus provides official client libraries for instrumenting your applications.

### Official Libraries

| Language | Library |
|----------|---------|
| Go | `prometheus/client_golang` |
| Java | `prometheus/client_java` |
| Python | `prometheus/client_python` |
| Ruby | `prometheus/client_ruby` |
| Rust | `prometheus/client_rust` |

### Go Client Example

```go
package main

import (
    "net/http"
    "github.com/prometheus/client_golang/prometheus"
    "github.com/prometheus/client_golang/prometheus/promhttp"
)

var (
    // Counter
    httpRequestsTotal = prometheus.NewCounterVec(
        prometheus.CounterOpts{
            Name: "http_requests_total",
            Help: "Total number of HTTP requests",
        },
        []string{"method", "status"},
    )
    
    // Gauge
    activeConnections = prometheus.NewGauge(
        prometheus.GaugeOpts{
            Name: "active_connections",
            Help: "Number of active connections",
        },
    )
    
    // Histogram
    requestDuration = prometheus.NewHistogramVec(
        prometheus.HistogramOpts{
            Name:    "http_request_duration_seconds",
            Help:    "HTTP request duration in seconds",
            Buckets: prometheus.DefBuckets,
        },
        []string{"method", "path"},
    )
)

func init() {
    prometheus.MustRegister(httpRequestsTotal)
    prometheus.MustRegister(activeConnections)
    prometheus.MustRegister(requestDuration)
}

func main() {
    http.Handle("/metrics", promhttp.Handler())
    http.ListenAndServe(":8080", nil)
}
```

### Python Client Example

```python
from prometheus_client import Counter, Gauge, Histogram, start_http_server

# Counter
http_requests_total = Counter(
    'http_requests_total',
    'Total HTTP requests',
    ['method', 'status']
)

# Gauge
active_connections = Gauge(
    'active_connections',
    'Number of active connections'
)

# Histogram
request_duration = Histogram(
    'http_request_duration_seconds',
    'HTTP request duration',
    ['method', 'path'],
    buckets=[0.01, 0.05, 0.1, 0.5, 1.0, 5.0]
)

# Usage
http_requests_total.labels(method='GET', status='200').inc()
active_connections.set(42)

with request_duration.labels(method='GET', path='/api').time():
    # Your code here
    pass

# Start metrics server
start_http_server(8000)
```

### Java Client Example

```java
import io.prometheus.client.Counter;
import io.prometheus.client.Gauge;
import io.prometheus.client.Histogram;
import io.prometheus.client.exporter.HTTPServer;

public class Application {
    static final Counter requests = Counter.build()
        .name("http_requests_total")
        .help("Total HTTP requests")
        .labelNames("method", "status")
        .register();
    
    static final Gauge connections = Gauge.build()
        .name("active_connections")
        .help("Active connections")
        .register();
    
    static final Histogram duration = Histogram.build()
        .name("http_request_duration_seconds")
        .help("Request duration")
        .labelNames("method", "path")
        .buckets(0.01, 0.05, 0.1, 0.5, 1.0, 5.0)
        .register();
    
    public static void main(String[] args) throws Exception {
        HTTPServer server = new HTTPServer(8080);
        
        // Usage
        requests.labels("GET", "200").inc();
        connections.set(42);
        
        Histogram.Timer timer = duration.labels("GET", "/api").startTimer();
        try {
            // Your code here
        } finally {
            timer.observeDuration();
        }
    }
}
```

## Instrumentation Best Practices

### What to Instrument

**The Four Golden Signals (Google SRE):**

1. **Latency**: Time to service a request
2. **Traffic**: Demand on your system (requests/second)
3. **Errors**: Rate of failed requests
4. **Saturation**: How "full" your service is

**RED Method (for services):**

- **Rate**: Requests per second
- **Errors**: Failed requests per second
- **Duration**: Time per request

**USE Method (for resources):**

- **Utilization**: Percentage of resource used
- **Saturation**: Amount of work queued
- **Errors**: Error events

### Counter Best Practices

```go
// Good: Use _total suffix
http_requests_total

// Good: Include relevant labels
http_requests_total{method="GET", status="200"}

// Bad: Don't use counters for values that can decrease
// Use gauge instead for things like queue size
```

### Gauge Best Practices

```go
// Good: Current state metrics
active_connections
queue_size
temperature_celsius

// Good: Use for values that go up and down
memory_usage_bytes
```

### Histogram Best Practices

```go
// Good: Choose appropriate buckets for your use case
prometheus.HistogramOpts{
    Name:    "http_request_duration_seconds",
    Buckets: []float64{0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 5, 10},
}

// Good: Use seconds as the base unit
http_request_duration_seconds

// Bad: Don't use milliseconds
http_request_duration_milliseconds  // Avoid this
```

### Label Best Practices

```go
// Good: Low cardinality labels
http_requests_total{method="GET", status="200"}

// Bad: High cardinality labels (avoid!)
http_requests_total{user_id="12345", request_id="abc-123"}

// Good: Bounded set of values
http_requests_total{status_class="2xx"}

// Bad: Unbounded values
http_requests_total{path="/users/12345/orders/67890"}
```

## Metric Naming Conventions

### Format

```
<namespace>_<name>_<unit>_<suffix>
```

### Examples

```
# Application namespace
myapp_http_requests_total
myapp_database_connections_active

# Unit in name
http_request_duration_seconds
node_memory_bytes_total
process_cpu_seconds_total

# Suffixes
_total      # Counter
_count      # Histogram/Summary count
_sum        # Histogram/Summary sum
_bucket     # Histogram bucket
_info       # Info metric (value always 1)
_created    # Creation timestamp
```

### Naming Rules

1. Use snake_case
2. Include unit in name (seconds, bytes, etc.)
3. Use base units (seconds not milliseconds, bytes not kilobytes)
4. Use `_total` suffix for counters
5. Don't include label names in metric name

## Exporters

Exporters expose metrics from third-party systems in Prometheus format.

### Node Exporter

Exposes hardware and OS metrics from Linux/Unix systems.

```bash
# Install and run
./node_exporter --web.listen-address=":9100"

# Key metrics
node_cpu_seconds_total
node_memory_MemTotal_bytes
node_memory_MemAvailable_bytes
node_filesystem_size_bytes
node_network_receive_bytes_total
node_load1, node_load5, node_load15
```

**Prometheus Configuration:**

```yaml
scrape_configs:
  - job_name: 'node'
    static_configs:
      - targets: ['localhost:9100']
```

### Blackbox Exporter

Probes endpoints over HTTP, HTTPS, DNS, TCP, ICMP.

```yaml
# blackbox.yml
modules:
  http_2xx:
    prober: http
    timeout: 5s
    http:
      valid_http_versions: ["HTTP/1.1", "HTTP/2.0"]
      valid_status_codes: [200, 201, 202]
      method: GET
      
  tcp_connect:
    prober: tcp
    timeout: 5s
    
  dns_lookup:
    prober: dns
    timeout: 5s
    dns:
      query_name: "example.com"
```

**Prometheus Configuration:**

```yaml
scrape_configs:
  - job_name: 'blackbox'
    metrics_path: /probe
    params:
      module: [http_2xx]
    static_configs:
      - targets:
          - https://example.com
          - https://api.example.com
    relabel_configs:
      - source_labels: [__address__]
        target_label: __param_target
      - source_labels: [__param_target]
        target_label: instance
      - target_label: __address__
        replacement: blackbox-exporter:9115
```

### Other Common Exporters

| Exporter | Purpose | Default Port |
|----------|---------|--------------|
| **node_exporter** | Linux/Unix system metrics | 9100 |
| **blackbox_exporter** | Endpoint probing | 9115 |
| **mysqld_exporter** | MySQL metrics | 9104 |
| **postgres_exporter** | PostgreSQL metrics | 9187 |
| **redis_exporter** | Redis metrics | 9121 |
| **nginx_exporter** | NGINX metrics | 9113 |
| **kafka_exporter** | Kafka metrics | 9308 |
| **mongodb_exporter** | MongoDB metrics | 9216 |
| **elasticsearch_exporter** | Elasticsearch metrics | 9114 |
| **cloudwatch_exporter** | AWS CloudWatch metrics | 9106 |

### Writing Custom Exporters

```python
from prometheus_client import Gauge, start_http_server
import time
import random

# Define metrics
custom_metric = Gauge(
    'custom_application_metric',
    'A custom metric from our application',
    ['environment', 'service']
)

def collect_metrics():
    """Collect metrics from your data source"""
    while True:
        # Simulate collecting data
        value = random.random() * 100
        custom_metric.labels(
            environment='production',
            service='api'
        ).set(value)
        time.sleep(15)

if __name__ == '__main__':
    start_http_server(8000)
    collect_metrics()
```

## Pushgateway

For short-lived jobs that can't be scraped.

### When to Use

- Batch jobs
- Cron jobs
- Short-lived processes
- Jobs behind firewalls

### Pushing Metrics

```bash
# Push a single metric
echo "job_last_success_timestamp $(date +%s)" | \
  curl --data-binary @- http://pushgateway:9091/metrics/job/batch_job

# Push multiple metrics
cat <<EOF | curl --data-binary @- http://pushgateway:9091/metrics/job/batch_job/instance/host1
# TYPE job_duration_seconds gauge
job_duration_seconds 42.5
# TYPE job_records_processed counter
job_records_processed 1234
EOF

# Delete metrics for a job
curl -X DELETE http://pushgateway:9091/metrics/job/batch_job
```

### Python Example

```python
from prometheus_client import CollectorRegistry, Gauge, push_to_gateway

registry = CollectorRegistry()

duration = Gauge(
    'job_duration_seconds',
    'Duration of batch job',
    registry=registry
)
duration.set(42.5)

records = Gauge(
    'job_records_processed',
    'Records processed by batch job',
    registry=registry
)
records.set(1234)

push_to_gateway(
    'pushgateway:9091',
    job='batch_job',
    registry=registry
)
```

### Pushgateway Caveats

- Metrics persist until deleted
- No automatic cleanup
- Single point of failure
- Not for general metrics collection

## Practice Questions

1. What are the four golden signals of monitoring?
2. Name three official Prometheus client libraries.
3. What is the difference between the RED and USE methods?
4. When should you use the Pushgateway?
5. What metrics does the Node Exporter provide?
6. How do you configure the Blackbox Exporter to probe HTTP endpoints?
7. What are the naming conventions for Prometheus metrics?
8. Why should you avoid high-cardinality labels?

## Navigation

- [← Back to PromQL](./03-promql.md)
- [Next: Alerting & Dashboarding →](./05-alerting-dashboarding.md)
