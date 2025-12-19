# LFCS Sample Practice Questions

## Practice Resources

- [Linux Journey](https://linuxjourney.com/)
- [OverTheWire Bandit](https://overthewire.org/wargames/bandit/)
- [killer.sh LFCS Simulator](https://killer.sh/)

---

## Section 1: Essential Commands (25%)

### Question 1.1
Find all files in /var larger than 50MB and list them with their sizes.

<details>
<summary>Show Solution</summary>

```bash
find /var -type f -size +50M -exec ls -lh {} \;
# Or
find /var -type f -size +50M -ls
```

</details>

### Question 1.2
Replace all occurrences of "error" with "warning" in /var/log/app.log without creating a backup.

<details>
<summary>Show Solution</summary>

```bash
sed -i 's/error/warning/g' /var/log/app.log
```

</details>

### Question 1.3
Create a compressed tar archive of /etc named etc-backup.tar.gz.

<details>
<summary>Show Solution</summary>

```bash
tar -czvf etc-backup.tar.gz /etc
```

</details>

### Question 1.4
Set permissions on /data directory so owner has full access, group has read/execute, others have no access. Apply recursively.

<details>
<summary>Show Solution</summary>

```bash
chmod -R 750 /data
```

</details>

---

## Section 2: Operation of Running Systems (20%)

### Question 2.1
List all running services and their status.

<details>
<summary>Show Solution</summary>

```bash
systemctl list-units --type=service --state=running
```

</details>

### Question 2.2
Configure the nginx service to start automatically at boot.

<details>
<summary>Show Solution</summary>

```bash
systemctl enable nginx
```

</details>

### Question 2.3
Find the process using the most CPU and kill it.

<details>
<summary>Show Solution</summary>

```bash
# Find top CPU process
ps aux --sort=-%cpu | head -2

# Or use top/htop to identify PID, then:
kill -9 <PID>
```

</details>

### Question 2.4
Schedule a script /opt/backup.sh to run every day at 2:30 AM.

<details>
<summary>Show Solution</summary>

```bash
crontab -e
# Add line:
30 2 * * * /opt/backup.sh
```

</details>

---

## Section 3: User and Group Management (10%)

### Question 3.1
Create a user "developer" with home directory /home/developer and shell /bin/bash.

<details>
<summary>Show Solution</summary>

```bash
useradd -m -d /home/developer -s /bin/bash developer
```

</details>

### Question 3.2
Add user "developer" to the "docker" group as a secondary group.

<details>
<summary>Show Solution</summary>

```bash
usermod -aG docker developer
```

</details>

### Question 3.3
Set password expiry for user "developer" to 90 days.

<details>
<summary>Show Solution</summary>

```bash
chage -M 90 developer
```

</details>

---

## Section 4: Networking (12%)

### Question 4.1
Display all network interfaces and their IP addresses.

<details>
<summary>Show Solution</summary>

```bash
ip addr show
# Or
ip a
```

</details>

### Question 4.2
Add a static route to network 10.0.0.0/24 via gateway 192.168.1.1.

<details>
<summary>Show Solution</summary>

```bash
ip route add 10.0.0.0/24 via 192.168.1.1
```

</details>

### Question 4.3
Open port 8080/tcp in the firewall permanently.

<details>
<summary>Show Solution</summary>

```bash
# firewalld
firewall-cmd --permanent --add-port=8080/tcp
firewall-cmd --reload

# Or iptables
iptables -A INPUT -p tcp --dport 8080 -j ACCEPT
```

</details>

### Question 4.4
Configure the system to use DNS server 8.8.8.8.

<details>
<summary>Show Solution</summary>

```bash
# Edit /etc/resolv.conf
echo "nameserver 8.8.8.8" >> /etc/resolv.conf

# Or for permanent (systemd-resolved)
# Edit /etc/systemd/resolved.conf and add:
# DNS=8.8.8.8
```

</details>

---

## Section 5: Service Configuration (20%)

### Question 5.1
Configure SSH to disable root login.

<details>
<summary>Show Solution</summary>

```bash
# Edit /etc/ssh/sshd_config
# Set: PermitRootLogin no

sed -i 's/^#*PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config
systemctl restart sshd
```

</details>

### Question 5.2
Configure NTP to sync time with pool.ntp.org.

<details>
<summary>Show Solution</summary>

```bash
# For systemd-timesyncd
# Edit /etc/systemd/timesyncd.conf
# NTP=pool.ntp.org

# Or for chrony
# Edit /etc/chrony/chrony.conf
# server pool.ntp.org iburst

systemctl restart systemd-timesyncd
# Or
systemctl restart chronyd
```

</details>

### Question 5.3
Set up a basic Apache virtual host for domain example.com serving content from /var/www/example.

<details>
<summary>Show Solution</summary>

```bash
# Create /etc/apache2/sites-available/example.com.conf (Ubuntu)
# Or /etc/httpd/conf.d/example.com.conf (RHEL)

cat << EOF > /etc/apache2/sites-available/example.com.conf
<VirtualHost *:80>
    ServerName example.com
    DocumentRoot /var/www/example
    <Directory /var/www/example>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
EOF

a2ensite example.com.conf
systemctl reload apache2
```

</details>

---

## Section 6: Storage Management (13%)

### Question 6.1
Create a new partition on /dev/sdb using all available space.

<details>
<summary>Show Solution</summary>

```bash
fdisk /dev/sdb
# n (new partition)
# p (primary)
# 1 (partition number)
# Enter (default first sector)
# Enter (default last sector)
# w (write)

# Or with parted
parted /dev/sdb mklabel gpt
parted /dev/sdb mkpart primary 0% 100%
```

</details>

### Question 6.2
Create an ext4 filesystem on /dev/sdb1 and mount it at /data.

<details>
<summary>Show Solution</summary>

```bash
mkfs.ext4 /dev/sdb1
mkdir -p /data
mount /dev/sdb1 /data

# For persistent mount, add to /etc/fstab:
echo "/dev/sdb1 /data ext4 defaults 0 2" >> /etc/fstab
```

</details>

### Question 6.3
Create an LVM logical volume named "data" of 10GB from volume group "vg01".

<details>
<summary>Show Solution</summary>

```bash
lvcreate -L 10G -n data vg01
```

</details>

### Question 6.4
Extend logical volume /dev/vg01/data by 5GB and resize the filesystem.

<details>
<summary>Show Solution</summary>

```bash
lvextend -L +5G /dev/vg01/data
resize2fs /dev/vg01/data    # For ext4
# Or
xfs_growfs /dev/vg01/data   # For XFS
```

</details>

---

## Quick Reference Commands

```bash
# System info
uname -a
hostnamectl
cat /etc/os-release

# Disk usage
df -h
du -sh /path

# Memory
free -h

# Processes
ps aux
top
htop

# Services
systemctl status service
systemctl start/stop/restart service
systemctl enable/disable service

# Logs
journalctl -u service
tail -f /var/log/syslog

# Network
ip addr
ip route
ss -tulpn
netstat -tulpn
```

---

## Exam Tips

1. **Know your editor**: vim or nano - be fast
2. **Use tab completion**: Save time and avoid typos
3. **Check man pages**: `man command` is your friend
4. **Verify your work**: Always check if changes took effect
5. **Time management**: Don't spend too long on one question
6. **Read carefully**: Understand what's being asked

---

[← Back to LFCS Overview](./README.md)
