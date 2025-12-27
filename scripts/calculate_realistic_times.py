#!/usr/bin/env python3
"""
Calculate realistic reading times for lessons accounting for:
- Code reading takes longer (~110 words per minute for technical content)
- Exercises add 5-10 minutes per lesson
- Total time = (content_words / 110) + exercise_time
"""

import os
import re
import json
from pathlib import Path

def count_words(text):
    """Count words in text (excluding code blocks for more accurate estimate)."""
    # Remove code blocks (they take longer to read)
    text_no_code = re.sub(r'```[\s\S]*?```', '', text)
    words = len(re.findall(r'\w+', text_no_code))
    
    # Count code blocks separately (estimate 50 words per code block)
    code_blocks = len(re.findall(r'```', text)) // 2
    words += code_blocks * 50  # Rough estimate
    
    return words

def estimate_realistic_time(content_words, has_exercise=True):
    """
    Estimate realistic time:
    - Reading technical content: ~110 words per minute
    - Each exercise: +5 minutes
    - Code examples: already accounted for in word count adjustment
    """
    reading_time = max(1, round(content_words / 110))
    exercise_time = 5 if has_exercise else 0
    return reading_time + exercise_time

def update_all_lesson_times(content_dir="content/modules"):
    """Update estimated times for all lessons based on realistic calculations."""
    updated = []
    
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
                
                # Extract frontmatter and content
                frontmatter_match = re.match(r'^---\n(.*?)\n---\n(.*)$', content, re.DOTALL)
                if not frontmatter_match:
                    continue
                
                frontmatter = frontmatter_match.group(1)
                lesson_content = frontmatter_match.group(2)
                
                # Count words
                words = count_words(lesson_content)
                
                # Check if exercise section exists
                has_exercise = "## Exercise" in lesson_content or "### Exercise" in lesson_content
                
                # Calculate realistic time
                estimated_time = estimate_realistic_time(words, has_exercise)
                
                # Update frontmatter
                if re.search(r'estimatedMinutes:\s*\d+', frontmatter):
                    new_frontmatter = re.sub(
                        r'estimatedMinutes:\s*\d+',
                        f'estimatedMinutes: {estimated_time}',
                        frontmatter
                    )
                else:
                    new_frontmatter = frontmatter + f'\nestimatedMinutes: {estimated_time}'
                
                # Write updated content
                new_content = f'---\n{new_frontmatter}\n---\n{lesson_content}'
                with open(lesson_path, 'w') as f:
                    f.write(new_content)
                
                # Get old time for comparison
                old_match = re.search(r'estimatedMinutes:\s*(\d+)', frontmatter)
                old_time = int(old_match.group(1)) if old_match else None
                
                updated.append({
                    "path": lesson_path,
                    "old": old_time,
                    "new": estimated_time,
                    "words": words,
                    "exercise": has_exercise
                })
                
            except Exception as e:
                print(f"Error processing {lesson_path}: {e}")
    
    return updated

if __name__ == "__main__":
    print("Calculating realistic reading times...")
    print("(Accounting for code reading ~110 wpm + 5min for exercises)")
    print()
    
    updated = update_all_lesson_times()
    
    total_old = sum(item["old"] for item in updated if item["old"])
    total_new = sum(item["new"] for item in updated)
    
    print(f"✅ Updated {len(updated)} lessons")
    print(f"\nTime Changes:")
    print(f"  Old total: {total_old} minutes ({total_old/60:.1f} hours)")
    print(f"  New total: {total_new} minutes ({total_new/60:.1f} hours)")
    print(f"  Difference: {total_new - total_old:+d} minutes ({abs(total_new - total_old)/60:.1f} hours)")
    
    if updated:
        print("\nSample updates:")
        for item in updated[:5]:
            name = os.path.basename(os.path.dirname(item["path"]))
            old_str = f"{item['old']}min" if item['old'] else "N/A"
            ex_str = "with exercise" if item['exercise'] else "no exercise"
            print(f"  {name}: {old_str} → {item['new']}min ({item['words']} words, {ex_str})")

