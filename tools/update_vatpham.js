const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

// 1. UPDATE public/index.html
const indexPath = path.join(rootDir, 'public', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const oldTabItemsRegex = /<div id="tab-items" class="tab-view"[\s\S]*?<\/div>\s*<\/div>/;
const newTabItemsHtml = `<!-- Tab 8: 100% Authentic Vật Phẩm GUI Matching Original Game Screenshot -->
                <div id="tab-items" class="tab-view vatpham-authentic-view" style="display: none;">
                    <div class="vp-top-header-row">
                        <img src="/assets/ui/vatpham_authentic/tab_vatpham_plaque.png" class="vp-top-plaque" alt="Vật phẩm"/>
                    </div>
                    <div class="vp-subheader-banner"></div>
                    <div id="items-container" class="vp-items-board"></div>
                </div>`;

if (oldTabItemsRegex.test(html)) {
    html = html.replace(oldTabItemsRegex, newTabItemsHtml);
    console.log('1. Replaced tab-items in public/index.html');
} else {
    console.warn('1. Warning: oldTabItemsRegex did not match in index.html');
}

// Bump version v=16 -> v=17
html = html.replace(/style\.css\?v=\d+/g, 'style.css?v=17');
html = html.replace(/game\.js\?v=\d+/g, 'game.js?v=17');
fs.writeFileSync(indexPath, html, 'utf8');
console.log('1. Bumped cache versions to v=17 in index.html');


// 2. UPDATE public/css/style.css
const cssPath = path.join(rootDir, 'public', 'css', 'style.css');
let css = fs.readFileSync(cssPath, 'utf8');

const vatPhamCss = `
/* ================= 100% AUTHENTIC VẬT PHẨM (INVENTORY) GUI ================= */
.vatpham-authentic-view {
    padding: 0 4px 76px 4px !important;
    background: #180d07 url('/assets/ui/Background.png') no-repeat center top !important;
    background-size: cover !important;
    min-height: calc(100vh - 75px);
    display: flex;
    flex-direction: column;
}

.vp-top-header-row {
    display: flex;
    align-items: flex-end;
    padding: 2px 4px 0 8px;
    margin-bottom: -1px;
    z-index: 2;
    position: relative;
}

.vp-top-plaque {
    width: 108px;
    height: 52px;
    object-fit: contain;
    filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.65));
}

.vp-subheader-banner {
    width: 100%;
    height: 32px;
    background: url('/assets/ui/vatpham_authentic/subheader_banner.png') no-repeat center center;
    background-size: 100% 100%;
    margin-bottom: 2px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.45);
    flex-shrink: 0;
}

.vp-items-board {
    display: flex;
    flex-direction: column;
    width: 100%;
    background: #603c21 url('/assets/ui/home_authentic/home_lower_board.png');
    border: 2px solid #4a2d18;
    border-radius: 4px;
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.6), 0 2px 6px rgba(0, 0, 0, 0.4);
    overflow-y: auto;
    max-height: calc(100vh - 170px);
}

.vp-item-row {
    display: flex;
    align-items: center;
    padding: 10px 10px;
    border-bottom: 2px solid #3c2415;
    box-shadow: 0 1px 0 rgba(110, 72, 43, 0.5);
    position: relative;
    gap: 12px;
    background: rgba(45, 27, 16, 0.55);
}

.vp-item-row:nth-child(even) {
    background: rgba(35, 20, 11, 0.65);
}

.vp-item-frame {
    width: 72px;
    height: 72px;
    border-radius: 8px;
    background: linear-gradient(180deg, #f7f9fa 0%, #dbe4eb 100%);
    border: 2px solid #8ca5b9;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.25), 0 2px 4px rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    position: relative;
}

.vp-item-icon {
    width: 58px;
    height: 58px;
    object-fit: contain;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.45));
}

.vp-item-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 2px;
}

.vp-item-name {
    color: #fffaed;
    font-size: 15px;
    font-weight: bold;
    text-shadow: 1px 1px 2px #000;
    font-family: 'Times New Roman', serif;
    letter-spacing: 0.3px;
}

.vp-item-desc {
    color: #edd9b5;
    font-size: 11.5px;
    line-height: 1.35;
    text-shadow: 1px 1px 1px #000;
    word-break: break-word;
}

.vp-item-qty {
    color: #fffaed;
    font-size: 12.5px;
    font-weight: bold;
    margin-top: 3px;
    text-shadow: 1px 1px 2px #000;
}

.vp-item-actions {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-left: auto;
    flex-shrink: 0;
}

.vp-btn {
    border: none;
    cursor: pointer;
    outline: none;
    background-color: transparent;
    transition: transform 0.1s ease, filter 0.1s ease;
    display: block;
}

.vp-btn:active {
    transform: scale(0.93);
    filter: brightness(0.85);
}

.vp-btn-10 {
    width: 86px;
    height: 36px;
    background: url('/assets/ui/vatpham_authentic/btn_dung10lan.png') no-repeat center center;
    background-size: 100% 100%;
    border-radius: 4px;
}

.vp-btn-use {
    width: 76px;
    height: 36px;
    background: url('/assets/ui/vatpham_authentic/btn_sudung.png') no-repeat center center;
    background-size: 100% 100%;
    border-radius: 4px;
}
`;

if (!css.includes('vp-item-row')) {
    css += '\n' + vatPhamCss;
    fs.writeFileSync(cssPath, css, 'utf8');
    console.log('2. Appended Vat Pham CSS to public/css/style.css');
} else {
    console.log('2. Vat Pham CSS already present in style.css');
}


// 3. UPDATE public/js/game.js
const jsPath = path.join(rootDir, 'public', 'js', 'game.js');
let js = fs.readFileSync(jsPath, 'utf8');

// Replace the first renderItems and useItem (lines ~808-844)
const oldFirstRenderRegex = /\/\/ 5\. Items Tab\s*function renderItems\(\)[\s\S]*?\/\/ ================= AUTHENTIC BATTLE ARENA/;
const newFirstRenderCode = `// 5. Authentic Items Tab & Item Consumption
const VP_FALLBACK_META = {
    'VP_BaoRuong': {
        TenHienThi: 'Bảo rương',
        MoTa: 'Một chiếc rương thần bí xuất hiện trên Ngũ nhạc sơn, mở ra có thể nhận 1 trang bị Giáp cấp bất kỳ',
        Icon: 'VP_BaoRuong_to.png'
    },
    'VP_BitTat': {
        TenHienThi: 'Bít tất',
        MoTa: 'Món quà bí ẩn của 1 cao nhân áo đỏ leo ống khói, chứa nhiều phần quà bất ngờ',
        Icon: 'VP_BitTat_to.png'
    },
    'VP_BachNienSam': {
        TenHienThi: 'Bách niên sâm',
        MoTa: 'Thần dược trăm năm, có công dụng tăng cường khí huyết của đệ tử ( đệ tử không mất tiềm lực )',
        Icon: 'VP_BachNienSam_to.png'
    },
    'VP_BoHuyetDan': {
        TenHienThi: 'Bách niên sâm',
        MoTa: 'Thần dược trăm năm, có công dụng tăng cường khí huyết của đệ tử ( đệ tử không mất tiềm lực )',
        Icon: 'VP_BachNienSam_to.png'
    },
    'VP_GaQuay': {
        TenHienThi: 'Gà quay',
        MoTa: 'Hồi 8 sinh lực',
        Icon: 'VP_GaQuay_to.png'
    },
    'VP_RuouNuNhiHong': {
        TenHienThi: 'Nữ nhi hồng',
        MoTa: 'Rượu nấu bằng nhiều loại gạo khác nhau, men rượu bằng gạo hoặc lúa mạch, dùng để uống với cao nhân.',
        Icon: 'VP_BinhRuou_to.png'
    },
    'VP_BinhRuou': {
        TenHienThi: 'Nữ nhi hồng',
        MoTa: 'Rượu nấu bằng nhiều loại gạo khác nhau, men rượu bằng gạo hoặc lúa mạch, dùng để uống với cao nhân.',
        Icon: 'VP_BinhRuou_to.png'
    },
    'VP_BoiDuongDan': {
        TenHienThi: 'Bồi dưỡng đan',
        MoTa: 'Kích thích tiềm năng của đệ tử',
        Icon: 'VP_BoiDuongDan_to.png'
    }
};

function renderItems() {
    const container = document.getElementById('items-container');
    if (!container) return;
    container.innerHTML = '';

    const items = GameState.playerData.VatPhamTieuThu || [];
    if (!items.length) {
        container.innerHTML = '<div style="color: #eed9b5; text-align: center; padding: 40px 20px; font-size: 14px;">Túi đồ hiện không có vật phẩm nào.</div>';
        return;
    }

    const staticConsumables = (GameState.staticData && GameState.staticData.consumables) || {};

    items.forEach(it => {
        if (!it || it.quantity <= 0) return;
        const code = it.name;
        const staticItem = staticConsumables[code] || VP_FALLBACK_META[code] || {};
        const title = staticItem.TenHienThi || VP_FALLBACK_META[code]?.TenHienThi || code;
        const desc = staticItem.MoTa || VP_FALLBACK_META[code]?.MoTa || 'Vật phẩm quý hiếm trên giang hồ.';
        const iconFile = VP_FALLBACK_META[code]?.Icon || (code + '_to.png');

        const row = document.createElement('div');
        row.className = 'vp-item-row';
        row.innerHTML = \`
            <div class="vp-item-frame">
                <img src="/assets/images/\${iconFile}" class="vp-item-icon" alt="\${title}" onerror="this.src='/assets/images/VP_BaoRuong_to.png'"/>
            </div>
            <div class="vp-item-info">
                <div class="vp-item-name">\${title}</div>
                <div class="vp-item-desc">\${desc}</div>
                <div class="vp-item-qty">Số lượng : \${Number(it.quantity).toLocaleString('vi-VN')}</div>
            </div>
            <div class="vp-item-actions">
                \${it.quantity >= 10 ? \`<button class="vp-btn vp-btn-10" onclick="doUseItem('\${code}', 10)" title="Dùng 10 lần"></button>\` : ''}
                <button class="vp-btn vp-btn-use" onclick="doUseItem('\${code}', 1)" title="Sử dụng"></button>
            </div>
        \`;
        container.appendChild(row);
    });
}

async function doUseItem(itemCode, count = 1) {
    sound.play('click');
    const res = await apiPost('use_item', {
        aid: getEffectiveAid(),
        itemCode,
        count
    });
    if (!res || !res.success) {
        alert(res?.error || 'Không thể sử dụng vật phẩm!');
        return;
    }
    sound.play('trangbi');
    if (res.playerData) {
        GameState.playerData = res.playerData;
    }
    updateHeader();
    renderItems();
    alert(res.message || \`Đã sử dụng thành công \${count} vật phẩm!\`);
}

function useItem(itemCode) {
    return doUseItem(itemCode, 1);
}

// ================= AUTHENTIC BATTLE ARENA`;

if (oldFirstRenderRegex.test(js)) {
    js = js.replace(oldFirstRenderRegex, newFirstRenderCode);
    console.log('3. Replaced first renderItems in public/js/game.js');
} else {
    console.warn('3. Warning: oldFirstRenderRegex did not match');
}

// Remove the second duplicate renderItems around line 1600
const oldSecondRenderRegex = /let currentBagCategory = 'all';[\s\S]*?function renderItems\(\)[\s\S]*?\/\/ ================= WORLD CHAT TICKER/;
const newSecondRenderCode = `// Items category legacy compatibility
let currentBagCategory = 'all';
function switchItemCategory(cat, btnEl) {
    sound.play('click');
    currentBagCategory = cat;
    renderItems();
}

// ================= WORLD CHAT TICKER`;

if (oldSecondRenderRegex.test(js)) {
    js = js.replace(oldSecondRenderRegex, newSecondRenderCode);
    console.log('3. Removed duplicate second renderItems in public/js/game.js');
} else {
    console.warn('3. Warning: oldSecondRenderRegex did not match');
}

fs.writeFileSync(jsPath, js, 'utf8');
console.log('All files updated successfully!');
