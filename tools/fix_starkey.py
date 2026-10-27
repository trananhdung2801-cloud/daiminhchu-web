with open('src/routes/webApi.js', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('const starKey = ${chapterIdx}_;', "const starKey = chapterIdx + '_' + missionIdx;")

with open('src/routes/webApi.js', 'w', encoding='utf-8') as f:
    f.write(c)

print('Fixed starKey line!')
