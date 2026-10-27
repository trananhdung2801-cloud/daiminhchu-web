import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\data\config\NhanVat.txt", "r", encoding="utf-8", errors="ignore") as f:
    lines = f.readlines()

capture = False
count = 0
for line in lines:
    if "NV_HuongHuongCongChua" in line:
        capture = True
    if capture:
        print(line, end="")
        count += 1
        if count > 40:
            break
