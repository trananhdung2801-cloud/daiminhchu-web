with open(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\js\game.js", "r", encoding="utf-8", errors="ignore") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "disciple-detail-modal" in line or "showDiscipleDetail" in line or "openDiscipleDetail" in line:
        print(f"{i+1}: {line.strip()[:150]}")
