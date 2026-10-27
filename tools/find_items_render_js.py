import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\js\game.js", "r", encoding="utf-8", errors="ignore") as f:
    for i, l in enumerate(f):
        if "items-container" in l or "renderItems" in l or "switchTrangBi" in l:
            print(f"{i+1}: {l.strip()[:140]}")
