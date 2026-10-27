import os

for f in os.listdir(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\data\config"):
    p = os.path.join(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\data\config", f)
    with open(p, "r", encoding="utf-8", errors="ignore") as file:
        content = file.read()
        if "BangPhach" in content or "Băng Phách" in content or "VC_" in content:
            print(f"Found in config: {f}")
