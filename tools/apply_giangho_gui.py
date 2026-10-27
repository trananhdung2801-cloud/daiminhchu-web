import sys
sys.stdout.reconfigure(encoding='utf-8')

# 1. Update public/index.html
with open('public/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

start_gh = '<div id="tab-giangho" class="tab-view"'
end_gh = '<!-- Tab 4: Luyện Công'

p1 = html.find(start_gh)
p2 = html.find(end_gh)

if p1 != -1 and p2 != -1:
    new_gh_html = '''<div id="tab-giangho" class="tab-view giangho-authentic-view" style="display: none;">
                    <!-- 1. Chapter Horizontal Paper Scroll Selector (Matching Original Game) -->
                    <div class="gh-scroll-wrapper">
                        <img src="/assets/ui/giangho_authentic/scroll_roller_l.png" class="gh-scroll-roller-left" alt="Roller">
                        <div class="gh-chapter-scroll-track" id="gh-chapter-track"></div>
                        <img src="/assets/ui/giangho_authentic/scroll_roller_r.png" class="gh-scroll-roller-right" alt="Roller">
                    </div>

                    <!-- 2. Chapter Story Lore Box (Authentic Parchment Frame) -->
                    <div class="gh-story-box-wrapper">
                        <p id="gh-chapter-story" class="gh-chapter-story-text">
                            Đang tải cốt truyện giang hồ...
                        </p>
                    </div>

                    <!-- 3. Missions Planks List (Authentic Wooden Planks & Carved Bronze 'Đánh' Buttons) -->
                    <div id="gh-mission-list" class="gh-mission-planks-container"></div>
                </div>

                '''
    html = html[:p1] + new_gh_html + html[p2:]
    with open('public/index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print('Updated public/index.html successfully!')
else:
    print('Error: Could not find tab-giangho in index.html', p1, p2)

# 2. Update public/css/style.css
with open('public/css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

gh_css = '''
/* ================= AUTHENTIC GIANG HỒ GUI (MATCHING ORIGINAL SCREENSHOT) ================= */
.giangho-authentic-view {
    padding: 10px 8px 16px 8px !important;
    background: #1c0e08 url('/assets/ui/Background.png') no-repeat center top;
    background-size: cover;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    box-sizing: border-box;
}

/* 1. Paper Scroll Banner with Rollers */
.gh-scroll-wrapper {
    position: relative;
    width: 100%;
    height: 72px;
    background: #f7eed7 url('/assets/ui/giangho_authentic/scroll_banner_clean.png') no-repeat center center;
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    overflow: hidden;
    flex-shrink: 0;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.6);
}

.gh-scroll-roller-left {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 20px;
    object-fit: fill;
    z-index: 10;
    pointer-events: none;
}

.gh-scroll-roller-right {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    width: 20px;
    object-fit: fill;
    z-index: 10;
    pointer-events: none;
}

.gh-chapter-scroll-track {
    display: flex;
    align-items: center;
    gap: 8px;
    overflow-x: auto;
    overflow-y: hidden;
    width: 100%;
    height: 100%;
    padding: 0 24px;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
}

.gh-chapter-scroll-track::-webkit-scrollbar {
    display: none;
}

.gh-plaque-btn {
    width: 145px;
    height: 48px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    cursor: pointer;
    font-weight: 900;
    font-size: 11px;
    line-height: 1.2;
    padding: 2px 8px;
    scroll-snap-align: center;
    user-select: none;
    transition: transform 0.12s ease, filter 0.15s ease;
    border-radius: 4px;
    font-family: 'Times New Roman', serif;
}

.gh-plaque-btn.active {
    background: url('/assets/ui/giangho_authentic/plaque_active_clean.png') no-repeat center center;
    background-size: 100% 100%;
    color: #ffd700;
    text-shadow: 0 0 6px rgba(255, 215, 0, 0.8), 1px 1px 2px #000;
    box-shadow: 0 0 10px rgba(217, 119, 6, 0.7);
    transform: scale(1.04);
}

.gh-plaque-btn.inactive {
    background: url('/assets/ui/giangho_authentic/plaque_inactive_clean.png') no-repeat center center;
    background-size: 100% 100%;
    color: #e2e8f0;
    text-shadow: 1px 1px 2px #000;
    opacity: 0.85;
}

.gh-plaque-btn.locked {
    background: url('/assets/ui/giangho_authentic/plaque_inactive_clean.png') no-repeat center center;
    background-size: 100% 100%;
    color: #94a3b8;
    opacity: 0.45;
    filter: grayscale(80%);
    cursor: not-allowed;
}

/* 2. Story Lore Parchment Box */
.gh-story-box-wrapper {
    position: relative;
    width: 100%;
    min-height: 85px;
    padding: 12px 16px;
    background: url('/assets/ui/giangho_authentic/story_box_clean.png') no-repeat center center;
    background-size: 100% 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
    flex-shrink: 0;
}

.gh-chapter-story-text {
    color: #edd9b5;
    font-size: 12px;
    line-height: 1.5;
    text-shadow: 1px 1px 2px #000;
    font-style: normal;
    margin: 0;
    font-family: sans-serif;
}

/* 3. Mission Planks List */
.gh-mission-planks-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
}

.gh-mission-plank {
    width: 100%;
    height: 76px;
    background: url('/assets/ui/giangho_authentic/mission_plank_clean.png') no-repeat center center;
    background-size: 100% 100%;
    border-radius: 6px;
    display: flex;
    align-items: center;
    padding: 4px 10px;
    box-sizing: border-box;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.45);
    position: relative;
    transition: transform 0.12s ease;
}

.gh-mission-plank:hover {
    transform: translateY(-1px);
}

.gh-mission-avatar-box {
    width: 58px;
    height: 60px;
    border: 2px solid #b45309;
    border-radius: 6px;
    overflow: hidden;
    background: #1e110a;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.9);
}

.gh-mission-avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.gh-mission-info {
    flex: 1;
    padding: 0 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
}

.gh-mission-title {
    font-size: 13.5px;
    font-weight: 900;
    color: #220f04;
    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.4);
    margin: 0 0 2px 0;
    font-family: 'Times New Roman', serif;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.gh-mission-reward {
    font-size: 10px;
    color: #78350f;
    font-weight: bold;
    margin: 0;
}

.gh-btn-danh {
    width: 90px;
    height: 56px;
    background: url('/assets/ui/giangho_authentic/btn_danh_clean.png') no-repeat center center;
    background-size: 100% 100%;
    border: none;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    padding-bottom: 2px;
    user-select: none;
    transition: transform 0.1s ease;
}

.gh-btn-danh:active {
    transform: scale(0.94);
}

.gh-btn-danh.locked {
    filter: grayscale(85%) opacity(0.55);
    cursor: not-allowed;
    pointer-events: none;
}

.gh-stars-row {
    display: flex;
    gap: 3px;
    align-items: center;
    height: 14px;
    margin-bottom: 2px;
}

.gh-star-img {
    width: 12px;
    height: 12px;
    object-fit: contain;
}

.gh-btn-danh-text {
    color: #ffedd5;
    font-size: 13px;
    font-weight: 900;
    text-shadow: 1px 1px 3px #000, 0 0 5px #b45309;
    font-family: 'Times New Roman', serif;
    letter-spacing: 0.5px;
}
'''

if '.giangho-authentic-view' not in css:
    css += '\n' + gh_css
    print('Appended Giang Ho authentic CSS!')
else:
    # Replace previous
    pos = css.find('/* ================= AUTHENTIC GIANG HỒ GUI')
    if pos != -1:
        css = css[:pos] + gh_css
        print('Updated Giang Ho authentic CSS!')

with open('public/css/style.css', 'w', encoding='utf-8') as f:
    f.write(css)

print('Updated public/css/style.css successfully!')
