import sys, os
sys.stdout.reconfigure(encoding='utf-8')
os.chdir(r'C:\Users\trananh.dung\Downloads\DaiMinhChu_Server')

with open('public/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Bump cache-busting version v=24 -> v=25
content = content.replace('style.css?v=24', 'style.css?v=25')
content = content.replace('game.js?v=24', 'game.js?v=25')

# Target the end of #kyngo-view-thuongtieu
target = '''                        <!-- Dynamic Spent KNB Counter -->
                        <div class="tlt-spent-counter">
                            <span class="tlt-spent-label">Đã tiêu:</span>
                            <img src="/assets/ui/kyngo_authentic/icon_knb_gold.png" class="tlt-knb-icon" alt="KNB"/>
                            <span id="tlt-spent-amount" class="tlt-spent-val">2</span>
                        </div>
                    </div>'''

replacement = '''                        <!-- Dynamic Spent KNB Counter -->
                        <div class="tlt-spent-counter">
                            <span class="tlt-spent-label">Đã tiêu:</span>
                            <img src="/assets/ui/kyngo_authentic/icon_knb_gold.png" class="tlt-knb-icon" alt="KNB"/>
                            <span id="tlt-spent-amount" class="tlt-spent-val">2</span>
                        </div>
                    </div>

                    <!-- Main Scenic Stage 3: Bầu Cua Tôm Cá Authentic GUI (media_1793068015082_01406808.jpg) -->
                    <div id="kyngo-view-baucua" class="kyngo-stage-scene" style="display: none;">
                        <img src="/assets/ui/kyngo_authentic/scene_baucua_clean.png" class="kyngo-scene-bg" alt="Bầu Cua Tôm Cá"/>

                        <!-- Dynamic Plate Dice Area -->
                        <div id="bc-dice-tray" class="bc-dice-tray">
                            <div class="bc-dice-item" id="bc-dice-1">
                                <img src="/assets/ui/kyngo_authentic/baucua_card_bau.png" class="bc-dice-face" id="bc-face-1" alt="Dice 1"/>
                            </div>
                            <div class="bc-dice-item" id="bc-dice-2">
                                <img src="/assets/ui/kyngo_authentic/baucua_card_cua.png" class="bc-dice-face" id="bc-face-2" alt="Dice 2"/>
                            </div>
                            <div class="bc-dice-item" id="bc-dice-3">
                                <img src="/assets/ui/kyngo_authentic/baucua_card_tom.png" class="bc-dice-face" id="bc-face-3" alt="Dice 3"/>
                            </div>
                        </div>

                        <!-- Play Action Hotspot (Over Vi Tiểu Bảo's 'Chơi' Button) -->
                        <div class="bc-play-hotspot" onclick="doPlayBauCua()" title="Nhấn để Lắc Bầu Cua!">
                            <div class="bc-play-glow"></div>
                        </div>

                        <!-- Live Counters Overlays -->
                        <div class="bc-live-stats">
                            <div class="bc-stat-line bc-line-tongdat">
                                <span id="bc-total-bet-val" class="bc-val-num">0</span>
                            </div>
                            <div class="bc-stat-line bc-line-hienco">
                                <span id="bc-current-bac-val" class="bc-val-num">121,754,235</span>
                            </div>
                        </div>

                        <!-- Free Turns Counter Overlay -->
                        <div class="bc-free-turns-counter">
                            <span id="bc-free-turns-val" class="bc-turns-val">50</span>
                        </div>

                        <!-- 6 Interactive Betting Cards Grid -->
                        <div class="bc-cards-grid">
                            <!-- Row 1: Nai, Bầu, Gà -->
                            <div class="bc-card-spot bc-spot-nai" onclick="placeBetOnCard('nai')" title="Đặt cược Nai (Hươu)">
                                <span class="bc-card-chip" id="bc-chip-nai" style="display: none;">0</span>
                                <div class="bc-card-highlight" id="bc-hl-nai"></div>
                            </div>
                            <div class="bc-card-spot bc-spot-bau" onclick="placeBetOnCard('bau')" title="Đặt cược Bầu">
                                <span class="bc-card-chip" id="bc-chip-bau" style="display: none;">0</span>
                                <div class="bc-card-highlight" id="bc-hl-bau"></div>
                            </div>
                            <div class="bc-card-spot bc-spot-ga" onclick="placeBetOnCard('ga')" title="Đặt cược Gà">
                                <span class="bc-card-chip" id="bc-chip-ga" style="display: none;">0</span>
                                <div class="bc-card-highlight" id="bc-hl-ga"></div>
                            </div>

                            <!-- Row 2: Cá, Cua, Tôm -->
                            <div class="bc-card-spot bc-spot-ca" onclick="placeBetOnCard('ca')" title="Đặt cược Cá">
                                <span class="bc-card-chip" id="bc-chip-ca" style="display: none;">0</span>
                                <div class="bc-card-highlight" id="bc-hl-ca"></div>
                            </div>
                            <div class="bc-card-spot bc-spot-cua" onclick="placeBetOnCard('cua')" title="Đặt cược Cua">
                                <span class="bc-card-chip" id="bc-chip-cua" style="display: none;">0</span>
                                <div class="bc-card-highlight" id="bc-hl-cua"></div>
                            </div>
                            <div class="bc-card-spot bc-spot-tom" onclick="placeBetOnCard('tom')" title="Đặt cược Tôm">
                                <span class="bc-card-chip" id="bc-chip-tom" style="display: none;">0</span>
                                <div class="bc-card-highlight" id="bc-hl-tom"></div>
                            </div>
                        </div>

                        <!-- Bottom Controls: Chips Bar (Left) and Modals Hotspots (Right) -->
                        <div class="bc-bottom-controls-bar">
                            <div class="bc-chips-row">
                                <button type="button" class="bc-chip-btn active" onclick="selectChipAmount(10000, this)">10K</button>
                                <button type="button" class="bc-chip-btn" onclick="selectChipAmount(50000, this)">50K</button>
                                <button type="button" class="bc-chip-btn" onclick="selectChipAmount(100000, this)">100K</button>
                                <button type="button" class="bc-chip-btn clear" onclick="clearAllBauCuaBets()" title="Xóa toàn bộ cược">Xóa</button>
                            </div>

                            <!-- Hotspots for Xếp Hạng & Tường Trình -->
                            <div class="bc-footer-hotspots">
                                <div class="bc-btn-hotspot bc-hotspot-rank" onclick="openBauCuaRankModal()" title="Bảng Xếp Hạng Bầu Cua"></div>
                                <div class="bc-btn-hotspot bc-hotspot-history" onclick="openBauCuaHistoryModal()" title="Lịch Sử Tường Trình"></div>
                            </div>
                        </div>
                    </div>'''

if target in content:
    content = content.replace(target, replacement)
    with open('public/index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print('Updated public/index.html with #kyngo-view-baucua successfully!')
else:
    print('target block not found!')
