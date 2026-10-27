import sys
sys.stdout.reconfigure(encoding='utf-8')

html_perfect = '''
            <!-- 100% AUTHENTIC PERFECT SEAMLESS HEADER -->
            <div class="header-profile-authentic-perfect">
                <!-- Dynamic text fields positioned over the authentic frame -->
                <span id="header-level" class="hdr-perf-level">50</span>
                <span id="header-player-name" class="hdr-perf-name">MinhChu</span>
                <div class="hdr-perf-exp-wrap">
                    <div id="header-exp-fill" class="hdr-perf-exp-fill"></div>
                    <span id="header-exp-text" class="hdr-perf-exp-text">16844/40120</span>
                </div>
                <span id="header-vip-badge" class="hdr-perf-vip">VIP 5</span>
                <span id="header-knb" class="hdr-perf-knb">760,121</span>
                <span id="header-stamina" class="hdr-perf-stamina">100/30</span>
                <span id="header-bac" class="hdr-perf-bac">790,495,280</span>
                <span id="header-qi" class="hdr-perf-qi">114/12</span>
                <button class="hdr-perf-settings-btn" onclick="openSettingsModal()" title="Cài Đặt & GM"></button>
            </div>
'''

home_stage_perfect = '''
                <!-- Tab 1: 100% Authentic Perfect Seamless Trang Chủ -->
                <div id="tab-home" class="tab-view home-perfect-view">
                    <div class="home-seamless-stage">
                        <img src="/assets/ui/home_authentic/home_main_stage_perfect.png" class="home-seamless-bg" alt="Đại Minh Chủ">

                        <!-- 5 Floating Disciples Hotspots (Cloud Stage) -->
                        <div class="perf-hotspot" style="left: 2%; top: 4%; width: 19%; height: 25%;" onclick="openDiscipleDetailModal('NV_DuongQua')" title="Dương Quá"></div>
                        <div class="perf-hotspot" style="left: 22%; top: 4%; width: 19%; height: 25%;" onclick="openDiscipleDetailModal('NV_HoaVoKhuyet')" title="Hoa Vô Khuyết"></div>
                        <div class="perf-hotspot" style="left: 42%; top: 2%; width: 21%; height: 27%;" onclick="openDiscipleDetailModal('NV_TruongTamPhong')" title="Trương Tam Phong"></div>
                        <div class="perf-hotspot" style="left: 64%; top: 4%; width: 18%; height: 25%;" onclick="openDiscipleDetailModal('NV_QuachTinh')" title="Quách Tĩnh"></div>
                        <div class="perf-hotspot" style="left: 83%; top: 4%; width: 16%; height: 25%;" onclick="openDiscipleDetailModal('NV_DongPhuongBatBai')" title="Đông Phương Bất Bại"></div>

                        <!-- 6 Carved Wooden Buttons Hotspots -->
                        <div class="perf-hotspot" style="left: 4.5%; top: 32%; width: 26%; height: 11%;" onclick="openDiscipleDetailModal()" title="Đệ tử"></div>
                        <div class="perf-hotspot" style="left: 36%; top: 32%; width: 26%; height: 11%;" onclick="openTinhLuyenModal()" title="Trang bị"></div>
                        <div class="perf-hotspot" style="left: 67%; top: 32%; width: 26%; height: 11%;" onclick="openThanTienTyTyModal()" title="Võ công"></div>

                        <div class="perf-hotspot" style="left: 4.5%; top: 45%; width: 26%; height: 11%;" onclick="openKinhMachModal()" title="Kinh Mạch"></div>
                        <div class="perf-hotspot" style="left: 36%; top: 45%; width: 26%; height: 11%;" onclick="openChanKhiModal()" title="Chân khí"></div>
                        <div class="perf-hotspot" style="left: 67%; top: 45%; width: 26%; height: 11%;" onclick="openTayDuyenModal()" title="Khẩu quyết"></div>

                        <!-- 6 Big Activity Icons Hotspots -->
                        <div class="perf-hotspot" style="left: 5%; top: 58%; width: 26%; height: 13.5%;" onclick="openLongChauModal()" title="Long Châu"></div>
                        <div class="perf-hotspot" style="left: 35%; top: 58%; width: 26%; height: 13.5%;" onclick="openLienServerModal()" title="Liên Server"></div>
                        <div class="perf-hotspot" style="left: 65%; top: 58%; width: 30%; height: 13.5%;" onclick="switchTab('luankiem')" title="Luận kiếm Liên Cụm"></div>

                        <div class="perf-hotspot" style="left: 3.5%; top: 74%; width: 29%; height: 12%;" onclick="openAmKhiModal()" title="Ám khí"></div>
                        <div class="perf-hotspot" style="left: 41%; top: 75.5%; width: 14%; height: 9%;" onclick="openGiftcodeModal()" title="Fanpage"></div>
                        <div class="perf-hotspot" style="left: 65%; top: 74%; width: 30%; height: 12%;" onclick="openLienMinhModal()" title="Liên minh"></div>

                        <!-- 6 Utility Square Buttons Hotspots -->
                        <div class="perf-hotspot" style="left: 4.5%; top: 89%; width: 14%; height: 9.5%;" onclick="switchTab('items')" title="Tay nải"></div>
                        <div class="perf-hotspot" style="left: 20%; top: 89%; width: 14%; height: 9.5%;" onclick="openTopServerModal()" title="Võ lâm phổ"></div>
                        <div class="perf-hotspot" style="left: 36%; top: 89%; width: 14%; height: 9.5%;" onclick="openMailModal()" title="Truyền thư"></div>
                        <div class="perf-hotspot" style="left: 51.5%; top: 89%; width: 14%; height: 9.5%;" onclick="openAnOanModal()" title="Ân oán"></div>
                        <div class="perf-hotspot" style="left: 67%; top: 89%; width: 14%; height: 9.5%;" onclick="openChatModal()" title="Trò chuyện"></div>
                        <div class="perf-hotspot" style="left: 82.5%; top: 89%; width: 14%; height: 9.5%;" onclick="openSettingsModal()" title="Cài đặt"></div>
                    </div>
                </div>
'''

bottom_nav_perfect = '''
            <!-- 100% AUTHENTIC PERFECT SEAMLESS BOTTOM NAV -->
            <div class="bottom-nav-authentic-perfect">
                <img src="/assets/ui/home_authentic/bottom_nav_perfect.png" class="bottom-nav-seamless-bg" alt="Điều Hướng">
                <div class="nav-perf-hotspot active" style="left: 0%; width: 12.5%;" onclick="switchTab('home')" title="Tr.chủ"></div>
                <div class="nav-perf-hotspot" style="left: 12.5%; width: 12.5%;" onclick="switchTab('formation')" title="D.trận"></div>
                <div class="nav-perf-hotspot" style="left: 25%; width: 12.5%;" onclick="switchTab('giangho')" title="Gi.hồ"></div>
                <div class="nav-perf-hotspot" style="left: 37.5%; width: 12.5%;" onclick="switchTab('luyencong')" title="L.công"></div>
                <div class="nav-perf-hotspot" style="left: 50%; width: 12.5%;" onclick="switchTab('recruit')" title="Kỳ ngộ"></div>
                <div class="nav-perf-hotspot" style="left: 62.5%; width: 12.5%;" onclick="switchTab('market')" title="Chợ"></div>
                <div class="nav-perf-hotspot" style="left: 75%; width: 12.5%;" onclick="switchTab('luankiem')" title="L.kiếm"></div>
                <div class="nav-perf-hotspot" style="left: 87.5%; width: 12.5%;" onclick="openLienMinhModal()" title="L.Minh"></div>
            </div>
'''

print('Draft prepared successfully!')
