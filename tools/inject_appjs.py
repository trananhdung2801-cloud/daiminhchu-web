import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/src/app.js', 'r', encoding='utf-8') as f:
    text = f.read()

target = "case 'get_server_rankings':\n                    result = webApi.getServerRankings(body);\n                    break;"
replacement = """case 'get_server_rankings':
                    result = webApi.getServerRankings(body);
                    break;
                case 'vantieu_action':
                    result = webApi.vantieuAction(body);
                    break;
                case 'boss_thandieu_action':
                    result = webApi.bossThanDieuAction(body);
                    break;
                case 'thantientyty_action':
                    result = webApi.thanTienTyTyAction(body);
                    break;
                case 'tinhluyen_action':
                    result = webApi.tinhLuyenAction(body);
                    break;
                case 'khobau_action':
                    result = webApi.khobauAction(body);
                    break;"""

if target in text:
    text = text.replace(target, replacement)
    with open(r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/src/app.js', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Successfully added new routes to app.js!")
else:
    print("Could not find target in app.js!")
