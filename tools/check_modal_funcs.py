import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/js/game.js', 'r', encoding='utf-8') as f:
    js = f.read()

for term in ['openTopServerModal', 'openDiscipleDetailModal', 'openLongChauModal', 'openLienServerModal', 'openAmKhiModal', 'openMailModal', 'openAnOanModal', 'openChatModal']:
    print(term, 'found in game.js:', term in js)
