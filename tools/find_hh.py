import os

img_dir = r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\assets\images"
all_files = os.listdir(img_dir)
hh = [f for f in all_files if "huong" in f.lower()]
print("Huong files:", hh)
