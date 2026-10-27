from PIL import Image
import os

images = {
    "thien_am": r"C:\Users\trananh.dung\.gemini\antigravity\brain\c5662992-6914-4398-a616-eb4454ce7882\.user_uploaded\media_1793077650898_dc2b7eb0.jpg",
    "thien_duong": r"C:\Users\trananh.dung\.gemini\antigravity\brain\c5662992-6914-4398-a616-eb4454ce7882\.user_uploaded\media_1793077653961_a90a9760.jpg",
    "thien_long": r"C:\Users\trananh.dung\.gemini\antigravity\brain\c5662992-6914-4398-a616-eb4454ce7882\.user_uploaded\media_1793077664238_d62bba4b.jpg",
    "doi_hinh": r"C:\Users\trananh.dung\.gemini\antigravity\brain\c5662992-6914-4398-a616-eb4454ce7882\.user_uploaded\media_1793077731383_79fc77e5.jpg"
}

for k, p in images.items():
    if os.path.exists(p):
        im = Image.open(p)
        print(f"{k}: size={im.size}, mode={im.mode}")
    else:
        print(f"{k}: NOT FOUND")
