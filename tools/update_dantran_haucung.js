const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

// 1. UPDATE public/index.html
const indexPath = path.join(rootDir, 'public', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const oldTabFormationStart = '<div id="tab-formation" class="tab-view dantran-authentic-view" style="display: none;">';
const newTabFormationContent = `<div id="tab-formation" class="tab-view dantran-authentic-view" style="display: none;">
                    <!-- Top Sub-mode Icons & Plaque (100% Authentic Matching Original Game Screenshot) -->
                    <div class="dt-top-submode-row">
                        <button class="dt-submode-btn active" id="btn-dt-mode-tran1" onclick="switchDantranMode('tran1')" title="Trận 1 - Bát Quái Trận">
                            <img src="/assets/ui/dantran_authentic/icon_tran1.png" alt="Trận 1" class="dt-submode-icon"/>
                        </button>
                        <button class="dt-submode-btn" id="btn-dt-mode-tran2" onclick="switchDantranMode('tran2')" title="Trận 2 - Thất Tinh Trận">
                            <img src="/assets/ui/dantran_authentic/icon_tran2.png" alt="Trận 2" class="dt-submode-icon"/>
                        </button>
                        <button class="dt-submode-btn" id="btn-dt-mode-long" onclick="switchDantranMode('long')" title="Long Trận">
                            <img src="/assets/ui/dantran_authentic/icon_tran3_long.png" alt="Long Trận" class="dt-submode-icon"/>
                        </button>
                        <button class="dt-submode-btn" id="btn-dt-mode-haucung" onclick="switchDantranMode('haucung')" title="Hậu Cung">
                            <img src="/assets/ui/dantran_authentic/icon_haucung.png" alt="Hậu Cung" class="dt-submode-icon"/>
                        </button>
                        <div class="dt-plaque-wrapper" onclick="openFormationOverviewModal()" title="Dàn Trận">
                            <img src="/assets/ui/dantran_authentic/plaque_dantran_vert.png" alt="Dàn Trận" class="dt-plaque-img"/>
                        </div>
                    </div>

                    <!-- View A: Main Formation (Disciple Detail, Equipment & Skills) -->
                    <div id="dt-view-main" class="dt-view-container">`;

const oldFormationRegex = /<div id="tab-formation" class="tab-view dantran-authentic-view" style="display: none;">\s*<!-- Top Disciple Roster Strip[\s\S]*?<!-- Authentic Action Controls Bar \/ Roster Switcher -->[\s\S]*?<\/div>\s*<\/div>\s*<div id="tab-giangho"/;

const replacementFormation = `${newTabFormationContent}
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
                                    <div class="dt-hero-figure-container">
                                        <img src="/assets/images/NV_TruongTamPhong_ava_to.png" id="dt-hero-figure-img" class="dt-hero-figure-img" alt="Hero"/>
                                    </div>

                                    <!-- Bottom Info Overlay -->
                                    <div class="dt-hero-bottom-info">
                                        <div class="dt-hero-level" id="dt-hero-level-text">Lv.100 +5</div>
                                        <div class="dt-hero-stats-row">
                                            <span>Máu:<b id="dt-hero-hp">34500</b></span>
                                            <span>Công:<b id="dt-hero-atk">12800</b></span>
                                            <span>Thủ:<b id="dt-hero-def">9800</b></span>
                                            <span>Nội:<b id="dt-hero-int">15600</b></span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Right Column: 4 Equipment Slots + Orbs -->
                            <div class="dt-right-column">
                                <div class="dt-slot-box" id="dt-equip-slot-0" onclick="handleEquipSlotClick(0)" title="Vũ Khí"></div>
                                <div class="dt-slot-box" id="dt-equip-slot-1" onclick="handleEquipSlotClick(1)" title="Giáp Trụ"></div>
                                <div class="dt-slot-box" id="dt-equip-slot-2" onclick="handleEquipSlotClick(2)" title="Trang Sức"></div>
                                <div class="dt-slot-box" id="dt-equip-slot-3" onclick="handleEquipSlotClick(3)" title="Bảo Vật"></div>
                                <!-- Bottom Right Orbs -->
                                <div class="dt-orb-chankhi" onclick="openChanKhiModal()" title="Chân Khí">
                                    <img src="/assets/ui/dantran_authentic/orb_chankhi.png" alt="Chân Khí"/>
                                </div>
                                <div class="dt-orb-bequan" onclick="openBeQuanModal()" title="Bế Quan">
                                    <img src="/assets/ui/dantran_authentic/orb_chankhi.png" alt="Bế Quan" style="filter: hue-rotate(90deg);"/>
                                </div>
                            </div>
                        </div>

                        <!-- Authentic Action Controls Bar / Roster Switcher -->
                        <div class="dt-bottom-actions-bar">
                            <button class="dt-btn-action" onclick="openDiscipleDetailModal()">Thuộc tính</button>
                            <button class="dt-btn-action" onclick="openDiscipleBoiDuongModal()">Bồi dưỡng</button>
                            <button class="dt-btn-action" onclick="openDiscipleTruyenCongModal()">Truyền công</button>
                            <button class="dt-btn-action" onclick="openDiscipleCaiTaoModal()">Đột phá</button>
                        </div>
                    </div>

                    <!-- View B: 100% Authentic Hậu Cung Screen (media_1793066451321_a85b6675.jpg) -->
                    <div id="dt-view-haucung" class="dt-haucung-view" style="display: none;">
                        <div class="hc-scroll-wrapper">
                            <!-- Top Roller -->
                            <img src="/assets/ui/dantran_authentic/scroll_top_roller.png" class="hc-scroll-roller" alt="Scroll Top"/>

                            <!-- Chamber Background & 8 Disciples -->
                            <div class="hc-chamber-board">
                                <img src="/assets/ui/dantran_authentic/haucung_chamber_bg.png" class="hc-chamber-bg" alt="Chamber"/>
                                
                                <!-- Left Column 4 Disciples -->
                                <div class="hc-slots-column hc-col-left">
                                    <div class="hc-slot-card" id="hc-slot-0" onclick="handleHauCungSlotClick(0)"></div>
                                    <div class="hc-slot-card" id="hc-slot-1" onclick="handleHauCungSlotClick(1)"></div>
                                    <div class="hc-slot-card" id="hc-slot-2" onclick="handleHauCungSlotClick(2)"></div>
                                    <div class="hc-slot-card" id="hc-slot-3" onclick="handleHauCungSlotClick(3)"></div>
                                </div>

                                <!-- Right Column 4 Disciples -->
                                <div class="hc-slots-column hc-col-right">
                                    <div class="hc-slot-card" id="hc-slot-4" onclick="handleHauCungSlotClick(4)"></div>
                                    <div class="hc-slot-card" id="hc-slot-5" onclick="handleHauCungSlotClick(5)"></div>
                                    <div class="hc-slot-card" id="hc-slot-6" onclick="handleHauCungSlotClick(6)"></div>
                                    <div class="hc-slot-card" id="hc-slot-7" onclick="handleHauCungSlotClick(7)"></div>
                                </div>
                            </div>

                            <!-- Bottom Banner with Wuxia Text -->
                            <div class="hc-bottom-banner-wrap">
                                <img src="/assets/ui/dantran_authentic/haucung_bottom_banner.png" class="hc-bottom-banner-img" alt="Hậu Cung Banner"/>
                            </div>

                            <!-- Bottom Roller -->
                            <img src="/assets/ui/dantran_authentic/scroll_bottom_roller.png" class="hc-scroll-roller" alt="Scroll Bottom"/>
                        </div>
                    </div>
                </div>

                <div id="tab-giangho"`;

if (oldFormationRegex.test(html)) {
    html = html.replace(oldFormationRegex, replacementFormation);
    console.log('1. Updated tab-formation in public/index.html');
} else {
    console.warn('1. Warning: oldFormationRegex did not match');
}

// Bump version v=18 -> v=19
html = html.replace(/style\.css\?v=\d+/g, 'style.css?v=19');
html = html.replace(/game\.js\?v=\d+/g, 'game.js?v=19');
fs.writeFileSync(indexPath, html, 'utf8');
console.log('1. Bumped cache versions to v=19 in index.html');


// 2. UPDATE public/css/style.css
const cssPath = path.join(rootDir, 'public', 'css', 'style.css');
let css = fs.readFileSync(cssPath, 'utf8');

const haucungCss = `
/* ================= 100% AUTHENTIC HẬU CUNG & DÀN TRẬN SUB-MODE ICONS ================= */
.dt-top-submode-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 6px 6px 4px 6px;
    z-index: 5;
    margin-bottom: 2px;
}

.dt-submode-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    outline: none;
    transition: transform 0.15s ease, filter 0.15s ease;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.dt-submode-btn:hover {
    transform: scale(1.06);
}

.dt-submode-btn.active {
    box-shadow: 0 0 10px #ffd700, 0 0 4px #ff9800;
    border-radius: 14px;
}

.dt-submode-icon {
    width: 48px;
    height: 48px;
    object-fit: contain;
    display: block;
    border-radius: 12px;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
}

.dt-plaque-wrapper {
    margin-left: auto;
    cursor: pointer;
    transition: transform 0.15s ease;
}

.dt-plaque-wrapper:hover {
    transform: scale(1.06);
}

.dt-plaque-img {
    height: 46px;
    width: auto;
    object-fit: contain;
    display: block;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
}

.dt-view-container {
    width: 100%;
    display: flex;
    flex-direction: column;
}

/* HẬU CUNG SCREEN (media_1793066451321_a85b6675.jpg) */
.dt-haucung-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    animation: fadeIn 0.2s ease-in-out;
}

.hc-scroll-wrapper {
    width: 100%;
    max-width: 485px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
}

.hc-scroll-roller {
    width: 100%;
    height: auto;
    display: block;
    object-fit: contain;
    z-index: 3;
}

.hc-chamber-board {
    width: 100%;
    position: relative;
    overflow: hidden;
    min-height: 430px;
    display: flex;
    justify-content: space-between;
    padding: 12px 16px;
    box-sizing: border-box;
    background: #1e110b;
}

.hc-chamber-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 1;
}

.hc-slots-column {
    display: flex;
    flex-direction: column;
    gap: 12px;
    z-index: 2;
    position: relative;
}

.hc-col-left {
    align-items: flex-start;
}

.hc-col-right {
    align-items: flex-end;
}

.hc-slot-card {
    width: 68px;
    height: 68px;
    border-radius: 10px;
    border: 2.5px solid #ffd84c;
    background: #1a0e08;
    box-shadow: 0 0 6px rgba(255, 215, 0, 0.6), inset 0 0 8px rgba(0, 0, 0, 0.8), 0 3px 6px rgba(0, 0, 0, 0.7);
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    transition: transform 0.12s ease;
}

.hc-slot-card:hover {
    transform: scale(1.06);
    box-shadow: 0 0 12px #ffe066;
}

.hc-slot-card:active {
    transform: scale(0.95);
}

.hc-slot-avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.hc-slot-tier-badge {
    position: absolute;
    bottom: 1px;
    left: 4px;
    font-size: 11px;
    font-weight: 900;
    color: #ffeb3b;
    text-shadow: 1px 1px 2px #000, -1px -1px 2px #000;
    z-index: 3;
}

.hc-bottom-banner-wrap {
    width: 100%;
    margin-top: -2px;
    z-index: 2;
}

.hc-bottom-banner-img {
    width: 100%;
    height: auto;
    display: block;
    object-fit: cover;
}
`;

if (!css.includes('dt-top-submode-row')) {
    css += '\n' + haucungCss;
    fs.writeFileSync(cssPath, css, 'utf8');
    console.log('2. Appended Hậu Cung CSS to public/css/style.css');
} else {
    console.log('2. Hậu Cung CSS already present in style.css');
}


// 3. UPDATE public/js/game.js
const jsPath = path.join(rootDir, 'public', 'js', 'game.js');
let js = fs.readFileSync(jsPath, 'utf8');

const haucungJsFunctions = `
// ================= 100% AUTHENTIC DÀN TRẬN SUB-MODES & HẬU CUNG =================
let currentDantranMode = 'tran1';

const AUTHENTIC_HAUCUNG_BEAUTIES = [
    { code: 'NV_Achau', name: 'A Châu', tier: 11 },
    { code: 'NV_TrieuMan', name: 'Triệu Mẫn', tier: 11 },
    { code: 'NV_ChuChiNhuoc', name: 'Chu Chỉ Nhược', tier: 11 },
    { code: 'NV_HoangDung', name: 'Hoàng Dung', tier: 11 },
    { code: 'NV_TieuLongNu', name: 'Tiểu Long Nữ', tier: 11 },
    { code: 'NV_NhamDoanhDoanh', name: 'Nhậm Doanh Doanh', tier: 11 },
    { code: 'NV_VuongNguYen', name: 'Vương Ngữ Yên', tier: 11 },
    { code: 'NV_LamTrieuAnh', name: 'Lâm Triều Anh', tier: 11 }
];

function switchDantranMode(mode) {
    sound.play('click');
    currentDantranMode = mode;

    document.querySelectorAll('.dt-submode-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById('btn-dt-mode-' + mode);
    if (activeBtn) activeBtn.classList.add('active');

    const viewMain = document.getElementById('dt-view-main');
    const viewHauCung = document.getElementById('dt-view-haucung');

    if (mode === 'haucung') {
        if (viewMain) viewMain.style.display = 'none';
        if (viewHauCung) viewHauCung.style.display = 'flex';
        renderHauCung();
    } else if (mode === 'tran1') {
        if (viewMain) viewMain.style.display = 'flex';
        if (viewHauCung) viewHauCung.style.display = 'none';
        renderFormation();
    } else if (mode === 'tran2') {
        if (viewMain) viewMain.style.display = 'flex';
        if (viewHauCung) viewHauCung.style.display = 'none';
        openFormationOverviewModal();
    } else if (mode === 'long') {
        if (viewMain) viewMain.style.display = 'flex';
        if (viewHauCung) viewHauCung.style.display = 'none';
        openLongChauModal();
    }
}

function renderHauCung() {
    for (let i = 0; i < 8; i++) {
        const slotEl = document.getElementById('hc-slot-' + i);
        if (!slotEl) continue;

        const beauty = AUTHENTIC_HAUCUNG_BEAUTIES[i];
        if (beauty) {
            slotEl.innerHTML = \`
                <img src="/assets/images/\${beauty.code}_ava_to.png" class="hc-slot-avatar" alt="\${beauty.name}" onerror="this.src='/assets/images/NV_TieuLongNu_ava_to.png'"/>
                <span class="hc-slot-tier-badge">\${beauty.tier}</span>
            \`;
            slotEl.title = \`\${beauty.name} (Hậu Cung Vị Trí #\${i + 1}) - Cấp Hoàng Kim +11\`;
        } else {
            slotEl.innerHTML = '<img src="/assets/ui/dantran_authentic/haucung_empty_slot.png" class="hc-slot-avatar" alt="Trống"/>';
            slotEl.title = 'Vị trí Hậu Cung còn trống';
        }
    }
}

function handleHauCungSlotClick(slotIdx) {
    sound.play('click');
    const beauty = AUTHENTIC_HAUCUNG_BEAUTIES[slotIdx];
    if (beauty) {
        alert(\`🌸 [HẬU CUNG MỸ NHÂN] 🌸\\nNàng: \${beauty.name}\\nCảnh giới: Hoàng Kim +\${beauty.tier}\\n\\nHiệu quả: "Các đệ tử trong Hậu cung sẽ được tăng 1 cấp võ công thiên phú khi các nàng đều đạt cấp Hoàng kim"\\nHiện tại: Toàn bộ đội hình được tăng +1 Cấp Võ Công Thiên Phú!\`);
    } else {
        alert('Vị trí Hậu Cung còn trống, có thể chiêu mộ thêm mỹ nhân vào cung!');
    }
}
`;

if (!js.includes('switchDantranMode')) {
    js += '\n' + haucungJsFunctions;
    fs.writeFileSync(jsPath, js, 'utf8');
    console.log('3. Appended Hậu Cung JS functions to public/js/game.js');
} else {
    console.log('3. Hậu Cung JS already present in game.js');
}

console.log('All Dàn Trận & Hậu Cung files updated successfully!');
