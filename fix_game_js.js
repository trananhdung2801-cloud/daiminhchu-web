const fs = require('fs');
const filePath = 'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/js/game.js';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add getEffectiveAid and improve apiPost
const newApiPost = `function getEffectiveAid() {
    if (GameState.user && GameState.user.aid) return GameState.user.aid;
    const saved = localStorage.getItem('dmc_aid');
    if (saved) {
        const num = Number(saved);
        if (!isNaN(num) && num > 0) return num;
    }
    return 4; // Default MinhChu
}

async function apiPost(endpoint, data = {}) {
    try {
        const res = await fetch('/api/web/' + endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) {
            const errText = await res.text();
            try { return JSON.parse(errText); } catch(e) { return { success: false, error: 'HTTP ' + res.status + ': ' + errText }; }
        }
        return await res.json();
    } catch (err) {
        console.error('API Error on ' + endpoint + ':', err);
        throw err;
    }
}`;

content = content.replace(
    /async function apiPost\(endpoint, data\) \{[\s\S]*?return res\.json\(\);\s*\}/,
    newApiPost
);

// 2. Replace all GameState.user.aid with getEffectiveAid()
content = content.split('GameState.user.aid').join('getEffectiveAid()');

// 3. Update execGmAction
const oldExec = /async function execGmAction\(actionType\) \{[\s\S]*?catch \(e\) \{[\s\S]*?\}\s*\}/;
const newExec = `async function execGmAction(actionType) {
    sound.play('click');
    showLoading('Đang thực thi lệnh GM Admin...');

    try {
        const currentAid = getEffectiveAid();
        const res = await apiPost('admin_action', {
            aid: currentAid,
            actionType
        });

        hideLoading();
        const msgEl = document.getElementById('gm-result-msg');
        if (res && res.success) {
            sound.play('renxong');
            GameState.playerData = res.playerData;
            if (!GameState.user) {
                GameState.user = { aid: currentAid, username: 'MinhChu' };
            }
            localStorage.setItem('dmc_aid', currentAid);

            // Switch to main screen if currently on login
            const loginScreen = document.getElementById('screen-login');
            if (loginScreen && loginScreen.classList.contains('active')) {
                initMainGame();
            } else {
                updateHeader();
                renderCurrentTab();
            }

            msgEl.style.color = '#86efac';
            msgEl.innerText = res.message;
        } else {
            sound.play('chet_m');
            msgEl.style.color = '#f87171';
            msgEl.innerText = (res && res.error) ? res.error : 'Thao tác thất bại!';
        }
    } catch (e) {
        hideLoading();
        console.error('GM Error:', e);
        const msgEl = document.getElementById('gm-result-msg');
        msgEl.style.color = '#f87171';
        msgEl.innerText = 'Lỗi kết nối máy chủ: ' + (e.message || '');
    }
}`;

content = content.replace(oldExec, newExec);

// 4. Update doLogin and DOMContentLoaded
content = content.replace(
    'GameState.user = res.user;',
    'GameState.user = res.user; localStorage.setItem("dmc_aid", res.user.aid); localStorage.setItem("dmc_username", res.user.username);'
);

const oldInit = /window\.addEventListener\('DOMContentLoaded'[\s\S]*?\}\);/;
const newInit = `window.addEventListener('DOMContentLoaded', async () => {
    await fetchStaticData();
    initWorldChatTicker();

    // Auto-resume session if exists
    const savedAid = localStorage.getItem('dmc_aid');
    const savedUser = localStorage.getItem('dmc_username') || 'MinhChu';
    if (savedAid) {
        try {
            const res = await apiPost('login', { username: savedUser });
            if (res && res.success && res.hasCharacter && res.playerData) {
                GameState.user = res.user;
                GameState.playerData = res.playerData;
                initMainGame();
                console.log('Tự động khôi phục phiên đăng nhập của Minh Chủ:', savedUser);
            }
        } catch (e) {
            console.warn('Auto-login skipped:', e);
        }
    }
    console.log('Đại Minh Chủ Authentic Web Game Loaded with 100% Features!');
});`;

content = content.replace(oldInit, newInit);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully fixed game.js!');
