with open(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\index.html", "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace('href="/css/style.css?v=29"', 'href="/css/style.css?v=30"')
c = c.replace('src="/js/game.js?v=29"', 'src="/js/game.js?v=30"')

with open(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\index.html", "w", encoding="utf-8") as f:
    f.write(c)

print("Bumped version to v=30")
