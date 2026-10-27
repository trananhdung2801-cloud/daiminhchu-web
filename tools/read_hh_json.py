import json
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\data\config\NhanVat.txt", "r", encoding="utf-8", errors="ignore") as f:
    data = json.load(f)

hh = data.get("NV_HuongHuongCongChua", {})
print("Ten:", hh.get("TenHienThi"))
print("MoTa:", hh.get("MoTa"))
print("VoCong:", hh.get("VoCongMacDinh"))
print("DuyenPhan:")
for dp in hh.get("DuyenPhan", []):
    print(" ", dp)
