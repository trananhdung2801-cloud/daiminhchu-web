import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update tab-luyencong buttons
old_lc_buttons = '''<div style="display: flex; gap: 8px; margin-bottom: 10px;">
                        <button class="btn-wuxia-gold" style="flex: 1; height: 38px; font-size: 11px;" onclick="openTruyenCongModal()">🔄 TRUYỀN CÔNG ĐỆ TỬ</button>
                        <button class="btn-wuxia-gold" style="flex: 1; height: 38px; font-size: 11px;" onclick="openKinhMachModal()">🔮 ĐẢ THÔNG KINH MẠCH</button>
                    </div>'''

new_lc_buttons = '''<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px;">
                        <button class="btn-wuxia-gold" style="height: 38px; font-size: 11px;" onclick="openTruyenCongModal()">🔄 TRUYỀN CÔNG</button>
                        <button class="btn-wuxia-gold" style="height: 38px; font-size: 11px;" onclick="openKinhMachModal()">🔮 KINH MẠCH</button>
                        <button class="btn-wuxia-gold" style="height: 38px; font-size: 11px;" onclick="openBoiDuongModal()">🌟 BỒI DƯỠNG</button>
                        <button class="btn-wuxia-gold" style="height: 38px; font-size: 11px;" onclick="openTinhLuyenModal()">⚒️ TINH LUYỆN</button>
                    </div>'''

if old_lc_buttons in html:
    html = html.replace(old_lc_buttons, new_lc_buttons)
    print("1. Replaced tab-luyencong buttons successfully!")
else:
    print("Could not find exact old_lc_buttons!")

# 2. Add new cards into tab-recruit
target_recruit = '''<!-- Activity 5: Liên Minh Bang Hội (img_23) -->
                    <div class="kyngo-card-box">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="font-size: 32px;">🚩</span>
                            <div>
                                <h4 style="color: #ffd700; font-size: 13px;">Liên Minh Bang Hội (Cửu Châu Minh)</h4>
                                <p style="font-size: 11px; color: #a8a29e;">Cống hiến bang hội, nhận bổng lộc và tăng chỉ số liên minh!</p>
                            </div>
                        </div>
                        <button class="btn-wuxia-gold" style="width: 100px; height: 36px; font-size: 11px;" onclick="openLienMinhModal()">LIÊN MINH</button>
                    </div>'''

new_recruit_cards = '''<!-- Activity 5: Liên Minh Bang Hội (img_23) -->
                    <div class="kyngo-card-box">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="font-size: 32px;">🚩</span>
                            <div>
                                <h4 style="color: #ffd700; font-size: 13px;">Liên Minh Bang Hội (Cửu Châu Minh)</h4>
                                <p style="font-size: 11px; color: #a8a29e;">Cống hiến bang hội, nhận bổng lộc và tăng chỉ số liên minh!</p>
                            </div>
                        </div>
                        <button class="btn-wuxia-gold" style="width: 100px; height: 36px; font-size: 11px;" onclick="openLienMinhModal()">LIÊN MINH</button>
                    </div>

                    <!-- Activity 6: Vận Tiêu Long Môn (img_08, img_22) -->
                    <div class="kyngo-card-box">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <img src="/assets/ui/ava_thuongtieu.png" style="width: 44px; height: 44px; object-fit: contain;">
                            <div>
                                <h4 style="color: #ffd700; font-size: 13px;">Vận Tiêu Long Môn (8h-10h & 20h-22h)</h4>
                                <p style="font-size: 11px; color: #a8a29e;">Áp tải tiêu xa nhận Bạc, Bồi Dưỡng Đan hoặc cướp tiêu đoạt bảo!</p>
                            </div>
                        </div>
                        <button class="btn-wuxia-gold" style="width: 100px; height: 36px; font-size: 11px;" onclick="openVanTieuModal()">VẬN TIÊU</button>
                    </div>

                    <!-- Activity 7: Boss Thế Giới: Thần Điêu Phục Ma (img_21, img_27, img_29) -->
                    <div class="kyngo-card-box">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <img src="/assets/images/NV_ThanDieu_ava_to.png" style="width: 44px; height: 44px; object-fit: contain; border-radius: 50%;">
                            <div>
                                <h4 style="color: #ffd700; font-size: 13px;">Boss Thế Giới: Thần Điêu Phục Ma</h4>
                                <p style="font-size: 11px; color: #a8a29e;">Toàn server hợp lực khiêu chiến, tích lũy sát thương đoạt Thần Binh!</p>
                            </div>
                        </div>
                        <button class="btn-wuxia-gold" style="width: 100px; height: 36px; font-size: 11px;" onclick="openBossThanDieuModal()">KHIÊU CHIẾN</button>
                    </div>

                    <!-- Activity 8: Thần Tiên Tỷ Tỷ Ban Phước (img_37) -->
                    <div class="kyngo-card-box">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <img src="/assets/images/NV_VuongNguYen_ava_to.png" style="width: 44px; height: 44px; object-fit: contain; border-radius: 50%;">
                            <div>
                                <h4 style="color: #ffd700; font-size: 13px;">Thần Tiên Tỷ Tỷ (Động Vô Lượng Sơn)</h4>
                                <p style="font-size: 11px; color: #a8a29e;">Khấn vái thành tâm nhận Bí kíp Tuyệt Thế Võ Công [Giáp] & KNB!</p>
                            </div>
                        </div>
                        <button class="btn-wuxia-gold" style="width: 100px; height: 36px; font-size: 11px;" onclick="openThanTienTyTyModal()">KHẤN VÁI</button>
                    </div>

                    <!-- Activity 9: Đào Kho Báu Ôn Hựu Sơn & Tuyệt Tình Cốc (img_04, img_18, img_24) -->
                    <div class="kyngo-card-box">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <img src="/assets/ui/ava_batmon.png" style="width: 44px; height: 44px; object-fit: contain;">
                            <div>
                                <h4 style="color: #ffd700; font-size: 13px;">Đào Kho Báu (Ôn Hựu Sơn & Tuyệt Tình Cốc)</h4>
                                <p style="font-size: 11px; color: #a8a29e;">Khai mở kho báu tầng sâu nhận Tàn Hồn Đệ Tử Giáp & Thần Binh!</p>
                            </div>
                        </div>
                        <button class="btn-wuxia-gold" style="width: 100px; height: 36px; font-size: 11px;" onclick="openKhoBauModal()">ĐÀO BÁU</button>
                    </div>'''

if target_recruit in html:
    html = html.replace(target_recruit, new_recruit_cards)
    print("2. Added new cards to tab-recruit successfully!")
else:
    print("Could not find target_recruit!")

# 3. Add Modals before <script src="/js/game.js?v=8"></script>
new_modals = '''
    <!-- ================= MODAL VẬN TIÊU LONG MÔN (img_08, img_22) ================= -->
    <div id="vantieu-modal" class="modal-overlay">
        <div class="wuxia-dialog anim-zoom-enter" style="max-width: 460px;">
            <div class="dialog-header-bar">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <img src="/assets/ui/ava_thuongtieu.png" style="width: 24px; height: 24px;">
                    <span class="dialog-title">LONG MÔN TIÊU CỤC - VẬN TIÊU & CƯỚP TIÊU</span>
                </div>
                <img src="/assets/res/sh_close.png" class="btn-dialog-close" onclick="closeVanTieuModal()" alt="Đóng">
            </div>
            <div class="dialog-body-scroll">
                <div style="background: rgba(0,0,0,0.5); padding: 10px; border-radius: 6px; border: 1px solid #78350f; margin-bottom: 12px; font-size: 11px; color: #fde68a;">
                    ⏰ <b>Giờ Vàng:</b> 08:00 - 10:00 & 20:00 - 22:00.<br>
                    Mỗi ngày chưởng môn có <b>5 lượt Vận Tiêu</b> và <b>5 lượt Cướp Tiêu</b> giang hồ!
                </div>

                <div style="color: #ffd700; font-size: 12px; font-weight: bold; margin-bottom: 8px;">CHỌN TIÊU XA KHỞI HÀNH:</div>
                <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 14px;">
                    <div class="vantieu-cart-card">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <img src="/assets/ui/cuoptieu_01.png" style="width: 40px; height: 40px; object-fit: contain;">
                            <div>
                                <h4 style="color: #fff; font-size: 12px;">Tiêu Xa Gỗ [Sơ Cấp]</h4>
                                <span style="font-size: 10px; color: #a8a29e;">Thưởng: 100.000 Bạc + 10 Bồi Dưỡng Đan</span>
                            </div>
                        </div>
                        <button class="btn-wuxia-gold" style="width: 90px; height: 32px; font-size: 10px;" onclick="doStartVanTieu('go')">Vận (Miễn Phí)</button>
                    </div>

                    <div class="vantieu-cart-card">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <img src="/assets/ui/cuoptieu_02.png" style="width: 40px; height: 40px; object-fit: contain;">
                            <div>
                                <h4 style="color: #38bdf8; font-size: 12px;">Tiêu Xa Thiết Giáp [Trung Cấp]</h4>
                                <span style="font-size: 10px; color: #a8a29e;">Thưởng: 350.000 Bạc + 25 Đan + 8 Sâm</span>
                            </div>
                        </div>
                        <button class="btn-wuxia-gold" style="width: 90px; height: 32px; font-size: 10px;" onclick="doStartVanTieu('sat')">50 Vàng</button>
                    </div>

                    <div class="vantieu-cart-card" style="border-color: #ffd700;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <img src="/assets/ui/cuoptieu_03.png" style="width: 40px; height: 40px; object-fit: contain;">
                            <div>
                                <h4 style="color: #ffd700; font-size: 12px;">Tiêu Xa Hoàng Kim [Cao Cấp]</h4>
                                <span style="font-size: 10px; color: #a8a29e;">Thưởng: 1.000.000 Bạc + 60 Đan + 20 Sâm</span>
                            </div>
                        </div>
                        <button class="btn-wuxia-gold" style="width: 90px; height: 32px; font-size: 10px;" onclick="doStartVanTieu('hoang_kim')">150 Vàng</button>
                    </div>
                </div>

                <div style="color: #ffd700; font-size: 12px; font-weight: bold; margin-bottom: 8px;">CƯỚP TIÊU VÕ LÂM:</div>
                <div id="vantieu-rivals-list" style="display: flex; flex-direction: column; gap: 6px;">
                    <!-- Injected dynamically -->
                </div>
            </div>
        </div>
    </div>

    <!-- ================= MODAL BOSS THẦN ĐIÊU PHỤC MA (img_21, img_27, img_29) ================= -->
    <div id="boss-thandieu-modal" class="modal-overlay">
        <div class="wuxia-dialog anim-zoom-enter" style="max-width: 460px;">
            <div class="dialog-header-bar">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <img src="/assets/images/NV_ThanDieu_ava_to.png" style="width: 26px; height: 26px; border-radius: 50%;">
                    <span class="dialog-title">BOSS THẾ GIỚI: THẦN ĐIÊU PHỤC MA</span>
                </div>
                <img src="/assets/res/sh_close.png" class="btn-dialog-close" onclick="closeBossThanDieuModal()" alt="Đóng">
            </div>
            <div class="dialog-body-scroll" style="text-align: center;">
                <div style="position: relative; margin-bottom: 12px; background: radial-gradient(circle, rgba(180,83,9,0.3) 0%, rgba(0,0,0,0.8) 100%); padding: 16px; border-radius: 8px; border: 1px solid #d97706;">
                    <img src="/assets/images/NV_ThanDieu_ava_to.png" style="width: 100px; height: 100px; object-fit: contain; filter: drop-shadow(0 0 10px #f59e0b);">
                    <h3 style="color: #ffd700; font-size: 16px; margin-top: 6px;">THẦN ĐIÊU THƯỢNG CỔ</h3>
                    <div style="font-size: 11px; color: #fed7aa;">Cự Thú Cổ Mộ - Khí Thế Bài Sơn Đảo Hải</div>

                    <!-- HP Progress Bar -->
                    <div style="background: #292524; border-radius: 10px; height: 18px; margin: 10px auto 4px; overflow: hidden; border: 1px solid #78350f; max-width: 320px; position: relative;">
                        <div id="boss-hp-bar" style="background: linear-gradient(90deg, #ef4444, #f59e0b); height: 100%; width: 85%; transition: width 0.3s;"></div>
                        <span id="boss-hp-text" style="position: absolute; width: 100%; left: 0; top: 0; font-size: 10px; line-height: 18px; color: #fff; font-weight: bold; text-shadow: 1px 1px 2px #000;">86.450.000 / 100.000.000 HP</span>
                    </div>
                </div>

                <div style="display: flex; justify-content: space-around; background: rgba(0,0,0,0.4); padding: 8px; border-radius: 6px; margin-bottom: 12px; font-size: 11px;">
                    <div>Sát thương tích lũy: <b id="boss-my-damage" style="color: #ffd700;">0</b></div>
                    <div>Số lượt đánh: <b id="boss-my-fights" style="color: #86efac;">0</b></div>
                </div>

                <button class="btn-wuxia-gold" style="width: 200px; height: 42px; font-size: 13px; margin-bottom: 14px;" onclick="doFightBossThanDieu()">⚔️ XUẤT CHIẾN CÔNG BOSS</button>

                <div style="text-align: left;">
                    <div style="color: #ffd700; font-size: 12px; font-weight: bold; margin-bottom: 6px;">BẢNG XẾP HẠNG SÁT THƯƠNG:</div>
                    <div id="boss-rankings-list" style="display: flex; flex-direction: column; gap: 4px; font-size: 11px;">
                        <!-- Injected dynamically -->
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- ================= MODAL THẦN TIÊN TỶ TỶ (img_37) ================= -->
    <div id="thantientyty-modal" class="modal-overlay">
        <div class="wuxia-dialog anim-zoom-enter" style="max-width: 440px;">
            <div class="dialog-header-bar">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <img src="/assets/images/NV_VuongNguYen_ava_to.png" style="width: 24px; height: 24px; border-radius: 50%;">
                    <span class="dialog-title">THẦN TIÊN TỶ TỶ - ĐỘNG VÔ LƯỢNG SƠN</span>
                </div>
                <img src="/assets/res/sh_close.png" class="btn-dialog-close" onclick="closeThanTienTyTyModal()" alt="Đóng">
            </div>
            <div class="dialog-body-scroll" style="text-align: center;">
                <div style="position: relative; margin-bottom: 12px;">
                    <img src="/assets/images/NV_VuongNguYen_ava_to.png" style="width: 90px; height: 90px; border-radius: 50%; border: 2px solid #ffd700; box-shadow: 0 0 15px rgba(255,215,0,0.5);">
                    <h3 style="color: #ffd700; font-size: 15px; margin-top: 6px;">Ngọc Tượng Thần Tiên Tỷ Tỷ</h3>
                    <p style="font-size: 11px; color: #fed7aa; max-width: 340px; margin: 4px auto;">"Vì thành tâm khấn vái bái lạy, được Thần Tiên Tỷ Tỷ ban cho Tuyệt Thế Võ Công cùng Đan Dược quý!"</p>
                </div>

                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <div class="vantieu-cart-card">
                        <div>
                            <h4 style="color: #86efac; font-size: 12px;">Khấn Vái Thành Tâm (Miễn Phí)</h4>
                            <span style="font-size: 10px; color: #a8a29e;">Nhận 100 Vàng + 15 Bồi Dưỡng Đan + 5 Bách Niên Sâm (1 lần/ngày)</span>
                        </div>
                        <button id="btn-pray-free" class="btn-wuxia-gold" style="width: 90px; height: 34px; font-size: 10px;" onclick="doPrayThanTien('pray_free')">Khấn Vái</button>
                    </div>

                    <div class="vantieu-cart-card">
                        <div>
                            <h4 style="color: #38bdf8; font-size: 12px;">Cúng Dường Hương Án</h4>
                            <span style="font-size: 10px; color: #a8a29e;">Ban thưởng Tuyệt Thế Bí Kíp [Giáp] + 20 Bồi Dưỡng Đan</span>
                        </div>
                        <button class="btn-wuxia-gold" style="width: 90px; height: 34px; font-size: 10px;" onclick="doPrayThanTien('pray_gold')">100 Vàng</button>
                    </div>

                    <div class="vantieu-cart-card" style="border-color: #ffd700;">
                        <div>
                            <h4 style="color: #ffd700; font-size: 12px;">Đại Lễ Bách Niên</h4>
                            <span style="font-size: 10px; color: #a8a29e;">100% nhận 1 Võ Công Thần Phẩm [Giáp] + 50 Đan + 10 Sâm</span>
                        </div>
                        <button class="btn-wuxia-gold" style="width: 90px; height: 34px; font-size: 10px;" onclick="doPrayThanTien('pray_mega')">300 Vàng</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- ================= MODAL TINH LUYỆN TRANG BỊ (img_34, img_06) ================= -->
    <div id="tinhluyen-modal" class="modal-overlay">
        <div class="wuxia-dialog anim-zoom-enter" style="max-width: 460px;">
            <div class="dialog-header-bar">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 20px;">⚒️</span>
                    <span class="dialog-title">LÒ RÈN: TINH LUYỆN & ĐÚC THẦN BINH</span>
                </div>
                <img src="/assets/res/sh_close.png" class="btn-dialog-close" onclick="closeTinhLuyenModal()" alt="Đóng">
            </div>
            <div class="dialog-body-scroll">
                <div style="background: rgba(0,0,0,0.4); padding: 8px; border-radius: 6px; margin-bottom: 10px; font-size: 11px; color: #fed7aa;">
                    "Sau khi khổ công tìm kiếm nguyên liệu, đã thành công tinh luyện Thần Binh!"<br>
                    Mỗi cấp Sao tinh luyện tăng vĩnh viễn <b>+15% chỉ số Công, Thủ, Máu</b> cho Trang Bị!
                </div>

                <div style="color: #ffd700; font-size: 12px; font-weight: bold; margin-bottom: 6px;">CHỌN TRANG BỊ CẦN TINH LUYỆN:</div>
                <div id="tinhluyen-equips-list" style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; max-height: 240px; overflow-y: auto;">
                    <!-- Injected dynamically -->
                </div>
            </div>
        </div>
    </div>

    <!-- ================= MODAL ĐÀO KHO BÁU (img_04, img_18, img_24) ================= -->
    <div id="khobau-modal" class="modal-overlay">
        <div class="wuxia-dialog anim-zoom-enter" style="max-width: 440px;">
            <div class="dialog-header-bar">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <img src="/assets/ui/ava_batmon.png" style="width: 24px; height: 24px;">
                    <span class="dialog-title">ĐÀO KHO BÁU GIANG HỒ</span>
                </div>
                <img src="/assets/res/sh_close.png" class="btn-dialog-close" onclick="closeKhoBauModal()" alt="Đóng">
            </div>
            <div class="dialog-body-scroll">
                <div style="display: flex; flex-direction: column; gap: 12px;">
                    <!-- Area 1: Ôn Hựu Sơn -->
                    <div class="duatop-banner-card">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <h4 style="color: #ffd700; font-size: 13px;">Kho Báu Ôn Hựu Sơn (Cấp 1-50)</h4>
                                <p style="font-size: 11px; color: #a8a29e; margin-top: 2px;">Tầng hiện tại: <b id="khobau-onhuuson-floor" style="color: #86efac;">Tầng 1</b></p>
                                <span style="font-size: 10px; color: #cbd5e1;">Phí đào: 50.000 Bạc / lần</span>
                            </div>
                            <button class="btn-wuxia-gold" style="width: 90px; height: 36px; font-size: 11px;" onclick="doExploreKhoBau('onhuuson')">ĐÀO BÁU</button>
                        </div>
                    </div>

                    <!-- Area 2: Tuyệt Tình Cốc -->
                    <div class="duatop-banner-card" style="border-color: #ffd700;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <h4 style="color: #ffd700; font-size: 13px;">Thần Khố Tuyệt Tình Cốc (Cấp 50+)</h4>
                                <p style="font-size: 11px; color: #a8a29e; margin-top: 2px;">Tầng sâu: <b id="khobau-tuyettinhcoc-floor" style="color: #f59e0b;">Tầng 1</b></p>
                                <span style="font-size: 10px; color: #cbd5e1;">Phí la bàn: 60 Vàng / lần</span>
                            </div>
                            <button class="btn-wuxia-gold" style="width: 90px; height: 36px; font-size: 11px;" onclick="doExploreKhoBau('tuyettinhcoc')">LA BÀN</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
'''

script_tag = '<script src="/js/game.js?v=8"></script>'
if script_tag in html:
    html = html.replace(script_tag, new_modals + '\n    ' + script_tag)
    print("3. Injected new modals before script tag successfully!")
else:
    print("Could not find script tag!")

# Bump cache buster to v=9
html = html.replace('/js/game.js?v=8', '/js/game.js?v=9')
html = html.replace('/css/style.css?v=8', '/css/style.css?v=9')

with open(r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Finished updating index.html!")
