from PIL import Image
import os

out_dir = r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\assets\ui\dantran_authentic"
for f in ["scroll_thien_am.png", "scroll_thien_duong.png", "scroll_thien_long.png", "scroll_doi_hinh_ra_tran.png", "btn_cuong_hoa.png", "btn_ho_tro.png", "badge_giap_purple.png", "badge_cap_circle.png", "icon_khithe_badge.png"]:
    p = os.path.join(out_dir, f)
    im = Image.open(p)
    print(f"{f}: {im.size}")
