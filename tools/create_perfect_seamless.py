from PIL import Image, ImageDraw
import os

p1 = r'C:/Users/trananh.dung/.gemini/antigravity/brain/c5662992-6914-4398-a616-eb4454ce7882/.user_uploaded/media_1793011112192_6fe80186.jpg'
out_dir = r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/assets/ui/home_authentic'
os.makedirs(out_dir, exist_ok=True)

im = Image.open(p1)
W, H = im.size # 576, 1024

# 1. Top Ticker (y=36..74)
top_ticker = im.crop((0, 36, W, 74))
top_ticker.save(os.path.join(out_dir, 'top_ticker_perfect.png'))

# 2. Header Bar (y=74..155) -> height 81px
header_crop = im.crop((0, 74, W, 155))
header_clean = header_crop.copy()
draw = ImageDraw.Draw(header_clean)

# Level circle center: x=39, y=43 in header_crop. Radius=18. Fill with dark red (82, 22, 12)
draw.ellipse((21, 25, 57, 61), fill=(82, 22, 12))

# Clear player name text: x=75..260, y=5..36. Sample bg color around it (195, 140, 105) -> (210, 160, 125)
# Let's patch with a smooth gradient / subtle texture
name_patch = header_clean.crop((70, 2, 74, 38)).resize((190, 36))
header_clean.paste(name_patch, (74, 2))

# Clear exp text: inside the exp bar at x=75..245, y=39..58
# The exp bar background inside is dark brown (68, 25, 10)
draw.rounded_rectangle((75, 41, 245, 58), radius=8, fill=(68, 25, 10), outline=(120, 50, 20))

# Clear numbers on the right side:
# VIP area: x=275..335, y=10..38 -> patch
# Gold count: x=380..470, y=10..35
# Stamina count: x=510..570, y=10..35
# Silver count: x=380..475, y=42..72
# Qi count: x=510..570, y=42..72
patch_right_top = header_clean.crop((260, 5, 270, 35)).resize((300, 30))
header_clean.paste(patch_right_top, (275, 5))

patch_right_bottom = header_clean.crop((260, 42, 270, 72)).resize((300, 30))
header_clean.paste(patch_right_bottom, (275, 42))

header_clean.save(os.path.join(out_dir, 'header_profile_perfect.png'))

# 3. Middle Main Stage (y=155..890) -> height 735px
# This contains the entire seamless mountain, cloud, disciples, 6 wooden buttons, 6 activity icons, 6 utility buttons!
main_stage = im.crop((0, 155, W, 890))
main_stage.save(os.path.join(out_dir, 'home_main_stage_perfect.png'))

# 4. Bottom Navigation Bar (y=890..975) -> height 85px
bottom_nav = im.crop((0, 890, W, 975))
bottom_nav.save(os.path.join(out_dir, 'bottom_nav_perfect.png'))

print("All 4 perfect seamless assets created successfully!")
print("Top ticker size:", top_ticker.size)
print("Header profile size:", header_clean.size)
print("Main stage size:", main_stage.size)
print("Bottom nav size:", bottom_nav.size)
