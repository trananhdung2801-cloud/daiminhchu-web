import os
import re

html_path = r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/index.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

tabs = re.findall(r'id=["\']tab-([^"\']+)["\']', html)
modals = re.findall(r'id=["\']([^"\']*modal[^"\']*)["\']', html)
print('--- CURRENT TABS ---')
for t in tabs:
    print('Tab:', t)

print('\n--- CURRENT MODALS ---')
for m in modals:
    print('Modal:', m)

print('\n--- SCREENSHOTS IN FOLDER ---')
img_dir = r'C:/Users/trananh.dung/Downloads/Ảnh game ĐMC'
if os.path.exists(img_dir):
    imgs = os.listdir(img_dir)
    print(f'Total screenshots: {len(imgs)}')
    for img in sorted(imgs):
        print(' -', img)
