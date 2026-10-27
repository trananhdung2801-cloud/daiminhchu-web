from PIL import Image, ImageFilter
import os

out_dir = r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\assets\ui\hero_info_authentic"
bg_path = os.path.join(out_dir, "parchment_bg_full.png")
bg = Image.open(bg_path).convert("RGBA")
bw, bh = bg.size
print(f"BG size: {bw}x{bh}")

# 1. Clean the right column (x: 250 to 435, y: 30 to 410)
# Sample clean dark wood from x: 260-420, y: 40-50
wood_sample = bg.crop((260, 420, 420, 435))
# Let's clone wood texture across the right text area
clean_wood = Image.new("RGBA", (185, 400), (120, 88, 48, 255))
# Add subtle vertical wood grain
for yy in range(400):
    for xx in range(185):
        # sample from wood_sample
        sx = xx % wood_sample.width
        sy = yy % wood_sample.height
        clean_wood.putpixel((xx, yy), wood_sample.getpixel((sx, sy)))

clean_wood = clean_wood.filter(ImageFilter.GaussianBlur(1.0))
# Paste clean wood onto right area
bg.paste(clean_wood, (252, 25))

# 2. Clean bottom parchment area (x: 10 to 435, y: 500 to 730)
paper_sample = Image.open(os.path.join(out_dir, "paper_texture.png")).convert("RGBA")
clean_paper = Image.new("RGBA", (430, 230), (180, 144, 86, 255))
for yy in range(230):
    for xx in range(430):
        sx = xx % paper_sample.width
        sy = yy % paper_sample.height
        clean_paper.putpixel((xx, yy), paper_sample.getpixel((sx, sy)))

clean_paper = clean_paper.filter(ImageFilter.GaussianBlur(0.8))
# Paste clean paper onto bottom area
bg.paste(clean_paper, (10, 500))

bg.save(os.path.join(out_dir, "modal_bg_clean.png"))
print("Saved modal_bg_clean.png successfully!")
