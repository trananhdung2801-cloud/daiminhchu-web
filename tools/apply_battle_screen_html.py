import sys, os
sys.stdout.reconfigure(encoding='utf-8')
os.chdir(r'C:\Users\trananh.dung\Downloads\DaiMinhChu_Server')

with open('public/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Bump cache-busting version v=26 -> v=27
content = content.replace('style.css?v=26', 'style.css?v=27')
content = content.replace('game.js?v=26', 'game.js?v=27')

start_marker = '<!-- ================= AUTHENTIC BATTLE ARENA (100% MATCHING IMAGE 1 & VIDEO) ================= -->'
end_marker = '<!-- ================= AUTHENTIC VICTORY MODAL ================= -->'

if start_marker in content and end_marker in content:
    idx1 = content.find(start_marker)
    idx2 = content.find(end_marker)

    new_battle_html = '''<!-- ================= 100% AUTHENTIC 8V8 BATTLE ARENA WITH BUFF ACTIVATION (media_1793068311069_68fd0f94.jpg) ================= -->
        <div id="battle-overlay" class="battle-overlay-authentic" style="display: none;">
            <!-- Background Artwork -->
            <img src="/assets/ui/battle_authentic/battle_bg_authentic.png" class="battle-bg-art" alt="Battle Arena"/>

            <!-- Top Speed & Skip Controls -->
            <div class="battle-top-controls">
                <button type="button" class="battle-skip-btn" onclick="skipBattleToResult()">Bỏ qua</button>
                <button type="button" class="battle-speed-btn" onclick="toggleBattleSpeed()" title="Đổi tốc độ trận đấu">
                    <span id="battle-speed-val">1X</span>
                </button>
            </div>

            <!-- 8 vs 8 Duel Rows Container -->
            <div class="battle-8v8-stage" id="battle-8v8-stage">
                <!-- 8 Duel Rows dynamically populated by JS -->
            </div>

            <!-- VFX & Skill Slash Animation Layer -->
            <div id="battle-fx-stage" class="battle-fx-stage"></div>

            <!-- Bottom 'Khí Thế' Status Bar -->
            <div class="battle-khithe-bar">
                <!-- Left (Player Team) -->
                <div class="khithe-team-box left">
                    <div class="khithe-header-row">
                        <img src="/assets/ui/battle_authentic/khithe_left.png" class="khithe-calligraphy-img" alt="Khí Thế"/>
                        <div class="khithe-bars-wrapper">
                            <span class="khithe-energy-pips">|||||||</span>
                        </div>
                    </div>
                    <div class="khithe-player-name" id="khithe-name-left">Đại Tà Vương</div>
                </div>

                <!-- Right (Enemy Team) -->
                <div class="khithe-team-box right">
                    <div class="khithe-header-row">
                        <div class="khithe-bars-wrapper">
                            <span class="khithe-energy-pips enemy">????</span>
                        </div>
                        <img src="/assets/ui/battle_authentic/khithe_left.png" class="khithe-calligraphy-img flip" alt="Khí Thế"/>
                    </div>
                    <div class="khithe-player-name" id="khithe-name-right">Miêu Nhân Phụng</div>
                </div>
            </div>
        </div>

        '''

    content = content[:idx1] + new_battle_html + content[idx2:]
    with open('public/index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print('Updated #battle-overlay in public/index.html successfully!')
else:
    print('Markers not found in public/index.html!')
