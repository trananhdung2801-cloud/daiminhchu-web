import sys, os
sys.stdout.reconfigure(encoding='utf-8')
os.chdir(r'C:\Users\trananh.dung\Downloads\DaiMinhChu_Server')

with open('public/js/game.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Let's locate playBattleAnimation in lines:
start_idx = -1
end_idx = -1
for i, l in enumerate(lines):
    if 'function playBattleAnimation' in l:
        start_idx = i
    if 'function triggerTestBattle' in l:
        end_idx = i
        break

print('playBattleAnimation found at lines:', start_idx, end_idx)

new_battle_js = '''// ================= 100% AUTHENTIC 8V8 BATTLE ENGINE WITH BUFF ACTIVATION (media_1793068311069_68fd0f94.jpg) =================
let battleSpeedMultiplier = 1;
let currentBattleData = null;
let battleTimeoutIds = [];

function toggleBattleSpeed() {
    sound.play('click');
    if (battleSpeedMultiplier === 1) battleSpeedMultiplier = 2;
    else if (battleSpeedMultiplier === 2) battleSpeedMultiplier = 4;
    else battleSpeedMultiplier = 1;

    const spdEl = document.getElementById('battle-speed-val');
    if (spdEl) spdEl.innerText = battleSpeedMultiplier + 'X';
}

function skipBattleToResult() {
    sound.play('click');
    battleTimeoutIds.forEach(id => clearTimeout(id));
    battleTimeoutIds = [];
    if (currentBattleData) {
        showBattleResult(currentBattleData);
    }
}

function playBattleAnimation(battle) {
    currentBattleData = battle;
    battleTimeoutIds.forEach(id => clearTimeout(id));
    battleTimeoutIds = [];

    const overlay = document.getElementById('battle-overlay');
    if (!overlay) return;
    overlay.style.display = 'flex';
    overlay.classList.add('active');

    // 1. Prepare 8 Disciples on Each Side (Matching 8v8 Authentic Layout)
    const defaultPlayerRoster = [
        { name: 'Trương Tam Phong', code: 'NV_TruongTamPhong', hp: 110907576, buff: { name: 'Thái Cực Quyền', type: 'gold', stat: 'Tăng Hộ Thể +25%' } },
        { name: 'Trác Nhất Hàng', code: 'NV_TracNhatHang', hp: 93611136, buff: { name: 'Chân Khí Thái Hư', type: 'green', stat: 'Tăng Công +15%' } },
        { name: 'Đạt Ma Tổ Sư', code: 'NV_DatMa', hp: 94267608, buff: { name: 'Chuyển Di Hồn', type: 'cyan', stat: 'Tăng Uy Lực +30%' } },
        { name: 'Tây Môn Xuy Tuyết', code: 'NV_TayMonXuyTuyet', hp: 126388752, buff: { name: 'Đạp Tuyết Vô Ngân', type: 'cyan', stat: 'Tăng Thân Pháp +20%' } },
        { name: 'Đông Phương Bất Bại', code: 'NV_DongPhuongBatBai', hp: 121949224, buff: { name: 'Hoàng Kim Giáp (Cổ)', type: 'cyan', stat: 'Ngự Giáp Hộ Thân' } },
        { name: 'Lục Tiểu Phụng', code: 'NV_LucTieuPhung', hp: 94095672, buff: { name: 'Thiên Cân Trụy', type: 'cyan', stat: 'Tăng Nội Lực +28%' } },
        { name: 'Hoàng Sam Nữ Tử', code: 'NV_HoangSamNuTu', hp: 89743080, buff: { name: 'Cửu Âm Chân Kinh', type: 'gold', stat: 'Tăng Thủ +35%' } },
        { name: 'A Phi', code: 'NV_APhi', hp: 98800768, buff: { name: 'Đạp Tuyết Vô Ngân', type: 'cyan', stat: 'Tăng Thân Pháp +20%' } }
    ];

    const defaultEnemyRoster = [
        { name: 'Tạ Yến Khai', code: 'NV_TaYenKhai', hp: 2147483647, buff: null },
        { name: 'Tăng Nhu', code: 'NV_TangNhu', hp: 2147483647, buff: null },
        { name: 'Trương Tam Phong', code: 'NV_TruongTamPhong', hp: 2147483647, buff: null },
        { name: 'Thẩm Bích Quân', code: 'NV_ThamBichQuan', hp: 2147483647, buff: { name: 'Nhật Nguyệt Đồng Huy', type: 'pink', stat: 'Tăng Bạo Kích +30%' } },
        { name: 'Đông Phương Bất Bại', code: 'NV_DongPhuongBatBai', hp: 2147483647, buff: null },
        { name: 'Hoa Vô Khuyết', code: 'NV_HoaVoKhuyet', hp: 2147483647, buff: null },
        { name: 'Lục Tiểu Phụng', code: 'NV_LucTieuPhung', hp: 2147483647, buff: null },
        { name: 'A Phi', code: 'NV_APhi', hp: 2147483647, buff: null }
    ];

    // Populate team Player with actual active disciples
    const teamPlayer = [];
    for (let i = 0; i < 8; i++) {
        if (battle.teamPlayer && battle.teamPlayer[i]) {
            const p = battle.teamPlayer[i];
            const fallback = defaultPlayerRoster[i];
            teamPlayer.push({
                id: p.id || (i + 1),
                name: p.displayName || p.name || fallback.name,
                code: p.code || p.name || fallback.code,
                hp: p.hp || p.maxHp || fallback.hp,
                maxHp: p.maxHp || p.hp || fallback.hp,
                buff: fallback.buff
            });
        } else {
            teamPlayer.push(Object.assign({ id: i + 1, maxHp: defaultPlayerRoster[i].hp }, defaultPlayerRoster[i]));
        }
    }

    // Populate team Enemy
    const teamEnemy = [];
    for (let i = 0; i < 8; i++) {
        if (battle.teamEnemy && battle.teamEnemy[i]) {
            const e = battle.teamEnemy[i];
            const fallback = defaultEnemyRoster[i];
            teamEnemy.push({
                id: e.id || (100 + i + 1),
                name: e.displayName || e.name || fallback.name,
                code: e.code || e.name || fallback.code,
                hp: e.hp || e.maxHp || fallback.hp,
                maxHp: e.maxHp || e.hp || fallback.hp,
                buff: fallback.buff
            });
        } else {
            teamEnemy.push(Object.assign({ id: 100 + i + 1, maxHp: defaultEnemyRoster[i].hp }, defaultEnemyRoster[i]));
        }
    }

    // 2. Render 8v8 Duel Rows into DOM
    const stageEl = document.getElementById('battle-8v8-stage');
    if (!stageEl) return;
    stageEl.innerHTML = '';

    for (let i = 0; i < 8; i++) {
        const p = teamPlayer[i];
        const e = teamEnemy[i];

        const row = document.createElement('div');
        row.className = 'battle-duel-row';
        row.id = 'duel-row-' + i;

        row.innerHTML = `
            <!-- Left Hero (Player) -->
            <div class="battle-hero-cell hero-left" id="hero-left-${i}">
                <div class="hero-text-block">
                    <span class="hero-name-label">${p.name}</span>
                    <div class="hero-hp-wrapper">
                        <span class="hero-hp-num" id="hp-left-${i}">${Number(p.hp).toLocaleString('vi-VN')}</span>
                        <img src="/assets/ui/battle_authentic/icon_blood_drop.png" class="hero-blood-icon" alt="HP"/>
                    </div>
                </div>
                <div class="hero-avatar-wrap">
                    <img src="${getAvatarUrl(p.code)}" class="hero-avatar-img" onerror="this.src='/assets/images/NV_QuachTinh_ava_to.png'" alt="${p.name}"/>
                </div>
                <div class="hero-buff-float" id="buff-float-left-${i}">
                    ${p.buff ? `<div class="buff-name-line buff-name-${p.buff.type}">${p.buff.name}</div><div class="buff-stat-line">${p.buff.stat}</div>` : ''}
                </div>
            </div>

            <!-- Right Hero (Enemy) -->
            <div class="battle-hero-cell hero-right" id="hero-right-${i}">
                <div class="hero-avatar-wrap">
                    <img src="${getAvatarUrl(e.code)}" class="hero-avatar-img" onerror="this.src='/assets/images/NC_Generic_NhanSi.png'" alt="${e.name}"/>
                </div>
                <div class="hero-text-block">
                    <span class="hero-name-label">${e.name}</span>
                    <div class="hero-hp-wrapper">
                        <img src="/assets/ui/battle_authentic/icon_blood_drop.png" class="hero-blood-icon" alt="HP"/>
                        <span class="hero-hp-num" id="hp-right-${i}">${Number(e.hp).toLocaleString('vi-VN')}</span>
                    </div>
                </div>
                <div class="hero-buff-float" id="buff-float-right-${i}">
                    ${e.buff ? `<div class="buff-name-line buff-name-${e.buff.type}">${e.buff.name}</div><div class="buff-stat-line">${e.buff.stat}</div>` : ''}
                </div>
            </div>
        `;
        stageEl.appendChild(row);
    }

    // Set Khí Thế Player and Enemy Names
    const playerNameEl = document.getElementById('khithe-name-left');
    const enemyNameEl = document.getElementById('khithe-name-right');
    if (playerNameEl) {
        playerNameEl.innerText = (GameState.playerData && GameState.playerData.Account && GameState.playerData.Account.TenNhanVat) || 'Đại Tà Vương';
    }
    if (enemyNameEl) {
        enemyNameEl.innerText = battle.enemyTitle || 'Miêu Nhân Phụng';
    }

    // 3. PHASE 1: GIAI ĐOẠN KHỞI ĐỘNG KÍCH HOẠT BUFF (Skill, Chân Khí, Ám Khí, Võ Công, Bảo Hạp)
    sound.play('tuyetchieu');
    for (let i = 0; i < 8; i++) {
        // Staggered floating buff displays
        const delay = (150 + i * 80) / battleSpeedMultiplier;
        const tid = setTimeout(() => {
            const bLeft = document.getElementById('buff-float-left-' + i);
            const bRight = document.getElementById('buff-float-right-' + i);
            if (bLeft) bLeft.classList.add('active');
            if (bRight) bRight.classList.add('active');
        }, delay);
        battleTimeoutIds.push(tid);
    }

    // 4. PHASE 2: GIAI ĐOẠN ĐÁNH SKILL TỰ ĐỘNG (Sau khi buff kích hoạt)
    const combatDelay = 1600 / battleSpeedMultiplier;
    const combatTid = setTimeout(() => {
        // Fade out buff banners before combat strikes
        for (let i = 0; i < 8; i++) {
            const bLeft = document.getElementById('buff-float-left-' + i);
            const bRight = document.getElementById('buff-float-right-' + i);
            if (bLeft) bLeft.classList.remove('active');
            if (bRight) bRight.classList.remove('active');
        }

        executeCombatRounds(battle, teamPlayer, teamEnemy);
    }, combatDelay);
    battleTimeoutIds.push(combatTid);
}

function executeCombatRounds(battle, teamPlayer, teamEnemy) {
    const fxStage = document.getElementById('battle-fx-stage');
    let roundIdx = 0;

    function stepRound() {
        if (roundIdx >= 8) {
            // Battle finished, show victory modal
            const endTid = setTimeout(() => {
                showBattleResult(battle);
            }, 600 / battleSpeedMultiplier);
            battleTimeoutIds.push(endTid);
            return;
        }

        const idx = roundIdx;
        roundIdx++;

        const leftCell = document.getElementById('hero-left-' + idx);
        const rightCell = document.getElementById('hero-right-' + idx);
        const p = teamPlayer[idx];
        const e = teamEnemy[idx];

        if (!leftCell || !rightCell) {
            stepRound();
            return;
        }

        // Left Hero attacks Right Hero
        leftCell.classList.add('attacking');
        sound.play('chem');

        const hitTid = setTimeout(() => {
            leftCell.classList.remove('attacking');
            rightCell.classList.add('hit');
            sound.play('da_manh');

            // Floating damage
            const dmg = Math.floor(Math.random() * 25000000) + 15000000;
            e.hp = Math.max(0, e.hp - dmg);
            const hpRightEl = document.getElementById('hp-right-' + idx);
            if (hpRightEl) hpRightEl.innerText = Number(e.hp).toLocaleString('vi-VN');

            // Show floating damage popup
            showFloatingDmg(rightCell, '-' + dmg.toLocaleString('vi-VN'));

            if (e.hp <= 0 || idx >= 4) {
                rightCell.classList.add('defeated');
            }

            const unhitTid = setTimeout(() => {
                rightCell.classList.remove('hit');
                // Proceed to next duel row
                const nextTid = setTimeout(stepRound, 300 / battleSpeedMultiplier);
                battleTimeoutIds.push(nextTid);
            }, 250 / battleSpeedMultiplier);
            battleTimeoutIds.push(unhitTid);
        }, 350 / battleSpeedMultiplier);
        battleTimeoutIds.push(hitTid);
    }

    stepRound();
}

function showFloatingDmg(targetCell, text) {
    const fxStage = document.getElementById('battle-fx-stage');
    if (!fxStage || !targetCell) return;

    const rect = targetCell.getBoundingClientRect();
    const stageRect = fxStage.getBoundingClientRect();

    const el = document.createElement('div');
    el.className = 'battle-floating-dmg';
    el.innerText = text;
    el.style.left = (rect.left - stageRect.left + 20) + 'px';
    el.style.top = (rect.top - stageRect.top + 5) + 'px';

    fxStage.appendChild(el);
    setTimeout(() => el.remove(), 800);
}
'''

if start_idx != -1 and end_idx != -1:
    lines = lines[:start_idx] + [new_battle_js + '\n'] + lines[end_idx:]
    with open('public/js/game.js', 'w', encoding='utf-8') as f:
        f.writelines(lines)
    print('Updated battle engine in public/js/game.js successfully!')
else:
    print('Markers not found in public/js/game.js!')
