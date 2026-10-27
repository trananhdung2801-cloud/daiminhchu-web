from PIL import Image
import os

img_path = r"C:\Users\trananh.dung\.gemini\antigravity\brain\c5662992-6914-4398-a616-eb4454ce7882\.user_uploaded\media_1793077903077_42926e1d.jpg"
img = Image.open(img_path)
w, h = img.size
print(f"Loaded image {w}x{h}")

out_dir = r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\assets\ui\vocong_info_authentic"
os.makedirs(out_dir, exist_ok=True)

# 1. Close button (top-right red box with X): x ~ 485 to 540, y ~ 120 to 180 in 576x1024 or similar
# Let's crop header and buttons:
header_title = img.crop((190, 130, 385, 175))
header_title.save(os.path.join(out_dir, "title_thong_tin_vo_cong.png"))

# 2. Main Dialog Frame
dialog_frame = img.crop((0, 125, w, 860))
dialog_frame.save(os.path.join(out_dir, "vocong_modal_full.png"))

# 3. Share Button: x: 345 to 470, y: 570 to 625
btn_share = img.crop((345, 570, 470, 625))
btn_share.save(os.path.join(out_dir, "btn_share_fb.png"))

# 4. Button "Đổi võ công": x: 60 to 225, y: 705 to 785
btn_doi_vc = img.crop((60, 705, 225, 785))
btn_doi_vc.save(os.path.join(out_dir, "btn_doi_vo_cong.png"))

# 5. Button "Tham ngộ": x: 350 to 515, y: 705 to 785
btn_tham_ngo = img.crop((350, 705, 515, 785))
btn_tham_ngo.save(os.path.join(out_dir, "btn_tham_ngo.png"))

# 6. Scroll frame with Bang Phach Cong: x: 25 to 335, y: 205 to 675
scroll_vc = img.crop((25, 205, 335, 675))
scroll_vc.save(os.path.join(out_dir, "scroll_vocong_sample.png"))

# 7. Ink splash badge for level: x: 50 to 125, y: 535 to 600
ink_lvl_badge = img.crop((50, 535, 125, 600))
ink_lvl_badge.save(os.path.join(out_dir, "ink_lvl_badge.png"))

# 8. Skill art: Bang Phach Cong
art_bpc = img.crop((80, 345, 280, 545))
art_bpc.save(os.path.join(out_dir, "art_bang_phach_cong.png"))

print("Extracted vocong assets successfully!")
