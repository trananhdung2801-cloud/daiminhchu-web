import json, sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\data\config\VoCong.txt", "r", encoding="utf-8", errors="ignore") as f:
    data = json.load(f)

print(f"Total skills in VoCong.txt: {len(data)}")
for k, v in list(data.items())[:10]:
    print(k, v.get("TenHienThi"), v.get("Hang"), v.get("MoTa")[:50] if v.get("MoTa") else "")
