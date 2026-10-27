import sys, os
from PIL import Image
sys.stdout.reconfigure(encoding='utf-8')

os.chdir(r'C:\Users\trananh.dung\Downloads\DaiMinhChu_Server')
out_dir = r'public/assets/ui/battle_authentic'
os.makedirs(out_dir, exist_ok=True)

src_path = r'C:\Users\trananh.dung\.gemini\antigravity\brain\c5662992-6914-4398-a616-eb4454ce7882\.user_uploaded\media_1793068311069_68fd0f94.jpg'
im = Image.open(src_path)
w, h = im.size

# 1. Full Background
im.crop((0, 30, w, 960)).save(os.path.join(out_dir, 'battle_bg_authentic.png'))

# 2. Speed 1X button
im.crop((472, 40, 532, 98)).save(os.path.join(out_dir, 'btn_speed_1x.png'))

# 3. Blood drop icon
im.crop((205, 108, 230, 132)).save(os.path.join(out_dir, 'icon_blood_drop.png'))

# 4. Khí Thế calligraphy
im.crop((30, 905, 130, 948)).save(os.path.join(out_dir, 'khithe_left.png'))

# 5. Energy bars
im.crop((138, 936, 190, 955)).save(os.path.join(out_dir, 'energy_bars.png'))

print('All 5 battle assets extracted to public/assets/ui/battle_authentic/!')
