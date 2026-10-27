import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/js/game.js', 'r', encoding='utf-8') as f:
    js = f.read()

target = """    document.querySelectorAll('.tab-btn-auth').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });"""

replacement = """    document.querySelectorAll('.bottom-tab-auth-btn, .tab-btn-auth').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });"""

js_norm = js.replace('\r\n', '\n')
target_norm = target.replace('\r\n', '\n')
replacement_norm = replacement.replace('\r\n', '\n')

if target_norm in js_norm:
    js_norm = js_norm.replace(target_norm, replacement_norm)
    with open(r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/js/game.js', 'w', encoding='utf-8') as f:
        f.write(js_norm)
    print("Updated switchTab in game.js successfully!")
else:
    print("Could not find target_norm in game.js!")
