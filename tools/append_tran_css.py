css_tran = """
/* ================= 100% AUTHENTIC 3 LOẠI TRẬN & ĐỘI HÌNH RA TRẬN ================= */
.dt-top-submode-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px 6px;
    background: rgba(0, 0, 0, 0.4);
    border-bottom: 1.5px solid #8c6031;
    margin-bottom: 6px;
    box-sizing: border-box;
}
.dt-submode-btn {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    width: 52px;
    height: 52px;
    border-radius: 8px;
    transition: transform 0.15s, filter 0.15s;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.6));
    display: flex;
    align-items: center;
    justify-content: center;
}
.dt-submode-btn:hover {
    transform: scale(1.06);
    filter: brightness(1.15) drop-shadow(0 3px 6px rgba(0,0,0,0.8));
}
.dt-submode-btn.active {
    outline: 2px solid #fde047;
    box-shadow: 0 0 10px #f59e0b;
    border-radius: 8px;
}
.dt-submode-icon {
    width: 100%;
    height: 100%;
    object-fit: contain;
}
.dt-plaque-wrapper {
    cursor: pointer;
    width: 26px;
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.15s;
}
.dt-plaque-wrapper:hover {
    transform: scale(1.06);
}
.dt-plaque-img {
    height: 100%;
    width: auto;
    object-fit: contain;
}

/* 1. Đội Hình Ra Trận Layout */
.dt-doihinh-layout {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 580px;
    padding: 0 4px;
    box-sizing: border-box;
}
.dt-col-flank {
    width: 54px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 540px;
    z-index: 5;
}
.dt-slot-flank {
    width: 52px;
    height: 52px;
    border-radius: 8px;
    border: 1.5px solid #eab308;
    background: rgba(0,0,0,0.7);
    box-shadow: 0 3px 8px rgba(0,0,0,0.8);
    position: relative;
    cursor: pointer;
    overflow: hidden;
    transition: transform 0.15s;
}
.dt-slot-flank:hover {
    transform: scale(1.08);
    box-shadow: 0 0 10px #f59e0b;
}
.dt-slot-flank img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.slot-flank-lvl {
    position: absolute;
    bottom: 0;
    left: 0;
    background: rgba(0,0,0,0.85);
    color: #fde047;
    font-size: 10px;
    font-weight: 800;
    padding: 1px 4px;
    border-top-right-radius: 4px;
    border-top: 1px solid #78350f;
    border-right: 1px solid #78350f;
}
.dt-center-scroll-doihinh {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
}
.doihinh-scroll-wrapper {
    position: relative;
    width: 336px;
    max-width: 100%;
    height: 526px;
}
.doihinh-scroll-bg {
    width: 100%;
    height: 100%;
    object-fit: fill;
}
.doihinh-disciples-list {
    position: absolute;
    top: 76px;
    left: 24px;
    right: 24px;
    bottom: 80px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding-right: 2px;
}
.dh-disciple-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 3px 8px;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.15s;
    user-select: none;
}
.dh-disciple-row:hover {
    background: rgba(234, 179, 8, 0.2);
}
.dh-name {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 13.5px;
    font-weight: 700;
    color: #26150a;
    text-shadow: 0 1px 1px rgba(255,255,255,0.6);
}
.dh-badge-giap {
    width: 28px;
    height: 18px;
    object-fit: contain;
    margin-left: auto;
    margin-right: 6px;
}
.dh-level-wrap {
    display: flex;
    align-items: center;
    gap: 2px;
}
.dh-cap-icon {
    width: 22px;
    height: 20px;
    object-fit: contain;
}
.dh-level-num {
    font-family: 'Segoe UI', Arial, sans-serif;
    font-size: 13px;
    font-weight: 800;
    color: #1e1005;
    min-width: 28px;
    text-align: right;
}
.doihinh-bottom-stats {
    position: absolute;
    bottom: 16px;
    left: 26px;
    right: 26px;
    display: flex;
    flex-direction: column;
    gap: 2px;
}
.dh-stat-row {
    display: flex;
    align-items: center;
    font-size: 13px;
    font-weight: 800;
    color: #2d1400;
    text-shadow: 0 1px 1px rgba(255,255,255,0.4);
}
.dh-label {
    font-family: 'Playfair Display', serif;
    font-size: 13px;
    color: #3b1b02;
    width: 95px;
}
.dh-gold-icon, .dh-khithe-icon {
    width: 22px;
    height: 18px;
    object-fit: contain;
    margin-right: 6px;
}
.dh-val-gold {
    color: #78350f;
    font-size: 14px;
    font-weight: 900;
}
.dh-val-khithe {
    color: #881337;
    font-size: 14px;
    font-weight: 900;
}

/* 2. Thiên Dương & Thiên Âm Trận Layout */
.dt-tran-10-layout {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 600px;
    padding: 0 2px;
    box-sizing: border-box;
}
.dt-col-avatars {
    width: 68px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 580px;
    z-index: 5;
}
.dt-avatar-box-10 {
    width: 66px;
    height: 66px;
    border-radius: 8px;
    border: 2px solid #eab308;
    box-shadow: 0 3px 8px rgba(0,0,0,0.8);
    position: relative;
    overflow: hidden;
    cursor: pointer;
    background: #000;
    transition: transform 0.15s, box-shadow 0.15s;
}
.dt-avatar-box-10:hover {
    transform: scale(1.06);
    box-shadow: 0 0 12px #f59e0b;
}
.dt-avatar-box-10 img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.dt-avatar-lvl-10 {
    position: absolute;
    bottom: 0;
    left: 0;
    background: rgba(0,0,0,0.85);
    color: #fde047;
    font-size: 10.5px;
    font-weight: 900;
    padding: 1px 5px;
    border-top-right-radius: 4px;
    border-top: 1px solid #78350f;
    border-right: 1px solid #78350f;
}
.dt-center-scroll-tran {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
}
.tran-scroll-wrapper {
    position: relative;
    width: 356px;
    max-width: 100%;
    height: 597px;
}
.tran-scroll-bg {
    width: 100%;
    height: 100%;
    object-fit: fill;
}
.tran-bottom-overlay {
    position: absolute;
    bottom: 14px;
    left: 14px;
    right: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.tran-btns-group {
    display: flex;
    align-items: center;
    gap: 6px;
}
.tran-action-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    height: 42px;
    transition: transform 0.15s, filter 0.15s;
}
.tran-action-btn:hover {
    filter: brightness(1.15);
    transform: scale(1.05);
}
.tran-action-btn:active {
    transform: scale(0.95);
}
.tran-action-btn img {
    height: 100%;
    width: auto;
    object-fit: contain;
}
.tran-stats-quad {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2px 8px;
    font-size: 11px;
    font-weight: 900;
    color: #1e1005;
    text-shadow: 0 1px 1px rgba(255,255,255,0.5);
}
.tran-stat-item {
    display: flex;
    align-items: center;
    gap: 3px;
    white-space: nowrap;
}
.tran-stat-ico {
    width: 15px;
    height: 15px;
    object-fit: contain;
}

/* 3. Thiên Long Trận Layout */
.dt-thienlong-layout {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 636px;
}
.thienlong-scroll-container {
    position: relative;
    width: 520px;
    max-width: 100%;
    height: 636px;
}
.thienlong-scroll-wrap {
    position: relative;
    width: 100%;
    height: 100%;
}
.thienlong-scroll-bg {
    width: 100%;
    height: 100%;
    object-fit: fill;
}
.tl-avatar-slot {
    position: absolute;
    width: 64px;
    height: 64px;
    border-radius: 8px;
    border: 2px solid #eab308;
    overflow: hidden;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(0,0,0,0.85);
    background: #000;
    transition: transform 0.15s, box-shadow 0.15s;
    z-index: 5;
}
.tl-avatar-slot:hover {
    transform: scale(1.08);
    box-shadow: 0 0 14px #eab308;
}
.tl-slot-ava {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.tl-slot-lvl {
    position: absolute;
    bottom: 0;
    left: 0;
    background: rgba(0,0,0,0.85);
    color: #fde047;
    font-size: 10px;
    font-weight: 900;
    padding: 1px 4px;
    border-top-right-radius: 4px;
}
.tl-avatar-slot.slot-top {
    left: 42%;
    top: 13%;
}
.tl-avatar-slot.slot-left {
    left: 14%;
    top: 35%;
}
.tl-avatar-slot.slot-right {
    left: 71%;
    top: 35%;
}
.tl-avatar-slot.slot-bot-left {
    left: 21%;
    top: 70%;
}
.tl-avatar-slot.slot-bot-right {
    left: 64%;
    top: 70%;
}
.thienlong-bottom-overlay {
    position: absolute;
    bottom: 18px;
    left: 24px;
    right: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.tl-btns-group {
    display: flex;
    align-items: center;
    gap: 8px;
}
.tl-stats-quad {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2px 10px;
    font-size: 11.5px;
    font-weight: 900;
    color: #1e1005;
    text-shadow: 0 1px 1px rgba(255,255,255,0.5);
}
.tl-stat-item {
    display: flex;
    align-items: center;
    gap: 3px;
    white-space: nowrap;
}
.tl-stat-ico {
    width: 16px;
    height: 16px;
    object-fit: contain;
}
"""

with open(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\css\style.css", "a", encoding="utf-8") as f:
    f.write(css_tran)

print("Appended authentic 3 Tran & Doi Hinh CSS successfully!")
