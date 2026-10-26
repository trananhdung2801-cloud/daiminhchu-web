// Đại Minh Chủ - Authentic Web Game Client
const AUDIO_BASE = '/assets/audio/';
const IMG_BASE = '/assets/images/';
const UI_BASE = '/assets/ui/';

class SoundSystem {
    constructor() {
        this.cache = {};
        this.enabled = true;
    }

    play(name) {
        if (!this.enabled) return;
        try {
            if (!this.cache[name]) {
                const audio = new Audio(`${AUDIO_BASE}${name}.wav`);
                audio.preload = 'none';
                this.cache[name] = audio;
            }
            const sound = this.cache[name];
            sound.currentTime = 0;
            sound.volume = 0.5;
            const playPromise = sound.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => {});
            }
        } catch (e) {}
    }
}

const sound = new SoundSystem();

const STARTERS = {
    NV_QuachTinh: {
        name: 'Quách Tĩnh',
        skill: 'Hàng Long Chưởng',
        hp: 190, atk: 170, def: 140, inner: 110,
        img: '/assets/images/NV_QuachTinh_ava_to.png'
    },
    NV_DuongQua: {
        name: 'Dương Quá',
        skill: 'Ám Nhiên Tiêu Hồn',
        hp: 185, atk: 190, def: 125, inner: 130,
        img: '/assets/images/NV_DuongQua_ava_to.png'
    },
    NV_TruongVoKy: {
        name: 'Trương Vô Kỵ',
        skill: 'Càn Khôn Đại Na Di',
        hp: 200, atk: 160, def: 150, inner: 140,
        img: '/assets/images/NV_TruongVoKy_ava_to.png'
    },
    NV_LenhHoXung: {
        name: 'Lệnh Hồ Xung',
        skill: 'Độc Cô Cửu Kiếm',
        hp: 180, atk: 180, def: 130, inner: 120,
        img: '/assets/images/NV_LenhHoXung_ava_to.png'
    }
};

const GameState = {
    user: null,
    playerData: null,
    staticData: null,
    activeTab: 'formation',
    currentChapterIdx: 0,
    selectedStarter: 'NV_LenhHoXung'
};

// API Helpers
function getEffectiveAid() {
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
}

async function fetchStaticData() {
    const res = await fetch('/api/static_data');
    GameState.staticData = await res.json();
}

// Helpers
function getAvatarUrl(codeName) {
    return `${IMG_BASE}${codeName}_ava_to.png`;
}

function getDiscipleCfg(codeName) {
    if (!GameState.staticData || !GameState.staticData.characters) return {};
    return GameState.staticData.characters[codeName] || {};
}

function getTierInfo(hang) {
    switch (hang) {
        case 1: return { text: 'Giáp', cls: 'giap', bg: 'hang1_nam_bkgto.png' };
        case 2: return { text: 'Ất', cls: 'at', bg: 'hang2_nam_bkgto.png' };
        case 3: return { text: 'Bính', cls: 'binh', bg: 'hang3_nam_bkgto.png' };
        default: return { text: 'Đinh', cls: 'dinh', bg: 'hang4_bkgto.png' };
    }
}

// UI Updaters
function updateHeader() {
    if (!GameState.playerData) return;
    const acc = GameState.playerData.Account || {};
    const time = GameState.playerData.GiaTriThoiGian || {};

    const nameEl = document.getElementById('header-player-name');
    if (nameEl) nameEl.innerText = acc.DisplayName || acc.PublisherAccount || 'Chưởng Môn';

    const lvlEl = document.getElementById('header-level');
    if (lvlEl) lvlEl.innerText = `Lv.${acc.Level || 1}`;

    const vipEl = document.getElementById('header-vip-badge');
    if (vipEl) vipEl.innerText = `VIP ${acc.Vip || 1}`;

    const knbEl = document.getElementById('header-knb');
    if (knbEl) knbEl.innerText = Number(acc.Vang || 0).toLocaleString();

    const bacEl = document.getElementById('header-bac');
    if (bacEl) bacEl.innerText = Number(acc.Bac || 0).toLocaleString();

    const expFill = document.getElementById('header-exp-fill');
    if (expFill) {
        const expPercent = Math.min(100, Math.round(((acc.Exp || 0) / (acc.ExpMax || 100)) * 100));
        expFill.style.width = `${expPercent}%`;
    }

    const expText = document.getElementById('header-exp-text');
    if (expText) expText.innerText = `${acc.Exp || 0}/${acc.ExpMax || 100}`;

    const staminaEl = document.getElementById('header-stamina');
    if (staminaEl) staminaEl.innerText = `${time.LuotNV ?? 30}/${time.LuotNVMax || 30}`;

    const qiEl = document.getElementById('header-qi');
    if (qiEl) qiEl.innerText = `${time.LuotTD ?? 12}/${time.LuotTDMax || 12}`;
}

function switchScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(screenId);
    if (target) target.classList.add('active');
}

function switchTab(tabName) {
    sound.play('click');
    GameState.activeTab = tabName;
    document.querySelectorAll('.tab-btn-auth').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    document.querySelectorAll('.tab-view').forEach(view => {
        view.style.display = view.id === `tab-${tabName}` ? 'block' : 'none';
    });

    renderCurrentTab();
}

function renderCurrentTab() {
    switch (GameState.activeTab) {
        case 'home':
            renderHomeCloudDisciples();
            break;
        case 'formation':
            renderFormation();
            break;
        case 'giangho':
            renderGiangHo();
            break;
        case 'luyencong':
            renderDisciples();
            break;
        case 'recruit':
            break;
        case 'market':
            renderMarket();
            break;
        case 'luankiem':
            renderLuankiem();
            break;
        case 'items':
            renderItems();
            break;
    }
}

// ================= AUTHENTIC DISCIPLE CAROUSEL & SCROLL PAINTING (IMAGE 2 & 3) =================
function renderTopCarousel() {
    const listEl = document.getElementById('disciple-carousel-list');
    if (!listEl || !GameState.playerData || !GameState.playerData.NhanVat) return;

    listEl.innerHTML = '';
    const disciples = GameState.playerData.NhanVat;

    if (!GameState.selectedDiscipleId && disciples.length > 0) {
        GameState.selectedDiscipleId = disciples[0].id || disciples[0].Id;
    }

    disciples.forEach(nv => {
        const id = nv.id || nv.Id;
        const code = nv.name || nv.Code;
        const cfg = getDiscipleCfg(code);
        const tier = getTierInfo(cfg.Hang || 1);

        const thumb = document.createElement('div');
        thumb.className = `carousel-thumb-item ${id === GameState.selectedDiscipleId ? 'active' : ''}`;
        thumb.onclick = () => {
            sound.play('click');
            GameState.selectedDiscipleId = id;
            renderTopCarousel();
            renderScrollPainting();
        };

        const img = document.createElement('img');
        img.src = getAvatarUrl(code);
        img.onerror = () => { img.src = '/assets/res/avatar_default.png'; };
        thumb.appendChild(img);

        listEl.appendChild(thumb);
    });
}

function renderScrollPainting() {
    if (!GameState.playerData || !GameState.playerData.NhanVat) return;
    const disciples = GameState.playerData.NhanVat;
    const current = disciples.find(d => (d.id || d.Id) === GameState.selectedDiscipleId) || disciples[0];
    if (!current) return;

    const code = current.name || current.Code;
    const cfg = getDiscipleCfg(code);
    const tier = getTierInfo(cfg.Hang || 1);

    // Portrait & Calligraphy Name
    const portraitEl = document.getElementById('disciple-scroll-portrait');
    if (portraitEl) {
        portraitEl.src = getAvatarUrl(code);
        portraitEl.onerror = () => { portraitEl.src = '/assets/res/avatar_default.png'; };
    }

    const nameEl = document.getElementById('disciple-scroll-calligraphy');
    if (nameEl) nameEl.innerText = cfg.TenHienThi || code;

    const qualityEl = document.getElementById('disciple-scroll-quality');
    if (qualityEl) qualityEl.innerText = tier.text.toUpperCase();

    // Level & HP Bar
    const lvlEl = document.getElementById('disciple-scroll-level');
    if (lvlEl) lvlEl.innerText = current.level || current.Level || 1;

    const hpVal = current.mau || current.MauCoSo || 1021;
    const maxHpVal = hpVal * 2;
    const hpTextEl = document.getElementById('disciple-hp-text');
    if (hpTextEl) hpTextEl.innerText = `${hpVal}/${maxHpVal}`;

    // 4 Core Stats
    const atkVal = current.cong || current.CongCoSo || 862;
    const defVal = current.thu || current.ThuCoSo || 381;
    const innerVal = current.noicong || current.NoiLucCoSo || 548;

    const hpStat = document.getElementById('stat-val-hp');
    if (hpStat) hpStat.innerText = hpVal;
    const atkStat = document.getElementById('stat-val-atk');
    if (atkStat) atkStat.innerText = atkVal;
    const defStat = document.getElementById('stat-val-def');
    if (defStat) defStat.innerText = defVal;
    const innerStat = document.getElementById('stat-val-inner');
    if (innerStat) innerStat.innerText = innerVal;

    // 6 Synergy Bonds (Duyên Phận)
    const synergyContainer = document.getElementById('disciple-synergy-grid');
    if (synergyContainer) {
        synergyContainer.innerHTML = '';
        const defaultBonds = [
            { text: `• ${cfg.TenHienThi || 'Võ lâm'} truyền nhân`, active: true },
            { text: `• Bất bại thần thoại`, active: false },
            { text: `• ${cfg.VoCongMacDinh ? 'Chính tông tâm pháp' : 'Tuyệt kỹ giang hồ'}`, active: true },
            { text: `• Thần binh hộ thể`, active: false },
            { text: `• Tham Lang thôn nhật`, active: false },
            { text: `• Vạn chúng quy tâm`, active: true }
        ];
        defaultBonds.forEach(b => {
            const item = document.createElement('div');
            item.className = `synergy-bond-item ${b.active ? 'active' : ''}`;
            item.innerText = b.text;
            synergyContainer.appendChild(item);
        });
    }

    // Disciple Value in Vàng
    const valEl = document.getElementById('disciple-scroll-value');
    if (valEl) {
        const val = ((current.level || 1) * 150 + 2000);
        valEl.innerText = `${val.toLocaleString()} Vàng`;
    }
}

function openChanKhiModal() {
    sound.play('click');
    alert('✨ Tính năng Chân Khí Đột Phá: Gia tăng 15% Sát thương và Nội lực cho đệ tử!');
}

function showItemDetail(slotType) {
    sound.play('click');
    alert(`Ô trang bị [${slotType.toUpperCase()}]: Nhấp vào Túi Đồ để thay đổi thần binh & tâm pháp!`);
}

function renderMarket() {
    const grid = document.getElementById('market-items-grid');
    if (!grid) return;
    grid.innerHTML = `
        <div style="background: rgba(30, 20, 15, 0.85); border: 1px solid #73502b; border-radius: 6px; padding: 10px; text-align: center;">
            <img src="${IMG_BASE}VP_GaQuay_to.png" style="width: 48px; height: 48px; object-fit: contain; margin: 0 auto 6px;">
            <div style="font-size: 12px; color: #ffd700; font-weight: bold;">Gà Quay x10</div>
            <div style="font-size: 11px; color: #a8a29e; margin-bottom: 6px;">Hồi phục 150 Thể Lực</div>
            <button class="btn-wuxia-gold" style="width: 100%; height: 32px; font-size: 11px;" onclick="execGmAction('add_all_items')">Mua (50 Vàng)</button>
        </div>
        <div style="background: rgba(30, 20, 15, 0.85); border: 1px solid #73502b; border-radius: 6px; padding: 10px; text-align: center;">
            <img src="${IMG_BASE}VP_RuouTrangNguyenHong_to.png" style="width: 48px; height: 48px; object-fit: contain; margin: 0 auto 6px;">
            <div style="font-size: 12px; color: #ffd700; font-weight: bold;">Nữ Nhi Hồng x10</div>
            <div style="font-size: 11px; color: #a8a29e; margin-bottom: 6px;">Hồi phục 150 Khí Lực</div>
            <button class="btn-wuxia-gold" style="width: 100%; height: 32px; font-size: 11px;" onclick="execGmAction('add_all_items')">Mua (50 Vàng)</button>
        </div>
    `;
}

// 1. Formation Tab (8 Slots Bát Quái with Authentic Card Frames)
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
}

// 2. Disciples Tab (Luyện Công)
function renderDisciples() {
    const container = document.getElementById('luyencong-container');
    if (!container) return;
    container.innerHTML = '';

    GameState.playerData.NhanVat.forEach(nv => {
        const code = nv.name || nv.Code;
        const cfg = getDiscipleCfg(code);
        const tier = getTierInfo(cfg.Hang || 1);

        const card = document.createElement('div');
        card.className = 'disciple-banner-item';
        card.innerHTML = `
            <div class="disciple-card-mini tier-${tier.cls}">
                <img src="${getAvatarUrl(code)}" onerror="this.src='${IMG_BASE}Default-Particle.png'"/>
            </div>
            <div class="disciple-info-col">
                <div class="disciple-name-row">
                    <h4>${cfg.TenHienThi || code}</h4>
                    <span class="tier-pill ${tier.cls}">${tier.text}</span>
                    <span style="font-size: 11px; color: #ffd700; font-weight: bold;">Lv.${nv.level || nv.Level}</span>
                </div>
                <div class="disciple-stats-grid">
                    <span>❤️ Máu: <b>${nv.mau || 500}</b></span>
                    <span>⚔️ Công: <b>${nv.cong || 300}</b></span>
                    <span>🛡️ Thủ: <b>${nv.thu || 200}</b></span>
                    <span>⚡ Nội: <b>${nv.noicong || 250}</b></span>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// 3. Giang Ho Tab
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
}

// 4. Recruit Tab
async function doRecruit(type) {
    sound.play('click');
    const res = await apiPost('recruit', { aid: getEffectiveAid(), type });
    if (!res.success) {
        alert(res.error || 'Chiêu mộ thất bại!');
        return;
    }

    sound.play('renxong');
    GameState.playerData = res.playerData;
    updateHeader();

    const cfg = res.discipleCfg || {};
    const tier = getTierInfo(cfg.Hang || 1);
    alert(`🎉 Chúc mừng Minh Chủ đã chiêu mộ thành công cao thủ:\n[${tier.text}] ${cfg.TenHienThi || res.newDisciple.name}!`);
    renderCurrentTab();
}

// 5. Items Tab
function renderItems() {
    const container = document.getElementById('items-container');
    container.innerHTML = '';

    const items = GameState.playerData.VatPhamTieuThu || [];
    items.forEach(it => {
        const card = document.createElement('div');
        card.style.cssText = "background: rgba(28, 18, 13, 0.9); border: 1px solid #5a3c22; border-radius: 6px; padding: 10px; display: flex; align-items: center; gap: 10px;";
        const isGa = it.name === 'VP_GaQuay';
        const iconImg = isGa ? `${IMG_BASE}VP_GaQuay_to.png` : `${IMG_BASE}VP_RuouTrangNguyenHong_to.png`;
        card.innerHTML = `
            <img src="${iconImg}" style="width: 44px; height: 44px; object-fit: contain; background: #000; border-radius: 4px; border: 1px solid #73502b;"/>
            <div style="flex: 1;">
                <h4 style="font-size: 12px; color: #fffae6;">${isGa ? 'Gà Quay' : 'Nữ Nhi Hồng'} (x${it.quantity})</h4>
                <p style="font-size: 10px; color: #a8917e;">${isGa ? '+15 Thể Lực' : '+15 Khí Lực'}</p>
                <button class="btn-wuxia-gold" style="width: 70px; height: 26px; font-size: 10px; margin-top: 4px;" onclick="useItem('${it.name}')">Dùng</button>
            </div>
        `;
        container.appendChild(card);
    });
}

async function useItem(itemCode) {
    sound.play('click');
    const res = await apiPost('use_item', { aid: getEffectiveAid(), itemCode });
    if (!res.success) {
        alert(res.error || 'Không thể dùng vật phẩm');
        return;
    }
    sound.play('trangbi');
    GameState.playerData = res.playerData;
    updateHeader();
    renderItems();
}

// ================= AUTHENTIC BATTLE ARENA (100% MATCHING IMAGE 1 & VIDEO) =================
async function startBattle(chapterIdx, missionIdx) {
    sound.play('click');
    const res = await apiPost('battle', {
        aid: getEffectiveAid(),
        chapterIdx,
        missionIdx
    });

    if (!res.success) {
        alert(res.error || 'Khiêu chiến thất bại!');
        return;
    }

    GameState.playerData = res.playerData;
    updateHeader();
    playBattleAnimation(res.battleResult);
}

function playBattleAnimation(battle) {
    const overlay = document.getElementById('battle-overlay');
    overlay.classList.add('active');

    // 1. Render Right Side: Vertical Column of 8 Enemy Target Heads (Matching Image 1)
    const targetsListEl = document.getElementById('battle-targets-list');
    targetsListEl.innerHTML = '';

    // Up to 8 enemy heads
    const enemies = battle.teamEnemy.slice(0, 8);
    enemies.forEach((enemy, idx) => {
        const item = document.createElement('div');
        item.className = 'target-head-item';
        item.id = `target-head-${enemy.id}`;

        const circle = document.createElement('div');
        circle.className = 'target-avatar-circle';

        const img = document.createElement('img');
        const code = enemy.code || enemy.name;
        img.src = getAvatarUrl(code);
        img.onerror = () => { img.src = '/assets/res/avatar_default.png'; };
        circle.appendChild(img);

        item.appendChild(circle);
        targetsListEl.appendChild(item);
    });

    // 2. Step-by-step turn execution
    let turnIdx = 0;
    const logs = battle.logs;

    function nextTurn() {
        if (turnIdx >= logs.length) {
            setTimeout(() => showBattleResult(battle), 800);
            return;
        }

        const log = logs[turnIdx++];
        document.getElementById('battle-round-title').innerText = `⚔️ HIỆP ${log.round} - QUYẾT ĐẤU VÕ LÂM`;

        // Identify attacker and defender
        const attacker = log.isPlayerAttacker
            ? battle.teamPlayer.find(p => p.id === log.attackerId)
            : battle.teamEnemy.find(e => e.id === log.attackerId);
        
        if (attacker) {
            const attackerImg = document.getElementById('battle-attacker-img');
            const attackerName = document.getElementById('battle-attacker-name');
            const code = attacker.code || attacker.name;
            attackerImg.src = getAvatarUrl(code);
            attackerImg.onerror = () => { attackerImg.src = '/assets/res/avatar_default.png'; };
            attackerName.innerText = attacker.displayName || attacker.name;

            // Update Top Banner with Total Damage / Skill
            const bannerDmg = document.getElementById('attacker-total-dmg');
            bannerDmg.innerText = log.damage;
        }

        // Sound effect
        if (log.isSkill) {
            sound.play('tuyetchieu');
        } else {
            sound.play('hit01');
        }

        // Animate Fire Beam from Left to Right
        createFireBeamVFX();

        // Animate hit on the target head
        setTimeout(() => {
            const defenderHead = document.getElementById(`target-head-${log.defenderId}`);
            if (defenderHead) {
                defenderHead.classList.add('anim-shake');
                setTimeout(() => defenderHead.classList.remove('anim-shake'), 450);

                // Authentic Damage Calligraphy Float (Image 1)
                const dmgFloat = document.createElement('div');
                dmgFloat.className = `target-damage-float ${log.isCrit ? 'crit' : ''}`;
                dmgFloat.innerHTML = log.isCrit
                    ? `<span class="crit-tag">Bạo</span> <span class="dmg-num">-${log.damage}</span>`
                    : `<span>-${log.damage}</span>`;
                defenderHead.appendChild(dmgFloat);
                setTimeout(() => dmgFloat.remove(), 800);

                if (log.isKilled) {
                    sound.play('chet_m');
                    defenderHead.classList.add('dead');
                }
            }

            setTimeout(nextTurn, 650);
        }, 350);
    }

    setTimeout(nextTurn, 500);
}

function createFireBeamVFX() {
    const layer = document.getElementById('battle-fx-layer');
    if (!layer) return;
    const beam = document.createElement('div');
    beam.className = 'fire-beam-projectile';
    beam.style.top = `${25 + Math.random() * 50}%`;
    beam.style.left = '42%';
    layer.appendChild(beam);
    setTimeout(() => beam.remove(), 400);
}

function showBattleResult(battle) {
    sound.play(battle.isWin ? 'renxong' : 'chet_m');
    const modal = document.getElementById('battle-result-modal');
    modal.classList.add('active');

    document.getElementById('result-stars').innerText = battle.isWin ? '⭐⭐⭐' : '';
    document.getElementById('result-rewards').innerHTML = `
        <span>Exp: +${battle.expGained || 50}</span>
        <span>Bạc: +${battle.bacGained || 500}</span>
    `;
}

function closeBattle() {
    sound.play('click');
    document.getElementById('battle-result-modal').classList.remove('active');
    document.getElementById('battle-overlay').classList.remove('active');
    renderCurrentTab();
}

// ================= ADMIN GM TOOL CONTROLLER =================
function openAdminModal() {
    sound.play('click');
    const msg = document.getElementById('gm-result-msg');
    if (msg) msg.innerText = '';
    document.getElementById('admin-modal').classList.add('active');
}

function closeAdminModal() {
    sound.play('click');
    document.getElementById('admin-modal').classList.remove('active');
}

async function execGmAction(actionType) {
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
}

// Trigger instant 8 vs 8 test battle matching Image 1
function triggerTestBattle() {
    sound.play('tuyetchieu');
    closeAdminModal();

    // Mock battle matching Image 1 (Quách Tĩnh with bow vs 8 Monks)
    const testBattle = {
        isWin: true,
        expGained: 500,
        bacGained: 25000,
        teamPlayer: [
            { id: 1, name: 'NV_QuachTinh', code: 'NV_QuachTinh', displayName: 'Quách Tĩnh', maxHp: 5000 }
        ],
        teamEnemy: [
            { id: 101, name: 'NV_ThieuLamTang', code: 'NV_ThieuLamTang', displayName: 'La Hán 1', maxHp: 2000 },
            { id: 102, name: 'NV_ThieuLamTang', code: 'NV_ThieuLamTang', displayName: 'La Hán 2', maxHp: 2500 },
            { id: 103, name: 'NV_ThieuLamTang', code: 'NV_ThieuLamTang', displayName: 'La Hán 3', maxHp: 2000 },
            { id: 104, name: 'NV_ThieuLamTang', code: 'NV_ThieuLamTang', displayName: 'La Hán 4', maxHp: 1800 },
            { id: 105, name: 'NV_ThieuLamTang', code: 'NV_ThieuLamTang', displayName: 'La Hán 5', maxHp: 1500 },
            { id: 106, name: 'NV_ThieuLamTang', code: 'NV_ThieuLamTang', displayName: 'La Hán 6', maxHp: 1200 },
            { id: 107, name: 'NV_ThieuLamTang', code: 'NV_ThieuLamTang', displayName: 'La Hán 7', maxHp: 2500 },
            { id: 108, name: 'NV_ThieuLamTang', code: 'NV_ThieuLamTang', displayName: 'La Hán 8', maxHp: 1000 }
        ],
        logs: [
            { round: 1, isPlayerAttacker: true, attackerId: 1, defenderId: 101, damage: 1645, isCrit: false, isSkill: true, isKilled: false },
            { round: 1, isPlayerAttacker: true, attackerId: 1, defenderId: 102, damage: 2350, isCrit: false, isSkill: false, isKilled: false },
            { round: 1, isPlayerAttacker: true, attackerId: 1, defenderId: 103, damage: 1645, isCrit: false, isSkill: false, isKilled: false },
            { round: 1, isPlayerAttacker: true, attackerId: 1, defenderId: 104, damage: 1410, isCrit: false, isSkill: false, isKilled: false },
            { round: 1, isPlayerAttacker: true, attackerId: 1, defenderId: 105, damage: 1175, isCrit: false, isSkill: false, isKilled: false },
            { round: 1, isPlayerAttacker: true, attackerId: 1, defenderId: 106, damage: 940, isCrit: false, isSkill: false, isKilled: false },
            { round: 1, isPlayerAttacker: true, attackerId: 1, defenderId: 107, damage: 1938, isCrit: true, isSkill: true, isKilled: false },
            { round: 1, isPlayerAttacker: true, attackerId: 1, defenderId: 108, damage: 611, isCrit: false, isSkill: false, isKilled: true }
        ]
    };

    playBattleAnimation(testBattle);
}

// ================= STARTER SELECTION SHOWCASE =================
function selectStarterHero(code, btnEl) {
    sound.play('click');
    GameState.selectedStarter = code;
    document.querySelectorAll('.starter-thumb-btn').forEach(b => b.classList.remove('selected'));
    if (btnEl) btnEl.classList.add('selected');

    const hero = STARTERS[code];
    if (hero) {
        document.getElementById('hero-showcase-img').src = hero.img;
        document.getElementById('hero-showcase-name').innerText = `${hero.name} [Giáp]`;
        document.getElementById('hero-showcase-skill').innerText = hero.skill;
        document.getElementById('hero-detail-title').innerText = hero.name;
        document.getElementById('hero-detail-skill').innerText = hero.skill;
        document.getElementById('hero-detail-hp').innerText = hero.hp;
        document.getElementById('hero-detail-atk').innerText = hero.atk;
        document.getElementById('hero-detail-def').innerText = hero.def;
        document.getElementById('hero-detail-inner').innerText = hero.inner;
    }
}

async function confirmStarterSelection() {
    sound.play('renxong');
    const res = await apiPost('select_starter', {
        aid: getEffectiveAid(),
        starterCode: GameState.selectedStarter
    });

    if (!res.success) {
        alert(res.error || 'Chọn đệ tử thất bại!');
        return;
    }

    GameState.playerData = res.playerData;
    initMainGame();
}

// ================= AUTH (LOGIN / REGISTER) =================
function switchAuthTab(tab) {
    sound.play('click');
    const isLogin = tab === 'login';
    document.getElementById('tab-btn-login').classList.toggle('active', isLogin);
    document.getElementById('tab-btn-register').classList.toggle('active', !isLogin);
    document.getElementById('form-login-wrap').style.display = isLogin ? 'flex' : 'none';
    document.getElementById('form-register-wrap').style.display = !isLogin ? 'flex' : 'none';
    const errEl = document.getElementById('auth-error-msg');
    if (errEl) errEl.innerText = '';
}

async function doLogin() {
    sound.play('click');
    const errEl = document.getElementById('auth-error-msg');
    if (errEl) errEl.innerText = '';

    const username = (document.getElementById('login-username').value || '').trim();
    const password = (document.getElementById('login-password').value || '').trim();

    if (!username) {
        if (errEl) errEl.innerText = 'Vui lòng nhập tên tài khoản!';
        return;
    }

    showLoading('Đang kết nối vào chốn giang hồ...');
    try {
        const res = await apiPost('login', { username, password });
        hideLoading();

        if (!res.success) {
            sound.play('chet_m');
            if (errEl) errEl.innerText = res.error || 'Đăng nhập thất bại!';
            return;
        }

        GameState.user = res.user;
        GameState.playerData = res.playerData;
        localStorage.setItem("dmc_aid", res.user.aid);
        localStorage.setItem("dmc_username", res.user.username);

        initMainGame();
    } catch (e) {
        hideLoading();
        console.error('Login error:', e);
        if (errEl) errEl.innerText = 'Lỗi kết nối máy chủ: ' + (e.message || '');
    }
}

async function doRegister() {
    sound.play('click');
    const errEl = document.getElementById('auth-error-msg');
    if (errEl) errEl.innerText = '';

    const username = (document.getElementById('reg-username').value || '').trim();
    const password = (document.getElementById('reg-password').value || '').trim();
    const starterRadio = document.querySelector('input[name="reg-starter"]:checked');
    const starterCode = starterRadio ? starterRadio.value : 'NV_LenhHoXung';

    if (!username || username.length < 3) {
        if (errEl) errEl.innerText = 'Tên tài khoản phải từ 3 ký tự trở lên!';
        return;
    }
    if (!password || password.length < 4) {
        if (errEl) errEl.innerText = 'Mật khẩu phải từ 4 ký tự trở lên!';
        return;
    }

    showLoading('Đang tạo mới cao thủ võ lâm...');
    try {
        const res = await apiPost('register', { username, password, starterCode });
        hideLoading();

        if (!res.success) {
            sound.play('chet_m');
            if (errEl) errEl.innerText = res.error || 'Đăng ký thất bại!';
            return;
        }

        sound.play('renxong');
        GameState.user = res.user;
        GameState.playerData = res.playerData;
        localStorage.setItem("dmc_aid", res.user.aid);
        localStorage.setItem("dmc_username", res.user.username);

        initMainGame();
    } catch (e) {
        hideLoading();
        console.error('Register error:', e);
        if (errEl) errEl.innerText = 'Lỗi kết nối máy chủ: ' + (e.message || '');
    }
}

function doLogout() {
    sound.play('click');
    localStorage.removeItem("dmc_aid");
    localStorage.removeItem("dmc_username");
    GameState.user = null;
    GameState.playerData = null;
    closeSettingsModal();
    switchScreen('screen-login');
}

// ================= SETTINGS & ADMIN PIN (6996) =================
function openSettingsModal() {
    sound.play('click');
    const userLabel = document.getElementById('settings-current-user');
    if (userLabel) {
        userLabel.innerText = (GameState.user && GameState.user.username)
            ? GameState.user.username
            : (localStorage.getItem('dmc_username') || 'Chưa đăng nhập');
    }
    const pinErr = document.getElementById('pin-error-msg');
    if (pinErr) pinErr.innerText = '';
    const pinInput = document.getElementById('admin-pin-input');
    if (pinInput) pinInput.value = '';
    document.getElementById('settings-modal').classList.add('active');
}

function closeSettingsModal() {
    sound.play('click');
    document.getElementById('settings-modal').classList.remove('active');
}

function verifyAdminPin() {
    const pinInput = document.getElementById('admin-pin-input');
    const errEl = document.getElementById('pin-error-msg');
    const val = (pinInput ? pinInput.value : '').trim();

    if (val === '6996') {
        sound.play('renxong');
        if (pinInput) pinInput.value = '';
        if (errEl) errEl.innerText = '';
        closeSettingsModal();
        openAdminModal();
    } else {
        sound.play('chet_m');
        if (errEl) {
            errEl.style.color = '#f87171';
            errEl.innerText = '❌ Mã PIN Admin không chính xác!';
        }
    }
}

function toggleSound() {
    sound.enabled = !sound.enabled;
    const btn = document.getElementById('btn-toggle-sound');
    if (btn) {
        btn.classList.toggle('off', !sound.enabled);
        btn.innerText = sound.enabled ? 'BẬT' : 'TẮT';
    }
}

let isMusicPlaying = false;
function toggleMusic() {
    isMusicPlaying = !isMusicPlaying;
    const btn = document.getElementById('btn-toggle-music');
    if (btn) {
        btn.classList.toggle('off', !isMusicPlaying);
        btn.innerText = isMusicPlaying ? 'BẬT' : 'TẮT';
    }
}

function initMainGame() {
    updateHeader();
    switchScreen('screen-main');
    switchTab('home');
}

// ================= LOADING SPINNER =================
function showLoading(text = 'Đang tải dữ liệu võ lâm...') {
    const el = document.getElementById('loading-overlay');
    if (el) {
        document.getElementById('loading-text').innerText = text;
        el.classList.add('active');
    }
}

function hideLoading() {
    const el = document.getElementById('loading-overlay');
    if (el) el.classList.remove('active');
}

// ================= PAYMENT / BẢO KHỐ MODAL (dialog_payment.xml) =================
let selectedPaymentType = 'Viettel';
let selectedPaymentAmount = 50000;

function openPaymentModal() {
    sound.play('click');
    const msg = document.getElementById('pay-result-msg');
    if (msg) msg.innerText = '';
    document.getElementById('payment-modal').classList.add('active');
}

function closePaymentModal() {
    sound.play('click');
    document.getElementById('payment-modal').classList.remove('active');
}

function selectCardType(elem, type) {
    sound.play('click');
    selectedPaymentType = type;
    document.querySelectorAll('.card-type-btn').forEach(b => b.classList.remove('active'));
    if (elem) elem.classList.add('active');
}

function selectAmount(amount, elem) {
    sound.play('click');
    selectedPaymentAmount = amount;
    document.querySelectorAll('.btn-amount').forEach(b => b.classList.remove('active'));
    if (elem) elem.classList.add('active');
}

async function submitRecharge() {
    sound.play('click');
    showLoading('Đang kết nối bảo khố...');
    const serial = document.getElementById('pay-serial').value.trim();
    const pin = document.getElementById('pay-pin').value.trim();

    try {
        const res = await apiPost('recharge', {
            aid: getEffectiveAid(),
            amount: selectedPaymentAmount,
            cardType: selectedPaymentType,
            cardSerial: serial
        });

        hideLoading();
        if (res.success) {
            sound.play('renxong');
            GameState.playerData = res.playerData;
            updateHeader();
            const msg = document.getElementById('pay-result-msg');
            msg.style.color = '#86efac';
            msg.innerText = res.message;
        } else {
            sound.play('chet_m');
            const msg = document.getElementById('pay-result-msg');
            msg.style.color = '#f87171';
            msg.innerText = res.error || 'Nạp thẻ thất bại!';
        }
    } catch (e) {
        hideLoading();
        const msg = document.getElementById('pay-result-msg');
        msg.style.color = '#f87171';
        msg.innerText = 'Lỗi kết nối máy chủ!';
    }
}

// ================= GUIDE / BÍ TỊCH MODAL (assets/welcome.html) =================
function openGuideModal() {
    sound.play('click');
    document.getElementById('guide-modal').classList.add('active');
}

function closeGuideModal() {
    sound.play('click');
    document.getElementById('guide-modal').classList.remove('active');
}

// ================= BỒI DƯỠNG ĐỆ TỬ LOGIC (img_35.jpg) =================
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
        msg.innerText = 'Lỗi kết nối máy chủ!';
    }
}

// ================= FORMATION SUB-TABS (BÁT QUÁI VS THẤT TINH) =================
function switchFormationSubTab(sub) {
    sound.play('click');
    document.getElementById('subtab-btn-batquai').classList.toggle('active', sub === 'batquai');
    document.getElementById('subtab-btn-thattinh').classList.toggle('active', sub === 'thattinh');
    document.getElementById('subtab-view-batquai').style.display = sub === 'batquai' ? 'block' : 'none';
    document.getElementById('subtab-view-thattinh').style.display = sub === 'thattinh' ? 'block' : 'none';

    if (sub === 'thattinh') {
        renderThatTinh();
    }
}

function renderThatTinh() {
    const grid = document.getElementById('thattinh-slots-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const starNames = ['Thiên Xu', 'Thiên Tuyền', 'Thiên Cơ', 'Thiên Quyền', 'Ngọc Hoành', 'Khai Dương', 'Dao Quang'];
    starNames.forEach((star, idx) => {
        const slot = document.createElement('div');
        slot.style.cssText = "background: rgba(30, 20, 15, 0.9); border: 1.5px solid #ca8a04; border-radius: 6px; padding: 8px 4px; text-align: center;";
        slot.innerHTML = `
            <div style="font-size: 11px; color: #ffd700; font-weight: 900;">${star}</div>
            <img src="/assets/ui/chan_khi_0${idx + 1}.png" style="width: 36px; height: 36px; object-fit: contain; margin: 4px auto;" onerror="this.src='/assets/ui/chan_khi_01.png'">
            <div style="font-size: 9px; color: #86efac;">+5% Thuộc Tính</div>
        `;
        grid.appendChild(slot);
    });
}

// ================= HOA SƠN LUẬN KIẾM PvP (img_05, img_24, img_27) =================
async function renderLuankiem() {
    showLoading('Đang tải bảng vàng Luận Kiếm...');
    try {
        const res = await apiPost('get_luankiem', { aid: getEffectiveAid() });
        hideLoading();

        if (!res.success) return;

        document.getElementById('lk-user-rank').innerText = res.userRank;
        document.getElementById('lk-remaining-fights').innerText = res.remainingFights;
        document.getElementById('lk-user-points').innerText = Number(res.userPoints).toLocaleString('vi-VN');

        const container = document.getElementById('luankiem-ranking-list');
        container.innerHTML = '';

        res.rankings.forEach(item => {
            const row = document.createElement('div');
            row.className = 'luankiem-rank-item';
            const topCls = item.rank === 1 ? 'top1' : item.rank === 2 ? 'top2' : item.rank === 3 ? 'top3' : '';
            row.innerHTML = `
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span class="rank-badge-num ${topCls}">${item.rank}</span>
                    <img src="${getAvatarUrl(item.leader)}" style="width: 36px; height: 36px; border-radius: 50%; border: 1.5px solid #ffd700; object-fit: cover;" onerror="this.src='/assets/res/avatar_default.png'">
                    <div>
                        <div style="font-size: 12px; font-weight: 900; color: #fef08a;">${item.name}</div>
                        <div style="font-size: 10px; color: #a8a29e;">Lv.${item.level} | +${item.rewardBonus} Điểm/10p</div>
                    </div>
                </div>
                <button class="btn-wuxia-gold" style="width: 80px; height: 30px; font-size: 11px;" onclick="challengeTargetRank(${item.rank})">Khiêu Chiến</button>
            `;
            container.appendChild(row);
        });
    } catch (e) {
        hideLoading();
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
}

// ================= KỲ NGỘ ACTIVITIES (ĂN GÀ & KHO BÁU - img_04, img_18, img_22) =================
async function doEatChicken() {
    sound.play('click');
    showLoading('Đang nhận Thể Lực...');

    try {
        const res = await apiPost('eat_chicken', { aid: getEffectiveAid() });
        hideLoading();
        if (res.success) {
            sound.play('renxong');
            GameState.playerData = res.playerData;
            updateHeader();
            alert(res.message);
        } else {
            alert(res.error || 'Ăn gà thất bại!');
        }
    } catch (e) {
        hideLoading();
    }
}

async function doOpenTreasure() {
    sound.play('click');
    showLoading('Đang mở rương kho báu...');

    try {
        const res = await apiPost('open_treasure', { aid: getEffectiveAid() });
        hideLoading();
        if (res.success) {
            sound.play('renxong');
            GameState.playerData = res.playerData;
            updateHeader();
            alert(`🎉 CHÚC MỪNG CHƯỞNG MÔN ĐÃ MỞ KHO BÁU THÀNH CÔNG!\n\n` +
                res.rewards.map(r => `• ${r.name}: x${r.qty}`).join('\n')
            );
            renderCurrentTab();
        } else {
            alert(res.error || 'Mở rương thất bại!');
        }
    } catch (e) {
        hideLoading();
    }
}

// ================= TÚI ĐỒ VẬT PHẨM (img_02, img_21, img_33) =================
let currentBagCategory = 'all';

function switchItemCategory(cat, btnEl) {
    sound.play('click');
    currentBagCategory = cat;
    document.querySelectorAll('.item-cat-btn').forEach(b => b.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');
    renderItems();
}

function renderItems() {
    const container = document.getElementById('items-container');
    if (!container) return;
    container.innerHTML = '';

    const items = GameState.playerData.VatPhamTieuThu || [];
    
    // Default authentic items if empty
    const displayList = [
        { name: 'VP_BachNienSam', title: 'Bách Niên Sâm', desc: 'Thần dược trăm năm tăng cường khí huyết đệ tử không hao tổn tiềm lực', qty: 7923441, icon: 'icon_PhongBao.png', cat: 'duocpham' },
        { name: 'VP_GaQuay', title: 'Gà Quay', desc: 'Hồi phục 15 sinh lực thể lực hành hiệp', qty: 75963, icon: 'VP_GaQuay_to.png', cat: 'duocpham' },
        { name: 'VP_RuouNuNhiHong', title: 'Rượu Nữ Nhi Hồng', desc: 'Hồi phục 15 khí lực khiêu chiến luận kiếm', qty: 12540, icon: 'VP_RuouTrangNguyenHong_to.png', cat: 'duocpham' },
        { name: 'VP_BoiDuongDan', title: 'Bồi Dưỡng Đan', desc: 'Dược đan kích thích tiềm lực 4 thuộc tính đệ tử', qty: 5121196, icon: 'icon_BaoKich.png', cat: 'duocpham' },
        { name: 'VK_DoLongDao', title: 'Đồ Long Đao [Giáp]', desc: 'Thần binh cái thế chí tôn trong võ lâm', qty: 1, icon: 'VK_DoLongDao_trang_bi_to.png', cat: 'trangbi' },
        { name: 'AG_CamVeHoangKimGiap', title: 'Cẩm Vệ Hoàng Kim Giáp [Giáp]', desc: 'Hoàng kim bảo giáp phòng ngự siêu việt', qty: 1, icon: 'AG_CamVeHoangKimGiap_trang_bi_to.png', cat: 'trangbi' },
        { name: 'VC_DocCoCuuKiem', title: 'Độc Cô Cửu Kiếm [Giáp]', desc: 'Tuyệt kỹ kiếm pháp vô chiêu thắng hữu chiêu', qty: 1, icon: 'VC_DocCoCuuKiem_vo_cong_to.png', cat: 'vocong' },
        { name: 'VC_QuyHoaBaoDien', title: 'Quỳ Hoa Bảo Điển [Giáp]', desc: 'Bảo điển võ học thần bí uy chấn thiên hạ', qty: 1, icon: 'VC_QuyHoaBaoDien_vo_cong_to.png', cat: 'vocong' }
    ];

    const filtered = displayList.filter(it => currentBagCategory === 'all' || it.cat === currentBagCategory);

    filtered.forEach(it => {
        const card = document.createElement('div');
        card.style.cssText = "background: rgba(28, 18, 13, 0.9); border: 1px solid #5a3c22; border-radius: 6px; padding: 10px; display: flex; align-items: center; gap: 10px;";
        const iconSrc = it.icon.startsWith('icon_') ? `/assets/ui/${it.icon}` : `/assets/images/${it.icon}`;

        card.innerHTML = `
            <img src="${iconSrc}" style="width: 44px; height: 44px; object-fit: contain; background: #000; border-radius: 4px; border: 1px solid #73502b;" onerror="this.src='/assets/res/avatar_default.png'"/>
            <div style="flex: 1;">
                <h4 style="font-size: 12px; color: #fffae6;">${it.title} <span style="color: #ffd700; font-size: 11px;">(x${Number(it.qty).toLocaleString('vi-VN')})</span></h4>
                <p style="font-size: 10px; color: #a8917e; line-height: 1.3;">${it.desc}</p>
            </div>
            <button class="btn-wuxia-gold" style="width: 65px; height: 28px; font-size: 10px;" onclick="useItem('${it.name}')">Dùng</button>
        `;
        container.appendChild(card);
    });
}

// ================= WORLD CHAT TICKER (img_13.jpg) =================
function initWorldChatTicker() {
    const chatEl = document.getElementById('world-chat-text');
    if (!chatEl) return;

    const messages = [
        "S178.Gấu Đại Vương: Mới kiếm được 50k KNB vượt map Hắc Mộc Nhai anh em ơi!",
        "ChelseaWl: Vừa phiêu bạt giang hồ đánh bại Quách Tĩnh và Hoàng Dung!",
        "Vladimir Putin: Chúc mừng chưởng môn đã mở kho báu nhận được 75 tàn hồn Đông Phương!",
        "S19.Tà Vương: Đã chiếm lĩnh Hạng 1 Hoa Sơn Luận Kiếm!",
        "My-kaka: Đánh bại toàn bộ cao thủ ma giáo tại Linh Thứu Cung!",
        "Thất Tinh Kiếm Khách: Ai solo Bát Quái Trận Hình lôi đài không?"
    ];

    let idx = 0;
    setInterval(() => {
        idx = (idx + 1) % messages.length;
        chatEl.innerText = messages[idx];
    }, 6000);
}

// ================= EXPANDED INGAME CONTROLLERS (img_17, 19, 20, 21, 23, 25, 26, 28, 33, 34, 36) =================

// 1. HUYẾT CHIẾN HẮC MỘC NHAI
async function openHuyetChienModal() {
    sound.play('click');
    document.getElementById('huyetchien-modal').classList.add('active');
    await loadHuyetChien();
}

function closeHuyetChienModal() {
    sound.play('click');
    document.getElementById('huyetchien-modal').classList.remove('active');
}

async function loadHuyetChien() {
    try {
        const res = await apiPost('huyetchien_get_state', { aid: getEffectiveAid() });
        if (!res.success) return;
        const st = res.state;
        document.getElementById('hc-stage-num').innerText = `Ải ${st.currentStage || 1}`;
        document.getElementById('hc-stars-num').innerText = st.stars || 0;
        document.getElementById('hc-buff-atk').innerText = `⚔️ Công: +${st.buffAtk || 0}%`;
        document.getElementById('hc-buff-def').innerText = `🛡️ Thủ: +${st.buffDef || 0}%`;
        document.getElementById('hc-buff-hp').innerText = `❤️ Máu: +${st.buffHp || 0}%`;

        const listEl = document.getElementById('hc-opponents-list');
        listEl.innerHTML = '';
        (res.opponents || []).forEach(op => {
            const card = document.createElement('div');
            card.className = 'hc-opponent-card';
            card.onclick = () => fightHuyetChien(op.diff);
            card.innerHTML = `
                <div class="hc-opponent-left">
                    <img class="hc-opponent-avatar" src="${getAvatarUrl(op.avatar)}" onerror="this.src='/assets/res/avatar_default.png'"/>
                    <div>
                        <b style="color: #ffd700; font-size: 12px;">${op.name}</b>
                        <small style="display: block; color: #a8a29e;">Cấp ${op.level} | Chiến lực: ${op.power.toLocaleString()}</small>
                    </div>
                </div>
                <button class="btn-wuxia-gold" style="width: 80px; height: 32px; font-size: 11px;">Khiêu Chiến (${op.stars}⭐)</button>
            `;
            listEl.appendChild(card);
        });
    } catch (e) {
        console.error(e);
    }
}

async function fightHuyetChien(diff) {
    sound.play('click');
    showLoading('Đang tiến vào Huyết Chiến Hắc Mộc Nhai...');
    try {
        const res = await apiPost('huyetchien_fight', { aid: getEffectiveAid(), diff });
        hideLoading();
        if (res.success) {
            GameState.playerData = res.playerData;
            updateHeader();
            closeHuyetChienModal();
            playBattleAnimation(res.battleResult);
        } else {
            alert(res.error || 'Thao tác thất bại!');
        }
    } catch (e) {
        hideLoading();
        alert('Lỗi kết nối máy chủ!');
    }
}

async function buyHuyetChienBuff(buffType) {
    sound.play('click');
    try {
        const res = await apiPost('huyetchien_buff', { aid: getEffectiveAid(), buffType });
        const msgEl = document.getElementById('hc-result-msg');
        if (res.success) {
            sound.play('renxong');
            msgEl.style.color = '#86efac';
            msgEl.innerText = res.message;
            await loadHuyetChien();
        } else {
            sound.play('chet_m');
            msgEl.style.color = '#f87171';
            msgEl.innerText = res.error;
        }
    } catch (e) {
        console.error(e);
    }
}

// 2. ĐẢ THÔNG KINH MẠCH & CHÂN KHÍ
async function openKinhMachModal() {
    sound.play('click');
    document.getElementById('kinhmach-modal').classList.add('active');
    loadKinhMach();
}

function closeKinhMachModal() {
    sound.play('click');
    document.getElementById('kinhmach-modal').classList.remove('active');
}

function loadKinhMach() {
    const hero = GameState.playerData.NhanVat[GameState.selectedDiscipleIdx] || GameState.playerData.NhanVat[0];
    if (!hero) return;

    document.getElementById('km-hero-avatar').src = getAvatarUrl(hero.Code || hero.name);
    document.getElementById('km-hero-name').innerText = hero.displayName || hero.name;

    const pointNames = ['Đốc Mạch', 'Nhâm Mạch', 'Xung Mạch', 'Đới Mạch', 'Âm Duy', 'Dương Duy', 'Âm Kiều', 'Dương Kiều'];
    const grid = document.getElementById('km-acupoints-grid');
    grid.innerHTML = '';

    const kmData = hero.kinhMach || [0, 0, 0, 0, 0, 0, 0, 0];
    pointNames.forEach((name, idx) => {
        const item = document.createElement('div');
        item.className = 'km-acupoint-item';
        item.onclick = () => upgradeKinhMachPoint(idx + 1);
        item.innerHTML = `
            <div class="km-point-name">${name}</div>
            <div class="km-point-lvl">Tầng ${kmData[idx] || 0}</div>
            <small style="font-size: 9px; color: #fbbf24;">(Châm)</small>
        `;
        grid.appendChild(item);
    });

    const orbCount = (hero.chanKhiList || []).length;
    document.getElementById('km-orb-count').innerText = `${orbCount}/8 Ô`;
}

async function upgradeKinhMachPoint(pointIdx) {
    sound.play('click');
    const hero = GameState.playerData.NhanVat[GameState.selectedDiscipleIdx] || GameState.playerData.NhanVat[0];
    try {
        const res = await apiPost('kinhmach_upgrade', {
            aid: getEffectiveAid(),
            discipleId: hero.id || hero.Id,
            pointIdx
        });
        const msgEl = document.getElementById('km-result-msg');
        if (res.success) {
            sound.play('renxong');
            GameState.playerData = res.playerData;
            msgEl.style.color = '#86efac';
            msgEl.innerText = res.message;
            loadKinhMach();
            renderDiscipleScroll();
        } else {
            sound.play('chet_m');
            msgEl.style.color = '#f87171';
            msgEl.innerText = res.error;
        }
    } catch (e) {
        console.error(e);
    }
}

async function equipChanKhiOrb(orbName) {
    sound.play('click');
    const hero = GameState.playerData.NhanVat[GameState.selectedDiscipleIdx] || GameState.playerData.NhanVat[0];
    try {
        const res = await apiPost('chankhi_equip', {
            aid: getEffectiveAid(),
            discipleId: hero.id || hero.Id,
            orbName
        });
        const msgEl = document.getElementById('km-result-msg');
        if (res.success) {
            sound.play('renxong');
            GameState.playerData = res.playerData;
            msgEl.style.color = '#86efac';
            msgEl.innerText = res.message;
            loadKinhMach();
            renderDiscipleScroll();
        } else {
            sound.play('chet_m');
            msgEl.style.color = '#f87171';
            msgEl.innerText = res.error;
        }
    } catch (e) {
        console.error(e);
    }
}

// 3. TRUYỀN CÔNG ĐỆ TỬ
function openTruyenCongModal() {
    sound.play('click');
    document.getElementById('truyencong-modal').classList.add('active');
    loadTruyenCongSelects();
}

function closeTruyenCongModal() {
    sound.play('click');
    document.getElementById('truyencong-modal').classList.remove('active');
}

function loadTruyenCongSelects() {
    const srcSel = document.getElementById('tc-source-select');
    const tgtSel = document.getElementById('tc-target-select');
    srcSel.innerHTML = '';
    tgtSel.innerHTML = '';

    const list = GameState.playerData.NhanVat || [];
    list.forEach((nv, idx) => {
        const name = nv.displayName || nv.name;
        const opt1 = new Option(`${name} (Lv.${nv.level})`, nv.id || nv.Id);
        const opt2 = new Option(`${name} (Lv.${nv.level})`, nv.id || nv.Id);
        srcSel.add(opt1);
        tgtSel.add(opt2);
    });

    if (tgtSel.options.length > 1) tgtSel.selectedIndex = 1;
}

async function submitTruyenCong() {
    sound.play('click');
    const sourceId = document.getElementById('tc-source-select').value;
    const targetId = document.getElementById('tc-target-select').value;
    const medRadio = document.querySelector('input[name="tc-medicine"]:checked');
    const itemType = medRadio ? medRadio.value : 'tien_duoc';

    showLoading('Đang truyền công lực...');
    try {
        const res = await apiPost('truyencong', {
            aid: getEffectiveAid(),
            sourceId,
            targetId,
            itemType
        });
        hideLoading();
        const msgEl = document.getElementById('tc-result-msg');
        if (res.success) {
            sound.play('renxong');
            GameState.playerData = res.playerData;
            msgEl.style.color = '#86efac';
            msgEl.innerText = res.message;
            renderDiscipleScroll();
            loadTruyenCongSelects();
        } else {
            sound.play('chet_m');
            msgEl.style.color = '#f87171';
            msgEl.innerText = res.error;
        }
    } catch (e) {
        hideLoading();
        alert('Lỗi kết nối máy chủ!');
    }
}

// 4. TẨY DUYÊN PHẬN
function openTayDuyenModal() {
    sound.play('click');
    document.getElementById('tayduyen-modal').classList.add('active');
    const hero = GameState.playerData.NhanVat[GameState.selectedDiscipleIdx] || GameState.playerData.NhanVat[0];
    if (hero) {
        document.getElementById('td-hero-avatar').src = getAvatarUrl(hero.Code || hero.name);
        document.getElementById('td-hero-name').innerText = hero.displayName || hero.name;
        document.getElementById('td-current-bond').innerText = hero.customBond || 'Ma giáo lãnh tụ (+35% Công)';
    }
}

function closeTayDuyenModal() {
    sound.play('click');
    document.getElementById('tayduyen-modal').classList.remove('active');
}

async function submitTayDuyen() {
    sound.play('click');
    const hero = GameState.playerData.NhanVat[GameState.selectedDiscipleIdx] || GameState.playerData.NhanVat[0];
    try {
        const res = await apiPost('tayduyen', {
            aid: getEffectiveAid(),
            discipleId: hero.id || hero.Id
        });
        const msgEl = document.getElementById('td-result-msg');
        if (res.success) {
            sound.play('renxong');
            GameState.playerData = res.playerData;
            msgEl.style.color = '#86efac';
            msgEl.innerText = res.message;
            document.getElementById('td-current-bond').innerText = res.disciple.customBond;
            renderDiscipleScroll();
        } else {
            sound.play('chet_m');
            msgEl.style.color = '#f87171';
            msgEl.innerText = res.error;
        }
    } catch (e) {
        console.error(e);
    }
}

// 5. BẾ QUAN TU LUYỆN
function openBeQuanModal() {
    sound.play('click');
    document.getElementById('bequan-modal').classList.add('active');
    const isBeQuan = GameState.playerData.GiaTriThoiGian && GameState.playerData.GiaTriThoiGian.NhanVatBeQuanID > 0;
    document.getElementById('bequan-status-text').innerText = isBeQuan
        ? 'Đệ tử đang bế quan tĩnh tâm trong thạch thất!'
        : 'Thạch thất đang trống, sẵn sàng tiếp nhận đệ tử bế quan!';
}

function closeBeQuanModal() {
    sound.play('click');
    document.getElementById('bequan-modal').classList.remove('active');
}

async function submitBeQuan(action) {
    sound.play('click');
    const hero = GameState.playerData.NhanVat[GameState.selectedDiscipleIdx] || GameState.playerData.NhanVat[0];
    try {
        const res = await apiPost('bequan_action', {
            aid: getEffectiveAid(),
            discipleId: hero.id || hero.Id,
            action
        });
        const msgEl = document.getElementById('bq-result-msg');
        if (res.success) {
            sound.play('renxong');
            GameState.playerData = res.playerData;
            msgEl.style.color = '#86efac';
            msgEl.innerText = res.message;
            openBeQuanModal();
            renderDiscipleScroll();
        } else {
            sound.play('chet_m');
            msgEl.style.color = '#f87171';
            msgEl.innerText = res.error;
        }
    } catch (e) {
        console.error(e);
    }
}

// 6. LIÊN MINH BANG HỘI
async function openLienMinhModal() {
    sound.play('click');
    document.getElementById('lienminh-modal').classList.add('active');
    try {
        const res = await apiPost('lienminh_action', { aid: getEffectiveAid(), action: 'get' });
        if (res.success) {
            const lm = res.lienMinh;
            document.getElementById('lm-name').innerText = lm.name;
            document.getElementById('lm-leader').innerText = lm.leader;
            document.getElementById('lm-level').innerText = `Cấp ${lm.level}`;
            document.getElementById('lm-my-contrib').innerText = `${lm.myContribution} Điểm`;
            document.getElementById('lm-members').innerText = lm.memberCount;
            document.getElementById('lm-buff').innerText = lm.buffDesc;
        }
    } catch (e) {
        console.error(e);
    }
}

function closeLienMinhModal() {
    sound.play('click');
    document.getElementById('lienminh-modal').classList.remove('active');
}

async function submitLienMinhCongHien() {
    sound.play('click');
    try {
        const res = await apiPost('lienminh_action', { aid: getEffectiveAid(), action: 'conghien' });
        const msgEl = document.getElementById('lm-result-msg');
        if (res.success) {
            sound.play('renxong');
            GameState.playerData = res.playerData;
            updateHeader();
            msgEl.style.color = '#86efac';
            msgEl.innerText = res.message;
            await openLienMinhModal();
        } else {
            sound.play('chet_m');
            msgEl.style.color = '#f87171';
            msgEl.innerText = res.error;
        }
    } catch (e) {
        console.error(e);
    }
}

// 7. THIÊN HẠ VÔ SONG (TOP SERVER - img_26)
async function openTopServerModal() {
    sound.play('click');
    document.getElementById('topserver-modal').classList.add('active');
    try {
        const res = await apiPost('get_server_rankings', {});
        if (!res.success) return;
        const listEl = document.getElementById('topserver-list');
        listEl.innerHTML = '';
        res.topPlayers.forEach(p => {
            const item = document.createElement('div');
            item.className = 'topserver-item';
            item.innerHTML = `
                <div style="display: flex; align-items: center;">
                    <div class="topserver-rank-badge">${p.rank}</div>
                    <div>
                        <b style="color: #ffd700; font-size: 12px;">${p.name}</b>
                        <small style="display: block; color: #a8a29e;">${p.title} | Lv.${p.level}</small>
                    </div>
                </div>
                <div style="text-align: right;">
                    <span style="color: #f87171; font-size: 11px; font-weight: bold;">❤️ ${(p.hp).toLocaleString('vi-VN')}</span>
                    <small style="display: block; color: #86efac; font-size: 9px;">Võ Công Giáp</small>
                </div>
            `;
            listEl.appendChild(item);
        });
    } catch (e) {
        console.error(e);
    }
}

function closeTopServerModal() {
    sound.play('click');
    document.getElementById('topserver-modal').classList.remove('active');
}

// 8. NHẬP GIFTCODE (img_19)
function openGiftcodeModal() {
    sound.play('click');
    document.getElementById('giftcode-modal').classList.add('active');
}

function closeGiftcodeModal() {
    sound.play('click');
    document.getElementById('giftcode-modal').classList.remove('active');
}

async function submitGiftcode() {
    sound.play('click');
    const code = document.getElementById('giftcode-input').value.trim();
    if (!code) return;

    try {
        const res = await apiPost('giftcode_redeem', { aid: getEffectiveAid(), code });
        const msgEl = document.getElementById('gc-result-msg');
        if (res.success) {
            sound.play('renxong');
            GameState.playerData = res.playerData;
            updateHeader();
            msgEl.style.color = '#86efac';
            msgEl.innerText = res.message;
        } else {
            sound.play('chet_m');
            msgEl.style.color = '#f87171';
            msgEl.innerText = res.error;
        }
    } catch (e) {
        console.error(e);
    }
}

// 9. ĐUA TOP SERVER MỚI (img_17, img_34)
function openDuaTopModal() {
    sound.play('click');
    document.getElementById('duatop-modal').classList.add('active');
}

function closeDuaTopModal() {
    sound.play('click');
    document.getElementById('duatop-modal').classList.remove('active');
}


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


// ================= AUTHENTIC HOME HELPERS =================
function renderHomeCloudDisciples() {
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
}

function openDiscipleDetailModal(code) {
    sound.play('click');
    const modal = document.getElementById('disciple-detail-modal');
    if (!modal) return;
    if (code && GameState.playerData && GameState.playerData.NhanVat) {
        const found = GameState.playerData.NhanVat.find(d => (d.name || d.Code) === code);
        if (found) GameState.selectedDiscipleId = found.id || found.Id;
    }
    renderScrollPainting();
    modal.classList.add('active');
}

function closeDiscipleDetailModal() {
    sound.play('click');
    const modal = document.getElementById('disciple-detail-modal');
    if (modal) modal.classList.remove('active');
}

function openLongChauModal() {
    sound.play('click');
    const modal = document.getElementById('longchau-modal');
    if (modal) modal.classList.add('active');
}
function closeLongChauModal() {
    sound.play('click');
    const modal = document.getElementById('longchau-modal');
    if (modal) modal.classList.remove('active');
}

function openLienServerModal() {
    sound.play('click');
    const modal = document.getElementById('lienserver-modal');
    if (modal) modal.classList.add('active');
}
function closeLienServerModal() {
    sound.play('click');
    const modal = document.getElementById('lienserver-modal');
    if (modal) modal.classList.remove('active');
}

function openAmKhiModal() {
    sound.play('click');
    const modal = document.getElementById('amkhi-modal');
    if (modal) modal.classList.add('active');
}
function closeAmKhiModal() {
    sound.play('click');
    const modal = document.getElementById('amkhi-modal');
    if (modal) modal.classList.remove('active');
}

function openMailModal() {
    sound.play('click');
    const modal = document.getElementById('mail-modal');
    if (modal) modal.classList.add('active');
}
function closeMailModal() {
    sound.play('click');
    const modal = document.getElementById('mail-modal');
    if (modal) modal.classList.remove('active');
}

function openAnOanModal() {
    sound.play('click');
    const modal = document.getElementById('an-oan-modal');
    if (modal) modal.classList.add('active');
}
function closeAnOanModal() {
    sound.play('click');
    const modal = document.getElementById('an-oan-modal');
    if (modal) modal.classList.remove('active');
}

function openChatModal() {
    sound.play('click');
    const modal = document.getElementById('chat-modal');
    if (modal) modal.classList.add('active');
}
function closeChatModal() {
    sound.play('click');
    const modal = document.getElementById('chat-modal');
    if (modal) modal.classList.remove('active');
}

// Init Game on Load
window.addEventListener('DOMContentLoaded', async () => {
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
});
