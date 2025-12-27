#!/usr/bin/env python3
"""
Update estimated reading times in lesson frontmatter to match actual content length.
Assumes ~130 words per minute reading speed (includes code reading).
"""

import os
import re
import json
from pathlib import Path

def count_words(text):
    """Count words in text."""
    return len(re.findall(r'\w+', text))

def estimate_read_time(words, wpm=130):
    """Estimate read time assuming ~130 words per minute."""
    return max(1, round(words / wpm))

def update_lesson_times(content_dir="content/modules"):
    """Update estimated times for all lessons."""
    updated = []
    skipped = []
    
    for mod_dir in sorted(os.listdir(content_dir)):
        if not mod_dir.startswith("module-"):
            continue
        
        mod_path = os.path.join(content_dir, mod_dir)
        for root, dirs, files in os.walk(mod_path):
            if "content.mdx" not in files:
                continue
            
            lesson_path = os.path.join(root, "content.mdx")
            
            try:
                with open(lesson_path, 'r') as f:
                    content = f.read()
                
                # Extract frontmatter
                frontmatter_match = re.match(r'^---\n(.*?)\n---\n(.*)$', content, re.DOTALL)
                if not frontmatter_match:
                    skipped.append(lesson_path)
                    continue
                
                frontmatter = frontmatter_match.group(1)
                lesson_content = frontmatter_match.group(2)
                
                # Count words in content (not frontmatter)
                words = count_words(lesson_content)
                estimated_time = estimate_read_time(words)
                
                # Check current estimated time
                current_match = re.search(r'estimatedMinutes:\s*(\d+)', frontmatter)
                if current_match:
                    current_time = int(current_match.group(1))
                    if abs(current_time - estimated_time) <= 2:
                        # Already close, skip
                        continue
                
                # Update estimated time
                if current_match:
                    # Replace existing
                    new_frontmatter = re.sub(
                        r'estimatedMinutes:\s*\d+',
                        f'estimatedMinutes: {estimated_time}',
                        frontmatter
                    )
                else:
                    # Add if missing (shouldn't happen)
                    new_frontmatter = frontmatter + f'\nestimatedMinutes: {estimated_time}'
                
                # Write updated content
                new_content = f'---\n{new_frontmatter}\n---\n{lesson_content}'
                with open(lesson_path, 'w') as f:
                    f.write(new_content)
                
                updated.append({
                    "path": lesson_path,
                    "old": int(current_match.group(1)) if current_match else None,
                    "new": estimated_time,
                    "words": words
                })
                
            except Exception as e:
                print(f"Error processing {lesson_path}: {e}")
                skipped.append(lesson_path)
    
    return updated, skipped

if __name__ == "__main__":
    print("Updating estimated reading times...")
    updated, skipped = update_lesson_times()
    
    print(f"\n✅ Updated {len(updated)} lessons")
    print(f"⚠ Skipped {len(skipped)} lessons")
    
    if updated:
        print("\nUpdates:")
        for item in updated[:10]:  # Show first 10
            name = os.path.basename(os.path.dirname(item["path"]))
            old_str = f"{item['old']}min" if item['old'] else "N/A"
            print(f"  {name}: {old_str} → {item['new']}min ({item['words']} words)")
        if len(updated) > 10:
            print(f"  ... and {len(updated) - 10} more")

