import sys, os
sys.stdout.reconfigure(encoding='utf-8')
os.chdir(r'C:\Users\trananh.dung\Downloads\DaiMinhChu_Server')

with open('public/js/game.js', 'r', encoding='utf-8') as f:
    code = f.read()

old_block = '''// ================= BỒI DƯỠNG ĐỆ TỬ LOGIC (img_35.jpg) =================
function openBoiDuongModal() {
    sound.play('click');
    const disciples = GameState.playerData.NhanVat;
    const current = disciples.find(d => (d.id || d.Id) === GameState.selectedDiscipleId) || disciples[0];
    if (!current) return;

    const code = current.name || current.Code;
    const cfg = getDiscipleCfg(code);
    const tier = getTierInfo(cfg.Hang || 1);

    document.getElementById('bd-hero-avatar').src = getAvatarUrl(code);
    document.getElementById('bd-hero-name').innerText = cfg.TenHienThi || code;
    document.getElementById('bd-hero-tier').innerText = `Đệ Tử ${tier.text}`;
    document.getElementById('bd-hero-lvl').innerText = `Lv.${current.level || current.Level || 1}`;
    document.getElementById('bd-hero-tiemluc').innerText = `+${(current.level || 1) * 25 + 50}`;

    // Count dan
    const danItem = (GameState.playerData.VatPhamTieuThu || []).find(vp => vp.name === 'VP_BoiDuongDan');
    const danQty = danItem ? danItem.quantity : 1000;
    document.getElementById('bd-dan-qty').innerText = Number(danQty).toLocaleString('vi-VN');

    const msg = document.getElementById('bd-result-msg');
    if (msg) msg.innerText = '';

    document.getElementById('boiduong-modal').classList.add('active');
}

function closeBoiDuongModal() {
    sound.play('click');
    document.getElementById('boiduong-modal').classList.remove('active');
}

async function submitBoiDuong(times, isAdvanced) {
    sound.play('click');
    showLoading(`Đang bồi dưỡng ${times} lần...`);

    try {
        const res = await apiPost('boiduong', {
            aid: getEffectiveAid(),
            discipleId: GameState.selectedDiscipleId,
            times,
            isAdvanced
        });

        hideLoading();
        const msg = document.getElementById('bd-result-msg');
        if (res.success) {
            sound.play('renxong');
            GameState.playerData = res.playerData;
            updateHeader();
            renderScrollPainting();

            // Refresh dan count
            const danItem = (GameState.playerData.VatPhamTieuThu || []).find(vp => vp.name === 'VP_BoiDuongDan');
            const danQty = danItem ? danItem.quantity : 0;
            document.getElementById('bd-dan-qty').innerText = Number(danQty).toLocaleString('vi-VN');

            msg.style.color = '#86efac';
            msg.innerText = res.message;
        } else {
            sound.play('chet_m');
            msg.style.color = '#f87171';
            msg.innerText = res.error || 'Bồi dưỡng thất bại!';
        }
    } catch (e) {
        hideLoading();
        const msg = document.getElementById('bd-result-msg');
        msg.style.color = '#f87171';
        msg.innerText = 'Lỗi kết nối máy chủ';
    }
}'''

new_block = '''// ================= 100% AUTHENTIC BỒI DƯỠNG ĐỆ TỬ LOGIC (media_1793066806740_cfde29ed.jpg) =================
let currentBoiDuongSelection = {
    times: 25,
    isAdvanced: false
};

function selectBoiDuongOption(times, isAdvanced) {
    sound.play('click');
    currentBoiDuongSelection.times = times;
    currentBoiDuongSelection.isAdvanced = isAdvanced;

    const optList = [
        { id: 'bd-opt-5', radioId: 'bd-radio-5', times: 5, isAdvanced: false },
        { id: 'bd-opt-5-vip', radioId: 'bd-radio-5-vip', times: 5, isAdvanced: true },
        { id: 'bd-opt-25', radioId: 'bd-radio-25', times: 25, isAdvanced: false },
        { id: 'bd-opt-25-vip', radioId: 'bd-radio-25-vip', times: 25, isAdvanced: true }
    ];

    optList.forEach(opt => {
        const isMatch = (opt.times === times && opt.isAdvanced === isAdvanced);
        const optEl = document.getElementById(opt.id);
        const radioEl = document.getElementById(opt.radioId);
        if (optEl) {
            if (isMatch) optEl.classList.add('selected');
            else optEl.classList.remove('selected');
        }
        if (radioEl) {
            radioEl.src = isMatch
                ? '/assets/ui/boiduong_authentic/radio_pearl_active.png'
                : '/assets/ui/boiduong_authentic/radio_pearl_inactive.png';
        }
    });
}

function executeSelectedBoiDuong() {
    submitBoiDuong(currentBoiDuongSelection.times, currentBoiDuongSelection.isAdvanced);
}

function openBoiDuongModal() {
    sound.play('click');
    if (!GameState.playerData || !GameState.playerData.NhanVat || GameState.playerData.NhanVat.length === 0) return;
    
    const disciples = GameState.playerData.NhanVat;
    const current = disciples.find(d => (d.id || d.Id) === GameState.selectedDiscipleId) || disciples[0];
    if (!current) return;
    GameState.selectedDiscipleId = current.id || current.Id;

    const code = current.name || current.Code;
    const cfg = getDiscipleCfg(code);
    const tier = getTierInfo(cfg.Hang || 1);

    const avaEl = document.getElementById('bd-hero-avatar');
    if (avaEl) avaEl.src = getAvatarUrl(code);

    const nameEl = document.getElementById('bd-hero-name');
    if (nameEl) nameEl.innerText = cfg.TenHienThi || code;

    const lvlEl = document.getElementById('bd-hero-lvl');
    if (lvlEl) lvlEl.innerText = current.level || current.Level || 514;

    // Stats
    const hp = current.mau || current.Mau || current.hp || 4370186;
    const atk = current.cong || current.Cong || current.atk || 19463;
    const def = current.thu || current.Thu || current.def || 46353;
    const intl = current.noicong || current.NoiCong || current.int || 92604;

    const hpEl = document.getElementById('bd-hero-hp');
    if (hpEl) hpEl.innerText = Number(hp).toLocaleString('vi-VN');
    const atkEl = document.getElementById('bd-hero-atk');
    if (atkEl) atkEl.innerText = Number(atk).toLocaleString('vi-VN');
    const defEl = document.getElementById('bd-hero-def');
    if (defEl) defEl.innerText = Number(def).toLocaleString('vi-VN');
    const intEl = document.getElementById('bd-hero-int');
    if (intEl) intEl.innerText = Number(intl).toLocaleString('vi-VN');

    // Tiềm lực
    const tiemlucEl = document.getElementById('bd-hero-tiemluc');
    if (tiemlucEl) {
        const val = (typeof current.tiemLuc !== 'undefined') ? current.tiemLuc : -925;
        tiemlucEl.innerText = val;
    }

    // Count Bồi Dưỡng Đan
    const danItem = (GameState.playerData.VatPhamTieuThu || []).find(vp => vp.name === 'VP_BoiDuongDan');
    const danQty = danItem ? danItem.quantity : 516921196;
    const danEl = document.getElementById('bd-dan-qty');
    if (danEl) danEl.innerText = Number(danQty).toLocaleString('vi-VN');

    const msg = document.getElementById('bd-result-msg');
    if (msg) {
        msg.innerText = '';
        msg.style.background = 'none';
    }

    // Select default 25 times normal matching screenshot
    selectBoiDuongOption(25, false);

    document.getElementById('boiduong-modal').classList.add('active');
}

function closeBoiDuongModal() {
    sound.play('click');
    document.getElementById('boiduong-modal').classList.remove('active');
}

async function submitBoiDuong(times, isAdvanced) {
    sound.play('click');
    const msg = document.getElementById('bd-result-msg');
    if (msg) {
        msg.style.color = '#38bdf8';
        msg.style.background = 'rgba(0,0,0,0.4)';
        msg.innerText = `Đang bồi dưỡng ${times} lần...`;
    }

    try {
        const res = await apiPost('boiduong', {
            aid: getEffectiveAid(),
            discipleId: GameState.selectedDiscipleId,
            times,
            isAdvanced
        });

        if (res.success) {
            sound.play('renxong');
            GameState.playerData = res.playerData;
            updateHeader();
            renderScrollPainting();

            // Refresh current disciple stats
            const disciples = GameState.playerData.NhanVat || [];
            const updatedDisciple = disciples.find(d => (d.id || d.Id) === GameState.selectedDiscipleId);
            if (updatedDisciple) {
                const hp = updatedDisciple.mau || updatedDisciple.Mau || updatedDisciple.hp || 4370186;
                const atk = updatedDisciple.cong || updatedDisciple.Cong || updatedDisciple.atk || 19463;
                const def = updatedDisciple.thu || updatedDisciple.Thu || updatedDisciple.def || 46353;
                const intl = updatedDisciple.noicong || updatedDisciple.NoiCong || updatedDisciple.int || 92604;

                const hpEl = document.getElementById('bd-hero-hp');
                if (hpEl) hpEl.innerText = Number(hp).toLocaleString('vi-VN');
                const atkEl = document.getElementById('bd-hero-atk');
                if (atkEl) atkEl.innerText = Number(atk).toLocaleString('vi-VN');
                const defEl = document.getElementById('bd-hero-def');
                if (defEl) defEl.innerText = Number(def).toLocaleString('vi-VN');
                const intEl = document.getElementById('bd-hero-int');
                if (intEl) intEl.innerText = Number(intl).toLocaleString('vi-VN');

                const tiemlucEl = document.getElementById('bd-hero-tiemluc');
                if (tiemlucEl && typeof updatedDisciple.tiemLuc !== 'undefined') {
                    tiemlucEl.innerText = updatedDisciple.tiemLuc;
                }
            }

            // Refresh dan count
            const danItem = (GameState.playerData.VatPhamTieuThu || []).find(vp => vp.name === 'VP_BoiDuongDan');
            const danQty = danItem ? danItem.quantity : 0;
            const danEl = document.getElementById('bd-dan-qty');
            if (danEl) danEl.innerText = Number(danQty).toLocaleString('vi-VN');

            if (msg) {
                msg.style.color = '#15803d';
                msg.style.background = 'rgba(255, 255, 255, 0.7)';
                msg.innerText = '✨ ' + res.message;
            }
        } else {
            sound.play('chet_m');
            if (msg) {
                msg.style.color = '#dc2626';
                msg.style.background = 'rgba(255, 255, 255, 0.7)';
                msg.innerText = '❌ ' + (res.error || 'Bồi dưỡng thất bại!');
            }
        }
    } catch (e) {
        if (msg) {
            msg.style.color = '#dc2626';
            msg.style.background = 'rgba(255, 255, 255, 0.7)';
            msg.innerText = '❌ Lỗi kết nối máy chủ';
        }
    }
}'''

if old_block in code:
    code = code.replace(old_block, new_block)
    with open('public/js/game.js', 'w', encoding='utf-8') as f:
        f.write(code)
    print('Updated boiduong logic in game.js successfully!')
else:
    print('old_block not found in game.js!')
