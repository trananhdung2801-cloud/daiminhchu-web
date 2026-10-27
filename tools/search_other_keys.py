import json
import sys
sys.stdout.reconfigure(encoding='utf-8')

p = r'C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\data\config\Other.txt'
with open(p, 'r', encoding='utf-8', errors='ignore') as f:
    data = json.load(f)

print('Keys in Other.txt:', len(data.keys()))
for k, v in data.items():
    if any(w in k.lower() for w in ['slot', 'doihinh', 'unlock', 'open', 'haucung', 'cap', 'level', 'so_luong', 'soluong', 'detu']):
        print(f" {k}: {v}")
