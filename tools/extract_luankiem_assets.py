import os, sys
from PIL import Image, ImageDraw

sys.stdout.reconfigure(encoding='utf-8')

im1_path = r'C:\Users\trananh.dung\.gemini\antigravity\brain\c5662992-6914-4398-a616-eb4454ce7882\.user_uploaded\media_1793066389467_415a4942.jpg'
im2_path = r'C:\Users\trananh.dung\.gemini\antigravity\brain\c5662992-6914-4398-a616-eb4454ce7882\.user_uploaded\media_1793066392887_120cba87.jpg'

im1 = Image.open(im1_path)
im2 = Image.open(im2_path)

out_dir = 'public/assets/ui/luankiem_authentic'
os.makedirs(out_dir, exist_ok=True)

def make_clean_round(im, radius=6):
    im_rgba = im.convert('RGBA')
    w, h = im_rgba.size
    mask = Image.new('L', (w, h), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle((0, 0, w - 1, h - 1), radius=radius, fill=255)
    im_rgba.putalpha(mask)
    return im_rgba

# 1. Tabs from im1:
# Tab 1 "Luận Kiếm" active: x=20..198, y=187..239
tab_lk_act = im1.crop((20, 187, 198, 239))
make_clean_round(tab_lk_act, 10).save(os.path.join(out_dir, 'tab_luankiem_active.png'))

# Tab 2 "Xếp hạng" inactive: x=202..382, y=187..239
tab_xh_inact = im1.crop((202, 187, 382, 239))
make_clean_round(tab_xh_inact, 10).save(os.path.join(out_dir, 'tab_xephang_inactive.png'))

# Create complementary active/inactive tabs
# For tab_xephang_active: use texture of tab_lk_act with "Xếp hạng" text, or clean stone texture
# For tab_luankiem_inactive: use texture of tab_xh_inact with "Luận Kiếm" text
# Let's crop clean textures
stone_clean = tab_lk_act.crop((10, 10, 50, 42)).resize((180, 52))
wood_clean = tab_xh_inact.crop((10, 10, 50, 42)).resize((180, 52))

make_clean_round(stone_clean, 10).save(os.path.join(out_dir, 'tab_stone_clean.png'))
make_clean_round(wood_clean, 10).save(os.path.join(out_dir, 'tab_wood_clean.png'))

# 2. Golden V Badge: x=446..478, y=276..316 from im1
badge_v = im1.crop((446, 276, 478, 316)).convert('RGBA')
badge_v.save(os.path.join(out_dir, 'badge_vip_v.png'))

# 3. Badges:
# Purple shield: x=352..384, y=347..383 from im1
shield = im1.crop((352, 347, 384, 383)).convert('RGBA')
shield.save(os.path.join(out_dir, 'badge_shield.png'))

# Blue swirl: x=384..414, y=347..383 from im1
swirl = im1.crop((384, 347, 414, 383)).convert('RGBA')
swirl.save(os.path.join(out_dir, 'badge_swirl.png'))

# Golden star: x=416..450, y=495..533 from im1 (card 2)
star = im1.crop((416, 495, 450, 533)).convert('RGBA')
star.save(os.path.join(out_dir, 'badge_star.png'))

# 4. Button "Đội Hình": x=390..478, y=385..445 from im1
btn_dh = im1.crop((390, 385, 478, 445))
make_clean_round(btn_dh, 6).save(os.path.join(out_dir, 'btn_doihinh.png'))

# 5. Button "Cập nhật": x=424..518, y=395..460 from im2
btn_cn = im2.crop((424, 395, 518, 460))
make_clean_round(btn_cn, 6).save(os.path.join(out_dir, 'btn_capnhat.png'))

# 6. Bamboo / Wooden Card Plaque Background:
# In im1, card 1 is x=8..490, y=340..476
card_plaque = im1.crop((8, 340, 490, 476))
# Create clean reusable bamboo plaque:
# We preserve the top rail, bottom rail, left/right rails, and middle texture
w_c, h_c = card_plaque.size
card_clean = card_plaque.copy()
# Tile clean wooden patch over the center
patch = card_plaque.crop((40, 75, 90, 115)).resize((340, 85))
card_clean.paste(patch, (90, 40))
card_clean.save(os.path.join(out_dir, 'card_plaque_clean.png'))
card_plaque.save(os.path.join(out_dir, 'card_plaque_sample.png'))

# 7. Self Rank 1 Card Plaque (from im2):
# In im2, self card is x=0..540, y=340..510
self_card = im2.crop((0, 340, 540, 510))
self_card.save(os.path.join(out_dir, 'card_self_sample.png'))
# Clean self card
self_clean = self_card.copy()
self_patch = self_card.crop((120, 120, 240, 150)).resize((300, 100))
self_clean.paste(self_patch, (120, 55))
self_clean.save(os.path.join(out_dir, 'card_self_clean.png'))

# 8. Golden Disciple Portrait Frame (84x84):
# Create a high quality golden rounded square frame
im_dframe = Image.new('RGBA', (84, 84), (0, 0, 0, 0))
d_draw = ImageDraw.Draw(im_dframe)
# Golden border
d_draw.rounded_rectangle((2, 2, 81, 81), radius=10, outline=(255, 215, 60, 255), width=3)
d_draw.rounded_rectangle((4, 4, 79, 79), radius=8, outline=(240, 160, 30, 180), width=1)
im_dframe.save(os.path.join(out_dir, 'disciple_gold_frame.png'))

print('All Luận Kiếm assets extracted successfully!')
