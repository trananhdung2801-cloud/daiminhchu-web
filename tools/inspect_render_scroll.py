with open(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\js\game.js", "r", encoding="utf-8", errors="ignore") as f:
    code = f.read()

pos = code.find("function renderScrollPainting()")
if pos != -1:
    print(code[pos:pos+1500])
