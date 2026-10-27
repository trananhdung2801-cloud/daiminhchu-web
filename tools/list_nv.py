import os

img_dir = r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\assets\images"
all_files = os.listdir(img_dir)
nv_files = [f for f in all_files if f.startswith("NV_")]
print(f"Found {len(nv_files)} NV_ files in images/")
for f in nv_files[:30]:
    print(f)
