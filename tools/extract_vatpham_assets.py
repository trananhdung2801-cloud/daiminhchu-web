from PIL import Image
import os

im = Image.open(r'C:\Users\trananh.dung\.gemini\antigravity\brain\c5662992-6914-4398-a616-eb4454ce7882\.user_uploaded\media_1793065861664_da5b6774.jpg')
W, H = im.size # 512, 1024

out_dir = 'public/assets/ui/vatpham_authentic'
os.makedirs(out_dir, exist_ok=True)

# 1. "Vật phẩm" top plaque (x=16..134, y=202..260) -> width 118, height 58
plaque = im.crop((16, 202, 134, 260))
plaque.save(os.path.join(out_dir, 'tab_vatpham_plaque.png'))

# 2. Subheader banner "Vật phẩm đang sở hữu" (x=0..W, y=256..286)
subhdr = im.crop((0, 256, W, 286))
subhdr.save(os.path.join(out_dir, 'subheader_banner.png'))

# 3. Item Card Frame (x=12..94, y=287..368) -> width 82, height 81
frame = im.crop((12, 287, 94, 368))
frame.save(os.path.join(out_dir, 'item_card_frame.png'))

# 4. Ginseng Icon "Bách niên sâm" (x=20..86, y=684..750)
ginseng = im.crop((20, 684, 86, 750))
ginseng.save('public/assets/images/VP_BachNienSam_to.png')

# 5. Button "Sử dụng" (x=370..500, y=412..462) -> width 130, height 50
btn_sudung = im.crop((370, 412, 500, 462))
btn_sudung.save(os.path.join(out_dir, 'btn_sudung.png'))

# Clean version of btn_sudung (without text)
btn_clean = btn_sudung.copy()
patch = btn_sudung.crop((25, 8, 105, 20)).resize((75, 26))
btn_clean.paste(patch, (28, 12))
btn_clean.save(os.path.join(out_dir, 'btn_item_clean.png'))

# 6. Button "Dùng 10 lần" (x=248..372, y=608..658) -> width 124, height 50
btn_10 = im.crop((248, 608, 372, 658))
btn_10.save(os.path.join(out_dir, 'btn_dung10lan.png'))

# 7. Row Divider Line
divider = im.crop((0, 474, W, 478))
divider.save(os.path.join(out_dir, 'row_divider.png'))

print('All authentic Vật phẩm assets extracted successfully!')
