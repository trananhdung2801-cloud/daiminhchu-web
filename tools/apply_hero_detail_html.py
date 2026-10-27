import sys
sys.stdout.reconfigure(encoding='utf-8')

new_modal_html = '''    <!-- ================= 100% AUTHENTIC THÔNG TIN NHÂN VẬT (TAB DÀN TRẬN) ================= -->
    <div id="disciple-detail-modal" class="modal-overlay">
        <div class="hero-detail-authentic-dialog anim-zoom-enter">
            <!-- Close Button (Red carved square with white X) -->
            <button class="hero-detail-close-btn" onclick="closeDiscipleDetailModal()" title="Đóng">
                <img src="/assets/ui/hero_info_authentic/btn_close.png" alt="Đóng"/>
            </button>

            <!-- Top Section: Left Hanging Scroll + Right Story & Skill & Price -->
            <div class="hero-detail-top-section">
                <!-- Left: Hanging Scroll (Tranh Cuộn) -->
                <div class="hero-detail-scroll-frame">
                    <img src="/assets/ui/hero_info_authentic/scroll_top_rod.png" class="scroll-rod-top" alt="Trục trên"/>
                    
                    <div class="hero-detail-scroll-painting">
                        <!-- Hero Portrait Image -->
                        <img id="hero-detail-portrait" src="/assets/images/NV_HuongHuongCongChua_ava_to.png" class="hero-detail-portrait-img" alt="Nhân vật"/>
                        
                        <!-- Top-Left Vertical Calligraphy Name -->
                        <div id="hero-detail-calligraphy-name" class="hero-detail-vert-name">
                            Hương Hương Công Chúa
                        </div>

                        <!-- Top-Right Quality Badge (KIM / GIÁP / ẤT / BÍNH) -->
                        <div id="hero-detail-quality-badge" class="hero-detail-badge-kim">
                            <img id="hero-detail-badge-img" src="/assets/ui/hero_info_authentic/badge_kim.png" alt="KIM"/>
                        </div>

                        <!-- Bottom Stats Overlay -->
                        <div class="hero-detail-stats-overlay">
                            <!-- Level & Exp -->
                            <div class="hero-detail-level-row">
                                <span class="hero-detail-breakthrough" id="hero-detail-caitao">+0</span>
                                <span class="hero-detail-level-num" id="hero-detail-level">495</span>
                                <span class="hero-detail-exp-text" id="hero-detail-exp">27256563248/154269351936</span>
                            </div>

                            <!-- 4 Core Stats Grid (2x2) -->
                            <div class="hero-detail-stats-grid">
                                <div class="hero-stat-cell">
                                    <img src="/assets/ui/hero_info_authentic/icon_stat_blood.png" class="hero-stat-icon" alt="Máu"/>
                                    <span id="hero-stat-val-mau">3542428</span>
                                </div>
                                <div class="hero-stat-cell">
                                    <img src="/assets/ui/hero_info_authentic/icon_stat_sword.png" class="hero-stat-icon" alt="Công"/>
                                    <span id="hero-stat-val-cong">194374</span>
                                </div>
                                <div class="hero-stat-cell">
                                    <img src="/assets/ui/hero_info_authentic/icon_stat_shield.png" class="hero-stat-icon" alt="Thủ"/>
                                    <span id="hero-stat-val-thu">6362385</span>
                                </div>
                                <div class="hero-stat-cell">
                                    <img src="/assets/ui/hero_info_authentic/icon_stat_palm.png" class="hero-stat-icon" alt="Nội"/>
                                    <span id="hero-stat-val-noi">787139464</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <img src="/assets/ui/hero_info_authentic/scroll_bottom_rod.png" class="scroll-rod-bottom" alt="Trục dưới"/>
                </div>

                <!-- Right: Bio Description, Võ Công & Giá Trị -->
                <div class="hero-detail-right-col">
                    <!-- Bio & Breakthrough Story -->
                    <div class="hero-detail-bio-box" id="hero-detail-bio">
                        Mỹ nữ người Hồi, sắc đẹp vạn người mê. Càng tấn công càng tăng tỷ lệ xuất chiêu, sức phòng ngự và nội lực (tính cả phản). Đột phá tầng 1 tăng thêm phòng ngự, tầng 2 gây ra sát thương chiêu bạo kích, tầng 5 tăng hộ thể.
                    </div>

                    <!-- Võ công -->
                    <div class="hero-detail-skill-section">
                        <div class="hero-detail-section-title">Võ công :</div>
                        <div class="hero-detail-skill-card" id="hero-detail-skill-card" onclick="alert('Võ Công Thiên Phú: Điệp Vũ Cửu Thiên (Lv.41)')" title="Võ Công Thiên Phú">
                            <img id="hero-detail-skill-icon" src="/assets/ui/hero_info_authentic/skill_sample.png" alt="Võ công"/>
                            <span class="hero-detail-skill-lvl" id="hero-detail-skill-lvl">41</span>
                        </div>
                    </div>

                    <!-- Giá trị -->
                    <div class="hero-detail-value-section">
                        <div class="hero-detail-section-title">Giá trị :</div>
                        <div class="hero-detail-value-row">
                            <span id="hero-detail-value-num">11995335</span>
                            <img src="/assets/ui/hero_info_authentic/icon_gold_ingot_clean.png" class="hero-detail-ingot-icon" alt="Vàng"/>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Middle Action Bar: Đổi nhân vật khác - Crest - Truyền công lực -->
            <div class="hero-detail-action-bar">
                <button class="hero-detail-btn-action btn-swap" onclick="closeDiscipleDetailModal(); openFormationOverviewModal();" title="Đổi nhân vật khác">
                    <img src="/assets/ui/hero_info_authentic/btn_swap_hero.png" alt="Đổi nhân vật khác"/>
                </button>
                <div class="hero-detail-center-crest">
                    <img src="/assets/ui/hero_info_authentic/center_crest.png" alt="Crest"/>
                </div>
                <button class="hero-detail-btn-action btn-transfer" onclick="closeDiscipleDetailModal(); openBoiDuongModal();" title="Truyền công lực">
                    <img src="/assets/ui/hero_info_authentic/btn_transfer.png" alt="Truyền công lực"/>
                </button>
            </div>

            <!-- Bottom Section: Duyên Phận (Bonds) -->
            <div class="hero-detail-bottom-section">
                <div class="hero-detail-duyenphan-title">Duyên phận :</div>
                <div class="hero-detail-duyenphan-list" id="hero-detail-duyenphan-list">
                    <!-- Dynamic bonds rendered from JS -->
                </div>
            </div>
        </div>
    </div>
'''

with open(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\index.html", "r", encoding="utf-8") as f:
    html = f.read()

# Replace disciple-detail-modal
pattern_start = '<div id="disciple-detail-modal" class="modal-overlay">'
pattern_end = '<!-- ================= MODAL LONG CHÂU ================= -->'

s_idx = html.find(pattern_start)
e_idx = html.find(pattern_end)

if s_idx != -1 and e_idx != -1:
    new_html = html[:s_idx] + new_modal_html + "\n    " + html[e_idx:]
    
    # Also add onclick to dt-scroll-canvas and dt-hero-figure-wrap if not already present
    new_html = new_html.replace(
        '<div class="dt-scroll-canvas" id="dt-scroll-canvas">',
        '<div class="dt-scroll-canvas" id="dt-scroll-canvas" onclick="openDiscipleDetailModal()" style="cursor: pointer;" title="Ấn để xem chi tiết nhân vật">'
    )
    new_html = new_html.replace(
        '<div class="dt-hero-figure-wrap">',
        '<div class="dt-hero-figure-wrap" onclick="openDiscipleDetailModal()" style="cursor: pointer;" title="Ấn để xem chi tiết nhân vật">'
    )

    with open(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\index.html", "w", encoding="utf-8") as f:
        f.write(new_html)
    print("Updated public/index.html successfully!")
else:
    print("Could not find patterns in public/index.html")
