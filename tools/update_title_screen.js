const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

// 1. UPDATE public/index.html
const indexPath = path.join(rootDir, 'public', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const oldLoginScreenRegex = /<!-- ================= SCREEN 1: AUTHENTIC LOGIN & REGISTER ================= -->[\s\S]*?<!-- ================= SCREEN 2: AUTHENTIC MAIN GAME LOBBY ================= -->/;

const newLoginScreenHtml = `<!-- ================= SCREEN 1: AUTHENTIC TITLE & LOGIN SCREEN ================= -->
        <div id="screen-login" class="screen active">
            <!-- Panel 1: Authentic Title Screen with "BẮT ĐẦU" (media_1793066664538_b0d165c2.jpg) -->
            <div id="title-start-panel" class="screen-title-container" style="display: none;">
                <div class="title-top-welcome-badge" id="title-welcome-user">Chưởng môn: MinhChu | S1 - Đào Hoa Đảo</div>
                
                <div class="title-batdau-wrapper" onclick="doStartGameFromTitle()" title="Bắt đầu bước vào chốn giang hồ">
                    <img src="/assets/ui/title_authentic/btn_batdau.png" class="title-batdau-img" alt="Bắt đầu"/>
                </div>
                
                <div class="title-version-text">Phiên bản 8.0.2</div>
                
                <button class="title-switch-acc-link" onclick="showAuthFormFromTitle()">[ Đổi tài khoản ]</button>
            </div>

            <!-- Panel 2: Login & Register Form (First Time or When Switching Accounts) -->
            <div id="title-auth-panel" class="login-screen-bg" style="display: none;">
                <div class="login-brand-header anim-pop-in">
                    <img class="login-app-icon" src="/assets/res/app_icon.png" alt="Đại Minh Chủ Icon">
                    <div class="login-brand-meta">
                        <span class="game-version">Phiên Bản 8.0.2</span>
                        <span class="game-server">Máy Chủ: S1 - Đào Hoa Đảo</span>
                    </div>
                </div>

                <img class="login-dragon-logo" src="/assets/ui/login_06.png" alt="Đại Minh Chủ Logo">
                
                <div class="login-card-panel anim-zoom-enter">
                    <!-- Auth Switch Tabs -->
                    <div class="auth-tabs-row">
                        <button id="tab-btn-login" class="auth-tab-btn active" onclick="switchAuthTab('login')">ĐĂNG NHẬP</button>
                        <button id="tab-btn-register" class="auth-tab-btn" onclick="switchAuthTab('register')">ĐĂNG KÝ MỚI</button>
                    </div>

                    <!-- 1. Form Đăng Nhập -->
                    <div id="form-login-wrap" class="auth-form-wrap">
                        <div class="login-input-wrap">
                            <span class="input-icon">👤</span>
                            <input type="text" id="login-username" class="login-input" placeholder="Tên tài khoản..." value="MinhChu" autocomplete="username">
                        </div>
                        <div class="login-input-wrap">
                            <span class="input-icon">🔒</span>
                            <input type="password" id="login-password" class="login-input" placeholder="Mật khẩu..." value="123456" autocomplete="current-password">
                        </div>
                        <button class="btn-login-game" onclick="doLogin()">VÀO GAME NGAY</button>
                    </div>

                    <!-- 2. Form Đăng Ký Tài Khoản Mới -->
                    <div id="form-register-wrap" class="auth-form-wrap" style="display: none;">
                        <div class="login-input-wrap">
                            <span class="input-icon">👤</span>
                            <input type="text" id="reg-username" class="login-input" placeholder="Tên tài khoản mới (>=3 ký tự)..." autocomplete="username">
                        </div>
                        <div class="login-input-wrap">
                            <span class="input-icon">🔒</span>
                            <input type="password" id="reg-password" class="login-input" placeholder="Mật khẩu bảo mật (>=4 ký tự)..." autocomplete="new-password">
                        </div>
                        <div class="reg-starter-picker">
                            <div class="reg-picker-title">Chọn Đại Hiệp Khởi Đầu:</div>
                            <div class="reg-starters-grid">
                                <label class="reg-starter-opt">
                                    <input type="radio" name="reg-starter" value="NV_LenhHoXung" checked>
                                    <span>Lệnh Hồ Xung</span>
                                </label>
                                <label class="reg-starter-opt">
                                    <input type="radio" name="reg-starter" value="NV_QuachTinh">
                                    <span>Quách Tĩnh</span>
                                </label>
                                <label class="reg-starter-opt">
                                    <input type="radio" name="reg-starter" value="NV_DuongQua">
                                    <span>Dương Quá</span>
                                </label>
                                <label class="reg-starter-opt">
                                    <input type="radio" name="reg-starter" value="NV_TruongVoKy">
                                    <span>Trương Vô Kỵ</span>
                                </label>
                            </div>
                        </div>
                        <button class="btn-login-game" onclick="doRegister()">TẠO TÀI KHOẢN VÀ VÀO GAME</button>
                    </div>

                    <div id="auth-error-msg" class="auth-error-msg"></div>
                </div>
            </div>
        </div>

        <!-- ================= SCREEN 2: AUTHENTIC MAIN GAME LOBBY ================= -->`;

if (oldLoginScreenRegex.test(html)) {
    html = html.replace(oldLoginScreenRegex, newLoginScreenHtml);
    console.log('1. Updated screen-login with title-start-panel in public/index.html');
} else {
    console.warn('1. Warning: oldLoginScreenRegex did not match');
}

// Bump cache to v=22
html = html.replace(/style\.css\?v=\d+/g, 'style.css?v=22');
html = html.replace(/game\.js\?v=\d+/g, 'game.js?v=22');
fs.writeFileSync(indexPath, html, 'utf8');
console.log('1. Bumped cache versions to v=22 in index.html');


// 2. UPDATE public/css/style.css
const cssPath = path.join(rootDir, 'public', 'css', 'style.css');
let css = fs.readFileSync(cssPath, 'utf8');

const titleCss = `
/* ================= 100% AUTHENTIC TITLE SCREEN & BẮT ĐẦU (media_1793066664538_b0d165c2.jpg) ================= */
.screen-title-container {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 100vh;
    background: #0d0604 url('/assets/ui/title_authentic/bg_title_screen.png') no-repeat center top;
    background-size: cover;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    padding-bottom: 35px;
    box-sizing: border-box;
    overflow: hidden;
    animation: fadeIn 0.3s ease-in-out;
}

.title-top-welcome-badge {
    position: absolute;
    top: 14px;
    background: rgba(30, 16, 10, 0.88);
    border: 1px solid #c27838;
    border-radius: 14px;
    padding: 5px 16px;
    color: #ffedd5;
    font-size: 12.5px;
    font-weight: bold;
    text-shadow: 1px 1px 2px #000;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.65);
    letter-spacing: 0.5px;
    z-index: 10;
}

.title-batdau-wrapper {
    position: relative;
    width: 86%;
    max-width: 380px;
    cursor: pointer;
    transition: transform 0.15s ease, filter 0.15s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    margin-bottom: 10px;
}

.title-batdau-wrapper:hover {
    transform: scale(1.04);
    filter: brightness(1.1);
}

.title-batdau-wrapper:active {
    transform: scale(0.96);
    filter: brightness(0.9);
}

.title-batdau-img {
    width: 100%;
    height: auto;
    display: block;
    object-fit: contain;
    filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.85));
}

.title-version-text {
    color: #ffffff;
    font-size: 15px;
    font-weight: bold;
    font-family: 'Times New Roman', cursive, serif;
    text-shadow: 1px 1px 3px #000, 0 0 6px rgba(0, 0, 0, 0.85);
    letter-spacing: 0.5px;
    margin-bottom: 6px;
    z-index: 10;
}

.title-switch-acc-link {
    background: none;
    border: none;
    cursor: pointer;
    outline: none;
    color: #f7d488;
    font-size: 12px;
    font-weight: bold;
    text-shadow: 1px 1px 2px #000;
    text-decoration: underline;
    transition: color 0.15s ease;
    z-index: 10;
}

.title-switch-acc-link:hover {
    color: #ffd700;
}
`;

if (!css.includes('screen-title-container')) {
    css += '\n' + titleCss;
    fs.writeFileSync(cssPath, css, 'utf8');
    console.log('2. Appended Title CSS to public/css/style.css');
} else {
    console.log('2. Title CSS already present in style.css');
}


// 3. UPDATE public/js/game.js
const jsPath = path.join(rootDir, 'public', 'js', 'game.js');
let js = fs.readFileSync(jsPath, 'utf8');

// Update DOMContentLoaded auto-resume session
const oldDomLoadedRegex = /window\.addEventListener\('DOMContentLoaded', async \(\) => \{[\s\S]*?console\.log\('Đại Minh Chủ Authentic Web Game Loaded with 100% Features!'\);\s*\}\);/;

const newDomLoadedCode = `window.addEventListener('DOMContentLoaded', async () => {
    await fetchStaticData();
    initWorldChatTicker();

    // Check if player has logged in previously
    const savedAid = localStorage.getItem('dmc_aid');
    const savedUser = localStorage.getItem('dmc_username');

    if (savedAid && savedUser) {
        // Pre-fetch player data in background so clicking "Bắt đầu" is instant!
        try {
            const res = await apiPost('login', { username: savedUser });
            if (res && res.success && res.hasCharacter && res.playerData) {
                GameState.user = res.user;
                GameState.playerData = res.playerData;
            }
        } catch (e) {
            console.warn('Background login fetch skipped:', e);
        }

        // Show the Authentic Title Screen with "Bắt đầu" and "Phiên bản 8.0.2"!
        showTitleStartScreen(savedUser);
    } else {
        // Show login/register form
        showAuthFormFromTitle();
    }
    console.log('Đại Minh Chủ Authentic Web Game Loaded with 100% Features!');
});`;

if (oldDomLoadedRegex.test(js)) {
    js = js.replace(oldDomLoadedRegex, newDomLoadedCode);
    console.log('3. Updated DOMContentLoaded in public/js/game.js');
} else {
    console.warn('3. Warning: oldDomLoadedRegex did not match');
}

// Add title screen helper functions
const titleJsFunctions = `
// ================= 100% AUTHENTIC TITLE SCREEN & BẮT ĐẦU SYSTEM =================
function showTitleStartScreen(username) {
    const titlePanel = document.getElementById('title-start-panel');
    const authPanel = document.getElementById('title-auth-panel');
    const userBadge = document.getElementById('title-welcome-user');

    if (titlePanel) titlePanel.style.display = 'flex';
    if (authPanel) authPanel.style.display = 'none';
    if (userBadge) {
        const charName = GameState.playerData?.Account?.TenNhanVat || username || 'MinhChu';
        userBadge.innerText = \`Chưởng môn: \${charName} | S1 - Đào Hoa Đảo\`;
    }

    switchScreen('screen-login');
}

function showAuthFormFromTitle() {
    const titlePanel = document.getElementById('title-start-panel');
    const authPanel = document.getElementById('title-auth-panel');

    if (titlePanel) titlePanel.style.display = 'none';
    if (authPanel) authPanel.style.display = 'block';

    switchScreen('screen-login');
}

async function doStartGameFromTitle() {
    sound.play('click');
    showLoading('Đang bước vào chốn giang hồ...');

    const savedUser = localStorage.getItem('dmc_username') || 'MinhChu';

    // If playerData already loaded in background, enter instantly
    if (GameState.user && GameState.playerData) {
        hideLoading();
        sound.play('renxong');
        initMainGame();
        return;
    }

    // Otherwise fetch login
    try {
        const res = await apiPost('login', { username: savedUser });
        hideLoading();
        if (res && res.success && res.hasCharacter && res.playerData) {
            sound.play('renxong');
            GameState.user = res.user;
            GameState.playerData = res.playerData;
            initMainGame();
        } else {
            alert('Không thể kết nối vào tài khoản, vui lòng đăng nhập lại!');
            showAuthFormFromTitle();
        }
    } catch (e) {
        hideLoading();
        alert('Lỗi kết nối máy chủ!');
    }
}
`;

if (!js.includes('showTitleStartScreen')) {
    js += '\n' + titleJsFunctions;
    console.log('3. Appended titleJsFunctions to public/js/game.js');
}

// Update doLogout to showAuthFormFromTitle()
js = js.replace(
    /function doLogout\(\) \{[\s\S]*?switchScreen\('screen-login'\);\s*\}/,
    `function doLogout() {
    sound.play('click');
    localStorage.removeItem("dmc_aid");
    localStorage.removeItem("dmc_username");
    GameState.user = null;
    GameState.playerData = null;
    closeSettingsModal();
    showAuthFormFromTitle();
}`
);

fs.writeFileSync(jsPath, js, 'utf8');
console.log('All Title Screen files updated successfully!');
