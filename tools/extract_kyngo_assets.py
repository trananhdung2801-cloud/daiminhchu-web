import os, sys
from PIL import Image, ImageDraw

sys.stdout.reconfigure(encoding='utf-8')

im_path = r'C:\Users\trananh.dung\.gemini\antigravity\brain\c5662992-6914-4398-a616-eb4454ce7882\.user_uploaded\media_1793066635941_fb2af011.jpg'
im = Image.open(im_path)
W, H = im.size
print('Loaded ky ngo image:', W, H)

out_dir = 'public/assets/ui/kyngo_authentic'
os.makedirs(out_dir, exist_ok=True)

def make_clean_round(im_crop, radius=12):
    im_rgba = im_crop.convert('RGBA')
    w, h = im_rgba.size
    mask = Image.new('L', (w, h), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle((0, 0, w - 1, h - 1), radius=radius, fill=255)
    im_rgba.putalpha(mask)
    return im_rgba

# 1. Icon 1: Thể Lực (x=34..124, y=118..214)
i1 = im.crop((34, 118, 124, 214))
make_clean_round(i1, 10).save(os.path.join(out_dir, 'icon_theluc.png'))

# 2. Icon 2: Bế Quan (x=128..218, y=118..214)
i2 = im.crop((128, 118, 218, 214))
make_clean_round(i2, 10).save(os.path.join(out_dir, 'icon_bequan.png'))

# 3. Icon 3: Tham Bái (x=222..312, y=118..214)
i3 = im.crop((222, 118, 312, 214))
make_clean_round(i3, 10).save(os.path.join(out_dir, 'icon_thambai.png'))

# 4. Icon 4: Tiểu Bảo (x=316..406, y=118..214)
i4 = im.crop((316, 118, 406, 214))
make_clean_round(i4, 10).save(os.path.join(out_dir, 'icon_tieubao.png'))

# 5. Icon 5: Thương Nhân (x=410..474, y=118..214) - extend width slightly to 90
# We can take x=410..474 and pad or mirror
i5 = im.crop((410, 118, 474, 214))
make_clean_round(i5, 10).save(os.path.join(out_dir, 'icon_thuongnhan.png'))

# 6. Main scene "Ăn Gà": y=225..825
scene = im.crop((0, 225, W, 825))
scene.save(os.path.join(out_dir, 'scene_an_ga_full.png'))

print('All Kỳ Ngộ assets extracted successfully!')
