import sys, os
sys.stdout.reconfigure(encoding='utf-8')
os.chdir(r'C:\Users\trananh.dung\Downloads\DaiMinhChu_Server')

css = '''
/* ================= 100% AUTHENTIC BỒI DƯỠNG ĐỆ TỬ GUI (media_1793066806740_cfde29ed.jpg) ================= */
.boiduong-authentic-screen {
    width: 100%;
    max-width: 480px;
    background-color: #af8d72;
    border: 2px solid #5a3820;
    border-radius: 8px;
    box-shadow: 0 0 35px rgba(0, 0, 0, 0.95);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
    font-family: inherit;
}

.bd-auth-header-strip {
    position: relative;
    width: 100%;
    height: 72px;
    flex-shrink: 0;
}

.bd-auth-top-bg {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.bd-auth-tab-plaque {
    position: absolute;
    left: 12px;
    top: 10px;
    width: 145px;
    height: auto;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.6));
}

.bd-auth-content-body {
    padding: 10px 14px 16px 14px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex: 1;
}

.bd-auth-hint {
    text-align: center;
    font-size: 13.5px;
    font-weight: 700;
    color: #2c1409;
    line-height: 1.35;
    margin-top: 2px;
    letter-spacing: 0.2px;
}

.bd-auth-hero-row {
    display: flex;
    gap: 12px;
    align-items: center;
    margin-top: 4px;
}

.bd-auth-avatar-box {
    width: 82px;
    height: 82px;
    flex-shrink: 0;
    border: 2px solid #a855f7;
    border-radius: 12px;
    box-shadow: 0 0 10px #c084fc;
    overflow: hidden;
    background: #261611;
}

.bd-auth-avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.bd-auth-info-grid {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 3px;
    color: #2c1409;
    font-size: 13px;
    font-weight: bold;
}

.bd-info-line {
    display: flex;
    align-items: center;
}

.bd-line-1 {
    gap: 8px;
}

.bd-hero-name-text {
    font-size: 15px;
    font-weight: 900;
    color: #1e0b02;
    margin-right: 4px;
    white-space: nowrap;
}

.bd-stat-item {
    display: flex;
    align-items: center;
    gap: 3px;
    font-size: 12.5px;
    font-weight: 800;
    color: #2c1409;
}

.bd-stat-badge {
    width: 18px;
    height: 18px;
    object-fit: contain;
}

.bd-stat-val {
    color: #2c1409;
}

.bd-line-2 {
    gap: 8px;
    font-size: 13px;
}

.bd-quality-wrapper {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-right: 4px;
}

.bd-badge-giap-img {
    height: 20px;
    width: auto;
    object-fit: contain;
}

.bd-line-3 {
    font-size: 13px;
    color: #2c1409;
}

.bd-line-4 {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    color: #2c1409;
    margin-top: 2px;
}

.bd-auth-board-container {
    position: relative;
    width: 100%;
    height: 135px;
    margin: 4px 0;
    border-radius: 6px;
    overflow: hidden;
}

.bd-board-bg {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: fill;
}

.bd-board-options-grid {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    padding: 10px 16px;
    align-items: center;
}

.bd-board-opt {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    color: #fdf5e6;
    font-size: 13px;
    font-weight: 700;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.85);
    transition: transform 0.1s ease;
    user-select: none;
}

.bd-board-opt:hover {
    transform: scale(1.03);
}

.bd-radio-icon {
    width: 22px;
    height: 22px;
    object-fit: contain;
}

.bd-knb-icon {
    width: 18px;
    height: 14px;
    object-fit: contain;
    margin-left: 2px;
}

.bd-knb-num {
    color: #ffd700;
    font-weight: 900;
    font-size: 13px;
}

.bd-auth-actions-row {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-top: 8px;
    margin-bottom: 4px;
}

.bd-btn-img-wrapper {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    outline: none;
    transition: transform 0.15s ease, filter 0.15s ease;
}

.bd-btn-img-wrapper:hover {
    transform: scale(1.05);
    filter: brightness(1.1);
}

.bd-btn-img-wrapper:active {
    transform: scale(0.97);
}

.bd-auth-action-btn {
    width: 145px;
    height: auto;
    display: block;
}

.bd-result-msg {
    text-align: center;
    font-size: 12.5px;
    font-weight: bold;
    min-height: 18px;
    padding: 2px 4px;
    border-radius: 4px;
}
'''

with open('public/css/style.css', 'a', encoding='utf-8') as f:
    f.write(css)

print('Appended boiduong CSS successfully!')
