import sys
sys.stdout.reconfigure(encoding='utf-8')

# 1. Update public/index.html
with open('public/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

start_marker = '<div id="tab-formation" class="tab-view"'
end_marker = '<!-- Tab 3: Giang Hồ'

p1 = html.find(start_marker)
p2 = html.find(end_marker)

if p1 != -1 and p2 != -1:
    new_dantran_html = '''<div id="tab-formation" class="tab-view dantran-authentic-view" style="display: none;">
                    <!-- Top Disciple Roster Strip + "Dàn Trận" Button (Matching Original Game) -->
                    <div class="dt-top-roster-row">
                        <div class="dt-disciple-avatars-track" id="dt-disciple-avatars-track"></div>
                        <div class="dt-btn-dantran-wrapper" onclick="openFormationOverviewModal()" title="Bát Quái Trận (8 Vị Trí) & Thất Tinh Trận">
                            <img src="/assets/ui/dantran_authentic/btn_dantran.png" class="dt-btn-dantran-img" alt="Dàn Trận"/>
                        </div>
                    </div>

                    <!-- Main Center Stage: Flanked by 4 Skills (Left) and 4 Equipment (Right), with Hanging Scroll in Center -->
                    <div class="dt-main-stage">
                        <!-- Left Column: 4 Võ Công Skills Slots + Orbs -->
                        <div class="dt-left-column">
                            <div class="dt-slot-box" id="dt-skill-slot-0" onclick="handleSkillSlotClick(0)" title="Võ công thiên phú"></div>
                            <div class="dt-slot-box" id="dt-skill-slot-1" onclick="handleSkillSlotClick(1)" title="Võ công phụ 1"></div>
                            <div class="dt-slot-box" id="dt-skill-slot-2" onclick="handleSkillSlotClick(2)" title="Võ công phụ 2"></div>
                            <div class="dt-slot-box" id="dt-skill-slot-3" onclick="handleSkillSlotClick(3)" title="Võ công phụ 3"></div>
                            <!-- Bottom Left Orbs -->
                            <div class="dt-orb-longchau" onclick="openLongChauModal()" title="Long Châu">
                                <img src="/assets/ui/dantran_authentic/orb_longchau.png" alt="Long Châu"/>
                            </div>
                            <div class="dt-orb-amkhi" onclick="openAmKhiModal()" title="Ám Khí">
                                <img src="/assets/ui/dantran_authentic/orb_amkhi.png" alt="Ám Khí"/>
                            </div>
                        </div>

                        <!-- Center Hanging Scroll Painting -->
                        <div class="dt-center-scroll">
                            <div class="dt-scroll-canvas" id="dt-scroll-canvas">
                                <!-- Top Row: Calligraphy Name & Tier Badge -->
                                <div class="dt-hero-top-row">
                                    <div class="dt-hero-calligraphy" id="dt-hero-name-calligraphy">Trương Tam Phong</div>
                                    <div class="dt-hero-tier-badge" id="dt-hero-tier-badge">GIÁP</div>
                                </div>

                                <!-- Full Figure Image in Center -->
                                <div class="dt-hero-figure-wrap">
                                    <img id="dt-hero-figure-img" class="dt-hero-figure-img" src="/assets/images/NV_TruongTamPhong_ava_to.png" alt="Hero"/>
                                </div>

                                <!-- Level, Breakthrough & EXP Bar -->
                                <div class="dt-hero-level-row">
                                    <span id="dt-hero-level-text" class="dt-hero-level-text">Lv.1 +0</span>
                                    <div class="dt-hero-exp-bar">
                                        <div id="dt-hero-exp-fill" class="dt-hero-exp-fill"></div>
                                        <span id="dt-hero-exp-text" class="dt-hero-exp-text">0 / 100</span>
                                    </div>
                                </div>

                                <!-- 4 Core Stats Row with Authentic Icons -->
                                <div class="dt-stats-bar">
                                    <div class="dt-stat-item">
                                        <img src="/assets/ui/BM_mau1.png" class="dt-stat-icon" alt="Khí Huyết"/>
                                        <span id="dt-stat-mau">0</span>
                                    </div>
                                    <div class="dt-stat-item">
                                        <img src="/assets/ui/BM_cong1.png" class="dt-stat-icon" alt="Vũ Lực"/>
                                        <span id="dt-stat-cong">0</span>
                                    </div>
                                    <div class="dt-stat-item">
                                        <img src="/assets/ui/BM_thu1.png" class="dt-stat-icon" alt="Hộ Thể"/>
                                        <span id="dt-stat-thu">0</span>
                                    </div>
                                    <div class="dt-stat-item">
                                        <img src="/assets/ui/BM_noi1.png" class="dt-stat-icon" alt="Nội Lực"/>
                                        <span id="dt-stat-noi">0</span>
                                    </div>
                                </div>

                                <!-- 6 Duyên Phận (Bonds) 2-Column Grid -->
                                <div class="dt-duyenphan-grid" id="dt-duyenphan-grid"></div>
                            </div>
                        </div>

                        <!-- Right Column: 4 Trang Bị Equipment Slots + Chân Khí Orb -->
                        <div class="dt-right-column">
                            <div class="dt-slot-box" id="dt-item-slot-0" onclick="handleItemSlotClick('VuKhi')" title="Vũ khí"></div>
                            <div class="dt-slot-box" id="dt-item-slot-1" onclick="handleItemSlotClick('AoGiap')" title="Áo giáp"></div>
                            <div class="dt-slot-box" id="dt-item-slot-2" onclick="handleItemSlotClick('TrangSuc')" title="Trang sức"></div>
                            <div class="dt-slot-box" id="dt-item-slot-3" onclick="handleItemSlotClick('BaoBoi')" title="Bảo bối"></div>
                            <!-- Bottom Right Chân Khí Orb -->
                            <div class="dt-orb-chankhi" onclick="openChanKhiModal()" title="Chân Khí">
                                <img src="/assets/ui/dantran_authentic/orb_chankhi.png" alt="Chân Khí"/>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Bát Quái Trận & Thất Tinh Trận Overview Modal (Triggered by 'Dàn Trận' button) -->
                <div id="dantran-overview-modal" class="modal-overlay">
                    <div class="modal-box-wuxia" style="width: 94%; max-width: 440px; max-height: 90vh; overflow-y: auto;">
                        <div class="modal-header">
                            <h3>⚔️ BÁT QUÁI TRẬN (8 VỊ TRÍ) & THẤT TINH</h3>
                            <button class="btn-close-modal" onclick="closeFormationOverviewModal()">✕</button>
                        </div>
                        <div class="formation-power-banner" style="margin: 8px 0;">
                            <div class="power-tag">Tổng Trị: <span id="formation-total-power" style="color: #ffd700; font-weight: 900;">2.524.651</span></div>
                            <div class="power-tag">Khí Thế: <span id="formation-khi-the" style="color: #38bdf8; font-weight: 900;">99.990</span></div>
                        </div>
                        <div class="formation-sub-nav" style="margin-bottom: 8px;">
                            <button class="sub-tab-btn active" id="subtab-btn-batquai" onclick="switchFormationSubTab('batquai')">Bát Quái Trận (8 Vị Trí)</button>
                            <button class="sub-tab-btn" id="subtab-btn-thattinh" onclick="switchFormationSubTab('thattinh')">Thất Tinh Trận (Hỗ Trợ)</button>
                        </div>
                        <div id="subtab-view-batquai" class="formation-board">
                            <img class="bat-quai-watermark" src="/assets/ui/Background_bat_quai.png" alt="Bát Quái">
                            <div id="formation-container" class="formation-slots-grid"></div>
                        </div>
                        <div id="subtab-view-thattinh" class="thattinh-board" style="display: none;">
                            <div class="thattinh-desc">Thất Tinh Trận: 7 vị trí sao tương hỗ, gia tăng 25% Khí Huyết, Vũ Lực, Hộ Thể và Nội Lực cho toàn bộ đệ tử xuất chiến!</div>
                            <div id="thattinh-slots-grid" class="thattinh-slots-grid"></div>
                        </div>
                    </div>
                </div>

                '''
    html = html[:p1] + new_dantran_html + html[p2:]
    with open('public/index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print('Updated public/index.html with authentic Dàn Trận GUI!')
else:
    print('Error: Could not find tab-formation markers in index.html', p1, p2)

# 2. Update public/css/style.css
with open('public/css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

dt_css = '''
/* ================= AUTHENTIC DÀN TRẬN GUI (MATCHING 4 ORIGINAL SCREENSHOTS) ================= */
.dantran-authentic-view {
    padding: 6px 8px 10px 8px !important;
    background: #140b06 url('/assets/ui/Background.png') no-repeat center top;
    background-size: cover;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    gap: 6px;
    box-sizing: border-box;
}

/* 1. Top Disciple Roster Strip + "Dàn Trận" Button */
.dt-top-roster-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    width: 100%;
    height: 56px;
    flex-shrink: 0;
}

.dt-disciple-avatars-track {
    display: flex;
    align-items: center;
    gap: 8px;
    overflow-x: auto;
    overflow-y: hidden;
    flex: 1;
    height: 100%;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    padding: 2px 2px;
}

.dt-disciple-avatars-track::-webkit-scrollbar {
    display: none;
}

.dt-disciple-box {
    width: 48px;
    height: 48px;
    flex-shrink: 0;
    border: 2px solid #b45309;
    border-radius: 6px;
    overflow: hidden;
    background: #1e110a;
    position: relative;
    cursor: pointer;
    scroll-snap-align: center;
    transition: transform 0.12s ease, border-color 0.12s ease;
    user-select: none;
}

.dt-disciple-box:active {
    transform: scale(0.95);
}

.dt-disciple-box.active {
    border: 2px solid #c084fc;
    box-shadow: 0 0 10px #a855f7;
    transform: scale(1.06);
}

.dt-disciple-box img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.dt-disciple-level-badge {
    position: absolute;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.85);
    color: #ffd700;
    font-size: 8px;
    font-weight: 900;
    padding: 0 3px;
    border-radius: 0 4px 0 0;
    line-height: 12px;
}

.dt-btn-dantran-wrapper {
    width: 40px;
    height: 52px;
    flex-shrink: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.1s ease;
}

.dt-btn-dantran-wrapper:active {
    transform: scale(0.94);
}

.dt-btn-dantran-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.7));
}

/* 2. Main Center Stage */
.dt-main-stage {
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    width: 100%;
    flex: 1;
    position: relative;
    gap: 4px;
}

.dt-left-column, .dt-right-column {
    width: 54px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    gap: 6px;
    padding: 4px 0;
}

.dt-slot-box {
    width: 50px;
    height: 50px;
    border-radius: 6px;
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    background: url('/assets/ui/dantran_authentic/slot_empty_question.png') no-repeat center center;
    background-size: 100% 100%;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
    transition: transform 0.12s ease;
}

.dt-slot-box:hover {
    transform: scale(1.05);
}

.dt-slot-box img {
    width: 44px;
    height: 44px;
    object-fit: contain;
}

.dt-slot-level-badge {
    position: absolute;
    top: 1px;
    right: 2px;
    background: rgba(0, 0, 0, 0.85);
    color: #ffd700;
    font-size: 9px;
    font-weight: 900;
    padding: 0 3px;
    border-radius: 3px;
    border: 1px solid #78350f;
    line-height: 12px;
}

.dt-orb-longchau, .dt-orb-amkhi, .dt-orb-chankhi {
    width: 50px;
    height: 50px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.12s ease;
}

.dt-orb-longchau:hover, .dt-orb-amkhi:hover, .dt-orb-chankhi:hover {
    transform: scale(1.08);
}

.dt-orb-longchau img, .dt-orb-amkhi img, .dt-orb-chankhi img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.6));
}

/* 3. Center Hanging Scroll Painting */
.dt-center-scroll {
    flex: 1;
    max-width: 326px;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: url('/assets/ui/dantran_authentic/hanging_scroll_clean.png') no-repeat center center;
    background-size: 100% 100%;
    aspect-ratio: 350 / 560;
    padding: 24px 14px 22px 14px;
    box-sizing: border-box;
    justify-content: space-between;
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.65);
}

.dt-scroll-canvas {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
}

.dt-hero-top-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 26px;
}

.dt-hero-calligraphy {
    font-family: 'Times New Roman', cursive, serif;
    font-size: 19px;
    font-weight: 900;
    color: #1c0a00;
    line-height: 1;
    letter-spacing: 0.5px;
    text-shadow: 0 1px 1px rgba(255, 255, 255, 0.5);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 75%;
}

.dt-hero-tier-badge {
    font-size: 10px;
    font-weight: 900;
    color: #ffd700;
    background: #6b21a8;
    border: 1px solid #d8b4fe;
    border-radius: 3px;
    padding: 1px 6px;
    line-height: 14px;
    text-shadow: 1px 1px 1px #000;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}

.dt-hero-figure-wrap {
    position: relative;
    width: 100%;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 175px;
    overflow: hidden;
}

.dt-hero-figure-img {
    max-height: 100%;
    max-width: 100%;
    object-fit: contain;
    filter: drop-shadow(0 5px 8px rgba(0, 0, 0, 0.65));
}

.dt-hero-level-row {
    display: flex;
    align-items: center;
    gap: 6px;
    width: 100%;
    height: 18px;
    margin-bottom: 3px;
}

.dt-hero-level-text {
    font-size: 11px;
    font-weight: 900;
    color: #1c0a00;
    font-family: 'Times New Roman', serif;
}

.dt-hero-exp-bar {
    flex: 1;
    height: 14px;
    background: #3b1d11;
    border-radius: 7px;
    border: 1px solid #78350f;
    position: relative;
    overflow: hidden;
}

.dt-hero-exp-fill {
    height: 100%;
    width: 45%;
    background: linear-gradient(90deg, #ea580c, #f59e0b);
    transition: width 0.3s ease;
}

.dt-hero-exp-text {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    font-size: 8px;
    line-height: 14px;
    text-align: center;
    color: #fff;
    font-weight: bold;
    text-shadow: 1px 1px 1px #000;
}

.dt-stats-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    background: rgba(255, 255, 255, 0.35);
    border: 1px solid #c2a682;
    border-radius: 4px;
    padding: 2px 4px;
    box-sizing: border-box;
    margin-bottom: 4px;
}

.dt-stat-item {
    display: flex;
    align-items: center;
    gap: 3px;
    font-size: 9.5px;
    font-weight: 900;
    color: #2b1104;
}

.dt-stat-icon {
    width: 14px;
    height: 14px;
    object-fit: contain;
}

.dt-duyenphan-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2px 6px;
    width: 100%;
    font-size: 9px;
    font-weight: bold;
    line-height: 1.25;
}

.dt-duyen-item {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.dt-duyen-item.active {
    color: #d97706;
    text-shadow: 0 0 3px rgba(245, 158, 11, 0.4);
}

.dt-duyen-item.inactive {
    color: #4a2711;
    opacity: 0.8;
}
'''

if '.dantran-authentic-view' not in css:
    css += '\n' + dt_css
    print('Appended Dàn Trận CSS!')
else:
    pos = css.find('/* ================= AUTHENTIC DÀN TRẬN GUI')
    if pos != -1:
        css = css[:pos] + dt_css
        print('Updated Dàn Trận CSS!')

with open('public/css/style.css', 'w', encoding='utf-8') as f:
    f.write(css)

print('Updated public/css/style.css successfully!')
