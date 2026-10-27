with open(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\index.html", "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace('href="/css/style.css?v=28"', 'href="/css/style.css?v=29"')
c = c.replace('src="/js/game.js?v=28"', 'src="/js/game.js?v=29"')

with open(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\index.html", "w", encoding="utf-8") as f:
    f.write(c)

print("Bumped version to v=29")
