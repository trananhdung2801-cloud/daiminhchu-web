import sys
sys.stdout.reconfigure(encoding='utf-8')

new_js_logic = """let currentDantranMode = 'doihinh';

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
"""

with open(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\js\game.js", "r", encoding="utf-8") as f:
    js = f.read()

s_marker = "function switchDantranMode(mode) {"
e_marker = "function renderHauCung() {"

s_idx = js.find(s_marker)
e_idx = js.find(e_marker)

if s_idx != -1 and e_idx != -1:
    new_js = js[:s_idx] + new_js_logic + "\n" + js[e_idx:]
    with open(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\js\game.js", "w", encoding="utf-8") as f:
        f.write(new_js)
    print("Updated switchDantranMode and tran renders in game.js successfully!")
else:
    print(f"Indices not found: s_idx={s_idx}, e_idx={e_idx}")
