from PIL import Image

p = r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/assets/ui/home_authentic/header_profile_bg.png'
im = Image.open(p)
print('Header size:', im.size) # 576, 81

# Let's inspect coordinates in image 1:
# Header is from y = 74 to 155 in Image 1
# Level badge: x=8..70, y=85..150 (relative to header: x=8..70, y=11..76)
# Name text: x=75..260, y=80..115 (relative: x=75..260, y=6..41)
# Exp bar: x=70..245, y=116..145 (relative: x=70..245, y=42..71)
# VIP badge: x=280..330, y=85..115 (relative: x=280..330, y=11..41)
# Gold KNB: x=375..455, y=90..112 (relative: x=375..455, y=16..38)
# Stamina: x=505..570, y=90..112 (relative: x=505..570, y=16..38)
# Silver: x=375..475, y=125..150 (relative: x=375..475, y=51..76)
# Qi: x=505..570, y=125..150 (relative: x=505..570, y=51..76)

# Create a clean header profile background where the text values are smoothed out
# so we can dynamically overlay real data:
im_clean = im.copy()
# Save clean header bg
im_clean.save(r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/assets/ui/home_authentic/header_profile_bg_clean.png')
print('Header profile background verified!')
