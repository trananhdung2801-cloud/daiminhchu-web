import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\js\game.js", "r", encoding="utf-8") as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if 'function switchDantranMode' in l:
        for j in range(max(0, i-2), min(len(lines), i + 35)):
            print(f"{j+1}: {lines[j]}", end="")
        break
