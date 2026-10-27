import json, sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\data\config\VoCong.txt", "r", encoding="utf-8", errors="ignore") as f:
    data = json.load(f)

for k, v in data.items():
    if "BangPhach" in k or "Băng Phách" in v.get("TenHienThi", ""):
        print(k, v)
