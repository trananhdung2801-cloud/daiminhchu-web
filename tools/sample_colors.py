from PIL import Image
import numpy as np

img = Image.open(r"C:\Users\trananh.dung\.gemini\antigravity\brain\c5662992-6914-4398-a616-eb4454ce7882\.user_uploaded\media_1793068478768_2e8b405c.jpg")

# Sample colors at different regions
# 1. Right column background (around x: 350, y: 200)
c_right_bg = img.getpixel((350, 200))
print("Right column bg color:", c_right_bg)

# 2. Right column text color (around x: 350, y: 160)
# Let's crop a small patch of text in right column
patch_right = img.crop((300, 150, 420, 250))
arr_r = np.array(patch_right)
print("Right patch min/max colors:", arr_r.min(axis=(0,1)), arr_r.max(axis=(0,1)))

# 3. Bottom duyen phan background (around x: 200, y: 700)
c_bot_bg = img.getpixel((200, 700))
print("Bottom duyen phan bg color:", c_bot_bg)

# 4. Bottom duyen phan text color
patch_bot = img.crop((50, 650, 350, 750))
arr_b = np.array(patch_bot)
print("Bottom patch min/max colors:", arr_b.min(axis=(0,1)), arr_b.max(axis=(0,1)))
