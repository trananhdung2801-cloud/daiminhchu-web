import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/tools/draft_home_css.py', 'r', encoding='utf-8') as f:
    text = f.read()

pos_start = text.find('/* ================= 100% AUTHENTIC HOME SCREEN')
pos_end = text.rfind("'''")
css_content = text[pos_start:pos_end]

with open(r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/css/style.css', 'r', encoding='utf-8') as f:
    existing_css = f.read()

with open(r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/css/style.css', 'w', encoding='utf-8') as f:
    f.write(existing_css + '\n' + css_content)

print("Appended authentic Home CSS to style.css successfully!")
