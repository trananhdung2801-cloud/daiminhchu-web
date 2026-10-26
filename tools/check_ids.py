import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

ids_to_check = [
    'header-player-name',
    'header-level',
    'header-knb',
    'header-bac',
    'header-exp-fill',
    'header-exp-text',
    'header-stamina',
    'disciple-carousel-list',
    'disciple-scroll-portrait',
    'disciple-scroll-calligraphy',
    'disciple-scroll-quality',
    'disciple-scroll-level',
    'disciple-hp-text',
    'stat-val-hp',
    'stat-val-atk',
    'stat-val-def',
    'stat-val-inner',
    'disciple-synergy-grid',
    'disciple-scroll-value',
    'gh-chapter-name'
]

for el_id in ids_to_check:
    found = f'id="{el_id}"' in html or f"id='{el_id}'" in html
    print(f"ID '{el_id}': {'FOUND' if found else '>>> MISSING <<<'}")
