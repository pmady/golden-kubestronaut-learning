# OpenTelemetry Fundamentals

Comprehensive guide to OpenTelemetry for OTCA certification.

---

## Overview

OpenTelemetry is a collection of tools, APIs, and SDKs for:

- **Traces** - Distributed tracing across services
- **Metrics** - Numerical measurements over time
- **Logs** - Structured log data (emerging)

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Application                           │
│  ┌─────────────────────────────────────────────────┐   │
│  │              OpenTelemetry SDK                   │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐        │   │
│  │  │ Tracer  │  │  Meter  │  │ Logger  │        │   │
│  │  └─────────┘  └─────────┘  └─────────┘        │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼ OTLP
┌─────────────────────────────────────────────────────────┐
│                 OpenTelemetry Collector                  │
│  ┌─────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │Receivers│→ │ Processors  │→ │  Exporters  │        │
│  └─────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         ▼                 ▼                 ▼
    ┌─────────┐      ┌─────────┐      ┌─────────┐
    │  Jaeger │      │Prometheus│      │  Zipkin │
    └─────────┘      └─────────┘      └─────────┘
```

---

## Key Concepts

### Traces

- **Trace** - End-to-end request flow
- **Span** - Single operation within a trace
- **SpanContext** - Trace ID, Span ID, flags
- **Attributes** - Key-value pairs on spans

### Metrics

- **Counter** - Monotonically increasing value
- **Gauge** - Current value at a point in time
- **Histogram** - Distribution of values

### Context Propagation

- **W3C Trace Context** - Standard propagation format
- **Baggage** - User-defined key-value pairs

---

## OpenTelemetry Collector

### Configuration

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
    timeout: 1s
    send_batch_size: 1024
  memory_limiter:
    check_interval: 1s
    limit_mib: 1000

exporters:
  logging:
    loglevel: debug
  jaeger:
    endpoint: jaeger:14250
    tls:
      insecure: true
  prometheus:
    endpoint: "0.0.0.0:8889"

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [memory_limiter, batch]
      exporters: [jaeger, logging]
    metrics:
      receivers: [otlp]
      processors: [batch]
      exporters: [prometheus]
```

### Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: otel-collector
spec:
  replicas: 1
  selector:
    matchLabels:
      app: otel-collector
  template:
    metadata:
      labels:
        app: otel-collector
    spec:
      containers:
      - name: collector
        image: otel/opentelemetry-collector:latest
        ports:
        - containerPort: 4317  # OTLP gRPC
        - containerPort: 4318  # OTLP HTTP
        - containerPort: 8889  # Prometheus metrics
        volumeMounts:
        - name: config
          mountPath: /etc/otel
      volumes:
      - name: config
        configMap:
          name: otel-collector-config
```

---

## Instrumentation

### Python

```python
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter

# Setup
trace.set_tracer_provider(TracerProvider())
tracer = trace.get_tracer(__name__)

# Export to collector
otlp_exporter = OTLPSpanExporter(endpoint="localhost:4317", insecure=True)
span_processor = BatchSpanProcessor(otlp_exporter)
trace.get_tracer_provider().add_span_processor(span_processor)

# Create spans
with tracer.start_as_current_span("main") as span:
    span.set_attribute("user.id", "12345")
    with tracer.start_as_current_span("child"):
        # Do work
        pass
```

### Go

```go
package main

import (
    "context"
    "go.opentelemetry.io/otel"
    "go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracegrpc"
    "go.opentelemetry.io/otel/sdk/trace"
)

func main() {
    ctx := context.Background()
    
    // Create exporter
    exporter, _ := otlptracegrpc.New(ctx,
        otlptracegrpc.WithEndpoint("localhost:4317"),
        otlptracegrpc.WithInsecure(),
    )
    
    // Create provider
    tp := trace.NewTracerProvider(
        trace.WithBatcher(exporter),
    )
    otel.SetTracerProvider(tp)
    
    // Create tracer
    tracer := otel.Tracer("myapp")
    
    // Create span
    ctx, span := tracer.Start(ctx, "operation")
    defer span.End()
}
```

### Auto-instrumentation

```bash
# Python
pip install opentelemetry-distro opentelemetry-exporter-otlp
opentelemetry-bootstrap -a install
opentelemetry-instrument python myapp.py

# Java
java -javaagent:opentelemetry-javaagent.jar \
  -Dotel.service.name=myapp \
  -Dotel.exporter.otlp.endpoint=http://localhost:4317 \
  -jar myapp.jar
```

---

## Semantic Conventions

Standard attribute names:

```yaml
# Service
service.name: myapp
service.version: 1.0.0

# HTTP
http.method: GET
http.url: https://example.com/api
http.status_code: 200

# Database
db.system: postgresql
db.name: mydb
db.statement: SELECT * FROM users

# Messaging
messaging.system: kafka
messaging.destination: my-topic
```

---

## Best Practices

1. **Use semantic conventions** for consistent attributes
2. **Sample appropriately** to manage data volume
3. **Propagate context** across service boundaries
4. **Add meaningful attributes** for debugging
5. **Use batch processors** for efficiency

---

[← Back to OTCA Overview](./README.md)
