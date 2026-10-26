import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

pos_start = html.find('class="bottom-bar-authentic"')
if pos_start == -1:
    pos_start = html.find('tab-btn-auth')
print(html[pos_start-100:pos_start+1500])
