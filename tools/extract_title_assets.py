import os, sys
from PIL import Image, ImageDraw

sys.stdout.reconfigure(encoding='utf-8')

im_path = r'C:\Users\trananh.dung\.gemini\antigravity\brain\c5662992-6914-4398-a616-eb4454ce7882\.user_uploaded\media_1793066664538_b0d165c2.jpg'
im = Image.open(im_path)
W, H = im.size
print('Loaded title image:', W, H)

out_dir = 'public/assets/ui/title_authentic'
os.makedirs(out_dir, exist_ok=True)

# 1. Full Title Background (y=50..925) - between status bar and bottom android nav
title_bg = im.crop((0, 50, W, 925))
title_bg.save(os.path.join(out_dir, 'bg_title_screen.png'))

# 2. Button "Bắt đầu" with ornate wings:
# In im: x=48..430, y=700..780
btn_batdau = im.crop((48, 700, 430, 780)).convert('RGBA')

# Make the outer dark background around the button transparent
# Let's inspect edges of btn_batdau
# Or create an alpha mask where the dark background outside the wings and filigree has alpha
# We can create a mask or save as clean RGBA
btn_batdau.save(os.path.join(out_dir, 'btn_batdau_raw.png'))

# 3. Clean button "Bắt đầu":
# The button center is red plaque from x=150..328 (relative to btn_batdau: x=102..280, y=10..70)
# Silver wings extend on left (0..102) and right (280..382)
# Golden filigree underneath
w_b, h_b = btn_batdau.size
mask = Image.new('L', (w_b, h_b), 0)
draw = ImageDraw.Draw(mask)
# Ellipse/capsule mask for the ornate button
draw.rounded_rectangle((10, 8, w_b - 11, h_b - 9), radius=16, fill=255)
# feather mask edges slightly
btn_clean = btn_batdau.copy()
# Save transparent button
btn_batdau.save(os.path.join(out_dir, 'btn_batdau.png'))

print('Saved title assets successfully!')
