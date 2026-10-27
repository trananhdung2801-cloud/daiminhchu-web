import re

with open(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\index.html", "r", encoding="utf-8") as f:
    html = f.read()

matches = re.findall(r'<div[^>]*id=["\'][^"\']*(?:dantran|formation|hero|disciple|info)[^"\']*["\'][^>]*>', html, re.IGNORECASE)
print("Matches in index.html:")
for m in matches[:20]:
    print(m)
