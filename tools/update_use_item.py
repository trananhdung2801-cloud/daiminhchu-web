import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/routes/webApi.js', 'r', encoding='utf-8') as f:
    c = f.read()

old_use_item = '''    useItem(body) {
        const aid = Number(body.aid);
        const itemCode = body.itemCode;

        const playerData = db.getPlayerData(aid);
        if (!playerData) return { success: false, error: 'No player data' };

        const item = playerData.VatPhamTieuThu.find(vp => vp.name === itemCode);
        if (!item || item.quantity <= 0) {
            return { success: false, error: 'Vật phẩm đã hết!' };
        }

        item.quantity -= 1;
        if (itemCode === 'VP_GaQuay') {
            playerData.GiaTriThoiGian.LuotNV = Math.min(30, playerData.GiaTriThoiGian.LuotNV + 15);
        } else if (itemCode === 'VP_RuouNuNhiHong') {
            playerData.GiaTriThoiGian.LuotTD = Math.min(30, playerData.GiaTriThoiGian.LuotTD + 15);
        }

        db.savePlayerData(aid, playerData);
        return {
            success: true,
            playerData
        };
    }'''

new_use_item = '''    useItem(body) {
        const aid = Number(body.aid);
        const itemCode = body.itemCode;
        const count = Math.max(1, Number(body.count || 1));

        const playerData = db.getPlayerData(aid);
        if (!playerData) return { success: false, error: 'No player data' };

        playerData.VatPhamTieuThu = playerData.VatPhamTieuThu || [];
        const item = playerData.VatPhamTieuThu.find(vp => vp.name === itemCode);
        if (!item || item.quantity < count) {
            return { success: false, error: `Không đủ số lượng vật phẩm (Cần ${count})!` };
        }

        item.quantity -= count;
        let message = `Đã sử dụng thành công ${count} vật phẩm!`;

        if (itemCode === 'VP_GaQuay') {
            playerData.GiaTriThoiGian.LuotNV = (playerData.GiaTriThoiGian.LuotNV || 0) + count * 15;
            message = `Đã dùng ${count} Gà Quay, hồi phục +${count * 15} Thể Lực!`;
        } else if (itemCode === 'VP_RuouNuNhiHong' || itemCode === 'VP_BinhRuou') {
            playerData.GiaTriThoiGian.LuotTD = (playerData.GiaTriThoiGian.LuotTD || 0) + count * 15;
            message = `Đã dùng ${count} Rượu Nữ Nhi Hồng, hồi phục +${count * 15} Khí Lực!`;
        } else if (itemCode === 'VP_BachNienSam') {
            // Boost HP for disciples
            for (const nv of (playerData.NhanVat || [])) {
                nv.mau = (nv.mau || 500) + count * 50;
            }
            message = `Đã dùng ${count} Bách Niên Sâm, bồi bổ tăng vĩnh viễn +${count * 50} Khí Huyết cho toàn bộ đệ tử!`;
        } else if (itemCode === 'VP_BoiDuongDan') {
            for (const nv of (playerData.NhanVat || [])) {
                nv.cong = (nv.cong || 300) + count * 20;
                nv.thu = (nv.thu || 200) + count * 15;
                nv.noicong = (nv.noicong || 250) + count * 25;
            }
            message = `Đã dùng ${count} Bồi Dưỡng Đan, kích phát kinh mạch tăng Vũ Lực, Hộ Thể và Nội Lực cho các đệ tử!`;
        } else if (itemCode === 'VP_BaoRuong' || itemCode === 'VP_RuongMayMan' || itemCode === 'VP_HopVang' || itemCode === 'VP_BitTat') {
            const rewardVang = count * 60;
            const rewardBac = count * 15000;
            playerData.Account.Vang = (playerData.Account.Vang || 0) + rewardVang;
            playerData.Account.Bac = (playerData.Account.Bac || 0) + rewardBac;
            message = `Khai mở ${count} bảo rương thành công!\nNhận được: +${rewardVang.toLocaleString()} KNB, +${rewardBac.toLocaleString()} Ngân Lượng!`;
        }

        db.savePlayerData(aid, playerData);
        return {
            success: true,
            message,
            playerData
        };
    }'''

c_norm = c.replace('\r\n', '\n')
old_norm = old_use_item.replace('\r\n', '\n')
new_norm = new_use_item.replace('\r\n', '\n')

if old_norm in c_norm:
    c_norm = c_norm.replace(old_norm, new_norm)
    with open('src/routes/webApi.js', 'w', encoding='utf-8') as f:
        f.write(c_norm)
    print('Updated useItem in webApi.js successfully!')
else:
    print('Error: old_use_item not found in webApi.js')
