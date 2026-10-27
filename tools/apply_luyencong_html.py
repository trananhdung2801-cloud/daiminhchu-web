import sys, os
sys.stdout.reconfigure(encoding='utf-8')
os.chdir(r'C:\Users\trananh.dung\Downloads\DaiMinhChu_Server')

with open('public/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Bump cache-busting version v=25 -> v=26
content = content.replace('style.css?v=25', 'style.css?v=26')
content = content.replace('game.js?v=25', 'game.js?v=26')

start_marker = '<!-- Tab 4: Luyện Công (Truyền công, Tinh luyện) -->'
end_marker = '<!-- Tab 5: 100% Authentic Kỳ Ngộ'

if start_marker in content and end_marker in content:
    idx1 = content.find(start_marker)
    idx2 = content.find(end_marker)

    new_tab = '''<!-- Tab 4: 100% Authentic Luyện Công & Luyện Điêu GUI Matching Original Game Screenshot media_1793068206949_7469be7e.jpg -->
                <div id="tab-luyencong" class="tab-view luyencong-authentic-view" style="display: none;">
                    <!-- Top Notice / Ticker Bar -->
                    <div class="lc-ticker-bar">
                        <span class="lc-ticker-text">'Qui Ẩn Giang Hồ' sau khi tĩnh tâm trong sáng, đã luyện điêu vượt mốc 1234 điểm, vinh danh Đệ Nhất Thần Điêu Võ Lâm!</span>
                    </div>

                    <!-- Top Sub-feature Icons Track -->
                    <div class="lc-top-icons-row">
                        <button class="lc-icon-btn active" id="btn-lc-luyendieu" onclick="switchLuyencongSubTab('luyendieu')" title="Luyện Điêu - Thần Điêu Hành Hiệp">
                            <img src="/assets/ui/luyencong_authentic/icon_luyendieu.png" class="lc-feature-icon" alt="Luyện Điêu"/>
                        </button>
                        <button class="lc-icon-btn" id="btn-lc-ngunhac" onclick="switchLuyencongSubTab('ngunhac')" title="Ngũ Nhạc Kiếm Phái">
                            <img src="/assets/ui/luyencong_authentic/icon_ngunhac.png" class="lc-feature-icon" alt="Ngũ Nhạc"/>
                        </button>
                        <button class="lc-icon-btn" id="btn-lc-vantieu" onclick="switchLuyencongSubTab('vantieu')" title="Vận Tiêu Võ Lâm">
                            <img src="/assets/ui/luyencong_authentic/icon_vantieu.png" class="lc-feature-icon" alt="Vận Tiêu"/>
                        </button>
                        <button class="lc-icon-btn" id="btn-lc-tucung" onclick="switchLuyencongSubTab('tucung')" title="Tử Cung - Hắc Mộc Nhai">
                            <img src="/assets/ui/luyencong_authentic/icon_tu_cung.png" class="lc-feature-icon" alt="Tử Cung"/>
                        </button>
                        <button class="lc-icon-btn" id="btn-lc-tongkim" onclick="switchLuyencongSubTab('tongkim')" title="Tống Kim Chiến Trường">
                            <img src="/assets/ui/luyencong_authentic/icon_tongkim.png" class="lc-feature-icon" alt="Tống Kim"/>
                        </button>
                        <button class="lc-icon-btn" id="btn-lc-boiduong" onclick="openBoiDuongModal()" title="Bồi Dưỡng Đệ Tử">
                            <img src="/assets/ui/boiduong_authentic/tab_title_boiduong.png" class="lc-feature-icon" style="object-fit: cover; border-radius: 8px;" alt="Bồi Dưỡng"/>
                        </button>
                    </div>

                    <!-- Main Scenic Stage: Luyện Điêu Authentic GUI -->
                    <div id="luyencong-view-luyendieu" class="kyngo-stage-scene">
                        <img src="/assets/ui/luyencong_authentic/scene_luyendieu_clean.png" class="ld-scene-bg" alt="Luyện Điêu"/>

                        <!-- Animated Baby Eagle Character -->
                        <div id="ld-bird-box" class="ld-bird-character">
                            <img src="/assets/ui/luyencong_authentic/bird_ld.png" class="ld-bird-img" alt="Thần Điêu"/>
                        </div>

                        <!-- Action Buttons: Bắt đầu & Top -->
                        <div id="ld-buttons-row" class="ld-action-buttons-row">
                            <button type="button" class="ld-btn-img-wrapper" onclick="startLuyenDieuMiniGame()" title="Bắt đầu luyện điêu">
                                <img src="/assets/ui/luyencong_authentic/btn_batdau_ld.png" class="ld-action-btn-img" alt="Bắt đầu"/>
                            </button>
                            <button type="button" class="ld-btn-img-wrapper" onclick="openLuyenDieuLeaderboard()" title="Bảng xếp hạng Top">
                                <img src="/assets/ui/luyencong_authentic/btn_top_ld.png" class="ld-action-btn-img" alt="Top"/>
                            </button>
                        </div>

                        <!-- Ground Stats Overlay -->
                        <div class="ld-ground-stats-overlay">
                            <div class="ld-stat-line-1">
                                Chưởng môn hôm nay đã chơi <span id="ld-plays-count">1</span> lượt.
                            </div>
                            <div class="ld-stat-line-2">
                                Điểm cao nhất: <span id="ld-highscore-val" class="ld-score-highlight">1234</span>
                            </div>
                        </div>

                        <!-- Flappy Bird Interactive HTML5 Canvas Game -->
                        <canvas id="ld-flappy-canvas" class="ld-game-canvas"></canvas>
                    </div>

                    <!-- Hidden Disciple List Container for Background Logic -->
                    <div id="luyencong-container" style="display: none;"></div>
                </div>

                '''
    content = content[:idx1] + new_tab + content[idx2:]
    with open('public/index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print('Updated tab-luyencong in index.html successfully!')
else:
    print('Markers not found in index.html!')
