from PIL import Image

bg = Image.open(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\assets\ui\hero_info_authentic\modal_bg_clean.png")
print("Top-left edge:", [bg.getpixel((i, 0)) for i in range(5)])
print("Bottom-right edge:", [bg.getpixel((bg.width-1-i, bg.height-1)) for i in range(5)])
