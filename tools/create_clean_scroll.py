from PIL import Image, ImageDraw

top_roller = Image.open('public/assets/ui/dantran_authentic/scroll_top_roller.png')
bottom_roller = Image.open('public/assets/ui/dantran_authentic/scroll_bottom_roller.png')

W = 350
H = 560

scroll = Image.new('RGBA', (W, H), (0, 0, 0, 0))
draw = ImageDraw.Draw(scroll)

# Canvas width: 326 (margin 12 on each side)
canvas_left = 12
canvas_right = 338
canvas_top = 22
canvas_bottom = H - 18

# Fill parchment paper with warm ivory antique gradient
for y in range(canvas_top, canvas_bottom):
    t = (y - canvas_top) / (canvas_bottom - canvas_top)
    r = int(248 * (1 - t) + 232 * t)
    g = int(238 * (1 - t) + 215 * t)
    b = int(218 * (1 - t) + 188 * t)
    draw.line((canvas_left, y, canvas_right, y), fill=(r, g, b, 255))

# Draw parchment side borders (subtle silk mounting)
draw.line((canvas_left, canvas_top, canvas_left, canvas_bottom), fill=(160, 110, 60, 255), width=2)
draw.line((canvas_right, canvas_top, canvas_right, canvas_bottom), fill=(160, 110, 60, 255), width=2)

# Paste top roller & bottom roller
scroll.paste(top_roller, (0, 0), top_roller if top_roller.mode == 'RGBA' else None)
scroll.paste(bottom_roller, (0, H - 20), bottom_roller if bottom_roller.mode == 'RGBA' else None)

scroll.save('public/assets/ui/dantran_authentic/hanging_scroll_clean.png')
print('Created hanging_scroll_clean.png size:', scroll.size)
