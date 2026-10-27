import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

pos = html.find('bottom-')
while pos != -1:
    print(html[pos-10:pos+80])
    pos = html.find('bottom-', pos+80)
