import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\js\game.js", "r", encoding="utf-8") as f:
    js = f.read()

old_rf = """function renderFormation() {
    if (!GameState.playerData) return;
    if (typeof currentDantranMode !== 'undefined' && currentDantranMode === 'haucung') {
        const viewMain = document.getElementById('dt-view-main');
        const viewHauCung = document.getElementById('dt-view-haucung');
        if (viewMain) viewMain.style.display = 'none';
        if (viewHauCung) viewHauCung.style.display = 'flex';
        renderHauCung();
        return;
    }"""

new_rf = """function renderFormation() {
    if (!GameState.playerData) return;
    if (typeof switchDantranMode === 'function') {
        switchDantranMode(currentDantranMode || 'doihinh');
        return;
    }"""

js = js.replace(old_rf, new_rf)

with open(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\js\game.js", "w", encoding="utf-8") as f:
    f.write(js)

print("Updated renderFormation entry point successfully!")
