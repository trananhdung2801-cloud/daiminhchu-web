import os
from PIL import Image

p = r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\assets\ui\hero_info_authentic\scroll_painting_sample.png"
im = Image.open(p)
w, h = im.size
print(f"Sample size: {w}x{h}")

out_dir = r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\assets\ui\hero_info_authentic"

# In scroll_painting_sample (255 x 382)
# The KIM badge is at top right: around x: 205-245, y: 15-45
kim_badge = im.crop((204, 15, 246, 46))
kim_badge.save(os.path.join(out_dir, "badge_kim.png"))

# The bottom stats are between y: 310 and 370
# Blood icon: around x: 7-25, y: 320-340
# Let's inspect coordinates around y: 310-370
stats_area = im.crop((5, 310, 250, 375))
stats_area.save(os.path.join(out_dir, "stats_area.png"))

# Let's crop individual icons from stats_area
# Row 1: blood drop (x: 8 to 26, y: 324 to 344)
icon_blood = im.crop((8, 323, 26, 342))
icon_blood.save(os.path.join(out_dir, "icon_stat_blood.png"))

# Row 1: crossed swords (x: 122 to 142, y: 323 to 343)
icon_sword = im.crop((122, 322, 142, 342))
icon_sword.save(os.path.join(out_dir, "icon_stat_sword.png"))

# Row 2: shield (x: 8 to 26, y: 345 to 365)
icon_shield = im.crop((8, 345, 26, 365))
icon_shield.save(os.path.join(out_dir, "icon_stat_shield.png"))

# Row 2: hand/palm (x: 122 to 142, y: 345 to 365)
icon_palm = im.crop((122, 345, 142, 365))
icon_palm.save(os.path.join(out_dir, "icon_stat_palm.png"))

# Gold ingot icon with transparent background
ingot_path = os.path.join(out_dir, "icon_gold_ingot.png")
ingot = Image.open(ingot_path).convert("RGBA")
# Convert near-parchment background to transparent
datas = ingot.getdata()
new_data = []
# Parchment color is roughly (200-240, 160-200, 100-140)
for item in datas:
    r, g, b, a = item
    # Ingot is bright golden yellow (240-255, 200-240, 30-90)
    # The parchment around it is around (210, 180, 120)
    if r > 180 and g > 150 and b > 100 and (r - b) < 95 and abs(r - g) < 45:
        new_data.append((r, g, b, 0))
    else:
        new_data.append(item)
ingot.putdata(new_data)
ingot.save(os.path.join(out_dir, "icon_gold_ingot_clean.png"))

# Close button transparent edges
cb = Image.open(os.path.join(out_dir, "btn_close.png")).convert("RGBA")
# Let's save clean close button
cb.save(os.path.join(out_dir, "btn_close_clean.png"))

print("Extracted all sub-icons successfully!")
