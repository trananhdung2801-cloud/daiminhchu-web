from PIL import Image
import os

img_path = r"C:\Users\trananh.dung\.gemini\antigravity\brain\c5662992-6914-4398-a616-eb4454ce7882\.user_uploaded\media_1793077943396_4798b6c6.jpg"
img = Image.open(img_path)
w, h = img.size
print(f"Loaded image {w}x{h}")

out_dir = r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\assets\ui\trangbi_authentic"
os.makedirs(out_dir, exist_ok=True)

# 1. Top tabs row: y: 105 to 170
# Tab 1: Tất cả: x: 0 to 110
tab_tat_ca = img.crop((0, 105, 110, 170))
tab_tat_ca.save(os.path.join(out_dir, "tab_tat_ca_inactive.png"))

# Tab 2: Vũ khí (active): x: 110 to 225
tab_vu_khi = img.crop((110, 105, 225, 170))
tab_vu_khi.save(os.path.join(out_dir, "tab_vu_khi_active.png"))

# Tab 3: Áo giáp: x: 225 to 340
tab_ao_giap = img.crop((225, 105, 340, 170))
tab_ao_giap.save(os.path.join(out_dir, "tab_ao_giap_inactive.png"))

# Tab 4: Trang sức: x: 340 to 455
tab_trang_suc = img.crop((340, 105, 455, 170))
tab_trang_suc.save(os.path.join(out_dir, "tab_trang_suc_inactive.png"))

# Tab 5: Thần Khí: x: 455 to 570
tab_than_khi = img.crop((455, 105, 570, 170))
tab_than_khi.save(os.path.join(out_dir, "tab_than_khi_inactive.png"))

# 2. Sub-header Buttons:
# Button Phân Rã: x: 335 to 445, y: 180 to 232
btn_phan_ra = img.crop((335, 180, 445, 232))
btn_phan_ra.save(os.path.join(out_dir, "btn_phan_ra.png"))

# Button Bán: x: 455 to 560, y: 180 to 232
btn_ban = img.crop((455, 180, 560, 232))
btn_ban.save(os.path.join(out_dir, "btn_ban.png"))

# 3. Item Action Buttons:
# Button Dung Luyện: x: 235 to 337, y: 245 to 305
btn_dung_luyen = img.crop((235, 245, 337, 305))
btn_dung_luyen.save(os.path.join(out_dir, "btn_dung_luyen.png"))

# Button Tinh Luyện: x: 345 to 447, y: 245 to 305
btn_tinh_luyen = img.crop((345, 245, 447, 305))
btn_tinh_luyen.save(os.path.join(out_dir, "btn_tinh_luyen.png"))

# Button Cường Hóa: x: 455 to 557, y: 245 to 305
btn_cuong_hoa_red = img.crop((455, 245, 557, 305))
btn_cuong_hoa_red.save(os.path.join(out_dir, "btn_cuong_hoa_red.png"))

# 4. Item Icon Sample (Hồng Ti tú châm): x: 26 to 125, y: 240 to 318
item_icon_sample = img.crop((26, 240, 125, 318))
item_icon_sample.save(os.path.join(out_dir, "item_hong_ti_tu_cham.png"))

# 5. Row divider line / row background texture:
row_bg = img.crop((15, 320, 560, 420))
row_bg.save(os.path.join(out_dir, "item_row_bg_sample.png"))

print("Extracted all trang bi assets successfully!")
