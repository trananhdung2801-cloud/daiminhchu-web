import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/js/game.js', 'r', encoding='utf-8') as f:
    js_code = f.read()

# 1. Update updateHeader to support header-qi
old_stamina_part = """    const staminaEl = document.getElementById('header-stamina');
    if (staminaEl) staminaEl.innerText = `${time.LuotNV ?? 30}/${time.LuotNVMax || 30}`;"""

new_stamina_part = """    const staminaEl = document.getElementById('header-stamina');
    if (staminaEl) staminaEl.innerText = `${time.LuotNV ?? 30}/${time.LuotNVMax || 30}`;

    const qiEl = document.getElementById('header-qi');
    if (qiEl) qiEl.innerText = `${time.LuotTD ?? 12}/${time.LuotTDMax || 12}`;"""

if old_stamina_part in js_code:
    js_code = js_code.replace(old_stamina_part, new_stamina_part)
    print("1. Added header-qi updater to updateHeader() successfully!")
else:
    print("Could not find old_stamina_part in game.js!")

# 2. Add home cloud rendering to renderCurrentTab
old_case_home = """        case 'home':
            renderTopCarousel();
            renderScrollPainting();
            break;"""

new_case_home = """        case 'home':
            renderHomeCloudDisciples();
            break;"""

if old_case_home in js_code:
    js_code = js_code.replace(old_case_home, new_case_home)
    print("2. Updated case 'home' in renderCurrentTab() successfully!")
else:
    print("Could not find old_case_home!")

# 3. Add helper functions before window.addEventListener('DOMContentLoaded'
target_init = "// Init Game on Load\nwindow.addEventListener('DOMContentLoaded'"

new_helpers = '''
// ================= AUTHENTIC HOME HELPERS =================
function renderHomeCloudDisciples() {
    const container = document.getElementById('home-cloud-disciples');
    if (!container || !GameState.playerData || !GameState.playerData.NhanVat) return;

    container.innerHTML = '';
    const disciples = GameState.playerData.NhanVat.slice(0, 5);

    disciples.forEach((nv, idx) => {
        const code = nv.name || nv.Code;
        const cfg = getDiscipleCfg(code);

        const item = document.createElement('div');
        item.className = 'home-cloud-disciple-item';
        // Give center disciple slight elevation
        if (idx === Math.floor(disciples.length / 2)) {
            item.style.transform = 'scale(1.08) translateY(-4px)';
            item.style.zIndex = '5';
        }
        item.onclick = () => openDiscipleDetailModal(code);
        item.title = cfg.TenHienThi || code;

        const img = document.createElement('img');
        img.src = getAvatarUrl(code);
        img.onerror = () => { img.src = '/assets/images/NV_QuachTinh_ava_to.png'; };
        item.appendChild(img);

        container.appendChild(item);
    });
}

function openDiscipleDetailModal(code) {
    sound.play('click');
    const modal = document.getElementById('disciple-detail-modal');
    if (!modal) return;
    if (code && GameState.playerData && GameState.playerData.NhanVat) {
        const found = GameState.playerData.NhanVat.find(d => (d.name || d.Code) === code);
        if (found) GameState.selectedDiscipleId = found.id || found.Id;
    }
    renderScrollPainting();
    modal.classList.add('active');
}

function closeDiscipleDetailModal() {
    sound.play('click');
    const modal = document.getElementById('disciple-detail-modal');
    if (modal) modal.classList.remove('active');
}

function openLongChauModal() {
    sound.play('click');
    const modal = document.getElementById('longchau-modal');
    if (modal) modal.classList.add('active');
}
function closeLongChauModal() {
    sound.play('click');
    const modal = document.getElementById('longchau-modal');
    if (modal) modal.classList.remove('active');
}

function openLienServerModal() {
    sound.play('click');
    const modal = document.getElementById('lienserver-modal');
    if (modal) modal.classList.add('active');
}
function closeLienServerModal() {
    sound.play('click');
    const modal = document.getElementById('lienserver-modal');
    if (modal) modal.classList.remove('active');
}

function openAmKhiModal() {
    sound.play('click');
    const modal = document.getElementById('amkhi-modal');
    if (modal) modal.classList.add('active');
}
function closeAmKhiModal() {
    sound.play('click');
    const modal = document.getElementById('amkhi-modal');
    if (modal) modal.classList.remove('active');
}

function openMailModal() {
    sound.play('click');
    const modal = document.getElementById('mail-modal');
    if (modal) modal.classList.add('active');
}
function closeMailModal() {
    sound.play('click');
    const modal = document.getElementById('mail-modal');
    if (modal) modal.classList.remove('active');
}

function openAnOanModal() {
    sound.play('click');
    const modal = document.getElementById('an-oan-modal');
    if (modal) modal.classList.add('active');
}
function closeAnOanModal() {
    sound.play('click');
    const modal = document.getElementById('an-oan-modal');
    if (modal) modal.classList.remove('active');
}

function openChatModal() {
    sound.play('click');
    const modal = document.getElementById('chat-modal');
    if (modal) modal.classList.add('active');
}
function closeChatModal() {
    sound.play('click');
    const modal = document.getElementById('chat-modal');
    if (modal) modal.classList.remove('active');
}
'''

if target_init in js_code:
    js_code = js_code.replace(target_init, new_helpers + '\n' + target_init)
    print("3. Appended authentic home functions to game.js successfully!")
else:
    print("Could not find target_init in game.js!")

with open(r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/js/game.js', 'w', encoding='utf-8') as f:
    f.write(js_code)
print("Finished updating game.js!")
