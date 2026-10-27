import json, sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\data\config\TrangBi.txt", "r", encoding="utf-8", errors="ignore") as f:
    data = json.load(f)

for k, v in data.items():
    if "HongTi" in k or "Hồng Ti" in v.get("TenHienThi", ""):
        print(k, v)
