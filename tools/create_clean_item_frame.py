from PIL import Image, ImageDraw

# Create 82x82 clean card frame
W, H = 82, 82
im = Image.new('RGBA', (W, H), (0, 0, 0, 0))
draw = ImageDraw.Draw(im)

# Fill with subtle light-blue gradient matching the screenshot
for y in range(3, H - 3):
    t = y / H
    r = int(220 * (1 - t) + 240 * t)
    g = int(235 * (1 - t) + 248 * t)
    b = int(245 * (1 - t) + 255 * t)
    draw.rounded_rectangle((3, 3, W - 4, H - 4), radius=10, fill=(r, g, b, 255))

# Draw ornate double border
draw.rounded_rectangle((2, 2, W - 3, H - 3), radius=10, outline=(140, 165, 185, 255), width=2)
draw.rounded_rectangle((4, 4, W - 5, H - 5), radius=8, outline=(180, 205, 225, 255), width=1)

im.save('public/assets/ui/vatpham_authentic/item_frame_clean.png')
print('Created item_frame_clean.png successfully!')
