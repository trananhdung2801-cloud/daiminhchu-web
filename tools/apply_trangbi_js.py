import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\js\game.js", "r", encoding="utf-8") as f:
    js = f.read()

new_trangbi_js = """
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
"""

# Replace renderItems body to call renderTrangBiList
old_render_items_start = "function renderItems() {"
old_render_items_end = "async function doUseItem(itemCode, count = 1) {"

s_idx = js.find(old_render_items_start)
e_idx = js.find(old_render_items_end)

if s_idx != -1 and e_idx != -1:
    render_items_impl = """function renderItems() {
    renderTrangBiList();
}

"""
    new_js = js[:s_idx] + new_trangbi_js + "\n" + render_items_impl + js[e_idx:]
    with open(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\js\game.js", "w", encoding="utf-8") as f:
        f.write(new_js)
    print("Updated renderItems and added Trang Bi logic in game.js successfully!")
else:
    print(f"Indices not found: s_idx={s_idx}, e_idx={e_idx}")
