import re

with open(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\index.html", "r", encoding="utf-8") as f:
    html = f.read()

tabs = re.findall(r'<div[^>]*id=["\'](tab-[^"\']+)["\'][^>]*>', html)
print("Found tabs:", tabs)
