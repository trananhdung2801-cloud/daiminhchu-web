import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\index.html", "r", encoding="utf-8") as f:
    lines = f.readlines()

s_idx = None
e_idx = None
for i, l in enumerate(lines):
    if '<div id="tab-formation"' in l:
        s_idx = i
    if s_idx is not None and 'id="dantran-overview-modal"' in l:
        e_idx = i
        break

print(f"Formation block from {s_idx+1} to {e_idx+1}")
