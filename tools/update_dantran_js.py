import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('public/js/game.js', 'r', encoding='utf-8') as f:
    js = f.read()

new_formation_full = '''// 1. Formation Tab (100% AUTHENTIC DÀN TRẬN GUI MATCHING 4 ORIGINAL SCREENSHOTS)
function selectFormationDisciple(dId) {
    sound.play('click');
    GameState.selectedFormationDiscipleId = Number(dId);
    renderFormation();
}

function openFormationOverviewModal() {
    sound.play('click');
    const modal = document.getElementById('dantran-overview-modal');
    if (!modal) return;
    renderFormationOverviewBoard();
    modal.classList.add('active');
}

function closeFormationOverviewModal() {
    sound.play('click');
    const modal = document.getElementById('dantran-overview-modal');
    if (modal) modal.classList.remove('active');
}

function renderFormationOverviewBoard() {
    const container = document.getElementById('formation-container');
    if (!container || !GameState.playerData) return;
    container.innerHTML = '';
    const dh = GameState.playerData.DoiHinh || {};
    const level = (GameState.playerData.Account && GameState.playerData.Account.Level) ? Number(GameState.playerData.Account.Level) : 1;
    const maxSlots = getMaxSlotDoiHinh(level);

    for (let slot = 1; slot <= 8; slot++) {
        const isUnlocked = slot <= maxSlots;
        const discipleId = Number(dh['slot' + slot] || 0);
        const disciple = (isUnlocked && discipleId > 0)
            ? (GameState.playerData.NhanVat || []).find(nv => Number(nv.id || nv.Id) === discipleId)
            : null;

        const slotEl = document.createElement('div');
        slotEl.className = `formation-slot-item ${disciple ? 'occupied' : ''} ${!isUnlocked ? 'locked' : ''}`;

        if (isUnlocked && disciple) {
            const code = disciple.name || disciple.Code;
            const cfg = getDiscipleCfg(code);
            const tier = getTierInfo(cfg.Hang || 1);
            slotEl.style.backgroundImage = `url('${UI_BASE}${tier.bg}')`;
            slotEl.onclick = () => { closeFormationOverviewModal(); selectFormationDisciple(disciple.id || disciple.Id); };
            slotEl.title = `Vị trí #${slot}: ${cfg.TenHienThi || code}`;
            slotEl.innerHTML = `
                <span class="slot-order-tag">#${slot}</span>
                <img class="card-avatar-img" src="${getAvatarUrl(code)}" onerror="this.src='${IMG_BASE}Default-Particle.png'"/>
                <div class="card-hero-name">${cfg.TenHienThi || code}</div>
                <div class="card-skill-tag">Lv.${disciple.level || disciple.Level || 1}</div>
            `;
        } else if (isUnlocked) {
            slotEl.onclick = () => openDisciplePickerForSlot(slot);
            slotEl.title = `Vị trí #${slot} còn trống, ấn để chọn đệ tử`;
            slotEl.innerHTML = `
                <span class="slot-order-tag">#${slot}</span>
                <span style="font-size: 22px; color: #ffd700; font-weight: 900;">+</span>
                <span style="font-size: 10px; color: #ffd700; font-weight: bold;">Trống</span>
            `;
        } else {
            const reqLv = getRequiredLevelForSlot(slot);
            slotEl.onclick = () => alert(`🔒 Vị trí #${slot} yêu cầu đạt Đẳng cấp ${reqLv} để mở khóa!`);
            slotEl.style.opacity = '0.55';
            slotEl.style.background = 'rgba(15, 23, 42, 0.75)';
            slotEl.style.border = '1px dashed #64748b';
            slotEl.title = `Khóa: Cần Lv.${reqLv}`;
            slotEl.innerHTML = `
                <span class="slot-order-tag" style="color: #94a3b8;">#${slot}</span>
                <span style="font-size: 18px; color: #94a3b8;">🔒</span>
                <span style="font-size: 9px; color: #94a3b8; font-weight: bold;">Lv.${reqLv} mở</span>
            `;
        }

        container.appendChild(slotEl);
    }
}

function renderFormation() {
    if (!GameState.playerData) return;
    const dh = GameState.playerData.DoiHinh || {};
    const level = (GameState.playerData.Account && GameState.playerData.Account.Level) ? Number(GameState.playerData.Account.Level) : 1;
    const maxSlots = getMaxSlotDoiHinh(level);

    // 1. Collect formation disciples
    const formationDisciples = [];
    for (let s = 1; s <= maxSlots; s++) {
        const dId = Number(dh['slot' + s] || 0);
        if (dId > 0) {
            const found = (GameState.playerData.NhanVat || []).find(nv => Number(nv.id || nv.Id) === dId);
            if (found) formationDisciples.push({ slot: s, disciple: found });
        }
    }

    if (formationDisciples.length === 0 && GameState.playerData.NhanVat.length > 0) {
        formationDisciples.push({ slot: 1, disciple: GameState.playerData.NhanVat[0] });
    }

    // Determine current selected disciple
    if (!GameState.selectedFormationDiscipleId || !formationDisciples.find(f => Number(f.disciple.id || f.disciple.Id) === GameState.selectedFormationDiscipleId)) {
        if (formationDisciples.length > 0) {
            GameState.selectedFormationDiscipleId = Number(formationDisciples[0].disciple.id || formationDisciples[0].disciple.Id);
        }
    }

    // 2. Render Top Disciple Avatars Track
    const track = document.getElementById('dt-disciple-avatars-track');
    if (track) {
        track.innerHTML = '';
        formationDisciples.forEach(f => {
            const nv = f.disciple;
            const code = nv.name || nv.Code;
            const cfg = getDiscipleCfg(code);
            const isSel = Number(nv.id || nv.Id) === GameState.selectedFormationDiscipleId;

            const box = document.createElement('div');
            box.className = `dt-disciple-box ${isSel ? 'active' : ''}`;
            box.title = `${cfg.TenHienThi || code} (Slot #${f.slot})`;
            box.onclick = () => selectFormationDisciple(nv.id || nv.Id);

            box.innerHTML = `
                <img src="${getAvatarUrl(code)}" onerror="this.src='${IMG_BASE}Default-Particle.png'"/>
                <span class="dt-disciple-level-badge">${nv.level || nv.Level || 1}</span>
            `;
            track.appendChild(box);
        });
    }

    // 3. Render Center Hanging Scroll with Selected Disciple
    const curObj = formationDisciples.find(f => Number(f.disciple.id || f.disciple.Id) === GameState.selectedFormationDiscipleId);
    const curDisciple = curObj ? curObj.disciple : (GameState.playerData.NhanVat[0] || null);

    if (curDisciple) {
        const code = curDisciple.name || curDisciple.Code;
        const cfg = getDiscipleCfg(code);
        const tier = getTierInfo(cfg.Hang || 1);

        // Name calligraphy & tier badge
        const nameEl = document.getElementById('dt-hero-name-calligraphy');
        if (nameEl) nameEl.innerText = cfg.TenHienThi || code;

        const tierEl = document.getElementById('dt-hero-tier-badge');
        if (tierEl) tierEl.innerText = tier.text;

        // Figure image
        const figImg = document.getElementById('dt-hero-figure-img');
        if (figImg) {
            figImg.src = getAvatarUrl(code);
            figImg.onerror = () => { figImg.src = '/assets/images/NV_QuachTinh_ava_to.png'; };
        }

        // Level & Breakthrough
        const lvText = document.getElementById('dt-hero-level-text');
        if (lvText) lvText.innerText = `Lv.${curDisciple.level || curDisciple.Level || 1} +${curDisciple.CaiTao || 0}`;

        // EXP Bar
        const expFill = document.getElementById('dt-hero-exp-fill');
        const expText = document.getElementById('dt-hero-exp-text');
        const expCur = curDisciple.exp || 0;
        const expMax = curDisciple.expMax || 100;
        if (expFill) expFill.style.width = Math.min(100, Math.round(expCur * 100 / expMax)) + '%';
        if (expText) expText.innerText = `${expCur.toLocaleString()} / ${expMax.toLocaleString()}`;

        // 4 Core Stats
        const statMau = document.getElementById('dt-stat-mau');
        const statCong = document.getElementById('dt-stat-cong');
        const statThu = document.getElementById('dt-stat-thu');
        const statNoi = document.getElementById('dt-stat-noi');
        if (statMau) statMau.innerText = (curDisciple.mau || 500).toLocaleString();
        if (statCong) statCong.innerText = (curDisciple.cong || 300).toLocaleString();
        if (statThu) statThu.innerText = (curDisciple.thu || 200).toLocaleString();
        if (statNoi) statNoi.innerText = (curDisciple.noicong || 250).toLocaleString();

        // 6 Duyên Phận (Bonds)
        const duyenGrid = document.getElementById('dt-duyenphan-grid');
        if (duyenGrid) {
            duyenGrid.innerHTML = '';
            const duyenList = cfg.DuyenPhan || [];
            duyenList.forEach(d => {
                // Check if active: if CungDoi, check if any target hero is in formation
                let isActive = false;
                if (d.LoaiDuyenPhanStr === 'CungDoi') {
                    const targets = d.DoiTuong || [];
                    isActive = targets.some(targetCode => {
                        return formationDisciples.some(f => (f.disciple.name || f.disciple.Code) === targetCode);
                    });
                } else if (d.LoaiDuyenPhanStr === 'TrangBiDo') {
                    const targets = d.DoiTuong || [];
                    isActive = targets.some(t => curDisciple.VuKhi === t || curDisciple.AoGiap === t || curDisciple.TrangSuc === t);
                } else if (d.LoaiDuyenPhanStr === 'TrangBiVoCong') {
                    const targets = d.DoiTuong || [];
                    isActive = targets.some(t => (curDisciple.VoCong || []).includes(t));
                }

                const item = document.createElement('div');
                item.className = `dt-duyen-item ${isActive ? 'active' : 'inactive'}`;
                item.title = `${d.TenHienThi}: ${d.LoaiPhuTroStr} +${d.HeSo}%`;
                item.innerText = `* ${d.TenHienThi}`;
                duyenGrid.appendChild(item);
            });
        }

        // 4 Skills Slots (Left Column)
        const skills = [cfg.VoCongMacDinh || 'VC_VoDanhChuongPhap', ...(curDisciple.VoCong || [])];
        for (let s = 0; s < 4; s++) {
            const slotEl = document.getElementById(`dt-skill-slot-${s}`);
            if (slotEl) {
                const skCode = skills[s];
                if (skCode) {
                    const skCfg = (GameState.staticData && GameState.staticData.skills) ? GameState.staticData.skills[skCode] : {};
                    slotEl.style.background = `rgba(38, 21, 11, 0.85)`;
                    slotEl.style.border = '2px solid #b45309';
                    slotEl.innerHTML = `
                        <img src="/assets/ui/${skCode}_vo_cong_nho.png" onerror="this.src='/assets/images/${skCode}_vo_cong_to.png'"/>
                        <span class="dt-slot-level-badge">${s === 0 ? (curDisciple.level || 1) : 10}</span>
                    `;
                } else {
                    slotEl.style.background = `url('/assets/ui/dantran_authentic/slot_empty_question.png') no-repeat center center`;
                    slotEl.style.backgroundSize = '100% 100%';
                    slotEl.style.border = 'none';
                    slotEl.innerHTML = '';
                }
            }
        }

        // 4 Equipment Slots (Right Column)
        const equips = [
            { type: 'VuKhi', code: curDisciple.VuKhi },
            { type: 'AoGiap', code: curDisciple.AoGiap },
            { type: 'TrangSuc', code: curDisciple.TrangSuc },
            { type: 'BaoBoi', code: curDisciple.BaoBoi }
        ];

        equips.forEach((eq, idx) => {
            const slotEl = document.getElementById(`dt-item-slot-${idx}`);
            if (slotEl) {
                if (eq.code) {
                    slotEl.style.background = `rgba(38, 21, 11, 0.85)`;
                    slotEl.style.border = '2px solid #d97706';
                    slotEl.innerHTML = `
                        <img src="/assets/images/${eq.code}_trang_bi_to.png" onerror="this.src='/assets/ui/icon_longchau.png'"/>
                        <span class="dt-slot-level-badge">Lv.1</span>
                    `;
                } else {
                    slotEl.style.background = `url('/assets/ui/dantran_authentic/slot_empty_question.png') no-repeat center center`;
                    slotEl.style.backgroundSize = '100% 100%';
                    slotEl.style.border = 'none';
                    slotEl.innerHTML = '';
                }
            }
        });
    }
}

function handleSkillSlotClick(idx) {
    sound.play('click');
    openVoCongModal();
}

function handleItemSlotClick(itemType) {
    sound.play('click');
    openTinhLuyenModal();
}
'''

# Replace formation block in public/js/game.js
start_marker = '// 1. Formation Tab'
end_marker = '// 2. Disciples Tab'

p1 = js.find(start_marker)
p2 = js.find(end_marker)

if p1 != -1 and p2 != -1:
    js = js[:p1] + new_formation_full + '\n' + js[p2:]
    with open('public/js/game.js', 'w', encoding='utf-8') as f:
        f.write(js)
    print('Updated renderFormation in public/js/game.js successfully!')
else:
    print('Error: Could not find formation block in game.js', p1, p2)
