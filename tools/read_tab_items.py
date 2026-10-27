import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\index.html", "r", encoding="utf-8") as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if 'id="tab-items"' in l:
        print(f"tab-items found at line {i+1}")
        for j in range(i, min(len(lines), i + 45)):
            print(f"{j+1}: {lines[j]}", end="")
        break
