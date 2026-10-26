import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/js/game.js', 'r', encoding='utf-8') as f:
    code = f.read()

target = "// Init Game on Load\nwindow.addEventListener('DOMContentLoaded',"

new_functions = '''
// ================= 1. VẬN TIÊU LONG MÔN (img_08, img_22) =================
async function openVanTieuModal() {
    sound.play('click');
    const modal = document.getElementById('vantieu-modal');
    if (!modal) return;
    modal.classList.add('active');

    const aid = getEffectiveAid();
    try {
        const res = await apiPost('vantieu_action', { aid, type: 'get_state' });
        if (res && res.success) {
            renderVanTieuRivals(res.rivals || []);
        }
    } catch (e) {
        console.error(e);
    }
}

function closeVanTieuModal() {
    sound.play('click');
    const modal = document.getElementById('vantieu-modal');
    if (modal) modal.classList.remove('active');
}

function renderVanTieuRivals(rivals) {
    const list = document.getElementById('vantieu-rivals-list');
    if (!list) return;
    list.innerHTML = '';
    rivals.forEach((r, idx) => {
        const item = document.createElement('div');
        item.className = 'vantieu-cart-card';
        item.innerHTML = `
            <div>
                <b style="color: #fed7aa; font-size: 11px;">${r.name} (Lv.${r.level || 50})</b>
                <div style="font-size: 10px; color: #a8a29e;">${r.cartName || 'Tiêu Xa Sắt'} - Cướp được: <span style="color: #fbbf24;">+${(r.rewardBac || 100000).toLocaleString('vi-VN')} Bạc</span>, +${r.rewardDan || 5} Đan</div>
            </div>
            <button class="btn-wuxia-gold" style="width: 80px; height: 30px; font-size: 10px;" onclick="doRobVanTieu(${idx})">Cướp Tiêu</button>
        `;
        list.appendChild(item);
    });
}

async function doStartVanTieu(cartType) {
    sound.play('click');
    const aid = getEffectiveAid();
    try {
        showLoading('Đang hộ tống tiêu xa...');
        const res = await apiPost('vantieu_action', { aid, type: 'start', cartType });
        hideLoading();
        if (res && res.success) {
            sound.play('chien_thang');
            GameState.playerData = res.playerData;
            updateHeader();
            alert(res.message);
        } else {
            sound.play('chet_m');
            alert(res.error || 'Vận tiêu thất bại!');
        }
    } catch (e) {
        hideLoading();
        alert('Lỗi kết nối máy chủ!');
    }
}

async function doRobVanTieu(idx) {
    sound.play('click');
    const aid = getEffectiveAid();
    try {
        showLoading('Đang tỉ thí cướp tiêu...');
        const res = await apiPost('vantieu_action', { aid, type: 'rob', targetIndex: idx });
        hideLoading();
        if (res && res.success) {
            sound.play('chien_thang');
            GameState.playerData = res.playerData;
            updateHeader();
            alert(res.message);
        } else {
            sound.play('chet_m');
            alert(res.error || 'Cướp tiêu thất bại!');
        }
    } catch (e) {
        hideLoading();
        alert('Lỗi kết nối máy chủ!');
    }
}

// ================= 2. BOSS THẾ GIỚI: THẦN ĐIÊU PHỤC MA (img_21, img_27, img_29) =================
async function openBossThanDieuModal() {
    sound.play('click');
    const modal = document.getElementById('boss-thandieu-modal');
    if (!modal) return;
    modal.classList.add('active');

    const aid = getEffectiveAid();
    try {
        const res = await apiPost('boss_thandieu_action', { aid, type: 'get_state' });
        if (res && res.success) {
            updateBossUi(res.boss, res.playerBossState);
        }
    } catch (e) {
        console.error(e);
    }
}

function closeBossThanDieuModal() {
    sound.play('click');
    const modal = document.getElementById('boss-thandieu-modal');
    if (modal) modal.classList.remove('active');
}

function updateBossUi(boss, playerState) {
    if (!boss) return;
    const bar = document.getElementById('boss-hp-bar');
    const hpTxt = document.getElementById('boss-hp-text');
    const dmgTxt = document.getElementById('boss-my-damage');
    const fightsTxt = document.getElementById('boss-my-fights');
    const list = document.getElementById('boss-rankings-list');

    const pct = Math.max(0, Math.min(100, Math.round((boss.currentHp / boss.maxHp) * 100)));
    if (bar) bar.style.width = pct + '%';
    if (hpTxt) hpTxt.innerText = `${boss.currentHp.toLocaleString('vi-VN')} / ${boss.maxHp.toLocaleString('vi-VN')} HP (${pct}%)`;
    if (dmgTxt && playerState) dmgTxt.innerText = (playerState.totalDamage || 0).toLocaleString('vi-VN');
    if (fightsTxt && playerState) fightsTxt.innerText = playerState.fightsToday || 0;

    if (list && boss.rankings) {
        list.innerHTML = '';
        boss.rankings.slice(0, 5).forEach(r => {
            const row = document.createElement('div');
            row.className = 'boss-rank-item';
            row.innerHTML = `
                <span><b style="color: #ffd700;">Hạng ${r.rank}:</b> ${r.name}</span>
                <span style="color: #fca5a5; font-weight: bold;">${(r.damage || 0).toLocaleString('vi-VN')} dame</span>
            `;
            list.appendChild(row);
        });
    }
}

async function doFightBossThanDieu() {
    sound.play('kiem_chem');
    const aid = getEffectiveAid();
    try {
        showLoading('Đội hình đang xuất chiêu công Boss...');
        const res = await apiPost('boss_thandieu_action', { aid, type: 'fight' });
        hideLoading();
        if (res && res.success) {
            sound.play('chien_thang');
            GameState.playerData = res.playerData;
            updateHeader();
            updateBossUi(res.boss, res.playerBossState);
            alert(res.message);
        } else {
            sound.play('chet_m');
            alert(res.error || 'Khiêu chiến thất bại!');
        }
    } catch (e) {
        hideLoading();
        alert('Lỗi kết nối máy chủ!');
    }
}

// ================= 3. THẦN TIÊN TỶ TỶ (img_37) =================
async function openThanTienTyTyModal() {
    sound.play('click');
    const modal = document.getElementById('thantientyty-modal');
    if (!modal) return;
    modal.classList.add('active');
}

function closeThanTienTyTyModal() {
    sound.play('click');
    const modal = document.getElementById('thantientyty-modal');
    if (modal) modal.classList.remove('active');
}

async function doPrayThanTien(type) {
    sound.play('click');
    const aid = getEffectiveAid();
    try {
        showLoading('Đang khấn vái Thần Tiên Tỷ Tỷ...');
        const res = await apiPost('thantientyty_action', { aid, type });
        hideLoading();
        if (res && res.success) {
            sound.play('chien_thang');
            GameState.playerData = res.playerData;
            updateHeader();
            alert(res.message);
        } else {
            sound.play('chet_m');
            alert(res.error || 'Khấn vái thất bại!');
        }
    } catch (e) {
        hideLoading();
        alert('Lỗi kết nối máy chủ!');
    }
}

// ================= 4. TINH LUYỆN TRANG BỊ & ĐÚC THẦN BINH (img_34, img_06) =================
function openTinhLuyenModal() {
    sound.play('click');
    const modal = document.getElementById('tinhluyen-modal');
    if (!modal) return;
    modal.classList.add('active');
    renderTinhLuyenEquips();
}

function closeTinhLuyenModal() {
    sound.play('click');
    const modal = document.getElementById('tinhluyen-modal');
    if (modal) modal.classList.remove('active');
}

function renderTinhLuyenEquips() {
    const list = document.getElementById('tinhluyen-equips-list');
    if (!list) return;
    list.innerHTML = '';

    const equips = (GameState.playerData && GameState.playerData.TrangBi) || [];
    if (equips.length === 0) {
        list.innerHTML = '<div style="color: #a8a29e; font-size: 11px; text-align: center; padding: 15px;">Hành trang chưa có trang bị nào để tinh luyện!</div>';
        return;
    }

    equips.forEach(eq => {
        const star = eq.star || 0;
        const starStr = '⭐'.repeat(star) || 'Chưa có sao';
        const costBac = (star + 1) * 80000;

        const row = document.createElement('div');
        row.className = 'tinhluyen-equip-card';
        row.innerHTML = `
            <div>
                <b style="color: #ffd700; font-size: 12px;">${eq.displayName || eq.name}</b>
                <div style="font-size: 10px; color: #fbbf24;">Cấp tinh luyện: ${starStr} (${star}/10)</div>
                <div style="font-size: 10px; color: #cbd5e1;">Phí: ${costBac.toLocaleString('vi-VN')} Bạc</div>
            </div>
            <button class="btn-wuxia-gold" style="width: 85px; height: 32px; font-size: 10px;" onclick="doTinhLuyenEquip('${eq.userEquipId || eq.name}')">Tinh Luyện</button>
        `;
        list.appendChild(row);
    });
}

async function doTinhLuyenEquip(userEquipId) {
    sound.play('click');
    const aid = getEffectiveAid();
    try {
        showLoading('Đang tôi luyện Thần Binh...');
        const res = await apiPost('tinhluyen_action', { aid, userEquipId });
        hideLoading();
        if (res && res.success) {
            sound.play('chien_thang');
            GameState.playerData = res.playerData;
            updateHeader();
            renderTinhLuyenEquips();
            alert(res.message);
        } else {
            sound.play('chet_m');
            alert(res.error || 'Tinh luyện thất bại!');
        }
    } catch (e) {
        hideLoading();
        alert('Lỗi kết nối máy chủ!');
    }
}

// ================= 5. ĐÀO KHO BÁU (img_04, img_18, img_24) =================
function openKhoBauModal() {
    sound.play('click');
    const modal = document.getElementById('khobau-modal');
    if (!modal) return;
    modal.classList.add('active');

    const kb = (GameState.playerData && GameState.playerData.KhoBau) || { onHuuSonFloor: 1, tuyetTinhCocFloor: 1 };
    const f1 = document.getElementById('khobau-onhuuson-floor');
    const f2 = document.getElementById('khobau-tuyettinhcoc-floor');
    if (f1) f1.innerText = `Tầng ${kb.onHuuSonFloor || 1}`;
    if (f2) f2.innerText = `Tầng ${kb.tuyetTinhCocFloor || 1}`;
}

function closeKhoBauModal() {
    sound.play('click');
    const modal = document.getElementById('khobau-modal');
    if (modal) modal.classList.remove('active');
}

async function doExploreKhoBau(map) {
    sound.play('click');
    const aid = getEffectiveAid();
    try {
        showLoading('Đang đào báu thám hiểm...');
        const res = await apiPost('khobau_action', { aid, map });
        hideLoading();
        if (res && res.success) {
            sound.play('chien_thang');
            GameState.playerData = res.playerData;
            updateHeader();
            openKhoBauModal();
            alert(res.message);
        } else {
            sound.play('chet_m');
            alert(res.error || 'Đào báu thất bại!');
        }
    } catch (e) {
        hideLoading();
        alert('Lỗi kết nối máy chủ!');
    }
}
'''

if target in code:
    code = code.replace(target, new_functions + '\n' + target)
    with open(r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/js/game.js', 'w', encoding='utf-8') as f:
        f.write(code)
    print("Successfully added new features to game.js!")
else:
    print("Could not find target in game.js!")
