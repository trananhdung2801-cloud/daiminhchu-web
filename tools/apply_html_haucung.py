import re

with open('public/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

submode_html = '''                    <!-- Top Sub-mode Icons & Plaque (100% Authentic Matching Original Game Screenshot) -->
                    <div class="dt-top-submode-row">
                        <button class="dt-submode-btn active" id="btn-dt-mode-tran1" onclick="switchDantranMode('tran1')" title="Trận 1 - Bát Quái Trận">
                            <img src="/assets/ui/dantran_authentic/icon_tran1.png" alt="Trận 1" class="dt-submode-icon"/>
                        </button>
                        <button class="dt-submode-btn" id="btn-dt-mode-tran2" onclick="switchDantranMode('tran2')" title="Trận 2 - Thất Tinh Trận">
                            <img src="/assets/ui/dantran_authentic/icon_tran2.png" alt="Trận 2" class="dt-submode-icon"/>
                        </button>
                        <button class="dt-submode-btn" id="btn-dt-mode-long" onclick="switchDantranMode('long')" title="Long Trận">
                            <img src="/assets/ui/dantran_authentic/icon_tran3_long.png" alt="Long Trận" class="dt-submode-icon"/>
                        </button>
                        <button class="dt-submode-btn" id="btn-dt-mode-haucung" onclick="switchDantranMode('haucung')" title="Hậu Cung">
                            <img src="/assets/ui/dantran_authentic/icon_haucung.png" alt="Hậu Cung" class="dt-submode-icon"/>
                        </button>
                        <div class="dt-plaque-wrapper" onclick="openFormationOverviewModal()" title="Dàn Trận">
                            <img src="/assets/ui/dantran_authentic/plaque_dantran_vert.png" alt="Dàn Trận" class="dt-plaque-img"/>
                        </div>
                    </div>

                    <!-- View A: Main Formation (Disciple Detail, Equipment & Skills) -->
                    <div id="dt-view-main" class="dt-view-container">'''

haucung_view_html = '''                    </div>

                    <!-- View B: 100% Authentic Hậu Cung Screen (media_1793066451321_a85b6675.jpg) -->
                    <div id="dt-view-haucung" class="dt-haucung-view" style="display: none;">
                        <div class="hc-scroll-wrapper">
                            <!-- Top Roller -->
                            <img src="/assets/ui/dantran_authentic/scroll_top_roller.png" class="hc-scroll-roller" alt="Scroll Top"/>

                            <!-- Chamber Background & 8 Disciples -->
                            <div class="hc-chamber-board">
                                <img src="/assets/ui/dantran_authentic/haucung_chamber_bg.png" class="hc-chamber-bg" alt="Chamber"/>
                                
                                <!-- Left Column 4 Disciples -->
                                <div class="hc-slots-column hc-col-left">
                                    <div class="hc-slot-card" id="hc-slot-0" onclick="handleHauCungSlotClick(0)"></div>
                                    <div class="hc-slot-card" id="hc-slot-1" onclick="handleHauCungSlotClick(1)"></div>
                                    <div class="hc-slot-card" id="hc-slot-2" onclick="handleHauCungSlotClick(2)"></div>
                                    <div class="hc-slot-card" id="hc-slot-3" onclick="handleHauCungSlotClick(3)"></div>
                                </div>

                                <!-- Right Column 4 Disciples -->
                                <div class="hc-slots-column hc-col-right">
                                    <div class="hc-slot-card" id="hc-slot-4" onclick="handleHauCungSlotClick(4)"></div>
                                    <div class="hc-slot-card" id="hc-slot-5" onclick="handleHauCungSlotClick(5)"></div>
                                    <div class="hc-slot-card" id="hc-slot-6" onclick="handleHauCungSlotClick(6)"></div>
                                    <div class="hc-slot-card" id="hc-slot-7" onclick="handleHauCungSlotClick(7)"></div>
                                </div>
                            </div>

                            <!-- Bottom Banner with Wuxia Text -->
                            <div class="hc-bottom-banner-wrap">
                                <img src="/assets/ui/dantran_authentic/haucung_bottom_banner.png" class="hc-bottom-banner-img" alt="Hậu Cung Banner"/>
                            </div>

                            <!-- Bottom Roller -->
                            <img src="/assets/ui/dantran_authentic/scroll_bottom_roller.png" class="hc-scroll-roller" alt="Scroll Bottom"/>
                        </div>
                    </div>'''

start_marker = '<div id="tab-formation" class="tab-view dantran-authentic-view" style="display: none;">'
end_marker = '<!-- Bát Quái Trận & Thất Tinh Trận Overview Modal'

idx_start = content.find(start_marker)
idx_end = content.find(end_marker)

if idx_start != -1 and idx_end != -1:
    before = content[:idx_start + len(start_marker)]
    middle = content[idx_start + len(start_marker):idx_end]
    after = content[idx_end:]

    # In middle, find the last </div> before idx_end
    last_div_idx = middle.rfind('</div>')
    # Replace middle:
    new_middle = '\n' + submode_html + middle[:last_div_idx] + '\n' + haucung_view_html + '\n                </div>\n\n                '
    content = before + new_middle + after
    with open('public/index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print('Updated public/index.html successfully!')
else:
    print('Error: markers not found', idx_start, idx_end)
