import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\js\game.js", "r", encoding="utf-8", errors="ignore") as f:
    for i, line in enumerate(f):
        if "openDiscipleDetailModal" in line:
            print(f"{i+1}: {line.strip()}")
