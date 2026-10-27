const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

// 1. UPDATE src/routes/webApi.js
const webApiPath = path.join(rootDir, 'src', 'routes', 'webApi.js');
let webApiCode = fs.readFileSync(webApiPath, 'utf8');

const oldGetLuankiemRegex = /getLuankiem\(body\) \{[\s\S]*?challengeLuankiem\(body\) \{/;
const newGetLuankiemCode = `getLuankiem(body) {
        const aid = Number(body.aid) || (db.users && db.users[0] ? db.users[0].aid : 1);
        const playerData = db.getPlayerData(aid);
        if (!playerData) return { success: false, error: 'User not found' };

        // Authentic rankings from original screenshots (media_1793066389467_415a4942.jpg & media_1793066392887_120cba87.jpg)
        const topRankings = [
            {
                rank: 1,
                name: '$ CÔ CHỦ NHỎ $',
                server: 'S19.',
                level: 371,
                point: 94185286,
                rewardBonus: 50,
                disciples: ['NV_TieuLongNu', 'NV_DuongQua', 'NV_LenhHoXung'],
                bt: [1, 1, 5],
                hasStar: false
            },
            {
                rank: 2,
                name: 'Chelsea.VN',
                server: 'S19.',
                level: 383,
                point: 88720100,
                rewardBonus: 48,
                disciples: ['NV_LenhHoXung', 'NV_DongPhuongBatBai', 'NV_TruongTamPhong'],
                bt: [1, 2, 1],
                hasStar: true
            },
            {
                rank: 3,
                name: '25/6/2020 ĐIE',
                server: 'S160.',
                level: 274,
                point: 75200300,
                rewardBonus: 46,
                disciples: ['NV_DoanDu', 'NV_HoangDung', 'NV_LenhHoXung'],
                bt: [3, 2, 4],
                hasStar: true
            },
            {
                rank: 4,
                name: 'Bingo Bingo',
                server: 'S17.',
                level: 458,
                point: 69150000,
                rewardBonus: 44,
                disciples: ['NV_TieuPhong', 'NV_HuTruc', 'NV_QuachTinh'],
                bt: [2, 3, 5],
                hasStar: true
            },
            {
                rank: 5,
                name: 'TÂYSỞBÁVƯƠNG',
                server: 'S1.',
                level: 364,
                point: 61400200,
                rewardBonus: 42,
                disciples: ['NV_DongPhuongBatBai', 'NV_DocCoCauBai', 'NV_LenhHoXung'],
                bt: [1, 2, 3],
                hasStar: true
            },
            {
                rank: 6,
                name: 'SÁT THẦN DIỆT PHẬT',
                server: 'S19.',
                level: 451,
                point: 55900000,
                rewardBonus: 40,
                disciples: ['NV_DuongQua', 'NV_TieuPhong', 'NV_HoangDung'],
                bt: [2, 4, 3],
                hasStar: true
            },
            {
                rank: 7,
                name: 'GẤU ĐẠI VƯƠNG',
                server: 'S178.',
                level: 357,
                point: 48300000,
                rewardBonus: 38,
                disciples: ['NV_QuachTinh', 'NV_HoangDung', 'NV_HongThatCong'],
                bt: [3, 3, 4],
                hasStar: true
            }
        ];

        let userRank = playerData.Account.LuankiemRank || 3222;
        let userPoints = playerData.Account.LuankiemPoints || 11730;

        return {
            success: true,
            userRank,
            userPoints,
            remainingFights: playerData.GiaTriThoiGian.LuotTD || 10,
            rankings: topRankings,
            playerData
        };
    }

    claimLuankiemReward(body) {
        const aid = Number(body.aid) || (db.users && db.users[0] ? db.users[0].aid : 1);
        const playerData = db.getPlayerData(aid);
        if (!playerData) return { success: false, error: 'User not found' };

        const rewardPts = 50;
        const rewardBac = 50000;
        playerData.Account.LuankiemPoints = (playerData.Account.LuankiemPoints || 0) + rewardPts;
        playerData.Account.Bac = (playerData.Account.Bac || 0) + rewardBac;
        db.savePlayerData(aid, playerData);

        return {
            success: true,
            message: \`Cập nhật thứ hạng thành công! Nhận thưởng giữ hạng: +\${rewardPts} Điểm Luận Kiếm, +\${rewardBac.toLocaleString()} Ngân Lượng!\`,
            playerData
        };
    }

    challengeLuankiem(body) {`;

if (oldGetLuankiemRegex.test(webApiCode)) {
    webApiCode = webApiCode.replace(oldGetLuankiemRegex, newGetLuankiemCode);
    fs.writeFileSync(webApiPath, webApiCode, 'utf8');
    console.log('1. Updated getLuankiem and added claimLuankiemReward in src/routes/webApi.js');
} else {
    console.warn('1. Warning: oldGetLuankiemRegex did not match');
}


// 2. UPDATE src/app.js
const appPath = path.join(rootDir, 'src', 'app.js');
let appCode = fs.readFileSync(appPath, 'utf8');
if (!appCode.includes("case 'claim_luankiem_reward':")) {
    appCode = appCode.replace(
        "case 'challenge_luankiem':",
        "case 'claim_luankiem_reward':\n                    result = webApi.claimLuankiemReward(body);\n                    break;\n                case 'challenge_luankiem':"
    );
    fs.writeFileSync(appPath, appCode, 'utf8');
    console.log('2. Registered claim_luankiem_reward in src/app.js');
}


// 3. UPDATE public/index.html
const indexPath = path.join(rootDir, 'public', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const oldTabLuankiemRegex = /<!-- Tab 7:[\s\S]*?<div id="tab-luankiem"[\s\S]*?<\/div>\s*<\/div>\s*<!-- Tab 8:/;
const newTabLuankiemHtml = `<!-- Tab 7: 100% Authentic Luận Kiếm GUI Matching Original Game Screenshots -->
                <div id="tab-luankiem" class="tab-view luankiem-authentic-view" style="display: none;">
                    <!-- Top 2 Switcher Tabs -->
                    <div class="lk-tab-switcher">
                        <button id="btn-subtab-luankiem" class="lk-tab-btn active" onclick="switchLuankiemSubTab('luankiem')">
                            <span class="lk-tab-text">Luận Kiếm</span>
                        </button>
                        <button id="btn-subtab-xephang" class="lk-tab-btn" onclick="switchLuankiemSubTab('xephang')">
                            <span class="lk-tab-text">Xếp hạng</span>
                        </button>
                    </div>

                    <!-- Subheader Description & Current Rank -->
                    <div class="lk-info-banner">
                        <div class="lk-quote-line">Đánh bại tất cả đối thủ để bổn môn lập luận kiếm thượng đỉnh</div>
                        <div class="lk-rank-status-row">
                            <div class="lk-rank-label-wrap">
                                Thứ hạng hiện tại : <span id="lk-user-rank" class="lk-rank-val">3222</span>
                            </div>
                            <img src="/assets/ui/luankiem_authentic/badge_vip_v.png" class="lk-vip-v-badge" alt="VIP V"/>
                        </div>
                    </div>

                    <!-- Ranking & Opponents List -->
                    <div id="luankiem-ranking-list" class="lk-cards-container"></div>
                </div>

                <!-- Tab 8:`;

if (oldTabLuankiemRegex.test(html)) {
    html = html.replace(oldTabLuankiemRegex, newTabLuankiemHtml);
    console.log('3. Replaced tab-luankiem in public/index.html');
} else {
    console.warn('3. Warning: oldTabLuankiemRegex did not match');
}

// Bump version v=17 -> v=18
html = html.replace(/style\.css\?v=\d+/g, 'style.css?v=18');
html = html.replace(/game\.js\?v=\d+/g, 'game.js?v=18');
fs.writeFileSync(indexPath, html, 'utf8');
console.log('3. Bumped cache versions to v=18 in index.html');


// 4. UPDATE public/css/style.css
const cssPath = path.join(rootDir, 'public', 'css', 'style.css');
let css = fs.readFileSync(cssPath, 'utf8');

const luankiemCss = `
/* ================= 100% AUTHENTIC LUẬN KIẾM (ARENA & RANKING) GUI ================= */
.luankiem-authentic-view {
    padding: 0 4px 76px 4px !important;
    background: #af8d74 url('/assets/ui/Background.png') no-repeat center top !important;
    background-size: cover !important;
    min-height: calc(100vh - 75px);
    display: flex;
    flex-direction: column;
}

.lk-tab-switcher {
    display: flex;
    gap: 6px;
    padding: 4px 4px 2px 4px;
    margin-bottom: 2px;
}

.lk-tab-btn {
    flex: 1;
    height: 48px;
    border: none;
    cursor: pointer;
    outline: none;
    border-radius: 8px;
    transition: transform 0.1s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background: url('/assets/ui/luankiem_authentic/tab_wood_clean.png') no-repeat center center;
    background-size: 100% 100%;
}

.lk-tab-btn.active {
    background: url('/assets/ui/luankiem_authentic/tab_stone_clean.png') no-repeat center center;
    background-size: 100% 100%;
}

#btn-subtab-luankiem.active {
    background-image: url('/assets/ui/luankiem_authentic/tab_luankiem_active.png') !important;
}

#btn-subtab-luankiem.active .lk-tab-text {
    display: none;
}

#btn-subtab-xephang:not(.active) {
    background-image: url('/assets/ui/luankiem_authentic/tab_xephang_inactive.png') !important;
}

#btn-subtab-xephang:not(.active) .lk-tab-text {
    display: none;
}

.lk-tab-text {
    font-size: 17px;
    font-weight: 900;
    font-family: 'Times New Roman', cursive, serif;
    color: #381e10;
    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.4);
}

.lk-tab-btn:not(.active) .lk-tab-text {
    color: #edd1a9;
    text-shadow: 1px 1px 2px #000;
}

.lk-tab-btn:active {
    transform: scale(0.96);
}

.lk-info-banner {
    padding: 4px 10px 6px 10px;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.lk-quote-line {
    color: #5c3c26;
    font-size: 13.5px;
    font-weight: bold;
    font-family: 'Times New Roman', serif;
    text-align: left;
    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.25);
}

.lk-rank-status-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 1px;
}

.lk-rank-label-wrap {
    color: #fffaed;
    font-size: 15px;
    font-weight: bold;
    text-shadow: 1px 1px 2px #000;
    font-family: 'Times New Roman', serif;
}

.lk-rank-val {
    color: #fffaed;
    font-weight: 900;
    font-size: 16px;
    margin-left: 2px;
}

.lk-vip-v-badge {
    width: 24px;
    height: 30px;
    object-fit: contain;
    filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.5));
}

.lk-cards-container {
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 100%;
    overflow-y: auto;
    max-height: calc(100vh - 195px);
    padding: 0 2px 10px 2px;
}

/* Opponent Bamboo Card */
.lk-opponent-card {
    width: 100%;
    min-height: 136px;
    background: url('/assets/ui/luankiem_authentic/card_plaque_clean.png') no-repeat center center;
    background-size: 100% 100%;
    padding: 5px 12px 8px 12px;
    display: flex;
    flex-direction: column;
    position: relative;
    box-sizing: border-box;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.45));
}

.lk-card-top-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 30px;
    padding: 0 4px;
}

.lk-player-name {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #ffffff;
    font-weight: bold;
    font-size: 13.5px;
    text-shadow: 1px 1px 2px #000;
    font-family: 'Times New Roman', serif;
}

.lk-server-prefix {
    color: #4ade80;
    font-weight: bold;
    font-size: 13.5px;
}

.lk-player-meta {
    display: flex;
    align-items: center;
    gap: 5px;
}

.lk-player-level {
    color: #f7d488;
    font-style: italic;
    font-weight: 900;
    font-size: 14.5px;
    text-shadow: 1px 1px 2px #000;
    font-family: 'Times New Roman', serif;
}

.lk-badge-icon {
    width: 18px;
    height: 22px;
    object-fit: contain;
}

.lk-card-body-row {
    display: flex;
    align-items: center;
    padding: 2px 2px 4px 2px;
    gap: 8px;
}

.lk-rank-col {
    width: 48px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.lk-rank-calligraphy {
    font-size: 28px;
    font-weight: 900;
    font-style: italic;
    color: #fffaed;
    text-shadow: 2px 2px 3px #000, 0 0 4px rgba(0, 0, 0, 0.8);
    line-height: 1;
    font-family: 'Brush Script MT', 'Times New Roman', cursive, serif;
}

.lk-pts-reward {
    font-size: 12.5px;
    font-weight: 900;
    color: #2b1708;
    margin-top: 3px;
    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.4);
}

.lk-disciples-col {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 6px;
    justify-content: flex-start;
}

.lk-disciple-item {
    position: relative;
    width: 66px;
    height: 66px;
    border-radius: 8px;
    border: 2px solid #ffd84c;
    background: #1a0f08;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.8), 0 2px 4px rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    flex-shrink: 0;
}

.lk-disciple-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.lk-disciple-tier {
    position: absolute;
    bottom: 1px;
    left: 4px;
    font-size: 11px;
    font-weight: 900;
    color: #ffeb3b;
    text-shadow: 1px 1px 2px #000, -1px -1px 2px #000;
    z-index: 2;
}

.lk-action-col {
    margin-left: auto;
    flex-shrink: 0;
}

.lk-btn-doihinh {
    width: 74px;
    height: 50px;
    background: url('/assets/ui/luankiem_authentic/btn_doihinh.png') no-repeat center center;
    background-size: 100% 100%;
    border: none;
    cursor: pointer;
    outline: none;
    border-radius: 6px;
    transition: transform 0.1s ease, filter 0.1s ease;
    display: block;
}

.lk-btn-doihinh:active {
    transform: scale(0.93);
    filter: brightness(0.85);
}

/* Special Self Card (Rank 1 / Self holding rank) */
.lk-self-card {
    width: 100%;
    min-height: 136px;
    background: url('/assets/ui/luankiem_authentic/card_self_clean.png') no-repeat center center;
    background-size: 100% 100%;
    padding: 6px 14px 10px 14px;
    display: flex;
    flex-direction: column;
    position: relative;
    box-sizing: border-box;
    filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.5));
}

.lk-self-card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 30px;
    padding: 0 4px;
}

.lk-self-player-name {
    color: #1a0e07;
    font-weight: 900;
    font-size: 14px;
    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.4);
    font-family: 'Times New Roman', serif;
}

.lk-self-body-row {
    display: flex;
    align-items: center;
    padding: 2px 2px 4px 2px;
    gap: 10px;
}

.lk-self-reward-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 3px;
    padding-left: 6px;
}

.lk-self-reward-title {
    font-size: 16.5px;
    font-weight: 900;
    color: #221208;
    font-family: 'Times New Roman', serif;
}

.lk-self-reward-pts {
    color: #b91c1c;
    font-weight: 900;
}

.lk-self-reward-sub {
    font-size: 11px;
    color: #4a301c;
    line-height: 1.35;
    font-weight: 600;
}

.lk-btn-capnhat {
    width: 78px;
    height: 52px;
    background: url('/assets/ui/luankiem_authentic/btn_capnhat.png') no-repeat center center;
    background-size: 100% 100%;
    border: none;
    cursor: pointer;
    outline: none;
    border-radius: 6px;
    transition: transform 0.1s ease, filter 0.1s ease;
    display: block;
}

.lk-btn-capnhat:active {
    transform: scale(0.93);
    filter: brightness(0.85);
}
`;

if (!css.includes('lk-opponent-card')) {
    css += '\n' + luankiemCss;
    fs.writeFileSync(cssPath, css, 'utf8');
    console.log('4. Appended Luận Kiếm CSS to public/css/style.css');
} else {
    console.log('4. Luận Kiếm CSS already present in style.css');
}


// 5. UPDATE public/js/game.js
const jsPath = path.join(rootDir, 'public', 'js', 'game.js');
let js = fs.readFileSync(jsPath, 'utf8');

const oldRenderLuankiemRegex = /async function renderLuankiem\(\) \{[\s\S]*?async function challengeTargetRank\(targetRank\) \{[\s\S]*?alert\('Lỗi kết nối máy chủ!'\);\s*\}\s*\}/;

const newRenderLuankiemCode = `let currentLuankiemSubTab = 'luankiem';

function switchLuankiemSubTab(tab) {
    sound.play('click');
    currentLuankiemSubTab = tab;
    const btnLk = document.getElementById('btn-subtab-luankiem');
    const btnXh = document.getElementById('btn-subtab-xephang');
    if (btnLk && btnXh) {
        if (tab === 'luankiem') {
            btnLk.classList.add('active');
            btnXh.classList.remove('active');
        } else {
            btnLk.classList.remove('active');
            btnXh.classList.add('active');
        }
    }
    renderLuankiem();
}

async function renderLuankiem() {
    showLoading('Đang tải bảng vàng Luận Kiếm...');
    try {
        const res = await apiPost('get_luankiem', { aid: getEffectiveAid() });
        hideLoading();

        if (!res || !res.success) return;

        const rankEl = document.getElementById('lk-user-rank');
        if (rankEl) rankEl.innerText = res.userRank;

        const container = document.getElementById('luankiem-ranking-list');
        if (!container) return;
        container.innerHTML = '';

        const userRank = Number(res.userRank) || 3222;
        const userPoints = Number(res.userPoints) || 11730;

        // If player holds Rank 1 or is in 'luankiem' tab and Rank 1:
        if (userRank === 1 && currentLuankiemSubTab === 'luankiem') {
            const selfCard = document.createElement('div');
            selfCard.className = 'lk-self-card';
            selfCard.innerHTML = \`
                <div class="lk-self-card-top">
                    <div class="lk-self-player-name">\${GameState.playerData?.Account?.TenNhanVat || 'Đại Tà Vương'}.[M12.133].[K12]</div>
                    <div class="lk-player-meta">
                        <span class="lk-player-level">410</span>
                        <img src="/assets/ui/luankiem_authentic/badge_shield.png" class="lk-badge-icon" alt="Shield"/>
                        <img src="/assets/ui/luankiem_authentic/badge_swirl.png" class="lk-badge-icon" alt="Swirl"/>
                        <img src="/assets/ui/luankiem_authentic/badge_star.png" class="lk-badge-icon" alt="Star"/>
                    </div>
                </div>
                <div class="lk-self-body-row">
                    <div class="lk-rank-col">
                        <span class="lk-rank-calligraphy" style="color: #1a0e07; text-shadow: 0 1px 0 rgba(255,255,255,0.4);">1</span>
                        <span class="lk-pts-reward" style="color: #b91c1c;">+50</span>
                    </div>
                    <div class="lk-self-reward-info">
                        <div class="lk-self-reward-title">Điểm Thưởng: <span class="lk-self-reward-pts">\${userPoints.toLocaleString('vi-VN')}</span></div>
                        <div class="lk-self-reward-sub">Giữ vững thứ hạng này, cứ 10 phút được thưởng 50 điểm</div>
                    </div>
                    <div class="lk-action-col">
                        <button class="lk-btn-capnhat" onclick="claimLuankiemReward()" title="Cập nhật"></button>
                    </div>
                </div>
            \`;
            container.appendChild(selfCard);
        }

        // Render rankings list
        const rankings = res.rankings || [];
        rankings.forEach(item => {
            // If userRank === 1, skip showing rank 1 again in the list
            if (userRank === 1 && item.rank === 1 && currentLuankiemSubTab === 'luankiem') return;

            const card = document.createElement('div');
            card.className = 'lk-opponent-card';

            const disciplesHtml = (item.disciples || ['NV_LenhHoXung', 'NV_DongPhuongBatBai', 'NV_TruongTamPhong']).map((code, idx) => {
                const btNum = (item.bt && item.bt[idx]) || (idx + 1);
                return \`
                    <div class="lk-disciple-item">
                        <img src="/assets/images/\${code}_ava_to.png" class="lk-disciple-img" onerror="this.src='/assets/images/NV_QuachTinh_ava_to.png'"/>
                        <span class="lk-disciple-tier">\${btNum}</span>
                    </div>
                \`;
            }).join('');

            card.innerHTML = \`
                <div class="lk-card-top-row">
                    <div class="lk-player-name">
                        <span class="lk-server-prefix">\${item.server || 'S19.'}</span>\${item.name}
                    </div>
                    <div class="lk-player-meta">
                        <span class="lk-player-level">\${item.level}</span>
                        <img src="/assets/ui/luankiem_authentic/badge_shield.png" class="lk-badge-icon" alt="Shield"/>
                        <img src="/assets/ui/luankiem_authentic/badge_swirl.png" class="lk-badge-icon" alt="Swirl"/>
                        \${item.hasStar ? '<img src="/assets/ui/luankiem_authentic/badge_star.png" class="lk-badge-icon" alt="Star"/>' : ''}
                    </div>
                </div>
                <div class="lk-card-body-row">
                    <div class="lk-rank-col">
                        <span class="lk-rank-calligraphy">\${item.rank}</span>
                        <span class="lk-pts-reward">+\${item.rewardBonus}</span>
                    </div>
                    <div class="lk-disciples-col">
                        \${disciplesHtml}
                    </div>
                    <div class="lk-action-col">
                        <button class="lk-btn-doihinh" onclick="challengeTargetRank(\${item.rank})" title="Đội Hình"></button>
                    </div>
                </div>
            \`;
            container.appendChild(card);
        });
    } catch (e) {
        hideLoading();
        console.error('renderLuankiem error:', e);
    }
}

async function claimLuankiemReward() {
    sound.play('click');
    showLoading('Đang cập nhật thứ hạng...');
    try {
        const res = await apiPost('claim_luankiem_reward', { aid: getEffectiveAid() });
        hideLoading();
        if (res.success) {
            sound.play('trangbi');
            GameState.playerData = res.playerData;
            updateHeader();
            renderLuankiem();
            alert(res.message || 'Cập nhật thứ hạng thành công!');
        } else {
            alert(res.error || 'Cập nhật thất bại!');
        }
    } catch (e) {
        hideLoading();
        alert('Lỗi kết nối máy chủ!');
    }
}

async function challengeTargetRank(targetRank) {
    sound.play('click');
    showLoading('Đang giao đấu võ đài Luận Kiếm...');

    try {
        const res = await apiPost('challenge_luankiem', {
            aid: getEffectiveAid(),
            targetRank
        });

        hideLoading();
        if (res.success) {
            GameState.playerData = res.playerData;
            updateHeader();

            // Trigger instant authentic combat
            triggerTestBattle();
            renderLuankiem();
        } else {
            alert(res.error || 'Khiêu chiến thất bại!');
        }
    } catch (e) {
        hideLoading();
        alert('Lỗi kết nối máy chủ!');
    }
}`;

if (oldRenderLuankiemRegex.test(js)) {
    js = js.replace(oldRenderLuankiemRegex, newRenderLuankiemCode);
    fs.writeFileSync(jsPath, js, 'utf8');
    console.log('5. Updated renderLuankiem and challengeTargetRank in public/js/game.js');
} else {
    console.warn('5. Warning: oldRenderLuankiemRegex did not match');
}

console.log('All Luận Kiếm files updated successfully!');
