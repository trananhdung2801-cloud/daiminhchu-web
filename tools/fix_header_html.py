with open(r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

target = """<div class="header-left-group">
                    <span id="header-player-name" class="player-wuxia-name">Ác Nhân Cốc</span>
                    <span id="header-vip-badge" class="vip-gold-badge">VIP 2</span>
                </div>"""

replacement = """<div class="header-left-group">
                    <span id="header-player-name" class="player-wuxia-name">Chưởng Môn</span>
                    <span id="header-level" style="font-size: 11px; color: #ffd700; font-weight: bold; background: rgba(0,0,0,0.5); padding: 1px 6px; border-radius: 4px; border: 1px solid #b45309;">Lv.1</span>
                    <span id="header-vip-badge" class="vip-gold-badge">VIP 1</span>
                    <div style="display: flex; flex-direction: column; width: 60px; margin-left: 2px;">
                        <div style="background: #292524; height: 4px; border-radius: 2px; overflow: hidden; border: 1px solid #78350f;">
                            <div id="header-exp-fill" style="background: #22c55e; height: 100%; width: 0%;"></div>
                        </div>
                        <span id="header-exp-text" style="font-size: 8px; color: #a8a29e; line-height: 8px; margin-top: 1px;">0/100</span>
                    </div>
                </div>"""

html_norm = html.replace('\r\n', '\n')
target_norm = target.replace('\r\n', '\n')
replacement_norm = replacement.replace('\r\n', '\n')

if target_norm in html_norm:
    html_norm = html_norm.replace(target_norm, replacement_norm)
    # Bump cache buster to v=10
    html_norm = html_norm.replace('/js/game.js?v=9', '/js/game.js?v=10')
    html_norm = html_norm.replace('/css/style.css?v=9', '/css/style.css?v=10')
    with open(r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/index.html', 'w', encoding='utf-8') as f:
        f.write(html_norm)
    print("Successfully updated header in index.html and bumped version to v=10!")
else:
    print("Could not find target in index.html!")
