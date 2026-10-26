from PIL import Image

im1 = Image.open(r'C:/Users/trananh.dung/.gemini/antigravity/brain/c5662992-6914-4398-a616-eb4454ce7882/.user_uploaded/media_1793011112192_6fe80186.jpg')
im2 = Image.open(r'C:/Users/trananh.dung/.gemini/antigravity/brain/c5662992-6914-4398-a616-eb4454ce7882/.user_uploaded/media_1793011121837_1895b123.jpg')

print('Image 1:', im1.size)
print('Image 2:', im2.size)

# Compare button region (e.g. btn_detu)
b1 = im1.crop((25, 390, 172, 470))
# In im2, the width is 498 instead of 576. Let's see the scale ratio:
# 576 / 1024 vs 498 / 1024 -> im2 is cropped on left and right!
print('Ratio:', 498 / 576)
