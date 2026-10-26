import sys
import re
sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/js/game.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

dangerous = []
for i, line in enumerate(lines):
    if 'innerText' in line and '=' in line:
        # Check if direct document.getElementById without check
        if 'document.getElementById(' in line:
            dangerous.append((i+1, line.strip()))

print(f"Direct unvalidated innerText assignments: {len(dangerous)}")
for line_no, content in dangerous:
    print(f"Line {line_no}: {content}")
