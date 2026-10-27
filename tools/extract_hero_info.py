from PIL import Image
import os

img_path = r"C:\Users\trananh.dung\.gemini\antigravity\brain\c5662992-6914-4398-a616-eb4454ce7882\.user_uploaded\media_1793068478768_2e8b405c.jpg"
img = Image.open(img_path)
w, h = img.size
print(f"Loaded image {w}x{h}")

out_dir = r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\assets\ui\hero_info_authentic"
os.makedirs(out_dir, exist_ok=True)

# 1. Close Button (top-right red box with X)
# Let's inspect around x: 410-470, y: 70-130
btn_close = img.crop((420, 77, 469, 126))
btn_close.save(os.path.join(out_dir, "btn_close.png"))

# 2. Main Parchment Modal Box background
# From around y: 88 to y: 835, x: 10 to 462
parchment_bg = img.crop((12, 88, 462, 832))
parchment_bg.save(os.path.join(out_dir, "parchment_bg_full.png"))

# 3. Action Buttons in the middle
# Around y: 510 to 585
btn_swap = img.crop((29, 514, 199, 580))
btn_swap.save(os.path.join(out_dir, "btn_swap_hero.png"))

center_star = img.crop((195, 510, 275, 583))
center_star.save(os.path.join(out_dir, "center_crest.png"))

btn_transfer = img.crop((270, 514, 442, 580))
btn_transfer.save(os.path.join(out_dir, "btn_transfer.png"))

# 4. Scroll frame / Scroll rod
scroll_top = img.crop((20, 128, 275, 155))
scroll_top.save(os.path.join(out_dir, "scroll_top_rod.png"))

scroll_bottom = img.crop((20, 480, 275, 510))
scroll_bottom.save(os.path.join(out_dir, "scroll_bottom_rod.png"))

# Scroll full painting
scroll_painting = img.crop((20, 128, 275, 510))
scroll_painting.save(os.path.join(out_dir, "scroll_painting_sample.png"))

# 5. Skill box
# Around x: 310 to 395, y: 360 to 445
skill_box = img.crop((310, 360, 395, 445))
skill_box.save(os.path.join(out_dir, "skill_sample.png"))

# 6. Gold Ingot icon
gold_icon = img.crop((370, 470, 403, 496))
gold_icon.save(os.path.join(out_dir, "icon_gold_ingot.png"))

# 7. Parchment paper texture sample (clean background for reuse)
paper_texture = img.crop((100, 600, 370, 800))
paper_texture.save(os.path.join(out_dir, "paper_texture.png"))

print("Extracted assets successfully!")
