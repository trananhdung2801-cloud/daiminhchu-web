import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Let's add disciple-detail-modal and other modals before <script src="/js/game.js?v=10"></script>
new_dialogs = '''
    <!-- ================= MODAL CUỘN TRANH TRỤC THƯ ĐỆ TỬ ================= -->
    <div id="disciple-detail-modal" class="modal-overlay">
        <div class="wuxia-dialog anim-zoom-enter" style="max-width: 480px; padding: 6px;">
            <div class="dialog-header-bar">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 18px;">📜</span>
                    <span class="dialog-title">CHI TIẾT ĐỆ TỬ - TRỤC THƯ KIM DUNG</span>
                </div>
                <img src="/assets/res/sh_close.png" class="btn-dialog-close" onclick="closeDiscipleDetailModal()" alt="Đóng">
            </div>
            <div class="dialog-body-scroll" style="padding: 4px;">
                <div class="scroll-painting-stage" style="margin: 0 auto;">
                    <!-- Left 3 Equip Slots -->
                    <div class="equip-column-left">
                        <div class="equip-slot-box" id="slot-skill-1" onclick="showItemDetail('skill')">
                            <img src="/assets/images/VC_QuyHoaBaoDien_vo_cong_to.png" alt="Võ Công">
                            <span class="slot-lvl">1</span>
                        </div>
                        <div class="equip-slot-box" id="slot-weapon" onclick="showItemDetail('weapon')">
                            <img src="/assets/images/VK_DoLongDao_trang_bi_to.png" alt="Vũ Khí">
                            <span class="slot-lvl">1</span>
                        </div>
                        <div class="equip-slot-box" id="slot-armor" onclick="showItemDetail('armor')">
                            <img src="/assets/images/AG_CamVeHoangKimGiap_trang_bi_to.png" alt="Phòng Cụ">
                            <span class="slot-lvl">2</span>
                        </div>
                    </div>

                    <!-- Center Cuộn Tranh Trục Thư -->
                    <div class="disciple-main-scroll">
                        <div class="scroll-art-wrapper">
                            <img id="disciple-scroll-portrait" class="scroll-hero-img" src="/assets/images/NV_DongPhuongBatBai_ava_to.png" alt="Đệ Tử">
                            <div id="disciple-scroll-calligraphy" class="calligraphy-vertical-name">Đông Phương Bất Bại</div>
                            <div id="disciple-scroll-quality" class="quality-badge-giap">GIÁP</div>

                            <div class="scroll-level-hp-box">
                                <div class="hero-level-tag"><span id="disciple-scroll-level">32</span><small>+0</small></div>
                                <div class="scroll-hp-bar">
                                    <div id="disciple-hp-fill" class="scroll-hp-fill" style="width: 46%;"></div>
                                    <span id="disciple-hp-text" class="scroll-hp-text">1111/2418</span>
                                </div>
                            </div>

                            <div class="scroll-stats-quad">
                                <div class="stat-quad-item" title="Khí Huyết">
                                    <span class="stat-icon-blood">🩸</span>
                                    <span id="stat-val-hp">1021</span>
                                </div>
                                <div class="stat-quad-item" title="Vũ Lực">
                                    <span class="stat-icon-sword">⚔️</span>
                                    <span id="stat-val-atk">862</span>
                                </div>
                                <div class="stat-quad-item" title="Hộ Thể">
                                    <span class="stat-icon-shield">🛡️</span>
                                    <span id="stat-val-def">381</span>
                                </div>
                                <div class="stat-quad-item" title="Nội Lực">
                                    <span class="stat-icon-inner">⚡</span>
                                    <span id="stat-val-inner">548</span>
                                </div>
                            </div>

                            <div id="disciple-synergy-grid" class="synergy-bonds-grid">
                                <div class="synergy-bond-item active">• Ma giáo lãnh tụ</div>
                                <div class="synergy-bond-item">• Bất bại thần thoại</div>
                                <div class="synergy-bond-item active">• Quỳ hoa bảo điển</div>
                                <div class="synergy-bond-item">• Hồng châm tả lực</div>
                                <div class="synergy-bond-item">• Tham Lang thôn nhật</div>
                                <div class="synergy-bond-item active">• Cùng hung cực ác</div>
                            </div>

                            <div class="scroll-footer-bar">
                                <div class="disciple-value-tag">
                                    Giá trị : <span id="disciple-scroll-value" style="color: #ffd700; font-weight: bold;">6993 Vàng</span>
                                </div>
                                <div class="scroll-action-btns">
                                    <button class="btn-mini-boiduong" onclick="openBoiDuongModal()">Bồi Dưỡng</button>
                                    <button class="btn-mini-action" onclick="openKinhMachModal()">Kinh Mạch</button>
                                    <button class="btn-mini-action" onclick="openTayDuyenModal()">Tẩy Duyên</button>
                                    <button class="btn-mini-action" onclick="openBeQuanModal()">Bế Quan</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right 3 Equip Slots -->
                    <div class="equip-column-right">
                        <div class="equip-slot-box" id="slot-trinket" onclick="showItemDetail('trinket')">
                            <img src="/assets/images/VK_KimXaKiem_trang_bi_to.png" alt="Ám Khí">
                            <span class="slot-lvl">49</span>
                        </div>
                        <div class="equip-slot-box" id="slot-robe" onclick="showItemDetail('robe')">
                            <img src="/assets/images/AG_DaHanhY_trang_bi_to.png" alt="Y Phục">
                            <span class="slot-lvl">51</span>
                        </div>
                        <div class="equip-slot-box" id="slot-skill-2" onclick="showItemDetail('book')">
                            <img src="/assets/images/VC_DocCoCuuKiem_vo_cong_to.png" alt="Tâm Pháp">
                            <span class="slot-lvl">49</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- ================= MODAL LONG CHÂU ================= -->
    <div id="longchau-modal" class="modal-overlay">
        <div class="wuxia-dialog anim-zoom-enter" style="max-width: 440px;">
            <div class="dialog-header-bar">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <img src="/assets/ui/home_authentic/icon_longchau.png" style="width: 28px; height: 28px; object-fit: contain;">
                    <span class="dialog-title">THẤT TINH LONG CHÂU</span>
                </div>
                <img src="/assets/res/sh_close.png" class="btn-dialog-close" onclick="closeLongChauModal()" alt="Đóng">
            </div>
            <div class="dialog-body-scroll" style="text-align: center;">
                <div style="margin-bottom: 12px;">
                    <img src="/assets/ui/LongChau_HoangKim.png" style="width: 80px; height: 80px; filter: drop-shadow(0 0 10px #f59e0b);">
                    <h3 style="color: #ffd700; font-size: 15px; margin-top: 6px;">Hoàng Kim Long Châu</h3>
                    <p style="font-size: 11px; color: #fed7aa;">Hấp thụ linh khí nhật nguyệt, tăng <b>+25% Toàn Thuộc Tính</b> cho toàn bộ đệ tử xuất trận!</p>
                </div>
                <div style="display: flex; justify-content: space-around; background: rgba(0,0,0,0.4); padding: 10px; border-radius: 6px; font-size: 12px; margin-bottom: 12px;">
                    <div>Cấp Long Châu: <b style="color: #ffd700;">Lv.7</b></div>
                    <div>Thuộc tính ẩn: <b style="color: #86efac;">+15% Bạo Kích</b></div>
                </div>
                <button class="btn-wuxia-gold" style="width: 180px; height: 38px; font-size: 12px;" onclick="alert('Long Châu đã kích hoạt viên mãn!')">✨ LUYỆN LONG CHÂU</button>
            </div>
        </div>
    </div>

    <!-- ================= MODAL LIÊN SERVER ================= -->
    <div id="lienserver-modal" class="modal-overlay">
        <div class="wuxia-dialog anim-zoom-enter" style="max-width: 440px;">
            <div class="dialog-header-bar">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <img src="/assets/ui/home_authentic/icon_lienserver.png" style="width: 28px; height: 28px; object-fit: contain;">
                    <span class="dialog-title">ĐẠI CHIẾN LIÊN SERVER</span>
                </div>
                <img src="/assets/res/sh_close.png" class="btn-dialog-close" onclick="closeLienServerModal()" alt="Đóng">
            </div>
            <div class="dialog-body-scroll" style="text-align: center;">
                <p style="font-size: 12px; color: #ffd700; margin-bottom: 12px;">Đấu trường liên cụm máy chủ mở vào 21:00 hàng ngày!</p>
                <div class="spending-tier-item">
                    <div>
                        <b style="color: #ffd700;">S1. Thái Sơn Bắc Đẩu</b>
                        <small style="display: block; color: #a8a29e;">Chiến lực: 88.500.000</small>
                    </div>
                    <button class="btn-wuxia-gold" style="width: 80px; height: 30px; font-size: 10px;" onclick="triggerTestBattle()">Tỉ Thí</button>
                </div>
                <div class="spending-tier-item">
                    <div>
                        <b style="color: #ffd700;">S2. Hoa Sơn Kiếm Thánh</b>
                        <small style="display: block; color: #a8a29e;">Chiến lực: 82.100.000</small>
                    </div>
                    <button class="btn-wuxia-gold" style="width: 80px; height: 30px; font-size: 10px;" onclick="triggerTestBattle()">Tỉ Thí</button>
                </div>
            </div>
        </div>
    </div>

    <!-- ================= MODAL ÁM KHÍ ================= -->
    <div id="amkhi-modal" class="modal-overlay">
        <div class="wuxia-dialog anim-zoom-enter" style="max-width: 440px;">
            <div class="dialog-header-bar">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <img src="/assets/ui/home_authentic/icon_amkhi.png" style="width: 28px; height: 28px; object-fit: contain;">
                    <span class="dialog-title">ÁM KHÍ ĐƯỜNG MÔN</span>
                </div>
                <img src="/assets/res/sh_close.png" class="btn-dialog-close" onclick="closeAmKhiModal()" alt="Đóng">
            </div>
            <div class="dialog-body-scroll" style="text-align: center;">
                <img src="/assets/ui/AmKhi_1.png" style="width: 80px; height: 80px; object-fit: contain; margin-bottom: 8px;">
                <h3 style="color: #ffd700; font-size: 14px;">Bạo Vũ Lê Hoa Châm</h3>
                <p style="font-size: 11px; color: #fed7aa; margin: 4px 0 12px;">Xuất kỳ bất ý, bắn độc châm gây sát thương toàn thể phe địch!</p>
                <button class="btn-wuxia-gold" style="width: 160px; height: 36px; font-size: 11px;" onclick="alert('Đã trang bị Ám Khí xuất trận!')">TRANG BỊ ÁM KHÍ</button>
            </div>
        </div>
    </div>

    <!-- ================= MODAL TRUYỀN THƯ / HÒM THƯ ================= -->
    <div id="mail-modal" class="modal-overlay">
        <div class="wuxia-dialog anim-zoom-enter" style="max-width: 440px;">
            <div class="dialog-header-bar">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <img src="/assets/ui/home_authentic/btn_truyenthu.png" style="width: 24px; height: 24px;">
                    <span class="dialog-title">TRUYỀN THƯ GIANG HỒ</span>
                </div>
                <img src="/assets/res/sh_close.png" class="btn-dialog-close" onclick="closeMailModal()" alt="Đóng">
            </div>
            <div class="dialog-body-scroll">
                <div class="spending-tier-item">
                    <div>
                        <b style="color: #ffd700;">[Thư Bồ Câu] Quà Chào Mừng Chưởng Môn</b>
                        <small style="display: block; color: #a8a29e;">Kính gửi chưởng môn món quà khai mở võ lâm!</small>
                    </div>
                    <button class="btn-wuxia-gold" style="width: 75px; height: 28px; font-size: 10px;" onclick="alert('Đã nhận quà thư bồ câu!')">Nhận</button>
                </div>
                <div class="spending-tier-item">
                    <div>
                        <b style="color: #ffd700;">[Thư Bang Hội] Chiến Tích Boss Thần Điêu</b>
                        <small style="display: block; color: #a8a29e;">Thần Điêu xuất thế, toàn server kích sát!</small>
                    </div>
                    <button class="btn-wuxia-gold" style="width: 75px; height: 28px; font-size: 10px;" onclick="alert('Đã nhận!')">Nhận</button>
                </div>
            </div>
        </div>
    </div>

    <!-- ================= MODAL ÂN OÁN GIANG HỒ ================= -->
    <div id="an-oan-modal" class="modal-overlay">
        <div class="wuxia-dialog anim-zoom-enter" style="max-width: 440px;">
            <div class="dialog-header-bar">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <img src="/assets/ui/home_authentic/btn_an_oan.png" style="width: 24px; height: 24px;">
                    <span class="dialog-title">ÂN OÁN & CỪU NHÂN VÕ LÂM</span>
                </div>
                <img src="/assets/res/sh_close.png" class="btn-dialog-close" onclick="closeAnOanModal()" alt="Đóng">
            </div>
            <div class="dialog-body-scroll">
                <p style="font-size: 11px; color: #fed7aa; margin-bottom: 8px;">Ghi chép cừu nhân đã cướp tiêu hoặc khiêu chiến môn phái:</p>
                <div class="spending-tier-item">
                    <div>
                        <b style="color: #f87171;">Phúc Oai Tiêu Cục (Cừu Địch)</b>
                        <small style="display: block; color: #a8a29e;">Đã cướp 35.000 Bạc của chưởng môn hôm nay</small>
                    </div>
                    <button class="btn-wuxia-gold" style="width: 80px; height: 30px; font-size: 10px;" onclick="triggerTestBattle()">Báo Thù</button>
                </div>
            </div>
        </div>
    </div>

    <!-- ================= MODAL TRÒ CHUYỆN (CHAT) ================= -->
    <div id="chat-modal" class="modal-overlay">
        <div class="wuxia-dialog anim-zoom-enter" style="max-width: 440px;">
            <div class="dialog-header-bar">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <img src="/assets/ui/home_authentic/btn_trochuyen.png" style="width: 24px; height: 24px;">
                    <span class="dialog-title">KÊNH CHAT THẾ GIỚI</span>
                </div>
                <img src="/assets/res/sh_close.png" class="btn-dialog-close" onclick="closeChatModal()" alt="Đóng">
            </div>
            <div class="dialog-body-scroll">
                <div style="background: rgba(0,0,0,0.5); padding: 8px; border-radius: 6px; min-height: 140px; margin-bottom: 10px; font-size: 11px;">
                    <div style="color: #ffd700; margin-bottom: 4px;"><b>[Thế Giới] S1.Đạt Ma:</b> Chúc mừng chưởng môn đã xuất thế!</div>
                    <div style="color: #38bdf8; margin-bottom: 4px;"><b>[Liên Minh] Trương Tam Phong:</b> Tối nay 20h58 săn Boss Thần Điêu nhé anh em!</div>
                    <div style="color: #fca5a5; margin-bottom: 4px;"><b>[Cừu Hận] Tây Môn Xuy Tuyết:</b> Ai dám qua Vô Lượng Sơn tỷ thí với ta?</div>
                </div>
                <div style="display: flex; gap: 6px;">
                    <input type="text" placeholder="Nhập tin nhắn võ lâm..." style="flex: 1; padding: 6px 10px; background: #1c1917; border: 1px solid #78350f; color: #fff; border-radius: 4px;">
                    <button class="btn-wuxia-gold" style="width: 70px; height: 34px; font-size: 11px;" onclick="alert('Đã gửi tin nhắn!')">Gửi</button>
                </div>
            </div>
        </div>
    </div>
'''

script_tag = '<script src="/js/game.js?v=10"></script>'
if script_tag in html:
    html = html.replace(script_tag, new_dialogs + '\n    ' + script_tag)
    print("Injected all new modal dialogs successfully!")
else:
    print("Could not find script_tag!")

with open(r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated index.html with new dialogs!")
