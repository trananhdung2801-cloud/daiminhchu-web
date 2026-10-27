import sys
sys.stdout.reconfigure(encoding='utf-8')

for name in ['Settings.txt', 'Other.txt']:
    p = rf'C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\data\config\{name}'
    try:
        with open(p, 'r', encoding='utf-8', errors='ignore') as f:
            lines = f.readlines()
        print(f"=== {name} ({len(lines)} lines) ===")
        for l in lines[:40]:
            print(l.strip())
    except Exception as e:
        print(e)
