from PIL import Image, ImageFilter
import os

out_dir = r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\assets\ui\dantran_authentic"
sc_dh = Image.open(os.path.join(out_dir, "scroll_doi_hinh_ra_tran.png")).convert("RGBA")
w, h = sc_dh.size
print(f"Scroll Doi Hinh: {w}x{h}")

# The title "Đội hình ra trận" is around y: 30 to 75
# The list of 8 disciples is from y: 80 to 420
# Let's sample clean parchment paper from between lines or bottom
paper_sample = sc_dh.crop((20, 80, 70, 420))

# Create clean scroll by keeping the top roller, bottom roller, title, and foot, and inpainting the list
clean_sc = sc_dh.copy()

# Sample a clean strip of parchment from x: 15 to 45, y: 100 to 400
clean_strip = sc_dh.crop((18, 100, 50, 400))
for xx in range(50, 310, 30):
    clean_sc.paste(clean_strip, (xx, 100))

clean_sc = clean_sc.filter(ImageFilter.GaussianBlur(0.6))
# Re-paste the top roller, bottom roller, title
top_part = sc_dh.crop((0, 0, w, 95))
bottom_part = sc_dh.crop((0, 420, w, h))
clean_sc.paste(top_part, (0, 0))
clean_sc.paste(bottom_part, (0, 420))

clean_sc.save(os.path.join(out_dir, "scroll_doi_hinh_clean.png"))
print("Saved scroll_doi_hinh_clean.png successfully!")
