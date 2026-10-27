import os, sys
from PIL import Image, ImageDraw

sys.stdout.reconfigure(encoding='utf-8')

im_path = r'C:\Users\trananh.dung\.gemini\antigravity\brain\c5662992-6914-4398-a616-eb4454ce7882\.user_uploaded\media_1793066508164_3024b437.jpg'
im = Image.open(im_path)
W, H = im.size
print('Loaded chat image:', W, H)

out_dir = 'public/assets/ui/chat_authentic'
os.makedirs(out_dir, exist_ok=True)

def make_clean_round(im_crop, radius=8):
    im_rgba = im_crop.convert('RGBA')
    w, h = im_rgba.size
    mask = Image.new('L', (w, h), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle((0, 0, w - 1, h - 1), radius=radius, fill=255)
    im_rgba.putalpha(mask)
    return im_rgba

# Tabs (y=156..206)
# Tab 1 "Tất cả": x=18..156
t1 = im.crop((18, 156, 156, 206))
make_clean_round(t1, 8).save(os.path.join(out_dir, 'tab_tatca.png'))

# Tab 2 "Liên Server" (Active): x=160..296
t2 = im.crop((160, 156, 296, 206))
make_clean_round(t2, 8).save(os.path.join(out_dir, 'tab_lienserver_active.png'))

# Tab 3 "Liên minh": x=300..438
t3 = im.crop((300, 156, 438, 206))
make_clean_round(t3, 8).save(os.path.join(out_dir, 'tab_lienminh.png'))

# Button "Chém" (x=345..460, y=765..813)
btn_chem = im.crop((345, 765, 460, 813))
make_clean_round(btn_chem, 6).save(os.path.join(out_dir, 'btn_chem.png'))

# Horn / Megaphone: x=48..102, y=763..814
horn = im.crop((48, 763, 102, 814)).convert('RGBA')
horn.save(os.path.join(out_dir, 'icon_loa_truyentin.png'))

# Yellow spiral badge: x=290..322, y=370..405
spiral = im.crop((290, 370, 322, 405)).convert('RGBA')
spiral.save(os.path.join(out_dir, 'badge_yellow_spiral.png'))

print('Extracted chat assets successfully!')
