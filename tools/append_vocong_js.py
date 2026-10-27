import sys
sys.stdout.reconfigure(encoding='utf-8')

js_vocong = """
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
"""

with open(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\js\game.js", "a", encoding="utf-8") as f:
    f.write(js_vocong)

print("Appended authentic Vo Cong Info JS functions successfully!")
