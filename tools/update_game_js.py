import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('public/js/game.js', 'r', encoding='utf-8') as f:
    js = f.read()

# 1. Add helper functions if not present
helpers = '''
function getMaxSlotDoiHinh(level) {
    const lv = Number(level || 1);
    if (lv >= 25) return 8;
    if (lv >= 20) return 7;
    if (lv >= 15) return 6;
    if (lv >= 10) return 5;
    if (lv >= 3) return 4;
    return 3;
}

function getRequiredLevelForSlot(slot) {
    const s = Number(slot);
    if (s <= 3) return 1;
    if (s === 4) return 3;
    if (s === 5) return 10;
    if (s === 6) return 15;
    if (s === 7) return 20;
    return 25;
}
'''

if 'function getMaxSlotDoiHinh' not in js:
    js = helpers + '\n' + js
    print('Added getMaxSlotDoiHinh and getRequiredLevelForSlot')

# 2. Replace renderFormation and renderGiangHo
old_formation_block = '''// 1. Formation Tab (8 Slots Bát Quái with Authentic Card Frames)
function renderFormation() {
    const container = document.getElementById('formation-container');
    container.innerHTML = '';
    const dh = GameState.playerData.DoiHinh;

    for (let slot = 1; slot <= 8; slot++) {
        const discipleId = dh['slot' + slot];
        const disciple = discipleId > 0 ? GameState.playerData.NhanVat.find(nv => (nv.id || nv.Id) === discipleId) : null;

        const slotEl = document.createElement('div');
        slotEl.className = `formation-slot-item ${disciple ? 'occupied' : ''}`;

        if (disciple) {
            const code = disciple.name || disciple.Code;
            const cfg = getDiscipleCfg(code);
            const tier = getTierInfo(cfg.Hang || 1);
            slotEl.style.backgroundImage = `url('${UI_BASE}${tier.bg}')`;
            slotEl.innerHTML = `
                <span class="slot-order-tag">#${slot}</span>
                <img class="card-avatar-img" src="${getAvatarUrl(code)}" onerror="this.src='${IMG_BASE}Default-Particle.png'"/>
                <div class="card-hero-name">${cfg.TenHienThi || code}</div>
                <div class="card-skill-tag">Lv.${disciple.level || disciple.Level}</div>
            `;
        } else {
            slotEl.innerHTML = `
                <span class="slot-order-tag">#${slot}</span>
                <span style="font-size: 16px; color: #73502b;">+</span>
                <span style="font-size: 8px; color: #73502b; font-weight: bold;">Trống</span>
            `;
        }

        container.appendChild(slotEl);
    }
}'''

new_formation_block = '''// 1. Formation Tab (8 Slots Bát Quái with Authentic Card Frames & Level Unlock Limits)
function renderFormation() {
    const container = document.getElementById('formation-container');
    if (!container || !GameState.playerData) return;
    container.innerHTML = '';
    const dh = GameState.playerData.DoiHinh || {};
    const level = (GameState.playerData.Account && GameState.playerData.Account.Level) ? Number(GameState.playerData.Account.Level) : 1;
    const maxSlots = getMaxSlotDoiHinh(level);

    for (let slot = 1; slot <= 8; slot++) {
        const isUnlocked = slot <= maxSlots;
        const discipleId = dh['slot' + slot];
        const disciple = (isUnlocked && discipleId > 0)
            ? (GameState.playerData.NhanVat || []).find(nv => (nv.id || nv.Id) === discipleId)
            : null;

        const slotEl = document.createElement('div');
        slotEl.className = `formation-slot-item ${disciple ? 'occupied' : ''} ${!isUnlocked ? 'locked' : ''}`;

        if (isUnlocked && disciple) {
            const code = disciple.name || disciple.Code;
            const cfg = getDiscipleCfg(code);
            const tier = getTierInfo(cfg.Hang || 1);
            slotEl.style.backgroundImage = `url('${UI_BASE}${tier.bg}')`;
            slotEl.onclick = () => openDisciplePickerForSlot(slot);
            slotEl.title = `Vị trí #${slot}: ${cfg.TenHienThi || code} (Ấn để thay đổi)`;
            slotEl.innerHTML = `
                <span class="slot-order-tag">#${slot}</span>
                <img class="card-avatar-img" src="${getAvatarUrl(code)}" onerror="this.src='${IMG_BASE}Default-Particle.png'"/>
                <div class="card-hero-name">${cfg.TenHienThi || code}</div>
                <div class="card-skill-tag">Lv.${disciple.level || disciple.Level || 1}</div>
            `;
        } else if (isUnlocked) {
            slotEl.onclick = () => openDisciplePickerForSlot(slot);
            slotEl.title = `Vị trí #${slot} còn trống, ấn để chọn đệ tử xuất chiến`;
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

// Disciple picker for formation slot
function openDisciplePickerForSlot(slot) {
    sound.play('click');
    if (!GameState.playerData || !GameState.playerData.NhanVat) return;
    const currentLevel = (GameState.playerData.Account && GameState.playerData.Account.Level) ? Number(GameState.playerData.Account.Level) : 1;
    const maxSlots = getMaxSlotDoiHinh(currentLevel);
    if (slot > maxSlots) {
        const req = getRequiredLevelForSlot(slot);
        alert(`🔒 Vị trí #${slot} cần đạt Đẳng cấp ${req} để mở khóa!`);
        return;
    }

    const dh = GameState.playerData.DoiHinh || {};
    const assignedIds = new Set(Object.entries(dh).filter(([k, v]) => k.startsWith('slot') && Number(v) > 0).map(([k, v]) => Number(v)));
    const currentAssignedId = Number(dh['slot' + slot] || 0);

    const available = GameState.playerData.NhanVat.filter(nv => {
        const id = Number(nv.id || nv.Id);
        return id === currentAssignedId || !assignedIds.has(id);
    });

    if (available.length === 0) {
        alert('Không có đệ tử dự bị nào! Hãy vào Kỳ Ngộ để chiêu mộ thêm đệ tử.');
        return;
    }

    let menu = `=== CHỌN ĐỆ TỬ CHO VỊ TRÍ #${slot} ===\\n`;
    if (currentAssignedId > 0) {
        menu += `0. [Hạ đệ tử xuống dự bị]\\n`;
    }
    available.forEach((nv, idx) => {
        const code = nv.name || nv.Code;
        const cfg = getDiscipleCfg(code);
        menu += `${idx + 1}. [Lv.${nv.level || nv.Level || 1}] ${cfg.TenHienThi || code} ${Number(nv.id || nv.Id) === currentAssignedId ? '(Hiện tại)' : ''}\\n`;
    });

    const choice = prompt(menu + '\\nNhập số thứ tự đệ tử muốn chọn:');
    if (choice === null) return;
    const chosenIdx = parseInt(choice.trim());
    if (isNaN(chosenIdx)) return;

    if (chosenIdx === 0 && currentAssignedId > 0) {
        assignDiscipleToSlot(slot, 0);
        return;
    }

    const selectedNv = available[chosenIdx - 1];
    if (selectedNv) {
        assignDiscipleToSlot(slot, Number(selectedNv.id || selectedNv.Id));
    }
}

async function assignDiscipleToSlot(slot, discipleId) {
    const res = await apiPost('set_formation', {
        aid: getEffectiveAid(),
        slot,
        discipleId
    });
    if (!res.success) {
        alert(res.error || 'Cài đặt đội hình thất bại!');
        return;
    }
    GameState.playerData = res.playerData;
    renderFormation();
    renderHomeCloudDisciples();
    updateHeader();
}'''

js_norm = js.replace('\r\n', '\n')
old_f_norm = old_formation_block.replace('\r\n', '\n')
new_f_norm = new_formation_block.replace('\r\n', '\n')

if old_f_norm in js_norm:
    js_norm = js_norm.replace(old_f_norm, new_f_norm)
    print('Replaced renderFormation successfully!')
else:
    print('Warning: old_formation_block not matched directly')

# 3. Replace renderGiangHo
old_giangho_block = '''// 3. Giang Ho Tab
function renderGiangHo() {
    if (!GameState.staticData || !GameState.staticData.giangHo) return;
    const chapters = GameState.staticData.giangHo;
    const currentChapter = chapters[GameState.currentChapterIdx] || chapters[0];

    document.getElementById('gh-chapter-name').innerText = currentChapter.tenHienThi;

    const list = document.getElementById('gh-mission-list');
    list.innerHTML = '';

    (currentChapter.nhiemVuList || []).forEach((m, idx) => {
        const card = document.createElement('div');
        card.className = 'mission-row';
        card.innerHTML = `
            <div>
                <h4>Ải ${idx + 1}: ${m.tenHienThi}</h4>
                <p>${m.moTa || 'Quyết chiến cao thủ võ lâm trong ải giang hồ.'}</p>
                <div style="font-size: 10px; color: #ffd700; font-weight: bold; margin-top: 2px;">
                    Thưởng: +${m.expThuong || 10} Exp, +${m.bacThuong || 50} Bạc
                </div>
            </div>
            <button class="btn-authentic-fight" onclick="startBattle(${GameState.currentChapterIdx}, ${idx})">KHIÊU CHIẾN</button>
        `;
        list.appendChild(card);
    });
}'''

new_giangho_block = '''// 3. Giang Ho Tab (Sequential Map Progression: Beat Previous Stage to Unlock Next)
function renderGiangHo() {
    if (!GameState.staticData || !GameState.staticData.giangHo) return;
    const chapters = GameState.staticData.giangHo;
    const ghProg = (GameState.playerData && GameState.playerData.GiangHoProgress)
        ? GameState.playerData.GiangHoProgress
        : { maxChapterIdx: 0, maxMissionIdx: 0 };

    GameState.currentChapterIdx = GameState.currentChapterIdx || 0;
    if (GameState.currentChapterIdx > ghProg.maxChapterIdx) {
        GameState.currentChapterIdx = ghProg.maxChapterIdx;
    }

    const currentChapter = chapters[GameState.currentChapterIdx] || chapters[0];

    // Navigation for chapters
    const ghChapterBanner = document.querySelector('.giangho-banner');
    if (ghChapterBanner) {
        ghChapterBanner.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 4px 6px;">
                <button class="btn-wuxia-gold" style="width: 32px; height: 28px; padding: 0; font-size: 14px; font-weight: bold;" 
                        onclick="changeGiangHoChapter(-1)" ${GameState.currentChapterIdx === 0 ? 'disabled style="opacity:0.35;"' : ''}>◀</button>
                <h3 id="gh-chapter-name" style="margin: 0; font-size: 14px; color: #ffd700; text-shadow: 1px 1px 2px #000; text-align: center; flex: 1;">
                    Chương ${GameState.currentChapterIdx + 1}: ${currentChapter.tenHienThi || currentChapter.TenHienThi}
                </h3>
                <button class="btn-wuxia-gold" style="width: 32px; height: 28px; padding: 0; font-size: 14px; font-weight: bold;" 
                        onclick="changeGiangHoChapter(1)" ${GameState.currentChapterIdx >= ghProg.maxChapterIdx ? 'disabled style="opacity:0.35;"' : ''}>▶</button>
            </div>
        `;
    }

    const list = document.getElementById('gh-mission-list');
    if (!list) return;
    list.innerHTML = '';

    const missions = currentChapter.nhiemVuList || currentChapter.NhiemVuList || [];
    missions.forEach((m, idx) => {
        const isUnlocked = (GameState.currentChapterIdx < ghProg.maxChapterIdx) ||
                           (GameState.currentChapterIdx === ghProg.maxChapterIdx && idx <= ghProg.maxMissionIdx);
        const isCleared = (GameState.currentChapterIdx < ghProg.maxChapterIdx) ||
                          (GameState.currentChapterIdx === ghProg.maxChapterIdx && idx < ghProg.maxMissionIdx);

        const card = document.createElement('div');
        card.className = `mission-row ${!isUnlocked ? 'mission-locked' : ''}`;
        if (!isUnlocked) {
            card.style.opacity = '0.55';
            card.style.filter = 'grayscale(60%)';
        }

        const badgeText = isCleared ? '<span style="color: #4ade80; font-size: 10px; margin-left: 6px; font-weight: bold;">⭐ ĐÃ VƯỢT</span>' : '';
        const btnHtml = isUnlocked
            ? `<button class="btn-authentic-fight" onclick="startBattle(${GameState.currentChapterIdx}, ${idx})">${isCleared ? 'QUYẾT ĐẤU' : 'KHIÊU CHIẾN'}</button>`
            : `<button class="btn-authentic-fight" style="background: #374151; color: #9ca3af; border-color: #4b5563;" disabled>🔒 CHƯA MỞ</button>`;

        card.innerHTML = `
            <div style="flex: 1;">
                <h4 style="margin: 0 0 3px 0; font-size: 13px; color: ${isUnlocked ? '#fef08a' : '#9ca3af'};">
                    Ải ${idx + 1}: ${m.tenHienThi || m.TenHienThi} ${badgeText}
                </h4>
                <p style="margin: 0; font-size: 11px; color: #d6d3d1;">${m.moTa || m.MoTa || 'Quyết chiến cao thủ võ lâm trong ải giang hồ.'}</p>
                <div style="font-size: 10px; color: #ffd700; font-weight: bold; margin-top: 3px;">
                    Thưởng: +${m.expThuong || m.ExpThuong || 10} Exp, +${m.bacThuong || m.BacThuong || 50} Bạc
                </div>
            </div>
            ${btnHtml}
        `;
        list.appendChild(card);
    });
}

function changeGiangHoChapter(delta) {
    sound.play('click');
    const chapters = (GameState.staticData && GameState.staticData.giangHo) ? GameState.staticData.giangHo : [];
    const ghProg = (GameState.playerData && GameState.playerData.GiangHoProgress)
        ? GameState.playerData.GiangHoProgress
        : { maxChapterIdx: 0, maxMissionIdx: 0 };

    const nextIdx = (GameState.currentChapterIdx || 0) + delta;
    if (nextIdx >= 0 && nextIdx <= ghProg.maxChapterIdx && nextIdx < chapters.length) {
        GameState.currentChapterIdx = nextIdx;
        renderGiangHo();
    }
}'''

old_gh_norm = old_giangho_block.replace('\r\n', '\n')
new_gh_norm = new_giangho_block.replace('\r\n', '\n')

if old_gh_norm in js_norm:
    js_norm = js_norm.replace(old_gh_norm, new_gh_norm)
    print('Replaced renderGiangHo successfully!')
else:
    print('Warning: old_giangho_block not matched directly')

# 4. Replace renderHomeCloudDisciples
old_cloud_func = '''function renderHomeCloudDisciples() {
    const container = document.getElementById('home-cloud-disciples');
    if (!container || !GameState.playerData || !GameState.playerData.NhanVat) return;

    container.innerHTML = '';
    const disciples = GameState.playerData.NhanVat.slice(0, 5);

    disciples.forEach((nv, idx) => {
        const code = nv.name || nv.Code;
        const cfg = getDiscipleCfg(code);

        const item = document.createElement('div');
        item.className = 'home-cloud-disciple-item';
        // Give center disciple slight elevation
        if (idx === Math.floor(disciples.length / 2)) {
            item.style.transform = 'scale(1.08) translateY(-4px)';
            item.style.zIndex = '5';
        }
        item.onclick = () => openDiscipleDetailModal(code);
        item.title = cfg.TenHienThi || code;

        const img = document.createElement('img');
        img.src = getAvatarUrl(code);
        img.onerror = () => { img.src = '/assets/images/NV_QuachTinh_ava_to.png'; };
        item.appendChild(img);

        container.appendChild(item);
    });
}'''

new_cloud_func = '''function renderHomeCloudDisciples() {
    const container = document.getElementById('home-cloud-disciples');
    if (!container || !GameState.playerData) return;

    container.innerHTML = '';
    const dh = GameState.playerData.DoiHinh || {};
    const level = (GameState.playerData.Account && GameState.playerData.Account.Level) ? Number(GameState.playerData.Account.Level) : 1;
    const maxSlots = getMaxSlotDoiHinh(level);

    for (let slot = 1; slot <= 8; slot++) {
        const card = document.createElement('div');
        card.className = 'cloud-slot-card';

        const isUnlocked = slot <= maxSlots;
        const discipleId = Number(dh['slot' + slot] || 0);
        const disciple = (isUnlocked && discipleId > 0)
            ? (GameState.playerData.NhanVat || []).find(nv => Number(nv.id || nv.Id) === discipleId)
            : null;

        if (isUnlocked && disciple) {
            const code = disciple.name || disciple.Code;
            const cfg = getDiscipleCfg(code);
            const tier = getTierInfo(cfg.Hang || 1);
            card.onclick = () => openDiscipleDetailModal(code);
            card.title = `${cfg.TenHienThi || code} (Vị trí #${slot}) - Ấn để xem chi tiết`;
            card.innerHTML = `
                <span class="cloud-slot-badge">#${slot}</span>
                <div class="cloud-figure-wrapper">
                    <img class="cloud-figure-img" src="${getAvatarUrl(code)}" onerror="this.src='${IMG_BASE}Default-Particle.png'"/>
                </div>
                <img class="cloud-pedestal-img" src="/assets/ui/LTcung_cloud_02.png" alt="Mây"/>
                <div class="cloud-hero-plate tier-${tier.cls}">
                    <div class="cloud-hero-name">${cfg.TenHienThi || code}</div>
                    <div class="cloud-hero-sub">Lv.${disciple.level || disciple.Level || 1}</div>
                </div>
            `;
        } else if (isUnlocked) {
            card.onclick = () => switchTab('formation');
            card.title = `Vị trí #${slot} còn trống - Ấn để vào Xếp Đội Hình`;
            card.innerHTML = `
                <span class="cloud-slot-badge">#${slot}</span>
                <div class="cloud-empty-box">+</div>
                <img class="cloud-pedestal-img" src="/assets/ui/LTcung_cloud_02.png" alt="Mây"/>
                <div class="cloud-hero-plate">
                    <div class="cloud-hero-name" style="color: #fde047;">Trống</div>
                    <div class="cloud-hero-sub" style="color: #94a3b8;">Xuất chiến</div>
                </div>
            `;
        } else {
            const reqLv = getRequiredLevelForSlot(slot);
            card.onclick = () => alert(`🔒 Vị trí #${slot} yêu cầu đạt Đẳng cấp ${reqLv} để mở khóa!`);
            card.title = `Khóa - Cần Đẳng cấp ${reqLv} mở khóa`;
            card.innerHTML = `
                <span class="cloud-slot-badge" style="border-color: #6b7280; color: #9ca3af;">#${slot}</span>
                <div class="cloud-locked-box">🔒</div>
                <img class="cloud-pedestal-img" style="opacity: 0.45; filter: grayscale(80%);" src="/assets/ui/LTcung_cloud_02.png" alt="Mây"/>
                <div class="cloud-hero-plate" style="border-color: #4b5563; background: #18181b;">
                    <div class="cloud-hero-name" style="color: #9ca3af;">Khóa</div>
                    <div class="cloud-hero-sub" style="color: #6b7280;">Lv.${reqLv} mở</div>
                </div>
            `;
        }

        container.appendChild(card);
    }
}'''

old_cloud_norm = old_cloud_func.replace('\r\n', '\n')
new_cloud_norm = new_cloud_func.replace('\r\n', '\n')

if old_cloud_norm in js_norm:
    js_norm = js_norm.replace(old_cloud_norm, new_cloud_norm)
    print('Replaced renderHomeCloudDisciples successfully!')
else:
    print('Warning: old_cloud_func not matched directly')

with open('public/js/game.js', 'w', encoding='utf-8') as f:
    f.write(js_norm)

print('Updated public/js/game.js successfully!')
