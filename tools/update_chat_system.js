const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

// 1. UPDATE src/database.js
const dbPath = path.join(rootDir, 'src', 'database.js');
let dbCode = fs.readFileSync(dbPath, 'utf8');
if (!dbCode.includes('VP_LoaTruyenTin')) {
    dbCode = dbCode.replace(
        "ensureItem('VP_BoiDuongDan', 200);",
        "ensureItem('VP_BoiDuongDan', 200);\n            ensureItem('VP_LoaTruyenTin', 16511);"
    );
    fs.writeFileSync(dbPath, dbCode, 'utf8');
    console.log('1. Added VP_LoaTruyenTin (16,511) to src/database.js');
}


// 2. UPDATE src/routes/webApi.js
const webApiPath = path.join(rootDir, 'src', 'routes', 'webApi.js');
let webApiCode = fs.readFileSync(webApiPath, 'utf8');

const chatApiMethods = `
    getChat(body) {
        const aid = Number(body.aid) || (db.users && db.users[0] ? db.users[0].aid : 1);
        const playerData = db.getPlayerData(aid);
        const loaItem = (playerData?.VatPhamTieuThu || []).find(it => it.name === 'VP_LoaTruyenTin');
        const hornCount = loaItem ? loaItem.quantity : 16511;

        // Authentic chats from original game screenshot (media_1793066508164_3024b437.jpg)
        const defaultMessages = [
            {
                id: 1,
                sender: 's160.s171-Đen.[M2.6].[K2]',
                tag: '',
                content: 'có tt dug luc ttieeu hết cmn knb :((',
                badges: ['shield'],
                time: 'Vài giờ trước',
                channel: 'lienserver'
            },
            {
                id: 2,
                sender: 's178.GẤU ĐẠI VƯƠNG[M17.24].[K15][V14]',
                tag: '',
                content: 'Còn vài ngày nữa chơi nốt, xong chia tay ae',
                badges: ['shield', 'swirl', 'star'],
                time: 'Vài giờ trước',
                channel: 'lienserver'
            },
            {
                id: 3,
                sender: 's160.s171-Đen.[M2.6].[K2]',
                tag: '',
                content: '*** mp tip ăn tt :))',
                badges: ['spiral', 'shield'],
                time: 'Vài giờ trước',
                channel: 'lienserver'
            },
            {
                id: 4,
                sender: 's160.s171-Đen.[M2.6].[K2]',
                tag: '',
                content: 'mới kiếm đc 50k knb chưa quá :))',
                badges: ['spiral', 'shield'],
                time: 'Vài giờ trước',
                channel: 'lienserver'
            },
            {
                id: 5,
                sender: 's1.Fan : Vua Bọ Cạp[M9.191].[K8][V15]',
                tag: '[LMVD]',
                content: '***',
                badges: ['swirl', 'shield', 'star'],
                time: 'Vài giờ trước',
                channel: 'lienserver'
            },
            {
                id: 6,
                sender: 's180.Hiếu Hững Hờ[M6.17].[K6][V9]',
                tag: '[LMVD]',
                content: 'akx',
                badges: ['shield', 'star'],
                time: 'Vài giờ trước',
                channel: 'lienserver'
            },
            {
                id: 7,
                sender: 's160.s171-Đen.[M2.6].[K2]',
                tag: '',
                content: '...',
                badges: ['spiral', 'shield'],
                time: '15 phút trước',
                channel: 'lienserver'
            }
        ];

        return {
            success: true,
            hornCount,
            messages: defaultMessages
        };
    }

    sendChat(body) {
        const aid = Number(body.aid) || (db.users && db.users[0] ? db.users[0].aid : 1);
        const playerData = db.getPlayerData(aid);
        if (!playerData) return { success: false, error: 'User not found' };

        const content = (body.content || '').trim();
        if (!content) return { success: false, error: 'Nội dung tin nhắn không được để trống!' };

        playerData.VatPhamTieuThu = playerData.VatPhamTieuThu || [];
        let loaItem = playerData.VatPhamTieuThu.find(it => it.name === 'VP_LoaTruyenTin');
        if (!loaItem) {
            loaItem = { name: 'VP_LoaTruyenTin', quantity: 16511 };
            playerData.VatPhamTieuThu.push(loaItem);
        }

        if (loaItem.quantity > 0) {
            loaItem.quantity -= 1;
        }

        db.savePlayerData(aid, playerData);

        const newMsg = {
            id: Date.now(),
            sender: (playerData.Account?.TenNhanVat || 'S171-Đen') + '.[K2]',
            tag: '[LMVD]',
            content,
            badges: ['shield', 'star'],
            time: 'Vừa xong',
            channel: body.channel || 'lienserver'
        };

        return {
            success: true,
            hornCount: loaItem.quantity,
            newMsg,
            playerData
        };
    }
`;

if (!webApiCode.includes('getChat(body)')) {
    webApiCode = webApiCode.replace(
        "module.exports = controller;",
        chatApiMethods + "\nmodule.exports = controller;"
    );
    fs.writeFileSync(webApiPath, webApiCode, 'utf8');
    console.log('2. Added getChat and sendChat to src/routes/webApi.js');
}


// 3. UPDATE src/app.js
const appPath = path.join(rootDir, 'src', 'app.js');
let appCode = fs.readFileSync(appPath, 'utf8');
if (!appCode.includes("case 'get_chat':")) {
    appCode = appCode.replace(
        "case 'claim_luankiem_reward':",
        "case 'get_chat':\n                    result = webApi.getChat(body);\n                    break;\n                case 'send_chat':\n                    result = webApi.sendChat(body);\n                    break;\n                case 'claim_luankiem_reward':"
    );
    fs.writeFileSync(appPath, appCode, 'utf8');
    console.log('3. Registered get_chat and send_chat in src/app.js');
}


// 4. UPDATE public/index.html
const indexPath = path.join(rootDir, 'public', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const chatTabHtml = `
                <!-- Tab 9: 100% Authentic Trò Chuyện (Chat) Matching Original Game Screenshot media_1793066508164_3024b437.jpg -->
                <div id="tab-chat" class="tab-view chat-authentic-view" style="display: none;">
                    <!-- Top 3 Channels Tabs -->
                    <div class="chat-top-tabs-row">
                        <button class="chat-tab-btn" id="btn-chat-tab-tatca" onclick="switchChatChannel('tatca')">
                            <span class="chat-tab-text">Tất cả</span>
                        </button>
                        <button class="chat-tab-btn active" id="btn-chat-tab-lienserver" onclick="switchChatChannel('lienserver')">
                            <span class="chat-tab-text">Liên Server</span>
                        </button>
                        <button class="chat-tab-btn" id="btn-chat-tab-lienminh" onclick="switchChatChannel('lienminh')">
                            <span class="chat-tab-text">Liên minh</span>
                        </button>
                    </div>

                    <!-- Chat Messages List -->
                    <div id="chat-messages-container" class="chat-messages-board"></div>

                    <!-- Bottom Controls Bar (Horn Counter, Input, Button "Chém") -->
                    <div class="chat-bottom-bar">
                        <div class="chat-horn-badge" title="Loa truyền tin liên server">
                            <img src="/assets/ui/chat_authentic/icon_loa_truyentin.png" class="chat-horn-icon" alt="Loa"/>
                            <span id="chat-horn-count" class="chat-horn-val">16511</span>
                        </div>
                        <input type="text" id="chat-input-field" class="chat-input-text" placeholder="Nhập lời luận kiếm / trò chuyện..." onkeydown="if(event.key==='Enter') doSendChatMessage()"/>
                        <button class="chat-btn-chem" onclick="doSendChatMessage()" title="Chém"></button>
                    </div>
                </div>
`;

if (!html.includes('id="tab-chat"')) {
    html = html.replace(
        '<div id="tab-items" class="tab-view vatpham-authentic-view"',
        chatTabHtml + '\n                <div id="tab-items" class="tab-view vatpham-authentic-view"'
    );
    console.log('4. Added tab-chat to public/index.html');
}

// Bump cache to v=20
html = html.replace(/style\.css\?v=\d+/g, 'style.css?v=20');
html = html.replace(/game\.js\?v=\d+/g, 'game.js?v=20');
fs.writeFileSync(indexPath, html, 'utf8');
console.log('4. Bumped cache versions to v=20 in index.html');


// 5. UPDATE public/css/style.css
const cssPath = path.join(rootDir, 'public', 'css', 'style.css');
let css = fs.readFileSync(cssPath, 'utf8');

const chatCss = `
/* ================= 100% AUTHENTIC TRÒ CHUYỆN (CHAT) GUI ================= */
.chat-authentic-view {
    padding: 0 4px 76px 4px !important;
    background: #af8d74 url('/assets/ui/Background.png') no-repeat center top !important;
    background-size: cover !important;
    min-height: calc(100vh - 75px);
    display: flex;
    flex-direction: column;
}

.chat-top-tabs-row {
    display: flex;
    gap: 6px;
    padding: 4px 6px 2px 6px;
    margin-bottom: 2px;
}

.chat-tab-btn {
    flex: 1;
    height: 48px;
    border: none;
    cursor: pointer;
    outline: none;
    border-radius: 8px;
    transition: transform 0.1s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background: url('/assets/ui/luankiem_authentic/tab_wood_clean.png') no-repeat center center;
    background-size: 100% 100%;
}

.chat-tab-btn.active {
    background: url('/assets/ui/luankiem_authentic/tab_stone_clean.png') no-repeat center center;
    background-size: 100% 100%;
}

#btn-chat-tab-tatca:not(.active) {
    background-image: url('/assets/ui/chat_authentic/tab_tatca.png') !important;
}
#btn-chat-tab-tatca:not(.active) .chat-tab-text {
    display: none;
}

#btn-chat-tab-lienserver.active {
    background-image: url('/assets/ui/chat_authentic/tab_lienserver_active.png') !important;
}
#btn-chat-tab-lienserver.active .chat-tab-text {
    display: none;
}

#btn-chat-tab-lienminh:not(.active) {
    background-image: url('/assets/ui/chat_authentic/tab_lienminh.png') !important;
}
#btn-chat-tab-lienminh:not(.active) .chat-tab-text {
    display: none;
}

.chat-tab-text {
    font-size: 16px;
    font-weight: 900;
    font-family: 'Times New Roman', cursive, serif;
    color: #381e10;
    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.4);
}

.chat-tab-btn:not(.active) .chat-tab-text {
    color: #edd1a9;
    text-shadow: 1px 1px 2px #000;
}

.chat-tab-btn:active {
    transform: scale(0.96);
}

.chat-messages-board {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
    overflow-y: auto;
    max-height: calc(100vh - 200px);
    padding: 6px 8px 12px 8px;
    box-sizing: border-box;
}

.chat-msg-row {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.chat-msg-header {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 0 4px;
}

.chat-lm-tag {
    color: #ffd700;
    font-weight: 900;
    font-size: 12.5px;
    text-shadow: 1px 1px 2px #000;
}

.chat-sender-name {
    color: #ffffff;
    font-weight: bold;
    font-size: 13.5px;
    text-shadow: 1px 1px 2px #000;
    font-family: 'Times New Roman', serif;
}

.chat-badges-wrap {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-left: 2px;
}

.chat-badge-img {
    width: 17px;
    height: 20px;
    object-fit: contain;
}

.chat-time-tag {
    margin-left: auto;
    color: #f7e6c4;
    font-size: 11.5px;
    font-weight: bold;
    text-shadow: 1px 1px 2px #000;
}

/* Wuxia Speech Bubble matching Screenshot */
.chat-bubble {
    position: relative;
    background: linear-gradient(180deg, #fffcf5 0%, #faeed7 100%);
    border: 1.5px solid #c27838;
    border-radius: 6px;
    padding: 6px 12px;
    color: #1a0e07;
    font-size: 13.5px;
    font-weight: 500;
    font-family: 'Times New Roman', serif;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
    margin-top: 5px;
    word-break: break-word;
}

.chat-bubble::before {
    content: '';
    position: absolute;
    top: -7px;
    left: 14px;
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 7px solid #c27838;
}

.chat-bubble::after {
    content: '';
    position: absolute;
    top: -5px;
    left: 15px;
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 6px solid #fffcf5;
}

/* Bottom Controls Bar */
.chat-bottom-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 8px;
    background: rgba(30, 16, 9, 0.85);
    border-top: 2px solid #5a3a22;
    margin-top: auto;
    box-sizing: border-box;
}

.chat-horn-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
    cursor: pointer;
}

.chat-horn-icon {
    width: 38px;
    height: 36px;
    object-fit: contain;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
}

.chat-horn-val {
    color: #fffaed;
    font-size: 16px;
    font-weight: 900;
    text-shadow: 1px 1px 2px #000;
    font-family: 'Times New Roman', serif;
}

.chat-input-text {
    flex: 1;
    height: 36px;
    background: #fffcf5;
    border: 1.5px solid #c27838;
    border-radius: 6px;
    padding: 0 10px;
    font-size: 13px;
    color: #1a0e07;
    outline: none;
    font-family: 'Times New Roman', serif;
}

.chat-input-text:focus {
    border-color: #f59e0b;
    box-shadow: 0 0 6px rgba(245, 158, 11, 0.5);
}

.chat-btn-chem {
    width: 90px;
    height: 40px;
    background: url('/assets/ui/chat_authentic/btn_chem.png') no-repeat center center;
    background-size: 100% 100%;
    border: none;
    cursor: pointer;
    outline: none;
    border-radius: 6px;
    flex-shrink: 0;
    transition: transform 0.1s ease, filter 0.1s ease;
}

.chat-btn-chem:active {
    transform: scale(0.93);
    filter: brightness(0.85);
}
`;

if (!css.includes('chat-authentic-view')) {
    css += '\n' + chatCss;
    fs.writeFileSync(cssPath, css, 'utf8');
    console.log('5. Appended Chat CSS to public/css/style.css');
} else {
    console.log('5. Chat CSS already present in style.css');
}


// 6. UPDATE public/js/game.js
const jsPath = path.join(rootDir, 'public', 'js', 'game.js');
let js = fs.readFileSync(jsPath, 'utf8');

// Update openChatModal to switch to 'chat' tab
js = js.replace(
    /function openChatModal\(\) \{[\s\S]*?function closeChatModal\(\) \{[\s\S]*?\}/,
    `function openChatModal() {
    sound.play('click');
    switchTab('chat');
}
function closeChatModal() {
    sound.play('click');
    switchTab('home');
}`
);

// Add case 'chat' to renderCurrentTab()
if (!js.includes("case 'chat':")) {
    js = js.replace(
        "case 'items':\n            renderItems();\n            break;",
        "case 'items':\n            renderItems();\n            break;\n        case 'chat':\n            renderChat();\n            break;"
    );
}

const chatJsFunctions = `
// ================= 100% AUTHENTIC TRÒ CHUYỆN (CHAT) SYSTEM =================
let currentChatChannel = 'lienserver';
let chatMessagesCache = [];

function switchChatChannel(channel) {
    sound.play('click');
    currentChatChannel = channel;

    document.querySelectorAll('.chat-tab-btn').forEach(btn => btn.classList.remove('active'));
    const btn = document.getElementById('btn-chat-tab-' + channel);
    if (btn) btn.classList.add('active');

    renderChatMessages();
}

async function renderChat() {
    try {
        const res = await apiPost('get_chat', { aid: getEffectiveAid() });
        if (res && res.success) {
            chatMessagesCache = res.messages || [];
            const hornEl = document.getElementById('chat-horn-count');
            if (hornEl) hornEl.innerText = res.hornCount || 16511;
        }
    } catch (e) {
        console.error('get_chat error:', e);
    }
    renderChatMessages();
}

function renderChatMessages() {
    const container = document.getElementById('chat-messages-container');
    if (!container) return;
    container.innerHTML = '';

    const msgs = chatMessagesCache.filter(m => currentChatChannel === 'tatca' || m.channel === currentChatChannel || currentChatChannel === 'lienserver');

    msgs.forEach(m => {
        const row = document.createElement('div');
        row.className = 'chat-msg-row';

        let badgesHtml = '';
        (m.badges || []).forEach(b => {
            if (b === 'shield') {
                badgesHtml += '<img src="/assets/ui/luankiem_authentic/badge_shield.png" class="chat-badge-img" alt="Shield"/>';
            } else if (b === 'swirl') {
                badgesHtml += '<img src="/assets/ui/luankiem_authentic/badge_swirl.png" class="chat-badge-img" alt="Swirl"/>';
            } else if (b === 'star') {
                badgesHtml += '<img src="/assets/ui/luankiem_authentic/badge_star.png" class="chat-badge-img" alt="Star"/>';
            } else if (b === 'spiral') {
                badgesHtml += '<img src="/assets/ui/chat_authentic/badge_yellow_spiral.png" class="chat-badge-img" alt="Spiral"/>';
            }
        });

        row.innerHTML = \`
            <div class="chat-msg-header">
                \${m.tag ? \`<span class="chat-lm-tag">\${m.tag}</span>\` : ''}
                <span class="chat-sender-name">\${m.sender}</span>
                <div class="chat-badges-wrap">\${badgesHtml}</div>
                <span class="chat-time-tag">\${m.time || 'Vài giờ trước'}</span>
            </div>
            <div class="chat-bubble">\${m.content}</div>
        \`;
        container.appendChild(row);
    });

    container.scrollTop = container.scrollHeight;
}

async function doSendChatMessage() {
    const input = document.getElementById('chat-input-field');
    if (!input) return;
    const text = input.value.trim();
    if (!text) {
        alert('Vui lòng nhập nội dung tin nhắn!');
        return;
    }

    sound.play('click');
    try {
        const res = await apiPost('send_chat', {
            aid: getEffectiveAid(),
            content: text,
            channel: currentChatChannel
        });

        if (res && res.success) {
            sound.play('trangbi');
            input.value = '';
            if (res.newMsg) {
                chatMessagesCache.push(res.newMsg);
            }
            const hornEl = document.getElementById('chat-horn-count');
            if (hornEl && res.hornCount !== undefined) hornEl.innerText = res.hornCount;
            renderChatMessages();
        } else {
            alert(res?.error || 'Không thể gửi tin nhắn!');
        }
    } catch (e) {
        alert('Lỗi kết nối máy chủ!');
    }
}
`;

if (!js.includes('switchChatChannel')) {
    js += '\n' + chatJsFunctions;
    fs.writeFileSync(jsPath, js, 'utf8');
    console.log('6. Appended Chat JS functions to public/js/game.js');
} else {
    console.log('6. Chat JS already present in game.js');
}

console.log('All Chat System files updated successfully!');
