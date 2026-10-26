with open(r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/src/routes/webApi.js', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('playerData.DeTu.forEach(', '(playerData.NhanVat || []).forEach(')

with open(r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/src/routes/webApi.js', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated playerData.DeTu -> (playerData.NhanVat || [])')
