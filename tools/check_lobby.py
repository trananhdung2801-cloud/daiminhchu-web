import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/src/routes/webApi.js', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find("case 'reset_player':")
print(text[pos-400:pos+800])
