import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\index.html", "r", encoding="utf-8") as f:
    lines = f.readlines()

capture = False
count = 0
for i, line in enumerate(lines):
    if 'id="disciple-detail-modal"' in line:
        capture = True
    if capture:
        print(f"{i+1}: {line}", end="")
        count += 1
        if "</div" in line and count > 70:
            break
