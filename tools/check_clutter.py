import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

pos = html.find('disciple-carousel-wrap')
print(html[pos-50:pos+300])

pos_chat = html.find('world-chat-dock')
print(html[pos_chat-50:pos_chat+300])
