import os
import sys
sys.stdout.reconfigure(encoding='utf-8')

ui_dir = r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/assets/ui'
for f in os.listdir(ui_dir):
    f_l = f.lower()
    if any(k in f_l for k in ['go', 'the', 'wood', 'btn', 'plate', 'tag', 'nut', 'board', 'pannel', 'panel']):
        print(f)
