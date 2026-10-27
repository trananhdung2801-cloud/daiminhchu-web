import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

pos1 = html.find('class="header-profile-authentic"')
pos2 = html.find('class="bottom-nav-bar-authentic"')
print(html[pos1:pos2+300])
