import sys
sys.stdout.reconfigure(encoding='utf-8')

for name, path in [
    ('index.html', r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/index.html'),
    ('game.js', r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/js/game.js'),
    ('webApi.js', r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/src/routes/webApi.js')
]:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read().lower()
    print(f"=== {name} ===")
    for keyword in ['vantieu', 'vận tiêu', 'thandieu', 'thần điêu', 'boss', 'thantientyty', 'thần tiên', 'khobau', 'kho báu', 'tinhluyen', 'tinh luyện']:
        if keyword in content:
            print(f"  Found '{keyword}'")
        else:
            print(f"  MISSING '{keyword}'")
