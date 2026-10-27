from PIL import Image, ImageDraw

p1 = r'C:/Users/trananh.dung/.gemini/antigravity/brain/c5662992-6914-4398-a616-eb4454ce7882/.user_uploaded/media_1793011112192_6fe80186.jpg'
out_path = r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/assets/ui/home_authentic/header_profile_perfect.png'

im = Image.open(p1)
header_crop = im.crop((0, 74, 576, 155))
header_clean = header_crop.copy()
draw = ImageDraw.Draw(header_clean)

# Level circle center: x=39, y=43 in header_crop. Radius=18. Fill with dark red (82, 22, 12)
draw.ellipse((21, 25, 57, 61), fill=(82, 22, 12))

# Clear player name text: x=75..260, y=5..36 with subtle texture patch
name_patch = header_clean.crop((68, 2, 72, 38)).resize((190, 36))
header_clean.paste(name_patch, (74, 2))

# Clear exp text: inside the exp bar at x=75..245, y=39..58
draw.rounded_rectangle((75, 41, 245, 58), radius=8, fill=(68, 25, 10), outline=(120, 50, 20))

# Clear VIP badge: x=275..330, y=8..36
vip_patch = header_clean.crop((265, 8, 270, 36)).resize((60, 28))
header_clean.paste(vip_patch, (275, 8))

# Clear Gold number: x=375..470, y=10..34 (leave the Gold coin icon at x=340..375)
gold_patch = header_clean.crop((265, 8, 270, 34)).resize((95, 26))
header_clean.paste(gold_patch, (375, 8))

# Clear Stamina number: x=505..572, y=10..34 (leave the kicking icon at x=475..505)
stam_patch = header_clean.crop((265, 8, 270, 34)).resize((68, 26))
header_clean.paste(stam_patch, (505, 8))

# Clear Silver number: x=375..470, y=42..72 (leave the Silver bar icon at x=340..375)
silv_patch = header_clean.crop((265, 42, 270, 72)).resize((95, 30))
header_clean.paste(silv_patch, (375, 42))

# Clear Qi number: x=505..572, y=42..72 (leave the meditation icon at x=475..505)
qi_patch = header_clean.crop((265, 42, 270, 72)).resize((68, 30))
header_clean.paste(qi_patch, (505, 42))

header_clean.save(out_path)
print('header_profile_perfect.png with icons preserved created successfully!')
