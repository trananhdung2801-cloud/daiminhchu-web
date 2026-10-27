import sys
sys.stdout.reconfigure(encoding='utf-8')

new_formation_html = '''                <div id="tab-formation" class="tab-view dantran-authentic-view" style="display: none;">
                    <!-- Top Sub-mode Icons & Plaque (100% Authentic Matching Original Game Screenshots) -->
                    <div class="dt-top-submode-row">
                        <button class="dt-submode-btn active" id="btn-dt-mode-doihinh" onclick="switchDantranMode('doihinh')" title="Đội hình ra trận">
                            <img src="/assets/ui/dantran_authentic/btn_doi_hinh_roster.png" alt="Đội hình" class="dt-submode-icon"/>
                        </button>
                        <button class="dt-submode-btn" id="btn-dt-mode-thienduong" onclick="switchDantranMode('thienduong')" title="Thiên Dương Trận">
                            <img src="/assets/ui/dantran_authentic/btn_tran_duong.png" alt="Thiên Dương" class="dt-submode-icon"/>
                        </button>
                        <button class="dt-submode-btn" id="btn-dt-mode-thienam" onclick="switchDantranMode('thienam')" title="Thiên Âm Trận">
                            <img src="/assets/ui/dantran_authentic/btn_tran_am.png" alt="Thiên Âm" class="dt-submode-icon"/>
                        </button>
                        <button class="dt-submode-btn" id="btn-dt-mode-thienlong" onclick="switchDantranMode('thienlong')" title="Thiên Long Trận">
                            <img src="/assets/ui/dantran_authentic/btn_tran_long.png" alt="Thiên Long" class="dt-submode-icon"/>
                        </button>
                        <button class="dt-submode-btn" id="btn-dt-mode-haucung" onclick="switchDantranMode('haucung')" title="Hậu Cung">
                            <img src="/assets/ui/dantran_authentic/icon_haucung.png" alt="Hậu Cung" class="dt-submode-icon"/>
                        </button>
                        <div class="dt-plaque-wrapper" onclick="openFormationOverviewModal()" title="Dàn Trận (Bát Quái / Thất Tinh)">
                            <img src="/assets/ui/dantran_authentic/plaque_dan_tran_mini.png" alt="Dàn Trận" class="dt-plaque-img"/>
                        </div>
                    </div>

                    <!-- 1. VIEW ĐỘI HÌNH RA TRẬN (Ảnh 4 - media_1793077731383_79fc77e5.jpg) -->
                    <div id="dt-view-doihinh" class="dt-view-container dt-doihinh-layout" style="display: flex;">
                        <!-- Left Column 4 Slots -->
                        <div class="dt-col-flank dt-flank-left">
                            <div class="dt-slot-flank" id="dh-left-slot-0" onclick="showItemDetail('skill')">
                                <img src="/assets/images/VC_DocCoCuuKiem_vo_cong_to.png" alt="Skill"/>
                                <span class="slot-flank-lvl">99</span>
                            </div>
                            <div class="dt-slot-flank" id="dh-left-slot-1" onclick="showItemDetail('skill')">
                                <img src="/assets/images/VC_GiangLongThapBatChuong_vo_cong_To.png" alt="Skill"/>
                                <span class="slot-flank-lvl">7871</span>
                            </div>
                            <div class="dt-slot-flank" id="dh-left-slot-2" onclick="showItemDetail('item')">
                                <img src="/assets/images/AG_DaHanhY_trang_bi_to.png" alt="Equip"/>
                                <span class="slot-flank-lvl">23</span>
                            </div>
                            <div class="dt-slot-flank" id="dh-left-slot-3" onclick="showItemDetail('item')">
                                <img src="/assets/images/TS_HoiNhanNgocBoi_trang_bi_to.png" alt="Equip"/>
                                <span class="slot-flank-lvl">118</span>
                            </div>
                        </div>

                        <!-- Center Scroll: Đội hình ra trận -->
                        <div class="dt-center-scroll-doihinh">
                            <div class="doihinh-scroll-wrapper">
                                <img src="/assets/ui/dantran_authentic/scroll_doi_hinh_clean.png" class="doihinh-scroll-bg" alt="Đội hình ra trận"/>
                                
                                <!-- 8 Disciples List Overlay -->
                                <div class="doihinh-disciples-list" id="doihinh-disciples-list">
                                    <!-- Dynamic 8 rows populated by JS -->
                                </div>

                                <!-- Bottom Stats -->
                                <div class="doihinh-bottom-stats">
                                    <div class="dh-stat-row">
                                        <span class="dh-label">Tổng giá trị :</span>
                                        <img src="/assets/ui/hero_info_authentic/icon_gold_ingot_clean.png" class="dh-gold-icon" alt="Vàng"/>
                                        <span class="dh-val-gold" id="dh-total-value">1825598</span>
                                    </div>
                                    <div class="dh-stat-row">
                                        <span class="dh-label">Khí thế :</span>
                                        <img src="/assets/ui/dantran_authentic/icon_khithe_badge.png" class="dh-khithe-icon" alt="Thế"/>
                                        <span class="dh-val-khithe" id="dh-total-khithe">88888</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Right Column 4 Slots -->
                        <div class="dt-col-flank dt-flank-right">
                            <div class="dt-slot-flank" id="dh-right-slot-0" onclick="showItemDetail('skill')">
                                <img src="/assets/images/NV_PhongTuNuong_ava_to.png" alt="Avatar"/>
                                <span class="slot-flank-lvl">0</span>
                            </div>
                            <div class="dt-slot-flank" id="dh-right-slot-1" onclick="showItemDetail('skill')">
                                <img src="/assets/images/VC_BichChamThanhChuong_vo_cong_to.png" alt="Skill"/>
                                <span class="slot-flank-lvl">760</span>
                            </div>
                            <div class="dt-slot-flank" id="dh-right-slot-2" onclick="showItemDetail('item')">
                                <img src="/assets/images/AG_HamHuongBaoY_trang_bi_to.png" alt="Equip"/>
                                <span class="slot-flank-lvl">14</span>
                            </div>
                            <div class="dt-slot-flank" id="dh-right-slot-3" onclick="showItemDetail('item')">
                                <img src="/assets/images/VK_KimXaKiem_trang_bi_to.png" alt="Equip"/>
                                <span class="slot-flank-lvl">48</span>
                            </div>
                        </div>
                    </div>

                    <!-- 2. VIEW THIÊN DƯƠNG TRẬN (Ảnh 2 - media_1793077653961_a90a9760.jpg) -->
                    <div id="dt-view-thienduong" class="dt-view-container dt-tran-10-layout" style="display: none;">
                        <!-- Left Column 5 Disciples -->
                        <div class="dt-col-avatars dt-col-avatars-left" id="td-avatars-left"></div>

                        <!-- Center Scroll Painting -->
                        <div class="dt-center-scroll-tran">
                            <div class="tran-scroll-wrapper">
                                <img src="/assets/ui/dantran_authentic/scroll_thien_duong.png" class="tran-scroll-bg" alt="Thiên Dương Trận"/>
                                
                                <!-- Bottom Interactive Controls & Stats Overlay -->
                                <div class="tran-bottom-overlay">
                                    <div class="tran-btns-group">
                                        <button class="tran-action-btn" onclick="cuongHoaTran('thienduong')" title="Cường Hóa">
                                            <img src="/assets/ui/dantran_authentic/btn_cuong_hoa.png" alt="Cường hóa"/>
                                        </button>
                                        <button class="tran-action-btn" onclick="hoTroTran('thienduong')" title="Hỗ Trợ">
                                            <img src="/assets/ui/dantran_authentic/btn_ho_tro.png" alt="Hỗ trợ"/>
                                        </button>
                                    </div>
                                    <div class="tran-stats-quad">
                                        <div class="tran-stat-item">
                                            <img src="/assets/ui/hero_info_authentic/icon_stat_sword.png" class="tran-stat-ico" alt="Công"/>
                                            <span id="td-stat-cong">3313329</span>
                                        </div>
                                        <div class="tran-stat-item">
                                            <img src="/assets/ui/hero_info_authentic/icon_stat_blood.png" class="tran-stat-ico" alt="Máu"/>
                                            <span id="td-stat-mau">13769658</span>
                                        </div>
                                        <div class="tran-stat-item">
                                            <img src="/assets/ui/hero_info_authentic/icon_stat_shield.png" class="tran-stat-ico" alt="Thủ"/>
                                            <span id="td-stat-thu">904</span>
                                        </div>
                                        <div class="tran-stat-item">
                                            <img src="/assets/ui/hero_info_authentic/icon_stat_palm.png" class="tran-stat-ico" alt="Nội"/>
                                            <span id="td-stat-noi">3330471</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Right Column 5 Disciples -->
                        <div class="dt-col-avatars dt-col-avatars-right" id="td-avatars-right"></div>
                    </div>

                    <!-- 3. VIEW THIÊN ÂM TRẬN (Ảnh 1 - media_1793077650898_dc2b7eb0.jpg) -->
                    <div id="dt-view-thienam" class="dt-view-container dt-tran-10-layout" style="display: none;">
                        <!-- Left Column 5 Disciples -->
                        <div class="dt-col-avatars dt-col-avatars-left" id="ta-avatars-left"></div>

                        <!-- Center Scroll Painting -->
                        <div class="dt-center-scroll-tran">
                            <div class="tran-scroll-wrapper">
                                <img src="/assets/ui/dantran_authentic/scroll_thien_am.png" class="tran-scroll-bg" alt="Thiên Âm Trận"/>
                            </div>
                        </div>

                        <!-- Right Column 5 Disciples -->
                        <div class="dt-col-avatars dt-col-avatars-right" id="ta-avatars-right"></div>
                    </div>

                    <!-- 4. VIEW THIÊN LONG TRẬN (Ảnh 3 - media_1793077664238_d62bba4b.jpg) -->
                    <div id="dt-view-thienlong" class="dt-view-container dt-thienlong-layout" style="display: none;">
                        <div class="thienlong-scroll-container">
                            <div class="thienlong-scroll-wrap">
                                <img src="/assets/ui/dantran_authentic/scroll_thien_long.png" class="thienlong-scroll-bg" alt="Thiên Long Trận"/>
                                
                                <!-- 5 Dragon Orbs Avatar Positions -->
                                <div class="tl-avatar-slot slot-top" id="tl-avatar-top" onclick="openDiscipleDetailModal('NV_LamPhuongHoang')" title="Kim Long Vị">
                                    <img src="/assets/images/NV_LamPhuongHoang_ava_to.png" class="tl-slot-ava" alt="Kim Long"/>
                                    <span class="tl-slot-lvl">11</span>
                                </div>
                                <div class="tl-avatar-slot slot-left" id="tl-avatar-left" onclick="openDiscipleDetailModal('NV_DoanDuyenKhanh')" title="Hoàng Long Vị">
                                    <img src="/assets/images/NV_DoanDuyenKhanh_ava_to.png" class="tl-slot-ava" alt="Hoàng Long"/>
                                    <span class="tl-slot-lvl">7</span>
                                </div>
                                <div class="tl-avatar-slot slot-right" id="tl-avatar-right" onclick="openDiscipleDetailModal('NV_BachPhatMaNu')" title="Thanh Long Vị">
                                    <img src="/assets/images/NV_BachPhatMaNu_ava_to.png" class="tl-slot-ava" alt="Thanh Long"/>
                                    <span class="tl-slot-lvl">7</span>
                                </div>
                                <div class="tl-avatar-slot slot-bot-left" id="tl-avatar-bot-left" onclick="openDiscipleDetailModal('NV_TrieuMan')" title="Xích Long Vị">
                                    <img src="/assets/images/NV_TrieuMan_ava_to.png" class="tl-slot-ava" alt="Xích Long"/>
                                    <span class="tl-slot-lvl">7</span>
                                </div>
                                <div class="tl-avatar-slot slot-bot-right" id="tl-avatar-bot-right" onclick="openDiscipleDetailModal('NV_ChuChiNhuoc')" title="Lam Long Vị">
                                    <img src="/assets/images/NV_ChuChiNhuoc_ava_to.png" class="tl-slot-ava" alt="Lam Long"/>
                                    <span class="tl-slot-lvl">7</span>
                                </div>

                                <!-- Bottom Interactive Controls & Stats Overlay -->
                                <div class="thienlong-bottom-overlay">
                                    <div class="tl-btns-group">
                                        <button class="tran-action-btn" onclick="hoTroTran('thienlong')" title="Hỗ Trợ">
                                            <img src="/assets/ui/dantran_authentic/btn_ho_tro.png" alt="Hỗ trợ"/>
                                        </button>
                                    </div>
                                    <div class="tl-stats-quad">
                                        <div class="tl-stat-item">
                                            <img src="/assets/ui/hero_info_authentic/icon_stat_sword.png" class="tl-stat-ico" alt="Công"/>
                                            <span id="tl-stat-cong">34741</span>
                                        </div>
                                        <div class="tl-stat-item">
                                            <img src="/assets/ui/hero_info_authentic/icon_stat_blood.png" class="tl-stat-ico" alt="Máu"/>
                                            <span id="tl-stat-mau">63297</span>
                                        </div>
                                        <div class="tl-stat-item">
                                            <img src="/assets/ui/hero_info_authentic/icon_stat_shield.png" class="tl-stat-ico" alt="Thủ"/>
                                            <span id="tl-stat-thu">40571</span>
                                        </div>
                                        <div class="tl-stat-item">
                                            <img src="/assets/ui/hero_info_authentic/icon_stat_palm.png" class="tl-stat-ico" alt="Nội"/>
                                            <span id="tl-stat-noi">45255</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 5. VIEW HẬU CUNG (media_1793066451321_a85b6675.jpg) -->
                    <div id="dt-view-haucung" class="dt-haucung-view" style="display: none;">
                        <div class="hc-scroll-wrapper">
                            <img src="/assets/ui/dantran_authentic/scroll_top_roller.png" class="hc-scroll-roller" alt="Scroll Top"/>
                            <div class="hc-chamber-board">
                                <img src="/assets/ui/dantran_authentic/haucung_chamber_bg.png" class="hc-chamber-bg" alt="Chamber"/>
                                <div class="hc-slots-column hc-col-left">
                                    <div class="hc-slot-card" id="hc-slot-0" onclick="handleHauCungSlotClick(0)"></div>
                                    <div class="hc-slot-card" id="hc-slot-1" onclick="handleHauCungSlotClick(1)"></div>
                                    <div class="hc-slot-card" id="hc-slot-2" onclick="handleHauCungSlotClick(2)"></div>
                                    <div class="hc-slot-card" id="hc-slot-3" onclick="handleHauCungSlotClick(3)"></div>
                                </div>
                                <div class="hc-slots-column hc-col-right">
                                    <div class="hc-slot-card" id="hc-slot-4" onclick="handleHauCungSlotClick(4)"></div>
                                    <div class="hc-slot-card" id="hc-slot-5" onclick="handleHauCungSlotClick(5)"></div>
                                    <div class="hc-slot-card" id="hc-slot-6" onclick="handleHauCungSlotClick(6)"></div>
                                    <div class="hc-slot-card" id="hc-slot-7" onclick="handleHauCungSlotClick(7)"></div>
                                </div>
                            </div>
                            <div class="hc-bottom-banner-wrap">
                                <img src="/assets/ui/dantran_authentic/haucung_bottom_banner.png" class="hc-bottom-banner-img" alt="Hậu Cung Banner"/>
                            </div>
                            <img src="/assets/ui/dantran_authentic/scroll_bottom_roller.png" class="hc-scroll-roller" alt="Scroll Bottom"/>
                        </div>
                    </div>
                </div>
'''

with open(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\index.html", "r", encoding="utf-8") as f:
    html = f.read()

s_marker = '<div id="tab-formation"'
e_marker = '<!-- Bát Quái Trận & Thất Tinh Trận Overview Modal'

s_idx = html.find(s_marker)
e_idx = html.find(e_marker)

if s_idx != -1 and e_idx != -1:
    new_html = html[:s_idx] + new_formation_html + "\n                " + html[e_idx:]
    with open(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\index.html", "w", encoding="utf-8") as f:
        f.write(new_html)
    print("Updated public/index.html with all 4 authentic Tran & Doi Hinh views successfully!")
else:
    print(f"Could not find markers: s_idx={s_idx}, e_idx={e_idx}")
