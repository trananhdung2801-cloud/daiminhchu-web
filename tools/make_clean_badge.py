from PIL import Image, ImageDraw

p = r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/assets/ui/home_authentic/level_wheel_badge.png'
im = Image.open(p)
print('Level badge size:', im.size)

# Create an empty level wheel badge by smoothing the center circular area with the dark red background
im_clean = im.copy()
draw = ImageDraw.Draw(im_clean)
# Center of the badge is around (31, 32) with radius ~16
# Fill center with dark reddish-brown #4a150c / #5c180e
draw.ellipse((14, 15, 48, 49), fill=(80, 20, 10))

clean_path = r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/assets/ui/home_authentic/level_wheel_badge_empty.png'
im_clean.save(clean_path)
print('Saved clean empty level badge!')
