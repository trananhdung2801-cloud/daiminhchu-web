import sys, os
sys.stdout.reconfigure(encoding='utf-8')
os.chdir(r'C:\Users\trananh.dung\Downloads\DaiMinhChu_Server')

with open('public/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace version v=23 -> v=24
content = content.replace('style.css?v=23', 'style.css?v=24')
content = content.replace('game.js?v=23', 'game.js?v=24')

start_marker = '<!-- ================= AUTHENTIC BỒI DƯỠNG ĐỆ TỬ MODAL (img_35.jpg) ================= -->'
end_marker = '<!-- ================= MODAL 1: HUYẾT CHIẾN HẮC MỘC NHAI (img_21, img_25) ================= -->'

if start_marker in content and end_marker in content:
    idx1 = content.find(start_marker)
    idx2 = content.find(end_marker)

    new_modal = '''<!-- ================= 100% AUTHENTIC BỒI DƯỠNG ĐỆ TỬ GUI (media_1793066806740_cfde29ed.jpg) ================= -->
        <div id="boiduong-modal" class="modal-overlay">
            <div class="boiduong-authentic-screen anim-zoom-enter">
                <!-- Top Landscape Header -->
                <div class="bd-auth-header-strip">
                    <img src="/assets/ui/boiduong_authentic/top_landscape.png" class="bd-auth-top-bg" alt="Landscape"/>
                    <img src="/assets/ui/boiduong_authentic/tab_title_boiduong.png" class="bd-auth-tab-plaque" alt="Bồi dưỡng đệ tử"/>
                </div>

                <div class="bd-auth-content-body">
                    <!-- Instruction Text -->
                    <div class="bd-auth-hint">
                        Mỗi lần sử dụng 10 bồi dưỡng đan, sẽ kích thích được<br/>tiềm lực của đệ tử
                    </div>

                    <!-- Disciple Profile Area -->
                    <div class="bd-auth-hero-row">
                        <!-- Avatar Frame with Purple/Gold Glow -->
                        <div class="bd-auth-avatar-box">
                            <img id="bd-hero-avatar" src="/assets/images/NV_DongPhuongBatBai_ava_to.png" class="bd-auth-avatar-img" alt="Avatar"/>
                        </div>

                        <!-- Info Grid -->
                        <div class="bd-auth-info-grid">
                            <div class="bd-info-line bd-line-1">
                                <span id="bd-hero-name" class="bd-hero-name-text">Đông Phương Bất Bại</span>
                                <div class="bd-stat-item">
                                    <img src="/assets/ui/boiduong_authentic/stat_hp.png" class="bd-stat-badge" alt="HP"/>
                                    <span id="bd-hero-hp" class="bd-stat-val">4370186</span>
                                </div>
                                <div class="bd-stat-item">
                                    <img src="/assets/ui/boiduong_authentic/stat_atk.png" class="bd-stat-badge" alt="ATK"/>
                                    <span id="bd-hero-atk" class="bd-stat-val">19463</span>
                                </div>
                            </div>

                            <div class="bd-info-line bd-line-2">
                                <div class="bd-quality-wrapper">
                                    <span>Phẩm chất :</span>
                                    <img id="bd-badge-tier-img" src="/assets/ui/boiduong_authentic/badge_giap1.png" class="bd-badge-giap-img" alt="Giáp 1"/>
                                    <span id="bd-hero-tier-text" class="bd-tier-fallback" style="display: none;">Giáp 1</span>
                                </div>
                                <div class="bd-stat-item">
                                    <img src="/assets/ui/boiduong_authentic/stat_def.png" class="bd-stat-badge" alt="DEF"/>
                                    <span id="bd-hero-def" class="bd-stat-val">46353</span>
                                </div>
                                <div class="bd-stat-item">
                                    <img src="/assets/ui/boiduong_authentic/stat_int.png" class="bd-stat-badge" alt="INT"/>
                                    <span id="bd-hero-int" class="bd-stat-val">92604</span>
                                </div>
                            </div>

                            <div class="bd-info-line bd-line-3">
                                <span class="bd-level-text">Cấp độ : <b id="bd-hero-lvl">514</b></span>
                            </div>

                            <div class="bd-info-line bd-line-4">
                                <span class="bd-tiemluc-text">Tiềm lực : <b id="bd-hero-tiemluc">-925</b></span>
                                <span class="bd-dan-text">Bồi dưỡng đan : <b id="bd-dan-qty">516921196</b></span>
                            </div>
                        </div>
                    </div>

                    <!-- Filigree Wooden Carved Options Board -->
                    <div class="bd-auth-board-container">
                        <img src="/assets/ui/boiduong_authentic/board_boiduong_clean.png" class="bd-board-bg" alt="Board"/>
                        <div class="bd-board-options-grid">
                            <!-- Option 1: Bồi dưỡng 5 lần -->
                            <div class="bd-board-opt" id="bd-opt-5" onclick="selectBoiDuongOption(5, false)">
                                <img src="/assets/ui/boiduong_authentic/radio_pearl_inactive.png" class="bd-radio-icon" id="bd-radio-5" alt="Radio"/>
                                <span class="bd-opt-label">Bồi dưỡng 5 lần</span>
                            </div>

                            <!-- Option 2: Bồi dưỡng cao cấp 5 lần -->
                            <div class="bd-board-opt" id="bd-opt-5-vip" onclick="selectBoiDuongOption(5, true)">
                                <img src="/assets/ui/boiduong_authentic/radio_pearl_inactive.png" class="bd-radio-icon" id="bd-radio-5-vip" alt="Radio"/>
                                <span class="bd-opt-label">Bồi dưỡng cao cấp 5 lần</span>
                                <img src="/assets/ui/kyngo_authentic/icon_knb_gold.png" class="bd-knb-icon" alt="KNB"/>
                                <span class="bd-knb-num">5</span>
                            </div>

                            <!-- Option 3: Bồi dưỡng 25 lần (SELECTED BY DEFAULT) -->
                            <div class="bd-board-opt selected" id="bd-opt-25" onclick="selectBoiDuongOption(25, false)">
                                <img src="/assets/ui/boiduong_authentic/radio_pearl_active.png" class="bd-radio-icon" id="bd-radio-25" alt="Radio"/>
                                <span class="bd-opt-label">Bồi dưỡng 25 lần</span>
                            </div>

                            <!-- Option 4: Bồi dưỡng cao cấp 25 lần -->
                            <div class="bd-board-opt" id="bd-opt-25-vip" onclick="selectBoiDuongOption(25, true)">
                                <img src="/assets/ui/boiduong_authentic/radio_pearl_inactive.png" class="bd-radio-icon" id="bd-radio-25-vip" alt="Radio"/>
                                <span class="bd-opt-label">Bồi dưỡng cao cấp 25 lần</span>
                                <img src="/assets/ui/kyngo_authentic/icon_knb_gold.png" class="bd-knb-icon" alt="KNB"/>
                                <span class="bd-knb-num">25</span>
                            </div>
                        </div>
                    </div>

                    <!-- Result feedback message -->
                    <div id="bd-result-msg" class="bd-result-msg"></div>

                    <!-- Bottom Action Buttons: Quay lại & Bồi dưỡng -->
                    <div class="bd-auth-actions-row">
                        <button type="button" class="bd-btn-img-wrapper" onclick="closeBoiDuongModal()" title="Quay lại">
                            <img src="/assets/ui/boiduong_authentic/btn_quaylai.png" class="bd-auth-action-btn" alt="Quay lại"/>
                        </button>
                        <button type="button" class="bd-btn-img-wrapper" onclick="executeSelectedBoiDuong()" title="Bồi dưỡng">
                            <img src="/assets/ui/boiduong_authentic/btn_boiduong.png" class="bd-auth-action-btn" alt="Bồi dưỡng"/>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        '''
    content = content[:idx1] + new_modal + content[idx2:]
    with open('public/index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print('Updated boiduong-modal in index.html successfully!')
else:
    print('Markers not found!')
