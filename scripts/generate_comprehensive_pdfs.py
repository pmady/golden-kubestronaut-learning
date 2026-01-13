#!/usr/bin/env python3
"""
Comprehensive PDF Generation Script for Golden Kubestronaut Learning

This script generates complete PDF study guides for each certification,
combining all chapters into a single PDF with table of contents.
"""
import os
import re
import yaml
from pathlib import Path
from datetime import datetime
import subprocess
import sys

def load_mkdocs_config():
    """Load the mkdocs.yml configuration."""
    with open('mkdocs.yml', 'r') as f:
        return yaml.safe_load(f)

def get_certification_structure():
    """Extract certification structure from mkdocs.yml."""
    config = load_mkdocs_config()
    cert_structure = {}
    
    for section in config['nav']:
        if isinstance(section, dict):
            if 'Kubestronaut (5 Certs)' in section:
                cert_structure['kubestronaut'] = section['Kubestronaut (5 Certs)']
            elif 'Golden Kubestronaut (Additional Certs)' in section:
                cert_structure['golden_kubestronaut'] = section['Golden Kubestronaut (Additional Certs)']
    
    return cert_structure

def process_certification_section(section):
    """Process a certification section and organize by certification."""
    certifications = {}
    
    for item in section:
        if isinstance(item, dict):
            for cert_name, content in item.items():
                if isinstance(content, list):
                    cert_pages = []
                    for subitem in content:
                        if isinstance(subitem, str):
                            # Overview file
                            if subitem.endswith('.md'):
                                page_title = "Overview"
                                cert_pages.append((page_title, subitem))
                        elif isinstance(subitem, dict):
                            for title, path in subitem.items():
                                if path.endswith('.md'):
                                    cert_pages.append((title, path))
                    certifications[cert_name] = cert_pages
    
    return certifications

def generate_combined_markdown(cert_name, pages, output_dir):
    """Generate a combined markdown file for a certification."""
    combined_content = []
    
    # Add title and metadata
    combined_content.append(f"# {cert_name}")
    combined_content.append(f"")
    combined_content.append(f"**Generated on:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    combined_content.append(f"**Version:** 1.0")
    combined_content.append(f"")
    combined_content.append("---")
    combined_content.append(f"")
    
    # Add table of contents
    combined_content.append("## Table of Contents")
    combined_content.append("")
    for i, (title, path) in enumerate(pages, 1):
        page_num = i + 2  # Account for title page and TOC
        combined_content.append(f"{i}. [{title}](#{title.lower().replace(' ', '-').replace(',', '').replace('(', '').replace(')', '')})")
    combined_content.append("")
    combined_content.append("---")
    combined_content.append("")
    
    # Add each page content
    for title, path in pages:
        if path.endswith('.md') and os.path.exists(path):
            combined_content.append(f"## {title}")
            combined_content.append("")
            
            # Read and include the markdown content
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Remove the main title if it exists to avoid duplication
                lines = content.split('\n')
                if lines and lines[0].startswith('# '):
                    content = '\n'.join(lines[1:])
                
                combined_content.append(content)
                combined_content.append("")
                combined_content.append("---")
                combined_content.append("")
                
            except Exception as e:
                print(f"  Error reading {path}: {e}")
                combined_content.append(f"*Error: Could not load content for {title}*")
                combined_content.append("")
    
    # Write combined markdown
    safe_cert_name = cert_name.replace(' ', '_').replace('/', '_').replace('(', '').replace(')', '')
    combined_file = os.path.join(output_dir, f"{safe_cert_name}_combined.md")
    
    with open(combined_file, 'w', encoding='utf-8') as f:
        f.write('\n'.join(combined_content))
    
    return combined_file

def convert_markdown_to_pdf_pandoc(markdown_file, output_file):
    """Convert markdown to PDF using pandoc."""
    try:
        cmd = [
            'pandoc',
            markdown_file,
            '-o', output_file,
            '--pdf-engine=weasyprint',
            '--toc',
            '--toc-depth=3',
            '--number-sections',
            '-V', 'geometry:margin=1.5cm',
            '-V', 'fontsize=11pt',
            '-V', 'documentclass=article',
            '-V', 'colorlinks=true',
            '-V', 'linkcolor=blue',
            '-V', 'urlcolor=blue',
            '-V', 'toccolor=blue'
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
        
        if result.returncode == 0:
            return True
        else:
            print(f"  Pandoc error: {result.stderr}")
            return False
            
    except subprocess.TimeoutExpired:
        print(f"  Pandoc conversion timed out")
        return False
    except FileNotFoundError:
        print(f"  Pandoc not found, trying alternative method...")
        return False
    except Exception as e:
        print(f"  Pandoc conversion error: {e}")
        return False

def convert_markdown_to_pdf_weasyprint(markdown_file, output_file):
    """Convert markdown to PDF using WeasyPrint directly."""
    try:
        import markdown
        from weasyprint import HTML, CSS
        
        # Read markdown content
        with open(markdown_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Convert markdown to HTML
        html_content = markdown.markdown(content, extensions=['tables', 'fenced_code', 'toc', 'codehilite'])
        
        # Create CSS for better formatting
        css = CSS(string="""
            @page {
                size: A4;
                margin: 1.5cm;
                @top-center {
                    content: "Golden Kubestronaut Learning";
                    font-size: 10pt;
                    color: #666;
                }
                @bottom-right {
                    content: "Page " counter(page) " of " counter(pages);
                    font-size: 9pt;
                }
            }
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                font-size: 11pt;
            }
            h1, h2, h3, h4, h5, h6 {
                color: #2c3e50;
                page-break-after: avoid;
                margin-top: 1.5em;
                margin-bottom: 0.8em;
            }
            h1 { font-size: 20pt; }
            h2 { font-size: 16pt; }
            h3 { font-size: 14pt; }
            pre, code {
                background-color: #f5f5f5;
                border-radius: 3px;
                padding: 0.2em 0.4em;
                font-family: 'Courier New', monospace;
            }
            pre {
                padding: 1em;
                overflow-x: auto;
                page-break-inside: avoid;
                font-size: 9pt;
            }
            table {
                border-collapse: collapse;
                width: 100%;
                margin: 1em 0;
                page-break-inside: avoid;
            }
            th, td {
                border: 1px solid #ddd;
                padding: 0.5em;
                text-align: left;
                font-size: 10pt;
            }
            th {
                background-color: #f5f5f5;
                font-weight: bold;
            }
            .toc {
                background-color: #f8f9fa;
                border: 1px solid #e9ecef;
                padding: 1em;
                margin-bottom: 2em;
                border-radius: 4px;
            }
            .toc ul {
                list-style-type: none;
                padding-left: 0;
            }
            .toc li {
                margin: 0.3em 0;
            }
            .toc a {
                text-decoration: none;
                color: #007bff;
            }
            .toc a:hover {
                text-decoration: underline;
            }
        """)
        
        # Create complete HTML document
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Study Guide</title>
        </head>
        <body>
            {html_content}
        </body>
        </html>
        """
        
        # Generate PDF
        HTML(string=html).write_pdf(output_file, stylesheets=[css])
        return True
        
    except Exception as e:
        print(f"  WeasyPrint error: {e}")
        return False

def main():
    """Main function to generate comprehensive PDFs."""
    print("Starting comprehensive PDF generation...")
    
    # Create output directories
    temp_dir = 'temp_markdown'
    pdf_dir = 'site/pdf'
    os.makedirs(temp_dir, exist_ok=True)
    os.makedirs(pdf_dir, exist_ok=True)
    
    # Get certification structure
    cert_structure = get_certification_structure()
    all_certifications = {}
    
    # Process all certifications
    for category, section in cert_structure.items():
        certifications = process_certification_section(section)
        all_certifications.update(certifications)
    
    print(f"Found {len(all_certifications)} certifications")
    
    # Generate PDF for each certification
    success_count = 0
    for cert_name, pages in all_certifications.items():
        print(f"\nGenerating PDF for {cert_name}...")
        
        # Generate combined markdown
        combined_md = generate_combined_markdown(cert_name, pages, temp_dir)
        print(f"  Created combined markdown: {combined_md}")
        
        # Generate output filename
        safe_cert_name = cert_name.replace(' ', '_').replace('/', '_').replace('(', '').replace(')', '')
        pdf_file = os.path.join(pdf_dir, f"{safe_cert_name}_Study_Guide.pdf")
        
        # Try to convert to PDF using different methods
        success = False
        
        # Method 1: Try pandoc first (usually produces better results)
        print("  Trying pandoc conversion...")
        success = convert_markdown_to_pdf_pandoc(combined_md, pdf_file)
        
        # Method 2: Fall back to WeasyPrint
        if not success:
            print("  Trying WeasyPrint conversion...")
            success = convert_markdown_to_pdf_weasyprint(combined_md, pdf_file)
        
        if success:
            print(f"  ✓ Successfully generated: {pdf_file}")
            success_count += 1
        else:
            print(f"  ✗ Failed to generate PDF for {cert_name}")
    
    # Cleanup temporary files
    import shutil
    if os.path.exists(temp_dir):
        shutil.rmtree(temp_dir)
    
    print(f"\nPDF generation complete!")
    print(f"Successfully generated: {success_count}/{len(all_certifications)} PDFs")
    print(f"PDFs available in: {pdf_dir}")

if __name__ == "__main__":
    main()
