import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/js/game.js', 'r', encoding='utf-8') as f:
    js_code = f.read()

# Replace updateHeader in game.js with defensive version
target_func = """function updateHeader() {
    if (!GameState.playerData) return;
    const acc = GameState.playerData.Account;
    const time = GameState.playerData.GiaTriThoiGian;

    document.getElementById('header-player-name').innerText = acc.DisplayName;
    document.getElementById('header-level').innerText = `Lv.${acc.Level}`;
    document.getElementById('header-knb').innerText = Number(acc.Vang).toLocaleString();
    document.getElementById('header-bac').innerText = Number(acc.Bac).toLocaleString();

    const expPercent = Math.min(100, Math.round((acc.Exp / acc.ExpMax) * 100));
    document.getElementById('header-exp-fill').style.width = `${expPercent}%`;
    document.getElementById('header-exp-text').innerText = `${acc.Exp}/${acc.ExpMax}`;
    document.getElementById('header-stamina').innerText = `${time.LuotNV}/${time.LuotNVMax || 30}`;
}"""

replacement_func = """function updateHeader() {
    if (!GameState.playerData) return;
    const acc = GameState.playerData.Account || {};
    const time = GameState.playerData.GiaTriThoiGian || {};

    const nameEl = document.getElementById('header-player-name');
    if (nameEl) nameEl.innerText = acc.DisplayName || acc.PublisherAccount || 'Chưởng Môn';

    const lvlEl = document.getElementById('header-level');
    if (lvlEl) lvlEl.innerText = `Lv.${acc.Level || 1}`;

    const vipEl = document.getElementById('header-vip-badge');
    if (vipEl) vipEl.innerText = `VIP ${acc.Vip || 1}`;

    const knbEl = document.getElementById('header-knb');
    if (knbEl) knbEl.innerText = Number(acc.Vang || 0).toLocaleString();

    const bacEl = document.getElementById('header-bac');
    if (bacEl) bacEl.innerText = Number(acc.Bac || 0).toLocaleString();

    const expFill = document.getElementById('header-exp-fill');
    if (expFill) {
        const expPercent = Math.min(100, Math.round(((acc.Exp || 0) / (acc.ExpMax || 100)) * 100));
        expFill.style.width = `${expPercent}%`;
    }

    const expText = document.getElementById('header-exp-text');
    if (expText) expText.innerText = `${acc.Exp || 0}/${acc.ExpMax || 100}`;

    const staminaEl = document.getElementById('header-stamina');
    if (staminaEl) staminaEl.innerText = `${time.LuotNV ?? 30}/${time.LuotNVMax || 30}`;
}"""

# Normalize line endings
js_code_norm = js_code.replace('\r\n', '\n')
target_func_norm = target_func.replace('\r\n', '\n')
replacement_func_norm = replacement_func.replace('\r\n', '\n')

if target_func_norm in js_code_norm:
    js_code_norm = js_code_norm.replace(target_func_norm, replacement_func_norm)
    with open(r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/js/game.js', 'w', encoding='utf-8') as f:
        f.write(js_code_norm)
    print("Successfully updated updateHeader() in game.js with 100% defensive null-checks!")
else:
    print("Could not find exact target_func in game.js!")
