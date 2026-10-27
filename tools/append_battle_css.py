import sys, os
sys.stdout.reconfigure(encoding='utf-8')
os.chdir(r'C:\Users\trananh.dung\Downloads\DaiMinhChu_Server')

css = '''
/* ================= 100% AUTHENTIC 8V8 BATTLE ARENA & BUFF ACTIVATION (media_1793068311069_68fd0f94.jpg) ================= */
.battle-overlay-authentic {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100dvh;
    z-index: 9999;
    background: #000;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
}

.battle-bg-art {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 540px;
    height: 100%;
    object-fit: cover;
    z-index: 1;
}

.battle-top-controls {
    position: absolute;
    top: 10px;
    right: max(10px, calc(50% - 250px));
    display: flex;
    align-items: center;
    gap: 10px;
    z-index: 30;
}

.battle-speed-btn {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: radial-gradient(circle, #78350f, #3a1505);
    border: 2px solid #ca8a04;
    color: #fef08a;
    font-size: 14px;
    font-weight: 900;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.8), inset 0 0 5px rgba(255, 215, 0, 0.4);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.15s ease;
}

.battle-speed-btn:hover {
    transform: scale(1.1);
}

.battle-skip-btn {
    background: linear-gradient(180deg, #b91c1c, #7f1d1d);
    border: 1px solid #f87171;
    color: #ffffff;
    font-size: 11px;
    font-weight: bold;
    padding: 4px 10px;
    border-radius: 4px;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
}

.battle-8v8-stage {
    position: relative;
    width: 100%;
    max-width: 540px;
    height: calc(100% - 70px);
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    padding: 10px 8px 30px 8px;
    z-index: 10;
    box-sizing: border-box;
}

.battle-duel-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 11.5%;
    position: relative;
}

.battle-hero-cell {
    display: flex;
    align-items: center;
    width: 48%;
    position: relative;
    transition: transform 0.2s ease, filter 0.2s ease;
}

.battle-hero-cell.hero-left {
    justify-content: flex-end;
    gap: 6px;
    text-align: right;
}

.battle-hero-cell.hero-right {
    justify-content: flex-start;
    gap: 6px;
    text-align: left;
}

.hero-text-block {
    display: flex;
    flex-direction: column;
    gap: 1px;
    white-space: nowrap;
}

.hero-name-label {
    color: #1e0b02;
    font-size: 12.5px;
    font-weight: 900;
    text-shadow: 0 0 2px #fff, 0 0 4px #fff;
    font-family: serif;
}

.hero-hp-wrapper {
    display: flex;
    align-items: center;
    gap: 3px;
    font-size: 12px;
    font-weight: 800;
    color: #450a0a;
    text-shadow: 0 0 2px #fff;
}

.hero-left .hero-hp-wrapper {
    justify-content: flex-end;
}

.hero-right .hero-hp-wrapper {
    justify-content: flex-start;
}

.hero-blood-icon {
    width: 15px;
    height: 15px;
    object-fit: contain;
}

.hero-avatar-wrap {
    position: relative;
    width: 46px;
    height: 46px;
    border-radius: 8px;
    border: 1.5px solid #ca8a04;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.7);
    overflow: hidden;
    background: #1c0f0a;
    flex-shrink: 0;
}

.hero-avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.battle-hero-cell.defeated .hero-avatar-wrap {
    filter: grayscale(100%) brightness(0.6);
}

.battle-hero-cell.defeated::after {
    content: "TỬ";
    position: absolute;
    color: #ef4444;
    font-size: 20px;
    font-weight: 900;
    text-shadow: 0 0 4px #000;
}

/* Floating Buffs Banner */
.hero-buff-float {
    position: absolute;
    top: -10px;
    z-index: 25;
    pointer-events: none;
    white-space: nowrap;
    opacity: 0;
    transform: translateY(8px);
    transition: opacity 0.35s ease, transform 0.35s ease;
}

.hero-left .hero-buff-float {
    right: 48px;
    text-align: right;
}

.hero-right .hero-buff-float {
    left: 48px;
    text-align: left;
}

.hero-buff-float.active {
    opacity: 1;
    transform: translateY(-8px);
}

.buff-name-line {
    font-size: 13px;
    font-weight: 900;
    letter-spacing: 0.3px;
    text-shadow: 1px 1px 2px #000, 0 0 6px currentColor;
}

.buff-name-cyan { color: #38bdf8; }
.buff-name-gold { color: #facc15; }
.buff-name-pink { color: #f472b6; }
.buff-name-green { color: #4ade80; }
.buff-name-purple { color: #c084fc; }

.buff-stat-line {
    font-size: 11px;
    font-weight: 700;
    color: #fef08a;
    text-shadow: 1px 1px 2px #000;
}

/* Attacking and Striking Highlights */
.battle-hero-cell.attacking {
    transform: scale(1.18);
    z-index: 20;
    filter: drop-shadow(0 0 12px #ffd700);
}

.battle-hero-cell.hit {
    animation: hero-hit-shake 0.25s ease-in-out;
    filter: brightness(1.6) sepia(1) hue-rotate(-50deg);
}

@keyframes hero-hit-shake {
    0% { transform: translate(0, 0); }
    25% { transform: translate(-6px, 4px); }
    50% { transform: translate(6px, -4px); }
    75% { transform: translate(-4px, -2px); }
    100% { transform: translate(0, 0); }
}

/* Bottom Khí Thế Bar */
.battle-khithe-bar {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 540px;
    height: 52px;
    background: linear-gradient(180deg, rgba(20, 10, 5, 0.4), rgba(15, 6, 2, 0.85));
    border-top: 1.5px solid #854d0e;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 12px;
    z-index: 25;
    box-sizing: border-box;
}

.khithe-team-box {
    display: flex;
    flex-direction: column;
    gap: 1px;
}

.khithe-header-row {
    display: flex;
    align-items: center;
    gap: 6px;
}

.khithe-calligraphy-img {
    height: 24px;
    width: auto;
    object-fit: contain;
    filter: drop-shadow(0 1px 3px #000);
}

.khithe-calligraphy-img.flip {
    transform: scaleX(-1);
}

.khithe-energy-pips {
    color: #ef4444;
    font-weight: 900;
    letter-spacing: 2px;
    font-size: 15px;
    text-shadow: 0 0 4px #dc2626;
}

.khithe-energy-pips.enemy {
    color: #f87171;
    letter-spacing: 3px;
}

.khithe-player-name {
    color: #fef08a;
    font-size: 12px;
    font-weight: bold;
    text-shadow: 1px 1px 2px #000;
    font-family: serif;
}

.khithe-team-box.right {
    text-align: right;
}

.battle-fx-stage {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 22;
}

/* Flying Damage Number */
.battle-floating-dmg {
    position: absolute;
    font-size: 22px;
    font-weight: 900;
    color: #ef4444;
    text-shadow: 2px 2px 0 #000, 0 0 8px #ffd700;
    animation: float-up-fade 0.8s ease-out forwards;
    z-index: 30;
}

@keyframes float-up-fade {
    0% { transform: translateY(0) scale(0.6); opacity: 0; }
    30% { transform: translateY(-16px) scale(1.3); opacity: 1; }
    100% { transform: translateY(-40px) scale(1); opacity: 0; }
}
'''

with open('public/css/style.css', 'a', encoding='utf-8') as f:
    f.write(css)

print('Appended battle CSS successfully!')
