import os
from PIL import Image

dir_p = r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/assets/ui/home_authentic'
for f in sorted(os.listdir(dir_p)):
    p = os.path.join(dir_p, f)
    with Image.open(p) as im:
        print(f"{f:30s} | {im.size} | {im.mode}")
