import os

img_dir = r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\assets\images"
vc_files = [f for f in os.listdir(img_dir) if f.startswith("VC_")]
print(f"Found {len(vc_files)} VC_ files:")
for f in vc_files[:20]:
    print(" ", f)
