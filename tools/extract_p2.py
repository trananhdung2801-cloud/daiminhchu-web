from PIL import Image
import os

p2 = r'C:/Users/trananh.dung/.gemini/antigravity/brain/c5662992-6914-4398-a616-eb4454ce7882/.user_uploaded/media_1793011121837_1895b123.jpg'
out_dir = r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/assets/ui/home_authentic'

im2 = Image.open(p2)
W2, H2 = im2.size # 498, 1024

# Let's crop bottom nav of image 2:
im2.crop((355, 908, 428, 975)).save(os.path.join(out_dir, 'tab_luankiem_full.png'))
im2.crop((428, 908, 498, 975)).save(os.path.join(out_dir, 'tab_lienminh_full.png'))

# Also let's inspect the exact position of icons in image 2
print('Image 2 bottom tabs extracted successfully!')
