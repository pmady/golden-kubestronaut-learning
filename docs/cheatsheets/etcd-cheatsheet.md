# etcd Cheat Sheet

Essential etcd commands for CKA exam.

---

## Environment Setup

```bash
# Set etcd API version
export ETCDCTL_API=3

# Common certificate paths
export ETCD_CACERT=/etc/kubernetes/pki/etcd/ca.crt
export ETCD_CERT=/etc/kubernetes/pki/etcd/server.crt
export ETCD_KEY=/etc/kubernetes/pki/etcd/server.key
```

---

## Health Check

```bash
# Check endpoint health
etcdctl endpoint health \
  --endpoints=https://127.0.0.1:2379 \
  --cacert=$ETCD_CACERT \
  --cert=$ETCD_CERT \
  --key=$ETCD_KEY

# Check endpoint status
etcdctl endpoint status \
  --endpoints=https://127.0.0.1:2379 \
  --cacert=$ETCD_CACERT \
  --cert=$ETCD_CERT \
  --key=$ETCD_KEY \
  --write-out=table

# Member list
etcdctl member list \
  --endpoints=https://127.0.0.1:2379 \
  --cacert=$ETCD_CACERT \
  --cert=$ETCD_CERT \
  --key=$ETCD_KEY \
  --write-out=table
```

---

## Backup

```bash
# Create snapshot
etcdctl snapshot save /backup/etcd-snapshot.db \
  --endpoints=https://127.0.0.1:2379 \
  --cacert=$ETCD_CACERT \
  --cert=$ETCD_CERT \
  --key=$ETCD_KEY

# Verify snapshot
etcdctl snapshot status /backup/etcd-snapshot.db \
  --write-out=table
```

---

## Restore

```bash
# Stop kube-apiserver (move manifest)
sudo mv /etc/kubernetes/manifests/kube-apiserver.yaml /tmp/

# Restore snapshot
etcdctl snapshot restore /backup/etcd-snapshot.db \
  --data-dir=/var/lib/etcd-restored

# Update etcd manifest to use new data-dir
sudo sed -i 's|/var/lib/etcd|/var/lib/etcd-restored|g' \
  /etc/kubernetes/manifests/etcd.yaml

# Also update hostPath volume
# Edit /etc/kubernetes/manifests/etcd.yaml:
# - hostPath:
#     path: /var/lib/etcd-restored

# Restore kube-apiserver
sudo mv /tmp/kube-apiserver.yaml /etc/kubernetes/manifests/

# Wait for etcd to restart
watch crictl ps | grep etcd
```

---

## Key Operations

```bash
# Get all keys
etcdctl get / --prefix --keys-only \
  --endpoints=https://127.0.0.1:2379 \
  --cacert=$ETCD_CACERT \
  --cert=$ETCD_CERT \
  --key=$ETCD_KEY

# Get specific key
etcdctl get /registry/secrets/default/mysecret \
  --endpoints=https://127.0.0.1:2379 \
  --cacert=$ETCD_CACERT \
  --cert=$ETCD_CERT \
  --key=$ETCD_KEY

# Count keys
etcdctl get / --prefix --keys-only \
  --endpoints=https://127.0.0.1:2379 \
  --cacert=$ETCD_CACERT \
  --cert=$ETCD_CERT \
  --key=$ETCD_KEY | wc -l
```

---

## Cluster Operations

```bash
# Add member
etcdctl member add new-member \
  --peer-urls=https://new-member:2380 \
  --endpoints=https://127.0.0.1:2379 \
  --cacert=$ETCD_CACERT \
  --cert=$ETCD_CERT \
  --key=$ETCD_KEY

# Remove member
etcdctl member remove <member-id> \
  --endpoints=https://127.0.0.1:2379 \
  --cacert=$ETCD_CACERT \
  --cert=$ETCD_CERT \
  --key=$ETCD_KEY
```

---

## Quick Backup Script

```bash
#!/bin/bash
BACKUP_DIR=/backup
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

etcdctl snapshot save ${BACKUP_DIR}/etcd-${TIMESTAMP}.db \
  --endpoints=https://127.0.0.1:2379 \
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \
  --cert=/etc/kubernetes/pki/etcd/server.crt \
  --key=/etc/kubernetes/pki/etcd/server.key

# Keep only last 5 backups
ls -t ${BACKUP_DIR}/etcd-*.db | tail -n +6 | xargs rm -f
```

---

[← Back to Home](../README.md)
