import os
import subprocess
from PIL import Image

output_dir = r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\inspect_crops"
crop_files = sorted([f for f in os.listdir(output_dir) if f.startswith("inspect_")])

with open("inspect_report.txt", "w", encoding="utf-8") as out:
    for cf in crop_files:
        fp = os.path.join(output_dir, cf)
        im = Image.open(fp)
        w, h = im.size
        
        # 3 slices: Top (header/title), Mid (body), Bot (action buttons)
        slices = [
            ("TOP", (0, 0, w, int(h * 0.35))),
            ("MID", (0, int(h * 0.3), w, int(h * 0.75))),
            ("BOT", (0, int(h * 0.7), w, h))
        ]
        
        out.write(f"\n==================== {cf} ====================\n")
        for name, box in slices:
            part = im.crop(box)
            part_path = os.path.join(output_dir, f"temp_{name}.jpg")
            part.save(part_path)
            
            cmd = ['powershell', '-ExecutionPolicy', 'Bypass', '-File', 'do_ocr.ps1', part_path]
            proc = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, encoding='utf-8', errors='ignore')
            lines = [l.strip() for l in proc.stdout.splitlines() if l.strip()]
            out.write(f"--- {name} ---\n")
            for l in lines:
                out.write(f"  {l}\n")

print("Finished inspect_report.txt")
