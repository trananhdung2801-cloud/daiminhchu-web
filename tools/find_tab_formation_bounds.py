import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\index.html", "r", encoding="utf-8") as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if 'id="tab-formation"' in l:
        for j in range(i, min(len(lines), i + 120)):
            if 'id="dt-view-haucung"' in lines[j]:
                print(f"dt-view-haucung at line {j+1}")
            if 'id="tab-giangho"' in lines[j]:
                print(f"tab-giangho at line {j+1}")
                break
        break
