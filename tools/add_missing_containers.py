with open(r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Add hidden dummy containers for those 3 IDs if not already present
if 'id="world-chat-text"' not in html:
    html = html.replace('<!-- ================= MODAL TRÒ CHUYỆN (CHAT) ================= -->',
                        '<!-- ================= MODAL TRÒ CHUYỆN (CHAT) ================= -->\n    <div style="display:none;" id="world-chat-text"></div>')

if 'id="disciple-carousel-list"' not in html:
    html = html.replace('<!-- ================= MODAL CUỘN TRANH TRỤC THƯ ĐỆ TỬ ================= -->',
                        '<!-- ================= MODAL CUỘN TRANH TRỤC THƯ ĐỆ TỬ ================= -->\n    <div style="display:none;" id="disciple-carousel-list"></div>')

if 'id="home-cloud-disciples"' not in html:
    html = html.replace('class="home-seamless-stage">',
                        'class="home-seamless-stage">\n                        <div style="display:none;" id="home-cloud-disciples"></div>')

with open(r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Added missing DOM ID containers!")
