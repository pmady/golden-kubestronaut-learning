#!/usr/bin/env python3
"""
PDF Generation Script for Golden Kubestronaut Learning

This script generates PDF versions of all study guides using WeasyPrint.
"""
import os
import re
import yaml
from pathlib import Path
from weasyprint import HTML
from markdown import markdown
from bs4 import BeautifulSoup

def load_mkdocs_config():
    """Load the mkdocs.yml configuration."""
    with open('mkdocs.yml', 'r') as f:
        return yaml.safe_load(f)

def get_certification_pages():
    """Extract certification pages from mkdocs.yml."""
    config = load_mkdocs_config()
    cert_pages = []
    
    # Define the sections that contain certification content
    cert_sections = [
        'Kubestronaut (5 Certs)',
        'Golden Kubestronaut (Additional Certs)'
    ]
    
    for section in config['nav']:
        if isinstance(section, dict) and section.get('Kubestronaut (5 Certs)'):
            cert_pages.extend(process_section(section['Kubestronaut (5 Certs)']))
        elif isinstance(section, dict) and section.get('Golden Kubestronaut (Additional Certs)'):
            cert_pages.extend(process_section(section['Golden Kubestronaut (Additional Certs)']))
    
    return cert_pages

def process_section(section):
    """Process a section of the navigation and extract pages."""
    pages = []
    for item in section:
        if isinstance(item, dict):
            for title, content in item.items():
                if isinstance(content, list):
                    for subitem in content:
                        if isinstance(subitem, str):
                            pages.append((title, subitem))
                        elif isinstance(subitem, dict):
                            pages.extend([(f"{title} - {k}", v) for k, v in subitem.items()])
    return pages

def generate_pdf(input_path, output_path, title):
    """Generate a PDF from a markdown file."""
    # Read markdown content
    with open(input_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Convert markdown to HTML
    html_content = markdown(content, extensions=['tables', 'fenced_code', 'codehilite'])
    
    # Create a complete HTML document
    html_template = """
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>{title}</title>
        <style>
            @page {{
                size: A4;
                margin: 1.5cm;
                @top-center {{
                    content: "{title}";
                    font-size: 12pt;
                    color: #666;
                }}
                @bottom-right {{
                    content: "Page " counter(page) " of " counter(pages);
                    font-size: 10pt;
                }}
            }}
            body {{
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
            }}
            h1, h2, h3, h4, h5, h6 {{
                color: #2c3e50;
                page-break-after: avoid;
            }}
            pre, code {{
                background-color: #f5f5f5;
                border-radius: 3px;
                padding: 0.2em 0.4em;
            }}
            pre {{
                padding: 1em;
                overflow-x: auto;
                page-break-inside: avoid;
            }}
            table {{
                border-collapse: collapse;
                width: 100%;
                margin: 1em 0;
                page-break-inside: avoid;
            }}
            th, td {{
                border: 1px solid #ddd;
                padding: 0.5em;
                text-align: left;
            }}
            th {{
                background-color: #f5f5f5;
            }}
            .admonition {{
                border-left: 4px solid #ddd;
                padding: 0.5em 1em;
                margin: 1em 0;
                page-break-inside: avoid;
            }}
            .admonition-title {{
                font-weight: bold;
                margin: 0 0 0.5em 0;
            }}
            .admonition.note {{
                background-color: #e7f5ff;
                border-left-color: #4dabf7;
            }}
            .admonition.warning {{
                background-color: #fff3bf;
                border-left-color: #ffd43b;
            }}
            .admonition.danger {{
                background-color: #ffecf0;
                border-left-color: #ff6b6b;
            }}
        </style>
    </head>
    <body>
        <h1>{title}</h1>
        {content}
    </body>
    </html>
    """
    
    html = html_template.format(title=title, content=html_content)
    
    # Generate PDF
    HTML(string=html).write_pdf(output_path)

def main():
    """Main function to generate PDFs for all certification pages."""
    # Create output directory if it doesn't exist
    os.makedirs('site/pdf', exist_ok=True)
    
    # Get all certification pages
    cert_pages = get_certification_pages()
    
    # Generate PDF for each page
    for title, path in cert_pages:
        if path.endswith('.md'):
            input_path = path
            output_filename = os.path.splitext(os.path.basename(path))[0] + '.pdf'
            output_path = os.path.join('site', 'pdf', output_filename)
            
            print(f"Generating PDF for {title}...")
            try:
                generate_pdf(input_path, output_path, title)
                print(f"  -> Saved to {output_path}")
            except Exception as e:
                print(f"  Error generating PDF for {title}: {str(e)}")

if __name__ == "__main__":
    main()
