from PIL import Image

im = Image.open(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\assets\ui\vocong_info_authentic\ink_lvl_badge.png")
print("Ink badge:", im.size, im.mode)
