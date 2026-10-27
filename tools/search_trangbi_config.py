import os

for f in os.listdir(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\data\config"):
    if "TrangBi" in f or "Item" in f or "VK_" in f or "AG_" in f:
        print("Config file:", f)
