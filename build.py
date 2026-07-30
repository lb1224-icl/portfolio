#!/usr/bin/env python3
"""Generates the Featured / All Projects card grids in index.html from projects.json.

Run this after editing projects.json, before committing/pushing:
    python build.py
"""
import json
import re
from html import escape
from pathlib import Path

ROOT = Path(__file__).parent
PROJECTS_JSON = ROOT / "projects.json"
INDEX_HTML = ROOT / "index.html"


def render_tags(tags):
    spans = [f'<span class="tag tag--{t["kind"]}">{escape(t["label"])}</span>' for t in tags]
    return "\n              ".join(spans)


def render_card(project, thumb_size=(400, 225)):
    card_class = "project-card"
    if project.get("in_progress"):
        card_class += " project-card--in-progress"
    w, h = thumb_size
    return f'''<a class="{card_class}" href="projects/{project["slug"]}.html">
          <div class="project-card__thumb">
            <img src="assets/images/{project["thumb"]}" alt="{escape(project["thumb_alt"])}" width="{w}" height="{h}" />
          </div>
          <div class="project-card__body">
            <h3 class="project-card__title">{escape(project["title"])}</h3>
            <p class="project-card__summary">
              {escape(project["summary"])}
            </p>
            <div class="tag-row">
              {render_tags(project["tags"])}
            </div>
          </div>
        </a>'''


def replace_block(html, marker, content):
    pattern = re.compile(
        rf"(<!-- BUILD:{marker}:START.*?-->\n).*?( *<!-- BUILD:{marker}:END -->)",
        re.DOTALL,
    )
    if not pattern.search(html):
        raise SystemExit(f"Could not find BUILD:{marker} markers in {INDEX_HTML}")
    body = ("        " + "\n\n        ".join(content) + "\n") if content else ""
    return pattern.sub(lambda m: m.group(1) + body + "        " + m.group(2).lstrip(), html)


def main():
    projects = json.loads(PROJECTS_JSON.read_text(encoding="utf-8"))
    featured = [p for p in projects if p.get("featured")]
    all_cards = [render_card(p) for p in projects]
    featured_cards = [render_card(p, thumb_size=(400, 225)) for p in featured]

    html = INDEX_HTML.read_text(encoding="utf-8")
    html = replace_block(html, "FEATURED", featured_cards)
    html = replace_block(html, "ALL", all_cards)
    INDEX_HTML.write_text(html, encoding="utf-8")
    print(f"Wrote {len(projects)} project card(s) ({len(featured)} featured) into {INDEX_HTML.name}")


if __name__ == "__main__":
    main()
