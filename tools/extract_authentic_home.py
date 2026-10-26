from PIL import Image
import os

p1 = r'C:/Users/trananh.dung/.gemini/antigravity/brain/c5662992-6914-4398-a616-eb4454ce7882/.user_uploaded/media_1793011112192_6fe80186.jpg'
out_dir = r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/assets/ui/home_authentic'
os.makedirs(out_dir, exist_ok=True)

im = Image.open(p1)
W, H = im.size # 576, 1024

# Let's crop key components:
# 1. Top ticker
im.crop((0, 36, W, 74)).save(os.path.join(out_dir, 'top_ticker_bg.png'))

# 2. Header profile background
im.crop((0, 74, W, 155)).save(os.path.join(out_dir, 'header_profile_bg.png'))

# 3. Level badge wheel
im.crop((8, 85, 70, 150)).save(os.path.join(out_dir, 'level_wheel_badge.png'))

# 4. VIP3 badge
im.crop((275, 84, 335, 115)).save(os.path.join(out_dir, 'vip3_badge.png'))

# 5. Disciple roster banner with clouds
im.crop((0, 155, W, 385)).save(os.path.join(out_dir, 'disciple_cloud_backdrop.png'))

# 6. 6 Gold/Silver Wooden Buttons:
# Row 1: Đệ tử, Trang bị, Võ công
im.crop((25, 390, 172, 470)).save(os.path.join(out_dir, 'btn_detu.png'))
im.crop((208, 390, 355, 470)).save(os.path.join(out_dir, 'btn_trangbi.png'))
im.crop((385, 390, 532, 470)).save(os.path.join(out_dir, 'btn_vocong.png'))

# Row 2: Kinh Mạch, Chân khí, Khẩu quyết
im.crop((25, 485, 172, 565)).save(os.path.join(out_dir, 'btn_kinhmach.png'))
im.crop((208, 485, 355, 565)).save(os.path.join(out_dir, 'btn_chankhi.png'))
im.crop((385, 485, 532, 565)).save(os.path.join(out_dir, 'btn_khauquyet.png'))

# 7. Big activity icons:
# Row 1: Long Châu, Liên Server, Luận kiếm Liên Cụm
im.crop((30, 580, 175, 680)).save(os.path.join(out_dir, 'icon_longchau.png'))
im.crop((200, 580, 345, 680)).save(os.path.join(out_dir, 'icon_lienserver.png'))
im.crop((365, 580, 545, 680)).save(os.path.join(out_dir, 'icon_luankiemliencum.png'))

# Row 2: Ám khí, Fanpage, Liên minh
im.crop((20, 700, 185, 785)).save(os.path.join(out_dir, 'icon_amkhi.png'))
im.crop((245, 715, 310, 775)).save(os.path.join(out_dir, 'icon_fanpage.png'))
im.crop((370, 700, 545, 785)).save(os.path.join(out_dir, 'icon_lienminh.png'))

# 8. 6 Utility Square Buttons:
# Tay nải, Võ lâm phổ, Truyền thư, Ân oán, Trò chuyện, Cài đặt
im.crop((28, 810, 108, 878)).save(os.path.join(out_dir, 'btn_taynai.png'))
im.crop((118, 810, 198, 878)).save(os.path.join(out_dir, 'btn_volampho.png'))
im.crop((208, 810, 288, 878)).save(os.path.join(out_dir, 'btn_truyenthu.png'))
im.crop((298, 810, 378, 878)).save(os.path.join(out_dir, 'btn_an_oan.png'))
im.crop((388, 810, 468, 878)).save(os.path.join(out_dir, 'btn_trochuyen.png'))
im.crop((478, 810, 558, 878)).save(os.path.join(out_dir, 'btn_caidat.png'))

# 9. Entire Bottom Navigation Bar
im.crop((0, 890, W, 975)).save(os.path.join(out_dir, 'bottom_nav_bar_authentic.png'))

# And the individual bottom tabs:
# Tr.chủ, D.trận, Gi.hồ, L.công, Kỳ ngộ, Chợ, L.kiếm (L.Minh is scrolled)
im.crop((5, 908, 78, 975)).save(os.path.join(out_dir, 'tab_trangchu.png'))
im.crop((78, 908, 150, 975)).save(os.path.join(out_dir, 'tab_dantran.png'))
im.crop((150, 908, 222, 975)).save(os.path.join(out_dir, 'tab_giangho.png'))
im.crop((222, 908, 294, 975)).save(os.path.join(out_dir, 'tab_luyencong.png'))
im.crop((294, 908, 366, 975)).save(os.path.join(out_dir, 'tab_kyngo.png'))
im.crop((366, 908, 438, 975)).save(os.path.join(out_dir, 'tab_cho.png'))
im.crop((438, 908, 510, 975)).save(os.path.join(out_dir, 'tab_luankiem.png'))
im.crop((510, 908, 576, 975)).save(os.path.join(out_dir, 'tab_lienminh.png'))

# 10. Background of entire middle game screen
im.crop((0, 74, W, 890)).save(os.path.join(out_dir, 'main_game_full_bg.png'))

print("Successfully extracted all authentic UI components to home_authentic!")
