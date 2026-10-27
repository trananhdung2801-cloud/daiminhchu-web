import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\index.html", "r", encoding="utf-8") as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if 'id="tab-formation"' in l:
        print(f"tab-formation at line {i+1}")
        for j in range(i, min(len(lines), i + 40)):
            print(f"{j+1}: {lines[j]}", end="")
        break
