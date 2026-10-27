const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

// 1. UPDATE public/index.html
const indexPath = path.join(rootDir, 'public', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const oldRecruitRegex = /<!-- Tab 5: Kỳ Ngộ[\s\S]*?<div id="tab-recruit"[\s\S]*?<\/div>\s*<\/div>\s*<!-- Tab 6: Chợ/;

const newRecruitHtml = `<!-- Tab 5: 100% Authentic Kỳ Ngộ & Thể Lực (Ăn Gà) Matching Original Game Screenshot media_1793066635941_fb2af011.jpg -->
                <div id="tab-recruit" class="tab-view kyngo-authentic-view" style="display: none;">
                    <!-- Top Sub-feature Icons Track -->
                    <div class="kyngo-top-icons-row">
                        <button class="kyngo-icon-btn active" id="btn-kyngo-theluc" onclick="switchKyngoSubTab('theluc')" title="Thể Lực - Ăn Gà Giờ Vàng">
                            <img src="/assets/ui/kyngo_authentic/icon_theluc.png" class="kyngo-feature-icon" alt="Thể Lực"/>
                        </button>
                        <button class="kyngo-icon-btn" id="btn-kyngo-bequan" onclick="switchKyngoSubTab('bequan')" title="Bế Quan Tu Luyện">
                            <img src="/assets/ui/kyngo_authentic/icon_bequan.png" class="kyngo-feature-icon" alt="Bế Quan"/>
                        </button>
                        <button class="kyngo-icon-btn" id="btn-kyngo-thambai" onclick="switchKyngoSubTab('thambai')" title="Tham Bái Thần Tiên Tỷ Tỷ">
                            <img src="/assets/ui/kyngo_authentic/icon_thambai.png" class="kyngo-feature-icon" alt="Tham Bái"/>
                        </button>
                        <button class="kyngo-icon-btn" id="btn-kyngo-tieubao" onclick="switchKyngoSubTab('tieubao')" title="Vi Tiểu Bảo">
                            <img src="/assets/ui/kyngo_authentic/icon_tieubao.png" class="kyngo-feature-icon" alt="Tiểu Bảo"/>
                        </button>
                        <button class="kyngo-icon-btn" id="btn-kyngo-thuongnhan" onclick="switchKyngoSubTab('thuongnhan')" title="Thương Nhân Thần Bí">
                            <img src="/assets/ui/kyngo_authentic/icon_thuongnhan.png" class="kyngo-feature-icon" alt="Thương"/>
                        </button>
                    </div>

                    <!-- Main Scenic Stage: Thể Lực (Ăn Gà Giờ Vàng) -->
                    <div id="kyngo-view-theluc" class="kyngo-stage-scene">
                        <img src="/assets/ui/kyngo_authentic/scene_an_ga_full.png" class="kyngo-scene-bg" alt="Ăn Gà Giờ Vàng"/>
                        
                        <!-- Interactive Roast Chicken Hotspot on the Stone Table -->
                        <div class="kyngo-roast-chicken-hotspot" onclick="doEatChicken()" title="Chạm để Ăn Gà hồi Thể Lực!">
                            <div class="kyngo-chicken-pulse"></div>
                            <img src="/assets/images/VP_GaQuay_to.png" class="kyngo-chicken-plate-img" alt="Gà Quay"/>
                            <span class="kyngo-tap-eat-hint">🍗 Chạm Ăn Gà</span>
                        </div>
                    </div>
                </div>

                <!-- Tab 6: Chợ`;

if (oldRecruitRegex.test(html)) {
    html = html.replace(oldRecruitRegex, newRecruitHtml);
    console.log('1. Replaced tab-recruit in public/index.html');
} else {
    console.warn('1. Warning: oldRecruitRegex did not match');
}

// Bump version v=20 -> v=21
html = html.replace(/style\.css\?v=\d+/g, 'style.css?v=21');
html = html.replace(/game\.js\?v=\d+/g, 'game.js?v=21');
fs.writeFileSync(indexPath, html, 'utf8');
console.log('1. Bumped cache versions to v=21 in index.html');


// 2. UPDATE public/css/style.css
const cssPath = path.join(rootDir, 'public', 'css', 'style.css');
let css = fs.readFileSync(cssPath, 'utf8');

const kyngoCss = `
/* ================= 100% AUTHENTIC KỲ NGỘ & THỂ LỰC (ĂN GÀ) GUI ================= */
.kyngo-authentic-view {
    padding: 0 !important;
    background: #1a0f08 url('/assets/ui/Background.png') no-repeat center top !important;
    background-size: cover !important;
    min-height: calc(100vh - 75px);
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
}

.kyngo-top-icons-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 10px 4px 10px;
    background: rgba(28, 14, 8, 0.75);
    border-bottom: 2px solid #5a3820;
    overflow-x: auto;
    white-space: nowrap;
    z-index: 5;
    flex-shrink: 0;
}

.kyngo-top-icons-row::-webkit-scrollbar {
    display: none;
}

.kyngo-icon-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    outline: none;
    flex-shrink: 0;
    transition: transform 0.15s ease, filter 0.15s ease;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.kyngo-icon-btn:hover {
    transform: scale(1.06);
}

.kyngo-icon-btn.active {
    box-shadow: 0 0 10px #ffd700, 0 0 4px #ff9800;
    border-radius: 12px;
}

.kyngo-feature-icon {
    width: 68px;
    height: 74px;
    object-fit: contain;
    display: block;
    border-radius: 10px;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
}

.kyngo-stage-scene {
    position: relative;
    width: 100%;
    max-width: 498px;
    margin: 0 auto;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
    flex: 1;
}

.kyngo-scene-bg {
    width: 100%;
    height: auto;
    display: block;
    object-fit: cover;
}

.kyngo-roast-chicken-hotspot {
    position: absolute;
    left: 45%;
    top: 67%;
    transform: translate(-50%, -50%);
    width: 110px;
    height: 90px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
    transition: transform 0.15s ease;
}

.kyngo-roast-chicken-hotspot:hover {
    transform: translate(-50%, -50%) scale(1.1);
}

.kyngo-roast-chicken-hotspot:active {
    transform: translate(-50%, -50%) scale(0.95);
}

.kyngo-chicken-pulse {
    position: absolute;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255, 215, 0, 0.5) 0%, rgba(255, 140, 0, 0) 70%);
    animation: chickenPulse 1.8s infinite ease-in-out;
    z-index: 1;
}

@keyframes chickenPulse {
    0% { transform: scale(0.85); opacity: 0.6; }
    50% { transform: scale(1.2); opacity: 0.9; }
    100% { transform: scale(0.85); opacity: 0.6; }
}

.kyngo-chicken-plate-img {
    width: 60px;
    height: 60px;
    object-fit: contain;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.85));
    z-index: 2;
}

.kyngo-tap-eat-hint {
    background: rgba(136, 19, 55, 0.9);
    color: #fff;
    font-size: 11px;
    font-weight: 900;
    padding: 2px 8px;
    border-radius: 10px;
    border: 1px solid #f43f5e;
    margin-top: 2px;
    text-shadow: 1px 1px 2px #000;
    z-index: 2;
    white-space: nowrap;
    animation: bounce 1.5s infinite;
}
`;

if (!css.includes('kyngo-stage-scene')) {
    css += '\n' + kyngoCss;
    fs.writeFileSync(cssPath, css, 'utf8');
    console.log('2. Appended Kỳ Ngộ CSS to public/css/style.css');
} else {
    console.log('2. Kỳ Ngộ CSS already present in style.css');
}


// 3. UPDATE public/js/game.js
const jsPath = path.join(rootDir, 'public', 'js', 'game.js');
let js = fs.readFileSync(jsPath, 'utf8');

const kyngoJsFunctions = `
// ================= 100% AUTHENTIC KỲ NGỘ SUB-TABS =================
let currentKyngoSubTab = 'theluc';

function switchKyngoSubTab(tab) {
    sound.play('click');
    currentKyngoSubTab = tab;

    document.querySelectorAll('.kyngo-icon-btn').forEach(btn => btn.classList.remove('active'));
    const btn = document.getElementById('btn-kyngo-' + tab);
    if (btn) btn.classList.add('active');

    const sceneEl = document.getElementById('kyngo-view-theluc');
    if (tab === 'theluc') {
        if (sceneEl) sceneEl.style.display = 'block';
    } else if (tab === 'bequan') {
        openBeQuanModal();
    } else if (tab === 'thambai') {
        alert('🌸 [THAM BÁI THẦN TIÊN TỶ TỶ] 🌸\\nChưởng môn thành tâm tham bái tượng ngọc Vô Lượng Sơn, nhận được sự gia hộ từ Thần Tiên Tỷ Tỷ: +100 KNB, +50.000 Ngân Lượng!');
        if (GameState.playerData && GameState.playerData.Account) {
            GameState.playerData.Account.Vang = (GameState.playerData.Account.Vang || 0) + 100;
            GameState.playerData.Account.Bac = (GameState.playerData.Account.Bac || 0) + 50000;
            updateHeader();
        }
    } else if (tab === 'tieubao') {
        alert('🎲 [VI TIỂU BẢO ĐỔ SẮC] 🎲\\nVi Tiểu Bảo: "Đại ca! Đến Lệ Xuân Viện lắc vài ván xúc xắc kiếm bạc cùng tiểu đệ nào!"');
    } else if (tab === 'thuongnhan') {
        switchTab('market');
    }
}
`;

if (!js.includes('switchKyngoSubTab')) {
    js += '\n' + kyngoJsFunctions;
    fs.writeFileSync(jsPath, js, 'utf8');
    console.log('3. Appended Kỳ Ngộ JS functions to public/js/game.js');
} else {
    console.log('3. Kỳ Ngộ JS already present in game.js');
}

console.log('All Kỳ Ngộ files updated successfully!');
