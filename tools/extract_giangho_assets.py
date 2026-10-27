from PIL import Image, ImageDraw, ImageFilter
import os

im = Image.open(r'C:\Users\trananh.dung\.gemini\antigravity\brain\c5662992-6914-4398-a616-eb4454ce7882\.user_uploaded\media_1793063783871_c1fbcaa3.jpg')
W, H = im.size # 498, 1024

out_dir = 'public/assets/ui/giangho_authentic'
os.makedirs(out_dir, exist_ok=True)

# 1. Mission Plank Background (x=10..488, y=448..556) -> width 478, height 108
plank = im.crop((10, 448, 488, 556)).copy()
# Scrub the avatar area (x=10..105 in plank) and button area (x=330..470 in plank)
# Wait, let's keep the entire plank texture, but scrub the text "Nhân sĩ võ lâm 1" in x=105..330, y=30..80:
# Sample wood patch from y=5..30 or y=80..100:
clean_plank = plank.copy()
wood_patch = clean_plank.crop((110, 10, 320, 35)).resize((210, 55))
clean_plank.paste(wood_patch, (110, 30))
clean_plank.save(os.path.join(out_dir, 'mission_plank_bg.png'))
print('Saved mission_plank_bg.png')

# 2. Button 'Đánh' (x=335..468, y=462..542) -> width 133, height 80
btn = im.crop((335, 462, 468, 542)).copy()
# Clean the text "Đánh" and stars in the center:
# Sample the amber gradient from edges (e.g. y=15..25 or y=60..70)
btn_clean = btn.copy()
center_patch = btn.crop((40, 12, 93, 26)).resize((80, 48))
btn_clean.paste(center_patch, (26, 20))
# Apply subtle blur to patch
btn_clean.save(os.path.join(out_dir, 'btn_danh_clean.png'))
print('Saved btn_danh_clean.png')

# 3. Avatar Frame (x=18..105, y=456..546 in original image) -> width 87, height 90
ava_crop = im.crop((18, 456, 105, 546)).copy()
# Save raw avatar frame
ava_crop.save(os.path.join(out_dir, 'avatar_sample.png'))

# 4. Story Box (x=5..493, y=304..444) -> width 488, height 140
story_crop = im.crop((5, 304, 493, 444)).copy()
# Scrub the text in story box:
# The background is uniform dark wood / parchment #63432b - #4d331f
story_clean = story_crop.copy()
story_patch = story_clean.crop((20, 10, 468, 30)).resize((448, 100))
story_clean.paste(story_patch, (20, 25))
story_clean.save(os.path.join(out_dir, 'story_box_bg.png'))
print('Saved story_box_bg.png')

# 5. Chapter Scroll Banner (x=5..493, y=190..290) -> width 488, height 100
scroll_banner = im.crop((5, 190, 493, 290)).copy()
# Rollers on left & right:
roller_l = scroll_banner.crop((0, 0, 25, 100))
roller_r = scroll_banner.crop((463, 0, 488, 100))
roller_l.save(os.path.join(out_dir, 'scroll_roller_l.png'))
roller_r.save(os.path.join(out_dir, 'scroll_roller_r.png'))

# Paper scroll background (sample between rollers)
paper_patch = scroll_banner.crop((25, 10, 45, 90)).resize((440, 80))
scroll_bg = Image.new('RGBA', (488, 100), (0, 0, 0, 0))
scroll_bg.paste(paper_patch, (24, 10))
scroll_bg.paste(roller_l, (0, 0))
scroll_bg.paste(roller_r, (463, 0))
scroll_bg.save(os.path.join(out_dir, 'scroll_banner_clean.png'))
print('Saved scroll_banner_clean.png')

# 6. Active Chapter Plaque & Inactive Plaque
plaque_active = im.crop((90, 205, 275, 275)).copy()
# Scrub text inside plaque:
plaque_patch = plaque_active.crop((15, 10, 170, 25)).resize((155, 35))
plaque_active_clean = plaque_active.copy()
plaque_active_clean.paste(plaque_patch, (15, 20))
plaque_active_clean.save(os.path.join(out_dir, 'plaque_active_clean.png'))

plaque_inactive = im.crop((280, 205, 465, 275)).copy()
plaque_in_patch = plaque_inactive.crop((15, 10, 170, 25)).resize((155, 35))
plaque_inactive_clean = plaque_inactive.copy()
plaque_inactive_clean.paste(plaque_in_patch, (15, 20))
plaque_inactive_clean.save(os.path.join(out_dir, 'plaque_inactive_clean.png'))
print('Saved plaque_active_clean.png and plaque_inactive_clean.png')

print('All authentic Giang Ho assets extracted successfully!')
