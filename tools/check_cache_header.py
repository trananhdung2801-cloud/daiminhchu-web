import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/src/app.js', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('max-age=86400')
print(text[pos-200:pos+200])
