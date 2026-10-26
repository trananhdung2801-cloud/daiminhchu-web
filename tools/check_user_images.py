from PIL import Image

p1 = r'C:/Users/trananh.dung/.gemini/antigravity/brain/c5662992-6914-4398-a616-eb4454ce7882/.user_uploaded/media_1793011112192_6fe80186.jpg'
p2 = r'C:/Users/trananh.dung/.gemini/antigravity/brain/c5662992-6914-4398-a616-eb4454ce7882/.user_uploaded/media_1793011121837_1895b123.jpg'

with Image.open(p1) as im1:
    print('Image 1 size:', im1.size)

with Image.open(p2) as im2:
    print('Image 2 size:', im2.size)
