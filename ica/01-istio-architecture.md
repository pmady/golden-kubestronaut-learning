# Istio Architecture

Comprehensive guide to Istio service mesh architecture for ICA certification.

---

## Overview

Istio is an open-source service mesh that provides:

- **Traffic Management** - Control traffic flow between services
- **Security** - Secure service-to-service communication
- **Observability** - Monitor and trace requests
- **Policy Enforcement** - Apply policies consistently

---

## Architecture Components

### Control Plane (istiod)

The control plane is consolidated into a single binary called **istiod**:

- **Pilot** - Service discovery, traffic management configuration
- **Citadel** - Certificate management, identity
- **Galley** - Configuration validation and distribution

### Data Plane

- **Envoy Proxies** - Sidecar proxies deployed with each service
- Intercept all network traffic
- Apply policies and collect telemetry

---

## Traffic Flow

```
┌─────────────────────────────────────────────────────────┐
│                      Control Plane                       │
│                        (istiod)                          │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                 │
│  │  Pilot  │  │ Citadel │  │ Galley  │                 │
│  └─────────┘  └─────────┘  └─────────┘                 │
└─────────────────────────────────────────────────────────┘
                           │
                           │ Configuration
                           ▼
┌─────────────────────────────────────────────────────────┐
│                       Data Plane                         │
│  ┌──────────────┐          ┌──────────────┐            │
│  │   Service A  │          │   Service B  │            │
│  │  ┌────────┐  │  mTLS    │  ┌────────┐  │            │
│  │  │ Envoy  │◄─┼──────────┼─►│ Envoy  │  │            │
│  │  └────────┘  │          │  └────────┘  │            │
│  └──────────────┘          └──────────────┘            │
└─────────────────────────────────────────────────────────┘
```

---

## Installation

### Using istioctl

```bash
# Download Istio
curl -L https://istio.io/downloadIstio | sh -
cd istio-*
export PATH=$PWD/bin:$PATH

# Install with default profile
istioctl install --set profile=default -y

# Install with demo profile (includes more features)
istioctl install --set profile=demo -y

# Verify installation
istioctl verify-install
```

### Installation Profiles

| Profile | Description |
|---------|-------------|
| default | Production deployment |
| demo | Full features for learning |
| minimal | Minimal control plane |
| remote | Remote cluster in multicluster |
| empty | Nothing installed |

---

## Sidecar Injection

### Automatic Injection

```bash
# Label namespace for automatic injection
kubectl label namespace default istio-injection=enabled

# Verify label
kubectl get namespace -L istio-injection
```

### Manual Injection

```bash
# Inject sidecar manually
istioctl kube-inject -f deployment.yaml | kubectl apply -f -
```

---

## Core Resources

### VirtualService

Controls traffic routing:

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: reviews-route
spec:
  hosts:
  - reviews
  http:
  - match:
    - headers:
        end-user:
          exact: jason
    route:
    - destination:
        host: reviews
        subset: v2
  - route:
    - destination:
        host: reviews
        subset: v1
```

### DestinationRule

Defines policies for traffic after routing:

```yaml
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: reviews-destination
spec:
  host: reviews
  trafficPolicy:
    connectionPool:
      tcp:
        maxConnections: 100
  subsets:
  - name: v1
    labels:
      version: v1
  - name: v2
    labels:
      version: v2
```

### Gateway

Manages inbound/outbound traffic:

```yaml
apiVersion: networking.istio.io/v1beta1
kind: Gateway
metadata:
  name: my-gateway
spec:
  selector:
    istio: ingressgateway
  servers:
  - port:
      number: 80
      name: http
      protocol: HTTP
    hosts:
    - "*.example.com"
```

### ServiceEntry

Adds external services to mesh:

```yaml
apiVersion: networking.istio.io/v1beta1
kind: ServiceEntry
metadata:
  name: external-api
spec:
  hosts:
  - api.external.com
  ports:
  - number: 443
    name: https
    protocol: HTTPS
  resolution: DNS
  location: MESH_EXTERNAL
```

---

## Security

### PeerAuthentication

```yaml
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
  namespace: istio-system
spec:
  mtls:
    mode: STRICT
```

### AuthorizationPolicy

```yaml
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: allow-read
  namespace: default
spec:
  selector:
    matchLabels:
      app: myapp
  action: ALLOW
  rules:
  - from:
    - source:
        principals: ["cluster.local/ns/default/sa/frontend"]
    to:
    - operation:
        methods: ["GET"]
```

---

## Observability

### Kiali Dashboard

```bash
# Install Kiali
kubectl apply -f samples/addons/kiali.yaml

# Access dashboard
istioctl dashboard kiali
```

### Jaeger Tracing

```bash
# Install Jaeger
kubectl apply -f samples/addons/jaeger.yaml

# Access dashboard
istioctl dashboard jaeger
```

### Prometheus & Grafana

```bash
# Install addons
kubectl apply -f samples/addons/prometheus.yaml
kubectl apply -f samples/addons/grafana.yaml

# Access dashboards
istioctl dashboard prometheus
istioctl dashboard grafana
```

---

## Useful Commands

```bash
# Check proxy status
istioctl proxy-status

# Analyze configuration
istioctl analyze

# Debug proxy
istioctl proxy-config clusters <pod-name>
istioctl proxy-config routes <pod-name>
istioctl proxy-config listeners <pod-name>

# View mesh configuration
istioctl manifest generate --set profile=demo
```

---

[← Back to ICA Overview](./README.md)
