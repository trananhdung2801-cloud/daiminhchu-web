with open(r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/src/routes/webApi.js', 'r', encoding='utf-8') as f:
    text = f.read()

target = "case 'reset_player': {"
replacement = """case 'reset_events': {
                if (global.WorldBossState) {
                    global.WorldBossState.currentHp = global.WorldBossState.maxHp;
                }
                playerData.VanTieu = playerData.VanTieu || {};
                playerData.VanTieu.todayTrips = 0;
                playerData.VanTieu.todayRobs = 0;
                playerData.ThanTienTyTy = playerData.ThanTienTyTy || {};
                playerData.ThanTienTyTy.freePrayDate = null;
                playerData.BossState = playerData.BossState || {};
                playerData.BossState.fightsToday = 0;
                msg = 'Đã reset Boss Thần Điêu đầy máu, hồi phục 5 lượt Vận Tiêu & Khấn Vái Thần Tiên!';
                break;
            }
            case 'reset_player': {"""

if target in text:
    text = text.replace(target, replacement)
    with open(r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/src/routes/webApi.js', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Updated adminAction in webApi.js successfully!")
else:
    print("Could not find target in webApi.js")

# Update index.html to add the GM button
with open(r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

target_btn = """<button class="btn-gm-btn reset-btn" onclick="execGmAction('reset_player')">"""
replacement_btn = """<button class="btn-gm-btn" onclick="execGmAction('reset_events')">
                            🔄 <b>Reset Sự Kiện (Boss & Vận Tiêu)</b>
                            <small>Đầy máu Thần Điêu, mở lại 5 lượt vận tiêu</small>
                        </button>
                        <button class="btn-gm-btn reset-btn" onclick="execGmAction('reset_player')">"""

if target_btn in html:
    html = html.replace(target_btn, replacement_btn)
    with open(r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Added GM button to index.html successfully!")
else:
    print("Could not find target_btn in index.html")
