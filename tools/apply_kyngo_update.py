import sys, os
sys.stdout.reconfigure(encoding='utf-8')
os.chdir(r'C:\Users\trananh.dung\Downloads\DaiMinhChu_Server')

with open('public/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace version v=22 -> v=23
content = content.replace('style.css?v=22', 'style.css?v=23')
content = content.replace('game.js?v=22', 'game.js?v=23')

# Replace tab-recruit section
start_marker = '<!-- Tab 5: 100% Authentic Kỳ Ngộ & Thể Lực (Ăn Gà) Matching Original Game Screenshot media_1793066635941_fb2af011.jpg -->'
end_marker = '<!-- Tab 6: Chợ / Thương Thành (Chợ) -->'

if start_marker in content and end_marker in content:
    idx1 = content.find(start_marker)
    idx2 = content.find(end_marker)
    
    new_tab = '''<!-- Tab 5: 100% Authentic Kỳ Ngộ, Thể Lực (Ăn Gà) & Thưởng Tiêu (Tích Lũy Tiêu) Matching Original Game Screenshots media_1793066635941_fb2af011.jpg & media_1793066770174_4d94b8e6.jpg -->
                <div id="tab-recruit" class="tab-view kyngo-authentic-view" style="display: none;">
                    <!-- Top Sub-feature Icons Track (Horizontal Scroll across all 10 features) -->
                    <div class="kyngo-top-icons-row">
                        <button class="kyngo-icon-btn active" id="btn-kyngo-theluc" onclick="switchKyngoSubTab('theluc')" title="Thể Lực - Ăn Gà Giờ Vàng">
                            <img src="/assets/ui/kyngo_authentic/icon_theluc.png" class="kyngo-feature-icon" alt="Thể Lực"/>
                        </button>
                        <button class="kyngo-icon-btn" id="btn-kyngo-bequan" onclick="switchKyngoSubTab('bequan')" title="Bế Quan Tu Luyện">
                            <img src="/assets/ui/kyngo_authentic/icon_bequan.png" class="kyngo-feature-icon" alt="Bế Quan"/>
                        </button>
                        <button class="kyngo-icon-btn" id="btn-kyngo-thambai" onclick="switchKyngoSubTab('thambai')" title="Tham Bái Thần Tiên Tỷ Tỷ">
                            <img src="/assets/ui/kyngo_authentic/icon_thambai.png" class="kyngo-feature-icon" alt="Tham Bái"/>
                        </button>
                        <button class="kyngo-icon-btn" id="btn-kyngo-tieubao" onclick="switchKyngoSubTab('tieubao')" title="Vi Tiểu Bảo">
                            <img src="/assets/ui/kyngo_authentic/icon_tieubao.png" class="kyngo-feature-icon" alt="Tiểu Bảo"/>
                        </button>
                        <button class="kyngo-icon-btn" id="btn-kyngo-thuongnhan" onclick="switchKyngoSubTab('thuongnhan')" title="Thương Nhân Thần Bí">
                            <img src="/assets/ui/kyngo_authentic/icon_thuongnhan.png" class="kyngo-feature-icon" alt="Thương"/>
                        </button>
                        <button class="kyngo-icon-btn" id="btn-kyngo-baucua" onclick="switchKyngoSubTab('baucua')" title="Bầu Cua Tôm Cá">
                            <img src="/assets/ui/kyngo_authentic/icon_baucua.png" class="kyngo-feature-icon" alt="Bầu Cua"/>
                        </button>
                        <button class="kyngo-icon-btn" id="btn-kyngo-thuongdai" onclick="switchKyngoSubTab('thuongdai')" title="Thượng Đài Luận Võ">
                            <img src="/assets/ui/kyngo_authentic/icon_thuongdai.png" class="kyngo-feature-icon" alt="Thượng Đài"/>
                        </button>
                        <button class="kyngo-icon-btn" id="btn-kyngo-thuychien" onclick="switchKyngoSubTab('thuychien')" title="Thủy Chiến">
                            <img src="/assets/ui/kyngo_authentic/icon_thuychien.png" class="kyngo-feature-icon" alt="Thủy Chiến"/>
                        </button>
                        <button class="kyngo-icon-btn" id="btn-kyngo-lanhhai" onclick="switchKyngoSubTab('lanhhai')" title="Lãnh Hải Tranh Bá">
                            <img src="/assets/ui/kyngo_authentic/icon_lanhhai.png" class="kyngo-feature-icon" alt="Lãnh Hải"/>
                        </button>
                        <button class="kyngo-icon-btn" id="btn-kyngo-thuongtieu" onclick="switchKyngoSubTab('thuongtieu')" title="Thưởng Tiêu - Tích Lũy Tiêu">
                            <img src="/assets/ui/kyngo_authentic/icon_thuongtieu.png" class="kyngo-feature-icon" alt="Thưởng Tiêu"/>
                        </button>
                    </div>

                    <!-- Main Scenic Stage 1: Thể Lực (Ăn Gà Giờ Vàng) -->
                    <div id="kyngo-view-theluc" class="kyngo-stage-scene">
                        <img src="/assets/ui/kyngo_authentic/scene_an_ga_full.png" class="kyngo-scene-bg" alt="Ăn Gà Giờ Vàng"/>
                        
                        <!-- Interactive Roast Chicken Hotspot on the Stone Table -->
                        <div class="kyngo-roast-chicken-hotspot" onclick="doEatChicken()" title="Chạm để Ăn Gà hồi Thể Lực!">
                            <div class="kyngo-chicken-pulse"></div>
                            <img src="/assets/images/VP_GaQuay_to.png" class="kyngo-chicken-plate-img" alt="Gà Quay"/>
                            <span class="kyngo-tap-eat-hint">🍗 Chạm Ăn Gà</span>
                        </div>
                    </div>

                    <!-- Main Scenic Stage 2: Thưởng Tiêu (Tích Lũy Tiêu) Authentic GUI -->
                    <div id="kyngo-view-thuongtieu" class="kyngo-stage-scene" style="display: none;">
                        <img src="/assets/ui/kyngo_authentic/scene_tichluytieu_clean.png" class="kyngo-scene-bg" alt="Tích Lũy Tiêu"/>
                        
                        <!-- Live Countdown Timer Banner -->
                        <div class="tlt-timer-banner">
                            <span class="tlt-timer-text">Đóng sau: <span id="tlt-countdown-days">71</span> ngày <span id="tlt-countdown-hms">01 giờ 15 phút 47 giây</span></span>
                        </div>

                        <!-- Milestone 1 Hotspots (5000 KNB) -->
                        <div class="tlt-milestone-slots tlt-slots-tier1">
                            <div class="tlt-slot" onclick="showRewardDetail('Truyền Công Đan x10', 'Dùng để truyền thụ võ công và chuyển giao điểm kinh nghiệm giữa các đệ tử.')" title="Truyền Công Đan x10"></div>
                            <div class="tlt-slot" onclick="showRewardDetail('Gà Quay x50', 'Gà quay nướng thơm lừng, ăn vào hồi phục 50 Thể Lực dồi dào.')" title="Gà Quay x50"></div>
                            <div class="tlt-slot" onclick="showRewardDetail('Long Châu x50.000', 'Bảo vật linh châu ngưng tụ linh khí, dùng tăng cấp tuyệt kỹ võ công.')" title="Long Châu x50.000"></div>
                            <div class="tlt-slot" onclick="showRewardDetail('Bách Niên Sâm x1000', 'Nhân sâm trăm năm quý hiếm, dùng bồi dưỡng tiềm năng đệ tử.')" title="Bách Niên Sâm x1000"></div>
                            <div class="tlt-slot" onclick="showRewardDetail('Bát Quái Kính x2', 'Pháp bảo đạo gia gia tăng uy lực trận pháp xuất trận.')" title="Bát Quái Kính x2"></div>
                        </div>

                        <!-- Milestone 2 Hotspots (10000 KNB) -->
                        <div class="tlt-milestone-slots tlt-slots-tier2">
                            <div class="tlt-slot" onclick="showRewardDetail('Long Châu x80.000', 'Bảo vật linh châu ngưng tụ linh khí, dùng tăng cấp tuyệt kỹ võ công.')" title="Long Châu x80.000"></div>
                            <div class="tlt-slot" onclick="showRewardDetail('Bảo Rương Vàng x1', 'Rương báu hoàng kim thượng phẩm chứa thần binh và trang bị Giáp/Ất.')" title="Bảo Rương Vàng x1"></div>
                            <div class="tlt-slot" onclick="showRewardDetail('Mảnh Bí Kíp x10', 'Thu thập đủ số lượng để ghép thành bí tịch võ công tuyệt thế.')" title="Mảnh Bí Kíp x10"></div>
                            <div class="tlt-slot" onclick="showRewardDetail('Mảnh Thần Binh x1', 'Mảnh tàn binh cổ dùng tôi luyện và rèn đúc thần binh võ lâm.')" title="Mảnh Thần Binh x1"></div>
                            <div class="tlt-slot" onclick="showRewardDetail('Bảo Bối Đoàn Dự x150', 'Đan dược trân quý nâng cao căn cơ võ học và bồi dưỡng đệ tử.')" title="Bảo Bối Đoàn Dự x150"></div>
                        </div>

                        <!-- Dynamic Spent KNB Counter -->
                        <div class="tlt-spent-counter">
                            <span class="tlt-spent-label">Đã tiêu:</span>
                            <img src="/assets/ui/kyngo_authentic/icon_knb_gold.png" class="tlt-knb-icon" alt="KNB"/>
                            <span id="tlt-spent-amount" class="tlt-spent-val">2</span>
                        </div>
                    </div>
                </div>

                '''
    content = content[:idx1] + new_tab + content[idx2:]
    with open('public/index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print('Updated public/index.html successfully!')
else:
    print('Markers not found!')
