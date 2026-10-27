from PIL import Image

b1 = Image.open(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\assets\ui\hero_info_authentic\btn_swap_hero.png")
b2 = Image.open(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\assets\ui\hero_info_authentic\btn_transfer.png")
cc = Image.open(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\assets\ui\hero_info_authentic\center_crest.png")

print("b1 size:", b1.size)
print("b2 size:", b2.size)
print("cc size:", cc.size)
