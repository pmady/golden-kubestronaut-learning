# ICA Sample Practice Questions

## Practice Resources

- [Istio Documentation](https://istio.io/latest/docs/)
- [Istio by Example](https://istiobyexample.dev/)
- [Killercoda Istio Scenarios](https://killercoda.com/)

---

## Traffic Management (40%)

### Question 1
Create a VirtualService that routes 80% of traffic to v1 and 20% to v2 of the reviews service.

<details>
<summary>Show Solution</summary>

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: reviews
spec:
  hosts:
  - reviews
  http:
  - route:
    - destination:
        host: reviews
        subset: v1
      weight: 80
    - destination:
        host: reviews
        subset: v2
      weight: 20
```

</details>

### Question 2
Create a DestinationRule that defines subsets v1 and v2 based on version labels.

<details>
<summary>Show Solution</summary>

```yaml
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: reviews
spec:
  host: reviews
  subsets:
  - name: v1
    labels:
      version: v1
  - name: v2
    labels:
      version: v2
```

</details>

### Question 3
Create an Istio Gateway for incoming HTTPS traffic on port 443.

<details>
<summary>Show Solution</summary>

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
      number: 443
      name: https
      protocol: HTTPS
    tls:
      mode: SIMPLE
      credentialName: my-tls-secret
    hosts:
    - "*.example.com"
```

</details>

### Question 4
Configure request timeout of 10 seconds for the ratings service.

<details>
<summary>Show Solution</summary>

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: ratings
spec:
  hosts:
  - ratings
  http:
  - timeout: 10s
    route:
    - destination:
        host: ratings
```

</details>

---

## Securing Workloads (20%)

### Question 5
Enable strict mTLS for the entire mesh.

<details>
<summary>Show Solution</summary>

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

</details>

### Question 6
Create an AuthorizationPolicy that only allows GET requests from the frontend service.

<details>
<summary>Show Solution</summary>

```yaml
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: allow-frontend-get
spec:
  selector:
    matchLabels:
      app: backend
  action: ALLOW
  rules:
  - from:
    - source:
        principals: ["cluster.local/ns/default/sa/frontend"]
    to:
    - operation:
        methods: ["GET"]
```

</details>

### Question 7
Configure JWT authentication for a service.

<details>
<summary>Show Solution</summary>

```yaml
apiVersion: security.istio.io/v1beta1
kind: RequestAuthentication
metadata:
  name: jwt-auth
spec:
  selector:
    matchLabels:
      app: httpbin
  jwtRules:
  - issuer: "https://example.com"
    jwksUri: "https://example.com/.well-known/jwks.json"
```

</details>

---

## Resiliency and Fault Injection (10%)

### Question 8
Inject a 5-second delay for 50% of requests to the ratings service.

<details>
<summary>Show Solution</summary>

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: ratings
spec:
  hosts:
  - ratings
  http:
  - fault:
      delay:
        percentage:
          value: 50
        fixedDelay: 5s
    route:
    - destination:
        host: ratings
```

</details>

### Question 9
Configure circuit breaker with max 100 connections and 1000 pending requests.

<details>
<summary>Show Solution</summary>

```yaml
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: reviews
spec:
  host: reviews
  trafficPolicy:
    connectionPool:
      tcp:
        maxConnections: 100
      http:
        h2UpgradePolicy: UPGRADE
        http1MaxPendingRequests: 1000
    outlierDetection:
      consecutive5xxErrors: 5
      interval: 30s
      baseEjectionTime: 30s
```

</details>

### Question 10
Inject HTTP 503 errors for 10% of requests.

<details>
<summary>Show Solution</summary>

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: ratings
spec:
  hosts:
  - ratings
  http:
  - fault:
      abort:
        percentage:
          value: 10
        httpStatus: 503
    route:
    - destination:
        host: ratings
```

</details>

---

## Observability (10%)

### Question 11
What are the three pillars of observability in Istio?

<details>
<summary>Show Solution</summary>

1. **Metrics** - Collected by Prometheus, visualized in Grafana
2. **Distributed Tracing** - Using Jaeger or Zipkin
3. **Access Logs** - Envoy access logs for debugging

</details>

### Question 12
How do you enable access logging in Istio?

<details>
<summary>Show Solution</summary>

```yaml
apiVersion: telemetry.istio.io/v1alpha1
kind: Telemetry
metadata:
  name: mesh-default
  namespace: istio-system
spec:
  accessLogging:
  - providers:
    - name: envoy
```

Or via IstioOperator:
```yaml
spec:
  meshConfig:
    accessLogFile: /dev/stdout
```

</details>

---

## Installation & Configuration (7%)

### Question 13
Install Istio with the demo profile using istioctl.

<details>
<summary>Show Solution</summary>

```bash
istioctl install --set profile=demo -y
```

</details>

### Question 14
Enable automatic sidecar injection for a namespace.

<details>
<summary>Show Solution</summary>

```bash
kubectl label namespace default istio-injection=enabled
```

</details>

---

## Exam Tips

1. **Know VirtualService and DestinationRule** - These are heavily tested
2. **Understand mTLS modes** - STRICT, PERMISSIVE, DISABLE
3. **Practice traffic management** - Routing, splitting, mirroring
4. **Know AuthorizationPolicy** - ALLOW, DENY, CUSTOM actions
5. **Understand fault injection** - Delays and aborts

---

[← Back to ICA Overview](./README.md)
