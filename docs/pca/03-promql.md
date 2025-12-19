# PromQL (28%)

## Overview

PromQL (Prometheus Query Language) is the most heavily weighted domain in the PCA exam. This section covers selecting data, rates, aggregations, binary operators, and histogram queries.

## Data Types

### Instant Vector

A set of time series with a single sample value at a given timestamp.

```promql
# Returns current value for all matching series
http_requests_total
http_requests_total{method="GET"}
```

### Range Vector

A set of time series with a range of samples over time.

```promql
# Returns samples from the last 5 minutes
http_requests_total[5m]
http_requests_total{method="GET"}[1h]
```

### Scalar

A simple numeric floating-point value.

```promql
# Scalar values
42
3.14
```

### String

A simple string value (rarely used).

```promql
"hello world"
```

## Selectors and Matchers

### Label Matchers

```promql
# Exact match
http_requests_total{method="GET"}

# Not equal
http_requests_total{method!="GET"}

# Regex match
http_requests_total{method=~"GET|POST"}

# Regex not match
http_requests_total{method!~"DELETE|PUT"}

# Multiple matchers (AND logic)
http_requests_total{method="GET", status="200"}
```

### Metric Name Matching

```promql
# Match metric name with regex
{__name__=~"http_.*"}

# All metrics with specific label
{job="prometheus"}
```

## Time Ranges and Offsets

### Range Vectors

```promql
# Last 5 minutes
http_requests_total[5m]

# Last 1 hour
http_requests_total[1h]

# Last 1 day
http_requests_total[1d]
```

### Time Units

| Unit | Description |
|------|-------------|
| `ms` | Milliseconds |
| `s` | Seconds |
| `m` | Minutes |
| `h` | Hours |
| `d` | Days |
| `w` | Weeks |
| `y` | Years |

### Offset Modifier

```promql
# Value from 1 hour ago
http_requests_total offset 1h

# Rate from 1 day ago
rate(http_requests_total[5m] offset 1d)

# Compare current to yesterday
http_requests_total - http_requests_total offset 1d
```

### @ Modifier

```promql
# Value at specific timestamp
http_requests_total @ 1609459200

# Value at start of query range
http_requests_total @ start()

# Value at end of query range
http_requests_total @ end()
```

## Rates and Derivatives

### rate()

Calculates per-second average rate of increase for counters.

```promql
# Requests per second over 5 minutes
rate(http_requests_total[5m])

# CPU usage rate
rate(node_cpu_seconds_total{mode="user"}[5m])
```

### irate()

Instant rate - uses last two data points (more volatile).

```promql
# Instant rate (more responsive to spikes)
irate(http_requests_total[5m])
```

### increase()

Total increase over the time range.

```promql
# Total requests in last hour
increase(http_requests_total[1h])

# Total errors in last day
increase(http_errors_total[1d])
```

### delta()

Difference between first and last value (for gauges).

```promql
# Memory change over 1 hour
delta(node_memory_MemAvailable_bytes[1h])
```

### deriv()

Per-second derivative using linear regression (for gauges).

```promql
# Rate of memory change
deriv(node_memory_MemAvailable_bytes[1h])
```

### Rate vs irate vs increase

| Function | Use Case | Behavior |
|----------|----------|----------|
| `rate()` | General rate calculation | Average over range |
| `irate()` | Volatile metrics, graphs | Last two points only |
| `increase()` | Total count over period | Total increase |

## Aggregation Operators

### Basic Aggregations

```promql
# Sum all values
sum(http_requests_total)

# Average
avg(http_requests_total)

# Minimum
min(http_requests_total)

# Maximum
max(http_requests_total)

# Count of series
count(http_requests_total)

# Standard deviation
stddev(http_requests_total)

# Standard variance
stdvar(http_requests_total)
```

### Aggregation with Dimensions

```promql
# Sum by specific label
sum by (method) (rate(http_requests_total[5m]))

# Sum excluding specific label
sum without (instance) (rate(http_requests_total[5m]))

# Multiple dimensions
sum by (method, status) (rate(http_requests_total[5m]))
```

### topk and bottomk

```promql
# Top 5 by request rate
topk(5, rate(http_requests_total[5m]))

# Bottom 3 by memory usage
bottomk(3, node_memory_MemAvailable_bytes)
```

### count_values

```promql
# Count occurrences of each value
count_values("version", build_info)
```

### quantile

```promql
# 90th percentile of values
quantile(0.9, http_request_duration_seconds)
```

## Aggregation Over Time

```promql
# Average over time range
avg_over_time(node_cpu_seconds_total[1h])

# Sum over time range
sum_over_time(http_requests_total[1h])

# Min/Max over time range
min_over_time(temperature_celsius[1d])
max_over_time(temperature_celsius[1d])

# Count samples in range
count_over_time(up[1h])

# Quantile over time
quantile_over_time(0.95, http_request_duration_seconds[1h])

# Standard deviation over time
stddev_over_time(response_time_seconds[1h])

# Last value in range
last_over_time(up[5m])

# Check if present in range
present_over_time(up[5m])
```

## Binary Operators

### Arithmetic Operators

```promql
# Addition
node_memory_MemTotal_bytes + node_memory_SwapTotal_bytes

# Subtraction
node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes

# Multiplication
rate(http_requests_total[5m]) * 100

# Division
node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes

# Modulo
http_requests_total % 100

# Power
2 ^ 10
```

### Comparison Operators

```promql
# Greater than
http_requests_total > 1000

# Less than
node_memory_MemAvailable_bytes < 1073741824

# Equal
up == 1

# Not equal
up != 0

# Greater than or equal
rate(http_requests_total[5m]) >= 10

# Less than or equal
error_rate <= 0.01
```

### Logical Operators

```promql
# AND - returns left side where both sides have matching labels
http_requests_total and on(instance) up

# OR - returns all series from both sides
http_requests_total or http_errors_total

# UNLESS - returns left side where right side doesn't match
http_requests_total unless on(instance) up == 0
```

### Vector Matching

```promql
# One-to-one matching
http_requests_total / on(instance, job) http_requests_duration_sum

# Many-to-one matching
http_requests_total / ignoring(status) group_left http_requests_duration_sum

# One-to-many matching
http_requests_duration_sum * ignoring(status) group_right http_requests_total
```

## Histogram Functions

### histogram_quantile()

Calculate quantiles from histogram buckets.

```promql
# 95th percentile latency
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))

# 50th percentile (median) by endpoint
histogram_quantile(0.50, sum by (le, endpoint) (rate(http_request_duration_seconds_bucket[5m])))

# Multiple quantiles
histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
histogram_quantile(0.50, rate(http_request_duration_seconds_bucket[5m]))
```

### Average from Histogram

```promql
# Average request duration
rate(http_request_duration_seconds_sum[5m]) / rate(http_request_duration_seconds_count[5m])
```

### Histogram Bucket Analysis

```promql
# Requests under 100ms
rate(http_request_duration_seconds_bucket{le="0.1"}[5m])

# Percentage of requests under 500ms
rate(http_request_duration_seconds_bucket{le="0.5"}[5m]) / rate(http_request_duration_seconds_count[5m])
```

## Useful Functions

### Label Functions

```promql
# Add/modify labels
label_replace(up, "host", "$1", "instance", "(.*):.*")

# Join labels
label_join(up, "full_name", "-", "job", "instance")
```

### Math Functions

```promql
# Absolute value
abs(delta(temperature[1h]))

# Ceiling
ceil(http_requests_total / 100)

# Floor
floor(http_requests_total / 100)

# Round
round(http_requests_total / 100, 0.1)

# Clamp values
clamp(cpu_usage, 0, 100)
clamp_min(value, 0)
clamp_max(value, 100)
```

### Time Functions

```promql
# Current timestamp
time()

# Day of month (1-31)
day_of_month()

# Day of week (0-6, Sunday=0)
day_of_week()

# Hour (0-23)
hour()

# Minute (0-59)
minute()

# Month (1-12)
month()

# Year
year()
```

### Sorting

```promql
# Sort ascending
sort(http_requests_total)

# Sort descending
sort_desc(http_requests_total)
```

### Other Functions

```promql
# Check if vector is empty
absent(nonexistent_metric)

# Check if specific series is absent
absent(up{job="missing"})

# Changes in value
changes(process_start_time_seconds[1h])

# Resets (counter resets)
resets(http_requests_total[1h])
```

## Common Query Patterns

### Error Rate

```promql
# Error percentage
sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) * 100
```

### Availability

```promql
# Service availability
avg(up{job="myservice"}) * 100
```

### Saturation

```promql
# CPU saturation
100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)
```

### Request Rate

```promql
# Requests per second by endpoint
sum by (endpoint) (rate(http_requests_total[5m]))
```

### Latency Percentiles

```promql
# P50, P95, P99 latencies
histogram_quantile(0.50, sum by (le) (rate(http_request_duration_seconds_bucket[5m])))
histogram_quantile(0.95, sum by (le) (rate(http_request_duration_seconds_bucket[5m])))
histogram_quantile(0.99, sum by (le) (rate(http_request_duration_seconds_bucket[5m])))
```

## Practice Questions

1. What is the difference between an instant vector and a range vector?
2. How do you calculate the per-second rate of a counter?
3. What is the difference between `rate()` and `irate()`?
4. How do you aggregate metrics by a specific label?
5. Write a query to get the 95th percentile latency from a histogram.
6. How do you compare current values to values from 1 hour ago?
7. What does the `absent()` function do?
8. How do you calculate error rate as a percentage?

## Navigation

- [← Back to Prometheus Fundamentals](./02-prometheus-fundamentals.md)
- [Next: Instrumentation and Exporters →](./04-instrumentation-exporters.md)
