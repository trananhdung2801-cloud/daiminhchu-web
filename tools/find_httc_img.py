import os

img_dir = r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\assets\images"
for f in os.listdir(img_dir):
    if "HongTi" in f:
        print("Found image:", f)
