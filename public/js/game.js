
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
    openChanKhiScreen();
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


// ================= 100% AUTHENTIC GIAO DIỆN TRANG BỊ =================
let currentTrangBiTab = 'vukhi';

const SAMPLE_TRANGBI_DATA = [
    { id: 'tb_1', code: 'VK_HongTiTuCham', name: 'Hồng Ti tú châm', type: 'vukhi', level: 1, statIcon: 'sword', statName: 'Công', statVal: 91, tier: 'giap' },
    { id: 'tb_2', code: 'VK_HongTiTuCham', name: 'Hồng Ti tú châm', type: 'vukhi', level: 1, statIcon: 'sword', statName: 'Công', statVal: 91, tier: 'giap' },
    { id: 'tb_3', code: 'VK_HongTiTuCham', name: 'Hồng Ti tú châm', type: 'vukhi', level: 1, statIcon: 'sword', statName: 'Công', statVal: 91, tier: 'giap' },
    { id: 'tb_4', code: 'VK_HongTiTuCham', name: 'Hồng Ti tú châm', type: 'vukhi', level: 1, statIcon: 'sword', statName: 'Công', statVal: 91, tier: 'giap' },
    { id: 'tb_5', code: 'VK_HongTiTuCham', name: 'Hồng Ti tú châm', type: 'vukhi', level: 1, statIcon: 'sword', statName: 'Công', statVal: 91, tier: 'giap' },
    { id: 'tb_6', code: 'VK_DoLongDao', name: 'Đồ Long Đao', type: 'vukhi', level: 10, statIcon: 'sword', statName: 'Công', statVal: 380, tier: 'giap' },
    { id: 'tb_7', code: 'AG_HamHuongBaoY', name: 'Hàm Hương Bảo Y', type: 'aogiap', level: 12, statIcon: 'shield', statName: 'Thủ', statVal: 420, tier: 'giap' },
    { id: 'tb_8', code: 'AG_CamVeHoangKimGiap', name: 'Hoàng Kim Giáp', type: 'aogiap', level: 15, statIcon: 'shield', statName: 'Thủ', statVal: 560, tier: 'giap' },
    { id: 'tb_9', code: 'TS_HoiNhanNgocBoi', name: 'Hồi Nhân Ngọc Bội', type: 'trangsuc', level: 8, statIcon: 'blood', statName: 'Máu', statVal: 1250, tier: 'giap' },
    { id: 'tb_10', code: 'TS_NgungThanHuongNang', name: 'Ngưng Thần Hương Nang', type: 'trangsuc', level: 5, statIcon: 'palm', statName: 'Nội', statVal: 340, tier: 'giap' },
    { id: 'tb_11', code: 'VK_KimXaKiem', name: 'Kim Xà Kiếm', type: 'thankhi', level: 25, statIcon: 'sword', statName: 'Công', statVal: 950, tier: 'giap' }
];

function switchTrangBiTab(tab) {
    sound.play('click');
    currentTrangBiTab = tab;
    document.querySelectorAll('.tb-tab-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById('btn-tb-tab-' + tab);
    if (activeBtn) activeBtn.classList.add('active');
    renderTrangBiList();
}

function renderTrangBiList() {
    const container = document.getElementById('trangbi-list-container');
    if (!container) return;
    container.innerHTML = '';

    let items = [];
    if (GameState.playerData && GameState.playerData.TrangBi && GameState.playerData.TrangBi.length > 0) {
        items = GameState.playerData.TrangBi;
    } else {
        items = SAMPLE_TRANGBI_DATA;
    }

    if (currentTrangBiTab !== 'all') {
        items = items.filter(it => it.type === currentTrangBiTab);
    }

    if (items.length === 0) {
        container.innerHTML = '<div style="color: #6d411b; text-align: center; padding: 40px 20px; font-size: 14px; font-weight: bold;">Không có trang bị nào trong mục này.</div>';
        return;
    }

    items.forEach(item => {
        const row = document.createElement('div');
        row.className = 'trangbi-item-row';
        row.onclick = () => viewTrangBiDetail(item.code);
        
        const imgSrc = (item.code === 'VK_HongTiTuCham') 
            ? '/assets/ui/trangbi_authentic/item_hong_ti_tu_cham.png' 
            : ('/assets/images/' + item.code + '_trang_bi_to.png');

        row.innerHTML = `
            <div class="tb-item-icon-box">
                <img src="${imgSrc}" class="tb-item-img" alt="${item.name}" onerror="this.src='/assets/ui/trangbi_authentic/item_hong_ti_tu_cham.png'"/>
                <span class="tb-item-lvl">${item.level || 1}</span>
            </div>
            <div class="tb-item-info">
                <div class="tb-item-name">${item.name}</div>
                <div class="tb-item-stat-row">
                    <img src="/assets/ui/hero_info_authentic/icon_stat_${item.statIcon || 'sword'}.png" class="tb-stat-ico" alt="${item.statName || 'Công'}"/>
                    <span class="tb-stat-num">${item.statVal || 91}</span>
                </div>
                <img src="/assets/ui/dantran_authentic/badge_giap_purple.png" class="tb-badge-giap" alt="GIÁP"/>
            </div>
            <div class="tb-item-actions" onclick="event.stopPropagation()">
                <button class="tb-btn-act" onclick="dungLuyenItem('${item.id || item.code}')" title="Dung luyện">
                    <img src="/assets/ui/trangbi_authentic/btn_dung_luyen.png" alt="Dung luyện"/>
                </button>
                <button class="tb-btn-act" onclick="tinhLuyenItem('${item.id || item.code}')" title="Tinh luyện">
                    <img src="/assets/ui/trangbi_authentic/btn_tinh_luyen.png" alt="Tinh luyện"/>
                </button>
                <button class="tb-btn-act" onclick="cuongHoaItem('${item.id || item.code}')" title="Cường hóa">
                    <img src="/assets/ui/trangbi_authentic/btn_cuong_hoa_red.png" alt="Cường hóa"/>
                </button>
            </div>
        `;
        container.appendChild(row);
    });
}

function openPhanRaModal() {
    sound.play('click');
    alert('Phân Rã Trang Bị: Đang mở lò phân rã trang bị thừa để thu hồi Huyền Thiết và Điểm Tinh Luyện!');
}

function openBanModal() {
    sound.play('click');
    alert('Bán Trang Bị: Đang mở giao diện bán trang bị lấy Bạc!');
}

function dungLuyenItem(itemId) {
    sound.play('click');
    alert('Dung Luyện: Hợp nhất các trang bị cùng loại để thăng hoa phẩm chất!');
}

function tinhLuyenItem(itemId) {
    sound.play('tuyetchieu');
    alert('Tinh Luyện: Tẩy luyện thuộc tính quý hiếm thành công!');
}

function cuongHoaItem(itemId) {
    sound.play('tuyetchieu');
    alert('Cường Hóa: Trang bị đã được cường hóa tăng thêm cấp độ và uy lực!');
    renderTrangBiList();
}

function viewTrangBiDetail(code) {
    sound.play('click');
    alert('Chi Tiết Trang Bị: ' + code);
}

function renderItems() {
    renderTrangBiList();
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
function openKinhMachModal() {
    openKinhMachScreen();
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
    const khieuChienEl = document.getElementById('kyngo-view-khieuchien');
    const thuongNapEl = document.getElementById('kyngo-view-thuongnap');
    const thuongNhanEl = document.getElementById('kyngo-view-thuongnhan');
    const bongDaEl = document.getElementById('kyngo-view-bongda');
    const tamBaoEl = document.getElementById('kyngo-view-tambao');

    if (tab === 'theluc') {
        if (theLucEl) theLucEl.style.display = 'block';
        if (thuongTieuEl) thuongTieuEl.style.display = 'none';
        if (bauCuaEl) bauCuaEl.style.display = 'none';
        if (khieuChienEl) khieuChienEl.style.display = 'none';
        if (thuongNapEl) thuongNapEl.style.display = 'none';
        if (thuongNhanEl) thuongNhanEl.style.display = 'none';
        if (bongDaEl) bongDaEl.style.display = 'none';
        if (tamBaoEl) tamBaoEl.style.display = 'none';
    } else if (tab === 'tambao') {
        if (theLucEl) theLucEl.style.display = 'none';
        if (thuongTieuEl) thuongTieuEl.style.display = 'none';
        if (bauCuaEl) bauCuaEl.style.display = 'none';
        if (khieuChienEl) khieuChienEl.style.display = 'none';
        if (thuongNapEl) thuongNapEl.style.display = 'none';
        if (thuongNhanEl) thuongNhanEl.style.display = 'none';
        if (bongDaEl) bongDaEl.style.display = 'none';
        if (tamBaoEl) tamBaoEl.style.display = 'block';
        updateTamBaoUI();
    } else if (tab === 'bongda') {
        if (theLucEl) theLucEl.style.display = 'none';
        if (thuongTieuEl) thuongTieuEl.style.display = 'none';
        if (bauCuaEl) bauCuaEl.style.display = 'none';
        if (khieuChienEl) khieuChienEl.style.display = 'none';
        if (thuongNapEl) thuongNapEl.style.display = 'none';
        if (thuongNhanEl) thuongNhanEl.style.display = 'none';
        if (tamBaoEl) tamBaoEl.style.display = 'none';
        if (bongDaEl) bongDaEl.style.display = 'block';
        updateBongDaUI();
    } else if (tab === 'thuongnhan') {
        if (tamBaoEl) tamBaoEl.style.display = 'none';
        if (theLucEl) theLucEl.style.display = 'none';
        if (thuongTieuEl) thuongTieuEl.style.display = 'none';
        if (bauCuaEl) bauCuaEl.style.display = 'none';
        if (khieuChienEl) khieuChienEl.style.display = 'none';
        if (thuongNapEl) thuongNapEl.style.display = 'none';
        if (thuongNhanEl) thuongNhanEl.style.display = 'block';
        if (bongDaEl) bongDaEl.style.display = 'none';
        startThuongNhanCountdown();
        updateThuongNhanUI();
    } else if (tab === 'thuongnap') {
        if (tamBaoEl) tamBaoEl.style.display = 'none';
        if (theLucEl) theLucEl.style.display = 'none';
        if (thuongTieuEl) thuongTieuEl.style.display = 'none';
        if (bauCuaEl) bauCuaEl.style.display = 'none';
        if (khieuChienEl) khieuChienEl.style.display = 'none';
        if (thuongNapEl) thuongNapEl.style.display = 'block';
        if (thuongNhanEl) thuongNhanEl.style.display = 'none';
        if (bongDaEl) bongDaEl.style.display = 'none';
        startThuongNapCountdown();
        updateThuongNapUI();
    } else if (tab === 'thuongtieu') {
        if (tamBaoEl) tamBaoEl.style.display = 'none';
        if (theLucEl) theLucEl.style.display = 'none';
        if (thuongTieuEl) thuongTieuEl.style.display = 'block';
        if (bauCuaEl) bauCuaEl.style.display = 'none';
        if (khieuChienEl) khieuChienEl.style.display = 'none';
        if (thuongNapEl) thuongNapEl.style.display = 'none';
        if (thuongNhanEl) thuongNhanEl.style.display = 'none';
        if (bongDaEl) bongDaEl.style.display = 'none';
        startTltCountdown();
        updateTltSpentAmount();
    } else if (tab === 'baucua') {
        if (tamBaoEl) tamBaoEl.style.display = 'none';
        if (theLucEl) theLucEl.style.display = 'none';
        if (thuongTieuEl) thuongTieuEl.style.display = 'none';
        if (bauCuaEl) bauCuaEl.style.display = 'block';
        if (khieuChienEl) khieuChienEl.style.display = 'none';
        if (thuongNapEl) thuongNapEl.style.display = 'none';
        if (thuongNhanEl) thuongNhanEl.style.display = 'none';
        if (bongDaEl) bongDaEl.style.display = 'none';
        initBauCuaState();
    } else if (tab === 'khieuchien') {
        if (tamBaoEl) tamBaoEl.style.display = 'none';
        if (theLucEl) theLucEl.style.display = 'none';
        if (thuongTieuEl) thuongTieuEl.style.display = 'none';
        if (bauCuaEl) bauCuaEl.style.display = 'none';
        if (khieuChienEl) khieuChienEl.style.display = 'none';
        if (khieuChienEl) khieuChienEl.style.display = 'flex';
        if (thuongNapEl) thuongNapEl.style.display = 'none';
        if (thuongNhanEl) thuongNhanEl.style.display = 'none';
        if (bongDaEl) bongDaEl.style.display = 'none';
        startKhieuChienCountdown();
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
    } else if (tab === 'hkdetu') {
        openHoangKimDeTuScreen();
    } else if (tab === 'hkvocong') {
        openHoangKimVoCongScreen();
    } else if (tab === 'truyencong') {
        openTruyenCongScreen();
    } else if (tab === 'thamngo') {
        openThamNgoScreen();
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

// ================= 100% AUTHENTIC CHÂN KHÍ SYSTEM (MATCHING 3 ORIGINAL SCREENSHOTS) =================
const AUTHENTIC_CHANKHI_DATABASE = [
  {
    "id": "CK_HuyThien",
    "name": "Hủy Thiên",
    "desc": "Công Kích +110",
    "tier": 1,
    "type": "Cong",
    "statLabel": "Công kích",
    "base": 110,
    "growth": 110,
    "orb": "/assets/ui/chankhi_authentic/clean_orb_6.png"
  },
  {
    "id": "CK_HoThien",
    "name": "Hộ Thiên",
    "desc": "Phòng Thủ +90",
    "tier": 1,
    "type": "Thu",
    "statLabel": "Phòng thủ",
    "base": 90,
    "growth": 90,
    "orb": "/assets/ui/chankhi_authentic/clean_orb_6.png"
  },
  {
    "id": "CK_VanThien",
    "name": "Vạn Thiên",
    "desc": "Nội công +100",
    "tier": 1,
    "type": "NoiLuc",
    "statLabel": "Nội công",
    "base": 100,
    "growth": 100,
    "orb": "/assets/ui/chankhi_authentic/clean_orb_8.png"
  },
  {
    "id": "CK_TeThien",
    "name": "Tề Thiên",
    "desc": "Máu +200",
    "tier": 1,
    "type": "Mau",
    "statLabel": "Máu",
    "base": 200,
    "growth": 200,
    "orb": "/assets/ui/chankhi_authentic/clean_orb_8.png"
  },
  {
    "id": "CK_VoThuong",
    "name": "Vô Thương",
    "desc": "Phòng Thủ +50",
    "tier": 1,
    "type": "Thu",
    "statLabel": "Phòng thủ",
    "base": 50,
    "growth": 50,
    "orb": "/assets/ui/chankhi_authentic/clean_orb_6.png"
  },
  {
    "id": "CK_BatPha",
    "name": "Bất Phá",
    "desc": "Phòng Thủ +30",
    "tier": 2,
    "type": "Thu",
    "statLabel": "Phòng thủ",
    "base": 30,
    "growth": 30,
    "orb": "/assets/ui/chankhi_authentic/clean_orb_6.png"
  },
  {
    "id": "CK_ThanHo",
    "name": "Thần Hộ",
    "desc": "Phản Kích +15",
    "tier": 1,
    "type": "PhanKich",
    "statLabel": "Phản đòn",
    "base": 15,
    "growth": 15,
    "orb": "/assets/ui/chankhi_authentic/clean_orb_4.png"
  },
  {
    "id": "CK_TramLong",
    "name": "Trảm Long",
    "desc": "Phá Phản +18",
    "tier": 1,
    "type": "PhaPhan",
    "statLabel": "Phá phản",
    "base": 18,
    "growth": 18,
    "orb": "/assets/ui/chankhi_authentic/clean_orb_4.png"
  },
  {
    "id": "CK_ThienCo",
    "name": "Thiên Cổ",
    "desc": "Máu +100",
    "tier": 1,
    "type": "Mau",
    "statLabel": "Máu",
    "base": 100,
    "growth": 100,
    "orb": "/assets/ui/chankhi_authentic/clean_orb_8.png"
  },
  {
    "id": "CK_DietThe",
    "name": "Diệt Thế",
    "desc": "Công kích +50",
    "tier": 1,
    "type": "Cong",
    "statLabel": "Công kích",
    "base": 50,
    "growth": 50,
    "orb": "/assets/ui/chankhi_authentic/clean_orb_6.png"
  },
  {
    "id": "CK_VoCuc",
    "name": "Vô Cực",
    "desc": "Nội công +50",
    "tier": 1,
    "type": "NoiLuc",
    "statLabel": "Nội công",
    "base": 50,
    "growth": 50,
    "orb": "/assets/ui/chankhi_authentic/clean_orb_8.png"
  },
  {
    "id": "CK_HuyenBien",
    "name": "Huyền Biến",
    "desc": "Né +15",
    "tier": 1,
    "type": "TranhNe",
    "statLabel": "Né tránh",
    "base": 15,
    "growth": 15,
    "orb": "/assets/ui/chankhi_authentic/clean_orb_1.png"
  },
  {
    "id": "CK_PhanNhat",
    "name": "Phần Nhật",
    "desc": "Bạo kích +15",
    "tier": 1,
    "type": "BaoKich",
    "statLabel": "Bạo kích",
    "base": 15,
    "growth": 15,
    "orb": "/assets/ui/chankhi_authentic/clean_orb_3.png"
  },
  {
    "id": "CK_LuocHong",
    "name": "Lược Hồng",
    "desc": "Phòng bạo +18",
    "tier": 1,
    "type": "PhongBao",
    "statLabel": "Phòng bạo",
    "base": 18,
    "growth": 18,
    "orb": "/assets/ui/chankhi_authentic/clean_orb_2.png"
  },
  {
    "id": "CK_ThanNhan",
    "name": "Thần Nhãn",
    "desc": "Chính xác +18",
    "tier": 1,
    "type": "ChinhXac",
    "statLabel": "Chính xác",
    "base": 18,
    "growth": 18,
    "orb": "/assets/ui/chankhi_authentic/clean_orb_5.png"
  },
  {
    "id": "CK_BatTu",
    "name": "Bất Tử",
    "desc": "Máu +75",
    "tier": 2,
    "type": "Mau",
    "statLabel": "Máu",
    "base": 75,
    "growth": 75,
    "orb": "/assets/ui/chankhi_authentic/clean_orb_8.png"
  },
  {
    "id": "CK_CucVu",
    "name": "Cực Vũ",
    "desc": "Công kích +35",
    "tier": 2,
    "type": "Cong",
    "statLabel": "Công kích",
    "base": 35,
    "growth": 35,
    "orb": "/assets/ui/chankhi_authentic/clean_orb_6.png"
  },
  {
    "id": "CK_NhiepHon",
    "name": "Nhiếp hồn",
    "desc": "Nội công +35",
    "tier": 2,
    "type": "NoiLuc",
    "statLabel": "Nội công",
    "base": 35,
    "growth": 35,
    "orb": "/assets/ui/chankhi_authentic/clean_orb_8.png"
  },
  {
    "id": "CK_MeTung",
    "name": "Mê Tung",
    "desc": "Né +10",
    "tier": 2,
    "type": "TranhNe",
    "statLabel": "Né tránh",
    "base": 10,
    "growth": 10,
    "orb": "/assets/ui/chankhi_authentic/clean_orb_1.png"
  },
  {
    "id": "CK_ChanDia",
    "name": "Chấn địa",
    "desc": "Bạo kích +10",
    "tier": 2,
    "type": "BaoKich",
    "statLabel": "Bạo kích",
    "base": 10,
    "growth": 10,
    "orb": "/assets/ui/chankhi_authentic/clean_orb_3.png"
  },
  {
    "id": "CK_LangYen",
    "name": "Lăng Yên",
    "desc": "Phòng bạo +12",
    "tier": 2,
    "type": "PhongBao",
    "statLabel": "Phòng bạo",
    "base": 12,
    "growth": 12,
    "orb": "/assets/ui/chankhi_authentic/clean_orb_2.png"
  },
  {
    "id": "CK_DoatLinh",
    "name": "Đoạt Linh",
    "desc": "Chính xác +12",
    "tier": 2,
    "type": "ChinhXac",
    "statLabel": "Chính xác",
    "base": 12,
    "growth": 12,
    "orb": "/assets/ui/chankhi_authentic/clean_orb_5.png"
  },
  {
    "id": "CK_ThuTam",
    "name": "Thủ Tâm",
    "desc": "Phản +10",
    "tier": 2,
    "type": "PhanKich",
    "statLabel": "Phản đòn",
    "base": 10,
    "growth": 10,
    "orb": "/assets/ui/chankhi_authentic/clean_orb_4.png"
  },
  {
    "id": "CK_TranHai",
    "name": "Trấn Hải",
    "desc": "Phá phản +12",
    "tier": 2,
    "type": "PhaPhan",
    "statLabel": "Phá phản",
    "base": 12,
    "growth": 12,
    "orb": "/assets/ui/chankhi_authentic/clean_orb_4.png"
  },
  {
    "id": "CK_KhaiSon",
    "name": "Khai Sơn",
    "desc": "Công kích +25",
    "tier": 3,
    "type": "Cong",
    "statLabel": "Công kích",
    "base": 25,
    "growth": 25,
    "orb": "/assets/ui/chankhi_authentic/clean_orb_6.png"
  },
  {
    "id": "CK_KimCuong",
    "name": "Kim Cương",
    "desc": "Phòng thủ +20",
    "tier": 3,
    "type": "Thu",
    "statLabel": "Phòng thủ",
    "base": 20,
    "growth": 20,
    "orb": "/assets/ui/chankhi_authentic/clean_orb_6.png"
  },
  {
    "id": "CK_ThanhTam",
    "name": "Thanh Tâm",
    "desc": "Nội công +25",
    "tier": 3,
    "type": "NoiLuc",
    "statLabel": "Nội công",
    "base": 25,
    "growth": 25,
    "orb": "/assets/ui/chankhi_authentic/clean_orb_8.png"
  },
  {
    "id": "CK_AnhDon",
    "name": "Ảnh Độn",
    "desc": "Né +5",
    "tier": 3,
    "type": "TranhNe",
    "statLabel": "Né tránh",
    "base": 5,
    "growth": 5,
    "orb": "/assets/ui/chankhi_authentic/clean_orb_1.png"
  },
  {
    "id": "CK_NoDiem",
    "name": "Nộ Diễm",
    "desc": "Bạo kích +5",
    "tier": 3,
    "type": "BaoKich",
    "statLabel": "Bạo kích",
    "base": 5,
    "growth": 5,
    "orb": "/assets/ui/chankhi_authentic/clean_orb_3.png"
  },
  {
    "id": "CK_TruyHon",
    "name": "Truy Hồn",
    "desc": "Chính xác +6",
    "tier": 3,
    "type": "ChinhXac",
    "statLabel": "Chính xác",
    "base": 6,
    "growth": 6,
    "orb": "/assets/ui/chankhi_authentic/clean_orb_5.png"
  },
  {
    "id": "CK_PhaQuan",
    "name": "Phá Quân",
    "desc": "Công kích +15",
    "tier": 4,
    "type": "Cong",
    "statLabel": "Công kích",
    "base": 15,
    "growth": 15,
    "orb": "/assets/ui/chankhi_authentic/clean_orb_6.png"
  },
  {
    "id": "CK_NgungMach",
    "name": "Ngưng mạch",
    "desc": "Nội công +15",
    "tier": 4,
    "type": "NoiLuc",
    "statLabel": "Nội công",
    "base": 15,
    "growth": 15,
    "orb": "/assets/ui/chankhi_authentic/clean_orb_8.png"
  },
  {
    "id": "CK_ThietCot",
    "name": "Thiết Cốt",
    "desc": "Phòng thủ +10",
    "tier": 4,
    "type": "Thu",
    "statLabel": "Phòng thủ",
    "base": 10,
    "growth": 10,
    "orb": "/assets/ui/chankhi_authentic/clean_orb_6.png"
  },
  {
    "id": "CK_DiHinh",
    "name": "Di hình",
    "desc": "Né +3",
    "tier": 4,
    "type": "TranhNe",
    "statLabel": "Né tránh",
    "base": 3,
    "growth": 3,
    "orb": "/assets/ui/chankhi_authentic/clean_orb_1.png"
  },
  {
    "id": "CK_SongThuocTinh",
    "name": "Vô Song",
    "desc": "",
    "tier": 1,
    "type": "Cong",
    "statLabel": "Công kích",
    "base": 1,
    "growth": 1,
    "orb": "/assets/ui/chankhi_authentic/clean_orb_6.png"
  }
];

let currentChanKhiDiscipleIndex = 0;
let currentSelectedChanKhiSlot = 0;

const CHANKHI_DISCIPLES = [
    {
        code: 'NV_HungBa',
        name: 'Hùng Bá',
        level: 490,
        enhancement: '+0',
        hpText: '69643358341 / 120874070012',
        hpVal: 30932,
        atkVal: 12913,
        defVal: 12401,
        intVal: 44532,
        slots: [
            { id: 'CK_HuyenBien', name: 'Huyền Biến', level: 20, orb: '/assets/ui/chankhi_authentic/clean_orb_1.png', type: 'TranhNe', statLabel: 'Né tránh', bonus: 300 },
            { id: 'CK_LuocHong', name: 'Lược Hồng', level: 20, orb: '/assets/ui/chankhi_authentic/clean_orb_2.png', type: 'PhongBao', statLabel: 'Phòng bạo', bonus: 360 },
            { id: 'CK_PhanNhat', name: 'Phần Nhật', level: 20, orb: '/assets/ui/chankhi_authentic/clean_orb_3.png', type: 'BaoKich', statLabel: 'Bạo kích', bonus: 4000 },
            { id: 'CK_SongThuocTinh', name: 'Vô Song', level: 20, orb: '/assets/ui/chankhi_authentic/clean_orb_4.png', type: 'PhanKich', statLabel: 'Phản đòn', bonus: 300 },
            { id: 'CK_ThanNhan', name: 'Thần Nhãn', level: 20, orb: '/assets/ui/chankhi_authentic/clean_orb_5.png', type: 'ChinhXac', statLabel: 'Chính xác', bonus: 360 },
            { id: 'CK_DietThe', name: 'Tà Diệt', level: 20, orb: '/assets/ui/chankhi_authentic/clean_orb_6.png', type: 'Cong', statLabel: 'Kháng bạo', bonus: 20 },
            null,
            { id: 'CK_VoCuc', name: 'Kình Ma', level: 20, orb: '/assets/ui/chankhi_authentic/clean_orb_8.png', type: 'NoiLuc', statLabel: 'Nội công', bonus: 1000 }
        ]
    },
    {
        code: 'NV_DongPhuongBatBai',
        name: 'Đông Phương Bất Bại',
        level: 568,
        enhancement: '+5',
        hpText: '88294102931 / 150938102931',
        hpVal: 38200,
        atkVal: 21500,
        defVal: 16800,
        intVal: 59200,
        slots: [
            { id: 'CK_HuyThien', name: 'Hủy Thiên', level: 20, orb: '/assets/ui/chankhi_authentic/clean_orb_6.png', type: 'Cong', statLabel: 'Công kích', bonus: 2200 },
            { id: 'CK_PhanNhat', name: 'Phần Nhật', level: 20, orb: '/assets/ui/chankhi_authentic/clean_orb_3.png', type: 'BaoKich', statLabel: 'Bạo kích', bonus: 4000 },
            { id: 'CK_HuyenBien', name: 'Huyền Biến', level: 20, orb: '/assets/ui/chankhi_authentic/clean_orb_1.png', type: 'TranhNe', statLabel: 'Né tránh', bonus: 300 },
            { id: 'CK_LuocHong', name: 'Lược Hồng', level: 20, orb: '/assets/ui/chankhi_authentic/clean_orb_2.png', type: 'PhongBao', statLabel: 'Phòng bạo', bonus: 360 },
            { id: 'CK_ThanNhan', name: 'Thần Nhãn', level: 20, orb: '/assets/ui/chankhi_authentic/clean_orb_5.png', type: 'ChinhXac', statLabel: 'Chính xác', bonus: 360 },
            { id: 'CK_SongThuocTinh', name: 'Vô Song', level: 20, orb: '/assets/ui/chankhi_authentic/clean_orb_4.png', type: 'PhanKich', statLabel: 'Phản đòn', bonus: 300 },
            null,
            { id: 'CK_VanThien', name: 'Vạn Thiên', level: 20, orb: '/assets/ui/chankhi_authentic/clean_orb_8.png', type: 'NoiLuc', statLabel: 'Nội công', bonus: 2000 }
        ]
    },
    {
        code: 'NV_TayMonXuyTuyet',
        name: 'Tây Môn Xuy Tuyết',
        level: 537,
        enhancement: '+3',
        hpText: '75294102931 / 130938102931',
        hpVal: 34100,
        atkVal: 19800,
        defVal: 15200,
        intVal: 48900,
        slots: [
            { id: 'CK_HuyThien', name: 'Hủy Thiên', level: 20, orb: '/assets/ui/chankhi_authentic/clean_orb_6.png', type: 'Cong', statLabel: 'Công kích', bonus: 2200 },
            { id: 'CK_ThanNhan', name: 'Thần Nhãn', level: 20, orb: '/assets/ui/chankhi_authentic/clean_orb_5.png', type: 'ChinhXac', statLabel: 'Chính xác', bonus: 360 },
            { id: 'CK_PhanNhat', name: 'Phần Nhật', level: 20, orb: '/assets/ui/chankhi_authentic/clean_orb_3.png', type: 'BaoKich', statLabel: 'Bạo kích', bonus: 4000 },
            { id: 'CK_LuocHong', name: 'Lược Hồng', level: 20, orb: '/assets/ui/chankhi_authentic/clean_orb_2.png', type: 'PhongBao', statLabel: 'Phòng bạo', bonus: 360 },
            { id: 'CK_HuyenBien', name: 'Huyền Biến', level: 20, orb: '/assets/ui/chankhi_authentic/clean_orb_1.png', type: 'TranhNe', statLabel: 'Né tránh', bonus: 300 },
            { id: 'CK_SongThuocTinh', name: 'Vô Song', level: 20, orb: '/assets/ui/chankhi_authentic/clean_orb_4.png', type: 'PhanKich', statLabel: 'Phản đòn', bonus: 300 },
            null,
            { id: 'CK_VoCuc', name: 'Vô Cực', level: 20, orb: '/assets/ui/chankhi_authentic/clean_orb_8.png', type: 'NoiLuc', statLabel: 'Nội công', bonus: 1000 }
        ]
    }
];

function openChanKhiScreen(targetCode) {
    sound.play('click');
    if (targetCode) {
        const idx = CHANKHI_DISCIPLES.findIndex(d => d.code === targetCode);
        if (idx !== -1) currentChanKhiDiscipleIndex = idx;
    }
    const scr = document.getElementById('chankhi-screen');
    if (scr) {
        scr.classList.add('active');
        renderChanKhiScreen();
    }
}

function closeChanKhiScreen() {
    sound.play('click');
    const scr = document.getElementById('chankhi-screen');
    if (scr) scr.classList.remove('active');
}

// Override openChanKhiModal to show the authentic screen
function openChanKhiModal() {
    openChanKhiScreen();
}

function switchChanKhiDisciple() {
    sound.play('click');
    currentChanKhiDiscipleIndex = (currentChanKhiDiscipleIndex + 1) % CHANKHI_DISCIPLES.length;
    renderChanKhiScreen();
}

function renderChanKhiScreen() {
    const d = CHANKHI_DISCIPLES[currentChanKhiDiscipleIndex];
    if (!d) return;

    // Disciple switcher top right
    const switcherAva = document.getElementById('ck-switcher-ava');
    if (switcherAva) {
        const nextIdx = (currentChanKhiDiscipleIndex + 1) % CHANKHI_DISCIPLES.length;
        const nextD = CHANKHI_DISCIPLES[nextIdx];
        switcherAva.src = `/assets/images/${nextD.code}_ava_to.png`;
    }

    // Center scroll painting
    const calligraphy = document.getElementById('ck-disciple-calligraphy');
    if (calligraphy) calligraphy.textContent = d.name;

    const discipleImg = document.getElementById('ck-disciple-img');
    if (discipleImg) discipleImg.src = `/assets/images/${d.code}_ava_to.png`;

    const lvlEl = document.getElementById('ck-disciple-lvl');
    if (lvlEl) lvlEl.textContent = d.level;

    const hpEl = document.getElementById('ck-disciple-hp');
    if (hpEl) hpEl.textContent = d.hpText;

    const statHp = document.getElementById('ck-stat-hp');
    if (statHp) statHp.textContent = d.hpVal;

    const statAtk = document.getElementById('ck-stat-atk');
    if (statAtk) statAtk.textContent = d.atkVal;

    const statDef = document.getElementById('ck-stat-def');
    if (statDef) statDef.textContent = d.defVal;

    const statInt = document.getElementById('ck-stat-int');
    if (statInt) statInt.textContent = d.intVal;

    // Render 8 Slots
    d.slots.forEach((s, idx) => {
        const imgEl = document.getElementById(`ck-slot-img-${idx}`);
        const lvlTag = document.getElementById(`ck-slot-lvl-${idx}`);
        const nameEl = document.getElementById(`ck-slot-name-${idx}`);

        if (s) {
            if (imgEl) {
                imgEl.src = s.orb || '/assets/ui/chankhi_authentic/clean_orb_1.png';
                imgEl.style.opacity = '1';
            }
            if (lvlTag) {
                lvlTag.textContent = s.level || 20;
                lvlTag.style.display = 'block';
            }
            if (nameEl) {
                nameEl.textContent = s.name;
                nameEl.style.color = '#fef08a';
            }
        } else {
            if (imgEl) {
                imgEl.src = '/assets/ui/chankhi_authentic/clean_orb_7.png';
                imgEl.style.opacity = '0.6';
            }
            if (lvlTag) {
                lvlTag.style.display = 'none';
            }
            if (nameEl) {
                nameEl.textContent = 'Trống';
                nameEl.style.color = '#a8a29e';
            }
        }
    });

    // Auxiliary stats on disciple
    updateChanKhiAuxStats(d);
}

function updateChanKhiAuxStats(d) {
    let neTranh = 0, phanDon = 0, phongBao = 0, baoKich = 0, chinhXac = 0, khangBao = 0;
    d.slots.forEach(s => {
        if (!s) return;
        if (s.type === 'TranhNe') neTranh += s.bonus || (s.level * 15);
        else if (s.type === 'PhongBao') phongBao += s.bonus || (s.level * 18);
        else if (s.type === 'BaoKich') baoKich += s.bonus || (s.level * 15);
        else if (s.type === 'PhanKich') phanDon += s.bonus || (s.level * 15);
        else if (s.type === 'ChinhXac') chinhXac += s.bonus || (s.level * 18);
        else if (s.statLabel === 'Kháng bạo') khangBao += s.bonus || 20;
    });

    const elNe = document.getElementById('ck-aux-netranh');
    if (elNe) elNe.textContent = neTranh ? `+${neTranh}` : '+300';

    const elPhan = document.getElementById('ck-aux-phandon');
    if (elPhan) elPhan.textContent = phanDon ? `+${phanDon}` : '+300';

    const elPhong = document.getElementById('ck-aux-phongbao');
    if (elPhong) elPhong.textContent = phongBao ? `+${phongBao}` : '+360';

    const elBao = document.getElementById('ck-aux-baokich');
    if (elBao) elBao.textContent = baoKich ? `${baoKich}` : '4000';

    const elChinh = document.getElementById('ck-aux-chinhxac');
    if (elChinh) elChinh.textContent = chinhXac ? `+${chinhXac}` : '+360';

    const elKhang = document.getElementById('ck-aux-khangbao');
    if (elKhang) elKhang.textContent = khangBao ? `${khangBao}` : '20';
}

// ================= MODAL: THÔNG TIN CHÂN KHÍ =================
function openChanKhiDetailModal(slotIndex) {
    sound.play('click');
    currentSelectedChanKhiSlot = slotIndex;
    const d = CHANKHI_DISCIPLES[currentChanKhiDiscipleIndex];
    const s = d.slots[slotIndex];

    const modal = document.getElementById('modal-chankhi-detail');
    if (!modal) return;

    const orbImg = document.getElementById('ck-modal-orb-img');
    const nameEl = document.getElementById('ck-modal-name');
    const lvlEl = document.getElementById('ck-modal-lvl');
    const tagEl = document.getElementById('ck-modal-stat-tag');
    const valEl = document.getElementById('ck-modal-stat-val');

    if (s) {
        if (orbImg) orbImg.src = s.orb || '/assets/ui/chankhi_authentic/clean_modal_orb.png';
        if (nameEl) nameEl.textContent = s.name;
        if (lvlEl) lvlEl.textContent = `Cấp: ${s.level || 20}`;
        if (tagEl) tagEl.textContent = s.statLabel || 'Thuộc tính';
        if (valEl) valEl.textContent = `+${s.bonus || (s.level * 18)}`;
    } else {
        if (orbImg) orbImg.src = '/assets/ui/chankhi_authentic/clean_orb_7.png';
        if (nameEl) nameEl.textContent = 'Ô Trống';
        if (lvlEl) lvlEl.textContent = 'Cấp: 0';
        if (tagEl) tagEl.textContent = 'Chưa khảm';
        if (valEl) valEl.textContent = '+0';
    }

    modal.classList.add('active');
}

function closeChanKhiDetailModal() {
    sound.play('click');
    const modal = document.getElementById('modal-chankhi-detail');
    if (modal) modal.classList.remove('active');
}

function doUpgradeCurrentChanKhi() {
    const d = CHANKHI_DISCIPLES[currentChanKhiDiscipleIndex];
    let s = d.slots[currentSelectedChanKhiSlot];
    if (!s) {
        alert('Ô này đang trống! Hãy bấm [Đổi Chân khí] để khảm Chân khí mới.');
        return;
    }

    if (s.level >= 20) {
        alert(`Chân khí [${s.name}] đã đạt cấp tối đa (Cấp 20)!`);
        return;
    }

    sound.play('levelup');
    s.level = (s.level || 1) + 1;
    // Growth increase
    const growth = 18;
    s.bonus = (s.bonus || 0) + growth;

    // Update modal
    const lvlEl = document.getElementById('ck-modal-lvl');
    if (lvlEl) lvlEl.textContent = `Cấp: ${s.level}`;
    const valEl = document.getElementById('ck-modal-stat-val');
    if (valEl) valEl.textContent = `+${s.bonus}`;

    renderChanKhiScreen();
    alert(`✨ Chúc mừng! Chân khí [${s.name}] đã thăng lên Cấp ${s.level}, tăng thêm ${growth} ${s.statLabel}!`);
}

// ================= MODAL: KHO CHÂN KHÍ =================
function openChanKhiInventory() {
    sound.play('click');
    const invModal = document.getElementById('modal-chankhi-inventory');
    if (!invModal) return;

    const listEl = document.getElementById('ck-inventory-list');
    if (listEl) {
        listEl.innerHTML = AUTHENTIC_CHANKHI_DATABASE.map(item => {
            const tierColor = item.tier === 1 ? '#eab308' : item.tier === 2 ? '#c084fc' : item.tier === 3 ? '#38bdf8' : '#4ade80';
            const tierName = item.tier === 1 ? 'Giáp' : item.tier === 2 ? 'Ất' : item.tier === 3 ? 'Bính' : 'Đinh';
            return `
                <div class="ck-inv-item" onclick="equipChanKhiToSlot('${item.id}')">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <img src="${item.orb}" style="width: 38px; height: 38px; object-fit: contain; filter: drop-shadow(0 0 4px rgba(0,0,0,0.6));" />
                        <div>
                            <div style="font-weight: 900; color: #451a03; font-size: 13px;">
                                ${item.name} <span style="font-size: 10px; color: ${tierColor}; border: 1px solid ${tierColor}; padding: 0 4px; border-radius: 3px;">${tierName}</span>
                            </div>
                            <div style="font-size: 11px; color: #78350f;">${item.desc}</div>
                        </div>
                    </div>
                    <button class="btn-wuxia-gold" style="width: 72px; height: 30px; font-size: 11px; padding: 0;">Trang bị</button>
                </div>
            `;
        }).join('');
    }

    invModal.classList.add('active');
}

function closeChanKhiInventory() {
    sound.play('click');
    const invModal = document.getElementById('modal-chankhi-inventory');
    if (invModal) invModal.classList.remove('active');
}

function equipChanKhiToSlot(ckId) {
    sound.play('equip');
    const item = AUTHENTIC_CHANKHI_DATABASE.find(x => x.id === ckId);
    if (!item) return;

    const d = CHANKHI_DISCIPLES[currentChanKhiDiscipleIndex];
    d.slots[currentSelectedChanKhiSlot] = {
        id: item.id,
        name: item.name,
        level: 20,
        orb: item.orb,
        type: item.type,
        statLabel: item.statLabel,
        bonus: item.growth * 20
    };

    closeChanKhiInventory();
    openChanKhiDetailModal(currentSelectedChanKhiSlot);
    renderChanKhiScreen();
}

// ================= 100% AUTHENTIC KINH MẠCH SYSTEM (MATCHING 4 ORIGINAL SCREENSHOTS) =================
const AUTHENTIC_KIMCHAM_DATABASE = [
  {
    "id": "KC_ThanMoc",
    "name": "Thần Mộc Châm",
    "desc": "Chế tạo từ thần mộc ngàn năm ở Thiên Sơn, cứng cáp mà dẻo dai lạ thường.",
    "statType": "Mau",
    "statLabel": "Khí huyết",
    "statIcon": "🩸",
    "base": 40,
    "growth": 40,
    "icon": "/assets/ui/kinhmach_authentic/clean_item_thanmoc_frame.png"
  },
  {
    "id": "KC_HoaThach",
    "name": "Hỏa Thạch Châm",
    "desc": "Chế tạo từ đá núi lửa ngoài khơi Đông Hải, chịu nhiệt cực tốt.",
    "statType": "Cong",
    "statLabel": "Võ công",
    "statIcon": "⚔️",
    "base": 20,
    "growth": 20,
    "icon": "/assets/ui/kinhmach_authentic/clean_item_thanmoc_frame.png"
  },
  {
    "id": "KC_HanNgan",
    "name": "Hàn Ngân Châm",
    "desc": "Chế tạo từ bạc nguyên chất đã tôi luyện ngàn năm ở Tuyết Sơn.",
    "statType": "Thu",
    "statLabel": "Phòng thủ",
    "statIcon": "🛡️",
    "base": 20,
    "growth": 20,
    "icon": "/assets/ui/kinhmach_authentic/clean_item_thanmoc_frame.png"
  },
  {
    "id": "KC_TuKim",
    "name": "Tử Kim Châm",
    "desc": "Chế tạo từ kim loại đỏ quý hiếm núi Côn Lôn, đã hấp thụ tinh hoa trời đất.",
    "statType": "NoiLuc",
    "statLabel": "Nội công",
    "statIcon": "🌀",
    "base": 20,
    "growth": 20,
    "icon": "/assets/ui/kinhmach_authentic/clean_item_thanmoc_frame.png"
  },
  {
    "id": "KC_HacMoc",
    "name": "Hắc Mộc Châm",
    "desc": "Chế tạo từ gỗ đen ngàn năm tại Tây Vực, đao thương bất nhập, thủy hỏa bất xâm.",
    "statType": "ChinhXac",
    "statLabel": "Chính xác",
    "statIcon": "🎯",
    "base": 6,
    "growth": 6,
    "icon": "/assets/ui/kinhmach_authentic/clean_item_thanmoc_frame.png"
  },
  {
    "id": "KC_LinhMoc",
    "name": "Linh Mộc Châm",
    "desc": "Chế tạo từ cây thần ở dãy núi Trường Bạch ngàn năm, tự bản thân có linh tính dị thường.",
    "statType": "TranhNe",
    "statLabel": "Né tránh",
    "statIcon": "💨",
    "base": 5,
    "growth": 5,
    "icon": "/assets/ui/kinhmach_authentic/clean_item_thanmoc_frame.png"
  },
  {
    "id": "KC_TinhThach",
    "name": "Tinh Thạch Châm",
    "desc": "Chế tạo từ thiên thạch từ thiên ngoại xa xăm bay đến, vô cùng rắn chắc.",
    "statType": "PhanKich",
    "statLabel": "Phản đòn",
    "statIcon": "🔄",
    "base": 5,
    "growth": 5,
    "icon": "/assets/ui/kinhmach_authentic/clean_item_thanmoc_frame.png"
  },
  {
    "id": "KC_HuyetThach",
    "name": "Huyết Thạch Châm",
    "desc": "Chế tạo từ Huyết Thạch trong truyền thuyết, có thể hút và tích tụ máu người.",
    "statType": "PhaPhan",
    "statLabel": "Phá phản",
    "statIcon": "⚡",
    "base": 6,
    "growth": 6,
    "icon": "/assets/ui/kinhmach_authentic/clean_item_thanmoc_frame.png"
  },
  {
    "id": "KC_HuyenThiet",
    "name": "Huyền Thiết Châm",
    "desc": "Chế tạo từ Huyền Thiết, cùng loại với thanh danh kiếm của Độc Cô Cầu Bại. ",
    "statType": "BaoKich",
    "statLabel": "Bạo kích",
    "statIcon": "💥",
    "base": 5,
    "growth": 5,
    "icon": "/assets/ui/kinhmach_authentic/clean_item_thanmoc_frame.png"
  },
  {
    "id": "KC_HanThiet",
    "name": "Hàn Thiết Châm",
    "desc": "Chế tạo từ kim loại ở Bắc Cực, đã hấp thụ hàn khí ngàn năm, tự bản thân tỏa khí lạnh dị thường.",
    "statType": "PhongBao",
    "statLabel": "Phòng bạo",
    "statIcon": "🔰",
    "base": 6,
    "growth": 6,
    "icon": "/assets/ui/kinhmach_authentic/clean_item_thanmoc_frame.png"
  }
];

let currentKinhMachDiscipleIndex = 0;
let currentSelectedNeedleSlot = 0;

const KINHMACH_DISCIPLES = [
    {
        code: 'NV_HungBa',
        name: 'Hùng Bá',
        scrollBg: '/assets/ui/kinhmach_authentic/scroll_kinhmach_hungba.png',
        hpVal: 103198,
        atkVal: 52101,
        defVal: 455995,
        intVal: 8388513,
        meridians: ['10', '', '11', '10'],
        slots: [
            { id: 'KC_ThanMoc', name: 'Thần Mộc Châm', stat: '🩸 Khí huyết +1000', statType: 'Mau', bonus: 1000, desc: 'Chế tạo từ thần mộc ngàn năm ở Thiên Sơn, cứng cáp mà dẻo dai lạ thường.', icon: '/assets/ui/kinhmach_authentic/clean_slot_l1_equipped.png' },
            { id: 'KC_HoaThach', name: 'Hỏa Thạch Châm', stat: '⚔️ Võ công +500', statType: 'Cong', bonus: 500, desc: 'Chế tạo từ đá núi lửa ngoài khơi Đông Hải, chịu nhiệt cực tốt.', icon: '/assets/ui/kinhmach_authentic/clean_slot_l2_equipped.png' },
            { id: 'KC_HanNgan', name: 'Hàn Ngân Châm', stat: '🛡️ Phòng thủ +500', statType: 'Thu', bonus: 500, desc: 'Chế tạo từ bạc nguyên chất đã tôi luyện ngàn năm ở Tuyết Sơn.', icon: '/assets/ui/kinhmach_authentic/clean_slot_l3_equipped.png' },
            { id: 'KC_TuKim', name: 'Tử Kim Châm', stat: '🌀 Nội công +500', statType: 'NoiLuc', bonus: 500, desc: 'Chế tạo từ kim loại đỏ quý hiếm núi Côn Lôn, đã hấp thụ tinh hoa trời đất.', icon: '/assets/ui/kinhmach_authentic/clean_slot_l4_equipped.png' },
            { id: 'KC_HacMoc', name: 'Hắc Mộc Châm', stat: '🎯 Chính xác +150', statType: 'ChinhXac', bonus: 150, desc: 'Chế tạo từ gỗ đen ngàn năm tại Tây Vực, đao thương bất nhập, thủy hỏa bất xâm.', icon: '/assets/ui/kinhmach_authentic/clean_slot_r1_equipped.png' },
            { id: 'KC_LinhMoc', name: 'Linh Mộc Châm', stat: '💨 Né tránh +125', statType: 'TranhNe', bonus: 125, desc: 'Chế tạo từ cây thần ở dãy núi Trường Bạch ngàn năm, tự bản thân có linh tính dị thường.', icon: '/assets/ui/kinhmach_authentic/clean_slot_r2_equipped.png' },
            { id: 'KC_TinhThach', name: 'Tinh Thạch Châm', stat: '🔄 Phản đòn +125', statType: 'PhanKich', bonus: 125, desc: 'Chế tạo từ thiên thạch từ thiên ngoại xa xăm bay đến, vô cùng rắn chắc.', icon: '/assets/ui/kinhmach_authentic/clean_slot_r3_equipped.png' },
            { id: 'KC_HuyetThach', name: 'Huyết Thạch Châm', stat: '⚡ Phá phản +150', statType: 'PhaPhan', bonus: 150, desc: 'Chế tạo từ Huyết Thạch trong truyền thuyết, có thể hút và tích tụ máu người.', icon: '/assets/ui/kinhmach_authentic/clean_slot_r4_equipped.png' }
        ]
    },
    {
        code: 'NV_DongPhuongBatBai',
        name: 'Đông Phương Bất Bại',
        scrollBg: '/assets/ui/kinhmach_authentic/scroll_kinhmach_alt.png',
        hpVal: 335794,
        atkVal: 8629,
        defVal: 14842,
        intVal: 34728,
        meridians: ['', '', '', ''],
        slots: [
            null,
            null,
            null,
            { cracked: true },
            null,
            { cracked: true },
            null,
            null
        ]
    },
    {
        code: 'NV_TayMonXuyTuyet',
        name: 'Tây Môn Xuy Tuyết',
        scrollBg: '/assets/ui/kinhmach_authentic/scroll_kinhmach_hungba.png',
        hpVal: 309221,
        atkVal: 12913,
        defVal: 12401,
        intVal: 43487,
        meridians: ['', '', '11', ''],
        slots: [
            { id: 'KC_ThanMoc', name: 'Thần Mộc Châm', stat: '🩸 Khí huyết +1000', statType: 'Mau', bonus: 1000, desc: 'Chế tạo từ thần mộc ngàn năm ở Thiên Sơn, cứng cáp mà dẻo dai lạ thường.', icon: '/assets/ui/kinhmach_authentic/clean_slot_l1_equipped.png' },
            { id: 'KC_HoaThach', name: 'Hỏa Thạch Châm', stat: '⚔️ Võ công +500', statType: 'Cong', bonus: 500, desc: 'Chế tạo từ đá núi lửa ngoài khơi Đông Hải, chịu nhiệt cực tốt.', icon: '/assets/ui/kinhmach_authentic/clean_slot_l2_equipped.png' },
            { id: 'KC_HanNgan', name: 'Hàn Ngân Châm', stat: '🛡️ Phòng thủ +500', statType: 'Thu', bonus: 500, desc: 'Chế tạo từ bạc nguyên chất đã tôi luyện ngàn năm ở Tuyết Sơn.', icon: '/assets/ui/kinhmach_authentic/clean_slot_l3_equipped.png' },
            null,
            { id: 'KC_TuKim', name: 'Tử Kim Châm', stat: '🌀 Nội công +500', statType: 'NoiLuc', bonus: 500, desc: 'Chế tạo từ kim loại đỏ quý hiếm núi Côn Lôn, đã hấp thụ tinh hoa trời đất.', icon: '/assets/ui/kinhmach_authentic/clean_slot_r1_equipped.png' },
            { id: 'KC_HacMoc', name: 'Hắc Mộc Châm', stat: '🎯 Chính xác +150', statType: 'ChinhXac', bonus: 150, desc: 'Chế tạo từ gỗ đen ngàn năm tại Tây Vực, đao thương bất nhập, thủy hỏa bất xâm.', icon: '/assets/ui/kinhmach_authentic/clean_slot_r2_equipped.png' },
            null,
            null
        ]
    }
];

function openKinhMachScreen(discipleIdx) {
    sound.play('click');
    if (discipleIdx !== undefined) {
        currentKinhMachDiscipleIndex = discipleIdx;
    }
    const scr = document.getElementById('kinhmach-screen');
    if (scr) {
        scr.classList.add('active');
        renderKinhMachScreen();
    }
}

function closeKinhMachScreen() {
    sound.play('click');
    const scr = document.getElementById('kinhmach-screen');
    if (scr) scr.classList.remove('active');
}

// Override openKinhMachModal to open authentic Kinh Mạch screen
function openKinhMachModal() {
    openKinhMachScreen();
}

function switchKinhMachDisciple(idx) {
    sound.play('click');
    currentKinhMachDiscipleIndex = idx;
    renderKinhMachScreen();
}

function renderKinhMachScreen() {
    const d = KINHMACH_DISCIPLES[currentKinhMachDiscipleIndex];
    if (!d) return;

    // Update active border on top roster avatars
    for (let i = 0; i < 3; i++) {
        const btn = document.getElementById(`km-roster-btn-${i}`);
        if (btn) {
            if (i === currentKinhMachDiscipleIndex) btn.classList.add('active');
            else btn.classList.remove('active');
        }
    }

    // Update center scroll background
    const scrollBody = document.getElementById('km-scroll-body');
    if (scrollBody) {
        scrollBody.style.backgroundImage = `url('${d.scrollBg}')`;
    }

    // Update primary stats
    const statHp = document.getElementById('km-stat-hp');
    if (statHp) statHp.textContent = d.hpVal;

    const statAtk = document.getElementById('km-stat-atk');
    if (statAtk) statAtk.textContent = d.atkVal;

    const statDef = document.getElementById('km-stat-def');
    if (statDef) statDef.textContent = d.defVal;

    const statInt = document.getElementById('km-stat-int');
    if (statInt) statInt.textContent = d.intVal;

    // Update 4 Meridian level texts
    for (let m = 0; m < 4; m++) {
        const mEl = document.getElementById(`km-meridian-lvl-${m}`);
        if (mEl) mEl.textContent = d.meridians[m] || '';
    }

    // Update 8 slots
    d.slots.forEach((s, idx) => {
        const imgEl = document.getElementById(`km-slot-img-${idx}`);
        if (!imgEl) return;

        if (s && !s.cracked) {
            imgEl.src = s.icon || '/assets/ui/kinhmach_authentic/clean_slot_l1_equipped.png';
        } else if (s && s.cracked) {
            imgEl.src = '/assets/ui/kinhmach_authentic/clean_slot_cracked_seal.png';
        } else {
            imgEl.src = '/assets/ui/kinhmach_authentic/clean_slot_question_box.png';
        }
    });
}

// ================= MODAL: THÔNG TIN KIM CHÂM =================
function openKimChamDetailModal(slotIdx) {
    sound.play('click');
    currentSelectedNeedleSlot = slotIdx;
    const d = KINHMACH_DISCIPLES[currentKinhMachDiscipleIndex];
    const s = d.slots[slotIdx];

    if (!s) {
        // Empty slot with question box -> Open needle inventory to pierce
        openChonKimChamScreen(currentSelectedNeedleSlot);
        return;
    }

    if (s.cracked) {
        // Cracked seal -> Prompt to unblock/pierce meridian
        const confirmUnblock = confirm(`Huyệt vị này đang bị phong ấn bế tắc! Chưởng môn có muốn dùng Chân Khí để đả thông khai mở ô này không?`);
        if (confirmUnblock) {
            sound.play('renxong');
            d.slots[slotIdx] = null; // Unblocked into open slot
            renderKinhMachScreen();
            alert('✨ Chúc mừng! Đã đả thông huyệt đạo thành công! Hãy chọn Kim Châm để châm cứu gia tăng công lực.');
            openChonKimChamScreen(currentSelectedNeedleSlot);
        }
        return;
    }

    // Occupied needle slot -> Open detail modal
    const modal = document.getElementById('modal-kimcham-detail');
    if (!modal) return;

    const nameEl = document.getElementById('km-modal-needle-name');
    if (nameEl) nameEl.textContent = s.name;

    const statEl = document.getElementById('km-modal-needle-stat');
    if (statEl) statEl.textContent = s.stat;

    const inuseEl = document.getElementById('km-modal-needle-inuse');
    if (inuseEl) inuseEl.textContent = `${d.name} đang sử dụng`;

    const descEl = document.getElementById('km-modal-needle-desc');
    if (descEl) descEl.textContent = s.desc;

    modal.classList.add('active');
}

function closeKimChamDetailModal() {
    sound.play('click');
    const modal = document.getElementById('modal-kimcham-detail');
    if (modal) modal.classList.remove('active');
}

function doRemoveKimCham() {
    sound.play('click');
    const d = KINHMACH_DISCIPLES[currentKinhMachDiscipleIndex];
    const s = d.slots[currentSelectedNeedleSlot];
    if (!s) return;

    const needleName = s.name;
    d.slots[currentSelectedNeedleSlot] = null; // Revert to empty question slot

    closeKimChamDetailModal();
    renderKinhMachScreen();
    alert(`✨ Đã rút [${needleName}] thành công! Đã trả về túi Kim Châm của môn phái.`);
}

// ================= MODAL: KHO KIM CHÂM =================
function openKimChamInventory() {
    sound.play('click');
    const invModal = document.getElementById('modal-kimcham-inventory');
    if (!invModal) return;

    const listEl = document.getElementById('km-inventory-list');
    if (listEl) {
        listEl.innerHTML = AUTHENTIC_KIMCHAM_DATABASE.map(item => {
            return `
                <div class="km-inv-item" onclick="equipKimChamToSlot('${item.id}')">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <img src="/assets/ui/kinhmach_authentic/clean_item_thanmoc_frame.png" style="width: 44px; height: 44px; object-fit: contain; border-radius: 6px;" />
                        <div>
                            <div style="font-weight: 900; color: #451a03; font-size: 14px;">${item.name}</div>
                            <div style="font-size: 11px; color: #b91c1c; font-weight: bold;">${item.statIcon} ${item.statLabel} +${item.growth * 25}</div>
                            <div style="font-size: 10px; color: #78350f; max-width: 220px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.desc}</div>
                        </div>
                    </div>
                    <button class="btn-wuxia-gold" style="width: 76px; height: 32px; font-size: 11px; padding: 0;">Châm huyệt</button>
                </div>
            `;
        }).join('');
    }

    invModal.classList.add('active');
}

function closeKimChamInventory() {
    sound.play('click');
    const invModal = document.getElementById('modal-kimcham-inventory');
    if (invModal) invModal.classList.remove('active');
}

function equipKimChamToSlot(needleId) {
    sound.play('equip');
    const item = AUTHENTIC_KIMCHAM_DATABASE.find(x => x.id === needleId);
    if (!item) return;

    const d = KINHMACH_DISCIPLES[currentKinhMachDiscipleIndex];
    const bonus = item.growth * 25;

    // Pick a clean equipped frame based on slot side
    const isLeft = currentSelectedNeedleSlot < 4;
    const slotIdx1 = (currentSelectedNeedleSlot % 4) + 1;
    const icon = isLeft ? `/assets/ui/kinhmach_authentic/clean_slot_l${slotIdx1}_equipped.png` : `/assets/ui/kinhmach_authentic/clean_slot_r${slotIdx1}_equipped.png`;

    d.slots[currentSelectedNeedleSlot] = {
        id: item.id,
        name: item.name,
        stat: `${item.statIcon} ${item.statLabel} +${bonus}`,
        statType: item.statType,
        bonus: bonus,
        desc: item.desc,
        icon: icon
    };

    closeKimChamInventory();
    renderKinhMachScreen();
    alert(`✨ Châm cứu thành công! [${item.name}] đã đả thông huyệt vị và gia tăng ${bonus} điểm ${item.statLabel} cho ${d.name}!`);
}

// ================= 100% AUTHENTIC CHỌN KIM CHÂM SYSTEM (media_1793093216538_cc6f4b70.jpg) =================
let currentSelectedKimChamId = 'KC_HanThiet';

const EXTENDED_KIMCHAM_LIST = [
    {
        id: 'KC_HanThiet',
        name: 'Hàn Thiết Châm',
        statType: 'PhongBao',
        statTag: 'Phòng bạo',
        statVal: '+144',
        icon: '/assets/ui/kinhmach_authentic/clean_needle_hanthiet.png'
    },
    {
        id: 'KC_HanThiet_2',
        name: 'Hàn Thiết Châm',
        statType: 'PhongBao',
        statTag: 'Phòng bạo',
        statVal: '+144',
        icon: '/assets/ui/kinhmach_authentic/clean_needle_hanthiet.png'
    },
    {
        id: 'KC_HoaThach',
        name: 'Hỏa Thạch Châm',
        statType: 'Cong',
        statTag: null,
        statVal: '480',
        icon: '/assets/ui/kinhmach_authentic/clean_needle_hoathach.png'
    },
    {
        id: 'KC_HoaThach_2',
        name: 'Hỏa Thạch Châm',
        statType: 'Cong',
        statTag: null,
        statVal: '480',
        icon: '/assets/ui/kinhmach_authentic/clean_needle_hoathach.png'
    },
    {
        id: 'KC_HuyenThiet',
        name: 'Huyền Thiết Châm',
        statType: 'BaoKich',
        statTag: 'Bạo kích',
        statVal: '+120',
        icon: '/assets/ui/kinhmach_authentic/clean_needle_huyenthiet.png'
    },
    {
        id: 'KC_HuyenThiet_2',
        name: 'Huyền Thiết Châm',
        statType: 'BaoKich',
        statTag: 'Bạo kích',
        statVal: '+120',
        icon: '/assets/ui/kinhmach_authentic/clean_needle_huyenthiet.png'
    },
    {
        id: 'KC_ThanMoc',
        name: 'Thần Mộc Châm',
        statType: 'Mau',
        statTag: 'Khí huyết',
        statVal: '+1000',
        icon: '/assets/ui/kinhmach_authentic/clean_item_thanmoc_frame.png'
    },
    {
        id: 'KC_TuKim',
        name: 'Tử Kim Châm',
        statType: 'NoiLuc',
        statTag: 'Nội công',
        statVal: '+500',
        icon: '/assets/ui/kinhmach_authentic/clean_slot_l4_equipped.png'
    },
    {
        id: 'KC_HacMoc',
        name: 'Hắc Mộc Châm',
        statType: 'ChinhXac',
        statTag: 'Chính xác',
        statVal: '+144',
        icon: '/assets/ui/kinhmach_authentic/clean_slot_r1_equipped.png'
    },
    {
        id: 'KC_LinhMoc',
        name: 'Linh Mộc Châm',
        statType: 'TranhNe',
        statTag: 'Né tránh',
        statVal: '+120',
        icon: '/assets/ui/kinhmach_authentic/clean_slot_r2_equipped.png'
    }
];

function openChonKimChamScreen(targetSlotIdx) {
    sound.play('click');
    if (targetSlotIdx !== undefined) {
        currentSelectedNeedleSlot = targetSlotIdx;
    }
    const scr = document.getElementById('chon-kimcham-screen');
    if (scr) {
        scr.classList.add('active');
        renderChonKimChamList();
    }
}

function closeChonKimChamScreen() {
    sound.play('click');
    const scr = document.getElementById('chon-kimcham-screen');
    if (scr) scr.classList.remove('active');
}

function renderChonKimChamList() {
    const listEl = document.getElementById('ckc-needles-list');
    if (!listEl) return;

    listEl.innerHTML = EXTENDED_KIMCHAM_LIST.map(item => {
        const isSelected = item.id === currentSelectedKimChamId;
        const tagHtml = item.statTag ? `<span class="ckc-stat-tag">${item.statTag}</span>` : `<span class="km-stat-icon-circle" style="width: 18px; height: 18px; font-size: 10px;">⚔️</span>`;
        return `
            <div class="ckc-card-row ${isSelected ? 'selected' : ''}" onclick="selectKimChamCard('${item.id}')">
                <div class="ckc-card-left">
                    <div class="ckc-needle-icon-box">
                        <img src="${item.icon}" alt="${item.name}" />
                    </div>
                    <div class="ckc-needle-info">
                        <div class="ckc-needle-name">${item.name}</div>
                        <div class="ckc-needle-stat-row">
                            ${tagHtml}
                            <span class="ckc-stat-value">${item.statVal}</span>
                        </div>
                    </div>
                </div>
                <div class="ckc-card-right">
                    <img class="ckc-ink-splash-bg" src="/assets/ui/kinhmach_authentic/clean_ink_splash.png" alt="Ink" />
                    <div class="ckc-select-indicator">✓</div>
                </div>
            </div>
        `;
    }).join('');
}

function selectKimChamCard(needleId) {
    sound.play('click');
    currentSelectedKimChamId = needleId;
    renderChonKimChamList();
}

function confirmSelectedKimCham() {
    sound.play('equip');
    const needle = EXTENDED_KIMCHAM_LIST.find(x => x.id === currentSelectedKimChamId);
    if (!needle) {
        closeChonKimChamScreen();
        return;
    }

    const d = KINHMACH_DISCIPLES[currentKinhMachDiscipleIndex];
    if (d && currentSelectedNeedleSlot !== undefined) {
        const isLeft = currentSelectedNeedleSlot < 4;
        const slotIdx1 = (currentSelectedNeedleSlot % 4) + 1;
        const icon = isLeft ? `/assets/ui/kinhmach_authentic/clean_slot_l${slotIdx1}_equipped.png` : `/assets/ui/kinhmach_authentic/clean_slot_r${slotIdx1}_equipped.png`;

        d.slots[currentSelectedNeedleSlot] = {
            id: needle.id,
            name: needle.name,
            stat: `${needle.statTag ? needle.statTag : 'Chỉ số'} ${needle.statVal}`,
            statType: needle.statType,
            bonus: parseInt(needle.statVal.replace(/[^0-9]/g, '')) || 500,
            desc: `Kim châm truyền thế hấp thụ linh khí đất trời, gia tăng uy lực kinh mạch.`,
            icon: icon
        };
        renderKinhMachScreen();
    }

    closeChonKimChamScreen();
    alert(`✨ Chúc mừng! Đã chọn [${needle.name}] và châm cứu thành công vào huyệt đạo của ${d.name}!`);
}


// ================= KHIÊU CHIẾN STAGE LOGIC (media_1793093271284_a9a0215e.jpg) =================
let currentBossLevel = 5;
let khieuChienCountdownInterval = null;

function startKhieuChienCountdown() {
    if (khieuChienCountdownInterval) clearInterval(khieuChienCountdownInterval);
    let totalSeconds = 2 * 86400 + 22 * 3600 + 21 * 60 + 5;
    const timerEl = document.getElementById('kc-countdown-timer');
    if (!timerEl) return;

    khieuChienCountdownInterval = setInterval(() => {
        if (totalSeconds <= 0) {
            clearInterval(khieuChienCountdownInterval);
            timerEl.textContent = '0 ngày 00 giờ 00 phút 00 giây';
            return;
        }
        totalSeconds--;
        const d = Math.floor(totalSeconds / 86400);
        const h = Math.floor((totalSeconds % 86400) / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        timerEl.textContent = `${d} ngày ${String(h).padStart(2, '0')} giờ ${String(m).padStart(2, '0')} phút ${String(s).padStart(2, '0')} giây`;
    }, 1000);
}

function doBossAction(action) {
    if (action === 'chien') {
        sound.play('click');
        const confirmFight = confirm(`⚔️ Quyết chiến với Triệu Công Tử Cấp ${currentBossLevel}?\nTiêu hao: 20 Vàng`);
        if (!confirmFight) return;

        sound.play('renxong');
        currentBossLevel++;
        const lvlEl = document.getElementById('kc-boss-level-text');
        if (lvlEl) lvlEl.textContent = `Cấp ${currentBossLevel}`;
        alert(`🎉 CHIẾN THẮNG RỰC RỠ!\nBạn đã đánh bại Triệu Công Tử!\n\nPhần thưởng:\n• Bạc: +50.000\n• Kinh Nghiệm: +10.000\n• Thần Mộc Châm x1\nBoss đã thăng lên Cấp ${currentBossLevel}!`);
    } else if (action === 'tranap') {
        sound.play('click');
        const confirmSweep = confirm(`✨ Uy hiếp và Trấn Áp ngay Triệu Công Tử Cấp ${currentBossLevel}?\nTiêu hao: 40 Vàng (Không tốn lượt đánh, nhận x2 thưởng)`);
        if (!confirmSweep) return;

        sound.play('levelup');
        currentBossLevel++;
        const lvlEl = document.getElementById('kc-boss-level-text');
        if (lvlEl) lvlEl.textContent = `Cấp ${currentBossLevel}`;
        alert(`🏆 TRẤN ÁP THÀNH CÔNG!\nTriệu Công Tử đã quy phục chưởng môn!\n\nPhần thưởng:\n• Bạc: +120.000\n• Kinh Nghiệm: +25.000\n• Hàn Thiết Châm x1\nBoss đã thăng lên Cấp ${currentBossLevel}!`);
    }
}

// ================= 100% AUTHENTIC ÁM KHÍ SYSTEM (media_1793093318687_911dce52.jpg) =================
let currentAmKhiIndex = 0;

const NGU_HANH_AMKHI_LIST = [
    {
        name: 'Ám Phong',
        element: 'Kim',
        medallion: '/assets/ui/amkhi_authentic/clean_medallion_am_phong.png',
        trait: 'Đạt <span class="amkhi-highlight-red">10k THỦ</span> của 5 ám khí <span class="amkhi-highlight-yellow">NGŨ HÀNH</span> tăng 1 cấp võ công, <span class="amkhi-highlight-red">20k THỦ</span> tăng 2 cấp võ công. <span class="amkhi-highlight-yellow">Lượt đầu bị tấn công có 80% né thường và đả thể. Sau khi né, tăng 50% xác suất ra chưởng</span>',
        hp: 1006855,
        atk: 1675,
        def: 20020,
        intVal: 2350
    },
    {
        name: 'Thanh Mộc',
        element: 'Mộc',
        medallion: '/assets/ui/amkhi_authentic/clean_medallion_am_phong.png',
        trait: 'Đạt <span class="amkhi-highlight-red">10k MÁU</span> của 5 ám khí <span class="amkhi-highlight-yellow">NGŨ HÀNH</span> tăng 1 cấp võ công. <span class="amkhi-highlight-yellow">Khi máu dưới 30%, kích hoạt Sinh Mộc Hồi Xuân hồi phục 25% sinh lực tối đa</span>',
        hp: 1150000,
        atk: 1520,
        def: 22100,
        intVal: 2100
    },
    {
        name: 'Hàn Băng',
        element: 'Thủy',
        medallion: '/assets/ui/amkhi_authentic/clean_medallion_am_phong.png',
        trait: 'Đạt <span class="amkhi-highlight-red">10k NỘI</span> của 5 ám khí <span class="amkhi-highlight-yellow">NGŨ HÀNH</span> tăng 1 cấp võ công. <span class="amkhi-highlight-yellow">Đòn đánh thường có 40% đóng băng phong bế nộ khí đối thủ trong 1 hiệp</span>',
        hp: 980000,
        atk: 1850,
        def: 19500,
        intVal: 2600
    },
    {
        name: 'Liệt Hỏa',
        element: 'Hỏa',
        medallion: '/assets/ui/amkhi_authentic/clean_medallion_am_phong.png',
        trait: 'Đạt <span class="amkhi-highlight-red">10k CÔNG</span> của 5 ám khí <span class="amkhi-highlight-yellow">NGŨ HÀNH</span> tăng 1 cấp võ công. <span class="amkhi-highlight-yellow">Gia tăng 35% Bạo kích và 50% Sát thương bạo kích cho tất cả đệ tử xuất trận</span>',
        hp: 920000,
        atk: 2200,
        def: 18000,
        intVal: 2800
    },
    {
        name: 'Huyền Thổ',
        element: 'Thổ',
        medallion: '/assets/ui/amkhi_authentic/clean_medallion_am_phong.png',
        trait: 'Đạt <span class="amkhi-highlight-red">15k THỦ</span> của 5 ám khí <span class="amkhi-highlight-yellow">NGŨ HÀNH</span> tăng 2 cấp võ công. <span class="amkhi-highlight-yellow">Hấp thụ 30% sát thương nhận vào chuyển hóa thành hộ thuẫn phòng thủ kiên cố</span>',
        hp: 1250000,
        atk: 1400,
        def: 25000,
        intVal: 1900
    }
];

function renderAmKhiData() {
    const ak = NGU_HANH_AMKHI_LIST[currentAmKhiIndex];
    if (!ak) return;

    const nameEl = document.getElementById('ak-modal-name');
    if (nameEl) nameEl.textContent = ak.name;

    const elemEl = document.getElementById('ak-modal-element');
    if (elemEl) elemEl.textContent = ak.element;

    const traitEl = document.getElementById('ak-modal-trait');
    if (traitEl) traitEl.innerHTML = ak.trait;

    const hpEl = document.getElementById('ak-stat-hp');
    if (hpEl) hpEl.textContent = ak.hp;

    const atkEl = document.getElementById('ak-stat-atk');
    if (atkEl) atkEl.textContent = ak.atk;

    const defEl = document.getElementById('ak-stat-def');
    if (defEl) defEl.textContent = ak.def;

    const intEl = document.getElementById('ak-stat-int');
    if (intEl) intEl.textContent = ak.intVal;
}

// Override openAmKhiModal to render authentic data
const _origOpenAmKhiModal = openAmKhiModal;
openAmKhiModal = function() {
    sound.play('click');
    const modal = document.getElementById('amkhi-modal');
    if (modal) {
        modal.classList.add('active');
        renderAmKhiData();
    }
};

function doAmKhiAction(action) {
    const ak = NGU_HANH_AMKHI_LIST[currentAmKhiIndex];
    if (action === 'doi') {
        sound.play('equip');
        currentAmKhiIndex = (currentAmKhiIndex + 1) % NGU_HANH_AMKHI_LIST.length;
        renderAmKhiData();
        alert(`✨ Chúc mừng! Đã chuyển đổi sang Ám Khí [${NGU_HANH_AMKHI_LIST[currentAmKhiIndex].name}] - Hệ [${NGU_HANH_AMKHI_LIST[currentAmKhiIndex].element}]!`);
    } else if (action === 'luyen') {
        sound.play('renxong');
        ak.hp = Math.floor(ak.hp * 1.05);
        ak.atk = Math.floor(ak.atk * 1.05);
        ak.def = Math.floor(ak.def * 1.05);
        ak.intVal = Math.floor(ak.intVal * 1.05);
        renderAmKhiData();
        alert(`🔥 Luyện Khí thành công! Tất cả chỉ số cơ bản của [${ak.name}] đã gia tăng 5%!`);
    } else if (action === 'boiduong') {
        sound.play('levelup');
        alert(`🌿 Bồi Dưỡng thành công! Tăng thêm 5% xác suất kích hoạt né đòn và xuất chiêu phản kích của [${ak.name}]!`);
    } else if (action === 'thang') {
        sound.play('renxong');
        alert(`🌟 Thăng Khí thành công! Ám Khí [${ak.name}] đã đột phá cảnh giới và thăng thêm 1 Sao uy lực!`);
    }
}


// ================= 100% AUTHENTIC THƯỞNG NẠP SYSTEM (media_1793093357077_6d2838c9.jpg) =================
let tnCountdownSeconds = 354514; // 4 ngày 02 giờ 28 phút 34 giây
let tnCountdownTimer = null;
const THUONG_NAP_MILESTONES = [
    {
        id: 1,
        gold: 250,
        name: 'Mốc 250 Vàng',
        rewards: [
            { name: 'Ngân Lượng', amount: 1000000, desc: '100 Vạn Bạc' },
            { name: 'Bồi Dưỡng Đan', amount: 10, desc: '10 Viên' },
            { name: 'Tẩy Tủy Đan', amount: 5, desc: '5 Viên' },
            { name: 'Rương Hoàng Kim', amount: 1, desc: '1 Rương' }
        ]
    },
    {
        id: 2,
        gold: 1000,
        name: 'Mốc 1000 Vàng',
        rewards: [
            { name: 'Ngân Lượng', amount: 3000000, desc: '300 Vạn Bạc' },
            { name: 'Bồi Dưỡng Đan', amount: 50, desc: '50 Viên' },
            { name: 'Tẩy Tủy Đan', amount: 20, desc: '20 Viên' },
            { name: 'Bí Kíp Thần Công', amount: 1, desc: '1 Cuốn' }
        ]
    },
    {
        id: 3,
        gold: 2500,
        name: 'Mốc 2500 Vàng',
        rewards: [
            { name: 'Ngân Lượng', amount: 10000000, desc: '1000 Vạn Bạc' },
            { name: 'Bồi Dưỡng Đan', amount: 150, desc: '150 Viên' },
            { name: 'Tẩy Tủy Đan', amount: 50, desc: '50 Viên' },
            { name: 'Rương Giáp Cam Cực Phẩm', amount: 1, desc: '1 Rương' }
        ]
    }
];

function startThuongNapCountdown() {
    if (tnCountdownTimer) clearInterval(tnCountdownTimer);
    const textEl = document.getElementById('tn-countdown-text');
    if (!textEl) return;
    
    function renderTimer() {
        if (tnCountdownSeconds <= 0) {
            textEl.textContent = 'Đã kết thúc sự kiện!';
            return;
        }
        const days = Math.floor(tnCountdownSeconds / 86400);
        const hours = Math.floor((tnCountdownSeconds % 86400) / 3600);
        const mins = Math.floor((tnCountdownSeconds % 3600) / 60);
        const secs = tnCountdownSeconds % 60;
        
        const hStr = hours < 10 ? '0' + hours : '' + hours;
        const mStr = mins < 10 ? '0' + mins : '' + mins;
        const sStr = secs < 10 ? '0' + secs : '' + secs;
        
        textEl.textContent = `${days} ngày ${hStr} giờ ${mStr} phút ${sStr} giây`;
        tnCountdownSeconds--;
    }
    renderTimer();
    tnCountdownTimer = setInterval(renderTimer, 1000);
}

function updateThuongNapUI() {
    if (!GameState.playerData) return;
    if (GameState.playerData.rechargedGold === undefined) {
        GameState.playerData.rechargedGold = 700; // Authentic default matching screenshot
    }
    if (!GameState.playerData.claimedThuongNapMilestones) {
        GameState.playerData.claimedThuongNapMilestones = [1]; // Milestone 1 already reached at 700
    }
    
    const valEl = document.getElementById('tn-recharged-gold-val');
    if (valEl) {
        valEl.textContent = GameState.playerData.rechargedGold;
    }
    
    const recharged = GameState.playerData.rechargedGold;
    const claimedList = GameState.playerData.claimedThuongNapMilestones;
    
    THUONG_NAP_MILESTONES.forEach(ms => {
        const itemEl = document.getElementById('tn-item-' + ms.id);
        const badgeEl = document.getElementById('tn-badge-' + ms.id);
        if (!itemEl) return;
        
        itemEl.classList.remove('unlocked', 'claimed');
        if (claimedList.includes(ms.id)) {
            itemEl.classList.add('claimed');
            if (badgeEl) badgeEl.textContent = 'Đã nhận';
        } else if (recharged >= ms.gold) {
            itemEl.classList.add('unlocked');
            if (badgeEl) badgeEl.textContent = 'Có thể nhận';
        } else {
            if (badgeEl) badgeEl.textContent = `Thiếu ${ms.gold - recharged}`;
        }
    });
}

function handleThuongNapMilestone(id) {
    sound.play('click');
    const ms = THUONG_NAP_MILESTONES.find(m => m.id === id);
    if (!ms) return;
    
    const recharged = GameState.playerData.rechargedGold || 0;
    const claimedList = GameState.playerData.claimedThuongNapMilestones || [];
    
    let rewardText = ms.rewards.map(r => `• ${r.name}: ${r.desc}`).join('\n');
    
    if (claimedList.includes(id)) {
        alert(`🎁 [${ms.name.toUpperCase()}] 🎁\nBạn đã nhận phần thưởng mốc này qua Hòm Thư:\n${rewardText}`);
        return;
    }
    
    if (recharged >= ms.gold) {
        // Claim reward
        claimedList.push(id);
        GameState.playerData.claimedThuongNapMilestones = claimedList;
        
        // Grant rewards
        ms.rewards.forEach(r => {
            if (r.name === 'Ngân Lượng' && GameState.playerData.Account) {
                GameState.playerData.Account.Bac = (GameState.playerData.Account.Bac || 0) + r.amount;
            }
        });
        
        // Auto send mail confirmation
        if (!GameState.playerData.Mails) GameState.playerData.Mails = [];
        GameState.playerData.Mails.unshift({
            id: Date.now(),
            title: `Thưởng Nạp - ${ms.name}`,
            sender: 'Hệ Thống Thưởng Nạp',
            content: `Chúc mừng Chưởng Môn đã đạt mốc tích lũy ${ms.gold} Vàng! Phần thưởng: ${rewardText}`,
            date: new Date().toLocaleDateString('vi-VN'),
            claimed: true
        });
        
        saveGameState();
        updateHeader();
        updateThuongNapUI();
        sound.play('victory');
        
        alert(`🎉 [NHẬN THƯỞNG THÀNH CÔNG] 🎉\nChúc mừng Chưởng Môn đã nhận thưởng ${ms.name}:\n${rewardText}\n(Phần thưởng đã cộng vào túi đồ và lưu lịch sử truyền thư)`);
    } else {
        alert(`🔒 [CHƯA ĐỦ ĐIỀU KIỆN] 🔒\n${ms.name} yêu cầu nạp tích lũy đủ ${ms.gold} Vàng.\nHiện tại Chưởng Môn đã nạp: ${recharged} Vàng (Còn thiếu ${ms.gold - recharged} Vàng).\n\nBấm nút "Nạp Tiền" để tích lũy thêm!`);
    }
}

function doThuongNapNaptien() {
    sound.play('click');
    const modal = document.getElementById('modal-thuongnap-recharge');
    if (!modal) return;
    
    const curGoldEl = document.getElementById('tn-modal-current-gold');
    const totalRechargedEl = document.getElementById('tn-modal-total-recharged');
    
    if (curGoldEl && GameState.playerData && GameState.playerData.Account) {
        curGoldEl.textContent = GameState.playerData.Account.Vang || 0;
    }
    if (totalRechargedEl && GameState.playerData) {
        totalRechargedEl.textContent = GameState.playerData.rechargedGold || 700;
    }
    
    modal.style.display = 'flex';
}

function closeThuongNapRechargeModal() {
    sound.play('click');
    const modal = document.getElementById('modal-thuongnap-recharge');
    if (modal) modal.style.display = 'none';
}

function submitRecharge(goldAmount) {
    sound.play('click');
    if (!GameState.playerData) return;
    if (!GameState.playerData.Account) GameState.playerData.Account = {};
    
    const oldRecharged = GameState.playerData.rechargedGold || 0;
    const newRecharged = oldRecharged + goldAmount;
    GameState.playerData.rechargedGold = newRecharged;
    GameState.playerData.Account.Vang = (GameState.playerData.Account.Vang || 0) + goldAmount;
    
    // Check auto milestone rewards delivery
    const claimedList = GameState.playerData.claimedThuongNapMilestones || [];
    let unlockedMsg = '';
    
    THUONG_NAP_MILESTONES.forEach(ms => {
        if (newRecharged >= ms.gold && !claimedList.includes(ms.id)) {
            claimedList.push(ms.id);
            // Auto grant reward
            ms.rewards.forEach(r => {
                if (r.name === 'Ngân Lượng' && GameState.playerData.Account) {
                    GameState.playerData.Account.Bac = (GameState.playerData.Account.Bac || 0) + r.amount;
                }
            });
            // Auto mail
            if (!GameState.playerData.Mails) GameState.playerData.Mails = [];
            GameState.playerData.Mails.unshift({
                id: Date.now() + ms.id,
                title: `Phần Thưởng Tự Động - ${ms.name}`,
                sender: 'Hệ Thống Thưởng Nạp',
                content: `Hệ thống tự động gửi phần thưởng mốc ${ms.gold} Vàng qua Truyền Thư:\n` + ms.rewards.map(r => `• ${r.name}: ${r.desc}`).join('\n'),
                date: new Date().toLocaleDateString('vi-VN'),
                claimed: true
            });
            unlockedMsg += `\n✨ Đã mở khóa và nhận tự động ${ms.name}!`;
        }
    });
    GameState.playerData.claimedThuongNapMilestones = claimedList;
    
    saveGameState();
    updateHeader();
    updateThuongNapUI();
    closeThuongNapRechargeModal();
    sound.play('victory');
    
    alert(`🎉 [NẠP TIỀN THÀNH CÔNG] 🎉\nChưởng Môn vừa nạp thành công +${goldAmount} Vàng!\nTổng tích lũy nạp hiện tại: ${newRecharged} Vàng.${unlockedMsg}`);
}


// ================= 100% AUTHENTIC THƯƠNG NHÂN THẦN BÍ SYSTEM (media_1793094305775_44f09702.jpg) =================
let tnnCountdownSeconds = 14383; // 3 giờ 59 phút 43 giây
let tnnCountdownTimer = null;

const THUONG_NHAN_GOODS = [
    {
        id: 'ga_quay_7',
        name: 'Gà Quay x7',
        count: 7,
        icon: '/assets/images/VP_GaQuay_to.png',
        priceGold: 70,
        originalPrice: 100,
        desc: 'Món ngon bồi bổ đại bổ nguyên khí Tây Vực! Mỗi con gà quay phục hồi 10 điểm Thể Lực (Tổng phục hồi 70 điểm Thể Lực).',
        effectType: 'theluc',
        effectValue: 70
    },
    {
        id: 'boiduong_dan_50',
        name: 'Bồi Dưỡng Đan x50',
        count: 50,
        icon: '/assets/images/VP_BoiDuongDan_to.png',
        priceGold: 100,
        originalPrice: 150,
        desc: 'Linh đan thần diệu kích phát tiềm năng đệ tử, dùng để bồi dưỡng tứ đại chỉ số thuộc tính võ học.',
        effectType: 'item',
        effectValue: 50
    },
    {
        id: 'ruong_hoangkim_3',
        name: 'Rương + Chìa Hoàng Kim x3',
        count: 3,
        icon: '/assets/images/VP_RuongHoangKim_to.png',
        priceGold: 150,
        originalPrice: 240,
        desc: 'Bảo rương hoàng kim chứa đựng bí kíp giáp trụ cực phẩm võ lâm và kỳ trân dị bảo.',
        effectType: 'item',
        effectValue: 3
    }
];

let currentTnnItemIndex = 0;

function startThuongNhanCountdown() {
    if (tnnCountdownTimer) clearInterval(tnnCountdownTimer);
    const textEl = document.getElementById('tnn-countdown-text');
    if (!textEl) return;
    
    function renderTimer() {
        if (tnnCountdownSeconds <= 0) {
            tnnCountdownSeconds = 14400; // Reset 4 hours cycle
        }
        const hours = Math.floor(tnnCountdownSeconds / 3600);
        const mins = Math.floor((tnnCountdownSeconds % 3600) / 60);
        const secs = tnnCountdownSeconds % 60;
        
        const hStr = hours < 10 ? '0' + hours : '' + hours;
        const mStr = mins < 10 ? '0' + mins : '' + mins;
        const sStr = secs < 10 ? '0' + secs : '' + secs;
        
        textEl.innerHTML = `${hours} giờ ${mStr} phút <b class="tnn-timer-sec-hl">${sStr}</b> giây`;
        tnnCountdownSeconds--;
    }
    renderTimer();
    tnnCountdownTimer = setInterval(renderTimer, 1000);
}

function updateThuongNhanUI() {
    // Keep UI synchronized
}

function viewThuongNhanItem() {
    sound.play('click');
    const item = THUONG_NHAN_GOODS[currentTnnItemIndex] || THUONG_NHAN_GOODS[0];
    alert(`🛒 [VẬT PHẨM BẢO QUÝ] 🛒\n• Tên: ${item.name}\n• Giá bán: ${item.priceGold} Vàng (Giảm giá từ ${item.originalPrice} Vàng)\n• Công dụng: ${item.desc}\n\nBấm nút "Mua ngay" để sở hữu kỳ bảo!`);
}

function doThuongNhanThamQuan() {
    sound.play('click');
    const quotes = [
        '"Ta là ai không quan trọng. Quan trọng là ta có thứ ngươi cần."',
        '"Đại hiệp cứ thong thả tham quan. Hàng quý hiếm Tây Vực chỉ bán cho người biết trân trọng!"',
        '"Chuyến hàng này ta lặn lội ngàn dặm sa mạc mới mang về được đấy."',
        '"Thương nhân thần bí xuất quỷ nhập thần, chỉ nán lại vài canh giờ rồi đi tiếp!"'
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    
    // Cycle items on browse
    currentTnnItemIndex = (currentTnnItemIndex + 1) % THUONG_NHAN_GOODS.length;
    const curItem = THUONG_NHAN_GOODS[currentTnnItemIndex];
    
    alert(`🧕 [THƯƠNG NHÂN THẦN BÍ] 🧕\n${randomQuote}\n\nVật phẩm hiện tại: ${curItem.name} (Giá: ${curItem.priceGold} Vàng).`);
}

function doThuongNhanMuaNgay() {
    sound.play('click');
    if (!GameState.playerData || !GameState.playerData.Account) return;
    
    const item = THUONG_NHAN_GOODS[currentTnnItemIndex] || THUONG_NHAN_GOODS[0];
    const currentGold = GameState.playerData.Account.Vang || 0;
    
    if (currentGold < item.priceGold) {
        alert(`❌ [KHÔNG ĐỦ VÀNG] ❌\nCần ${item.priceGold} Vàng để mua ${item.name}.\nHiện tại Chưởng Môn chỉ có: ${currentGold} Vàng.\n\nHãy nạp thêm Vàng tại mục "Thưởng Nạp" để mua hàng!`);
        return;
    }
    
    // Deduct gold
    GameState.playerData.Account.Vang -= item.priceGold;
    
    // Grant effect
    if (item.effectType === 'theluc') {
        const curEnergy = GameState.playerData.Account.TheLuc || 0;
        GameState.playerData.Account.TheLuc = curEnergy + item.effectValue;
    }
    
    saveGameState();
    updateHeader();
    sound.play('victory');
    
    alert(`🎉 [GIAO DỊCH THÀNH CÔNG] 🎉\nChúc mừng Chưởng Môn đã mua thành công ${item.name}!\nĐã trừ: ${item.priceGold} Vàng.\n${item.effectType === 'theluc' ? 'Đã phục hồi ngay +' + item.effectValue + ' Thể Lực!' : 'Vật phẩm đã được thêm vào túi đồ!'}\n\nThương Nhân Thần Bí: "Cảm ơn đại hiệp đã ủng hộ! Lần sau ghé lại nhé!"`);
}


// ================= 100% AUTHENTIC DỰ ĐOÁN BÓNG ĐÁ SYSTEM (media_1793094347617_84886d52.jpg) =================
let currentBongDaSelection = 'vn';
let currentBongDaChip = 10000;
const BONG_DA_ODDS = {
    vn: { name: 'Việt Nam Thắng (0 : 1/4)', odds: 2.0 },
    draw: { name: 'Hòa (0 : 1/4)', odds: 3.2 },
    thai: { name: 'Thái Lan Thắng', odds: 2.0 },
    tai: { name: 'Kèo Tài (Tổng > 2 bàn)', odds: 1.95 },
    xiu: { name: 'Kèo Xỉu (Tổng < 2 bàn)', odds: 1.95 }
};

function updateBongDaUI() {
    if (!GameState.playerData) return;
    if (!GameState.playerData.bongDaBets) {
        GameState.playerData.bongDaBets = {
            vn: 10000,
            draw: 0,
            thai: 0,
            tai: 0,
            xiu: 0
        };
    }
    
    const bets = GameState.playerData.bongDaBets;
    const elVn = document.getElementById('bd-val-vn');
    const elDraw = document.getElementById('bd-val-draw');
    const elThai = document.getElementById('bd-val-thai');
    const elTai = document.getElementById('bd-val-tai');
    const elXiu = document.getElementById('bd-val-xiu');
    
    if (elVn) elVn.textContent = bets.vn ? bets.vn : '';
    if (elDraw) elDraw.textContent = bets.draw ? bets.draw : '';
    if (elThai) elThai.textContent = bets.thai ? bets.thai : '';
    if (elTai) elTai.textContent = bets.tai ? bets.tai : '';
    if (elXiu) elXiu.textContent = bets.xiu ? bets.xiu : '';
}

function openBongDaBetModal(key) {
    sound.play('click');
    currentBongDaSelection = key;
    const modal = document.getElementById('modal-bongda-bet');
    if (!modal) return;
    
    const matchNameEl = document.getElementById('bd-modal-match-name');
    const oddsTagEl = document.getElementById('bd-modal-odds-tag');
    const cfg = BONG_DA_ODDS[key] || BONG_DA_ODDS.vn;
    
    if (matchNameEl) matchNameEl.textContent = cfg.name;
    if (oddsTagEl) oddsTagEl.textContent = `Tỉ lệ: 1 ăn ${cfg.odds}`;
    
    selectBongDaChip(currentBongDaChip || 10000);
    modal.style.display = 'flex';
}

function closeBongDaBetModal() {
    sound.play('click');
    const modal = document.getElementById('modal-bongda-bet');
    if (modal) modal.style.display = 'none';
}

function selectBongDaChip(chip) {
    sound.play('click');
    currentBongDaChip = chip;
    document.querySelectorAll('.bd-chip-btn').forEach(b => b.classList.remove('active'));
    const btn = document.getElementById('bd-chip-' + chip);
    if (btn) btn.classList.add('active');
    
    const betGoldEl = document.getElementById('bd-modal-bet-gold');
    const estPayoutEl = document.getElementById('bd-modal-est-payout');
    const cfg = BONG_DA_ODDS[currentBongDaSelection] || BONG_DA_ODDS.vn;
    
    if (betGoldEl) betGoldEl.textContent = chip.toLocaleString('vi-VN');
    if (estPayoutEl) {
        const payout = Math.floor(chip * cfg.odds);
        estPayoutEl.textContent = payout.toLocaleString('vi-VN');
    }
}

function submitBongDaBet() {
    sound.play('click');
    if (!GameState.playerData || !GameState.playerData.Account) return;
    
    const currentGold = GameState.playerData.Account.Vang || 0;
    if (currentGold < currentBongDaChip) {
        alert(`❌ [KHÔNG ĐỦ VÀNG] ❌\nChưởng Môn cần ${currentBongDaChip.toLocaleString('vi-VN')} Vàng để đặt cược.\nHiện tại chỉ có: ${currentGold.toLocaleString('vi-VN')} Vàng!`);
        return;
    }
    
    // Deduct gold
    GameState.playerData.Account.Vang -= currentBongDaChip;
    
    // Record bet
    if (!GameState.playerData.bongDaBets) GameState.playerData.bongDaBets = {};
    GameState.playerData.bongDaBets[currentBongDaSelection] = (GameState.playerData.bongDaBets[currentBongDaSelection] || 0) + currentBongDaChip;
    
    const cfg = BONG_DA_ODDS[currentBongDaSelection];
    const estPayout = Math.floor(currentBongDaChip * cfg.odds);
    
    // Send mail receipt
    if (!GameState.playerData.Mails) GameState.playerData.Mails = [];
    GameState.playerData.Mails.unshift({
        id: Date.now(),
        title: `Phiếu Cược Bóng Đá: ${cfg.name}`,
        sender: 'Ban Trọng Tài Đại Minh Chủ',
        content: `Chưởng Môn đã đặt cược thành công ${currentBongDaChip.toLocaleString('vi-VN')} Vàng vào cửa [${cfg.name}].\nTỉ lệ: 1 ăn ${cfg.odds}. Tiền thắng ước tính: ${estPayout.toLocaleString('vi-VN')} Vàng.\nTiền thưởng sẽ được tự động gửi qua Hòm Thư sau khi trận đấu kết thúc!`,
        date: new Date().toLocaleDateString('vi-VN'),
        claimed: true
    });
    
    saveGameState();
    updateHeader();
    updateBongDaUI();
    closeBongDaBetModal();
    sound.play('victory');
    
    alert(`🎉 [ĐẶT CƯỢC THÀNH CÔNG] 🎉\nĐã cược thành công ${currentBongDaChip.toLocaleString('vi-VN')} Vàng vào [${cfg.name}]!\nTiền thắng ước tính: ${estPayout.toLocaleString('vi-VN')} Vàng.`);
}

function openBongDaRulesModal() {
    sound.play('click');
    const modal = document.getElementById('modal-bongda-rules');
    if (modal) modal.style.display = 'flex';
}

function closeBongDaRulesModal() {
    sound.play('click');
    const modal = document.getElementById('modal-bongda-rules');
    if (modal) modal.style.display = 'none';
}


// ================= 100% AUTHENTIC TẦM BẢO HOÀNG CUNG SYSTEM (media_1793097644447_6ae8b96c.jpg) =================
const TAM_BAO_REWARDS = [
    { id: 0, name: 'Rương Báu Hoàng Kim', count: 1, type: 'item', desc: 'Bảo rương hoàng kim chứa trang bị và bảo vật cực phẩm.' },
    { id: 1, name: 'Thiên Niên Nhân Sâm', count: 1, type: 'theluc', value: 100, desc: 'Đại bổ nguyên khí, phục hồi 100 điểm Thể Lực.' },
    { id: 2, name: 'Bao Lì Xì May Mắn', count: 1, type: 'bac', value: 500000, desc: 'Lộc lá đầu năm, nhận ngay 500.000 Ngân Lượng.' },
    { id: 3, name: 'Huyết Ngọc Thần Thạch', count: 1, type: 'item', desc: 'Bảo thạch hộ thân tăng 200 điểm Phòng ngự.' },
    { id: 4, name: 'Càn Khôn Linh Cầu', count: 1, type: 'item', desc: 'Bảo châu tăng 250 điểm Nội công thâm hậu.' },
    { id: 5, name: 'Bí Kíp Thần Công', count: 1, type: 'item', desc: 'Bí kíp võ công uy lực trấn phái giang hồ.' },
    { id: 6, name: 'Vàng Đĩnh Hoàng Kim', count: 1, type: 'vang', value: 500, desc: 'Phát tài nhận ngay 500 Vàng KNB.' },
    { id: 7, name: 'Lam Tinh Thạch', count: 1, type: 'item', desc: 'Đá quý cực phẩm tăng 3.000 điểm Khí huyết.' }
];

let isTamBaoRolling = false;

function updateTamBaoUI() {
    if (!GameState.playerData) return;
    if (GameState.playerData.tambaoCount === undefined) {
        GameState.playerData.tambaoCount = 1277; // Authentic default matching screenshot
    }
    
    const countEl = document.getElementById('tb-spins-count-text');
    if (countEl) countEl.textContent = GameState.playerData.tambaoCount;
    
    const goldEl = document.getElementById('tb-live-gold-val');
    if (goldEl && GameState.playerData.Account) {
        goldEl.textContent = GameState.playerData.Account.Vang || 622046;
    }
}

function inspectTambaoSlot(idx) {
    sound.play('click');
    const r = TAM_BAO_REWARDS[idx];
    if (!r) return;
    alert(`👑 [HOÀNG CUNG DỊ BẢO] 👑\n• Vật phẩm: ${r.name}\n• Mô tả: ${r.desc}`);
}

function doTamBao(times) {
    if (isTamBaoRolling) return;
    sound.play('click');
    if (!GameState.playerData || !GameState.playerData.Account) return;
    
    const cost = times === 10 ? 1000 : 100;
    const currentGold = GameState.playerData.Account.Vang || 0;
    
    if (currentGold < cost) {
        alert(`❌ [KHÔNG ĐỦ VÀNG] ❌\nTầm bảo ${times} lần yêu cầu ${cost} Vàng.\nHiện tại Chưởng Môn chỉ có: ${currentGold} Vàng.\n\nHãy nạp thêm Vàng tại mục "Thưởng Nạp" để tiếp tục du ngoạn!`);
        return;
    }
    
    // Deduct gold
    GameState.playerData.Account.Vang -= cost;
    GameState.playerData.tambaoCount = (GameState.playerData.tambaoCount || 1277) + times;
    
    if (times === 1) {
        isTamBaoRolling = true;
        const targetIdx = Math.floor(Math.random() * TAM_BAO_REWARDS.length);
        let currentStep = 0;
        const totalSteps = 16 + targetIdx; // at least 2 full rounds
        let speed = 60;
        
        function stepHighlight() {
            document.querySelectorAll('.tb-slot-item').forEach(s => s.classList.remove('active'));
            const activeSlot = document.getElementById('tb-slot-' + (currentStep % 8));
            if (activeSlot) activeSlot.classList.add('active');
            
            if (currentStep < totalSteps) {
                currentStep++;
                if (currentStep > totalSteps - 6) speed += 50; // slow down at end
                setTimeout(stepHighlight, speed);
            } else {
                isTamBaoRolling = false;
                const won = TAM_BAO_REWARDS[targetIdx];
                grantTamBaoReward(won);
                saveGameState();
                updateHeader();
                updateTamBaoUI();
                sound.play('victory');
                alert(`🎉 [TẦM BẢO THÀNH CÔNG] 🎉\nChúc mừng Chưởng Môn nhận được:\n✨ ${won.name} ✨\n(${won.desc})`);
            }
        }
        stepHighlight();
    } else {
        // 10 times instant batch
        let wonItems = [];
        for (let i = 0; i < 10; i++) {
            const rIdx = Math.floor(Math.random() * TAM_BAO_REWARDS.length);
            const won = TAM_BAO_REWARDS[rIdx];
            grantTamBaoReward(won);
            wonItems.push(`• ${won.name}`);
        }
        saveGameState();
        updateHeader();
        updateTamBaoUI();
        sound.play('victory');
        alert(`🎉 [10 LẦN TẦM BẢO HOÀNG CUNG] 🎉\nChúc mừng Chưởng Môn thu hoạch được 10 kỳ trân dị bảo:\n\n${wonItems.join('\n')}`);
    }
}

function grantTamBaoReward(r) {
    if (!GameState.playerData || !GameState.playerData.Account) return;
    if (r.type === 'theluc') {
        GameState.playerData.Account.TheLuc = (GameState.playerData.Account.TheLuc || 0) + r.value;
    } else if (r.type === 'bac') {
        GameState.playerData.Account.Bac = (GameState.playerData.Account.Bac || 0) + r.value;
    } else if (r.type === 'vang') {
        GameState.playerData.Account.Vang = (GameState.playerData.Account.Vang || 0) + r.value;
    }
}

function claimTambaoMilestone(ms) {
    sound.play('click');
    const count = GameState.playerData ? (GameState.playerData.tambaoCount || 1277) : 1277;
    const names = {
        20: 'Mốc Hoàng Cung (20 lần)',
        200: 'Mốc Đại Nội (200 lần)',
        500: 'Mốc Kim Điện (500 lần)'
    };
    const rewards = {
        20: '50 Bồi Dưỡng Đan + 1 Rương Hoàng Kim',
        200: '150 Bồi Dưỡng Đan + 1 Bí Kíp Thần Công',
        500: '1 Đệ Tử Giáp Phẩm + 1 Rương Thần Trang'
    };
    
    if (count >= ms) {
        alert(`🏆 [${names[ms].toUpperCase()}] 🏆\nChưởng Môn đã đạt đủ ${count}/${ms} lần tầm bảo!\nPhần thưởng: ${rewards[ms]}\n(Phần thưởng mốc đã được gửi tự động qua Hòm Thư)`);
    } else {
        alert(`🔒 [CHƯA ĐỦ ĐIỀU KIỆN] 🔒\n${names[ms]} yêu cầu đạt ${ms} lần tầm bảo.\nHiện tại Chưởng Môn đã đạt: ${count} lần (Còn thiếu ${ms - count} lần).`);
    }
}

function openTamBaoBXH() {
    sound.play('click');
    const modal = document.getElementById('modal-tambao-bxh');
    if (!modal) return;
    const myCountEl = document.getElementById('tb-bxh-my-count');
    if (myCountEl && GameState.playerData) {
        myCountEl.textContent = GameState.playerData.tambaoCount || 1277;
    }
    modal.style.display = 'flex';
}

function closeTamBaoBXH() {
    sound.play('click');
    const modal = document.getElementById('modal-tambao-bxh');
    if (modal) modal.style.display = 'none';
}


// ================= 100% AUTHENTIC THẦN KHÍ SYSTEM (media_1793097679825_6e27c42b.jpg & media_1793097700309_530ba1b7.jpg) =================
let thanKhiData = {
    name: 'Lưỡng Nghi Thần Khí',
    level: 99,
    statDef: 2450,
    statHp: 4208,
    statAtk: 320,
    lockSlot1: false,
    lockSlot2: false
};

function openThanKhiModal() {
    sound.play('click');
    const modal = document.getElementById('modal-thankhi-info');
    if (!modal) return;
    
    if (GameState.playerData && GameState.playerData.thanKhi) {
        thanKhiData = Object.assign(thanKhiData, GameState.playerData.thanKhi);
    }
    
    const defEl = document.getElementById('tk-info-stat-def');
    const hpEl = document.getElementById('tk-info-stat-hp');
    if (defEl) defEl.textContent = thanKhiData.statDef;
    if (hpEl) hpEl.textContent = thanKhiData.statHp;
    
    modal.style.display = 'flex';
}

function closeThanKhiModal() {
    sound.play('click');
    const modal = document.getElementById('modal-thankhi-info');
    if (modal) modal.style.display = 'none';
}

function openThanKhiEpPhamScreen() {
    sound.play('click');
    closeThanKhiModal();
    const screen = document.getElementById('screen-thankhi-eppham');
    if (!screen) return;
    
    updateThanKhiEpPhamUI();
    screen.style.display = 'flex';
}

function closeThanKhiEpPhamScreen() {
    sound.play('click');
    const screen = document.getElementById('screen-thankhi-eppham');
    if (screen) screen.style.display = 'none';
    openThanKhiModal();
}

function updateThanKhiEpPhamUI() {
    const cardLvlEl = document.getElementById('tk-ep-card-lvl');
    const stat1El = document.getElementById('tk-preview-stat1');
    const stat2El = document.getElementById('tk-preview-stat2');
    const slatVal1El = document.getElementById('tk-slat-val-1');
    const slatVal2El = document.getElementById('tk-slat-val-2');
    
    if (cardLvlEl) cardLvlEl.textContent = thanKhiData.level >= 99 ? 1 : thanKhiData.level;
    if (stat1El) stat1El.textContent = thanKhiData.statAtk;
    if (stat2El) stat2El.textContent = thanKhiData.statDef;
    if (slatVal1El) slatVal1El.textContent = thanKhiData.statAtk;
    if (slatVal2El) slatVal2El.textContent = thanKhiData.statDef;
    
    const r1 = document.getElementById('tk-lock-radio-1');
    const r2 = document.getElementById('tk-lock-radio-2');
    if (r1) {
        if (thanKhiData.lockSlot1) r1.classList.add('locked');
        else r1.classList.remove('locked');
    }
    if (r2) {
        if (thanKhiData.lockSlot2) r2.classList.add('locked');
        else r2.classList.remove('locked');
    }
}

function toggleLockThanKhiSlot(slot) {
    sound.play('click');
    if (slot === 1) {
        thanKhiData.lockSlot1 = !thanKhiData.lockSlot1;
    } else if (slot === 2) {
        thanKhiData.lockSlot2 = !thanKhiData.lockSlot2;
    }
    updateThanKhiEpPhamUI();
}

function doThanKhiEpPham(type) {
    sound.play('click');
    if (!GameState.playerData || !GameState.playerData.Account) return;
    
    let lockCount = (thanKhiData.lockSlot1 ? 1 : 0) + (thanKhiData.lockSlot2 ? 1 : 0);
    let lockGoldCost = lockCount * 20;
    
    let baseSilver = type === 'thuong' ? 2000000 : 0;
    let baseGold = type === 'caocap' ? 50 : 0;
    let totalGold = baseGold + lockGoldCost;
    
    const curSilver = GameState.playerData.Account.Bac || 0;
    const curGold = GameState.playerData.Account.Vang || 0;
    
    if (curSilver < baseSilver) {
        alert(`❌ [KHÔNG ĐỦ NGÂN LƯỢNG] ❌\nCần ${baseSilver.toLocaleString('vi-VN')} Bạc để ép phẩm thường!\nHiện tại chỉ có: ${curSilver.toLocaleString('vi-VN')} Bạc.`);
        return;
    }
    if (curGold < totalGold) {
        alert(`❌ [KHÔNG ĐỦ VÀNG] ❌\nCần ${totalGold} Vàng (phí ép + ${lockGoldCost} Vàng khóa dòng)!\nHiện tại chỉ có: ${curGold} Vàng.`);
        return;
    }
    
    // Deduct
    GameState.playerData.Account.Bac -= baseSilver;
    GameState.playerData.Account.Vang -= totalGold;
    
    // Re-roll unlocked attributes
    if (!thanKhiData.lockSlot1) {
        const minVal = type === 'caocap' ? 350 : 280;
        const maxVal = type === 'caocap' ? 650 : 480;
        thanKhiData.statAtk = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
    }
    if (!thanKhiData.lockSlot2) {
        const minVal = type === 'caocap' ? 450 : 380;
        const maxVal = type === 'caocap' ? 800 : 580;
        thanKhiData.statDef = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
    }
    
    if (!GameState.playerData.thanKhi) GameState.playerData.thanKhi = {};
    Object.assign(GameState.playerData.thanKhi, thanKhiData);
    
    saveGameState();
    updateHeader();
    updateThanKhiEpPhamUI();
    sound.play('victory');
    
    alert(`✨ [ÉP PHẨM THẦN KHÍ THÀNH CÔNG] ✨\nĐã tẩy luyện thuộc tính Lưỡng Nghi Thần Khí:\n⚔️ Công kích: ${thanKhiData.statAtk}\n🛡️ Phòng ngự: ${thanKhiData.statDef}`);
}

function doThanKhiCuongHoa() {
    sound.play('click');
    if (!GameState.playerData || !GameState.playerData.Account) return;
    
    const costSilver = 2545200;
    const curSilver = GameState.playerData.Account.Bac || 0;
    
    if (curSilver < costSilver) {
        alert(`❌ [CẤP ĐỘ MÔN PHÁI HOẶC BẠC KHÔNG ĐỦ] ❌\nCần ${costSilver.toLocaleString('vi-VN')} Bạc để cường hóa cấp kế tiếp.\nHiện có: ${curSilver.toLocaleString('vi-VN')} Bạc.`);
        return;
    }
    
    GameState.playerData.Account.Bac -= costSilver;
    thanKhiData.level = (thanKhiData.level || 99) + 1;
    thanKhiData.statDef += 50;
    thanKhiData.statHp += 80;
    
    if (!GameState.playerData.thanKhi) GameState.playerData.thanKhi = {};
    Object.assign(GameState.playerData.thanKhi, thanKhiData);
    
    saveGameState();
    updateHeader();
    
    const defEl = document.getElementById('tk-info-stat-def');
    const hpEl = document.getElementById('tk-info-stat-hp');
    if (defEl) defEl.textContent = thanKhiData.statDef;
    if (hpEl) hpEl.textContent = thanKhiData.statHp;
    
    sound.play('victory');
    alert(`🎉 [CƯỜNG HÓA THÀNH CÔNG] 🎉\nLưỡng Nghi Thần Khí đã thăng lên Cấp ${thanKhiData.level}!\n🛡️ Phòng thủ: +50\n🩸 Khí huyết: +80`);
}

function doThanKhiShare() {
    sound.play('click');
    alert(`📢 [CHIA SẺ THẦN KHÍ] 📢\nĐã sao chép liên kết khoe Lưỡng Nghi Thần Khí phẩm Kim lên Facebook!`);
}

function openThanKhiHelp() {
    sound.play('click');
    alert(`📜 [HƯỚNG DẪN ÉP PHẨM THẦN KHÍ] 📜\n1. Thần khí có 2 dòng thuộc tính ngẫu nhiên gia tăng sức mạnh cho toàn đội hình.\n2. Chưởng môn có thể dùng Bạc hoặc Vàng để tẩy luyện (ép phẩm) lại các chỉ số này.\n3. Khi xuất hiện thuộc tính ưng ý, có thể bấm "Cố định" (tốn 20 Vàng) để khóa dòng đó lại khi ép tiếp!`);
}

function openThanKhiInventory() {
    sound.play('click');
    alert(`🎒 [KHO THẦN KHÍ] 🎒\nHiện tại Chưởng Môn đang mang thần khí mạnh nhất: [Lưỡng Nghi Thần Khí] phẩm Kim Hoàng Gia.`);
}


/* =========================================================================
   AUTHENTIC HOÀNG KIM ĐỆ TỬ & HOÀNG KIM VÕ CÔNG (100% ORIGINAL GUI)
   ========================================================================= */
const hoangKimState = {
    selectedHeroId: null,
    selectedSkillId: 'skill_cuucung',
    tinhPhach: 3236,
    heroTiers: {
        'default': 0,
        'hero_truongtamphong': 0,
        'hero_trieuman': 10
    },
    skills: {
        'skill_cuucung': {
            id: 'skill_cuucung',
            name: 'Cửu Cung Kiếm Pháp',
            iconPurple: '/assets/ui/hoangkim_authentic/icon_vc_purple.png',
            iconGold: '/assets/ui/hoangkim_authentic/icon_vc_gold.png',
            quality: 'giap',
            statType: 'Thân pháp',
            statVal: 82,
            level: 5
        },
        'skill_tiemvu': {
            id: 'skill_tiemvu',
            name: 'Tiêm Vũ Băng Châm',
            iconPurple: '/assets/ui/hoangkim_authentic/icon_vc_purple.png',
            iconGold: '/assets/ui/hoangkim_authentic/icon_vc_gold.png',
            quality: 'giap',
            statType: 'Thân pháp',
            statVal: 96,
            level: 6
        },
        'skill_bangphach': {
            id: 'skill_bangphach',
            name: 'Băng Phách Thần Công',
            iconPurple: '/assets/ui/hoangkim_authentic/icon_vc_purple.png',
            iconGold: '/assets/ui/hoangkim_authentic/icon_vc_gold.png',
            quality: 'giap',
            statType: 'Nội lực',
            statVal: 115,
            level: 7
        }
    }
};

function getHoangKimSelectedHero() {
    let hero = null;
    const heroList = (typeof GameState !== 'undefined' && GameState.playerData && GameState.playerData.NhanVat) 
        ? GameState.playerData.NhanVat : [];

    if (hoangKimState.selectedHeroId) {
        hero = heroList.find(h => (h.id || h.Id) === hoangKimState.selectedHeroId);
    }
    if (!hero && heroList.length > 0) {
        hero = heroList[0];
        hoangKimState.selectedHeroId = (hero.id || hero.Id);
    }
    if (!hero) {
        hero = {
            id: 'hero_truongtamphong',
            name: 'Trương Tam Phong',
            avatar: '/assets/ui/hoangkim_authentic/avatar_hero_purple.png',
            quality: 'giap',
            level: 99
        };
        hoangKimState.selectedHeroId = hero.id;
    }
    return hero;
}

function getHoangKimHeroTier(heroId) {
    if (typeof hoangKimState.heroTiers[heroId] === 'number') {
        return hoangKimState.heroTiers[heroId];
    }
    // Default tier is 0
    return 0;
}

function renderHoangKimDeTuScreen() {
    const hero = getHoangKimSelectedHero();
    const heroId = hero.id || hero.Id;
    const currentTier = getHoangKimHeroTier(heroId);

    const normalBox = document.getElementById('hk-detu-box-normal');
    const maxBox = document.getElementById('hk-detu-box-max');
    const matSection = document.getElementById('hk-detu-mat-section');

    const curAvatarEl = document.getElementById('hk-hero-cur-avatar');
    const nextAvatarEl = document.getElementById('hk-hero-next-avatar');
    const curTierEl = document.getElementById('hk-hero-cur-tier');
    const nextTierEl = document.getElementById('hk-hero-next-tier');
    const maxAvatarEl = document.getElementById('hk-hero-max-avatar');
    const tinhPhachBadge = document.getElementById('hk-tinhphach-badge');

    if (tinhPhachBadge) {
        tinhPhachBadge.textContent = hoangKimState.tinhPhach;
    }

    const heroAvatarSrc = (hero.avatar && hero.avatar.startsWith('/assets/')) 
        ? hero.avatar : '/assets/ui/hoangkim_authentic/avatar_hero_purple.png';

    if (currentTier >= 10) {
        // Disciples that reached MAX (Level 10)
        if (normalBox) normalBox.style.display = 'none';
        if (matSection) matSection.style.display = 'none';
        if (maxBox) maxBox.style.display = 'flex';

        if (maxAvatarEl) {
            maxAvatarEl.src = (heroId === 'hero_trieuman') 
                ? '/assets/ui/hoangkim_authentic/avatar_hero_max10.png' 
                : '/assets/ui/hoangkim_authentic/avatar_hero_gold.png';
        }
    } else {
        // Disciples upgrading
        if (normalBox) normalBox.style.display = 'flex';
        if (matSection) matSection.style.display = 'flex';
        if (maxBox) maxBox.style.display = 'none';

        if (curAvatarEl) {
            curAvatarEl.src = (currentTier === 0) 
                ? '/assets/ui/hoangkim_authentic/avatar_hero_purple.png' 
                : '/assets/ui/hoangkim_authentic/avatar_hero_gold.png';
        }
        if (curTierEl) curTierEl.textContent = currentTier;

        if (nextAvatarEl) {
            nextAvatarEl.src = '/assets/ui/hoangkim_authentic/avatar_hero_gold.png';
        }
        if (nextTierEl) nextTierEl.textContent = currentTier + 1;
    }
}

function openHoangKimDeTuScreen(heroId) {
    if (typeof sound !== 'undefined') sound.play('click');
    if (heroId) {
        hoangKimState.selectedHeroId = heroId;
    }
    renderHoangKimDeTuScreen();

    const scr = document.getElementById('screen-hoangkim-detu');
    if (scr) {
        scr.style.display = 'flex';
    }
}

function closeHoangKimDeTuScreen() {
    if (typeof sound !== 'undefined') sound.play('click');
    const scr = document.getElementById('screen-hoangkim-detu');
    if (scr) scr.style.display = 'none';
}

function openHoangKimDeTuFromHeroModal() {
    const heroId = (typeof GameState !== 'undefined') ? (GameState.selectedDiscipleId || GameState.selectedFormationDiscipleId) : null;
    if (typeof closeDiscipleDetailModal === 'function') {
        closeDiscipleDetailModal();
    }
    openHoangKimDeTuScreen(heroId);
}

function doHoangKimDeTu() {
    const hero = getHoangKimSelectedHero();
    const heroId = hero.id || hero.Id;
    const currentTier = getHoangKimHeroTier(heroId);

    if (currentTier >= 10) {
        alert('Đệ tử đã đạt cấp Hoàng Kim tối đa (Cấp 10)!');
        return;
    }

    if (hoangKimState.tinhPhach < 200) {
        alert('Không đủ Hoàng Kim Tinh Phách! Cần x200 Hoàng Kim Tinh Phách.');
        return;
    }

    // Deduct materials
    hoangKimState.tinhPhach -= 200;
    const newTier = currentTier + 1;
    hoangKimState.heroTiers[heroId] = newTier;

    if (typeof sound !== 'undefined') {
        sound.play('level_up');
    }

    renderHoangKimDeTuScreen();

    const heroName = hero.name || hero.Ten || 'Đệ tử';
    alert('🎉 CHÚC MỪNG CHƯỞNG MÔN! 🎉\n' +
          'Đệ tử [' + heroName + '] đã đột phá HOÀNG KIM CẤP ' + newTier + ' thành công!\n' +
          '⭐ Tăng +1 Cấp võ công thiên phú\n' +
          '⭐ Tăng +20% toàn bộ duyên phận\n' +
          '⭐ Duyên phận kích hoạt nhân đôi sức mạnh!');
}

/* =========================================================================
   HOÀNG KIM VÕ CÔNG LOGIC
   ========================================================================= */
function renderHoangKimVoCongScreen() {
    const skill = hoangKimState.skills[hoangKimState.selectedSkillId] || hoangKimState.skills['skill_cuucung'];

    const curIconEl = document.getElementById('hk-vc-cur-icon');
    const nextIconEl = document.getElementById('hk-vc-next-icon');
    const curLvlEl = document.getElementById('hk-vc-cur-lvl');
    const nextLvlEl = document.getElementById('hk-vc-next-lvl');
    const curStatVal = document.getElementById('hk-vc-cur-stat-val');
    const nextStatVal = document.getElementById('hk-vc-next-stat-val');
    const ownTinhPhachEl = document.getElementById('hk-vc-own-tinhphach');

    if (ownTinhPhachEl) {
        ownTinhPhachEl.textContent = hoangKimState.tinhPhach;
    }

    if (curIconEl) {
        curIconEl.src = (skill.quality === 'kim') ? skill.iconGold : skill.iconPurple;
    }
    if (nextIconEl) {
        nextIconEl.src = skill.iconGold;
    }
    if (curLvlEl) curLvlEl.textContent = skill.level;
    if (nextLvlEl) nextLvlEl.textContent = skill.level;

    if (curStatVal) curStatVal.textContent = skill.statVal;
    if (nextStatVal) {
        nextStatVal.textContent = (skill.quality === 'kim') ? skill.statVal : (skill.statVal * 2);
    }
}

function openHoangKimVoCongScreen(skillId) {
    if (typeof sound !== 'undefined') sound.play('click');
    if (skillId && hoangKimState.skills[skillId]) {
        hoangKimState.selectedSkillId = skillId;
    }
    renderHoangKimVoCongScreen();

    const scr = document.getElementById('screen-hoangkim-vocong');
    if (scr) scr.style.display = 'flex';
}

function closeHoangKimVoCongScreen() {
    if (typeof sound !== 'undefined') sound.play('click');
    const scr = document.getElementById('screen-hoangkim-vocong');
    if (scr) scr.style.display = 'none';
}

function openHoangKimVoCongFromSkillModal() {
    if (typeof closeVoCongDetailModal === 'function') {
        closeVoCongDetailModal();
    }
    openHoangKimVoCongScreen();
}

function doHoangKimVoCong() {
    const skill = hoangKimState.skills[hoangKimState.selectedSkillId] || hoangKimState.skills['skill_cuucung'];

    if (skill.quality === 'kim') {
        alert('Võ công [' + skill.name + '] đã đạt phẩm chất HOÀNG KIM [Kim] chí tôn!');
        return;
    }

    if (hoangKimState.tinhPhach < 80) {
        alert('Không đủ Hoàng Kim Tinh Phách! Cần x80 Hoàng Kim Tinh Phách để thăng cấp.');
        return;
    }

    // Deduct
    hoangKimState.tinhPhach -= 80;
    skill.quality = 'kim';
    skill.statVal = skill.statVal * 2;

    if (typeof sound !== 'undefined') {
        sound.play('level_up');
    }

    renderHoangKimVoCongScreen();

    alert('✨ THĂNG CẤP HOÀNG KIM THÀNH CÔNG! ✨\n' +
          'Võ công [' + skill.name + '] đã chuyển hóa thành công pháp HOÀNG KIM [Kim]!\n' +
          '⭐ Chỉ số thuộc tính tăng gấp đôi (+' + skill.statVal + ' ' + skill.statType + ')\n' +
          '⭐ Kích hoạt duyên phận đệ tử nhận x2 uy lực!');
}

/* =========================================================================
   SELECTION MODALS FOR HEROES & SKILLS
   ========================================================================= */
function openSelectHoangKimHeroModal() {
    if (typeof sound !== 'undefined') sound.play('click');
    const listEl = document.getElementById('hk-select-hero-list');
    if (!listEl) return;

    listEl.innerHTML = '';
    const heroList = (typeof GameState !== 'undefined' && GameState.playerData && GameState.playerData.NhanVat) 
        ? GameState.playerData.NhanVat : [
            { id: 'hero_truongtamphong', name: 'Trương Tam Phong', avatar: '/assets/ui/hoangkim_authentic/avatar_hero_purple.png', quality: 'giap', level: 99 },
            { id: 'hero_trieuman', name: 'Triệu Mẫn', avatar: '/assets/ui/hoangkim_authentic/avatar_hero_max10.png', quality: 'kim', level: 100 },
            { id: 'hero_duongqua', name: 'Dương Quá', avatar: '/assets/images/NV_DuongQua_ava_to.png', quality: 'giap', level: 95 },
            { id: 'hero_lenhhoxung', name: 'Lệnh Hồ Xung', avatar: '/assets/images/NV_LenhHoXung_ava_to.png', quality: 'giap', level: 92 },
            { id: 'hero_dongphuong', name: 'Đông Phương Bất Bại', avatar: '/assets/images/NV_DongPhuongBatBai_ava_to.png', quality: 'kim', level: 99 }
        ];

    heroList.forEach(h => {
        const hId = h.id || h.Id;
        const hName = h.name || h.Ten || 'Đệ tử';
        const tier = getHoangKimHeroTier(hId);
        const item = document.createElement('div');
        item.className = 'hk-select-item';
        item.onclick = function() {
            selectHoangKimHero(hId);
        };

        const avaSrc = (hId === 'hero_trieuman') 
            ? '/assets/ui/hoangkim_authentic/avatar_hero_max10.png' 
            : (tier > 0 ? '/assets/ui/hoangkim_authentic/avatar_hero_gold.png' : '/assets/ui/hoangkim_authentic/avatar_hero_purple.png');

        item.innerHTML = `
            <img src="${avaSrc}" style="width: 46px; height: 46px; border-radius: 6px; border: 1px solid #ca8a04;">
            <div style="flex: 1;">
                <div style="color: #ffd700; font-weight: bold; font-size: 13px;">${hName}</div>
                <div style="font-size: 11px; color: #cbd5e1;">Cấp Hoàng Kim: <b style="color: ${tier >= 10 ? '#facc15' : '#4ade80'};">${tier >= 10 ? 'Cấp 10 (Tối đa)' : 'Cấp ' + tier}</b></div>
            </div>
            <button class="btn-wuxia-gold" style="width: 70px; height: 28px; font-size: 11px;">Chọn</button>
        `;
        listEl.appendChild(item);
    });

    const modal = document.getElementById('modal-select-hk-hero');
    if (modal) modal.style.display = 'flex';
}

function closeSelectHoangKimHeroModal() {
    if (typeof sound !== 'undefined') sound.play('click');
    const modal = document.getElementById('modal-select-hk-hero');
    if (modal) modal.style.display = 'none';
}

function selectHoangKimHero(heroId) {
    hoangKimState.selectedHeroId = heroId;
    closeSelectHoangKimHeroModal();
    renderHoangKimDeTuScreen();
}

function openSelectHoangKimSkillModal() {
    if (typeof sound !== 'undefined') sound.play('click');
    const listEl = document.getElementById('hk-select-skill-list');
    if (!listEl) return;

    listEl.innerHTML = '';
    Object.values(hoangKimState.skills).forEach(s => {
        const item = document.createElement('div');
        item.className = 'hk-select-item';
        item.onclick = function() {
            selectHoangKimSkill(s.id);
        };

        item.innerHTML = `
            <img src="${s.quality === 'kim' ? s.iconGold : s.iconPurple}" style="width: 46px; height: 46px; border-radius: 6px; border: 1px solid #ca8a04;">
            <div style="flex: 1;">
                <div style="color: #ffd700; font-weight: bold; font-size: 13px;">${s.name}</div>
                <div style="font-size: 11px; color: #cbd5e1;">Phẩm chất: <b style="color: ${s.quality === 'kim' ? '#facc15' : '#c084fc'};">${s.quality === 'kim' ? 'KIM' : 'GIÁP'}</b> | ${s.statType}: +${s.statVal}</div>
            </div>
            <button class="btn-wuxia-gold" style="width: 70px; height: 28px; font-size: 11px;">Chọn</button>
        `;
        listEl.appendChild(item);
    });

    const modal = document.getElementById('modal-select-hk-skill');
    if (modal) modal.style.display = 'flex';
}

function closeSelectHoangKimSkillModal() {
    if (typeof sound !== 'undefined') sound.play('click');
    const modal = document.getElementById('modal-select-hk-skill');
    if (modal) modal.style.display = 'none';
}

function selectHoangKimSkill(skillId) {
    hoangKimState.selectedSkillId = skillId;
    closeSelectHoangKimSkillModal();
    renderHoangKimVoCongScreen();
}

function showMatDetail(matKey) {
    if (typeof sound !== 'undefined') sound.play('click');
    const hints = {
        longchau: '🐲 [Long châu Hoàng kim]\nBảo châu tích tụ nguyên khí rồng thiêng, thu thập tại Thất Tinh Long Châu hoặc Đại Chiến Liên Server.',
        amkhi: '🗡️ [Ám khí Giáp]\nÁm khí Giáp phẩm cực hạn, rèn đúc tại Lò Rèn Ám Khí hoặc vượt ải Kỳ Ngộ.',
        tinhphach: '⭐ [Hoàng Kim Tinh Phách]\nTinh phách vũ trụ thượng cổ, đoạt được từ Đua Top Chiến Lực, săn Boss Thế Giới hoặc Phân giải Thần Binh.',
        huyenkiem: '⚔️ [Huyền Thiết trọng kiếm]\nThần kiếm ngàn cân từ thiên thạch ngoài hành tinh của Độc Cô Cầu Bại.',
        thatbaobao: '🥋 [Thất Bảo Hồn Lăng bào]\nBảo y thần bí dệt từ tơ trời thất sắc, phòng ngự vô song.',
        thankhi: '✨ [Lưỡng Nghi Thần Khí]\nThần khí thái cực thượng cổ có thể xoay chuyển càn khôn trong tab Dàn Trận.'
    };
    alert(hints[matKey] || 'Kỳ trân dị bảo võ lâm!');
}


/* =========================================================================
   100% AUTHENTIC TRUYỀN CÔNG LỰC SYSTEM
   ========================================================================= */
const truyenCongState = {
    targetHeroId: 'hero_datma',
    sourceHeroId: 'hero_dichphong',
    exp: 150764161917,
    targetOldLvl: 373,
    targetNewLvl: 527,
    dan: 27332,
    sam: 375658,
    selectingType: null // 'target' or 'source'
};

const truyenCongHeroRoster = {
    'hero_datma': {
        id: 'hero_datma',
        name: 'Đạt Ma Tổ Sư',
        avatar: '/assets/ui/truyencong_authentic/ava_dat_ma.png',
        level: 373,
        tier: 0,
        quality: 'Giáp 1'
    },
    'hero_dichphong': {
        id: 'hero_dichphong',
        name: 'Dịch Phong',
        avatar: '/assets/ui/truyencong_authentic/ava_dich_phong.png',
        level: 525,
        tier: 5,
        quality: 'Giáp 1'
    },
    'hero_truongtamphong': {
        id: 'hero_truongtamphong',
        name: 'Trương Tam Phong',
        avatar: '/assets/ui/hoangkim_authentic/avatar_hero_purple.png',
        level: 495,
        tier: 1,
        quality: 'Giáp 1'
    },
    'hero_trieuman': {
        id: 'hero_trieuman',
        name: 'Triệu Mẫn',
        avatar: '/assets/ui/hoangkim_authentic/avatar_hero_max10.png',
        level: 510,
        tier: 10,
        quality: 'Kim'
    }
};

function renderTruyenCongScreen() {
    const targetHero = truyenCongHeroRoster[truyenCongState.targetHeroId] || truyenCongHeroRoster['hero_datma'];
    const sourceHero = truyenCongHeroRoster[truyenCongState.sourceHeroId] || truyenCongHeroRoster['hero_dichphong'];

    // Render target disciple
    const targetAva = document.getElementById('tc-target-ava');
    const targetName = document.getElementById('tc-target-name');
    const targetLvl = document.getElementById('tc-target-lvl');
    if (targetAva) targetAva.src = targetHero.avatar;
    if (targetName) targetName.textContent = targetHero.name;
    if (targetLvl) targetLvl.textContent = targetHero.level;

    // Render source disciple
    const sourceAva = document.getElementById('tc-source-ava');
    const sourceName = document.getElementById('tc-source-name');
    const sourceLvl = document.getElementById('tc-source-lvl');
    const sourceTier = document.getElementById('tc-source-tier');
    if (sourceAva) sourceAva.src = sourceHero.avatar;
    if (sourceName) sourceName.textContent = sourceHero.name;
    if (sourceLvl) sourceLvl.textContent = sourceHero.level;
    if (sourceTier) sourceTier.textContent = sourceHero.tier || 1;

    // Render stats
    const expVal = document.getElementById('tc-exp-val');
    const oldLvl = document.getElementById('tc-stat-old-lvl');
    const newLvl = document.getElementById('tc-stat-new-lvl');
    const danVal = document.getElementById('tc-dan-val');
    const samVal = document.getElementById('tc-sam-val');

    if (expVal) expVal.textContent = truyenCongState.exp.toLocaleString('vi-VN');
    if (oldLvl) oldLvl.textContent = targetHero.level;
    if (newLvl) newLvl.textContent = Math.max(targetHero.level, sourceHero.level + 2);
    if (danVal) danVal.textContent = truyenCongState.dan.toLocaleString('vi-VN');
    if (samVal) samVal.textContent = truyenCongState.sam.toLocaleString('vi-VN');
}

function openTruyenCongScreen(targetHeroId, sourceHeroId) {
    if (typeof sound !== 'undefined') sound.play('click');
    if (targetHeroId) truyenCongState.targetHeroId = targetHeroId;
    if (sourceHeroId) truyenCongState.sourceHeroId = sourceHeroId;

    renderTruyenCongScreen();
    const scr = document.getElementById('screen-truyencong');
    if (scr) scr.style.display = 'flex';
}

function closeTruyenCongScreen() {
    if (typeof sound !== 'undefined') sound.play('click');
    const scr = document.getElementById('screen-truyencong');
    if (scr) scr.style.display = 'none';
}

function openSelectTruyenCongTargetModal() {
    truyenCongState.selectingType = 'target';
    openSelectTruyenCongModal('Chọn Đệ Tử Nhận Công');
}

function openSelectTruyenCongSourceModal() {
    truyenCongState.selectingType = 'source';
    openSelectTruyenCongModal('Chọn Đệ Tử Cho Công (Sẽ Hi Sinh)');
}

function openSelectTruyenCongModal(title) {
    if (typeof sound !== 'undefined') sound.play('click');
    const titleEl = document.getElementById('tc-select-modal-title');
    const listEl = document.getElementById('tc-select-hero-list');
    if (titleEl) titleEl.textContent = title;
    if (!listEl) return;

    listEl.innerHTML = '';
    Object.values(truyenCongHeroRoster).forEach(h => {
        const item = document.createElement('div');
        item.className = 'hk-select-item';
        item.onclick = function() {
            if (truyenCongState.selectingType === 'target') {
                truyenCongState.targetHeroId = h.id;
            } else {
                truyenCongState.sourceHeroId = h.id;
            }
            closeSelectTruyenCongModal();
            renderTruyenCongScreen();
        };

        item.innerHTML = `
            <img src="${h.avatar}" style="width: 46px; height: 46px; border-radius: 6px; border: 1px solid #ca8a04;">
            <div style="flex: 1;">
                <div style="color: #ffd700; font-weight: bold; font-size: 13px;">${h.name}</div>
                <div style="font-size: 11px; color: #cbd5e1;">Phẩm chất: <b style="color: #c084fc;">${h.quality}</b> | Cấp độ: <b style="color: #4ade80;">${h.level}</b></div>
            </div>
            <button class="btn-wuxia-gold" style="width: 70px; height: 28px; font-size: 11px;">Chọn</button>
        `;
        listEl.appendChild(item);
    });

    const modal = document.getElementById('modal-select-tc-hero');
    if (modal) modal.style.display = 'flex';
}

function closeSelectTruyenCongModal() {
    if (typeof sound !== 'undefined') sound.play('click');
    const modal = document.getElementById('modal-select-tc-hero');
    if (modal) modal.style.display = 'none';
}

function doExecuteTruyenCong() {
    const target = truyenCongHeroRoster[truyenCongState.targetHeroId] || truyenCongHeroRoster['hero_datma'];
    const source = truyenCongHeroRoster[truyenCongState.sourceHeroId] || truyenCongHeroRoster['hero_dichphong'];

    if (target.id === source.id) {
        alert('Đệ tử nhận công và đệ tử cho công không thể là cùng một người!');
        return;
    }

    const confirmed = confirm(
        '⚠️ CẢNH BÁO TRUYỀN CÔNG LỰC ⚠️\n' +
        'Đệ tử truyền công [' + source.name + '] (Cấp ' + source.level + ') sẽ HI SINH và rời khỏi môn phái!\n' +
        'Đệ tử nhận công [' + target.name + '] sẽ hấp thụ toàn bộ tu vi thăng cấp lên CẤP ' + truyenCongState.targetNewLvl + '!\n\n' +
        'Chưởng môn có chắc chắn muốn tiến hành truyền công lực?'
    );

    if (!confirmed) return;

    if (typeof sound !== 'undefined') sound.play('level_up');

    target.level = truyenCongState.targetNewLvl;
    renderTruyenCongScreen();

    alert(
        '🌟 TRUYỀN CÔNG LỰC ĐẠI THÀNH! 🌟\n' +
        'Đệ tử [' + target.name + '] đã đột phá lên CẤP ' + target.level + '!\n' +
        '🎁 Thu hồi ' + truyenCongState.dan.toLocaleString('vi-VN') + ' Bồi Dưỡng Đan\n' +
        '🎁 Thu hồi ' + truyenCongState.sam.toLocaleString('vi-VN') + ' Bách Niên Sâm\n' +
        '[' + source.name + '] đã hoàn thành sứ mệnh và quy ẩn giang hồ!'
    );
}

// Backward-compatible alias
function openTruyenCongModal() {
    openTruyenCongScreen();
}

/* =========================================================================
   100% AUTHENTIC THAM NGỘ VÕ CÔNG SYSTEM
   ========================================================================= */
const thamNgoState = {
    targetSkillId: 'skill_linhte',
    slots: [null, null, null, null, null]
};

const thamNgoSkillLibrary = {
    'skill_linhte': {
        id: 'skill_linhte',
        name: 'Linh Tê Nhất Chỉ',
        icon: '/assets/ui/thamngo_authentic/icon_linh_te_nhat_chi.png',
        quality: 'Giáp 1',
        tier: 'giap',
        level: 18,
        statType: 'Thân pháp',
        statVal: 780
    },
    'skill_cuucung': {
        id: 'skill_cuucung',
        name: 'Cửu Cung Kiếm Pháp',
        icon: '/assets/ui/hoangkim_authentic/icon_vc_purple.png',
        quality: 'Giáp 1',
        tier: 'giap',
        level: 15,
        statType: 'Công kích',
        statVal: 620
    },
    'skill_tiemvu': {
        id: 'skill_tiemvu',
        name: 'Tiêm Vũ Băng Châm',
        icon: '/assets/ui/hoangkim_authentic/icon_vc_purple.png',
        quality: 'Ất',
        tier: 'at',
        level: 12,
        statType: 'Thân pháp',
        statVal: 430
    },
    'skill_kimxa': {
        id: 'skill_kimxa',
        name: 'Kim Xà Kiếm Pháp',
        icon: '/assets/ui/hoangkim_authentic/icon_vc_purple.png',
        quality: 'Bính',
        tier: 'binh',
        level: 10,
        statType: 'Bạo kích',
        statVal: 280
    }
};

function renderThamNgoScreen() {
    const target = thamNgoSkillLibrary[thamNgoState.targetSkillId] || thamNgoSkillLibrary['skill_linhte'];

    const iconEl = document.getElementById('tn-target-icon');
    const lvlEl = document.getElementById('tn-target-lvl-badge');
    const nameEl = document.getElementById('tn-target-name');
    const capEl = document.getElementById('tn-target-cap-num');
    const statEl = document.getElementById('tn-target-stat-val');

    if (iconEl) iconEl.src = target.icon;
    if (lvlEl) lvlEl.textContent = target.level;
    if (nameEl) nameEl.textContent = target.name;
    if (capEl) capEl.textContent = target.level;
    if (statEl) statEl.textContent = target.statVal;

    // Render 5 slots
    for (let i = 0; i < 5; i++) {
        const slotImg = document.getElementById('tn-slot-img-' + i);
        if (slotImg) {
            if (thamNgoState.slots[i]) {
                slotImg.src = thamNgoState.slots[i].icon;
                slotImg.style.borderRadius = '6px';
            } else {
                slotImg.src = '/assets/ui/thamngo_authentic/slot_ink_plus.png';
            }
        }
    }
}

function openThamNgoScreen(skillId) {
    if (typeof sound !== 'undefined') sound.play('click');
    if (skillId && thamNgoSkillLibrary[skillId]) {
        thamNgoState.targetSkillId = skillId;
    }
    renderThamNgoScreen();
    const scr = document.getElementById('screen-thamngo');
    if (scr) scr.style.display = 'flex';
}

function closeThamNgoScreen() {
    if (typeof sound !== 'undefined') sound.play('click');
    const scr = document.getElementById('screen-thamngo');
    if (scr) scr.style.display = 'none';
}

function clickThamNgoSlot(slotIdx) {
    if (typeof sound !== 'undefined') sound.play('click');
    if (thamNgoState.slots[slotIdx]) {
        // Clear slot
        thamNgoState.slots[slotIdx] = null;
        renderThamNgoScreen();
    } else {
        openSelectThamNgoSkillForSlot(slotIdx);
    }
}

let activeSlotIndex = 0;
function openSelectThamNgoSkillForSlot(slotIdx) {
    activeSlotIndex = slotIdx;
    const listEl = document.getElementById('tn-select-skill-list');
    if (!listEl) return;

    listEl.innerHTML = '';
    Object.values(thamNgoSkillLibrary).forEach(s => {
        if (s.id === thamNgoState.targetSkillId) return; // Cannot consume target itself

        const item = document.createElement('div');
        item.className = 'hk-select-item';
        item.onclick = function() {
            thamNgoState.slots[activeSlotIndex] = s;
            closeSelectThamNgoSkillModal();
            renderThamNgoScreen();
        };

        item.innerHTML = `
            <img src="${s.icon}" style="width: 44px; height: 44px; border-radius: 6px;">
            <div style="flex: 1;">
                <div style="color: #ffd700; font-weight: bold; font-size: 13px;">${s.name}</div>
                <div style="font-size: 11px; color: #cbd5e1;">Phẩm chất: <b style="color: #c084fc;">${s.quality}</b> | Cấp độ: ${s.level}</div>
            </div>
            <button class="btn-wuxia-gold" style="width: 70px; height: 28px; font-size: 11px;">Chọn</button>
        `;
        listEl.appendChild(item);
    });

    const modal = document.getElementById('modal-select-tn-skill');
    if (modal) modal.style.display = 'flex';
}

function closeSelectThamNgoSkillModal() {
    if (typeof sound !== 'undefined') sound.play('click');
    const modal = document.getElementById('modal-select-tn-skill');
    if (modal) modal.style.display = 'none';
}

function openSelectThamNgoTargetSkillModal() {
    const listEl = document.getElementById('tn-select-skill-list');
    if (!listEl) return;

    listEl.innerHTML = '';
    Object.values(thamNgoSkillLibrary).forEach(s => {
        const item = document.createElement('div');
        item.className = 'hk-select-item';
        item.onclick = function() {
            thamNgoState.targetSkillId = s.id;
            closeSelectThamNgoSkillModal();
            renderThamNgoScreen();
        };

        item.innerHTML = `
            <img src="${s.icon}" style="width: 44px; height: 44px; border-radius: 6px;">
            <div style="flex: 1;">
                <div style="color: #ffd700; font-weight: bold; font-size: 13px;">${s.name}</div>
                <div style="font-size: 11px; color: #cbd5e1;">Phẩm chất: <b style="color: #c084fc;">${s.quality}</b> | Cấp độ: ${s.level}</div>
            </div>
            <button class="btn-wuxia-gold" style="width: 70px; height: 28px; font-size: 11px;">Chọn</button>
        `;
        listEl.appendChild(item);
    });

    const modal = document.getElementById('modal-select-tn-skill');
    if (modal) modal.style.display = 'flex';
}

function fastSelectThamNgoTier(tier) {
    if (typeof sound !== 'undefined') sound.play('click');
    const tierName = tier === 'binh' ? 'Bính' : (tier === 'at' ? 'Ất' : 'Giáp');
    
    // Auto fill 5 dummy or actual skills of matching tier
    for (let i = 0; i < 5; i++) {
        thamNgoState.slots[i] = {
            id: 'dummy_' + tier + '_' + i,
            name: 'Võ Công [' + tierName + ']',
            icon: '/assets/ui/hoangkim_authentic/icon_vc_purple.png',
            quality: tierName,
            tier: tier,
            level: 1
        };
    }
    renderThamNgoScreen();
}

function doExecuteThamNgo() {
    const target = thamNgoSkillLibrary[thamNgoState.targetSkillId] || thamNgoSkillLibrary['skill_linhte'];
    const filledCount = thamNgoState.slots.filter(s => s !== null).length;

    if (filledCount === 0) {
        alert('Chưởng môn vui lòng chọn ít nhất 1 võ công tiêu hao hoặc bấm [Chọn Bính / Ất / Giáp]!');
        return;
    }

    if (typeof sound !== 'undefined') sound.play('level_up');

    target.level += filledCount;
    target.statVal += filledCount * 45;
    thamNgoState.slots = [null, null, null, null, null];
    renderThamNgoScreen();

    alert(
        '🌟 THAM NGỘ VÕ HỌC THÀNH CÔNG! 🌟\n' +
        'Võ công [' + target.name + '] đã đột phá lên CẤP ' + target.level + '!\n' +
        '⭐ Gia tăng +' + (filledCount * 45) + ' ' + target.statType + ' (Tổng: ' + target.statVal + ')\n' +
        '⭐ Đã tiêu hao thành công ' + filledCount + ' bí kíp võ công làm nguyên liệu tham ngộ!'
    );
}

// Backward-compatible alias
function openThamNgoModal() {
    openThamNgoScreen();
}
