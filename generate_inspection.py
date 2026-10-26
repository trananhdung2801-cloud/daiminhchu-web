import os
from PIL import Image

orig_folder = r"C:\Users\trananh.dung\Downloads\Ảnh game ĐMC"
files = sorted(os.listdir(orig_folder))
target_indices = [3, 8, 9, 10, 16, 17, 19, 20, 25, 26, 28, 31, 32, 34, 36, 37]

output_dir = r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\inspect_crops"
os.makedirs(output_dir, exist_ok=True)

for idx in target_indices:
    fn = files[idx - 1]
    fp = os.path.join(orig_folder, fn)
    img = Image.open(fp)
    w, h = img.size
    
    # Save a resized version for analysis
    resized = img.resize((360, int(360 * h / w)), Image.Resampling.LANCZOS)
    resized_path = os.path.join(output_dir, f"inspect_{idx:02d}_{fn[:10]}.jpg")
    resized.save(resized_path, quality=85)
    print(f"Saved {resized_path} ({w}x{h} -> {resized.size})")

print("Done generating inspection images.")
