import sys
sys.stdout.reconfigure(encoding='utf-8')

new_func = """function renderScrollPainting() {
    if (!GameState.playerData || !GameState.playerData.NhanVat) return;
    const disciples = GameState.playerData.NhanVat;
    let current = disciples.find(d => (d.id || d.Id) === (GameState.selectedDiscipleId || GameState.selectedFormationDiscipleId)) || disciples[0];
    if (!current) return;

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
            alert('Võ Công Thiên Phú: ' + (cfg.VoCongMacDinh || 'Điệp Vũ Cửu Thiên') + ' (Cấp ' + (current.skillLvl || 41) + ')\\nUy lực cực mạnh, tăng tỷ lệ xuất chiêu và sát thương bạo kích.');
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
"""

with open(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\js\game.js", "r", encoding="utf-8") as f:
    js = f.read()

start_marker = "function renderScrollPainting() {"
end_marker = "function openChanKhiModal() {"

s_idx = js.find(start_marker)
e_idx = js.find(end_marker)

if s_idx != -1 and e_idx != -1:
    new_js = js[:s_idx] + new_func + "\n\n" + js[e_idx:]
    with open(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\js\game.js", "w", encoding="utf-8") as f:
        f.write(new_js)
    print("Updated renderScrollPainting in public/js/game.js successfully!")
else:
    print(f"Indices: s_idx={s_idx}, e_idx={e_idx}")
