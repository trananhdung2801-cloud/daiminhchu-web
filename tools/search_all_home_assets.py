import os
import sys
sys.stdout.reconfigure(encoding='utf-8')

for folder in ['public/assets/ui', 'public/assets/res', 'public/assets/images']:
    p = os.path.join(r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server', folder)
    if os.path.exists(p):
        files = os.listdir(p)
        matched = [f for f in files if any(k in f.lower() for k in [
            'trangchu', 'menu', 'bottom', 'nav', 'foot', 'main', 'home', 'header', 'nut', 'frame', 'khung',
            'taynai', 'volam', 'truyen', 'oan', 'chat', 'caidat', 'setting', 'vip', 'theluc', 'khiluc', 'exp',
            'lienserver', 'luankiem', 'lienminh', 'amkhi', 'longchau', 'fanpage', 'cloud', 'may', 'banner'
        ])]
        print(f"=== {folder} ({len(matched)} matched) ===")
        for f in sorted(matched)[:50]:
            print('  ', f)
