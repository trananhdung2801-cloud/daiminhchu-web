import json

with open(r'C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\audit_all_37_images.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for item in data:
    txt = item['Text'].replace('\n', ' | ')
    print(f"[{item['FileName']}]: {txt}\n")
