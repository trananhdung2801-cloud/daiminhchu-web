from PIL import Image, ImageDraw
import os

p1 = r'C:/Users/trananh.dung/.gemini/antigravity/brain/c5662992-6914-4398-a616-eb4454ce7882/.user_uploaded/media_1793011112192_6fe80186.jpg'
out_dir = r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/assets/ui/home_authentic'

im = Image.open(p1)
W, H = im.size # 576, 1024

header_crop = im.crop((0, 74, 576, 155)) # 576 x 81
header_clean = header_crop.copy()
draw = ImageDraw.Draw(header_clean)

# 1. Level wheel circle: Center (39, 43), fill inner circle cleanly with dark red
draw.ellipse((18, 22, 60, 64), fill=(82, 22, 12))

# 2. Player name region: x=74..270, y=0..40.
# Sample background color from x=65..72 and fill smoothly
name_bg = header_crop.crop((66, 4, 72, 38)).resize((200, 34))
header_clean.paste(name_bg, (74, 4))

# 3. EXP bar: x=75..248, y=40..60.
# Fill exp bar interior cleanly with dark reddish-brown #3b1408 and dark gold border
draw.rounded_rectangle((74, 40, 250, 60), radius=10, fill=(58, 20, 8), outline=(130, 60, 20), width=2)

# 4. VIP badge area: x=272..335, y=5..38.
vip_bg = header_crop.crop((262, 5, 268, 38)).resize((65, 33))
header_clean.paste(vip_bg, (272, 5))

# 5. Right stats area:
# Row 1 (Gold count & Stamina count):
# Gold icon is at x=342..372, y=8..36 (KEEP IT!)
# Gold text was at x=375..470, y=8..36 -> clear with clean brown background
gold_num_bg = header_crop.crop((262, 8, 268, 36)).resize((100, 28))
header_clean.paste(gold_num_bg, (375, 8))

# Stamina icon is at x=475..505, y=8..36 (KEEP IT!)
# Stamina text was at x=508..572, y=8..36 -> clear
stam_num_bg = header_crop.crop((262, 8, 268, 36)).resize((65, 28))
header_clean.paste(stam_num_bg, (508, 8))

# Row 2 (Silver count & Qi count):
# Silver icon is at x=342..372, y=40..74 (KEEP IT!)
# Silver text was at x=375..470, y=40..74 -> clear
silv_num_bg = header_crop.crop((262, 42, 268, 70)).resize((100, 28))
header_clean.paste(silv_num_bg, (375, 42))

# Qi icon is at x=475..505, y=40..74 (KEEP IT!)
# Qi text was at x=508..572, y=40..74 -> clear
qi_num_bg = header_crop.crop((262, 42, 268, 70)).resize((65, 28))
header_clean.paste(qi_num_bg, (508, 42))

header_clean.save(os.path.join(out_dir, 'header_profile_perfect.png'))
print('header_profile_perfect.png completely scrubbed clean of all old text and numbers!')
