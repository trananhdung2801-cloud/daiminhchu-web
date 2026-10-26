import sys
sys.stdout.reconfigure(encoding='utf-8')

# Let's inspect the exact dimensions and styling needed for #tab-home
css_home = '''
/* ================= 100% AUTHENTIC HOME SCREEN (TRANG CHỦ) ================= */
.home-authentic-container {
    display: flex;
    flex-direction: column;
    min-height: 100%;
    background: url('/assets/ui/home_authentic/main_game_full_bg.png') no-repeat center top;
    background-size: cover;
    position: relative;
    padding-bottom: 70px;
    box-sizing: border-box;
}

/* 1. Disciple Cloud Stage */
.home-cloud-stage {
    position: relative;
    width: 100%;
    height: 180px;
    background: url('/assets/ui/home_authentic/disciple_cloud_backdrop.png') no-repeat center top;
    background-size: 100% 100%;
    overflow: hidden;
    display: flex;
    align-items: flex-end;
    justify-content: center;
}

.home-cloud-disciples-row {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    width: 100%;
    height: 100%;
    position: relative;
}

.home-cloud-disciple-item {
    position: relative;
    cursor: pointer;
    transition: transform 0.2s ease;
    margin: 0 -8px;
    filter: drop-shadow(0 4px 6px rgba(0,0,0,0.5));
}

.home-cloud-disciple-item:hover {
    transform: scale(1.06) translateY(-4px);
    z-index: 10;
}

.home-cloud-disciple-item img {
    height: 140px;
    object-fit: contain;
}

/* 2. Six Carved Wooden Buttons (2x3) */
.home-core-features-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px 10px;
    padding: 12px 16px 8px;
    width: 100%;
    max-width: 460px;
    margin: 0 auto;
    box-sizing: border-box;
}

.home-wood-btn {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: transform 0.15s ease, filter 0.15s ease;
    display: flex;
    justify-content: center;
    align-items: center;
}

.home-wood-btn:hover {
    transform: scale(1.04);
    filter: brightness(1.15);
}

.home-wood-btn:active {
    transform: scale(0.96);
}

.home-wood-btn img {
    width: 100%;
    max-width: 140px;
    height: auto;
    display: block;
}

/* 3. Six Activity Big Icons (2x3) */
.home-activities-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 6px 8px;
    padding: 6px 16px;
    width: 100%;
    max-width: 460px;
    margin: 0 auto;
    align-items: center;
    box-sizing: border-box;
}

.home-activity-btn {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: transform 0.15s ease;
    display: flex;
    justify-content: center;
    align-items: center;
}

.home-activity-btn:hover {
    transform: scale(1.06);
    filter: brightness(1.2);
}

.home-activity-btn:active {
    transform: scale(0.95);
}

.home-activity-btn img {
    width: 100%;
    max-width: 130px;
    height: auto;
    display: block;
    object-fit: contain;
}

/* 4. Six Utility Square Buttons (1x6) */
.home-utilities-bar {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 10px 12px;
    width: 100%;
    max-width: 460px;
    margin: 8px auto 0;
    box-sizing: border-box;
}

.home-util-btn {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: transform 0.15s ease;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
}

.home-util-btn:hover {
    transform: scale(1.1);
    filter: brightness(1.2);
}

.home-util-btn:active {
    transform: scale(0.92);
}

.home-util-btn img {
    width: 90%;
    max-width: 60px;
    height: auto;
    display: block;
    object-fit: contain;
}

/* 5. Authentic Top Header Styling */
.header-profile-authentic {
    width: 100%;
    height: 75px;
    background: url('/assets/ui/home_authentic/header_profile_bg_clean.png') no-repeat center center;
    background-size: 100% 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 10px;
    box-sizing: border-box;
    position: relative;
    z-index: 100;
}

.header-left-col {
    display: flex;
    align-items: center;
    gap: 6px;
    flex: 1;
}

.level-wheel-box {
    position: relative;
    width: 48px;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: url('/assets/ui/home_authentic/level_wheel_badge_empty.png') no-repeat center center;
    background-size: contain;
    flex-shrink: 0;
}

.level-wheel-text {
    color: #fde047;
    font-size: 14px;
    font-weight: 900;
    text-shadow: 1px 1px 2px #000;
    line-height: 1;
}

.header-name-exp-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.header-player-wuxia-name {
    color: #fef08a;
    font-size: 13px;
    font-weight: bold;
    text-shadow: 1px 1px 3px #000, 0 0 6px #b45309;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 130px;
}

.header-exp-curved-bar {
    position: relative;
    width: 110px;
    height: 14px;
    background: #451a03;
    border-radius: 7px;
    border: 1px solid #78350f;
    overflow: hidden;
    margin-top: 2px;
}

.header-exp-fill-curved {
    background: linear-gradient(90deg, #ea580c, #f59e0b);
    height: 100%;
    width: 45%;
    transition: width 0.3s ease;
}

.header-exp-num-text {
    position: absolute;
    width: 100%;
    left: 0;
    top: 0;
    font-size: 8px;
    line-height: 14px;
    text-align: center;
    color: #fff;
    font-weight: bold;
    text-shadow: 1px 1px 1px #000;
}

.header-right-col {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex-shrink: 0;
    font-size: 11px;
    color: #fff;
    text-shadow: 1px 1px 2px #000;
}

.header-stat-row {
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: flex-end;
}

.header-stat-cell {
    display: flex;
    align-items: center;
    gap: 3px;
    font-weight: bold;
}

/* 6. Authentic Bottom Navigation Bar (8 Tabs) */
.bottom-nav-bar-authentic {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 500px;
    height: 60px;
    background: url('/assets/ui/home_authentic/bottom_nav_bar_authentic.png') no-repeat center bottom;
    background-size: 100% 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 4px env(safe-area-inset-bottom);
    z-index: 1000;
    box-sizing: border-box;
}

.bottom-tab-auth-btn {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: transform 0.15s ease, filter 0.15s ease;
}

.bottom-tab-auth-btn img {
    height: 48px;
    width: auto;
    object-fit: contain;
}

.bottom-tab-auth-btn.active img {
    filter: drop-shadow(0 0 6px #f59e0b) brightness(1.25);
    transform: translateY(-2px);
}

.bottom-tab-auth-btn:hover {
    transform: translateY(-2px);
}
'''

print('CSS draft completed!')
