from PIL import Image
import os

out_dir = r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\assets\ui\trangbi_authentic"
for f in os.listdir(out_dir):
    p = os.path.join(out_dir, f)
    im = Image.open(p)
    print(f"{f}: {im.size}")
