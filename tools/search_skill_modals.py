import re, sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\index.html", "r", encoding="utf-8") as f:
    html = f.read()

matches = re.findall(r'<div[^>]*id=["\'][^"\']*(?:skill|vocong)[^"\']*["\'][^>]*>', html, re.IGNORECASE)
print("Skill modal matches in index.html:")
for m in matches:
    print(m)
