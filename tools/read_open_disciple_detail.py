import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\js\game.js", "r", encoding="utf-8") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "function openDiscipleDetailModal" in line:
        for j in range(i, min(len(lines), i + 25)):
            print(f"{j+1}: {lines[j]}", end="")
        break
