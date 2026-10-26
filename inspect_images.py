import os
from PIL import Image

orig_folder = r"C:\Users\trananh.dung\Downloads\Ảnh game ĐMC"
sample_folder = r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\assets\ingame_samples"

orig_files = sorted(os.listdir(orig_folder))
print(f"Total orig files: {len(orig_files)}")
for i, f in enumerate(orig_files, 1):
    fp = os.path.join(orig_folder, f)
    im = Image.open(fp)
    print(f"{i:02d}. {f} -> Size: {im.size}, Mode: {im.mode}")
