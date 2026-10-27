with open(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\index.html", "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace('href="/css/style.css?v=27"', 'href="/css/style.css?v=28"')
c = c.replace('src="/js/game.js?v=27"', 'src="/js/game.js?v=28"')

with open(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\index.html", "w", encoding="utf-8") as f:
    f.write(c)

print("Bumped version to v=28")
