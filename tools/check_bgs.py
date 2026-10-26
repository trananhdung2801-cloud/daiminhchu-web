import os
from PIL import Image

ui_dir = r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/assets/ui'
for f in os.listdir(ui_dir):
    if 'bg' in f.lower() or 'background' in f.lower():
        p = os.path.join(ui_dir, f)
        if os.path.isfile(p):
            try:
                with Image.open(p) as im:
                    print(f"{f:30s} | {im.size}")
            except:
                pass
