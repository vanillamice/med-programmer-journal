#!/usr/bin/env python3
import os
import json
import markdown
import yaml
from pathlib import Path

def extract_frontmatter(content):
    """Extract YAML frontmatter from markdown content."""
    if not content.startswith('---'):
        return {}, content
    
    parts = content.split('---', 2)
    if len(parts) < 3:
        return {}, content
    
    frontmatter = yaml.safe_load(parts[1])
    markdown_content = parts[2].strip()
    return frontmatter, markdown_content

def convert_markdown_to_html(markdown_content):
    """Convert markdown content to HTML."""
    md = markdown.Markdown(extensions=['extra', 'codehilite'])
    return md.convert(markdown_content)

def create_html_template(title, content, date, categories):
    """Create HTML template for blog posts."""
    return f"""<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes" />
    <title>{title} - Mediterranean Programmer Journal</title>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/styles.css" />
</head>
<body>
    <table class="header">
        <tr>
            <td class="width-auto">
                <h1 class="title">Mediterranean Programmer Journal</h1>
                <span class="subtitle">Computing & More</span>
            </td>
        </tr>
        <tr>
            <th class="width-min">Author</th>
            <td class="width-auto"><cite>Yae</cite></td>
        </tr>
    </table>

    <main>
        <article>
            <header>
                <h1>{title}</h1>
                <time datetime="{date}">{date}</time>
                <div class="tags">
                    {''.join(f'<span class="tag">{cat}</span>' for cat in categories)}
                </div>
            </header>
            {content}
        </article>
    </main>

    <footer>
        <p>© 2024 Mediterranean Programmer Journal. All rights reserved.</p>
    </footer>

    <script src="/script.js"></script>
</body>
</html>"""

def build_blog():
    """Build the blog from markdown files."""
    posts_dir = Path('posts')
    md_dir = posts_dir / 'md'
    posts = []
    
    # Create posts directory if it doesn't exist
    posts_dir.mkdir(exist_ok=True)
    md_dir.mkdir(exist_ok=True)
    
    # Process each markdown file
    for md_file in md_dir.glob('*.md'):
        with open(md_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract frontmatter and convert markdown
        frontmatter, markdown_content = extract_frontmatter(content)
        html_content = convert_markdown_to_html(markdown_content)
        
        # Create HTML file
        html_file = posts_dir / f"{md_file.stem}.html"
        html_template = create_html_template(
            frontmatter['title'],
            html_content,
            frontmatter['date'],
            frontmatter['categories']
        )
        
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(html_template)
        
        # Add to posts list for index.json
        posts.append({
            'title': frontmatter['title'],
            'date': frontmatter['date'],
            'url': f"/posts/{html_file.name}",
            'excerpt': markdown_content.split('\n\n')[0],
            'categories': frontmatter['categories']
        })
    
    # Sort posts by date (newest first)
    posts.sort(key=lambda x: x['date'], reverse=True)
    
    # Write index.json
    with open(posts_dir / 'index.json', 'w', encoding='utf-8') as f:
        json.dump(posts, f, indent=4)

if __name__ == '__main__':
    build_blog() 