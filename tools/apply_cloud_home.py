import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('public/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

home_start_marker = '<div id="tab-home" class="tab-view home-perfect-view">'
formation_marker = '<div id="tab-formation" class="tab-view"'

pos1 = html.find(home_start_marker)
pos2 = html.find(formation_marker)

if pos1 == -1 or pos2 == -1:
    print('Error: markers not found!', pos1, pos2)
    sys.exit(1)

new_tab_home = '''<div id="tab-home" class="tab-view home-perfect-view">
                    <!-- 1. Interactive Formation Cloud Carousel (Swipe Left/Right for 8 Disciples) -->
                    <div class="home-cloud-stage-wrapper">
                        <div class="home-cloud-stage-scroll" id="home-cloud-disciples"></div>
                    </div>

                    <!-- 2. Authentic Carved Lower Board (6 Buttons + 6 Activities + 6 Utilities) -->
                    <div class="home-lower-stage">
                        <img src="/assets/ui/home_authentic/home_lower_board.png" class="home-lower-bg" alt="Đại Minh Chủ">

                        <!-- 6 Carved Wooden Buttons Hotspots -->
                        <div class="perf-hotspot" style="left: 4.3%; top: 1%; width: 25.5%; height: 16%;" onclick="openDiscipleDetailModal()" title="Đệ tử"></div>
                        <div class="perf-hotspot" style="left: 36.1%; top: 1%; width: 25.5%; height: 16%;" onclick="openTinhLuyenModal()" title="Trang bị"></div>
                        <div class="perf-hotspot" style="left: 66.8%; top: 1%; width: 25.5%; height: 16%;" onclick="openThanTienTyTyModal()" title="Võ công"></div>

                        <div class="perf-hotspot" style="left: 4.3%; top: 20%; width: 25.5%; height: 16%;" onclick="openKinhMachModal()" title="Kinh Mạch"></div>
                        <div class="perf-hotspot" style="left: 36.1%; top: 20%; width: 25.5%; height: 16%;" onclick="openChanKhiModal()" title="Chân khí"></div>
                        <div class="perf-hotspot" style="left: 66.8%; top: 20%; width: 25.5%; height: 16%;" onclick="openTayDuyenModal()" title="Khẩu quyết"></div>

                        <!-- 6 Big Activity Icons Hotspots -->
                        <div class="perf-hotspot" style="left: 5.2%; top: 38.6%; width: 25.2%; height: 20%;" onclick="openLongChauModal()" title="Long Châu"></div>
                        <div class="perf-hotspot" style="left: 34.7%; top: 38.6%; width: 25.2%; height: 20%;" onclick="openLienServerModal()" title="Liên Server"></div>
                        <div class="perf-hotspot" style="left: 63.4%; top: 38.6%; width: 31.3%; height: 20%;" onclick="switchTab('luankiem')" title="Luận kiếm Liên Cụm"></div>

                        <div class="perf-hotspot" style="left: 3.5%; top: 62.4%; width: 28.6%; height: 17%;" onclick="openAmKhiModal()" title="Ám khí"></div>
                        <div class="perf-hotspot" style="left: 42.5%; top: 65.3%; width: 11.3%; height: 12%;" onclick="openGiftcodeModal()" title="Fanpage"></div>
                        <div class="perf-hotspot" style="left: 64.2%; top: 62.4%; width: 30.4%; height: 17%;" onclick="openLienMinhModal()" title="Liên minh"></div>

                        <!-- 6 Utility Square Buttons Hotspots -->
                        <div class="perf-hotspot" style="left: 4.9%; top: 84.2%; width: 13.9%; height: 13.5%;" onclick="switchTab('items')" title="Tay nải"></div>
                        <div class="perf-hotspot" style="left: 20.5%; top: 84.2%; width: 13.9%; height: 13.5%;" onclick="openTopServerModal()" title="Võ lâm phổ"></div>
                        <div class="perf-hotspot" style="left: 36.1%; top: 84.2%; width: 13.9%; height: 13.5%;" onclick="openMailModal()" title="Truyền thư"></div>
                        <div class="perf-hotspot" style="left: 51.7%; top: 84.2%; width: 13.9%; height: 13.5%;" onclick="openAnOanModal()" title="Ân oán"></div>
                        <div class="perf-hotspot" style="left: 67.4%; top: 84.2%; width: 13.9%; height: 13.5%;" onclick="openChatModal()" title="Trò chuyện"></div>
                        <div class="perf-hotspot" style="left: 83.0%; top: 84.2%; width: 13.9%; height: 13.5%;" onclick="openSettingsModal()" title="Cài đặt"></div>
                    </div>
                </div>

                '''

updated_html = html[:pos1] + new_tab_home + html[pos2:]

with open('public/index.html', 'w', encoding='utf-8') as f:
    f.write(updated_html)

print('Updated public/index.html with interactive cloud stage!')
