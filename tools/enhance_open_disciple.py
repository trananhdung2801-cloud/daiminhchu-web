import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\js\game.js", "r", encoding="utf-8") as f:
    js = f.read()

old_open = """function openDiscipleDetailModal(code) {
    sound.play('click');
    const modal = document.getElementById('disciple-detail-modal');
    if (!modal) return;
    if (code && GameState.playerData && GameState.playerData.NhanVat) {
        const found = GameState.playerData.NhanVat.find(d => (d.name || d.Code) === code);
        if (found) GameState.selectedDiscipleId = found.id || found.Id;
    }
    renderScrollPainting();
    modal.classList.add('active');
}"""

new_open = """function openDiscipleDetailModal(code) {
    sound.play('click');
    const modal = document.getElementById('disciple-detail-modal');
    if (!modal) return;
    if (code) {
        if (GameState.playerData && GameState.playerData.NhanVat) {
            const found = GameState.playerData.NhanVat.find(d => (d.name || d.Code) === code);
            if (found) {
                GameState.selectedDiscipleId = found.id || found.Id;
                GameState.selectedDiscipleCode = null;
            } else {
                GameState.selectedDiscipleCode = code;
            }
        } else {
            GameState.selectedDiscipleCode = code;
        }
    } else {
        GameState.selectedDiscipleCode = null;
        if (GameState.selectedFormationDiscipleId) {
            GameState.selectedDiscipleId = GameState.selectedFormationDiscipleId;
        }
    }
    renderScrollPainting();
    modal.classList.add('active');
}"""

old_render_start = """function renderScrollPainting() {
    if (!GameState.playerData || !GameState.playerData.NhanVat) return;
    const disciples = GameState.playerData.NhanVat;
    let current = disciples.find(d => (d.id || d.Id) === (GameState.selectedDiscipleId || GameState.selectedFormationDiscipleId)) || disciples[0];
    if (!current) return;"""

new_render_start = """function renderScrollPainting() {
    let current = null;
    if (GameState.selectedDiscipleCode) {
        current = {
            name: GameState.selectedDiscipleCode,
            level: 495,
            mau: 3542428,
            cong: 194374,
            thu: 6362385,
            noicong: 787139464,
            CaiTao: 0,
            exp: 27256563248,
            expMax: 154269351936,
            giaTri: 11995335,
            skillLvl: 41
        };
    } else if (GameState.playerData && GameState.playerData.NhanVat) {
        const disciples = GameState.playerData.NhanVat;
        current = disciples.find(d => (d.id || d.Id) === (GameState.selectedDiscipleId || GameState.selectedFormationDiscipleId)) || disciples[0];
    }
    if (!current) {
        current = {
            name: 'NV_HuongHuongCongChua',
            level: 495,
            mau: 3542428,
            cong: 194374,
            thu: 6362385,
            noicong: 787139464,
            CaiTao: 0,
            exp: 27256563248,
            expMax: 154269351936,
            giaTri: 11995335,
            skillLvl: 41
        };
    }"""

js = js.replace(old_open, new_open)
js = js.replace(old_render_start, new_render_start)

with open(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\js\game.js", "w", encoding="utf-8") as f:
    f.write(js)

print("Applied enhanced openDiscipleDetailModal & preview fallback!")
