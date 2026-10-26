import sys
sys.stdout.reconfigure(encoding='utf-8')

# Read index.html
with open(r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. New Authentic Header Bar
old_header_target = '''<!-- Authentic Top Header Bar -->
            <div class="game-header-authentic">
                <div class="header-left-group">
                    <span id="header-player-name" class="player-wuxia-name">Chưởng Môn</span>
                    <span id="header-level" style="font-size: 11px; color: #ffd700; font-weight: bold; background: rgba(0,0,0,0.5); padding: 1px 6px; border-radius: 4px; border: 1px solid #b45309;">Lv.1</span>
                    <span id="header-vip-badge" class="vip-gold-badge">VIP 1</span>
                    <div style="display: flex; flex-direction: column; width: 60px; margin-left: 2px;">
                        <div style="background: #292524; height: 4px; border-radius: 2px; overflow: hidden; border: 1px solid #78350f;">
                            <div id="header-exp-fill" style="background: #22c55e; height: 100%; width: 0%;"></div>
                        </div>
                        <span id="header-exp-text" style="font-size: 8px; color: #a8a29e; line-height: 8px; margin-top: 1px;">0/100</span>
                    </div>
                </div>

                <div class="header-right-group">
                    <div class="curr-badge" title="Vàng (KNB)">
                        <img src="/assets/res/ico_coin.png" alt="Vàng">
                        <span id="header-knb">3</span>
                    </div>
                    <div class="curr-badge" title="Bạc">
                        <img src="/assets/ui/icon_bac.png" alt="Bạc">
                        <span id="header-bac">4786534</span>
                    </div>
                    <div class="stamina-mini" title="Thể Lực">
                        <span>🍗</span>
                        <span id="header-stamina">30/30</span>
                    </div>
                    <button class="btn-hdr-settings" onclick="openSettingsModal()" title="Cài Đặt & Quản Trị">⚙️</button>
                </div>
            </div>'''

new_header_bar = '''<!-- 100% Authentic Top Header Bar (Matching Image 1 & 2) -->
            <div class="header-profile-authentic">
                <!-- Left: Level Wheel Badge + Name + Curved EXP Bar -->
                <div class="header-left-col">
                    <div class="level-wheel-box">
                        <span id="header-level" class="level-wheel-text">133</span>
                    </div>
                    <div class="header-name-exp-box">
                        <span id="header-player-name" class="header-player-wuxia-name">Chưởng Môn</span>
                        <div class="header-exp-curved-bar">
                            <div id="header-exp-fill" class="header-exp-fill-curved" style="width: 45%;"></div>
                            <span id="header-exp-text" class="header-exp-num-text">299766/636469</span>
                        </div>
                    </div>
                </div>

                <!-- Right: Row 1 (VIP, Gold, Stamina) | Row 2 (Silver, Qi, Settings) -->
                <div class="header-right-col">
                    <div class="header-stat-row">
                        <span id="header-vip-badge" class="vip-gold-badge" style="font-size: 11px; padding: 1px 6px;">VIP 3</span>
                        <div class="header-stat-cell" title="Nguyên Bảo (KNB)">
                            <img src="/assets/res/ico_coin.png" style="width: 14px; height: 14px;" alt="Vàng">
                            <span id="header-knb" style="color: #fde047;">760,121</span>
                        </div>
                        <div class="header-stat-cell" title="Thể Lực">
                            <span style="font-size: 13px;">🥋</span>
                            <span id="header-stamina" style="color: #fca5a5;">29049/30</span>
                        </div>
                    </div>

                    <div class="header-stat-row">
                        <div class="header-stat-cell" title="Ngân Lượng (Bạc)">
                            <img src="/assets/ui/icon_bac.png" style="width: 15px; height: 12px;" alt="Bạc">
                            <span id="header-bac" style="color: #e2e8f0; font-size: 10px;">790,495,280</span>
                        </div>
                        <div class="header-stat-cell" title="Khí Lực">
                            <span style="font-size: 13px;">🧘</span>
                            <span id="header-qi" style="color: #67e8f9;">114/12</span>
                        </div>
                        <button class="btn-hdr-settings" onclick="openSettingsModal()" title="Cài Đặt & Quản Trị GM">⚙️</button>
                    </div>
                </div>
            </div>'''

# Normalize line breaks and replace header
html_norm = html.replace('\r\n', '\n')
old_header_norm = old_header_target.replace('\r\n', '\n')
new_header_norm = new_header_bar.replace('\r\n', '\n')

if old_header_norm in html_norm:
    html_norm = html_norm.replace(old_header_norm, new_header_norm)
    print("1. Replaced header with 100% authentic header layout successfully!")
else:
    print("Could not find exact old_header_target!")

# 2. Replace #tab-home with the authentic Home Screen layout
pos_home_start = html_norm.find('<div id="tab-home"')
pos_home_end = html_norm.find('<div id="tab-formation"')

old_tab_home = html_norm[pos_home_start:pos_home_end]

new_tab_home = '''<div id="tab-home" class="tab-view home-authentic-container">
                    <!-- 1. Disciple Cloud Stage with disciples in formation (Image 1 & 2) -->
                    <div class="home-cloud-stage">
                        <div id="home-cloud-disciples" class="home-cloud-disciples-row">
                            <div class="home-cloud-disciple-item" onclick="openDiscipleDetailModal('NV_DuongQua')" title="Dương Quá">
                                <img src="/assets/images/NV_DuongQua_ava_to.png" alt="Dương Quá">
                            </div>
                            <div class="home-cloud-disciple-item" onclick="openDiscipleDetailModal('NV_HoaVoKhuyet')" title="Hoa Vô Khuyết">
                                <img src="/assets/images/NV_HoaVoKhuyet_ava_to.png" alt="Hoa Vô Khuyết">
                            </div>
                            <div class="home-cloud-disciple-item" onclick="openDiscipleDetailModal('NV_TruongTamPhong')" title="Trương Tam Phong" style="transform: scale(1.08) translateY(-4px); z-index: 5;">
                                <img src="/assets/images/NV_TruongTamPhong_ava_to.png" alt="Trương Tam Phong">
                            </div>
                            <div class="home-cloud-disciple-item" onclick="openDiscipleDetailModal('NV_QuachTinh')" title="Quách Tĩnh">
                                <img src="/assets/images/NV_QuachTinh_ava_to.png" alt="Quách Tĩnh">
                            </div>
                            <div class="home-cloud-disciple-item" onclick="openDiscipleDetailModal('NV_DongPhuongBatBai')" title="Đông Phương Bất Bại">
                                <img src="/assets/images/NV_DongPhuongBatBai_ava_to.png" alt="Đông Phương Bất Bại">
                            </div>
                        </div>
                    </div>

                    <!-- 2. Six Carved Wooden Buttons (2x3) (Image 1 & 2) -->
                    <div class="home-core-features-grid">
                        <button class="home-wood-btn" onclick="openDiscipleDetailModal()" title="Đệ tử">
                            <img src="/assets/ui/home_authentic/btn_detu.png" alt="Đệ tử">
                        </button>
                        <button class="home-wood-btn" onclick="openTinhLuyenModal()" title="Trang bị">
                            <img src="/assets/ui/home_authentic/btn_trangbi.png" alt="Trang bị">
                        </button>
                        <button class="home-wood-btn" onclick="openThanTienTyTyModal()" title="Võ công">
                            <img src="/assets/ui/home_authentic/btn_vocong.png" alt="Võ công">
                        </button>
                        <button class="home-wood-btn" onclick="openKinhMachModal()" title="Kinh Mạch">
                            <img src="/assets/ui/home_authentic/btn_kinhmach.png" alt="Kinh Mạch">
                        </button>
                        <button class="home-wood-btn" onclick="openChanKhiModal()" title="Chân khí">
                            <img src="/assets/ui/home_authentic/btn_chankhi.png" alt="Chân khí">
                        </button>
                        <button class="home-wood-btn" onclick="openTayDuyenModal()" title="Khẩu quyết">
                            <img src="/assets/ui/home_authentic/btn_khauquyet.png" alt="Khẩu quyết">
                        </button>
                    </div>

                    <!-- 3. Six Activity Big Icons (2x3) (Image 1 & 2) -->
                    <div class="home-activities-grid">
                        <button class="home-activity-btn" onclick="openLongChauModal()" title="Long Châu">
                            <img src="/assets/ui/home_authentic/icon_longchau.png" alt="Long Châu">
                        </button>
                        <button class="home-activity-btn" onclick="openLienServerModal()" title="Liên Server">
                            <img src="/assets/ui/home_authentic/icon_lienserver.png" alt="Liên Server">
                        </button>
                        <button class="home-activity-btn" onclick="switchTab('luankiem')" title="Luận kiếm Liên Cụm">
                            <img src="/assets/ui/home_authentic/icon_luankiemliencum.png" alt="Luận kiếm Liên Cụm">
                        </button>
                        <button class="home-activity-btn" onclick="openAmKhiModal()" title="Ám khí">
                            <img src="/assets/ui/home_authentic/icon_amkhi.png" alt="Ám khí">
                        </button>
                        <button class="home-activity-btn" onclick="openGiftcodeModal()" title="Fanpage">
                            <img src="/assets/ui/home_authentic/icon_fanpage.png" alt="Fanpage">
                        </button>
                        <button class="home-activity-btn" onclick="openLienMinhModal()" title="Liên minh">
                            <img src="/assets/ui/home_authentic/icon_lienminh.png" alt="Liên minh">
                        </button>
                    </div>

                    <!-- 4. Six Utility Square Buttons (1x6) (Image 1 & 2) -->
                    <div class="home-utilities-bar">
                        <button class="home-util-btn" onclick="switchTab('items')" title="Tay nải">
                            <img src="/assets/ui/home_authentic/btn_taynai.png" alt="Tay nải">
                        </button>
                        <button class="home-util-btn" onclick="openTopServerModal()" title="Võ lâm phổ">
                            <img src="/assets/ui/home_authentic/btn_volampho.png" alt="Võ lâm phổ">
                        </button>
                        <button class="home-util-btn" onclick="openMailModal()" title="Truyền thư">
                            <img src="/assets/ui/home_authentic/btn_truyenthu.png" alt="Truyền thư">
                        </button>
                        <button class="home-util-btn" onclick="openAnOanModal()" title="Ân oán">
                            <img src="/assets/ui/home_authentic/btn_an_oan.png" alt="Ân oán">
                        </button>
                        <button class="home-util-btn" onclick="openChatModal()" title="Trò chuyện">
                            <img src="/assets/ui/home_authentic/btn_trochuyen.png" alt="Trò chuyện">
                        </button>
                        <button class="home-util-btn" onclick="openSettingsModal()" title="Cài đặt">
                            <img src="/assets/ui/home_authentic/btn_caidat.png" alt="Cài đặt">
                        </button>
                    </div>
                </div>

                '''

html_norm = html_norm[:pos_home_start] + new_tab_home + html_norm[pos_home_end:]
print("2. Injected authentic home screen HTML into #tab-home successfully!")

# 3. Update Bottom Navigation Bar with authentic cropped tab icons
pos_nav_start = html_norm.find('<div class="bottom-bar-authentic">')
pos_nav_end = html_norm.find('</div>', pos_nav_start) + 6

new_bottom_nav = '''<div class="bottom-nav-bar-authentic">
                <button class="bottom-tab-auth-btn active" data-tab="home" onclick="switchTab('home')" title="Trang Chủ">
                    <img src="/assets/ui/home_authentic/tab_trangchu.png" alt="Tr.chủ">
                </button>
                <button class="bottom-tab-auth-btn" data-tab="formation" onclick="switchTab('formation')" title="Dàn Trận">
                    <img src="/assets/ui/home_authentic/tab_dantran.png" alt="D.trận">
                </button>
                <button class="bottom-tab-auth-btn" data-tab="giangho" onclick="switchTab('giangho')" title="Giang Hồ">
                    <img src="/assets/ui/home_authentic/tab_giangho.png" alt="Gi.hồ">
                </button>
                <button class="bottom-tab-auth-btn" data-tab="luyencong" onclick="switchTab('luyencong')" title="Luyện Công">
                    <img src="/assets/ui/home_authentic/tab_luyencong.png" alt="L.công">
                </button>
                <button class="bottom-tab-auth-btn" data-tab="recruit" onclick="switchTab('recruit')" title="Kỳ Ngộ">
                    <img src="/assets/ui/home_authentic/tab_kyngo.png" alt="Kỳ ngộ">
                </button>
                <button class="bottom-tab-auth-btn" data-tab="market" onclick="switchTab('market')" title="Chợ">
                    <img src="/assets/ui/home_authentic/tab_cho.png" alt="Chợ">
                </button>
                <button class="bottom-tab-auth-btn" data-tab="luankiem" onclick="switchTab('luankiem')" title="Luận Kiếm">
                    <img src="/assets/ui/home_authentic/tab_luankiem_full.png" alt="L.kiếm">
                </button>
                <button class="bottom-tab-auth-btn" data-tab="lienminh" onclick="openLienMinhModal()" title="Liên Minh">
                    <img src="/assets/ui/home_authentic/tab_lienminh_full.png" alt="L.Minh">
                </button>
            </div>'''

html_norm = html_norm[:pos_nav_start] + new_bottom_nav + html_norm[pos_nav_end:]
print("3. Replaced bottom navigation bar with authentic 8-tab rail successfully!")

# Write back
with open(r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/index.html', 'w', encoding='utf-8') as f:
    f.write(html_norm)
print("Updated index.html successfully!")
