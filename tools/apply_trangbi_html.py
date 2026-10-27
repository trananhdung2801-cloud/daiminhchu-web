import sys
sys.stdout.reconfigure(encoding='utf-8')

new_tab_items = '''                <!-- ================= 100% AUTHENTIC GIAO DIỆN TRANG BỊ (media_1793077943396_4798b6c6.jpg) ================= -->
                <div id="tab-items" class="tab-view trangbi-authentic-view" style="display: none;">
                    <!-- Top 5 Tabs: Tất cả, Vũ khí, Áo giáp, Trang sức, Thần Khí -->
                    <div class="trangbi-tabs-row">
                        <button class="tb-tab-btn" id="btn-tb-tab-all" onclick="switchTrangBiTab('all')" title="Tất cả">
                            <span class="tb-tab-text">Tất cả</span>
                        </button>
                        <button class="tb-tab-btn active" id="btn-tb-tab-vukhi" onclick="switchTrangBiTab('vukhi')" title="Vũ khí">
                            <span class="tb-tab-text">Vũ khí</span>
                        </button>
                        <button class="tb-tab-btn" id="btn-tb-tab-aogiap" onclick="switchTrangBiTab('aogiap')" title="Áo giáp">
                            <span class="tb-tab-text">Áo giáp</span>
                        </button>
                        <button class="tb-tab-btn" id="btn-tb-tab-trangsuc" onclick="switchTrangBiTab('trangsuc')" title="Trang sức">
                            <span class="tb-tab-text">Trang sức</span>
                        </button>
                        <button class="tb-tab-btn" id="btn-tb-tab-thankhi" onclick="switchTrangBiTab('thankhi')" title="Thần Khí">
                            <span class="tb-tab-text">Thần Khí</span>
                        </button>
                    </div>

                    <!-- Sub-action Row: Phân Rã & Bán -->
                    <div class="trangbi-subaction-row">
                        <button class="tb-action-sub-btn" onclick="openPhanRaModal()" title="Phân rã">
                            <img src="/assets/ui/trangbi_authentic/btn_phan_ra.png" alt="Phân rã"/>
                        </button>
                        <button class="tb-action-sub-btn" onclick="openBanModal()" title="Bán">
                            <img src="/assets/ui/trangbi_authentic/btn_ban.png" alt="Bán"/>
                        </button>
                    </div>

                    <!-- Equipment Items List -->
                    <div class="trangbi-list-container" id="trangbi-list-container"></div>
                </div>'''

with open(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\index.html", "r", encoding="utf-8") as f:
    html = f.read()

s_marker = '<div id="tab-items"'
e_marker = '<!-- Authentic 8-Tab Bottom Navigation Bar'

s_idx = html.find(s_marker)
e_idx = html.find(e_marker)

if s_idx != -1 and e_idx != -1:
    new_html = html[:s_idx] + new_tab_items + "\n            </div>\n\n\n\n            " + html[e_idx:]
    with open(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\index.html", "w", encoding="utf-8") as f:
        f.write(new_html)
    print("Updated public/index.html with authentic trang bi view successfully!")
else:
    print(f"Could not find markers: s_idx={s_idx}, e_idx={e_idx}")
