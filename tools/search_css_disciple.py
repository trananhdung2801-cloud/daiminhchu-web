with open(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\css\style.css", "r", encoding="utf-8", errors="ignore") as f:
    css = f.read()

pos = css.find("disciple-detail-modal")
if pos != -1:
    print(css[pos-100:pos+800])
else:
    print("Not found by modal id")
