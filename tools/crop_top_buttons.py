from PIL import Image
import os

out_dir = r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\assets\ui\dantran_authentic"
im_td = Image.open(r"C:\Users\trananh.dung\.gemini\antigravity\brain\c5662992-6914-4398-a616-eb4454ce7882\.user_uploaded\media_1793077653961_a90a9760.jpg")
im_ta = Image.open(r"C:\Users\trananh.dung\.gemini\antigravity\brain\c5662992-6914-4398-a616-eb4454ce7882\.user_uploaded\media_1793077650898_dc2b7eb0.jpg")
im_tl = Image.open(r"C:\Users\trananh.dung\.gemini\antigravity\brain\c5662992-6914-4398-a616-eb4454ce7882\.user_uploaded\media_1793077664238_d62bba4b.jpg")
im_dh = Image.open(r"C:\Users\trananh.dung\.gemini\antigravity\brain\c5662992-6914-4398-a616-eb4454ce7882\.user_uploaded\media_1793077731383_79fc77e5.jpg")

# In 540x960:
# Let's inspect coordinates of buttons around y: 130 to 225
# 1. Group / Đội hình icon: around x: 170 to 260, y: 130 to 225
# 2. Brown Trận: around x: 265 to 355, y: 130 to 225
# 3. Blue Trận: around x: 360 to 450, y: 130 to 225
# 4. Green Long: in im_tl: around x: 360 to 455
# 5. Dàn Trận plaque: around x: 490 to 535, y: 140 to 215

# Let's crop the exact buttons:
# From im_td: Brown Trận (Thiên Dương Trận) is active!
btn_thien_duong = im_td.crop((365, 134, 453, 222))
btn_thien_duong.save(os.path.join(out_dir, "btn_tran_duong.png"))

# From im_ta: Blue Trận (Thiên Âm Trận) is active!
btn_thien_am = im_ta.crop((365, 134, 453, 222))
btn_thien_am.save(os.path.join(out_dir, "btn_tran_am.png"))

# From im_tl: Green Long (Thiên Long Trận) is active!
btn_thien_long = im_tl.crop((365, 134, 453, 222))
btn_thien_long.save(os.path.join(out_dir, "btn_tran_long.png"))

# Group / Đội hình icon (5 masters in traditional robes):
# From im_tl around x: 268 to 355
btn_group_roster = im_tl.crop((268, 134, 356, 222))
btn_group_roster.save(os.path.join(out_dir, "btn_doi_hinh_roster.png"))

# Plaque Dàn Trận on right
plaque_dt = im_tl.crop((490, 140, 528, 215))
plaque_dt.save(os.path.join(out_dir, "plaque_dan_tran_mini.png"))

print("Cropped top buttons successfully!")
