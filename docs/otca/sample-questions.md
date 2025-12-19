# OTCA Sample Practice Questions

## Practice Resources

- [OpenTelemetry Documentation](https://opentelemetry.io/docs/)
- [OpenTelemetry Demo](https://github.com/open-telemetry/opentelemetry-demo)

---

## Observability Concepts (16%)

### Question 1
What are the three pillars of observability in OpenTelemetry?

<details>
<summary>Show Solution</summary>

1. **Traces** - Distributed tracing showing request flow
2. **Metrics** - Numerical measurements over time
3. **Logs** - Timestamped text records of events

OpenTelemetry also supports **Baggage** for context propagation.

</details>

### Question 2
What is the difference between a Trace and a Span?

<details>
<summary>Show Solution</summary>

- **Trace** - Complete journey of a request through a distributed system, identified by a unique trace ID
- **Span** - Single operation within a trace, with start time, duration, and attributes

A trace contains multiple spans in a parent-child hierarchy:
```
Trace (trace_id: abc123)
├── Span A (root span)
│   ├── Span B (child of A)
│   └── Span C (child of A)
│       └── Span D (child of C)
```

</details>

### Question 3
What is context propagation?

<details>
<summary>Show Solution</summary>

Context propagation passes trace context between services to correlate spans across service boundaries.

Components:
- **Context** - Carries trace ID, span ID, trace flags
- **Propagators** - Inject/extract context from carriers (HTTP headers)
- **W3C Trace Context** - Standard format for propagation

Example headers:
```
traceparent: 00-<trace-id>-<span-id>-<flags>
tracestate: vendor1=value1,vendor2=value2
```

</details>

---

## OpenTelemetry API (24%)

### Question 4
How do you create a span manually?

<details>
<summary>Show Solution</summary>

```python
from opentelemetry import trace

tracer = trace.get_tracer(__name__)

with tracer.start_as_current_span("my-operation") as span:
    span.set_attribute("key", "value")
    span.add_event("processing started")
    # Do work
    span.set_status(trace.Status(trace.StatusCode.OK))
```

```java
Tracer tracer = GlobalOpenTelemetry.getTracer("my-app");
Span span = tracer.spanBuilder("my-operation").startSpan();
try (Scope scope = span.makeCurrent()) {
    span.setAttribute("key", "value");
    // Do work
} finally {
    span.end();
}
```

</details>

### Question 5
How do you record metrics with OpenTelemetry?

<details>
<summary>Show Solution</summary>

```python
from opentelemetry import metrics

meter = metrics.get_meter(__name__)

# Counter - only increases
counter = meter.create_counter("requests_total")
counter.add(1, {"method": "GET"})

# UpDownCounter - can increase or decrease
gauge = meter.create_up_down_counter("active_connections")
gauge.add(1)
gauge.add(-1)

# Histogram - distribution of values
histogram = meter.create_histogram("request_duration")
histogram.record(0.5, {"endpoint": "/api"})
```

</details>

### Question 6
What are span attributes vs span events?

<details>
<summary>Show Solution</summary>

**Attributes** - Key-value pairs describing the span
- Set once, describe the operation
- Examples: http.method, http.url, db.system

**Events** - Timestamped logs within a span
- Can have multiple events per span
- Examples: "cache miss", "retry attempt"

```python
span.set_attribute("http.method", "GET")
span.add_event("cache_miss", {"key": "user:123"})
```

</details>

---

## OpenTelemetry SDK (16%)

### Question 7
What are the main SDK components?

<details>
<summary>Show Solution</summary>

**Trace SDK:**
- TracerProvider - Creates tracers
- SpanProcessor - Processes spans (batch, simple)
- SpanExporter - Exports spans to backends

**Metrics SDK:**
- MeterProvider - Creates meters
- MetricReader - Reads metrics periodically
- MetricExporter - Exports metrics

**Common:**
- Resource - Describes the entity producing telemetry
- Sampler - Decides which traces to sample

</details>

### Question 8
Configure the OpenTelemetry SDK with OTLP exporter.

<details>
<summary>Show Solution</summary>

```python
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.resources import Resource

resource = Resource.create({"service.name": "my-service"})

provider = TracerProvider(resource=resource)
processor = BatchSpanProcessor(OTLPSpanExporter(endpoint="localhost:4317"))
provider.add_span_processor(processor)
trace.set_tracer_provider(provider)
```

</details>

### Question 9
What is sampling and what are the sampling strategies?

<details>
<summary>Show Solution</summary>

**Sampling** decides which traces to record to reduce overhead.

Strategies:
- **AlwaysOn** - Record all traces
- **AlwaysOff** - Record no traces
- **TraceIdRatioBased** - Sample based on trace ID ratio
- **ParentBased** - Follow parent's sampling decision

```python
from opentelemetry.sdk.trace.sampling import TraceIdRatioBased

sampler = TraceIdRatioBased(0.1)  # Sample 10%
provider = TracerProvider(sampler=sampler)
```

</details>

---

## OpenTelemetry Collector (24%)

### Question 10
What are the main components of the OTel Collector?

<details>
<summary>Show Solution</summary>

1. **Receivers** - Accept data (OTLP, Jaeger, Prometheus)
2. **Processors** - Transform data (batch, filter, attributes)
3. **Exporters** - Send data to backends (OTLP, Jaeger, Prometheus)
4. **Extensions** - Additional capabilities (health check, pprof)
5. **Connectors** - Connect pipelines (count spans to metrics)

Pipeline: Receivers → Processors → Exporters

</details>

### Question 11
Write a basic Collector configuration.

<details>
<summary>Show Solution</summary>

```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318

processors:
  batch:
    timeout: 10s
    send_batch_size: 1000
  memory_limiter:
    limit_mib: 512

exporters:
  otlp:
    endpoint: jaeger:4317
    tls:
      insecure: true
  prometheus:
    endpoint: 0.0.0.0:8889

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [memory_limiter, batch]
      exporters: [otlp]
    metrics:
      receivers: [otlp]
      processors: [batch]
      exporters: [prometheus]
```

</details>

### Question 12
What are common Collector deployment patterns?

<details>
<summary>Show Solution</summary>

1. **No Collector (Direct)** - Apps export directly to backend
2. **Agent** - Collector as sidecar/daemonset per node
3. **Gateway** - Centralized Collector cluster
4. **Agent + Gateway** - Two-tier architecture

Best practices:
- Use Agent for collection, Gateway for processing
- Enable memory_limiter processor
- Use batch processor for efficiency

</details>

---

## Instrumentation (20%)

### Question 13
What is the difference between auto and manual instrumentation?

<details>
<summary>Show Solution</summary>

**Auto-instrumentation:**
- Automatic, no code changes
- Uses agents or libraries
- Covers common frameworks
- Less control

**Manual instrumentation:**
- Requires code changes
- Full control over spans/metrics
- Custom business logic
- More effort

Best practice: Use auto-instrumentation as base, add manual for business logic.

</details>

### Question 14
How do you enable auto-instrumentation in Python?

<details>
<summary>Show Solution</summary>

```bash
# Install
pip install opentelemetry-distro opentelemetry-exporter-otlp
opentelemetry-bootstrap -a install

# Run with auto-instrumentation
opentelemetry-instrument \
  --service_name my-service \
  --traces_exporter otlp \
  --metrics_exporter otlp \
  --exporter_otlp_endpoint http://localhost:4317 \
  python app.py
```

Or with environment variables:
```bash
export OTEL_SERVICE_NAME=my-service
export OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317
opentelemetry-instrument python app.py
```

</details>

### Question 15
What semantic conventions should you follow?

<details>
<summary>Show Solution</summary>

Semantic conventions standardize attribute names:

**HTTP:**
- `http.method` - GET, POST
- `http.url` - Full URL
- `http.status_code` - 200, 404

**Database:**
- `db.system` - mysql, postgresql
- `db.statement` - SQL query
- `db.name` - Database name

**Service:**
- `service.name` - Service identifier
- `service.version` - Version string

Following conventions enables better correlation across tools.

</details>

---

## Exam Tips

1. **Know the three signals** - Traces, Metrics, Logs
2. **Understand Collector architecture** - Receivers, Processors, Exporters
3. **Know SDK components** - Providers, Processors, Exporters
4. **Practice configuration** - Collector YAML, SDK setup
5. **Understand context propagation** - W3C Trace Context

---

[← Back to OTCA Overview](./README.md)
