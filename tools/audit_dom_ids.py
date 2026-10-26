import sys
import re
sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/js/game.js', 'r', encoding='utf-8') as f:
    js_code = f.read()

with open(r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/index.html', 'r', encoding='utf-8') as f:
    html_code = f.read()

ids_in_js = re.findall(r"document\.getElementById\(['\"]([a-zA-Z0-9_-]+)['\"]\)", js_code)
unique_ids = sorted(set(ids_in_js))

print(f"Total unique IDs accessed in game.js: {len(unique_ids)}")
missing_ids = []
for el_id in unique_ids:
    if f'id="{el_id}"' not in html_code and f"id='{el_id}'" not in html_code:
        missing_ids.append(el_id)

print("\n--- MISSING IDS IN INDEX.HTML ---")
for m in missing_ids:
    print(' -', m)
