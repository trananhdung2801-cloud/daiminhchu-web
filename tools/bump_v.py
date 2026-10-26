with open(r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

html = html.replace('/js/game.js?v=10', '/js/game.js?v=11')
html = html.replace('/css/style.css?v=10', '/css/style.css?v=11')

with open(r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Bumped cache buster to v=11")
