"""
BrainClip Backend - Note Service
Handles saving notes to the Obsidian vault
"""

import os
import re
from datetime import datetime
from urllib.parse import urlparse
from typing import Optional
import logging

from app.config import settings

# Configure logging
logger = logging.getLogger(__name__)


def slugify(text: str, max_length: int = 50) -> str:
    """
    Convert text to a URL-friendly slug
    
    Args:
        text: Text to slugify
        max_length: Maximum length of the slug
        
    Returns:
        Slugified string
    """
    # Convert to lowercase
    slug = text.lower()
    # Replace spaces and special characters with hyphens
    slug = re.sub(r'[^\w\s-]', '', slug)
    slug = re.sub(r'[-\s]+', '-', slug)
    # Remove leading/trailing hyphens
    slug = slug.strip('-')
    # Truncate to max length
    if len(slug) > max_length:
        slug = slug[:max_length].rsplit('-', 1)[0]
    return slug or 'untitled'


def get_domain(url: str) -> str:
    """
    Extract domain from URL for folder organization
    
    Args:
        url: Full URL
        
    Returns:
        Domain name (e.g., 'github.com')
    """
    try:
        parsed = urlparse(url)
        domain = parsed.netloc
        # Remove 'www.' prefix
        if domain.startswith('www.'):
            domain = domain[4:]
        return domain or 'unknown'
    except Exception:
        return 'unknown'


def generate_frontmatter(
    title: str,
    url: str,
    summary: str,
    tags: list,
    byline: Optional[str] = None
) -> str:
    """
    Generate YAML frontmatter for Obsidian note
    
    Args:
        title: Note title
        url: Source URL
        summary: Note summary
        tags: List of tags
        byline: Author name
        
    Returns:
        YAML frontmatter string
    """
    date_clipped = datetime.now().strftime("%Y-%m-%d")
    time_clipped = datetime.now().strftime("%H:%M:%S")
    domain = get_domain(url)
    
    # Format tags for YAML
    tags_yaml = '\n'.join(f'  - {tag}' for tag in tags)
    
    # Clean title and summary for YAML (avoid backslash in f-string)
    clean_title = title.replace('"', "'")
    clean_summary = summary.replace('"', "'").replace('\n', ' ')[:200]
    
    frontmatter = f"""---
title: "{clean_title}"
source: "{url}"
author: "{byline or 'Unknown'}"
domain: "{domain}"
date_clipped: {date_clipped}
time_clipped: {time_clipped}
tags:
{tags_yaml}
  - brainclip
summary: "{clean_summary}"
---
"""
    return frontmatter


async def save_note(url: str, note_data: dict) -> str:
    """
    Save generated note to the Obsidian vault
    
    Notes are organized by domain:
    vault/
    ├── github.com/
    │   └── 2025-12-11-article-title.md
    ├── medium.com/
    │   └── 2025-12-11-another-article.md
    
    Args:
        url: Source URL
        note_data: Dictionary containing note content from GPT
        
    Returns:
        Relative path to the saved note
    """
    # Extract components
    title = note_data.get("title", "Untitled")
    summary = note_data.get("summary", "")
    tags = note_data.get("tags", ["web-clip"])
    key_points = note_data.get("key_points", [])
    content = note_data.get("content", "")
    byline = note_data.get("byline", "")
    
    # Get domain for folder structure
    domain = get_domain(url)
    
    # Generate filename
    date_str = datetime.now().strftime("%Y-%m-%d")
    slug = slugify(title)
    filename = f"{date_str}-{slug}.md"
    
    # Create domain folder if it doesn't exist
    domain_path = os.path.join(settings.vault_path, domain)
    os.makedirs(domain_path, exist_ok=True)
    
    # Full file path
    file_path = os.path.join(domain_path, filename)
    
    # Handle duplicate filenames
    counter = 1
    original_filename = filename
    while os.path.exists(file_path):
        filename = f"{date_str}-{slug}-{counter}.md"
        file_path = os.path.join(domain_path, filename)
        counter += 1
    
    # Generate frontmatter
    frontmatter = generate_frontmatter(
        title=title,
        url=url,
        summary=summary,
        tags=tags,
        byline=byline
    )
    
    # Build note content
    note_content = frontmatter
    note_content += f"\n# {title}\n\n"
    
    # Add summary section
    if summary:
        note_content += f"## Summary\n\n{summary}\n\n"
    
    # Add key points section
    if key_points:
        note_content += "## Key Points\n\n"
        for point in key_points:
            note_content += f"- {point}\n"
        note_content += "\n"
    
    # Add main content
    if content:
        note_content += f"## Notes\n\n{content}\n\n"
    
    # Add source reference
    note_content += f"---\n\n*Clipped from [{domain}]({url}) on {date_str}*\n"
    
    # Write to file
    try:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(note_content)
        
        logger.info(f"Note saved to: {file_path}")
        
        # Return relative path for display
        return f"{domain}/{filename}"
        
    except Exception as e:
        logger.error(f"Failed to save note: {e}")
        raise
