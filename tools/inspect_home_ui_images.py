import os
from PIL import Image

ui_path = r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/assets/ui'

for fname in sorted(os.listdir(ui_path)):
    fpath = os.path.join(ui_path, fname)
    if fname.endswith(('.png', '.jpg', '.jfif')):
        if any(w in fname.lower() for w in ['trangchu', 'menu', 'btn', 'bar', 'khung', 'frame', 'tab', 'cloud', 'icon_vip', 'icon_bac', 'icon_level', 'kinhmach', 'longchau', 'fanpage']):
            try:
                with Image.open(fpath) as im:
                    print(f"{fname:35s} | size: {im.size} | mode: {im.mode}")
            except Exception as e:
                pass
