from PIL import Image

p = r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/assets/ui/background.png'
im = Image.open(p)
print('background.png size:', im.size)
# Save a copy or check its appearance
p_out = r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/assets/ui/home_authentic/test_bg.png'
im.save(p_out)
print('Done!')
