import json

with open('full_audit_results.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for item in data:
    lines = [l.strip() for l in item['lines'] if l.strip()]
    header = ' | '.join(lines[:6])
    print(f"[{item['index']:02d}] {item['filename']} -> {header[:120]}")
