from PIL import Image
import os

out_dir = r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\assets\ui\dantran_authentic"

im_ta = Image.open(r"C:\Users\trananh.dung\.gemini\antigravity\brain\c5662992-6914-4398-a616-eb4454ce7882\.user_uploaded\media_1793077650898_dc2b7eb0.jpg")
im_td = Image.open(r"C:\Users\trananh.dung\.gemini\antigravity\brain\c5662992-6914-4398-a616-eb4454ce7882\.user_uploaded\media_1793077653961_a90a9760.jpg")
im_tl = Image.open(r"C:\Users\trananh.dung\.gemini\antigravity\brain\c5662992-6914-4398-a616-eb4454ce7882\.user_uploaded\media_1793077664238_d62bba4b.jpg")
im_dh = Image.open(r"C:\Users\trananh.dung\.gemini\antigravity\brain\c5662992-6914-4398-a616-eb4454ce7882\.user_uploaded\media_1793077731383_79fc77e5.jpg")

# 1. Thiên Âm Trận:
# In 540x960:
# Scroll is between x: 92 to 448, y: 245 to 842
scroll_am = im_ta.crop((92, 245, 448, 842))
scroll_am.save(os.path.join(out_dir, "scroll_thien_am.png"))

# 2. Thiên Dương Trận:
scroll_duong = im_td.crop((92, 245, 448, 842))
scroll_duong.save(os.path.join(out_dir, "scroll_thien_duong.png"))

# Buttons in bottom of Thiên Dương Trận:
# Button Cường Hóa: x: 105 to 195, y: 772 to 818
btn_cuong_hoa = im_td.crop((105, 772, 195, 818))
btn_cuong_hoa.save(os.path.join(out_dir, "btn_cuong_hoa.png"))

# Button Hỗ Trợ: x: 215 to 295, y: 772 to 818
btn_ho_tro = im_td.crop((215, 772, 295, 818))
btn_ho_tro.save(os.path.join(out_dir, "btn_ho_tro.png"))

# 3. Thiên Long Trận:
# In 540x960, the scroll is wide: x: 10 to 530, y: 236 to 872
scroll_long = im_tl.crop((10, 236, 530, 872))
scroll_long.save(os.path.join(out_dir, "scroll_thien_long.png"))

# 4. Đội Hình Ra Trận (from im_dh: 485x1024):
# Scroll is between x: 74 to 410, y: 254 to 780
scroll_doihinh = im_dh.crop((74, 254, 410, 780))
scroll_doihinh.save(os.path.join(out_dir, "scroll_doi_hinh_ra_tran.png"))

# Quality badge [GIÁP] purple: x: 285 to 312, y: 358 to 376
badge_giap_purple = im_dh.crop((287, 360, 312, 376))
badge_giap_purple.save(os.path.join(out_dir, "badge_giap_purple.png"))

# Circle [Cấp]: x: 317 to 345, y: 356 to 380
badge_cap_circle = im_dh.crop((317, 356, 345, 380))
badge_cap_circle.save(os.path.join(out_dir, "badge_cap_circle.png"))

# Khí thế icon: x: 205 to 232, y: 722 to 746
icon_khithe_badge = im_dh.crop((205, 722, 232, 746))
icon_khithe_badge.save(os.path.join(out_dir, "icon_khithe_badge.png"))

print("Extracted all scroll assets successfully!")
