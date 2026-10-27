
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
    document.querySelectorAll('.bottom-tab-auth-btn, .tab-btn-auth, .nav-perf-hotspot').forEach(btn => {
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
            switchLuyencongSubTab('luyendieu');
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
    let current = null;
    if (GameState.selectedDiscipleCode) {
        current = {
            name: GameState.selectedDiscipleCode,
            level: 495,
            mau: 3542428,
            cong: 194374,
            thu: 6362385,
            noicong: 787139464,
            CaiTao: 0,
            exp: 27256563248,
            expMax: 154269351936,
            giaTri: 11995335,
            skillLvl: 41
        };
    } else if (GameState.playerData && GameState.playerData.NhanVat) {
        const disciples = GameState.playerData.NhanVat;
        current = disciples.find(d => (d.id || d.Id) === (GameState.selectedDiscipleId || GameState.selectedFormationDiscipleId)) || disciples[0];
    }
    if (!current) {
        current = {
            name: 'NV_HuongHuongCongChua',
            level: 495,
            mau: 3542428,
            cong: 194374,
            thu: 6362385,
            noicong: 787139464,
            CaiTao: 0,
            exp: 27256563248,
            expMax: 154269351936,
            giaTri: 11995335,
            skillLvl: 41
        };
    }

    const code = current.name || current.Code || 'NV_HuongHuongCongChua';
    const cfg = getDiscipleCfg(code);
    const tier = getTierInfo(cfg.Hang || 1);

    // 1. Portrait image
    const portraitEl = document.getElementById('hero-detail-portrait');
    if (portraitEl) {
        portraitEl.src = getAvatarUrl(code);
        portraitEl.onerror = () => { portraitEl.src = '/assets/images/NV_HuongHuongCongChua_ava_to.png'; };
    }

    // 2. Calligraphy Name
    const nameEl = document.getElementById('hero-detail-calligraphy-name');
    if (nameEl) {
        nameEl.innerText = cfg.TenHienThi || code;
    }

    // 3. Quality Badge (KIM / GIAP)
    const badgeImg = document.getElementById('hero-detail-badge-img');
    if (badgeImg) {
        badgeImg.src = '/assets/ui/hero_info_authentic/badge_kim.png';
    }

    // 4. Level & Exp
    const caitaoEl = document.getElementById('hero-detail-caitao');
    if (caitaoEl) caitaoEl.innerText = '+' + (current.CaiTao || current.dotpha || 0);

    const lvlEl = document.getElementById('hero-detail-level');
    const curLevel = current.level || current.Level || 495;
    if (lvlEl) lvlEl.innerText = curLevel;

    const expEl = document.getElementById('hero-detail-exp');
    if (expEl) {
        const curExp = current.exp || 27256563248;
        const maxExp = current.expMax || 154269351936;
        expEl.innerText = curExp + '/' + maxExp;
    }

    // 5. 4 Core Stats
    const mauEl = document.getElementById('hero-stat-val-mau');
    if (mauEl) mauEl.innerText = (current.mau || current.MauCoSo || 3542428);

    const congEl = document.getElementById('hero-stat-val-cong');
    if (congEl) congEl.innerText = (current.cong || current.CongCoSo || 194374);

    const thuEl = document.getElementById('hero-stat-val-thu');
    if (thuEl) thuEl.innerText = (current.thu || current.ThuCoSo || 6362385);

    const noiEl = document.getElementById('hero-stat-val-noi');
    if (noiEl) noiEl.innerText = (current.noicong || current.NoiLucCoSo || 787139464);

    // 6. Bio & Breakthrough description
    const bioEl = document.getElementById('hero-detail-bio');
    if (bioEl) {
        if (code === 'NV_HuongHuongCongChua' || (cfg.TenHienThi && cfg.TenHienThi.includes('Hương Hương'))) {
            bioEl.innerText = 'Mỹ nữ người Hồi, sắc đẹp vạn người mê. Càng tấn công càng tăng tỷ lệ xuất chiêu, sức phòng ngự và nội lực (tính cả phản). Đột phá tầng 1 tăng thêm phòng ngự, tầng 2 gây ra sát thương chiêu bạo kích, tầng 5 tăng hộ thể.';
        } else {
            bioEl.innerText = (cfg.MoTa || 'Tuyệt đỉnh cao thủ danh chấn giang hồ.') + ' Càng tấn công càng tăng tỷ lệ xuất chiêu, sức phòng ngự và nội lực (tính cả phản). Đột phá tầng 1 tăng thêm phòng ngự, tầng 2 gây ra sát thương chiêu bạo kích, tầng 5 tăng hộ thể.';
        }
    }

    // 7. Võ công Skill
    const skillCard = document.getElementById('hero-detail-skill-card');
    const skillIcon = document.getElementById('hero-detail-skill-icon');
    const skillLvl = document.getElementById('hero-detail-skill-lvl');
    const skillCode = cfg.VoCongMacDinh || 'VC_DiepVuCuuThien';
    if (skillIcon) {
        if (code === 'NV_HuongHuongCongChua') {
            skillIcon.src = '/assets/ui/hero_info_authentic/skill_sample.png';
        } else {
            skillIcon.src = '/assets/images/' + skillCode + '_vo_cong_to.png';
            skillIcon.onerror = () => { skillIcon.src = '/assets/ui/hero_info_authentic/skill_sample.png'; };
        }
    }
    if (skillLvl) {
        skillLvl.innerText = current.skillLvl || 41;
    }
    if (skillCard) {
        skillCard.onclick = () => {
            sound.play('click');
            alert('Võ Công Thiên Phú: ' + (cfg.VoCongMacDinh || 'Điệp Vũ Cửu Thiên') + ' (Cấp ' + (current.skillLvl || 41) + ')\nUy lực cực mạnh, tăng tỷ lệ xuất chiêu và sát thương bạo kích.');
        };
    }

    // 8. Giá trị
    const valEl = document.getElementById('hero-detail-value-num');
    if (valEl) {
        valEl.innerText = current.giaTri || 11995335;
    }

    // 9. Duyên phận (Bonds)
    const duyenContainer = document.getElementById('hero-detail-duyenphan-list');
    if (duyenContainer) {
        duyenContainer.innerHTML = '';
        
        let bonds = [];
        if (code === 'NV_HuongHuongCongChua' || (cfg.TenHienThi && cfg.TenHienThi.includes('Hương Hương'))) {
            bonds = [
                { name: 'Khuynh Nước Khuynh Thành', req: 'Đệ Nhị Mộng', effect: '+200% máu', active: true, type: 'hero' },
                { name: 'Tịch Tà - Kiếp Vượng', req: 'Đại Tà Vương', effect: '+200% nội lực', active: false, type: 'equip' },
                { name: 'Hàm Hương Bảo Y', req: 'Hàm Hương Bảo Y', effect: '+220% thủ', active: false, type: 'equip' },
                { name: 'Hỏa Phụng Ngọc Bội', req: 'Hỏa Phụng ngọc bội', effect: '+220% thủ', active: false, type: 'equip' },
                { name: 'Truy Hồn Đoạt Mệnh', req: 'Hoa Vô Khuyết', effect: '+230% nội lực', active: false, type: 'hero' },
                { name: 'Mỹ Nhân Ẩn Hiện', req: 'Phong Tứ Nương', effect: '+230% nội lực', active: false, type: 'hero' }
            ];
        } else if (cfg.DuyenPhan && Array.isArray(cfg.DuyenPhan) && cfg.DuyenPhan.length > 0) {
            bonds = cfg.DuyenPhan.map((dp, idx) => {
                const partnerCode = (dp.DoiTuong && dp.DoiTuong[0]) ? dp.DoiTuong[0] : '';
                const partnerCfg = getDiscipleCfg(partnerCode);
                const reqName = partnerCfg.TenHienThi || partnerCode || 'Đồng đội';
                const isHero = dp.LoaiDuyenPhanStr === 'CungDoi';
                const statMap = { 'Mau': 'máu', 'Cong': 'công', 'Thu': 'thủ', 'NoiLuc': 'nội lực' };
                const statTxt = statMap[dp.LoaiPhuTroStr] || 'thuộc tính';
                return {
                    name: dp.TenHienThi || ('Duyên phận ' + (idx + 1)),
                    req: reqName,
                    effect: '+' + (dp.HeSo || 200) + '% ' + statTxt,
                    active: idx === 0,
                    type: isHero ? 'hero' : 'equip'
                };
            });
        } else {
            bonds = [
                { name: 'Khí Quán Trường Hồng', req: 'Trương Tam Phong', effect: '+200% nội lực', active: true, type: 'hero' },
                { name: 'Chính Tà Lưỡng Phân', req: 'Tạ Tốn', effect: '+180% công', active: false, type: 'hero' },
                { name: 'Ỷ Thiên Kiếm', req: 'Ỷ Thiên Kiếm', effect: '+220% công', active: false, type: 'equip' },
                { name: 'Bát Quái Bào', req: 'Thái Cực Bát Quái Bào', effect: '+210% thủ', active: false, type: 'equip' },
                { name: 'Thần Điêu Hiệp Lữ', req: 'Tiểu Long Nữ', effect: '+250% máu', active: false, type: 'hero' },
                { name: 'Thái Cực Hộ Thể', req: 'Thái Cực Quyền', effect: '+230% thủ', active: false, type: 'skill' }
            ];
        }

        bonds.forEach(b => {
            const item = document.createElement('div');
            item.className = 'duyen-item ' + (b.active ? 'active-bond' : 'inactive-bond');
            
            const reqHtml = b.active 
                ? '<b>' + b.req + '</b>' 
                : b.req;
            
            const condPrefix = (b.type === 'hero') ? 'Ra trận cùng ' : 'Trang bị ';
            
            item.innerHTML = '-' + b.name + ': ' + condPrefix + reqHtml + ' được <span class="duyen-buff-val">' + b.effect + '</span>';
            duyenContainer.appendChild(item);
        });
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

// 1. Formation Tab (100% AUTHENTIC DÀN TRẬN GUI MATCHING 4 ORIGINAL SCREENSHOTS)
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
    if (typeof switchDantranMode === 'function') {
        switchDantranMode(currentDantranMode || 'doihinh');
        return;
    }
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

// 3. Giang Ho Tab (100% AUTHENTIC GUI MATCHING ORIGINAL SCREENSHOT)
function selectGiangHoChapter(chIdx) {
    sound.play('click');
    const ghProg = (GameState.playerData && GameState.playerData.GiangHoProgress)
        ? GameState.playerData.GiangHoProgress
        : { maxChapterIdx: 0, maxMissionIdx: 0 };
    if (chIdx > ghProg.maxChapterIdx) {
        alert('🔒 Chương này chưa mở khóa! Hãy vượt qua tất cả các ải của chương trước.');
        return;
    }
    GameState.currentChapterIdx = chIdx;
    renderGiangHo();
}

function renderGiangHo() {
    if (!GameState.staticData || !GameState.staticData.giangHo) return;
    const chapters = GameState.staticData.giangHo;
    const ghProg = (GameState.playerData && GameState.playerData.GiangHoProgress)
        ? GameState.playerData.GiangHoProgress
        : { maxChapterIdx: 0, maxMissionIdx: 0, stars: {} };

    if (GameState.currentChapterIdx === undefined || GameState.currentChapterIdx === null) {
        GameState.currentChapterIdx = ghProg.maxChapterIdx || 0;
    }
    if (GameState.currentChapterIdx > ghProg.maxChapterIdx) {
        GameState.currentChapterIdx = ghProg.maxChapterIdx;
    }

    const currentChapter = chapters[GameState.currentChapterIdx] || chapters[0];

    // 1. Render Horizontal Paper Scroll Track of Chapter Plaques
    const track = document.getElementById('gh-chapter-track');
    if (track) {
        track.innerHTML = '';
        // Show chapters up to maxChapterIdx + 1 locked
        const maxVisible = Math.min(ghProg.maxChapterIdx + 2, chapters.length);
        for (let i = 0; i < maxVisible; i++) {
            const ch = chapters[i];
            const isUnlocked = i <= ghProg.maxChapterIdx;
            const isActive = i === GameState.currentChapterIdx;

            const plaque = document.createElement('div');
            plaque.className = `gh-plaque-btn ${isActive ? 'active' : (isUnlocked ? 'inactive' : 'locked')}`;
            plaque.title = ch.tenHienThi;
            plaque.innerText = isUnlocked ? ch.tenHienThi : `🔒 ${ch.tenHienThi}`;
            plaque.onclick = () => selectGiangHoChapter(i);

            track.appendChild(plaque);

            // Auto-scroll track to active plaque
            if (isActive) {
                setTimeout(() => {
                    plaque.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                }, 50);
            }
        }
    }

    // 2. Render Chapter Story Lore Box
    const storyEl = document.getElementById('gh-chapter-story');
    if (storyEl) {
        storyEl.innerText = currentChapter.moTa || 'Nội bộ Cái Bang xuất hiện rạn nứt, hãy lên đường dẹp loạn giang hồ!';
    }

    // 3. Render Mission Wooden Planks List
    const list = document.getElementById('gh-mission-list');
    if (!list) return;
    list.innerHTML = '';

    const missions = currentChapter.nhiemVuList || [];
    missions.forEach((m, idx) => {
        const isUnlocked = (GameState.currentChapterIdx < ghProg.maxChapterIdx) ||
                           (GameState.currentChapterIdx === ghProg.maxChapterIdx && idx <= ghProg.maxMissionIdx);
        const isCleared = (GameState.currentChapterIdx < ghProg.maxChapterIdx) ||
                          (GameState.currentChapterIdx === ghProg.maxChapterIdx && idx < ghProg.maxMissionIdx);

        const starKey = GameState.currentChapterIdx + '_' + idx;
        const stars = (ghProg.stars && ghProg.stars[starKey]) ? Number(ghProg.stars[starKey]) : (isCleared ? 3 : 0);

        // Avatar url: if NV_ use official hero avatar, else generic NPC
        let avaUrl = '/assets/images/NC_Generic_NhanSi.png';
        if (m.daiDienCode && m.daiDienCode.startsWith('NV_')) {
            avaUrl = `/assets/images/${m.daiDienCode}_ava_to.png`;
        }

        const plank = document.createElement('div');
        plank.className = 'gh-mission-plank';

        // Stars row HTML
        let starsHtml = '';
        if (stars > 0) {
            starsHtml = `<div class="gh-stars-row">` +
                '<img src="/assets/ui/icon_star.png" class="gh-star-img" alt="Star"/>'.repeat(stars) +
                `</div>`;
        } else {
            starsHtml = `<div class="gh-stars-row" style="opacity: 0.35;">` +
                '<img src="/assets/ui/icon_star.png" class="gh-star-img" alt="Star"/>' +
                `</div>`;
        }

        const btnHtml = isUnlocked
            ? `<button class="gh-btn-danh" onclick="startBattle(${GameState.currentChapterIdx}, ${idx})" title="Khiêu chiến ải ${idx + 1}">
                   ${starsHtml}
                   <span class="gh-btn-danh-text">Đánh</span>
               </button>`
            : `<button class="gh-btn-danh locked" disabled title="Ải chưa mở khóa">
                   <span class="gh-btn-danh-text" style="color: #94a3b8; font-size: 11px;">🔒 Khóa</span>
               </button>`;

        plank.innerHTML = `
            <div class="gh-mission-avatar-box">
                <img class="gh-mission-avatar-img" src="${avaUrl}" onerror="this.src='/assets/images/NC_Generic_NhanSi.png'" alt="Avatar"/>
            </div>
            <div class="gh-mission-info">
                <h4 class="gh-mission-title">Ải ${idx + 1}: ${m.tenHienThi}</h4>
                <p class="gh-mission-reward">Thưởng: +${m.expThuong || 10} Exp, +${m.bacThuong || 50} Bạc</p>
            </div>
            ${btnHtml}
        `;

        list.appendChild(plank);
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

// 5. Authentic Items Tab & Item Consumption
const VP_FALLBACK_META = {
    'VP_BaoRuong': {
        TenHienThi: 'Bảo rương',
        MoTa: 'Một chiếc rương thần bí xuất hiện trên Ngũ nhạc sơn, mở ra có thể nhận 1 trang bị Giáp cấp bất kỳ',
        Icon: 'VP_BaoRuong_to.png'
    },
    'VP_BitTat': {
        TenHienThi: 'Bít tất',
        MoTa: 'Món quà bí ẩn của 1 cao nhân áo đỏ leo ống khói, chứa nhiều phần quà bất ngờ',
        Icon: 'VP_BitTat_to.png'
    },
    'VP_BachNienSam': {
        TenHienThi: 'Bách niên sâm',
        MoTa: 'Thần dược trăm năm, có công dụng tăng cường khí huyết của đệ tử ( đệ tử không mất tiềm lực )',
        Icon: 'VP_BachNienSam_to.png'
    },
    'VP_BoHuyetDan': {
        TenHienThi: 'Bách niên sâm',
        MoTa: 'Thần dược trăm năm, có công dụng tăng cường khí huyết của đệ tử ( đệ tử không mất tiềm lực )',
        Icon: 'VP_BachNienSam_to.png'
    },
    'VP_GaQuay': {
        TenHienThi: 'Gà quay',
        MoTa: 'Hồi 8 sinh lực',
        Icon: 'VP_GaQuay_to.png'
    },
    'VP_RuouNuNhiHong': {
        TenHienThi: 'Nữ nhi hồng',
        MoTa: 'Rượu nấu bằng nhiều loại gạo khác nhau, men rượu bằng gạo hoặc lúa mạch, dùng để uống với cao nhân.',
        Icon: 'VP_BinhRuou_to.png'
    },
    'VP_BinhRuou': {
        TenHienThi: 'Nữ nhi hồng',
        MoTa: 'Rượu nấu bằng nhiều loại gạo khác nhau, men rượu bằng gạo hoặc lúa mạch, dùng để uống với cao nhân.',
        Icon: 'VP_BinhRuou_to.png'
    },
    'VP_BoiDuongDan': {
        TenHienThi: 'Bồi dưỡng đan',
        MoTa: 'Kích thích tiềm năng của đệ tử',
        Icon: 'VP_BoiDuongDan_to.png'
    }
};

function renderItems() {
    const container = document.getElementById('items-container');
    if (!container) return;
    container.innerHTML = '';

    const items = GameState.playerData.VatPhamTieuThu || [];
    if (!items.length) {
        container.innerHTML = '<div style="color: #eed9b5; text-align: center; padding: 40px 20px; font-size: 14px;">Túi đồ hiện không có vật phẩm nào.</div>';
        return;
    }

    const staticConsumables = (GameState.staticData && GameState.staticData.consumables) || {};

    items.forEach(it => {
        if (!it || it.quantity <= 0) return;
        const code = it.name;
        const staticItem = staticConsumables[code] || VP_FALLBACK_META[code] || {};
        const title = staticItem.TenHienThi || VP_FALLBACK_META[code]?.TenHienThi || code;
        const desc = staticItem.MoTa || VP_FALLBACK_META[code]?.MoTa || 'Vật phẩm quý hiếm trên giang hồ.';
        const iconFile = VP_FALLBACK_META[code]?.Icon || (code + '_to.png');

        const row = document.createElement('div');
        row.className = 'vp-item-row';
        row.innerHTML = `
            <div class="vp-item-frame">
                <img src="/assets/images/${iconFile}" class="vp-item-icon" alt="${title}" onerror="this.src='/assets/images/VP_BaoRuong_to.png'"/>
            </div>
            <div class="vp-item-info">
                <div class="vp-item-name">${title}</div>
                <div class="vp-item-desc">${desc}</div>
                <div class="vp-item-qty">Số lượng : ${Number(it.quantity).toLocaleString('vi-VN')}</div>
            </div>
            <div class="vp-item-actions">
                ${it.quantity >= 10 ? `<button class="vp-btn vp-btn-10" onclick="doUseItem('${code}', 10)" title="Dùng 10 lần"></button>` : ''}
                <button class="vp-btn vp-btn-use" onclick="doUseItem('${code}', 1)" title="Sử dụng"></button>
            </div>
        `;
        container.appendChild(row);
    });
}

async function doUseItem(itemCode, count = 1) {
    sound.play('click');
    const res = await apiPost('use_item', {
        aid: getEffectiveAid(),
        itemCode,
        count
    });
    if (!res || !res.success) {
        alert(res?.error || 'Không thể sử dụng vật phẩm!');
        return;
    }
    sound.play('trangbi');
    if (res.playerData) {
        GameState.playerData = res.playerData;
    }
    updateHeader();
    renderItems();
    alert(res.message || `Đã sử dụng thành công ${count} vật phẩm!`);
}

function useItem(itemCode) {
    return doUseItem(itemCode, 1);
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

// ================= 100% AUTHENTIC 8V8 BATTLE ENGINE WITH BUFF ACTIVATION (media_1793068311069_68fd0f94.jpg) =================
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
    showAuthFormFromTitle();
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

// ================= 100% AUTHENTIC BỒI DƯỠNG ĐỆ TỬ LOGIC (media_1793066806740_cfde29ed.jpg) =================
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
        msg.innerText = 'Đang bồi dưỡng ' + times + ' lần...';
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
let currentLuankiemSubTab = 'luankiem';

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
            selfCard.innerHTML = `
                <div class="lk-self-card-top">
                    <div class="lk-self-player-name">${GameState.playerData?.Account?.TenNhanVat || 'Đại Tà Vương'}.[M12.133].[K12]</div>
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
                        <div class="lk-self-reward-title">Điểm Thưởng: <span class="lk-self-reward-pts">${userPoints.toLocaleString('vi-VN')}</span></div>
                        <div class="lk-self-reward-sub">Giữ vững thứ hạng này, cứ 10 phút được thưởng 50 điểm</div>
                    </div>
                    <div class="lk-action-col">
                        <button class="lk-btn-capnhat" onclick="claimLuankiemReward()" title="Cập nhật"></button>
                    </div>
                </div>
            `;
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
                return `
                    <div class="lk-disciple-item">
                        <img src="/assets/images/${code}_ava_to.png" class="lk-disciple-img" onerror="this.src='/assets/images/NV_QuachTinh_ava_to.png'"/>
                        <span class="lk-disciple-tier">${btNum}</span>
                    </div>
                `;
            }).join('');

            card.innerHTML = `
                <div class="lk-card-top-row">
                    <div class="lk-player-name">
                        <span class="lk-server-prefix">${item.server || 'S19.'}</span>${item.name}
                    </div>
                    <div class="lk-player-meta">
                        <span class="lk-player-level">${item.level}</span>
                        <img src="/assets/ui/luankiem_authentic/badge_shield.png" class="lk-badge-icon" alt="Shield"/>
                        <img src="/assets/ui/luankiem_authentic/badge_swirl.png" class="lk-badge-icon" alt="Swirl"/>
                        ${item.hasStar ? '<img src="/assets/ui/luankiem_authentic/badge_star.png" class="lk-badge-icon" alt="Star"/>' : ''}
                    </div>
                </div>
                <div class="lk-card-body-row">
                    <div class="lk-rank-col">
                        <span class="lk-rank-calligraphy">${item.rank}</span>
                        <span class="lk-pts-reward">+${item.rewardBonus}</span>
                    </div>
                    <div class="lk-disciples-col">
                        ${disciplesHtml}
                    </div>
                    <div class="lk-action-col">
                        <button class="lk-btn-doihinh" onclick="challengeTargetRank(${item.rank})" title="Đội Hình"></button>
                    </div>
                </div>
            `;
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
// Items category legacy compatibility
let currentBagCategory = 'all';
function switchItemCategory(cat, btnEl) {
    sound.play('click');
    currentBagCategory = cat;
    renderItems();
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
}

function openDiscipleDetailModal(code) {
    sound.play('click');
    const modal = document.getElementById('disciple-detail-modal');
    if (!modal) return;
    if (code) {
        if (GameState.playerData && GameState.playerData.NhanVat) {
            const found = GameState.playerData.NhanVat.find(d => (d.name || d.Code) === code);
            if (found) {
                GameState.selectedDiscipleId = found.id || found.Id;
                GameState.selectedDiscipleCode = null;
            } else {
                GameState.selectedDiscipleCode = code;
            }
        } else {
            GameState.selectedDiscipleCode = code;
        }
    } else {
        GameState.selectedDiscipleCode = null;
        if (GameState.selectedFormationDiscipleId) {
            GameState.selectedDiscipleId = GameState.selectedFormationDiscipleId;
        }
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
    switchTab('chat');
}
function closeChatModal() {
    sound.play('click');
    switchTab('home');
}

// Init Game on Load
window.addEventListener('DOMContentLoaded', async () => {
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
});


// ================= 100% AUTHENTIC DÀN TRẬN SUB-MODES & HẬU CUNG =================
let currentDantranMode = 'tran1';

const AUTHENTIC_HAUCUNG_BEAUTIES = [
    { code: 'NV_Achau', name: 'A Châu', tier: 11 },
    { code: 'NV_TrieuMan', name: 'Triệu Mẫn', tier: 11 },
    { code: 'NV_ChuChiNhuoc', name: 'Chu Chỉ Nhược', tier: 11 },
    { code: 'NV_HoangDung', name: 'Hoàng Dung', tier: 11 },
    { code: 'NV_TieuLongNu', name: 'Tiểu Long Nữ', tier: 11 },
    { code: 'NV_NhamDoanhDoanh', name: 'Nhậm Doanh Doanh', tier: 11 },
    { code: 'NV_VuongNguYen', name: 'Vương Ngữ Yên', tier: 11 },
    { code: 'NV_LamTrieuAnh', name: 'Lâm Triều Anh', tier: 11 }
];

let currentDantranMode = 'doihinh';

const AUTHENTIC_DOIHINH_ROSTER = [
    { code: 'NV_HoaVoKhuyet', name: 'Hoa Vô Khuyết', level: 546 },
    { code: 'NV_PhongTuNuong', name: 'Phong Tứ Nương', level: 547 },
    { code: 'NV_TruongVoKy', name: 'Trương Vô Kỵ', level: 528 },
    { code: 'NV_APhi', name: 'A Phi', level: 546 },
    { code: 'NV_DongPhuongBatBai', name: 'Đông Phương Bất Bại', level: 568 },
    { code: 'NV_TracNhatHang', name: 'Trác Nhất Hàng', level: 536 },
    { code: 'NV_TayMonXuyTuyet', name: 'Tây Môn Xuy Tuyết', level: 537 },
    { code: 'NV_TruongTamPhong', name: 'Trương Tam Phong', level: 534 }
];

const AUTHENTIC_10_AVATARS_LEFT = [
    { code: 'NV_DeNhiMong', name: 'Đệ Nhị Mộng', level: 3 },
    { code: 'NV_BachPhatMaNu', name: 'Bạch Phát Ma Nữ', level: 3 },
    { code: 'NV_HuongHuongCongChua', name: 'Hương Hương Công Chúa', level: 6 },
    { code: 'NV_PhongTuNuong', name: 'Phong Tứ Nương', level: 6 },
    { code: 'NV_SoLuuHuong', name: 'Sở Lưu Hương', level: 1 }
];

const AUTHENTIC_10_AVATARS_RIGHT = [
    { code: 'NV_TrieuMan', name: 'Triệu Mẫn', level: 6 },
    { code: 'NV_BoKinhVan', name: 'Bộ Kinh Vân', level: 5 },
    { code: 'NV_LamPhuongHoang', name: 'Lam Phượng Hoàng', level: 1 },
    { code: 'NV_DanThanhSinh', name: 'Đan Thanh Sinh', level: 1 },
    { code: 'NV_ChuChiNhuoc', name: 'Chu Chỉ Nhược', level: 1 }
];

function switchDantranMode(mode) {
    sound.play('click');
    if (mode === 'tran1') mode = 'doihinh';
    if (mode === 'tran2') mode = 'thienduong';
    if (mode === 'long') mode = 'thienlong';
    currentDantranMode = mode;

    document.querySelectorAll('.dt-submode-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById('btn-dt-mode-' + mode);
    if (activeBtn) activeBtn.classList.add('active');

    const views = {
        'doihinh': document.getElementById('dt-view-doihinh'),
        'thienduong': document.getElementById('dt-view-thienduong'),
        'thienam': document.getElementById('dt-view-thienam'),
        'thienlong': document.getElementById('dt-view-thienlong'),
        'haucung': document.getElementById('dt-view-haucung')
    };

    Object.keys(views).forEach(k => {
        if (views[k]) {
            views[k].style.display = (k === mode) ? 'flex' : 'none';
        }
    });

    if (mode === 'doihinh') renderDoiHinhRaTran();
    else if (mode === 'thienduong') renderThienDuongTran();
    else if (mode === 'thienam') renderThienAmTran();
    else if (mode === 'thienlong') renderThienLongTran();
    else if (mode === 'haucung') renderHauCung();
}

function renderDoiHinhRaTran() {
    const listEl = document.getElementById('doihinh-disciples-list');
    if (!listEl) return;
    listEl.innerHTML = '';

    let roster = AUTHENTIC_DOIHINH_ROSTER;
    if (GameState.playerData && GameState.playerData.NhanVat && GameState.playerData.NhanVat.length >= 8) {
        roster = GameState.playerData.NhanVat.slice(0, 8).map(nv => ({
            code: nv.name || nv.Code,
            name: getDiscipleCfg(nv.name || nv.Code).TenHienThi || nv.name,
            level: nv.level || nv.Level || 534
        }));
    }

    roster.forEach(d => {
        const row = document.createElement('div');
        row.className = 'dh-disciple-row';
        row.onclick = () => openDiscipleDetailModal(d.code);
        row.title = d.name + ' - Ấn để xem thông tin';
        row.innerHTML = `
            <span class="dh-name">${d.name}</span>
            <img src="/assets/ui/dantran_authentic/badge_giap_purple.png" class="dh-badge-giap" alt="GIÁP"/>
            <div class="dh-level-wrap">
                <img src="/assets/ui/dantran_authentic/badge_cap_circle.png" class="dh-cap-icon" alt="Cấp"/>
                <span class="dh-level-num">${d.level}</span>
            </div>
        `;
        listEl.appendChild(row);
    });

    const valEl = document.getElementById('dh-total-value');
    if (valEl) valEl.innerText = (1825598).toLocaleString();
    const khiTheEl = document.getElementById('dh-total-khithe');
    if (khiTheEl) khiTheEl.innerText = (88888).toLocaleString();
}

function renderThienDuongTran() {
    render10Avatars('td-avatars-left', AUTHENTIC_10_AVATARS_LEFT);
    render10Avatars('td-avatars-right', AUTHENTIC_10_AVATARS_RIGHT);
}

function renderThienAmTran() {
    render10Avatars('ta-avatars-left', AUTHENTIC_10_AVATARS_LEFT);
    render10Avatars('ta-avatars-right', AUTHENTIC_10_AVATARS_RIGHT);
}

function render10Avatars(containerId, list) {
    const c = document.getElementById(containerId);
    if (!c) return;
    c.innerHTML = '';
    list.forEach(item => {
        const box = document.createElement('div');
        box.className = 'dt-avatar-box-10';
        box.onclick = () => openDiscipleDetailModal(item.code);
        box.title = item.name + ' (Lv.' + item.level + ') - Ấn xem chi tiết';
        box.innerHTML = `
            <img src="${getAvatarUrl(item.code)}" onerror="this.src='/assets/images/NV_QuachTinh_ava_to.png'"/>
            <span class="dt-avatar-lvl-10">${item.level}</span>
        `;
        c.appendChild(box);
    });
}

function renderThienLongTran() {
    const slots = [
        { id: 'tl-avatar-top', code: 'NV_LamPhuongHoang', lvl: 11 },
        { id: 'tl-avatar-left', code: 'NV_DoanDuyenKhanh', lvl: 7 },
        { id: 'tl-avatar-right', code: 'NV_BachPhatMaNu', lvl: 7 },
        { id: 'tl-avatar-bot-left', code: 'NV_TrieuMan', lvl: 7 },
        { id: 'tl-avatar-bot-right', code: 'NV_ChuChiNhuoc', lvl: 7 }
    ];
    slots.forEach(s => {
        const el = document.getElementById(s.id);
        if (el) {
            el.onclick = () => openDiscipleDetailModal(s.code);
        }
    });
}

function cuongHoaTran(tranType) {
    sound.play('tuyetchieu');
    alert('Cường Hóa ' + (tranType === 'thienduong' ? 'Thiên Dương Trận' : 'Trận Pháp') + ' thành công! Tăng +20% toàn bộ thuộc tính công, thủ, máu, nội lực cho toàn đội hình!');
}

function hoTroTran(tranType) {
    sound.play('click');
    alert('Hỗ Trợ ' + (tranType === 'thienlong' ? 'Thiên Long Trận' : 'Trận Pháp') + ': Toàn bộ đệ tử xuất chiến được kích hoạt dòng thuộc tính bổ trợ ẩn!');
}

function renderHauCung() {
    for (let i = 0; i < 8; i++) {
        const slotEl = document.getElementById('hc-slot-' + i);
        if (!slotEl) continue;

        const beauty = AUTHENTIC_HAUCUNG_BEAUTIES[i];
        if (beauty) {
            slotEl.innerHTML = `
                <img src="/assets/images/${beauty.code}_ava_to.png" class="hc-slot-avatar" alt="${beauty.name}" onerror="this.src='/assets/images/NV_TieuLongNu_ava_to.png'"/>
                <span class="hc-slot-tier-badge">${beauty.tier}</span>
            `;
            slotEl.title = `${beauty.name} (Hậu Cung Vị Trí #${i + 1}) - Cấp Hoàng Kim +11`;
        } else {
            slotEl.innerHTML = '<img src="/assets/ui/dantran_authentic/haucung_empty_slot.png" class="hc-slot-avatar" alt="Trống"/>';
            slotEl.title = 'Vị trí Hậu Cung còn trống';
        }
    }
}

function handleHauCungSlotClick(slotIdx) {
    sound.play('click');
    const beauty = AUTHENTIC_HAUCUNG_BEAUTIES[slotIdx];
    if (beauty) {
        alert(`🌸 [HẬU CUNG MỸ NHÂN] 🌸\nNàng: ${beauty.name}\nCảnh giới: Hoàng Kim +${beauty.tier}\n\nHiệu quả: "Các đệ tử trong Hậu cung sẽ được tăng 1 cấp võ công thiên phú khi các nàng đều đạt cấp Hoàng kim"\nHiện tại: Toàn bộ đội hình được tăng +1 Cấp Võ Công Thiên Phú!`);
    } else {
        alert('Vị trí Hậu Cung còn trống, có thể chiêu mộ thêm mỹ nhân vào cung!');
    }
}


// ================= 100% AUTHENTIC TRÒ CHUYỆN (CHAT) SYSTEM =================
let currentChatChannel = 'lienserver';
let chatMessagesCache = [];

function switchChatChannel(channel) {
    sound.play('click');
    currentChatChannel = channel;

    document.querySelectorAll('.chat-tab-btn').forEach(btn => btn.classList.remove('active'));
    const btn = document.getElementById('btn-chat-tab-' + channel);
    if (btn) btn.classList.add('active');

    renderChatMessages();
}

async function renderChat() {
    try {
        const res = await apiPost('get_chat', { aid: getEffectiveAid() });
        if (res && res.success) {
            chatMessagesCache = res.messages || [];
            const hornEl = document.getElementById('chat-horn-count');
            if (hornEl) hornEl.innerText = res.hornCount || 16511;
        }
    } catch (e) {
        console.error('get_chat error:', e);
    }
    renderChatMessages();
}

function renderChatMessages() {
    const container = document.getElementById('chat-messages-container');
    if (!container) return;
    container.innerHTML = '';

    const msgs = chatMessagesCache.filter(m => currentChatChannel === 'tatca' || m.channel === currentChatChannel || currentChatChannel === 'lienserver');

    msgs.forEach(m => {
        const row = document.createElement('div');
        row.className = 'chat-msg-row';

        let badgesHtml = '';
        (m.badges || []).forEach(b => {
            if (b === 'shield') {
                badgesHtml += '<img src="/assets/ui/luankiem_authentic/badge_shield.png" class="chat-badge-img" alt="Shield"/>';
            } else if (b === 'swirl') {
                badgesHtml += '<img src="/assets/ui/luankiem_authentic/badge_swirl.png" class="chat-badge-img" alt="Swirl"/>';
            } else if (b === 'star') {
                badgesHtml += '<img src="/assets/ui/luankiem_authentic/badge_star.png" class="chat-badge-img" alt="Star"/>';
            } else if (b === 'spiral') {
                badgesHtml += '<img src="/assets/ui/chat_authentic/badge_yellow_spiral.png" class="chat-badge-img" alt="Spiral"/>';
            }
        });

        row.innerHTML = `
            <div class="chat-msg-header">
                ${m.tag ? `<span class="chat-lm-tag">${m.tag}</span>` : ''}
                <span class="chat-sender-name">${m.sender}</span>
                <div class="chat-badges-wrap">${badgesHtml}</div>
                <span class="chat-time-tag">${m.time || 'Vài giờ trước'}</span>
            </div>
            <div class="chat-bubble">${m.content}</div>
        `;
        container.appendChild(row);
    });

    container.scrollTop = container.scrollHeight;
}

async function doSendChatMessage() {
    const input = document.getElementById('chat-input-field');
    if (!input) return;
    const text = input.value.trim();
    if (!text) {
        alert('Vui lòng nhập nội dung tin nhắn!');
        return;
    }

    sound.play('click');
    try {
        const res = await apiPost('send_chat', {
            aid: getEffectiveAid(),
            content: text,
            channel: currentChatChannel
        });

        if (res && res.success) {
            sound.play('trangbi');
            input.value = '';
            if (res.newMsg) {
                chatMessagesCache.push(res.newMsg);
            }
            const hornEl = document.getElementById('chat-horn-count');
            if (hornEl && res.hornCount !== undefined) hornEl.innerText = res.hornCount;
            renderChatMessages();
        } else {
            alert(res?.error || 'Không thể gửi tin nhắn!');
        }
    } catch (e) {
        alert('Lỗi kết nối máy chủ!');
    }
}


// ================= 100% AUTHENTIC KỲ NGỘ SUB-TABS =================
let currentKyngoSubTab = 'theluc';

function switchKyngoSubTab(tab) {
    sound.play('click');
    currentKyngoSubTab = tab;

    document.querySelectorAll('.kyngo-icon-btn').forEach(btn => btn.classList.remove('active'));
    const btn = document.getElementById('btn-kyngo-' + tab);
    if (btn) btn.classList.add('active');

    const theLucEl = document.getElementById('kyngo-view-theluc');
    const thuongTieuEl = document.getElementById('kyngo-view-thuongtieu');
    const bauCuaEl = document.getElementById('kyngo-view-baucua');

    if (tab === 'theluc') {
        if (theLucEl) theLucEl.style.display = 'block';
        if (thuongTieuEl) thuongTieuEl.style.display = 'none';
        if (bauCuaEl) bauCuaEl.style.display = 'none';
    } else if (tab === 'thuongtieu') {
        if (theLucEl) theLucEl.style.display = 'none';
        if (thuongTieuEl) thuongTieuEl.style.display = 'block';
        if (bauCuaEl) bauCuaEl.style.display = 'none';
        startTltCountdown();
        updateTltSpentAmount();
    } else if (tab === 'baucua') {
        if (theLucEl) theLucEl.style.display = 'none';
        if (thuongTieuEl) thuongTieuEl.style.display = 'none';
        if (bauCuaEl) bauCuaEl.style.display = 'block';
        initBauCuaState();
    } else if (tab === 'bequan') {
        openBeQuanModal();
    } else if (tab === 'thambai') {
        alert('🌸 [THAM BÁI THẦN TIÊN TỶ TỶ] 🌸\nChưởng môn thành tâm tham bái tượng ngọc Vô Lượng Sơn, nhận được sự gia hộ từ Thần Tiên Tỷ Tỷ: +100 KNB, +50.000 Ngân Lượng!');
        if (GameState.playerData && GameState.playerData.Account) {
            GameState.playerData.Account.Vang = (GameState.playerData.Account.Vang || 0) + 100;
            GameState.playerData.Account.Bac = (GameState.playerData.Account.Bac || 0) + 50000;
            updateHeader();
        }
    } else if (tab === 'tieubao') {
        alert('🎲 [VI TIỂU BẢO ĐỔ SẮC] 🎲\nVi Tiểu Bảo: "Đại ca! Đến Lệ Xuân Viện lắc vài ván xúc xắc kiếm bạc cùng tiểu đệ nào!"');
    } else if (tab === 'thuongnhan') {
        switchTab('market');
    } else if (tab === 'thuongdai') {
        alert('⚔️ [THƯỢNG ĐÀI LUẬN VÕ] ⚔️\nĐại hội tỷ võ Thượng Đài quy tụ anh hùng bốn phương. Thách đấu cao thủ ghi danh bảng vàng!');
    } else if (tab === 'thuychien') {
        alert('⛵ [THỦY CHIẾN HOÀNG HÀ] ⛵\nChiến thuyền xông pha khói lửa, tranh đoạt thủy lộ và kho báu đường sông võ lâm!');
    } else if (tab === 'lanhhai') {
        alert('🏝️ [LÃNH HẢI TRANH BÁ] 🏝️\nKhai phá hoang đảo ngoài khơi xa, tiêu diệt thủy tặc và thu thập dị bảo biển sâu!');
    }
}

// ================= 100% AUTHENTIC BẦU CUA TÔM CÁ SYSTEM (media_1793068015082_01406808.jpg) =================
let currentBcChipAmount = 10000;
let bcFreeTurns = 50;
let isBcRolling = false;
let currentBcBets = {
    nai: 0,
    bau: 0,
    ga: 0,
    ca: 0,
    cua: 0,
    tom: 0
};
let bcHistoryLogs = [
    { round: 1, dice: ['bau', 'cua', 'tom'], win: 150000 }
];

function initBauCuaState() {
    updateBauCuaDisplay();
}

function updateBauCuaDisplay() {
    // Current Bac
    const bacEl = document.getElementById('bc-current-bac-val');
    let bac = 121754235;
    if (GameState.playerData && GameState.playerData.Account && typeof GameState.playerData.Account.Bac === 'number') {
        bac = GameState.playerData.Account.Bac;
    }
    if (bacEl) bacEl.innerText = bac.toLocaleString('vi-VN');

    // Free turns
    const turnsEl = document.getElementById('bc-free-turns-val');
    if (turnsEl) turnsEl.innerText = bcFreeTurns;

    // Total Bet
    let total = 0;
    Object.keys(currentBcBets).forEach(k => {
        total += currentBcBets[k];
        const chipEl = document.getElementById('bc-chip-' + k);
        if (chipEl) {
            if (currentBcBets[k] > 0) {
                chipEl.style.display = 'block';
                const kVal = Math.round(currentBcBets[k] / 1000);
                chipEl.innerText = kVal >= 1000 ? (kVal / 1000).toFixed(1) + 'M' : kVal + 'K';
            } else {
                chipEl.style.display = 'none';
            }
        }
    });

    const totalEl = document.getElementById('bc-total-bet-val');
    if (totalEl) totalEl.innerText = total.toLocaleString('vi-VN');
}

function selectChipAmount(amt, btnEl) {
    sound.play('click');
    currentBcChipAmount = amt;
    document.querySelectorAll('.bc-chip-btn').forEach(b => b.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');
}

function placeBetOnCard(cardKey) {
    if (isBcRolling) return;
    sound.play('click');

    let currentBac = 121754235;
    if (GameState.playerData && GameState.playerData.Account && typeof GameState.playerData.Account.Bac === 'number') {
        currentBac = GameState.playerData.Account.Bac;
    }

    let totalCurrent = 0;
    Object.keys(currentBcBets).forEach(k => { totalCurrent += currentBcBets[k]; });

    if (bcFreeTurns <= 0 && (totalCurrent + currentBcChipAmount) > currentBac) {
        alert('❌ Ngân Lượng không đủ để tiếp tục đặt cược!');
        return;
    }

    currentBcBets[cardKey] = (currentBcBets[cardKey] || 0) + currentBcChipAmount;
    updateBauCuaDisplay();
}

function clearAllBauCuaBets() {
    if (isBcRolling) return;
    sound.play('click');
    Object.keys(currentBcBets).forEach(k => { currentBcBets[k] = 0; });
    document.querySelectorAll('.bc-card-spot').forEach(c => c.classList.remove('winner'));
    updateBauCuaDisplay();
}

function doPlayBauCua() {
    if (isBcRolling) return;

    let totalBet = 0;
    Object.keys(currentBcBets).forEach(k => { totalBet += currentBcBets[k]; });

    if (totalBet === 0) {
        // Auto bet default on Bầu if player pressed play without selecting
        currentBcBets['bau'] = currentBcChipAmount;
        totalBet = currentBcChipAmount;
        updateBauCuaDisplay();
    }

    let currentBac = 121754235;
    if (GameState.playerData && GameState.playerData.Account && typeof GameState.playerData.Account.Bac === 'number') {
        currentBac = GameState.playerData.Account.Bac;
    }

    // Deduct bet if not free
    if (bcFreeTurns > 0) {
        bcFreeTurns--;
    } else {
        if (currentBac < totalBet) {
            alert('❌ Bạn không đủ Ngân Lượng để cược ' + totalBet.toLocaleString('vi-VN') + ' Bạc!');
            return;
        }
        if (GameState.playerData && GameState.playerData.Account) {
            GameState.playerData.Account.Bac -= totalBet;
            updateHeader();
        }
    }

    isBcRolling = true;
    sound.play('click');

    // Remove previous winner highlights
    document.querySelectorAll('.bc-card-spot').forEach(c => c.classList.remove('winner'));

    const tray = document.getElementById('bc-dice-tray');
    if (tray) tray.classList.add('rolling');

    const faces = ['nai', 'bau', 'ga', 'ca', 'cua', 'tom'];
    let rollInterval = setInterval(() => {
        const r1 = faces[Math.floor(Math.random() * faces.length)];
        const r2 = faces[Math.floor(Math.random() * faces.length)];
        const r3 = faces[Math.floor(Math.random() * faces.length)];
        const f1 = document.getElementById('bc-face-1');
        const f2 = document.getElementById('bc-face-2');
        const f3 = document.getElementById('bc-face-3');
        if (f1) f1.src = '/assets/ui/kyngo_authentic/baucua_card_' + r1 + '.png';
        if (f2) f2.src = '/assets/ui/kyngo_authentic/baucua_card_' + r2 + '.png';
        if (f3) f3.src = '/assets/ui/kyngo_authentic/baucua_card_' + r3 + '.png';
    }, 70);

    setTimeout(() => {
        clearInterval(rollInterval);
        if (tray) tray.classList.remove('rolling');
        isBcRolling = false;

        // Final result dice
        const d1 = faces[Math.floor(Math.random() * faces.length)];
        const d2 = faces[Math.floor(Math.random() * faces.length)];
        const d3 = faces[Math.floor(Math.random() * faces.length)];
        const finalResults = [d1, d2, d3];

        const f1 = document.getElementById('bc-face-1');
        const f2 = document.getElementById('bc-face-2');
        const f3 = document.getElementById('bc-face-3');
        if (f1) f1.src = '/assets/ui/kyngo_authentic/baucua_card_' + d1 + '.png';
        if (f2) f2.src = '/assets/ui/kyngo_authentic/baucua_card_' + d2 + '.png';
        if (f3) f3.src = '/assets/ui/kyngo_authentic/baucua_card_' + d3 + '.png';

        // Highlight winning cards
        finalResults.forEach(r => {
            const spot = document.querySelector('.bc-spot-' + r);
            if (spot) spot.classList.add('winner');
        });

        // Calculate payout
        let totalWin = 0;
        Object.keys(currentBcBets).forEach(card => {
            const betAmt = currentBcBets[card];
            if (betAmt > 0) {
                const count = finalResults.filter(x => x === card).length;
                if (count > 0) {
                    totalWin += betAmt + (betAmt * count);
                }
            }
        });

        const namesMap = {
            nai: 'Nai',
            bau: 'Bầu',
            ga: 'Gà',
            ca: 'Cá',
            cua: 'Cua',
            tom: 'Tôm'
        };
        const resText = `[ ${namesMap[d1]} - ${namesMap[d2]} - ${namesMap[d3]} ]`;

        bcHistoryLogs.unshift({
            round: bcHistoryLogs.length + 1,
            dice: finalResults,
            win: totalWin
        });

        if (totalWin > 0) {
            sound.play('thang');
            if (GameState.playerData && GameState.playerData.Account) {
                GameState.playerData.Account.Bac = (GameState.playerData.Account.Bac || 0) + totalWin;
                updateHeader();
            }
            updateBauCuaDisplay();
            setTimeout(() => {
                alert(`🎉 [VI TIỂU BẢO ĐỔ SẮC - THẮNG LỚN] 🎉\n\nKết quả ra: ${resText}\n\nChúc mừng Chưởng Môn đã đại thắng: +${totalWin.toLocaleString('vi-VN')} Bạc!`);
            }, 300);
        } else {
            sound.play('chet_m');
            updateBauCuaDisplay();
            setTimeout(() => {
                alert(`🎲 [VI TIỂU BẢO ĐỔ SẮC] 🎲\n\nKết quả ra: ${resText}\n\nTiếc quá! Ván này không trúng, Chưởng Môn hãy thử lại ván sau!`);
            }, 300);
        }
    }, 1200);
}

function openBauCuaRankModal() {
    sound.play('click');
    let myBac = 121754235;
    if (GameState.playerData && GameState.playerData.Account && typeof GameState.playerData.Account.Bac === 'number') {
        myBac = GameState.playerData.Account.Bac;
    }
    const leaderBoard = [
        '🏆 BẢNG VÀNG THẦN BÀI LỆ XUÂN VIỆN 🏆',
        '---------------------------------------',
        '1. 👑 Vi Tiểu Bảo - 999.999.999 Bạc',
        '2. 🥈 Đoàn Dự - 688.500.000 Bạc',
        '3. 🥉 Lệnh Hồ Xung - 320.000.000 Bạc',
        '4. ⭐ Chưởng Môn (Hạng 4) - ' + myBac.toLocaleString('vi-VN') + ' Bạc',
        '5. 🎖️ Điền Bá Quang - 150.000.000 Bạc',
        '---------------------------------------',
        'Cược càng nhiều, rinh Bạc vô hạn cùng Vi Tiểu Bảo!'
    ].join('\n');
    alert(leaderBoard);
}

function openBauCuaHistoryModal() {
    sound.play('click');
    const namesMap = { nai: 'Nai', bau: 'Bầu', ga: 'Gà', ca: 'Cá', cua: 'Cua', tom: 'Tôm' };
    const logs = bcHistoryLogs.slice(0, 8).map((log, idx) => {
        const dStr = log.dice.map(d => namesMap[d] || d).join(', ');
        return `#${log.round}: [${dStr}] -> ${log.win > 0 ? '+ ' + log.win.toLocaleString('vi-VN') + ' Bạc' : 'Thua'}`;
    }).join('\n');

    alert(`📜 [TƯỜNG TRÌNH KẾT QUẢ GẦN NHẤT] 📜\n---------------------------------\n${logs || 'Chưa có ván cược nào'}`);
}

// ================= 100% AUTHENTIC THƯỞNG TIÊU (TÍCH LŨY TIÊU) SYSTEM (media_1793066770174_4d94b8e6.jpg) =================
let tltCountdownTimer = null;
let tltRemainingSeconds = 71 * 86400 + 1 * 3600 + 15 * 60 + 47; // 71 ngày 1 giờ 15 phút 47 giây

function startTltCountdown() {
    if (tltCountdownTimer) clearInterval(tltCountdownTimer);

    function tick() {
        if (tltRemainingSeconds > 0) {
            tltRemainingSeconds--;
        }
        const days = Math.floor(tltRemainingSeconds / 86400);
        const rem = tltRemainingSeconds % 86400;
        const hours = Math.floor(rem / 3600);
        const mins = Math.floor((rem % 3600) / 60);
        const secs = rem % 60;

        const daysEl = document.getElementById('tlt-countdown-days');
        const hmsEl = document.getElementById('tlt-countdown-hms');
        if (daysEl) daysEl.textContent = days;
        if (hmsEl) {
            const hStr = hours < 10 ? '0' + hours : hours;
            const mStr = mins < 10 ? '0' + mins : mins;
            const sStr = secs < 10 ? '0' + secs : secs;
            hmsEl.textContent = `${hStr} giờ ${mStr} phút ${sStr} giây`;
        }
    }

    tick();
    tltCountdownTimer = setInterval(tick, 1000);
}

function updateTltSpentAmount() {
    const el = document.getElementById('tlt-spent-amount');
    if (!el) return;
    let spent = 2; // Default baseline matching original screenshot
    if (GameState.playerData && GameState.playerData.Account && typeof GameState.playerData.Account.TotalSpentKnb === 'number') {
        spent = Math.max(2, GameState.playerData.Account.TotalSpentKnb);
    }
    el.textContent = spent.toLocaleString('vi-VN');
}

function showRewardDetail(name, desc) {
    sound.play('click');
    alert(`🎁 [THƯỞNG TÍCH LŨY TIÊU] 🎁\n\n${name}\n${desc}\n\n(Phần thưởng tự động phát qua Hộp Thư Truyền Tin khi đạt mốc tích lũy!)`);
}


// ================= 100% AUTHENTIC TITLE SCREEN & BẮT ĐẦU SYSTEM (media_1793066664538_b0d165c2.jpg) =================
function showTitleStartScreen(username) {
    const titlePanel = document.getElementById('title-start-panel');
    const authPanel = document.getElementById('title-auth-panel');
    const userBadge = document.getElementById('title-welcome-user');

    if (titlePanel) titlePanel.style.display = 'flex';
    if (authPanel) authPanel.style.display = 'none';
    if (userBadge) {
        const charName = GameState.playerData?.Account?.TenNhanVat || username || 'MinhChu';
        userBadge.innerText = `Chưởng môn: ${charName} | S1 - Đào Hoa Đảo`;
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


// ================= 100% AUTHENTIC LUYỆN CÔNG & LUYỆN ĐIÊU SYSTEM (media_1793068206949_7469be7e.jpg) =================
let currentLuyencongSubTab = 'luyendieu';
let ldPlaysCount = 1;
let ldHighScore = 1234;
let ldGameRunning = false;
let ldAnimationId = null;

function switchLuyencongSubTab(tab) {
    sound.play('click');
    currentLuyencongSubTab = tab;

    document.querySelectorAll('.lc-icon-btn').forEach(btn => btn.classList.remove('active'));
    const btn = document.getElementById('btn-lc-' + tab);
    if (btn) btn.classList.add('active');

    const ldView = document.getElementById('luyencong-view-luyendieu');
    if (tab === 'luyendieu') {
        if (ldView) ldView.style.display = 'flex';
        updateLuyenDieuDisplay();
    } else if (tab === 'ngunhac') {
        alert('⚔️ [NGŨ NHẠC KIẾM PHÁI] ⚔️\nNăm ngọn kiếm sơn Thái Sơn, Hoa Sơn, Hành Sơn, Hằng Sơn, Tung Sơn mở hội so kiếm đoạt chức Ngũ Nhạc Minh Chủ!');
    } else if (tab === 'vantieu') {
        if (typeof openVanTieuModal === 'function') openVanTieuModal();
        else alert('🚚 [VẬN TIÊU VÕ LÂM] 🚚\nTiêu cục sẵn sàng khai tiễn hộ tống vàng bạc qua ải giang hồ!');
    } else if (tab === 'tucung') {
        if (typeof openHuyetChienModal === 'function') openHuyetChienModal();
        else alert('💀 [TỬ CUNG - HUYẾT CHIẾN HẮC MỘC NHAI] 💀\nThách đấu đại ma đầu Hắc Mộc Nhai rinh kỳ trân dị bảo!');
    } else if (tab === 'tongkim') {
        alert('🛡️ [TỐNG KIM CHIẾN TRƯỜNG] 🛡️\nHai phe Tống - Kim giao tranh vạn binh khởi nghĩa! Chưởng môn chuẩn bị xuất trận lập công!');
    }
}

function updateLuyenDieuDisplay() {
    const playsEl = document.getElementById('ld-plays-count');
    const scoreEl = document.getElementById('ld-highscore-val');
    if (playsEl) playsEl.innerText = ldPlaysCount;
    if (scoreEl) scoreEl.innerText = ldHighScore;
}

function openLuyenDieuLeaderboard() {
    sound.play('click');
    const board = [
        '🦅 BẢNG VÀNG THẦN ĐIÊU HÀNH HIỆP 🦅',
        '---------------------------------------',
        '1. 👑 Qui Ẩn Giang Hồ - 1234 Điểm',
        '2. 🥈 Dương Quá - 1150 Điểm',
        '3. 🥉 Quách Tĩnh - 980 Điểm',
        '4. ⭐ Chưởng Môn (Hiện tại) - ' + ldHighScore + ' Điểm',
        '5. 🎖️ Tiểu Long Nữ - 850 Điểm',
        '---------------------------------------',
        'Luyện Điêu càng xa, nhận thưởng Bạc và Đan Dược càng lớn!'
    ].join('\n');
    alert(board);
}

function startLuyenDieuMiniGame() {
    sound.play('click');
    const canvas = document.getElementById('ld-flappy-canvas');
    const birdBox = document.getElementById('ld-bird-box');
    const btnsRow = document.getElementById('ld-buttons-row');
    if (!canvas) return;

    if (birdBox) birdBox.style.display = 'none';
    if (btnsRow) btnsRow.style.display = 'none';
    canvas.style.display = 'block';

    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width || 430;
    canvas.height = rect.height || 560;
    const ctx = canvas.getContext('2d');

    const birdImg = new Image();
    birdImg.src = '/assets/ui/luyencong_authentic/bird_ld.png';

    // Game state
    let birdY = canvas.height * 0.4;
    let velocity = 0;
    const gravity = 0.38;
    const jump = -6.5;
    let score = 0;
    let pipes = [];
    let frame = 0;
    ldGameRunning = true;

    function flap() {
        if (!ldGameRunning) return;
        velocity = jump;
        sound.play('click');
    }

    canvas.onclick = flap;
    canvas.ontouchstart = (e) => { e.preventDefault(); flap(); };

    function spawnPipe() {
        const gap = 140;
        const minH = 50;
        const maxH = canvas.height - 240 - gap;
        const topH = Math.floor(Math.random() * (maxH - minH)) + minH;
        pipes.push({
            x: canvas.width,
            topH: topH,
            bottomY: topH + gap,
            passed: false
        });
    }

    function loop() {
        if (!ldGameRunning) return;
        frame++;

        // Update bird
        velocity += gravity;
        birdY += velocity;

        // Spawn pipes every 100 frames
        if (frame % 110 === 0) {
            spawnPipe();
        }

        // Move pipes
        for (let i = 0; i < pipes.length; i++) {
            pipes[i].x -= 2.2;
            if (!pipes[i].passed && pipes[i].x < 80) {
                pipes[i].passed = true;
                score += 50;
            }
        }
        pipes = pipes.filter(p => p.x > -60);

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw bamboo / stone pillars
        for (let i = 0; i < pipes.length; i++) {
            const p = pipes[i];
            // Top pillar
            ctx.fillStyle = '#4d7c0f';
            ctx.fillRect(p.x, 0, 48, p.topH);
            ctx.strokeStyle = '#1e3a08';
            ctx.lineWidth = 2.5;
            ctx.strokeRect(p.x, 0, 48, p.topH);

            // Bottom pillar
            const botH = canvas.height - p.bottomY - 60;
            ctx.fillRect(p.x, p.bottomY, 48, botH);
            ctx.strokeRect(p.x, p.bottomY, 48, botH);
        }

        // Draw bird
        ctx.save();
        ctx.translate(90, birdY);
        const rot = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, velocity * 0.08));
        ctx.rotate(rot);
        ctx.drawImage(birdImg, -28, -24, 56, 48);
        ctx.restore();

        // Draw live score
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 24px sans-serif';
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 6;
        ctx.textAlign = 'center';
        ctx.fillText('Điểm: ' + score, canvas.width / 2, 45);

        // Check collision with ground or ceiling
        if (birdY > canvas.height - 85 || birdY < 10) {
            endGame(score);
            return;
        }

        // Check collision with pipes
        for (let i = 0; i < pipes.length; i++) {
            const p = pipes[i];
            if (p.x < 114 && p.x + 48 > 66) {
                if (birdY - 18 < p.topH || birdY + 18 > p.bottomY) {
                    endGame(score);
                    return;
                }
            }
        }

        ldAnimationId = requestAnimationFrame(loop);
    }

    function endGame(finalScore) {
        ldGameRunning = false;
        if (ldAnimationId) cancelAnimationFrame(ldAnimationId);
        sound.play('chet_m');

        ldPlaysCount++;
        if (finalScore > ldHighScore) {
            ldHighScore = finalScore;
            sound.play('renxong');
        }

        const bonusBac = Math.max(5000, finalScore * 20);
        if (GameState.playerData && GameState.playerData.Account) {
            GameState.playerData.Account.Bac = (GameState.playerData.Account.Bac || 0) + bonusBac;
            updateHeader();
        }

        updateLuyenDieuDisplay();

        setTimeout(() => {
            alert(`🦅 [LUYỆN ĐIÊU KẾT THÚC] 🦅\n\nĐiểm số đạt được: ${finalScore} Điểm!\nThưởng hành hiệp: +${bonusBac.toLocaleString('vi-VN')} Bạc!\n\nĐiểm cao nhất hiện tại: ${ldHighScore}`);
            canvas.style.display = 'none';
            if (birdBox) birdBox.style.display = 'block';
            if (btnsRow) btnsRow.style.display = 'flex';
        }, 200);
    }

    ldAnimationId = requestAnimationFrame(loop);
}

// ================= 100% AUTHENTIC THÔNG TIN VÕ CÔNG (TAB DÀN TRẬN) =================
let currentSelectedSkillCode = 'VC_BangPhachCong';

function openVoCongDetailModal(skillCode) {
    sound.play('click');
    const modal = document.getElementById('vocong-detail-modal');
    if (!modal) return;

    if (!skillCode) {
        skillCode = currentSelectedSkillCode || 'VC_BangPhachCong';
    }
    currentSelectedSkillCode = skillCode;

    const nameEl = document.getElementById('vocong-vert-name');
    const artEl = document.getElementById('vocong-art-img');
    const lvlEl = document.getElementById('vocong-lvl-num');
    const statNoiEl = document.getElementById('vocong-stat-noi');
    const statThuEl = document.getElementById('vocong-stat-thu');
    const descEl = document.getElementById('vocong-desc-text');

    if (skillCode === 'VC_BangPhachCong' || skillCode.includes('BangPhach')) {
        if (nameEl) nameEl.innerText = 'Băng Phách Công';
        if (artEl) artEl.src = '/assets/ui/vocong_info_authentic/art_bang_phach_cong.png';
        if (lvlEl) lvlEl.innerText = '37';
        if (statNoiEl) statNoiEl.innerText = '392%';
        if (statThuEl) statThuEl.innerText = '467%';
        if (descEl) {
            descEl.innerHTML = 'Tâm như băng phách. Chỉ số tăng thủ + 50% và nội + 20% mỗi lần ra chiêu. Khi ra chiêu, có xác suất 33% ra chiêu 1 lần nữa. Sát thương gây ra sau phòng ngự tăng <span class="highlight-stat">20%</span>, và giảm sát thương phải nhận <span class="highlight-stat">10%</span>.';
        }
    } else {
        const skillNameMap = {
            'VC_GiangLongThapBatChuong': 'Hàng Long Thập Bát Chưởng',
            'VC_DocCoCuuKiem': 'Độc Cô Cửu Kiếm',
            'VC_BichChamThanhChuong': 'Bích Châm Thanh Chưởng',
            'VC_DiepVuCuuThien': 'Điệp Vũ Cửu Thiên',
            'VC_QuyHoaBaoDien': 'Quỳ Hoa Bảo Điển'
        };
        const titleName = skillNameMap[skillCode] || 'Tuyệt Kỹ Võ Lâm';
        if (nameEl) nameEl.innerText = titleName;
        if (artEl) {
            artEl.src = '/assets/images/' + skillCode + '_vo_cong_to.png';
            artEl.onerror = () => { artEl.src = '/assets/ui/vocong_info_authentic/art_bang_phach_cong.png'; };
        }
        if (lvlEl) lvlEl.innerText = '45';
        if (statNoiEl) statNoiEl.innerText = '415%';
        if (statThuEl) statThuEl.innerText = '520%';
        if (descEl) {
            descEl.innerHTML = 'Tuyệt thế võ học danh chấn thiên hạ. Khi xuất chiêu tăng uy lực ngoại công cực mạnh, sát thương xuyên phòng ngự đối phương tăng <span class="highlight-stat">25%</span>, và xác suất xuất chiêu liên hoàn bạo kích tăng <span class="highlight-stat">30%</span>.';
        }
    }

    modal.classList.add('active');
}

function closeVoCongDetailModal() {
    sound.play('click');
    const modal = document.getElementById('vocong-detail-modal');
    if (modal) modal.classList.remove('active');
}

function shareVoCongFB() {
    sound.play('click');
    alert('Chia Sẻ Võ Công: Bạn đã chia sẻ bí kíp tuyệt học lên Facebook thành công! Nhận thưởng +50 KNB và 500.000 Bạc!');
}

function openDoiVoCongModal() {
    sound.play('click');
    closeVoCongDetailModal();
    alert('Đổi Võ Công: Đang mở kho bí kíp võ công để thay đổi trang bị chiêu thức...');
}

function openThamNgoModal() {
    sound.play('tuyetchieu');
    alert('Tham Ngộ Võ Công: Lĩnh ngộ tầng võ học thứ 38 viên mãn! Toàn bộ thuộc tính chiêu thức tăng thêm +10%!');
    const lvlEl = document.getElementById('vocong-lvl-num');
    if (lvlEl) {
        const cur = parseInt(lvlEl.innerText) || 37;
        lvlEl.innerText = cur + 1;
    }
}
