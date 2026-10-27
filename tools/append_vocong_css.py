css_vocong = """
/* ================= 100% AUTHENTIC THÔNG TIN VÕ CÔNG (TAB DÀN TRẬN) ================= */
.vocong-authentic-dialog {
    background: url('/assets/ui/vocong_info_authentic/vocong_modal_bg_clean.png') no-repeat center center;
    background-size: 100% 100%;
    width: 440px;
    max-width: 96vw;
    height: 640px;
    max-height: 92vh;
    position: relative;
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.95), 0 0 25px rgba(245, 158, 11, 0.35);
    user-select: none;
    box-sizing: border-box;
    overflow: hidden;
}

.vocong-header-bar {
    height: 48px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 4px;
}
.vocong-header-title {
    font-family: 'Playfair Display', 'Cinzel Decorative', cursive, serif;
    font-size: 21px;
    font-weight: 800;
    color: #fff;
    text-shadow: 0 2px 4px rgba(0,0,0,0.9), 0 0 10px rgba(245,158,11,0.6);
    letter-spacing: 1px;
}

.vocong-close-btn {
    position: absolute;
    top: 6px;
    right: 8px;
    z-index: 20;
    width: 44px;
    height: 44px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    transition: transform 0.15s, filter 0.15s;
    filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.8));
}
.vocong-close-btn:hover {
    filter: brightness(1.15) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.9));
    transform: scale(1.05);
}
.vocong-close-btn:active {
    transform: scale(0.95);
}
.vocong-close-btn img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.vocong-main-body {
    display: flex;
    width: 100%;
    height: 440px;
    padding: 8px 14px 4px 14px;
    box-sizing: border-box;
}

.vocong-scroll-frame {
    width: 236px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
}
.vocong-scroll-wrapper {
    position: relative;
    width: 228px;
    height: 390px;
}
.vocong-scroll-bg {
    width: 100%;
    height: 100%;
    object-fit: fill;
}
.vocong-vert-title {
    position: absolute;
    top: 32px;
    left: 16px;
    font-family: 'Playfair Display', cursive, serif;
    font-size: 16px;
    font-weight: 900;
    color: #1a0800;
    text-shadow: 0 1px 2px rgba(255,255,255,0.7), 0 0 5px rgba(0,0,0,0.4);
    line-height: 1.15;
    max-width: 60px;
    writing-mode: vertical-rl;
    text-orientation: upright;
    letter-spacing: 2px;
    z-index: 3;
}
.vocong-badge-kim {
    position: absolute;
    top: 28px;
    right: 16px;
    width: 36px;
    height: 26px;
    z-index: 3;
}
.vocong-badge-kim img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.6));
}
.vocong-art-box {
    position: absolute;
    top: 88px;
    left: 40px;
    width: 148px;
    height: 148px;
    border: 2px solid #b45309;
    box-shadow: inset 0 0 8px rgba(0,0,0,0.5), 0 3px 8px rgba(0,0,0,0.4);
    background: #000;
    overflow: hidden;
}
.vocong-art-box img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.vocong-ink-lvl-badge {
    position: absolute;
    bottom: 84px;
    left: 24px;
    width: 56px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 4;
}
.ink-splash-bg {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: contain;
}
.ink-lvl-text {
    position: relative;
    font-family: 'Segoe UI', Arial, sans-serif;
    font-size: 15px;
    font-weight: 900;
    color: #fff;
    z-index: 2;
    text-shadow: 0 0 4px #000;
}
.vocong-scroll-stats-row {
    position: absolute;
    bottom: 36px;
    left: 16px;
    right: 16px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    font-size: 13px;
    font-weight: 900;
    color: #1c0800;
    text-shadow: 0 1px 1px rgba(255,255,255,0.6);
}
.vc-stat-item {
    display: flex;
    align-items: center;
    gap: 4px;
}
.vc-stat-ico {
    width: 18px;
    height: 18px;
    object-fit: contain;
}

.vocong-right-col {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 18px 8px 12px 14px;
    box-sizing: border-box;
    justify-content: space-between;
    overflow: hidden;
}
.vocong-desc-box {
    font-family: 'Georgia', serif;
    font-size: 13.5px;
    line-height: 1.45;
    color: #fde68a;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.9);
    max-height: 280px;
    overflow-y: auto;
    padding-right: 4px;
}
.highlight-stat {
    color: #4ade80;
    font-weight: 800;
}
.vocong-share-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    width: 110px;
    height: 48px;
    align-self: flex-start;
    transition: transform 0.15s, filter 0.15s;
    margin-top: 10px;
}
.vocong-share-btn:hover {
    filter: brightness(1.15);
    transform: scale(1.04);
}
.vocong-share-btn img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.vocong-bottom-actions {
    height: 90px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 36px 14px 36px;
    box-sizing: border-box;
}
.vocong-btn-action {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    height: 64px;
    width: 140px;
    transition: transform 0.15s, filter 0.15s;
}
.vocong-btn-action:hover {
    filter: brightness(1.12);
    transform: scale(1.03);
}
.vocong-btn-action:active {
    transform: scale(0.96);
}
.vocong-btn-action img {
    width: 100%;
    height: 100%;
    object-fit: fill;
}
"""

with open(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\css\style.css", "a", encoding="utf-8") as f:
    f.write(css_vocong)

print("Appended authentic Vo Cong Info CSS successfully!")
