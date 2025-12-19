# Alerting & Dashboarding (18%)

## Overview

This domain covers configuring alerting rules, understanding Alertmanager, and dashboarding basics with Grafana.

## Alerting Rules

### Rule Configuration

Alert rules are defined in YAML files and loaded by Prometheus.

```yaml
# alerts.yml
groups:
  - name: example-alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
          team: backend
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value | humanizePercentage }} for {{ $labels.instance }}"
          
      - alert: InstanceDown
        expr: up == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Instance {{ $labels.instance }} is down"
          description: "{{ $labels.instance }} of job {{ $labels.job }} has been down for more than 1 minute."
```

### Rule Components

| Component | Description |
|-----------|-------------|
| `alert` | Name of the alert |
| `expr` | PromQL expression that triggers the alert |
| `for` | Duration the condition must be true before firing |
| `labels` | Additional labels to attach to the alert |
| `annotations` | Informational labels (summary, description, runbook) |

### Alert States

1. **Inactive**: Condition is not met
2. **Pending**: Condition is met but `for` duration hasn't elapsed
3. **Firing**: Condition met for the `for` duration

```
Inactive → Pending → Firing
              ↓
           Inactive (if condition becomes false)
```

### Recording Rules

Pre-compute frequently used or expensive expressions.

```yaml
groups:
  - name: recording-rules
    rules:
      - record: job:http_requests_total:rate5m
        expr: sum by (job) (rate(http_requests_total[5m]))
        
      - record: instance:node_cpu_utilization:ratio
        expr: 1 - avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m]))
        
      - record: job:http_request_duration_seconds:p95
        expr: histogram_quantile(0.95, sum by (job, le) (rate(http_request_duration_seconds_bucket[5m])))
```

### Prometheus Configuration

```yaml
# prometheus.yml
rule_files:
  - "rules/*.yml"
  - "alerts/*.yml"

alerting:
  alertmanagers:
    - static_configs:
        - targets:
            - alertmanager:9093
```

## Alertmanager

### Architecture

```
┌─────────────┐     ┌─────────────────────────────────────────┐
│  Prometheus │────▶│            Alertmanager                  │
│   (alerts)  │     │  ┌─────────┐  ┌──────────┐  ┌────────┐ │
└─────────────┘     │  │ Routing │─▶│ Grouping │─▶│ Notify │ │
                    │  └─────────┘  └──────────┘  └────────┘ │
                    └─────────────────────────────────────────┘
                                                      │
                    ┌─────────────────────────────────┼─────────┐
                    │                                 │         │
                    ▼                                 ▼         ▼
              ┌──────────┐                    ┌──────────┐ ┌────────┐
              │  Email   │                    │  Slack   │ │PagerDuty│
              └──────────┘                    └──────────┘ └────────┘
```

### Configuration Structure

```yaml
# alertmanager.yml
global:
  resolve_timeout: 5m
  smtp_smarthost: 'smtp.example.com:587'
  smtp_from: 'alertmanager@example.com'

route:
  receiver: 'default-receiver'
  group_by: ['alertname', 'cluster']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h
  routes:
    - match:
        severity: critical
      receiver: 'pagerduty-critical'
    - match:
        severity: warning
      receiver: 'slack-warnings'

receivers:
  - name: 'default-receiver'
    email_configs:
      - to: 'team@example.com'
        
  - name: 'pagerduty-critical'
    pagerduty_configs:
      - service_key: '<pagerduty-service-key>'
        
  - name: 'slack-warnings'
    slack_configs:
      - api_url: 'https://hooks.slack.com/services/xxx/yyy/zzz'
        channel: '#alerts'

inhibit_rules:
  - source_match:
      severity: 'critical'
    target_match:
      severity: 'warning'
    equal: ['alertname', 'cluster']
```

### Routing

Routes determine which receiver handles an alert.

```yaml
route:
  receiver: 'default'
  routes:
    # Critical alerts go to PagerDuty
    - match:
        severity: critical
      receiver: 'pagerduty'
      continue: false
      
    # Database alerts go to DBA team
    - match_re:
        alertname: ^(MySQL|Postgres).*
      receiver: 'dba-team'
      
    # Multiple matchers (AND logic)
    - match:
        team: backend
        severity: warning
      receiver: 'backend-slack'
```

### Grouping

Groups related alerts together to reduce notification noise.

```yaml
route:
  group_by: ['alertname', 'cluster', 'service']
  group_wait: 30s      # Wait before sending first notification
  group_interval: 5m   # Wait before sending updates to group
  repeat_interval: 4h  # Wait before re-sending same alert
```

### Silences

Temporarily mute alerts.

```bash
# Create silence via API
curl -X POST http://alertmanager:9093/api/v2/silences \
  -H "Content-Type: application/json" \
  -d '{
    "matchers": [
      {"name": "alertname", "value": "HighMemoryUsage", "isRegex": false},
      {"name": "instance", "value": "server1", "isRegex": false}
    ],
    "startsAt": "2024-01-01T00:00:00Z",
    "endsAt": "2024-01-01T06:00:00Z",
    "createdBy": "admin",
    "comment": "Maintenance window"
  }'
```

### Inhibition

Suppress alerts when related alerts are firing.

```yaml
inhibit_rules:
  # If critical alert fires, suppress warning for same alertname
  - source_match:
      severity: 'critical'
    target_match:
      severity: 'warning'
    equal: ['alertname', 'instance']
    
  # If cluster is down, suppress all other cluster alerts
  - source_match:
      alertname: 'ClusterDown'
    target_match_re:
      alertname: '.+'
    equal: ['cluster']
```

### Receivers

#### Email

```yaml
receivers:
  - name: 'email-team'
    email_configs:
      - to: 'team@example.com'
        from: 'alertmanager@example.com'
        smarthost: 'smtp.example.com:587'
        auth_username: 'alertmanager'
        auth_password: 'password'
        require_tls: true
```

#### Slack

```yaml
receivers:
  - name: 'slack-notifications'
    slack_configs:
      - api_url: 'https://hooks.slack.com/services/xxx/yyy/zzz'
        channel: '#alerts'
        username: 'Alertmanager'
        icon_emoji: ':warning:'
        title: '{{ .Status | toUpper }}: {{ .CommonAnnotations.summary }}'
        text: '{{ range .Alerts }}{{ .Annotations.description }}{{ end }}'
```

#### PagerDuty

```yaml
receivers:
  - name: 'pagerduty'
    pagerduty_configs:
      - service_key: '<integration-key>'
        severity: '{{ if eq .Status "firing" }}critical{{ else }}info{{ end }}'
        description: '{{ .CommonAnnotations.summary }}'
```

#### Webhook

```yaml
receivers:
  - name: 'webhook'
    webhook_configs:
      - url: 'http://webhook-handler:8080/alerts'
        send_resolved: true
```

## Dashboarding with Grafana

### Data Source Configuration

```yaml
# Grafana datasource provisioning
apiVersion: 1
datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
    editable: false
```

### Panel Types

| Panel Type | Use Case |
|------------|----------|
| **Time Series** | Metrics over time |
| **Stat** | Single value display |
| **Gauge** | Value with thresholds |
| **Bar Gauge** | Horizontal/vertical bars |
| **Table** | Tabular data |
| **Heatmap** | Distribution over time |
| **Logs** | Log data display |

### Common Dashboard Patterns

#### Request Rate Panel

```promql
sum(rate(http_requests_total[5m])) by (service)
```

#### Error Rate Panel

```promql
sum(rate(http_requests_total{status=~"5.."}[5m])) by (service) 
/ 
sum(rate(http_requests_total[5m])) by (service) * 100
```

#### Latency Percentiles Panel

```promql
histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))
histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))
histogram_quantile(0.50, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))
```

#### Resource Utilization Panel

```promql
# CPU Usage
100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)

# Memory Usage
(1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) * 100

# Disk Usage
(1 - node_filesystem_avail_bytes / node_filesystem_size_bytes) * 100
```

### Variables (Template Variables)

```yaml
# Query variable for instances
Name: instance
Type: Query
Query: label_values(up, instance)

# Custom variable for time ranges
Name: interval
Type: Custom
Values: 1m,5m,15m,1h

# Using variables in queries
rate(http_requests_total{instance="$instance"}[$interval])
```

### Dashboard Best Practices

1. **Use consistent naming**: Follow a naming convention
2. **Add descriptions**: Document what each panel shows
3. **Set appropriate time ranges**: Match to your SLOs
4. **Use variables**: Make dashboards reusable
5. **Group related panels**: Use rows to organize
6. **Set thresholds**: Visual indicators for good/bad states
7. **Include links**: Link to runbooks and related dashboards

## Alerting Best Practices

### When to Alert

**Alert on symptoms, not causes:**

```yaml
# Good: Alert on user-facing impact
- alert: HighErrorRate
  expr: rate(http_errors_total[5m]) / rate(http_requests_total[5m]) > 0.01

# Avoid: Alerting on every possible cause
- alert: HighCPU
  expr: cpu_usage > 80  # May not indicate a problem
```

### Alert Fatigue Prevention

1. **Set appropriate thresholds**: Not too sensitive
2. **Use `for` duration**: Avoid flapping alerts
3. **Group related alerts**: Reduce notification volume
4. **Use inhibition**: Suppress redundant alerts
5. **Regular review**: Remove or tune noisy alerts

### Alert Annotations

```yaml
annotations:
  summary: "Brief description of the alert"
  description: "Detailed information with {{ $labels.instance }} and {{ $value }}"
  runbook_url: "https://wiki.example.com/runbooks/high-error-rate"
  dashboard_url: "https://grafana.example.com/d/abc123"
```

## Practice Questions

1. What are the three states of an alert in Prometheus?
2. What is the purpose of the `for` clause in an alert rule?
3. How does Alertmanager group alerts?
4. What is the difference between silences and inhibition?
5. Name three notification channels supported by Alertmanager.
6. What is a recording rule and when should you use one?
7. How do you configure routing in Alertmanager?
8. What are template variables in Grafana used for?

## Navigation

- [← Back to Instrumentation and Exporters](./04-instrumentation-exporters.md)
- [Next: Sample Practice Questions →](./sample-questions.md)
