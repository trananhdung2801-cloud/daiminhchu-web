import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

pos = html.find('class="game-header-authentic"')
if pos == -1:
    pos = html.find('header-player-name')
print(html[pos-100:pos+1500])
