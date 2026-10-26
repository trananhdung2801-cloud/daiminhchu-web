import json

with open('full_audit_results.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

with open('all_screen_details_utf8.txt', 'w', encoding='utf-8') as out:
    for item in data:
        out.write(f"=== [{item['index']:02d}] {item['filename']} ===\n")
        for l in item['lines']:
            out.write(f"  * {l}\n")
        out.write("\n")
print("Done writing all_screen_details_utf8.txt")
