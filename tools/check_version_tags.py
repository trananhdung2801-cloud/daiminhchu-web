with open(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\index.html", "r", encoding="utf-8") as f:
    lines = f.readlines()

for i, l in enumerate(lines[:30]):
    if "v=" in l:
        print(f"{i+1}: {l.strip()}")

for i, l in enumerate(lines[-30:]):
    if "v=" in l:
        print(f"{len(lines)-30+i+1}: {l.strip()}")
