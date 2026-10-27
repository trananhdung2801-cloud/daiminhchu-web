with open(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\index.html", "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace('href="/css/style.css?v=30"', 'href="/css/style.css?v=31"')
c = c.replace('src="/js/game.js?v=30"', 'src="/js/game.js?v=31"')

with open(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\index.html", "w", encoding="utf-8") as f:
    f.write(c)

print("Bumped version to v=31")
