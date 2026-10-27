import sys
sys.stdout.reconfigure(encoding='utf-8')

new_vocong_modal = '''    <!-- ================= 100% AUTHENTIC THÔNG TIN VÕ CÔNG (TAB DÀN TRẬN) ================= -->
    <div id="vocong-detail-modal" class="modal-overlay">
        <div class="vocong-authentic-dialog anim-zoom-enter">
            <!-- Header Title: Thông tin võ công -->
            <div class="vocong-header-bar">
                <span class="vocong-header-title">Thông tin võ công</span>
            </div>

            <!-- Close Button (Red square metal frame with white X) -->
            <button class="vocong-close-btn" onclick="closeVoCongDetailModal()" title="Đóng">
                <img src="/assets/ui/hero_info_authentic/btn_close.png" alt="Đóng"/>
            </button>

            <!-- Main Content: Left Scroll + Right Description & Share -->
            <div class="vocong-main-body">
                <!-- Left: Hanging Scroll (Tranh cuộn võ công) -->
                <div class="vocong-scroll-frame">
                    <div class="vocong-scroll-wrapper">
                        <img src="/assets/ui/vocong_info_authentic/scroll_vocong_clean.png" class="vocong-scroll-bg" alt="Cuộn tranh"/>
                        
                        <!-- Top-Left Vertical Calligraphy Skill Name -->
                        <div id="vocong-vert-name" class="vocong-vert-title">
                            Băng Phách Công
                        </div>

                        <!-- Top-Right Badge (KIM / GIÁP) -->
                        <div id="vocong-badge-wrap" class="vocong-badge-kim">
                            <img id="vocong-badge-img" src="/assets/ui/hero_info_authentic/badge_kim.png" alt="KIM"/>
                        </div>

                        <!-- Center Skill Art Image -->
                        <div class="vocong-art-box">
                            <img id="vocong-art-img" src="/assets/ui/vocong_info_authentic/art_bang_phach_cong.png" alt="Võ công"/>
                        </div>

                        <!-- Black Ink Splash Level Badge -->
                        <div class="vocong-ink-lvl-badge">
                            <img src="/assets/ui/vocong_info_authentic/ink_lvl_badge.png" class="ink-splash-bg" alt="Ink"/>
                            <span id="vocong-lvl-num" class="ink-lvl-text">37</span>
                        </div>

                        <!-- Bottom Stats Row on Scroll -->
                        <div class="vocong-scroll-stats-row">
                            <div class="vc-stat-item">
                                <img src="/assets/ui/hero_info_authentic/icon_stat_palm.png" class="vc-stat-ico" alt="Nội"/>
                                <span id="vocong-stat-noi">392%</span>
                            </div>
                            <div class="vc-stat-item">
                                <img src="/assets/ui/hero_info_authentic/icon_stat_shield.png" class="vc-stat-ico" alt="Thủ"/>
                                <span id="vocong-stat-thu">467%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Column: Description & Share Button -->
                <div class="vocong-right-col">
                    <div class="vocong-desc-box" id="vocong-desc-text">
                        Tâm như băng phách. Chỉ số tăng thủ + 50% và nội + 20% mỗi lần ra chiêu. Khi ra chiêu, có xác suất 33% ra chiêu 1 lần nữa. Sát thương gây ra sau phòng ngự tăng <span class="highlight-stat">20%</span>, và giảm sát thương phải nhận <span class="highlight-stat">10%</span>.
                    </div>

                    <!-- Share Button (f share) -->
                    <button class="vocong-share-btn" onclick="shareVoCongFB()" title="Chia sẻ Facebook">
                        <img src="/assets/ui/vocong_info_authentic/btn_share_fb.png" alt="f share"/>
                    </button>
                </div>
            </div>

            <!-- Bottom Action Buttons: Đổi võ công - Tham ngộ -->
            <div class="vocong-bottom-actions">
                <button class="vocong-btn-action btn-doi" onclick="openDoiVoCongModal()" title="Đổi võ công">
                    <img src="/assets/ui/vocong_info_authentic/btn_doi_vo_cong.png" alt="Đổi võ công"/>
                </button>
                <button class="vocong-btn-action btn-thamngo" onclick="openThamNgoModal()" title="Tham ngộ">
                    <img src="/assets/ui/vocong_info_authentic/btn_tham_ngo.png" alt="Tham ngộ"/>
                </button>
            </div>
        </div>
    </div>
'''

with open(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\index.html", "r", encoding="utf-8") as f:
    html = f.read()

# Insert right after disciple-detail-modal
disciple_modal_end = '<!-- ================= MODAL LONG CHÂU ================= -->'
idx = html.find(disciple_modal_end)

if idx != -1:
    new_html = html[:idx] + new_vocong_modal + "\n    " + html[idx:]
    
    # Also update hero-detail-skill-card onclick to open this modal
    new_html = new_html.replace(
        'id="hero-detail-skill-card" onclick="alert(\'Võ Công Thiên Phú: Điệp Vũ Cửu Thiên (Lv.41)\')"',
        'id="hero-detail-skill-card" onclick="openVoCongDetailModal()"'
    )
    
    # Also update dh-left-slot-0 and dh-left-slot-1 to openVoCongDetailModal
    new_html = new_html.replace(
        'id="dh-left-slot-0" onclick="showItemDetail(\'skill\')"',
        'id="dh-left-slot-0" onclick="openVoCongDetailModal(\'VC_BangPhachCong\')"'
    )
    new_html = new_html.replace(
        'id="dh-left-slot-1" onclick="showItemDetail(\'skill\')"',
        'id="dh-left-slot-1" onclick="openVoCongDetailModal(\'VC_GiangLongThapBatChuong\')"'
    )
    new_html = new_html.replace(
        'id="dh-right-slot-1" onclick="showItemDetail(\'skill\')"',
        'id="dh-right-slot-1" onclick="openVoCongDetailModal(\'VC_BichChamThanhChuong\')"'
    )

    with open(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\index.html", "w", encoding="utf-8") as f:
        f.write(new_html)
    print("Added vocong-detail-modal to public/index.html successfully!")
else:
    print(f"Marker not found: {disciple_modal_end}")
