# Storage (10%)

This domain covers Kubernetes storage concepts including volumes, persistent volumes, and storage classes.

## Volumes

### emptyDir

Temporary storage that exists for the Pod's lifetime.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-with-emptydir
spec:
  containers:
  - name: app
    image: nginx
    volumeMounts:
    - name: cache
      mountPath: /cache
  volumes:
  - name: cache
    emptyDir: {}
```

### Memory-backed emptyDir

```yaml
volumes:
- name: memory-cache
  emptyDir:
    medium: Memory
    sizeLimit: 100Mi
```

### hostPath

Mount a file or directory from the host node.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-with-hostpath
spec:
  containers:
  - name: app
    image: nginx
    volumeMounts:
    - name: data
      mountPath: /data
  volumes:
  - name: data
    hostPath:
      path: /data
      type: DirectoryOrCreate
```

### hostPath Types

| Type | Description |
|------|-------------|
| `""` | No checks (default) |
| `DirectoryOrCreate` | Create directory if not exists |
| `Directory` | Directory must exist |
| `FileOrCreate` | Create file if not exists |
| `File` | File must exist |
| `Socket` | Unix socket must exist |

## Persistent Volumes (PV)

### PersistentVolume

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv-volume
spec:
  capacity:
    storage: 10Gi
  accessModes:
  - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: manual
  hostPath:
    path: /mnt/data
```

### Access Modes

| Mode | Abbreviation | Description |
|------|--------------|-------------|
| `ReadWriteOnce` | RWO | Single node read-write |
| `ReadOnlyMany` | ROX | Multiple nodes read-only |
| `ReadWriteMany` | RWX | Multiple nodes read-write |
| `ReadWriteOncePod` | RWOP | Single pod read-write |

### Reclaim Policies

| Policy | Description |
|--------|-------------|
| `Retain` | Manual reclamation |
| `Delete` | Delete volume when PVC is deleted |
| `Recycle` | Basic scrub (deprecated) |

## PersistentVolumeClaim (PVC)

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pvc-claim
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi
  storageClassName: manual
```

### Using PVC in Pod

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-with-pvc
spec:
  containers:
  - name: app
    image: nginx
    volumeMounts:
    - name: data
      mountPath: /data
  volumes:
  - name: data
    persistentVolumeClaim:
      claimName: pvc-claim
```

## Storage Classes

### StorageClass

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: fast
provisioner: kubernetes.io/aws-ebs
parameters:
  type: gp3
  iopsPerGB: "10"
reclaimPolicy: Delete
allowVolumeExpansion: true
volumeBindingMode: WaitForFirstConsumer
```

### Volume Binding Modes

| Mode | Description |
|------|-------------|
| `Immediate` | Bind PV immediately when PVC is created |
| `WaitForFirstConsumer` | Delay binding until Pod is scheduled |

### Dynamic Provisioning

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: dynamic-pvc
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
  storageClassName: fast  # Uses StorageClass for dynamic provisioning
```

## ConfigMap as Volume

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-with-configmap
spec:
  containers:
  - name: app
    image: nginx
    volumeMounts:
    - name: config
      mountPath: /etc/config
  volumes:
  - name: config
    configMap:
      name: my-config
      items:
      - key: config.json
        path: app-config.json
```

## Secret as Volume

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-with-secret
spec:
  containers:
  - name: app
    image: nginx
    volumeMounts:
    - name: secret
      mountPath: /etc/secrets
      readOnly: true
  volumes:
  - name: secret
    secret:
      secretName: my-secret
      defaultMode: 0400
```

## Projected Volumes

Combine multiple volume sources into a single directory.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-with-projected
spec:
  containers:
  - name: app
    image: nginx
    volumeMounts:
    - name: all-in-one
      mountPath: /projected-volume
  volumes:
  - name: all-in-one
    projected:
      sources:
      - secret:
          name: my-secret
      - configMap:
          name: my-config
      - downwardAPI:
          items:
          - path: labels
            fieldRef:
              fieldPath: metadata.labels
```

## Volume Expansion

```yaml
# StorageClass must have allowVolumeExpansion: true
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: expandable-pvc
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 20Gi  # Increase from original size
  storageClassName: fast
```

## Storage Commands

```bash
# List PersistentVolumes
kubectl get pv

# List PersistentVolumeClaims
kubectl get pvc

# List StorageClasses
kubectl get sc

# Describe PV
kubectl describe pv pv-volume

# Delete PVC
kubectl delete pvc pvc-claim

# Patch PVC to expand
kubectl patch pvc pvc-claim -p '{"spec":{"resources":{"requests":{"storage":"20Gi"}}}}'
```

## Volume Snapshots

### VolumeSnapshotClass

```yaml
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshotClass
metadata:
  name: csi-snapclass
driver: ebs.csi.aws.com
deletionPolicy: Delete
```

### VolumeSnapshot

```yaml
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshot
metadata:
  name: my-snapshot
spec:
  volumeSnapshotClassName: csi-snapclass
  source:
    persistentVolumeClaimName: my-pvc
```

### Restore from Snapshot

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: restored-pvc
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
  dataSource:
    name: my-snapshot
    kind: VolumeSnapshot
    apiGroup: snapshot.storage.k8s.io
```

## Key Concepts to Remember

1. **PV** - Cluster-level storage resource
2. **PVC** - Request for storage by a user
3. **StorageClass** - Dynamic provisioning template
4. **Access Modes** - RWO, ROX, RWX, RWOP
5. **Reclaim Policies** - Retain, Delete, Recycle

## Practice Questions

1. What is the difference between PV and PVC?
2. How do you create a PVC that uses dynamic provisioning?
3. What access mode allows multiple nodes to read and write?
4. How do you expand a PVC?
5. What is the purpose of volumeBindingMode: WaitForFirstConsumer?

---

[← Previous: Services & Networking](./03-services-networking.md) | [Back to CKA Overview](./README.md) | [Next: Troubleshooting →](./05-troubleshooting.md)
