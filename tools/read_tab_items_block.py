import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\index.html", "r", encoding="utf-8") as f:
    lines = f.readlines()

for i in range(820, 834):
    print(f"{i+1}: {lines[i]}", end="")
