import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\index.html", "r", encoding="utf-8") as f:
    lines = f.readlines()

start_idx = None
end_idx = None
for i, line in enumerate(lines):
    if 'id="disciple-detail-modal"' in line:
        start_idx = i
    if start_idx is not None and 'id="longchau-modal"' in line:
        end_idx = i
        break

print(f"disciple-detail-modal from line {start_idx+1} to {end_idx+1}")
for k in range(start_idx, start_idx + 15):
    print(lines[k], end="")
print("...")
for k in range(end_idx - 10, end_idx):
    print(lines[k], end="")
