import sys, os
sys.stdout.reconfigure(encoding='utf-8')
os.chdir(r'C:\Users\trananh.dung\Downloads\DaiMinhChu_Server')

css = '''
/* ================= 100% AUTHENTIC BẦU CUA TÔM CÁ GUI (media_1793068015082_01406808.jpg) ================= */
#kyngo-view-baucua {
    position: relative;
    width: 100%;
    max-width: 498px;
    margin: 0 auto;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
    flex: 1;
}

.bc-dice-tray {
    position: absolute;
    top: 5.5%;
    left: 11%;
    width: 38%;
    height: 18%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4px;
    z-index: 5;
    pointer-events: none;
}

.bc-dice-tray.rolling {
    animation: bc-dice-shake 0.1s infinite;
}

@keyframes bc-dice-shake {
    0% { transform: translate(0, 0) rotate(0deg); }
    25% { transform: translate(-3px, 2px) rotate(-3deg); }
    50% { transform: translate(3px, -2px) rotate(3deg); }
    75% { transform: translate(-2px, -3px) rotate(-2deg); }
    100% { transform: translate(2px, 3px) rotate(2deg); }
}

.bc-dice-item {
    width: 44px;
    height: 44px;
    background: #a81216;
    border: 2px solid #ffd700;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.7);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}

.bc-dice-face {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.bc-play-hotspot {
    position: absolute;
    top: 16%;
    left: 60%;
    width: 17%;
    height: 10%;
    cursor: pointer;
    z-index: 10;
    border-radius: 20px;
    transition: transform 0.15s ease;
}

.bc-play-hotspot:hover {
    transform: scale(1.1);
}

.bc-play-hotspot:active {
    transform: scale(0.95);
}

.bc-play-glow {
    width: 100%;
    height: 100%;
    border-radius: 20px;
    box-shadow: 0 0 12px rgba(255, 215, 0, 0.6);
    opacity: 0;
    transition: opacity 0.2s ease;
}

.bc-play-hotspot:hover .bc-play-glow {
    opacity: 1;
}

.bc-live-stats {
    position: absolute;
    top: 27%;
    left: 27.5%;
    display: flex;
    flex-direction: column;
    gap: 2px;
    z-index: 5;
    pointer-events: none;
}

.bc-stat-line {
    height: 16px;
    display: flex;
    align-items: center;
}

.bc-val-num {
    color: #ffffff;
    font-size: 13px;
    font-weight: 900;
    text-shadow: 1px 1px 2px #000, 0 0 4px #000;
    letter-spacing: 0.3px;
}

.bc-free-turns-counter {
    position: absolute;
    top: 27.2%;
    left: 58%;
    height: 16px;
    display: flex;
    align-items: center;
    z-index: 5;
    pointer-events: none;
}

.bc-turns-val {
    color: #ffffff;
    font-size: 13px;
    font-weight: 900;
    text-shadow: 1px 1px 2px #000, 0 0 4px #000;
}

.bc-cards-grid {
    position: absolute;
    top: 38.6%;
    left: 10.3%;
    width: 75%;
    height: 39.5%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 8px 12px;
    z-index: 8;
}

.bc-card-spot {
    position: relative;
    cursor: pointer;
    border-radius: 10px;
    transition: transform 0.15s ease;
}

.bc-card-spot:hover {
    transform: scale(1.05);
}

.bc-card-spot:active {
    transform: scale(0.97);
}

.bc-card-highlight {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 10px;
    border: 2px solid transparent;
    transition: border-color 0.2s, box-shadow 0.2s;
    pointer-events: none;
}

.bc-card-spot.winner .bc-card-highlight {
    border-color: #ffd700;
    box-shadow: 0 0 15px #ffd700, inset 0 0 10px #ff9800;
    animation: bc-win-pulse 0.6s infinite alternate;
}

@keyframes bc-win-pulse {
    from { opacity: 0.7; }
    to { opacity: 1; filter: drop-shadow(0 0 8px #ffd700); }
}

.bc-card-chip {
    position: absolute;
    bottom: -6px;
    right: -6px;
    background: linear-gradient(135deg, #ffd700, #b45309);
    color: #000000;
    border: 1.5px solid #ffffff;
    border-radius: 12px;
    font-size: 10.5px;
    font-weight: 900;
    padding: 1px 6px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.8);
    z-index: 10;
    pointer-events: none;
}

.bc-bottom-controls-bar {
    position: absolute;
    top: 85%;
    left: 5%;
    width: 90%;
    height: 11%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 10;
}

.bc-chips-row {
    display: flex;
    gap: 6px;
    align-items: center;
}

.bc-chip-btn {
    background: radial-gradient(circle, #fde047 20%, #ca8a04 80%, #713f12 100%);
    border: 1.5px solid #ffffff;
    border-radius: 50%;
    width: 34px;
    height: 34px;
    color: #1c1917;
    font-size: 11px;
    font-weight: 900;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.7);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
}

.bc-chip-btn.active {
    box-shadow: 0 0 10px #ffd700, 0 0 4px #ffffff;
    transform: scale(1.12);
    border-color: #facc15;
}

.bc-chip-btn.clear {
    background: radial-gradient(circle, #ef4444 20%, #991b1b 80%, #450a0a 100%);
    color: #ffffff;
    border-radius: 12px;
    width: 44px;
    height: 28px;
    font-size: 11px;
}

.bc-footer-hotspots {
    display: flex;
    gap: 8px;
    align-items: center;
}

.bc-btn-hotspot {
    cursor: pointer;
    border-radius: 6px;
    transition: transform 0.15s ease;
}

.bc-btn-hotspot:hover {
    transform: scale(1.08);
}

.bc-hotspot-rank {
    width: 78px;
    height: 36px;
}

.bc-hotspot-history {
    width: 59px;
    height: 40px;
}
'''

with open('public/css/style.css', 'a', encoding='utf-8') as f:
    f.write(css)

print('Appended Bầu Cua CSS successfully!')
