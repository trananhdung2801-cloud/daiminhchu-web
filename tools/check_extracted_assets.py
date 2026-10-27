import os
from PIL import Image

dir_path = r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\assets\ui\hero_info_authentic"
for f in os.listdir(dir_path):
    p = os.path.join(dir_path, f)
    if os.path.isfile(p):
        im = Image.open(p)
        print(f"{f}: size={im.size}, mode={im.mode}")
