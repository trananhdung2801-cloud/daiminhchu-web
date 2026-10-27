import sys, os
from PIL import Image, ImageDraw
sys.stdout.reconfigure(encoding='utf-8')

os.chdir(r'C:\Users\trananh.dung\Downloads\DaiMinhChu_Server')
out_dir = r'public/assets/ui/boiduong_authentic'
os.makedirs(out_dir, exist_ok=True)

src_path = r'C:\Users\trananh.dung\.gemini\antigravity\brain\c5662992-6914-4398-a616-eb4454ce7882\.user_uploaded\media_1793066806740_cfde29ed.jpg'
im = Image.open(src_path)
w, h = im.size

# 1. Top landscape:
im.crop((0, 0, w, 95)).save(os.path.join(out_dir, 'top_landscape.png'))

# 2. Tab title:
im.crop((16, 23, 195, 93)).save(os.path.join(out_dir, 'tab_title_boiduong.png'))

# 3. Action buttons:
im.crop((90, 788, 300, 870)).save(os.path.join(out_dir, 'btn_quaylai.png'))
im.crop((345, 788, 555, 870)).save(os.path.join(out_dir, 'btn_boiduong.png'))

# 4. Stat icons:
im.crop((365, 183, 400, 218)).save(os.path.join(out_dir, 'stat_hp.png'))
im.crop((495, 183, 530, 218)).save(os.path.join(out_dir, 'stat_atk.png'))
im.crop((365, 230, 400, 265)).save(os.path.join(out_dir, 'stat_def.png'))
im.crop((495, 230, 530, 265)).save(os.path.join(out_dir, 'stat_int.png'))

# 5. Badge Giáp 1:
im.crop((270, 207, 310, 237)).save(os.path.join(out_dir, 'badge_giap1.png'))

# 6. Board & Radio buttons:
board = im.crop((26, 390, 617, 560))
board.crop((44, 46, 80, 82)).save(os.path.join(out_dir, 'radio_pearl_inactive.png'))
board.crop((44, 102, 80, 138)).save(os.path.join(out_dir, 'radio_pearl_active.png'))

bw, bh = board.size
clean_board = board.copy()
draw = ImageDraw.Draw(clean_board)
draw.rectangle([45, 14, bw - 45, bh - 14], fill=(128, 94, 66))
draw.rectangle([14, 45, 45, bh - 45], fill=(128, 94, 66))
draw.rectangle([bw - 45, 45, bw - 14, bh - 45], fill=(128, 94, 66))
clean_board.save(os.path.join(out_dir, 'board_boiduong_clean.png'))

print('All 12 assets extracted successfully to public/assets/ui/boiduong_authentic/!')
