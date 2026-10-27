import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/database.js', 'r', encoding='utf-8') as f:
    c = f.read()

target = '''            if (!data.GiangHoProgress) {
                data.GiangHoProgress = { maxChapterIdx: 0, maxMissionIdx: 0 };
            }
            return data;'''

replacement = '''            if (!data.GiangHoProgress) {
                data.GiangHoProgress = { maxChapterIdx: 0, maxMissionIdx: 0 };
            }
            data.VatPhamTieuThu = data.VatPhamTieuThu || [];
            const ensureItem = (name, quantity) => {
                let existing = data.VatPhamTieuThu.find(it => it.name === name);
                if (!existing) {
                    data.VatPhamTieuThu.push({ name, quantity });
                }
            };
            ensureItem('VP_BaoRuong', 80);
            ensureItem('VP_BitTat', 608);
            ensureItem('VP_BachNienSam', 7923441);
            ensureItem('VP_GaQuay', 50);
            ensureItem('VP_RuouNuNhiHong', 50);
            ensureItem('VP_BoiDuongDan', 200);
            return data;'''

c_norm = c.replace('\r\n', '\n')
target_norm = target.replace('\r\n', '\n')
replacement_norm = replacement.replace('\r\n', '\n')

if target_norm in c_norm:
    c_norm = c_norm.replace(target_norm, replacement_norm)
    with open('src/database.js', 'w', encoding='utf-8') as f:
        f.write(c_norm)
    print('Updated getPlayerData in database.js successfully!')
else:
    print('Error: target not found in database.js')
