# Essential Commands (25%)

## File and Directory Operations

### Basic Commands

```bash
# List files
ls -la                    # Long listing with hidden files
ls -lh                    # Human-readable sizes
ls -ltr                   # Sort by time, reverse

# Change directory
cd /path/to/dir
cd ~                      # Home directory
cd -                      # Previous directory

# Create directories
mkdir mydir
mkdir -p parent/child/grandchild

# Copy files
cp file1 file2
cp -r dir1 dir2           # Recursive copy
cp -p file1 file2         # Preserve attributes

# Move/rename
mv oldname newname
mv file /path/to/dest/

# Remove
rm file
rm -r directory           # Recursive
rm -rf directory          # Force recursive
```

### File Content Commands

```bash
# View files
cat file
less file
head -n 20 file
tail -n 20 file
tail -f /var/log/syslog   # Follow log

# Word/line count
wc -l file                # Line count
wc -w file                # Word count
wc -c file                # Byte count
```

## Finding Files

### find Command

```bash
# Find by name
find /path -name "*.txt"
find /home -name "file.txt"

# Find by type
find /var -type f         # Files only
find /var -type d         # Directories only
find /var -type l         # Symbolic links

# Find by size
find /var -size +100M     # Larger than 100MB
find /var -size -1k       # Smaller than 1KB

# Find by time
find /var -mtime -7       # Modified in last 7 days
find /var -atime +30      # Accessed more than 30 days ago

# Find and execute
find /tmp -name "*.tmp" -exec rm {} \;
find /var/log -name "*.log" -exec gzip {} \;

# Find by permissions
find /home -perm 777
find /home -perm /u+x     # User executable
```

### locate Command

```bash
# Update database
sudo updatedb

# Search
locate filename
locate -i filename        # Case insensitive
```

## Text Processing

### grep

```bash
# Basic search
grep "pattern" file
grep -i "pattern" file    # Case insensitive
grep -r "pattern" /dir    # Recursive
grep -v "pattern" file    # Invert match
grep -n "pattern" file    # Show line numbers
grep -c "pattern" file    # Count matches
grep -l "pattern" *.txt   # List files with matches

# Extended regex
grep -E "pattern1|pattern2" file
egrep "pattern1|pattern2" file
```

### sed

```bash
# Substitute
sed 's/old/new/' file           # First occurrence
sed 's/old/new/g' file          # All occurrences
sed -i 's/old/new/g' file       # In-place edit

# Delete lines
sed '/pattern/d' file           # Delete matching lines
sed '5d' file                   # Delete line 5
sed '1,5d' file                 # Delete lines 1-5

# Print specific lines
sed -n '5p' file                # Print line 5
sed -n '1,10p' file             # Print lines 1-10
```

### awk

```bash
# Print columns
awk '{print $1}' file           # First column
awk '{print $1, $3}' file       # First and third columns
awk -F: '{print $1}' /etc/passwd # Custom delimiter

# Conditions
awk '$3 > 100 {print $1}' file
awk '/pattern/ {print $0}' file

# Built-in variables
awk '{print NR, $0}' file       # Line numbers
awk 'END {print NR}' file       # Total lines
```

### Other Text Tools

```bash
# Sort
sort file
sort -n file              # Numeric sort
sort -r file              # Reverse
sort -k2 file             # Sort by column 2
sort -u file              # Unique

# Unique
uniq file                 # Remove adjacent duplicates
uniq -c file              # Count occurrences
sort file | uniq          # Remove all duplicates

# Cut
cut -d: -f1 /etc/passwd   # First field, colon delimiter
cut -c1-10 file           # Characters 1-10

# tr (translate)
tr 'a-z' 'A-Z' < file     # Lowercase to uppercase
tr -d '\n' < file         # Delete newlines
```

## Archive and Compression

### tar

```bash
# Create archive
tar -cvf archive.tar files/
tar -czvf archive.tar.gz files/   # With gzip
tar -cjvf archive.tar.bz2 files/  # With bzip2

# Extract
tar -xvf archive.tar
tar -xzvf archive.tar.gz
tar -xjvf archive.tar.bz2
tar -xvf archive.tar -C /dest/    # Extract to directory

# List contents
tar -tvf archive.tar
```

### Compression Tools

```bash
# gzip
gzip file                 # Compress (replaces original)
gunzip file.gz            # Decompress
gzip -k file              # Keep original

# bzip2
bzip2 file
bunzip2 file.bz2

# xz
xz file
unxz file.xz

# zip
zip archive.zip file1 file2
zip -r archive.zip directory/
unzip archive.zip
```

## File Permissions

### Understanding Permissions

```
-rwxr-xr-x  1 user group  size date filename
│└┬┘└┬┘└┬┘
│ │  │  └── Others: r-x (read, execute)
│ │  └───── Group: r-x (read, execute)
│ └──────── User: rwx (read, write, execute)
└────────── File type: - (regular file)
```

### chmod

```bash
# Symbolic mode
chmod u+x file            # Add execute for user
chmod g-w file            # Remove write for group
chmod o=r file            # Set others to read only
chmod a+x file            # Add execute for all

# Numeric mode
chmod 755 file            # rwxr-xr-x
chmod 644 file            # rw-r--r--
chmod 700 file            # rwx------

# Recursive
chmod -R 755 directory/
```

### chown and chgrp

```bash
# Change owner
chown user file
chown user:group file
chown -R user:group directory/

# Change group
chgrp group file
chgrp -R group directory/
```

### Special Permissions

```bash
# SUID (4)
chmod u+s file
chmod 4755 file

# SGID (2)
chmod g+s directory
chmod 2755 directory

# Sticky bit (1)
chmod +t directory
chmod 1755 directory
```

## Links

```bash
# Hard link
ln file hardlink

# Symbolic link
ln -s /path/to/file symlink
ln -s /path/to/dir symlink

# View link target
readlink symlink
readlink -f symlink       # Full path
```

## Input/Output Redirection

```bash
# Output redirection
command > file            # Overwrite
command >> file           # Append

# Error redirection
command 2> error.log
command 2>&1              # Stderr to stdout

# Combined
command > output.log 2>&1
command &> output.log     # Both stdout and stderr

# Input redirection
command < file

# Here document
cat << EOF > file
line 1
line 2
EOF

# Pipes
command1 | command2
ls -l | grep "pattern" | wc -l
```

## Practice Questions

1. Find all files larger than 100MB in /var
2. Replace all occurrences of "old" with "new" in a file
3. Create a compressed tar archive of /etc
4. Set permissions to rwxr-x--- on a directory recursively
5. Find all files modified in the last 24 hours

## Navigation

- [← Back to Overview](./README.md)
- [Next: Operation of Running Systems →](./02-operation-running-systems.md)
