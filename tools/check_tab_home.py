import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

pos_start = html.find('<div id="tab-home"')
pos_end = html.find('<div id="tab-formation"')
print(html[pos_start:pos_end])
