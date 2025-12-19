# PCA Sample Practice Questions

## Practice Resources

- [Prometheus Documentation](https://prometheus.io/docs/)
- [PromLabs Training](https://training.promlabs.com/)
- [Prometheus Playground](https://prometheus.io/docs/prometheus/latest/getting_started/)

---

## Domain 1: Observability Concepts (18%)

### Question 1
What are the three pillars of observability?

<details>
<summary>Show Answer</summary>

**Answer:** Metrics, Logs, and Traces

- **Metrics**: Numerical values that measure aspects of a system over time
- **Logs**: Immutable records of discrete events
- **Traces**: Records of request paths through distributed systems

</details>

### Question 2
What is the difference between an SLA, SLO, and SLI?

<details>
<summary>Show Answer</summary>

- **SLA (Service Level Agreement)**: A formal agreement with customers defining expected service levels
- **SLO (Service Level Objective)**: Internal targets that teams aim to achieve
- **SLI (Service Level Indicator)**: The actual metrics used to measure service performance

Example: SLA promises 99.9% uptime, SLO targets 99.95%, SLI measures actual availability.

</details>

### Question 3
When should you use the Push model (Pushgateway) instead of the Pull model?

<details>
<summary>Show Answer</summary>

Use Pushgateway for:
- Short-lived batch jobs
- Cron jobs that complete before scraping
- Jobs behind firewalls that can't be scraped
- Legacy systems that can't expose endpoints

**Important**: Pushgateway should NOT be used as a general metrics aggregator.

</details>

### Question 4
What is a span in the context of distributed tracing?

<details>
<summary>Show Answer</summary>

A **span** represents a single operation within a trace. It provides:
- Start and end timestamps
- Operation name
- Tags/labels
- Logs/events
- Parent span reference

Multiple spans together form a complete trace showing the request flow through a system.

</details>

---

## Domain 2: Prometheus Fundamentals (20%)

### Question 5
What are the four metric types in Prometheus?

<details>
<summary>Show Answer</summary>

1. **Counter**: Cumulative metric that only increases (resets on restart)
2. **Gauge**: Metric that can go up or down
3. **Histogram**: Samples observations into configurable buckets
4. **Summary**: Similar to histogram but calculates quantiles client-side

</details>

### Question 6
What is the purpose of relabeling in Prometheus?

<details>
<summary>Show Answer</summary>

Relabeling allows you to:
- Modify labels before scraping (`relabel_configs`)
- Filter which targets to scrape
- Modify labels before storing (`metric_relabel_configs`)
- Drop unwanted metrics
- Rename labels
- Extract values from labels using regex

</details>

### Question 7
Why should you avoid high-cardinality labels?

<details>
<summary>Show Answer</summary>

High-cardinality labels (like user IDs or request IDs) create problems because:
- Each unique label combination creates a new time series
- Increases memory usage significantly
- Slows down queries
- Can cause Prometheus to run out of memory

**Best practice**: Use labels with bounded, low-cardinality values.

</details>

### Question 8
What is the difference between `scrape_interval` and `evaluation_interval`?

<details>
<summary>Show Answer</summary>

- **scrape_interval**: How often Prometheus scrapes targets for metrics (default: 1m)
- **evaluation_interval**: How often Prometheus evaluates recording and alerting rules (default: 1m)

These can be set globally and overridden per scrape job.

</details>

---

## Domain 3: PromQL (28%)

### Question 9
What is the difference between `rate()` and `irate()`?

<details>
<summary>Show Answer</summary>

- **rate()**: Calculates per-second average rate over the entire range
  - More stable, better for alerting
  - Uses all data points in the range

- **irate()**: Calculates instant rate using only the last two data points
  - More responsive to changes
  - Better for volatile metrics in graphs
  - Can miss spikes between scrapes

</details>

### Question 10
Write a PromQL query to calculate the 95th percentile latency from a histogram.

<details>
<summary>Show Answer</summary>

```promql
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
```

Or with aggregation by service:
```promql
histogram_quantile(0.95, sum by (service, le) (rate(http_request_duration_seconds_bucket[5m])))
```

</details>

### Question 11
How do you calculate error rate as a percentage?

<details>
<summary>Show Answer</summary>

```promql
sum(rate(http_requests_total{status=~"5.."}[5m])) 
/ 
sum(rate(http_requests_total[5m])) 
* 100
```

This divides error requests by total requests and multiplies by 100 for percentage.

</details>

### Question 12
What does the `absent()` function do?

<details>
<summary>Show Answer</summary>

`absent()` returns 1 if the vector has no elements, otherwise returns nothing.

Use cases:
- Alert when a metric is missing
- Detect when a service stops reporting

```promql
# Alert if no data from job
absent(up{job="myservice"})
```

</details>

### Question 13
How do you compare current values to values from 1 hour ago?

<details>
<summary>Show Answer</summary>

Use the `offset` modifier:

```promql
# Difference from 1 hour ago
http_requests_total - http_requests_total offset 1h

# Percentage change
(http_requests_total - http_requests_total offset 1h) / http_requests_total offset 1h * 100
```

</details>

### Question 14
What is the difference between `sum by` and `sum without`?

<details>
<summary>Show Answer</summary>

- **sum by (label)**: Aggregates and keeps only the specified labels
- **sum without (label)**: Aggregates and removes the specified labels, keeping all others

```promql
# Keep only 'method' label
sum by (method) (rate(http_requests_total[5m]))

# Remove 'instance' label, keep everything else
sum without (instance) (rate(http_requests_total[5m]))
```

</details>

---

## Domain 4: Instrumentation and Exporters (16%)

### Question 15
What are the Four Golden Signals of monitoring?

<details>
<summary>Show Answer</summary>

From Google SRE:
1. **Latency**: Time to service a request
2. **Traffic**: Demand on your system (requests/second)
3. **Errors**: Rate of failed requests
4. **Saturation**: How "full" your service is

</details>

### Question 16
What metrics does the Node Exporter provide?

<details>
<summary>Show Answer</summary>

Node Exporter provides hardware and OS metrics:
- CPU usage (`node_cpu_seconds_total`)
- Memory (`node_memory_*`)
- Disk (`node_filesystem_*`, `node_disk_*`)
- Network (`node_network_*`)
- Load average (`node_load1`, `node_load5`, `node_load15`)
- System info

</details>

### Question 17
What is the correct naming convention for Prometheus metrics?

<details>
<summary>Show Answer</summary>

Format: `<namespace>_<name>_<unit>_<suffix>`

Rules:
- Use snake_case
- Include unit in name (seconds, bytes)
- Use base units (seconds not milliseconds)
- Use `_total` suffix for counters
- Use `_info` suffix for info metrics

Examples:
- `http_requests_total`
- `http_request_duration_seconds`
- `node_memory_bytes_total`

</details>

### Question 18
When should you use the Blackbox Exporter?

<details>
<summary>Show Answer</summary>

Use Blackbox Exporter for:
- HTTP/HTTPS endpoint probing
- TCP port checks
- DNS lookups
- ICMP ping checks
- SSL certificate expiry monitoring

It's useful for monitoring external services or endpoints where you can't install an exporter.

</details>

---

## Domain 5: Alerting & Dashboarding (18%)

### Question 19
What are the three states of an alert in Prometheus?

<details>
<summary>Show Answer</summary>

1. **Inactive**: The alert condition is not met
2. **Pending**: Condition is met but `for` duration hasn't elapsed
3. **Firing**: Condition has been true for the `for` duration

</details>

### Question 20
What is the purpose of the `for` clause in an alert rule?

<details>
<summary>Show Answer</summary>

The `for` clause specifies how long the condition must be true before the alert fires.

Benefits:
- Prevents flapping alerts
- Reduces false positives from brief spikes
- Ensures the issue is persistent

```yaml
- alert: HighErrorRate
  expr: error_rate > 0.05
  for: 5m  # Must be true for 5 minutes
```

</details>

### Question 21
What is the difference between silences and inhibition in Alertmanager?

<details>
<summary>Show Answer</summary>

**Silences**:
- Manually created to mute specific alerts
- Time-bounded (start and end time)
- Used for maintenance windows
- Created via UI or API

**Inhibition**:
- Automatic suppression based on rules
- Suppresses alerts when related alerts are firing
- Configured in alertmanager.yml
- Example: Suppress warnings when critical is firing

</details>

### Question 22
What is a recording rule and when should you use one?

<details>
<summary>Show Answer</summary>

Recording rules pre-compute frequently used or expensive PromQL expressions.

Use when:
- Query is computationally expensive
- Query is used in multiple dashboards/alerts
- You need to aggregate across federation
- Query performance is critical

```yaml
- record: job:http_requests:rate5m
  expr: sum by (job) (rate(http_requests_total[5m]))
```

</details>

### Question 23
How does Alertmanager group alerts?

<details>
<summary>Show Answer</summary>

Alertmanager groups alerts based on:
- `group_by` labels in the route configuration
- Alerts with matching group labels are batched together

Configuration:
```yaml
route:
  group_by: ['alertname', 'cluster']
  group_wait: 30s      # Wait before first notification
  group_interval: 5m   # Wait between group updates
  repeat_interval: 4h  # Wait before re-sending
```

</details>

### Question 24
What notification channels does Alertmanager support?

<details>
<summary>Show Answer</summary>

Built-in receivers:
- Email (SMTP)
- Slack
- PagerDuty
- OpsGenie
- VictorOps
- Webhook (for custom integrations)
- Pushover
- WeChat
- Telegram

Custom integrations can be built using the webhook receiver.

</details>

---

## Bonus Questions

### Question 25
What is meta-monitoring?

<details>
<summary>Show Answer</summary>

Meta-monitoring is monitoring the monitoring system itself (Prometheus monitoring Prometheus).

Important metrics to monitor:
- `prometheus_tsdb_head_series` - Number of time series
- `prometheus_engine_query_duration_seconds` - Query performance
- `prometheus_target_scrape_pool_sync_total` - Scrape health
- `up{job="prometheus"}` - Prometheus availability

</details>

### Question 26
How can you scale Prometheus for high availability?

<details>
<summary>Show Answer</summary>

Options for scaling:
1. **Multiple instances**: Run identical Prometheus servers
2. **Federation**: Hierarchical Prometheus setup
3. **Remote storage**: Thanos, Cortex, Mimir for long-term storage
4. **Sharding**: Split targets across multiple Prometheus instances

Note: Prometheus itself doesn't support clustering natively.

</details>

---

## Navigation

- [← Back to Alerting & Dashboarding](./05-alerting-dashboarding.md)
- [Back to Overview](./README.md)
