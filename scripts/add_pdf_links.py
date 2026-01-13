#!/usr/bin/env python3
"""
Script to add PDF download links to all certification README files
"""
import os
import re
from pathlib import Path

def get_certification_info():
    """Get certification information from directory structure"""
    cert_dirs = [
        'kcna', 'kcsa', 'cka', 'ckad', 'cks',  # Kubestronaut
        'pca', 'cnpe', 'lfcs', 'ica', 'cca', 'capa', 'cgoa', 'cba', 'otca', 'kca', 'cnpa'  # Golden Kubestronaut
    ]
    
    cert_names = {
        'kcna': 'Kubernetes and Cloud Native Associate',
        'kcsa': 'Kubernetes and Cloud Native Security Associate',
        'cka': 'Certified Kubernetes Administrator',
        'ckad': 'Certified Kubernetes Application Developer',
        'cks': 'Certified Kubernetes Security Specialist',
        'pca': 'Prometheus Certified Associate',
        'cnpe': 'Certified Node.js Platform Engineer',
        'lfcs': 'Linux Foundation Certified System Administrator',
        'ica': 'Istio Certified Associate',
        'cca': 'Cilium Certified Associate',
        'capa': 'Argo CD Certified Professional - Application Delivery',
        'cgoa': 'Certified GitOps Professional',
        'cba': 'Cilium Certified Associate - (Beta)',
        'otca': 'OpenTelemetry Certified Associate',
        'kca': 'Kyverno Certified Associate',
        'cnpa': 'Cloud Native Professional Associate'
    }
    
    return [(cert_dir, cert_names.get(cert_dir.upper(), cert_dir.upper())) for cert_dir in cert_dirs]

def add_pdf_download_section(content, cert_code, cert_name):
    """Add PDF download section to README content"""
    
    # Find the first paragraph after the title and badge
    lines = content.split('\n')
    
    # Look for the description paragraph
    insert_index = -1
    for i, line in enumerate(lines):
        if line.strip().startswith('The **') and 'exam certifies' in line:
            insert_index = i + 1  # Insert after this line
            break
    
    if insert_index == -1:
        # Fallback: insert after the badge line
        for i, line in enumerate(lines):
            if 'training.linuxfoundation.org' in line:
                insert_index = i + 1
                break
    
    if insert_index == -1:
        # Last fallback: insert after title
        for i, line in enumerate(lines):
            if line.startswith('# '):
                insert_index = i + 1
                break
    
    if insert_index == -1:
        return content  # Can't find insertion point
    
    pdf_section = f"""
## 📥 Download Study Guide

[![PDF Download](https://img.shields.io/badge/PDF-Download-red?style=for-the-badge&logo=adobeacrobatreader&logoColor=white)](/pdf/{cert_code.upper()}_Study_Guide.pdf)

**Get the complete {cert_code.upper()} Study Guide as a printable PDF:**
- 📚 All chapters combined into one document
- 📑 Printer-friendly formatting with table of contents
- 🔖 Page numbers and navigation
- 📱 Optimized for offline study

[Download {cert_code.upper()} Study Guide PDF](/pdf/{cert_code.upper()}_Study_Guide.pdf)
"""
    
    # Insert the PDF section
    lines.insert(insert_index, pdf_section.rstrip())
    
    return '\n'.join(lines)

def main():
    """Add PDF download links to all certification README files"""
    
    certifications = get_certification_info()
    
    for cert_dir, cert_name in certifications:
        readme_path = os.path.join(cert_dir, 'README.md')
        
        if not os.path.exists(readme_path):
            print(f"⚠️  {readme_path} not found, skipping...")
            continue
        
        print(f"📝 Processing {cert_dir.upper()} README...")
        
        # Read current content
        with open(readme_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if PDF section already exists
        if '📥 Download Study Guide' in content:
            print(f"  ✅ PDF download section already exists")
            continue
        
        # Add PDF download section
        updated_content = add_pdf_download_section(content, cert_dir, cert_name)
        
        # Write updated content
        with open(readme_path, 'w', encoding='utf-8') as f:
            f.write(updated_content)
        
        print(f"  ✅ Added PDF download section")

if __name__ == "__main__":
    main()
