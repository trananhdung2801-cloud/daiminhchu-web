import sys, os
from PIL import Image
sys.stdout.reconfigure(encoding='utf-8')

os.chdir(r'C:\Users\trananh.dung\Downloads\DaiMinhChu_Server')
out_dir = r'public/assets/ui/luyencong_authentic'
os.makedirs(out_dir, exist_ok=True)

src_path = r'C:\Users\trananh.dung\.gemini\antigravity\brain\c5662992-6914-4398-a616-eb4454ce7882\.user_uploaded\media_1793068206949_7469be7e.jpg'
im = Image.open(src_path)
w, h = im.size

# 1. Ticker Bar
im.crop((0, 0, w, 38)).save(os.path.join(out_dir, 'ticker_bar_bg.png'))

# 2. Icons
icons = {
    'icon_ngunhac.png': (34, 50, 122, 158),
    'icon_vantieu.png': (132, 50, 220, 158),
    'icon_luyendieu.png': (230, 48, 322, 160),
    'icon_tu_cung.png': (332, 50, 420, 158),
    'icon_tongkim.png': (432, 50, 510, 158)
}
for filename, box in icons.items():
    c = im.crop(box)
    c.save(os.path.join(out_dir, filename))

# 3. Buttons: 'Bắt đầu' and 'Top'
im.crop((120, 588, 245, 665)).save(os.path.join(out_dir, 'btn_batdau_ld.png'))
im.crop((315, 588, 440, 665)).save(os.path.join(out_dir, 'btn_top_ld.png'))

# 4. Bird (Transparent PNG)
bird_raw = im.crop((235, 468, 308, 530)).convert('RGBA')
bw, bh = bird_raw.size
pixels = bird_raw.load()
visited = [[False]*bh for _ in range(bw)]
queue = []
for x in range(bw):
    queue.append((x, 0))
    queue.append((x, bh-1))
for y in range(bh):
    queue.append((0, y))
    queue.append((bw-1, y))

while queue:
    x, y = queue.pop(0)
    if x < 0 or x >= bw or y < 0 or y >= bh:
        continue
    if visited[x][y]:
        continue
    visited[x][y] = True

    r, g, b, a = pixels[x, y]
    is_outline = (r < 65 and g < 65 and b < 65)
    if not is_outline:
        pixels[x, y] = (0, 0, 0, 0)
        for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            nx, ny = x + dx, y + dy
            if 0 <= nx < bw and 0 <= ny < bh and not visited[nx][ny]:
                queue.append((nx, ny))

bird_raw.save(os.path.join(out_dir, 'bird_ld.png'))

# 5. Full Stage and Clean Stage
stage = im.crop((0, 180, w, 890))
stage.save(os.path.join(out_dir, 'scene_luyendieu_full.png'))

clean_stage = stage.copy()
for y in range(0, 510):
    c = stage.getpixel((15, y))
    for x in range(15, w-15):
        clean_stage.putpixel((x, y), c)

tile = stage.crop((10, 630, 60, 705))
tw = tile.size[0]
for x in range(60, 480, tw):
    clean_stage.paste(tile.crop((0, 0, min(tw, 480 - x), tile.size[1])), (x, 630))

clean_stage.save(os.path.join(out_dir, 'scene_luyendieu_clean.png'))

print('All 11 Luyện Công assets saved successfully to public/assets/ui/luyencong_authentic/!')
