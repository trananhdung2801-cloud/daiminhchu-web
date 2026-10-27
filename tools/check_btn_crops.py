from PIL import Image
import os

out_dir = r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\assets\ui\dantran_authentic"
for f in ["btn_tran_duong.png", "btn_tran_am.png", "btn_tran_long.png", "btn_doi_hinh_roster.png", "plaque_dan_tran_mini.png"]:
    p = os.path.join(out_dir, f)
    im = Image.open(p)
    print(f"{f}: {im.size}")
