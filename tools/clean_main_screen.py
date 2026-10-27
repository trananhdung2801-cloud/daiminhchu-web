import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Remove disciple-carousel-wrap from main screen
old_carousel = """            <!-- Top Disciple Carousel Strip -->
            <div class="disciple-carousel-wrap">
                <div id="disciple-carousel-list" class="disciple-carousel-list"></div>
                <button class="btn-dan-tran" onclick="switchTab('formation')">Dàn Trận</button>
            </div>"""

html_norm = html.replace('\r\n', '\n')
old_carousel_norm = old_carousel.replace('\r\n', '\n')

if old_carousel_norm in html_norm:
    html_norm = html_norm.replace(old_carousel_norm, '')
    print("1. Removed top disciple-carousel-wrap successfully!")
else:
    print("Could not find old_carousel_norm!")

# 2. Remove world-chat-dock from bottom of main screen
old_chat = """            <!-- Authentic Giang Ho World Chat Dock (img_13) -->
            <div class="world-chat-dock">
                <span class="chat-prefix">[Thế Giới]</span>
                <span id="world-chat-text" class="chat-content">S178.Gấu Đại Vương: Mới kiếm được 50k KNB chiến ải Hắc Mộc Nhai anh em ơi!</span>
            </div>"""
old_chat_norm = old_chat.replace('\r\n', '\n')

if old_chat_norm in html_norm:
    html_norm = html_norm.replace(old_chat_norm, '')
    print("2. Removed world-chat-dock successfully!")
else:
    print("Could not find old_chat_norm!")

# Bump cache buster to v=12
html_norm = html_norm.replace('/js/game.js?v=11', '/js/game.js?v=12')
html_norm = html_norm.replace('/css/style.css?v=11', '/css/style.css?v=12')

with open(r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/index.html', 'w', encoding='utf-8') as f:
    f.write(html_norm)
print("Updated index.html!")
