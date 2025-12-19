# PromQL Cheat Sheet

Essential PromQL commands for PCA exam.

---

## Selectors

```promql
# Instant vector
up
http_requests_total

# Label matching
up{job="prometheus"}
up{job="prometheus", instance="localhost:9090"}

# Regex matching
up{job=~"prom.*"}
up{job=~"api|web"}

# Negative matching
up{job!="prometheus"}
up{job!~"test.*"}

# Range vector
http_requests_total[5m]
http_requests_total{job="api"}[1h]
```

---

## Operators

```promql
# Arithmetic
http_requests_total + 10
http_requests_total * 2
http_requests_total / http_requests_total

# Comparison (filter)
http_requests_total > 100
http_requests_total >= 100
http_requests_total == 100

# Comparison (bool)
http_requests_total > bool 100

# Logical
up == 1 and on(job) http_requests_total > 0
up == 1 or http_requests_total > 0
up == 1 unless on(job) http_requests_total > 0
```

---

## Aggregation

```promql
# Sum
sum(http_requests_total)
sum by (job) (http_requests_total)
sum without (instance) (http_requests_total)

# Average
avg(http_requests_total)
avg by (job) (http_requests_total)

# Count
count(up)
count by (job) (up)

# Min/Max
min(http_requests_total)
max by (job) (http_requests_total)

# Top/Bottom K
topk(5, http_requests_total)
bottomk(3, http_requests_total)

# Quantile
quantile(0.95, http_requests_total)

# Standard deviation
stddev(http_requests_total)
```

---

## Functions

```promql
# Rate (per-second average)
rate(http_requests_total[5m])

# Irate (instant rate)
irate(http_requests_total[5m])

# Increase (total increase)
increase(http_requests_total[1h])

# Delta (difference)
delta(temperature[1h])

# Histogram quantile
histogram_quantile(0.99, rate(http_request_duration_bucket[5m]))
histogram_quantile(0.95, sum by (le) (rate(http_request_duration_bucket[5m])))

# Absent (alert when missing)
absent(up{job="api"})

# Changes
changes(process_start_time_seconds[1h])

# Resets
resets(http_requests_total[1h])

# Time functions
time()
timestamp(up)
day_of_week()
hour()
```

---

## Common Patterns

```promql
# Error rate
sum(rate(http_requests_total{status=~"5.."}[5m])) 
/ 
sum(rate(http_requests_total[5m]))

# CPU utilization
100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)

# Memory utilization
100 * (1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)

# Disk utilization
100 - (node_filesystem_avail_bytes / node_filesystem_size_bytes * 100)

# Request latency P99
histogram_quantile(0.99, sum by (le) (rate(http_request_duration_seconds_bucket[5m])))

# Saturation (queue depth)
avg_over_time(node_load1[5m]) / count(node_cpu_seconds_total{mode="idle"})

# Compare to past
rate(http_requests_total[5m]) / rate(http_requests_total[5m] offset 1d)
```

---

## Subqueries

```promql
# Max rate over last hour, sampled every 5m
max_over_time(rate(http_requests_total[5m])[1h:5m])

# Average of rate over time
avg_over_time(rate(http_requests_total[5m])[1h:])
```

---

## Label Functions

```promql
# Label replace
label_replace(up, "host", "$1", "instance", "(.*):.*")

# Label join
label_join(up, "full_name", "-", "job", "instance")
```

---

[← Back to Home](../README.md)
