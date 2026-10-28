import os
import re

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
html_path = os.path.join(base_dir, 'public', 'index.html')
css_path = os.path.join(base_dir, 'public', 'css', 'style.css')
js_path = os.path.join(base_dir, 'public', 'js', 'game.js')

print("Reconstructing Web GUI from authentic Unity Project DMC_Project (v=52)...")

# 1. Update index.html
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Reconstruct Bottom Navigation Bar (MenuGroup [5734] from Game.unity)
old_bottom_nav_regex = r'<div class="bottom-nav-authentic-perfect">[\s\S]*?</div>\s*</div>'

new_bottom_nav_html = """<!-- Authentic MenuGroup Bottom Navigation Bar from Game.unity [5734] -->
            <div class="unity-menu-group-bar">
                <img src="/assets/ui/dmc_authentic/home_03_03.png" class="menu-group-bg" alt="Menu Bar"/>
                
                <!-- BottomLeftA: Gold Dragon HomeBtn -->
                <button class="menu-home-btn active" data-tab="home" onclick="switchTab('home')" title="Trang chủ">
                    <img src="/assets/ui/dmc_authentic/home_03_42.png" class="menu-home-dragon" alt="Trang chủ"/>
                    <img src="/assets/ui/dmc_authentic/home_03_34.png" class="menu-home-mask" alt=""/>
                </button>

                <img src="/assets/ui/dmc_authentic/home_03_15.png" class="menu-arrow-left" alt="<"/>

                <!-- BottomA: SliderMenu Tabs -->
                <div class="menu-slider-scroll" id="menu-slider-scroll">
                    <!-- NhanVatBtn: Đội hình -->
                    <button class="menu-tab-btn" data-tab="formation" onclick="switchTab('formation')" title="Đội hình">
                        <img src="/assets/ui/dmc_authentic/home_03_30.png" class="menu-tab-icon" alt="Đội hình"/>
                        <img src="/assets/ui/dmc_authentic/home_03_34.png" class="menu-tab-mask" alt=""/>
                        <span class="menu-tab-label">Đội hình</span>
                    </button>

                    <!-- GiangHoBtn: Giang hồ -->
                    <button class="menu-tab-btn" data-tab="giangho" onclick="switchTab('giangho')" title="Giang hồ">
                        <img src="/assets/ui/dmc_authentic/home_03_38.png" class="menu-tab-icon" alt="Giang hồ"/>
                        <img src="/assets/ui/dmc_authentic/home_03_34.png" class="menu-tab-mask" alt=""/>
                        <span class="menu-tab-label">Giang hồ</span>
                    </button>

                    <!-- LuyenCongBtn: Luyện công -->
                    <button class="menu-tab-btn" data-tab="luyencong" onclick="switchTab('luyencong')" title="Luyện công">
                        <img src="/assets/ui/dmc_authentic/home_03_27.png" class="menu-tab-icon" alt="Luyện công"/>
                        <img src="/assets/ui/dmc_authentic/home_03_34.png" class="menu-tab-mask" alt=""/>
                        <span class="menu-tab-label">Luyện công</span>
                    </button>

                    <!-- KyNgoBtn: Kỳ ngộ -->
                    <button class="menu-tab-btn" data-tab="recruit" onclick="switchTab('recruit')" title="Kỳ ngộ">
                        <img src="/assets/ui/dmc_authentic/home_03_09.png" class="menu-tab-icon" alt="Kỳ ngộ"/>
                        <img src="/assets/ui/dmc_authentic/home_03_34.png" class="menu-tab-mask" alt=""/>
                        <span class="menu-tab-label">Kỳ ngộ</span>
                    </button>

                    <!-- CuaHangBtn: Chợ -->
                    <button class="menu-tab-btn" data-tab="market" onclick="switchTab('market')" title="Chợ">
                        <img src="/assets/ui/dmc_authentic/home_03_20.png" class="menu-tab-icon" alt="Chợ"/>
                        <img src="/assets/ui/dmc_authentic/home_03_34.png" class="menu-tab-mask" alt=""/>
                        <span class="menu-tab-label">Chợ</span>
                    </button>

                    <!-- LuanKiemBtn: Luận kiếm -->
                    <button class="menu-tab-btn" data-tab="luankiem" onclick="switchTab('luankiem')" title="Luận kiếm">
                        <img src="/assets/ui/dmc_authentic/home_03_22.png" class="menu-tab-icon" alt="Luận kiếm"/>
                        <img src="/assets/ui/dmc_authentic/home_03_34.png" class="menu-tab-mask" alt=""/>
                        <span class="menu-tab-label">Luận kiếm</span>
                    </button>

                    <!-- BangHoiBtn: Liên minh / Bang hội -->
                    <button class="menu-tab-btn" data-tab="lienminh" onclick="openLienMinhModal()" title="Liên minh">
                        <img src="/assets/ui/dmc_authentic/home_03_21.png" class="menu-tab-icon" alt="Liên minh"/>
                        <img src="/assets/ui/dmc_authentic/home_03_34.png" class="menu-tab-mask" alt=""/>
                        <span class="menu-tab-label">Liên minh</span>
                    </button>
                </div>

                <img src="/assets/ui/dmc_authentic/home_03_11.png" class="menu-arrow-right" alt=">"/>
            </div>
        </div>"""

html = re.sub(old_bottom_nav_regex, new_bottom_nav_html, html)
print("Replaced bottom nav with authentic Unity MenuGroup!")

# Update Header Profile to use authentic Unity sprites
old_header_regex = r'<div class="header-profile-authentic-perfect">[\s\S]*?</div>\s*</div>'
# Let's find exact header HTML lines
hdr_start = html.find('<div class="header-profile-authentic-perfect">')
if hdr_start != -1:
    hdr_end = html.find('</div>', html.find('id="header-qi"', hdr_start)) + 6
    old_hdr_block = html[hdr_start:hdr_end]
    new_hdr_block = """<div class="unity-header-profile-bar">
                    <!-- TopLeftA: MonPhaiExp -->
                    <div class="unity-hdr-left">
                        <div class="unity-lvl-badge">
                            <img src="/assets/ui/dmc_authentic/home_06.png" class="unity-lvl-bg" alt="Level"/>
                            <span id="header-level" class="unity-lvl-text">1</span>
                        </div>
                        <div class="unity-sect-info">
                            <div id="header-player-name" class="unity-sect-name">Đại Hiệp</div>
                            <div class="unity-exp-bar-wrap">
                                <img src="/assets/ui/dmc_authentic/home_03.png" class="unity-exp-bg" alt=""/>
                                <div id="header-exp-fill" class="unity-exp-fill">
                                    <img src="/assets/ui/dmc_authentic/home_10.png" class="unity-exp-img" alt=""/>
                                </div>
                                <span id="header-exp-text" class="unity-exp-text">0/100</span>
                            </div>
                        </div>
                    </div>

                    <!-- TopRightA: Currencies & Stamina -->
                    <div class="unity-hdr-right">
                        <div class="unity-stat-row">
                            <span id="header-vip-badge" class="unity-stat-item">
                                <img src="/assets/ui/dmc_authentic/icon_vip6.png" class="unity-vip-icon" alt="VIP"/>
                            </span>
                            <div class="unity-stat-item" title="KNB / Vàng">
                                <img src="/assets/ui/dmc_authentic/icon_vang.png" class="unity-cur-icon" alt="Vàng"/>
                                <span id="header-knb" class="unity-stat-val">0</span>
                            </div>
                            <div class="unity-stat-item" title="Thể lực">
                                <img src="/assets/ui/dmc_authentic/icon_LuotGiangHo.png" class="unity-cur-icon" alt="Thể lực"/>
                                <span id="header-stamina" class="unity-stat-val">30/30</span>
                            </div>
                        </div>
                        <div class="unity-stat-row">
                            <div class="unity-stat-item" title="Ngân lượng / Bạc">
                                <img src="/assets/ui/dmc_authentic/icon_bac.png" class="unity-cur-icon" alt="Bạc"/>
                                <span id="header-bac" class="unity-stat-val">0</span>
                            </div>
                            <div class="unity-stat-item" title="Khí lực / Bí kíp">
                                <img src="/assets/ui/dmc_authentic/icon_LuotTimBiKip.png" class="unity-cur-icon" alt="Khí lực"/>
                                <span id="header-qi" class="unity-stat-val">30/30</span>
                            </div>
                        </div>
                    </div>
                </div>"""
    html = html[:hdr_start] + new_hdr_block + html[hdr_end:]
    print("Replaced header profile with authentic Unity TopLeftA / TopRightA layout!")

# Update Home lower board:
# Replace activity and utility button images to use dmc_authentic paths
html = html.replace('/assets/ui/home_authentic/clean_icon_longchau.png', '/assets/ui/dmc_authentic/longchau.png')
html = html.replace('/assets/ui/home_authentic/clean_icon_lienserver.png', '/assets/ui/dmc_authentic/lien sever.png')
html = html.replace('/assets/ui/home_authentic/clean_icon_luankiem.png', '/assets/ui/dmc_authentic/home_02_12.png')
html = html.replace('/assets/ui/home_authentic/clean_icon_luyencong.png', '/assets/ui/dmc_authentic/am_khi.png')
html = html.replace('/assets/ui/home_authentic/clean_icon_fanpage.png', '/assets/ui/dmc_authentic/fanpage.png')
html = html.replace('/assets/ui/home_authentic/clean_icon_lienminh.png', '/assets/ui/dmc_authentic/home_02_43.png')

html = html.replace('/assets/ui/home_authentic/clean_btn_taynai.png', '/assets/ui/dmc_authentic/home_02_72.png')
html = html.replace('/assets/ui/home_authentic/clean_btn_volampho.png', '/assets/ui/dmc_authentic/home_02_15.png')
html = html.replace('/assets/ui/home_authentic/clean_btn_truyenthu.png', '/assets/ui/dmc_authentic/home_02_66.png')
html = html.replace('/assets/ui/home_authentic/clean_btn_anoan.png', '/assets/ui/dmc_authentic/home_02_54.png')
html = html.replace('/assets/ui/home_authentic/clean_btn_trochuyen.png', '/assets/ui/dmc_authentic/home_02_45.png')
html = html.replace('/assets/ui/home_authentic/clean_btn_caidat.png', '/assets/ui/dmc_authentic/home_02_70.png')

# Bump asset cache version to v=52
html = html.replace('style.css?v=51', 'style.css?v=52')
html = html.replace('game.js?v=51', 'game.js?v=52')

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated index.html successfully!")


# 2. Update style.css
with open(css_path, 'r', encoding='utf-8') as f:
    css = f.read()

# Add CSS rules for unity-menu-group-bar and unity-header-profile-bar
unity_ui_css = """
/* =========================================================================
   AUTHENTIC UNITY NGUI RECONSTRUCTED UI (DMC_Project v=52)
   ========================================================================= */

/* 1. Header Profile Bar (TopLeftA + TopRightA) */
.unity-header-profile-bar {
    position: relative;
    width: 100%;
    height: 72px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 10px;
    box-sizing: border-box;
    background: linear-gradient(to bottom, rgba(20, 12, 6, 0.95), rgba(30, 18, 10, 0.85));
    border-bottom: 2px solid #5a381e;
    z-index: 10;
    user-select: none;
}

.unity-hdr-left {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
}

.unity-lvl-badge {
    position: relative;
    width: 44px;
    height: 44px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
}

.unity-lvl-bg {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.unity-lvl-text {
    position: relative;
    z-index: 2;
    color: #fff2a3;
    font-size: 16px;
    font-weight: 900;
    text-shadow: 0 1px 3px rgba(0,0,0,0.9), 0 0 5px #d97706;
}

.unity-sect-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.unity-sect-name {
    font-size: 13px;
    font-weight: 700;
    color: #fef08a;
    text-shadow: 0 1px 3px rgba(0,0,0,0.9);
}

.unity-exp-bar-wrap {
    position: relative;
    width: 130px;
    height: 14px;
    display: flex;
    align-items: center;
}

.unity-exp-bg {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: fill;
}

.unity-exp-fill {
    position: absolute;
    left: 2px;
    top: 2px;
    height: 10px;
    width: 45%;
    overflow: hidden;
    z-index: 2;
}

.unity-exp-img {
    width: 126px;
    height: 100%;
    object-fit: cover;
}

.unity-exp-text {
    position: relative;
    z-index: 3;
    width: 100%;
    text-align: center;
    font-size: 9px;
    font-weight: bold;
    color: #ffffff;
    text-shadow: 0 1px 2px rgba(0,0,0,0.9);
}

.unity-hdr-right {
    display: flex;
    flex-direction: column;
    gap: 3px;
    align-items: flex-end;
}

.unity-stat-row {
    display: flex;
    align-items: center;
    gap: 10px;
}

.unity-stat-item {
    display: flex;
    align-items: center;
    gap: 3px;
}

.unity-vip-icon {
    height: 20px;
    width: auto;
    object-fit: contain;
    filter: drop-shadow(0 1px 2px rgba(0,0,0,0.8));
}

.unity-cur-icon {
    width: 18px;
    height: 18px;
    object-fit: contain;
    filter: drop-shadow(0 1px 3px rgba(0,0,0,0.8));
}

.unity-stat-val {
    font-size: 11px;
    font-weight: 700;
    color: #fef3c7;
    text-shadow: 0 1px 2px rgba(0,0,0,0.9);
}


/* 2. MenuGroup Navigation Bar (BottomLeftA + BottomA from Game.unity) */
.unity-menu-group-bar {
    position: relative;
    width: 100%;
    height: 68px;
    display: flex;
    align-items: center;
    background: transparent;
    user-select: none;
    z-index: 20;
    padding: 0 2px;
    box-sizing: border-box;
}

.menu-group-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: fill;
    z-index: 1;
    pointer-events: none;
}

.menu-home-btn {
    position: relative;
    z-index: 5;
    background: transparent;
    border: none;
    outline: none;
    cursor: pointer;
    width: 58px;
    height: 62px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    margin-left: 4px;
    flex-shrink: 0;
    -webkit-tap-highlight-color: transparent;
    transition: transform 0.1s ease, filter 0.1s ease;
}

.menu-home-dragon {
    position: absolute;
    width: 54px;
    height: 56px;
    object-fit: contain;
    z-index: 2;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.8));
}

.menu-home-mask {
    position: absolute;
    width: 62px;
    height: 62px;
    object-fit: contain;
    z-index: 1;
    opacity: 0.85;
}

.menu-home-btn:active {
    transform: scale(0.92);
    filter: brightness(1.2);
}

.menu-home-btn.active .menu-home-dragon {
    filter: drop-shadow(0 0 8px rgba(251, 191, 36, 0.95)) drop-shadow(0 2px 4px rgba(0,0,0,0.9));
}

.menu-arrow-left,
.menu-arrow-right {
    position: relative;
    z-index: 3;
    width: 14px;
    height: 28px;
    object-fit: contain;
    opacity: 0.75;
    flex-shrink: 0;
}

.menu-slider-scroll {
    position: relative;
    z-index: 4;
    display: flex;
    align-items: center;
    height: 100%;
    flex: 1;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;
    -ms-overflow-style: none;
    padding: 0 4px;
    gap: 4px;
}

.menu-slider-scroll::-webkit-scrollbar {
    display: none;
}

.menu-tab-btn {
    position: relative;
    background: transparent;
    border: none;
    outline: none;
    cursor: pointer;
    min-width: 50px;
    height: 60px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0;
    flex-shrink: 0;
    -webkit-tap-highlight-color: transparent;
    transition: transform 0.1s ease, filter 0.1s ease;
}

.menu-tab-icon {
    width: 42px;
    height: 42px;
    object-fit: contain;
    z-index: 2;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.7));
}

.menu-tab-mask {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 48px;
    height: 48px;
    object-fit: contain;
    z-index: 1;
    opacity: 0.6;
    pointer-events: none;
}

.menu-tab-label {
    font-size: 10px;
    font-weight: 700;
    color: #fde68a;
    text-shadow: 0 1px 3px rgba(0,0,0,0.95);
    margin-top: -2px;
    z-index: 3;
}

.menu-tab-btn:active {
    transform: scale(0.92);
    filter: brightness(1.2);
}

.menu-tab-btn.active .menu-tab-icon {
    filter: drop-shadow(0 0 6px rgba(56, 189, 248, 0.95)) drop-shadow(0 2px 4px rgba(0,0,0,0.9));
}

.menu-tab-btn.active .menu-tab-label {
    color: #38bdf8;
    text-shadow: 0 0 6px rgba(56, 189, 248, 0.8), 0 1px 3px #000;
}
"""

if '.unity-menu-group-bar' not in css:
    css += unity_ui_css
    print("Added unity UI CSS rules!")

with open(css_path, 'w', encoding='utf-8') as f:
    f.write(css)
print("Updated style.css successfully!")


# 3. Update game.js
with open(js_path, 'r', encoding='utf-8') as f:
    js = f.read()

# In switchTab, ensure .menu-tab-btn and .menu-home-btn update their active class
old_tab_btn_selector = "document.querySelectorAll('.bottom-tab-auth-btn, .tab-btn-auth, .nav-perf-hotspot').forEach(btn => {"
new_tab_btn_selector = "document.querySelectorAll('.bottom-tab-auth-btn, .tab-btn-auth, .nav-perf-hotspot, .menu-tab-btn, .menu-home-btn').forEach(btn => {"

if old_tab_btn_selector in js:
    js = js.replace(old_tab_btn_selector, new_tab_btn_selector)
    print("Updated switchTab button selector in game.js!")

with open(js_path, 'w', encoding='utf-8') as f:
    f.write(js)
print("Updated game.js successfully!")

print("Reconstruction complete!")
