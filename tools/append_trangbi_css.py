css_trangbi = """
/* ================= 100% AUTHENTIC GIAO DIỆN TRANG BỊ ================= */
.trangbi-authentic-view {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #ecd6b5;
    user-select: none;
    box-sizing: border-box;
    overflow: hidden;
}

.trangbi-tabs-row {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    height: 48px;
    background: #4a240b;
    border-bottom: 2px solid #8c531b;
    padding: 0 4px;
    box-sizing: border-box;
}
.tb-tab-btn {
    flex: 1;
    height: 38px;
    background: #5c3010;
    border: 1.5px solid #3d1b06;
    border-bottom: none;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s, transform 0.15s;
    margin: 0 1px;
    padding: 0;
}
.tb-tab-text {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 13.5px;
    font-weight: 700;
    color: #fde68a;
    text-shadow: 1px 1px 2px #000;
}
.tb-tab-btn:hover {
    background: #6e3a15;
}
.tb-tab-btn.active {
    height: 46px;
    background: #dcb680;
    border: 2px solid #8c531b;
    border-bottom: none;
    box-shadow: inset 0 2px 4px rgba(255,255,255,0.6);
    z-index: 2;
}
.tb-tab-btn.active .tb-tab-text {
    color: #2b1102;
    text-shadow: 0 1px 1px rgba(255,255,255,0.6);
    font-size: 14.5px;
    font-weight: 800;
}

.trangbi-subaction-row {
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
    padding: 4px 12px;
    background: #eed7b7;
    border-bottom: 1.5px solid #caa372;
    box-sizing: border-box;
}
.tb-action-sub-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    height: 36px;
    transition: transform 0.15s, filter 0.15s;
}
.tb-action-sub-btn:hover {
    filter: brightness(1.15);
    transform: scale(1.04);
}
.tb-action-sub-btn:active {
    transform: scale(0.96);
}
.tb-action-sub-btn img {
    height: 100%;
    width: auto;
    object-fit: contain;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4));
}

.trangbi-list-container {
    flex: 1;
    overflow-y: auto;
    padding: 4px 6px;
    display: flex;
    flex-direction: column;
    gap: 3px;
    background: #ebd5b4;
}
.trangbi-list-container::-webkit-scrollbar {
    width: 4px;
}
.trangbi-list-container::-webkit-scrollbar-thumb {
    background: #92531d;
    border-radius: 2px;
}

.trangbi-item-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 10px;
    background: linear-gradient(to bottom, #fcf6ec 0%, #ecd3ae 100%);
    border: 1px solid #c99c62;
    border-bottom: 2px solid #8c531b;
    box-shadow: 0 2px 4px rgba(0,0,0,0.15);
    transition: background 0.15s, transform 0.15s;
    border-radius: 4px;
    margin-bottom: 2px;
}
.trangbi-item-row:hover {
    background: #fffcf5;
    transform: translateY(-1px);
}

.tb-item-icon-box {
    width: 66px;
    height: 66px;
    border-radius: 8px;
    border: 2px solid #9333ea;
    overflow: hidden;
    position: relative;
    background: #000;
    box-shadow: 0 3px 6px rgba(0,0,0,0.5);
    flex-shrink: 0;
    cursor: pointer;
}
.tb-item-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.tb-item-lvl {
    position: absolute;
    bottom: 0;
    left: 0;
    background: rgba(0,0,0,0.85);
    color: #fde047;
    font-size: 10px;
    font-weight: 800;
    padding: 1px 5px;
    border-top-right-radius: 4px;
    border-top: 1px solid #78350f;
    border-right: 1px solid #78350f;
}

.tb-item-info {
    flex: 1;
    padding: 0 12px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 4px;
    overflow: hidden;
}
.tb-item-name {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 14px;
    font-weight: 800;
    color: #1c0902;
    text-shadow: 0 1px 1px rgba(255,255,255,0.6);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.tb-item-stat-row {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 13.5px;
    font-weight: 800;
    color: #2d1400;
    text-shadow: 0 1px 1px rgba(255,255,255,0.4);
}
.tb-stat-ico {
    width: 16px;
    height: 16px;
    object-fit: contain;
}
.tb-badge-giap {
    width: 28px;
    height: 18px;
    object-fit: contain;
    margin-top: 1px;
}

.tb-item-actions {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
}
.tb-btn-act {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    height: 42px;
    width: 70px;
    transition: transform 0.15s, filter 0.15s;
}
.tb-btn-act:hover {
    filter: brightness(1.15);
    transform: scale(1.05);
}
.tb-btn-act:active {
    transform: scale(0.95);
}
.tb-btn-act img {
    width: 100%;
    height: 100%;
    object-fit: fill;
}
"""

with open(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\css\style.css", "a", encoding="utf-8") as f:
    f.write(css_trangbi)

print("Appended authentic Trang Bi CSS successfully!")
