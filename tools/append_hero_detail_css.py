css_to_append = """
/* ================= 100% AUTHENTIC THÔNG TIN NHÂN VẬT (TAB DÀN TRẬN) ================= */
.hero-detail-authentic-dialog {
    background: url('/assets/ui/hero_info_authentic/modal_bg_clean.png') no-repeat center center;
    background-size: 100% 100%;
    width: 440px;
    max-width: 96vw;
    height: 720px;
    max-height: 94vh;
    position: relative;
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.95), 0 0 25px rgba(245, 158, 11, 0.35);
    user-select: none;
    box-sizing: border-box;
    overflow: hidden;
}

.hero-detail-close-btn {
    position: absolute;
    top: -8px;
    right: -6px;
    z-index: 20;
    width: 46px;
    height: 46px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    transition: transform 0.15s, filter 0.15s;
    filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.8));
}
.hero-detail-close-btn:hover {
    filter: brightness(1.15) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.9));
    transform: scale(1.05);
}
.hero-detail-close-btn:active {
    transform: scale(0.95);
}
.hero-detail-close-btn img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.hero-detail-top-section {
    display: flex;
    width: 100%;
    height: 380px;
    padding: 18px 14px 4px 14px;
    box-sizing: border-box;
}

.hero-detail-scroll-frame {
    width: 234px;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    flex-shrink: 0;
}
.hero-detail-scroll-frame .scroll-rod-top {
    width: 100%;
    height: 24px;
    object-fit: fill;
    z-index: 4;
}
.hero-detail-scroll-frame .scroll-rod-bottom {
    width: 100%;
    height: 26px;
    object-fit: fill;
    z-index: 4;
}
.hero-detail-scroll-painting {
    flex: 1;
    width: 226px;
    position: relative;
    overflow: hidden;
    background: #ecd0a2;
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);
}
.hero-detail-portrait-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
}
.hero-detail-vert-name {
    position: absolute;
    top: 12px;
    left: 10px;
    font-family: 'Playfair Display', 'Cinzel Decorative', cursive, serif;
    font-size: 15px;
    font-weight: 800;
    color: #1c0800;
    text-shadow: 0 1px 2px rgba(255, 255, 255, 0.7), 0 0 5px rgba(0, 0, 0, 0.5);
    line-height: 1.15;
    max-width: 80px;
    writing-mode: vertical-rl;
    text-orientation: upright;
    letter-spacing: 2px;
    z-index: 3;
}
.hero-detail-badge-kim {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 38px;
    height: 28px;
    z-index: 3;
}
.hero-detail-badge-kim img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.7));
}
.hero-detail-stats-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.92) 0%, rgba(0, 0, 0, 0.7) 80%, transparent 100%);
    padding: 6px 8px 4px 8px;
    z-index: 3;
}
.hero-detail-level-row {
    display: flex;
    align-items: baseline;
    gap: 4px;
    color: #fff;
    font-size: 10.5px;
}
.hero-detail-breakthrough {
    font-size: 11px;
    font-weight: bold;
    color: #fff;
}
.hero-detail-level-num {
    font-size: 14px;
    font-weight: 900;
    color: #fde047;
    text-shadow: 0 0 6px #ca8a04;
}
.hero-detail-exp-text {
    font-size: 9.5px;
    color: #cbd5e1;
    margin-left: auto;
    letter-spacing: -0.2px;
}
.hero-detail-stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2px 8px;
    font-size: 11px;
    font-weight: bold;
    color: #ffffff;
    text-shadow: 1px 1px 2px #000;
    margin-top: 3px;
}
.hero-stat-cell {
    display: flex;
    align-items: center;
    gap: 4px;
    white-space: nowrap;
}
.hero-stat-icon {
    width: 16px;
    height: 16px;
    object-fit: contain;
}

.hero-detail-right-col {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 4px 6px 4px 12px;
    box-sizing: border-box;
    justify-content: space-between;
    overflow: hidden;
}
.hero-detail-bio-box {
    font-family: 'Georgia', serif;
    font-size: 12px;
    line-height: 1.35;
    color: #fde68a;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
    max-height: 160px;
    overflow-y: auto;
    padding-right: 4px;
}
.hero-detail-skill-section {
    margin-top: 6px;
}
.hero-detail-section-title {
    font-size: 13px;
    font-weight: bold;
    color: #fcd34d;
    margin-bottom: 4px;
    text-shadow: 1px 1px 2px #000;
}
.hero-detail-skill-card {
    position: relative;
    width: 64px;
    height: 64px;
    border-radius: 10px;
    border: 2px solid #eab308;
    overflow: hidden;
    cursor: pointer;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.7);
    transition: transform 0.15s, box-shadow 0.15s;
}
.hero-detail-skill-card:hover {
    transform: scale(1.05);
    box-shadow: 0 0 12px #f59e0b;
}
.hero-detail-skill-card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.hero-detail-skill-lvl {
    position: absolute;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.85);
    color: #fde047;
    font-size: 10px;
    font-weight: bold;
    padding: 1px 5px;
    border-top-right-radius: 4px;
    border-top: 1px solid #78350f;
    border-right: 1px solid #78350f;
}
.hero-detail-value-section {
    margin-top: 6px;
}
.hero-detail-value-row {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 15px;
    font-weight: 900;
    color: #fef08a;
    text-shadow: 1px 1px 2px #000;
}
.hero-detail-ingot-icon {
    height: 20px;
    width: auto;
    object-fit: contain;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.6));
}

.hero-detail-action-bar {
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    margin-top: 6px;
    padding: 0 12px;
}
.hero-detail-btn-action {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    height: 56px;
    width: 154px;
    transition: transform 0.15s, filter 0.15s;
}
.hero-detail-btn-action:hover {
    filter: brightness(1.1);
    transform: scale(1.02);
}
.hero-detail-btn-action:active {
    transform: scale(0.96);
}
.hero-detail-btn-action img {
    width: 100%;
    height: 100%;
    object-fit: fill;
}
.hero-detail-center-crest {
    width: 62px;
    height: 62px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}
.hero-detail-center-crest img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: drop-shadow(0 0 8px rgba(245, 158, 11, 0.6));
    animation: crestPulse 3s infinite ease-in-out;
}
@keyframes crestPulse {
    0%, 100% { transform: scale(1); filter: drop-shadow(0 0 6px rgba(245, 158, 11, 0.5)); }
    50% { transform: scale(1.06); filter: drop-shadow(0 0 14px rgba(245, 158, 11, 0.9)); }
}

.hero-detail-bottom-section {
    flex: 1;
    padding: 8px 20px 16px 20px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}
.hero-detail-duyenphan-title {
    font-family: 'Playfair Display', 'Cinzel Decorative', cursive, serif;
    font-size: 18px;
    font-weight: 800;
    color: #180902;
    text-shadow: 0 1px 1px rgba(255, 255, 255, 0.6);
    margin-bottom: 4px;
    letter-spacing: 0.5px;
}
.hero-detail-duyenphan-list {
    flex: 1;
    overflow-y: auto;
    font-size: 12px;
    line-height: 1.45;
    color: #431b03;
    padding-right: 4px;
}
.hero-detail-duyenphan-list::-webkit-scrollbar {
    width: 4px;
}
.hero-detail-duyenphan-list::-webkit-scrollbar-thumb {
    background: #a16207;
    border-radius: 2px;
}
.duyen-item {
    margin-bottom: 3px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
.duyen-item.active-bond {
    color: #321200;
    font-weight: 500;
}
.duyen-item.active-bond b {
    color: #8b0000;
    font-weight: 800;
    text-shadow: 0 0 1px rgba(139, 0, 0, 0.3);
}
.duyen-item.inactive-bond {
    color: #854d0e;
}
.duyen-buff-val {
    color: #b45309;
    font-weight: bold;
}
"""

with open(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\css\style.css", "a", encoding="utf-8") as f:
    f.write(css_to_append)

print("Appended hero detail authentic CSS successfully!")
