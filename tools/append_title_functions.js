const fs = require('fs');
const path = require('path');

const jsPath = path.join(__dirname, '..', 'public', 'js', 'game.js');
let js = fs.readFileSync(jsPath, 'utf8');

const titleJsFunctions = `
// ================= 100% AUTHENTIC TITLE SCREEN & BẮT ĐẦU SYSTEM (media_1793066664538_b0d165c2.jpg) =================
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

if (!js.includes('function showTitleStartScreen')) {
    js += '\n' + titleJsFunctions;
    fs.writeFileSync(jsPath, js, 'utf8');
    console.log('Appended title functions to public/js/game.js');
} else {
    console.log('Already present');
}
