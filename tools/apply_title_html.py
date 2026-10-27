with open('public/index.html', 'r', encoding='utf-8') as f:
    c = f.read()

start_marker = '<!-- ================= SCREEN 1: AUTHENTIC LOGIN & REGISTER ================= -->'
end_marker = '<!-- ================= SCREEN 2: STARTER SHOWCASE (NO OVERFLOW) ================= -->'

idx1 = c.find(start_marker)
idx2 = c.find(end_marker)

new_screen1 = '''<!-- ================= SCREEN 1: AUTHENTIC TITLE & LOGIN SCREEN ================= -->
        <div id="screen-login" class="screen active">
            <!-- Panel 1: Authentic Title Screen with "BẮT ĐẦU" (media_1793066664538_b0d165c2.jpg) -->
            <div id="title-start-panel" class="screen-title-container" style="display: none;">
                <div class="title-top-welcome-badge" id="title-welcome-user">Chưởng môn: MinhChu | S1 - Đào Hoa Đảo</div>
                
                <div class="title-batdau-wrapper" onclick="doStartGameFromTitle()" title="Bắt đầu bước vào chốn giang hồ">
                    <img src="/assets/ui/title_authentic/btn_batdau.png" class="title-batdau-img" alt="Bắt đầu"/>
                </div>
                
                <div class="title-version-text">Phiên bản 8.0.2</div>
                
                <button class="title-switch-acc-link" onclick="showAuthFormFromTitle()">[ Đổi tài khoản ]</button>
            </div>

            <!-- Panel 2: Login & Register Form (First Time or When Switching Accounts) -->
            <div id="title-auth-panel" class="login-screen-bg" style="display: none;">
                <div class="login-brand-header anim-pop-in">
                    <img class="login-app-icon" src="/assets/res/app_icon.png" alt="Đại Minh Chủ Icon">
                    <div class="login-brand-meta">
                        <span class="game-version">Phiên Bản 8.0.2</span>
                        <span class="game-server">Máy Chủ: S1 - Đào Hoa Đảo</span>
                    </div>
                </div>

                <img class="login-dragon-logo" src="/assets/ui/login_06.png" alt="Đại Minh Chủ Logo">
                
                <div class="login-card-panel anim-zoom-enter">
                    <!-- Auth Switch Tabs -->
                    <div class="auth-tabs-row">
                        <button id="tab-btn-login" class="auth-tab-btn active" onclick="switchAuthTab('login')">ĐĂNG NHẬP</button>
                        <button id="tab-btn-register" class="auth-tab-btn" onclick="switchAuthTab('register')">ĐĂNG KÝ MỚI</button>
                    </div>

                    <!-- 1. Form Đăng Nhập -->
                    <div id="form-login-wrap" class="auth-form-wrap">
                        <div class="login-input-wrap">
                            <span class="input-icon">👤</span>
                            <input type="text" id="login-username" class="login-input" placeholder="Tên tài khoản..." value="MinhChu" autocomplete="username">
                        </div>
                        <div class="login-input-wrap">
                            <span class="input-icon">🔒</span>
                            <input type="password" id="login-password" class="login-input" placeholder="Mật khẩu..." value="123456" autocomplete="current-password">
                        </div>
                        <button class="btn-login-game" onclick="doLogin()">VÀO GAME NGAY</button>
                    </div>

                    <!-- 2. Form Đăng Ký Tài Khoản Mới -->
                    <div id="form-register-wrap" class="auth-form-wrap" style="display: none;">
                        <div class="login-input-wrap">
                            <span class="input-icon">👤</span>
                            <input type="text" id="reg-username" class="login-input" placeholder="Tên tài khoản mới (>=3 ký tự)..." autocomplete="username">
                        </div>
                        <div class="login-input-wrap">
                            <span class="input-icon">🔒</span>
                            <input type="password" id="reg-password" class="login-input" placeholder="Mật khẩu bảo mật (>=4 ký tự)..." autocomplete="new-password">
                        </div>
                        <div class="reg-starter-picker">
                            <div class="reg-picker-title">Chọn Đại Hiệp Khởi Đầu:</div>
                            <div class="reg-starters-grid">
                                <label class="reg-starter-opt">
                                    <input type="radio" name="reg-starter" value="NV_LenhHoXung" checked>
                                    <span>Lệnh Hồ Xung</span>
                                </label>
                                <label class="reg-starter-opt">
                                    <input type="radio" name="reg-starter" value="NV_QuachTinh">
                                    <span>Quách Tĩnh</span>
                                </label>
                                <label class="reg-starter-opt">
                                    <input type="radio" name="reg-starter" value="NV_DuongQua">
                                    <span>Dương Quá</span>
                                </label>
                                <label class="reg-starter-opt">
                                    <input type="radio" name="reg-starter" value="NV_TruongVoKy">
                                    <span>Trương Vô Kỵ</span>
                                </label>
                            </div>
                        </div>
                        <button class="btn-login-game reg" onclick="doRegister()">TẠO TÀI KHOẢN & VÀO GAME</button>
                    </div>

                    <div id="auth-error-msg" class="auth-error-msg"></div>

                    <!-- Setting & Admin PIN link on login screen -->
                    <div class="login-settings-link" onclick="openSettingsModal()">
                        <span>⚙️ Cài Đặt / Quản Trị GM</span>
                    </div>
                </div>

                <div class="login-footer">
                    <div class="footer-client-info" style="color: #a8a29e; font-size: 11px;">Đại Minh Chủ Mobile - Phiên Bản 8.0.2 Kiếm Thần</div>
                </div>
            </div>
        </div>

        '''

if idx1 != -1 and idx2 != -1:
    c = c[:idx1] + new_screen1 + c[idx2:]
    with open('public/index.html', 'w', encoding='utf-8') as f:
        f.write(c)
    print('Updated public/index.html successfully!')
else:
    print('Markers not found:', idx1, idx2)
