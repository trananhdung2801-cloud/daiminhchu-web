from PIL import Image, ImageFilter
import os

out_dir = r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\assets\ui\vocong_info_authentic"
bg = Image.open(os.path.join(out_dir, "vocong_modal_full.png")).convert("RGBA")
bw, bh = bg.size

# Clean right side text area: x: 340 to 555, y: 80 to 440
# Sample wood/leather texture from x: 345 to 550, y: 400 to 440
wood_sample = bg.crop((350, 400, 540, 440))
for yy in range(90, 420, 30):
    bg.paste(wood_sample, (345, yy))

bg_clean = bg.filter(ImageFilter.GaussianBlur(0.5))

# Also clean the scroll area so we can render dynamic scroll
# Sample parchment paper from x: 30 to 330, y: 640 to 720
paper_sample = bg.crop((30, 640, 330, 700))
for yy in range(80, 560, 50):
    bg.paste(paper_sample, (20, yy))

# Re-paste the header title, close button, and outer wooden frame
bg.save(os.path.join(out_dir, "vocong_modal_bg_clean.png"))

# Create clean scroll canvas
sc = Image.open(os.path.join(out_dir, "scroll_vocong_sample.png")).convert("RGBA")
sw, sh = sc.size
# Center paper area is x: 20 to 290, y: 30 to 440
paper_patch = sc.crop((30, 40, 280, 110))
# Clean center art area
clean_sc = sc.copy()
for yy in range(120, 360, 60):
    clean_sc.paste(paper_patch, (25, yy))

clean_sc = clean_sc.filter(ImageFilter.GaussianBlur(0.5))
# Re-paste top roller rod, bottom roller rod, and bottom stat bar
top_rod = sc.crop((0, 0, sw, 35))
bot_rod = sc.crop((0, sh - 35, sw, sh))
clean_sc.paste(top_rod, (0, 0))
clean_sc.paste(bot_rod, (0, sh - 35))
clean_sc.save(os.path.join(out_dir, "scroll_vocong_clean.png"))

print("Created clean vocong modal bg & clean scroll canvas successfully!")
