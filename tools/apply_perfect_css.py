import sys
sys.stdout.reconfigure(encoding='utf-8')

new_css = '''
/* ================= 100% PERFECT SEAMLESS HOME SCREEN ================= */
.header-profile-authentic-perfect {
    position: relative;
    width: 100%;
    aspect-ratio: 576 / 81;
    background: url('/assets/ui/home_authentic/header_profile_perfect.png') no-repeat center center;
    background-size: 100% 100%;
    flex-shrink: 0;
    overflow: hidden;
}

.hdr-perf-level {
    position: absolute;
    left: 6.8%;
    top: 54%;
    transform: translate(-50%, -50%);
    color: #fde047;
    font-size: 13px;
    font-weight: 900;
    text-shadow: 1px 1px 2px #000;
    line-height: 1;
}

.hdr-perf-name {
    position: absolute;
    left: 13.5%;
    top: 14%;
    color: #fef08a;
    font-size: 13px;
    font-weight: bold;
    text-shadow: 1px 1px 3px #000, 0 0 5px #b45309;
    max-width: 32%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.hdr-perf-exp-wrap {
    position: absolute;
    left: 13.5%;
    top: 52%;
    width: 29.5%;
    height: 18px;
    background: #451a03;
    border-radius: 9px;
    border: 1px solid #78350f;
    overflow: hidden;
}

.hdr-perf-exp-fill {
    background: linear-gradient(90deg, #ea580c, #f59e0b);
    height: 100%;
    width: 45%;
    transition: width 0.3s ease;
}

.hdr-perf-exp-text {
    position: absolute;
    width: 100%;
    left: 0;
    top: 0;
    font-size: 8px;
    line-height: 18px;
    text-align: center;
    color: #fff;
    font-weight: bold;
    text-shadow: 1px 1px 1px #000;
}

.hdr-perf-vip {
    position: absolute;
    left: 48%;
    top: 14%;
    color: #fde047;
    font-size: 12px;
    font-weight: 900;
    text-shadow: 1px 1px 2px #000;
}

.hdr-perf-knb {
    position: absolute;
    left: 65%;
    top: 14%;
    color: #fde047;
    font-size: 11px;
    font-weight: bold;
    text-shadow: 1px 1px 2px #000;
}

.hdr-perf-stamina {
    position: absolute;
    left: 88%;
    top: 14%;
    color: #fca5a5;
    font-size: 11px;
    font-weight: bold;
    text-shadow: 1px 1px 2px #000;
}

.hdr-perf-bac {
    position: absolute;
    left: 65%;
    top: 56%;
    color: #e2e8f0;
    font-size: 10px;
    font-weight: bold;
    text-shadow: 1px 1px 2px #000;
}

.hdr-perf-qi {
    position: absolute;
    left: 88%;
    top: 56%;
    color: #67e8f9;
    font-size: 11px;
    font-weight: bold;
    text-shadow: 1px 1px 2px #000;
}

.hdr-perf-settings-btn {
    position: absolute;
    right: 2px;
    top: 48%;
    width: 32px;
    height: 32px;
    background: none;
    border: none;
    cursor: pointer;
}

/* Middle Main Seamless Stage */
.home-perfect-view {
    padding: 0 !important;
    margin: 0 !important;
    width: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 75px !important;
}

.home-seamless-stage {
    position: relative;
    width: 100%;
    aspect-ratio: 576 / 735;
    margin: 0 auto;
}

.home-seamless-bg {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    pointer-events: none;
}

.perf-hotspot {
    position: absolute;
    cursor: pointer;
    background: rgba(255, 255, 255, 0);
    border-radius: 6px;
    transition: background 0.15s ease, transform 0.12s ease;
}

.perf-hotspot:hover {
    background: rgba(255, 215, 0, 0.18);
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.4);
}

.perf-hotspot:active {
    background: rgba(255, 215, 0, 0.35);
    transform: scale(0.96);
}

/* Bottom Navigation Bar Seamless */
.bottom-nav-authentic-perfect {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 480px;
    aspect-ratio: 576 / 85;
    z-index: 1000;
    overflow: hidden;
}

.bottom-nav-seamless-bg {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: fill;
    pointer-events: none;
}

.nav-perf-hotspot {
    position: absolute;
    top: 0;
    height: 100%;
    cursor: pointer;
    background: transparent;
    transition: background 0.15s ease;
}

.nav-perf-hotspot:hover {
    background: rgba(255, 215, 0, 0.15);
}

.nav-perf-hotspot.active {
    background: rgba(255, 215, 0, 0.25);
    box-shadow: inset 0 0 8px rgba(255, 215, 0, 0.5);
}
'''

with open(r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

with open(r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/css/style.css', 'w', encoding='utf-8') as f:
    f.write(css + '\n' + new_css)

print("Added new CSS rules to style.css!")
