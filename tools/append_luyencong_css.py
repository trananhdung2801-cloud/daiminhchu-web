import sys, os
sys.stdout.reconfigure(encoding='utf-8')
os.chdir(r'C:\Users\trananh.dung\Downloads\DaiMinhChu_Server')

css = '''
/* ================= 100% AUTHENTIC LUYỆN CÔNG & LUYỆN ĐIÊU GUI (media_1793068206949_7469be7e.jpg) ================= */
.luyencong-authentic-view {
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;
    overflow: hidden;
}

.lc-ticker-bar {
    width: 100%;
    height: 28px;
    background: #451009 url('/assets/ui/luyencong_authentic/ticker_bar_bg.png') repeat-x center center;
    background-size: auto 100%;
    border-bottom: 1.5px solid #78350f;
    display: flex;
    align-items: center;
    overflow: hidden;
    white-space: nowrap;
    z-index: 10;
    flex-shrink: 0;
}

.lc-ticker-text {
    display: inline-block;
    color: #fef08a;
    font-size: 11.5px;
    font-weight: 700;
    text-shadow: 1px 1px 2px #000;
    padding-left: 100%;
    animation: lc-ticker-scroll 25s linear infinite;
}

@keyframes lc-ticker-scroll {
    0% { transform: translateX(0); }
    100% { transform: translateX(-100%); }
}

.lc-top-icons-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 10px 4px 10px;
    background: rgba(28, 14, 8, 0.75);
    border-bottom: 2px solid #5a3820;
    overflow-x: auto;
    white-space: nowrap;
    z-index: 5;
    flex-shrink: 0;
    scrollbar-width: none;
}

.lc-top-icons-row::-webkit-scrollbar {
    display: none;
}

.lc-icon-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    outline: none;
    flex-shrink: 0;
    transition: transform 0.15s ease;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.lc-icon-btn:hover {
    transform: scale(1.06);
}

.lc-icon-btn.active {
    box-shadow: 0 0 10px #ffd700, 0 0 4px #ff9800;
    border-radius: 12px;
}

.lc-feature-icon {
    width: 66px;
    height: 74px;
    object-fit: contain;
    display: block;
    border-radius: 10px;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
}

#luyencong-view-luyendieu {
    position: relative;
    width: 100%;
    max-width: 498px;
    margin: 0 auto;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
    flex: 1;
    display: flex;
    flex-direction: column;
}

.ld-scene-bg {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
}

.ld-bird-character {
    position: absolute;
    top: 42%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 72px;
    height: 60px;
    z-index: 10;
    pointer-events: none;
    animation: ld-bird-idle 1.2s ease-in-out infinite alternate;
}

.ld-bird-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
}

@keyframes ld-bird-idle {
    0% { transform: translate(-50%, -50%) translateY(0px) rotate(-4deg); }
    100% { transform: translate(-50%, -50%) translateY(-14px) rotate(4deg); }
}

.ld-action-buttons-row {
    position: absolute;
    top: 58%;
    left: 50%;
    transform: translateX(-50%);
    width: 78%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    z-index: 15;
}

.ld-btn-img-wrapper {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    outline: none;
    transition: transform 0.15s ease, filter 0.15s ease;
}

.ld-btn-img-wrapper:hover {
    transform: scale(1.08);
    filter: brightness(1.1);
}

.ld-btn-img-wrapper:active {
    transform: scale(0.96);
}

.ld-action-btn-img {
    width: 110px;
    height: auto;
    display: block;
}

.ld-ground-stats-overlay {
    position: absolute;
    bottom: 4%;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    z-index: 12;
    pointer-events: none;
    white-space: nowrap;
}

.ld-stat-line-1 {
    color: #ffffff;
    font-size: 13.5px;
    font-weight: 700;
    text-shadow: 1px 1px 3px #000, 0 0 5px #000;
    font-family: cursive, sans-serif;
}

.ld-stat-line-2 {
    color: #ffffff;
    font-size: 14px;
    font-weight: 700;
    text-shadow: 1px 1px 3px #000, 0 0 5px #000;
}

.ld-score-highlight {
    color: #38bdf8;
    font-size: 16px;
    font-weight: 900;
    text-shadow: 1px 1px 3px #000, 0 0 6px #0284c7;
}

/* Flappy Bird Interactive HTML5 Canvas Layer */
.ld-game-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 20;
    display: none;
}
'''

with open('public/css/style.css', 'a', encoding='utf-8') as f:
    f.write(css)

print('Appended Luyện Công & Luyện Điêu CSS successfully!')
