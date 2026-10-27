from PIL import Image

cb = Image.open(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\assets\ui\hero_info_authentic\btn_close.png")
print("Close button:", cb.size, cb.mode)
# The close button in the screenshot has rounded metallic corners. Let's make outside rounded corner pixels transparent
cb_rgba = cb.convert("RGBA")
w, h = cb.size
# Check corner pixels
print("Top-left pixel:", cb.getpixel((0, 0)))
print("Center pixel:", cb.getpixel((w//2, h//2)))
