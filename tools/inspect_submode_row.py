from PIL import Image
import os

out_dir = r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\assets\ui\dantran_authentic"
os.makedirs(out_dir, exist_ok=True)

im_tl = Image.open(r"C:\Users\trananh.dung\.gemini\antigravity\brain\c5662992-6914-4398-a616-eb4454ce7882\.user_uploaded\media_1793077664238_d62bba4b.jpg")
w, h = im_tl.size
# Top submode row is around y: 120 to 230
submode_row = im_tl.crop((0, 120, w, 235))
submode_row.save(os.path.join(out_dir, "test_submode_row.png"))
print("Saved test_submode_row.png")

# Let's inspect individual buttons on this row
# In 540 width:
# Button 1: Leftmost arrow / avatar
# Button 2: Group of disciples / Đội hình xuất trận
# Button 3: Brown "Trận" (Thiên Dương Trận)
# Button 4: Blue "Trận" (Thiên Âm Trận)
# Button 5: Green "Long" (Thiên Long Trận)
# Button 6: Rightmost hanging plaque "Dàn Trận"
