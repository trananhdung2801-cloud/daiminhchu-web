from PIL import Image
import os

im = Image.open(r'C:\Users\trananh.dung\.gemini\antigravity\brain\c5662992-6914-4398-a616-eb4454ce7882\.user_uploaded\media_1793063896444_c7f50f4f.jpg')
W, H = im.size # 498, 1024

out_dir = 'public/assets/ui/dantran_authentic'
os.makedirs(out_dir, exist_ok=True)

# 1. "Dàn Trận" Button on top-right:
# x=448..488, y=142..220 in 498x1024 canvas
btn_dantran = im.crop((445, 142, 488, 222))
btn_dantran.save(os.path.join(out_dir, 'btn_dantran.png'))
print('Saved btn_dantran.png:', btn_dantran.size)

# 2. Glowing Blue "Chân Khí" Orb at bottom-right:
# x=405..495, y=660..755
orb_chankhi = im.crop((405, 660, 495, 755))
orb_chankhi.save(os.path.join(out_dir, 'orb_chankhi.png'))
print('Saved orb_chankhi.png:', orb_chankhi.size)

# 3. Fiery Orb (Long Châu / Tinh Hồn) at bottom-left:
# x=0..95, y=620..715
orb_longchau = im.crop((0, 620, 95, 715))
orb_longchau.save(os.path.join(out_dir, 'orb_longchau.png'))
print('Saved orb_longchau.png:', orb_longchau.size)

# 4. Ám Khí Orb at bottom-left lower:
# x=2..92, y=715..805
orb_amkhi = im.crop((2, 715, 92, 805))
orb_amkhi.save(os.path.join(out_dir, 'orb_amkhi.png'))
print('Saved orb_amkhi.png:', orb_amkhi.size)

# 5. Top Roller & Bottom Roller of the Scroll:
# Top roller: y=238..264, x=75..425
top_roller = im.crop((75, 238, 425, 264))
top_roller.save(os.path.join(out_dir, 'scroll_top_roller.png'))

# Bottom roller: y=825..845, x=75..425
bottom_roller = im.crop((75, 825, 425, 845))
bottom_roller.save(os.path.join(out_dir, 'scroll_bottom_roller.png'))

# Scroll canvas parchment paper (clean sample)
# y=264..825, x=85..415 (width 330, height 561)
scroll_paper = im.crop((85, 264, 415, 825))
scroll_paper.save(os.path.join(out_dir, 'scroll_paper_sample.png'))

# 6. Equipment / Skill Slot Empty '?' Frame (x=3..87, y=533..618)
slot_empty = im.crop((3, 533, 87, 618))
slot_empty.save(os.path.join(out_dir, 'slot_empty_question.png'))

print('All Dàn Trận authentic assets extracted!')
