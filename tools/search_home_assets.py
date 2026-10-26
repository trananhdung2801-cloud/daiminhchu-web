import os
import sys
sys.stdout.reconfigure(encoding='utf-8')

ui_dir = r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/assets/ui'
files = os.listdir(ui_dir)

keywords = [
    'trchu', 'trangchu', 'dtran', 'dantran', 'giho', 'giangho', 'lcong', 'luyencong', 'kyngo', 'cho', 'lkiem', 'luankiem', 'lminh', 'lienminh',
    'taynai', 'volampho', 'truyenthu', 'an_oan', 'trochuyen', 'caidat',
    'detu', 'trangbi', 'vocong', 'kinhmach', 'chankhi', 'khauquyet',
    'longchau', 'lienserver', 'luankiemliencum', 'amkhi', 'fanpage',
    'btn', 'icon', 'tab', 'menu', 'bar', 'bg', 'cloud', 'may'
]

results = {}
for f in files:
    f_lower = f.lower()
    for kw in keywords:
        if kw in f_lower:
            results.setdefault(kw, []).append(f)

for kw, matched in results.items():
    print(f"[{kw}] ({len(matched)}): {', '.join(matched[:8])}")
