from PIL import Image, ImageDraw
import os

out_dir = r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\assets\ui\hero_info_authentic"

# 1. Close button rounded mask
cb = Image.open(os.path.join(out_dir, "btn_close.png")).convert("RGBA")
w, h = cb.size
mask = Image.new("L", (w, h), 0)
draw = ImageDraw.Draw(mask)
draw.rounded_rectangle([1, 1, w - 2, h - 2], radius=8, fill=255)
cb.putalpha(mask)
cb.save(os.path.join(out_dir, "btn_close.png"))
print("btn_close polished")

# 2. Center crest: circular mask
cc = Image.open(os.path.join(out_dir, "center_crest.png")).convert("RGBA")
cw, ch = cc.size
# Find center circle: center is roughly (cw/2, ch/2), radius roughly min(cw, ch)/2 - 2
cmask = Image.new("L", (cw, ch), 0)
cdraw = ImageDraw.Draw(cmask)
cdraw.ellipse([2, 2, cw - 3, ch - 3], fill=255)
cc.putalpha(cmask)
cc.save(os.path.join(out_dir, "center_crest.png"))
print("center_crest polished")

# 3. Stat icons transparency
# Icons have dark or light background from the painting.
# Let's inspect icon_stat_blood, sword, shield, palm
for name in ["icon_stat_blood.png", "icon_stat_sword.png", "icon_stat_shield.png", "icon_stat_palm.png"]:
    p = os.path.join(out_dir, name)
    icon = Image.open(p).convert("RGBA")
    iw, ih = icon.size
    imask = Image.new("L", (iw, ih), 0)
    idraw = ImageDraw.Draw(imask)
    idraw.ellipse([0, 0, iw - 1, ih - 1], fill=255)
    icon.putalpha(imask)
    icon.save(p)

# 4. KIM badge rounded mask
kb = Image.open(os.path.join(out_dir, "badge_kim.png")).convert("RGBA")
kw, kh = kb.size
kmask = Image.new("L", (kw, kh), 0)
kdraw = ImageDraw.Draw(kmask)
kdraw.rounded_rectangle([0, 0, kw - 1, kh - 1], radius=4, fill=255)
kb.putalpha(kmask)
kb.save(os.path.join(out_dir, "badge_kim.png"))

print("All assets polished successfully!")
