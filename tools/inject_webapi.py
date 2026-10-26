import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/src/routes/webApi.js', 'r', encoding='utf-8') as f:
    content = f.read()

new_methods = '''
    // ================= 1. VẬN TIÊU LONG MÔN (img_08, img_22) =================
    vantieuAction(body) {
        const { aid, type, cartType, targetIndex } = body;
        const playerData = db.getPlayerData(aid);
        if (!playerData) return { success: false, error: 'Không tìm thấy dữ liệu người chơi' };

        playerData.VatPhamTieuThu = playerData.VatPhamTieuThu || [];
        playerData.VanTieu = playerData.VanTieu || {
            todayTrips: 0,
            todayRobs: 0,
            lastTripTime: null,
            activeCart: null
        };

        if (type === 'get_state') {
            return {
                success: true,
                vanTieuState: playerData.VanTieu,
                rivals: [
                    { name: 'Phúc Oai Tiêu Cục', level: 45, cartName: 'Tiêu Xa Sắt', rewardBac: 150000, rewardDan: 8 },
                    { name: 'Chấn Viễn Tiêu Cục', level: 52, cartName: 'Tiêu Xa Hoàng Kim', rewardBac: 320000, rewardDan: 18 },
                    { name: 'Vạn Lý Tiêu Xa', level: 60, cartName: 'Tiêu Xa Hoàng Kim', rewardBac: 450000, rewardDan: 25 },
                    { name: 'Gia Cát Tiêu Đoàn', level: 68, cartName: 'Tiêu Xa Thần Thú', rewardBac: 600000, rewardDan: 35 }
                ]
            };
        }

        if (type === 'start') {
            if (playerData.VanTieu.todayTrips >= 5) {
                return { success: false, error: 'Hôm nay chưởng môn đã hoàn thành tối đa 5 chuyến tiêu!' };
            }

            let costGold = 0;
            let rewardBac = 100000;
            let rewardDan = 10;
            let rewardSam = 2;
            let cartName = 'Tiêu Xa Gỗ';

            if (cartType === 'sat') {
                costGold = 50;
                rewardBac = 350000;
                rewardDan = 25;
                rewardSam = 8;
                cartName = 'Tiêu Xa Thiết Giáp';
            } else if (cartType === 'hoang_kim') {
                costGold = 150;
                rewardBac = 1000000;
                rewardDan = 60;
                rewardSam = 20;
                cartName = 'Tiêu Xa Hoàng Kim';
            }

            if (costGold > 0 && (playerData.Account.Vang || 0) < costGold) {
                return { success: false, error: `Cần ${costGold} Vàng để thuê ${cartName}!` };
            }

            if (costGold > 0) playerData.Account.Vang -= costGold;
            playerData.Account.Bac = (playerData.Account.Bac || 0) + rewardBac;

            let dan = playerData.VatPhamTieuThu.find(vp => vp.name === 'VP_BoiDuongDan');
            if (dan) dan.quantity += rewardDan; else playerData.VatPhamTieuThu.push({ name: 'VP_BoiDuongDan', quantity: rewardDan });

            let sam = playerData.VatPhamTieuThu.find(vp => vp.name === 'VP_BachNienSam');
            if (sam) sam.quantity += rewardSam; else playerData.VatPhamTieuThu.push({ name: 'VP_BachNienSam', quantity: rewardSam });

            playerData.VanTieu.todayTrips += 1;
            playerData.VanTieu.lastTripTime = new Date().toISOString();

            db.savePlayerData(aid, playerData);
            return {
                success: true,
                message: `Áp tải ${cartName} đến Biện Kinh an toàn!\nNhận thưởng: +${rewardBac.toLocaleString('vi-VN')} Bạc, +${rewardDan} Bồi Dưỡng Đan, +${rewardSam} Bách Niên Sâm!`,
                playerData,
                vanTieuState: playerData.VanTieu
            };
        }

        if (type === 'rob') {
            if (playerData.VanTieu.todayRobs >= 5) {
                return { success: false, error: 'Hôm nay chưởng môn đã hết 5 lượt cướp tiêu!' };
            }

            const rivals = [
                { name: 'Phúc Oai Tiêu Cục', rewardBac: 120000, rewardDan: 6 },
                { name: 'Chấn Viễn Tiêu Cục', rewardBac: 250000, rewardDan: 12 },
                { name: 'Vạn Lý Tiêu Xa', rewardBac: 380000, rewardDan: 20 },
                { name: 'Gia Cát Tiêu Đoàn', rewardBac: 500000, rewardDan: 30 }
            ];

            const idx = Math.min(Math.max(0, targetIndex || 0), rivals.length - 1);
            const target = rivals[idx];

            playerData.Account.Bac = (playerData.Account.Bac || 0) + target.rewardBac;
            let dan = playerData.VatPhamTieuThu.find(vp => vp.name === 'VP_BoiDuongDan');
            if (dan) dan.quantity += target.rewardDan; else playerData.VatPhamTieuThu.push({ name: 'VP_BoiDuongDan', quantity: target.rewardDan });

            playerData.VanTieu.todayRobs += 1;
            db.savePlayerData(aid, playerData);

            return {
                success: true,
                message: `Tỉ thí thắng lợi! Cướp thành công tiêu xa của [${target.name}]!\nThu hoạch: +${target.rewardBac.toLocaleString('vi-VN')} Bạc & +${target.rewardDan} Bồi Dưỡng Đan!`,
                playerData,
                vanTieuState: playerData.VanTieu
            };
        }

        return { success: false, error: 'Hành động không hợp lệ' };
    }

    // ================= 2. BOSS THẾ GIỚI: THẦN ĐIÊU PHỤC MA (img_21, img_27, img_29) =================
    bossThanDieuAction(body) {
        const { aid, type } = body;
        const playerData = db.getPlayerData(aid);
        if (!playerData) return { success: false, error: 'Không tìm thấy dữ liệu người chơi' };

        global.WorldBossState = global.WorldBossState || {
            name: 'Thần Điêu Thượng Cổ',
            maxHp: 100000000,
            currentHp: 86450000,
            status: 'Xuất Hiện (20h58)',
            rankings: [
                { rank: 1, name: 'S1.Đạt Ma Tổ Sư', damage: 18450000 },
                { rank: 2, name: 'S1.Trương Tam Phong', damage: 14200000 },
                { rank: 3, name: 'S1.Tây Môn Xuy Tuyết', damage: 11980000 },
                { rank: 4, name: 'S1.Đông Phương Bất Bại', damage: 9800000 }
            ]
        };

        playerData.BossState = playerData.BossState || {
            totalDamage: 0,
            fightsToday: 0
        };

        if (type === 'get_state') {
            return {
                success: true,
                boss: global.WorldBossState,
                playerBossState: playerData.BossState
            };
        }

        if (type === 'fight') {
            if (global.WorldBossState.currentHp <= 0) {
                return { success: false, error: 'Thần Điêu Thượng Cổ đã bị tiêu diệt! Hãy chờ lần xuất hiện kế tiếp!' };
            }

            // Calculate team attack damage
            let atkTotal = 0;
            playerData.DeTu.forEach(dt => {
                atkTotal += (dt.attack || 500) * 12 + Math.floor(Math.random() * 80000);
            });
            if (atkTotal < 500000) atkTotal = 500000 + Math.floor(Math.random() * 500000);

            global.WorldBossState.currentHp = Math.max(0, global.WorldBossState.currentHp - atkTotal);
            playerData.BossState.totalDamage += atkTotal;
            playerData.BossState.fightsToday += 1;

            // Rewards
            const rewardBac = 150000;
            const rewardDan = 8;
            const rewardSam = 3;

            playerData.Account.Bac = (playerData.Account.Bac || 0) + rewardBac;
            playerData.VatPhamTieuThu = playerData.VatPhamTieuThu || [];
            let dan = playerData.VatPhamTieuThu.find(vp => vp.name === 'VP_BoiDuongDan');
            if (dan) dan.quantity += rewardDan; else playerData.VatPhamTieuThu.push({ name: 'VP_BoiDuongDan', quantity: rewardDan });

            let sam = playerData.VatPhamTieuThu.find(vp => vp.name === 'VP_BachNienSam');
            if (sam) sam.quantity += rewardSam; else playerData.VatPhamTieuThu.push({ name: 'VP_BachNienSam', quantity: rewardSam });

            // Update rankings
            let playerRank = global.WorldBossState.rankings.find(r => r.name === (playerData.Account.TenNhanVat || 'Chưởng Môn'));
            if (playerRank) {
                playerRank.damage = playerData.BossState.totalDamage;
            } else {
                global.WorldBossState.rankings.push({
                    rank: global.WorldBossState.rankings.length + 1,
                    name: playerData.Account.TenNhanVat || 'Chưởng Môn',
                    damage: playerData.BossState.totalDamage
                });
            }
            global.WorldBossState.rankings.sort((a, b) => b.damage - a.damage);
            global.WorldBossState.rankings.forEach((r, idx) => r.rank = idx + 1);

            db.savePlayerData(aid, playerData);

            return {
                success: true,
                message: `Hiệp chiến quyết liệt!\nChưởng môn gây [${atkTotal.toLocaleString('vi-VN')}] sát thương lên Thần Điêu Thượng Cổ!\nNhận thưởng: +${rewardBac.toLocaleString('vi-VN')} Bạc, +${rewardDan} Bồi Dưỡng Đan, +${rewardSam} Bách Niên Sâm!`,
                boss: global.WorldBossState,
                playerBossState: playerData.BossState,
                damageDealt: atkTotal,
                playerData
            };
        }

        return { success: false, error: 'Hành động không hợp lệ' };
    }

    // ================= 3. THẦN TIÊN TỶ TỶ BAN THƯỞNG TUYỆT THẾ VÕ CÔNG (img_37) =================
    thanTienTyTyAction(body) {
        const { aid, type } = body;
        const playerData = db.getPlayerData(aid);
        if (!playerData) return { success: false, error: 'Không tìm thấy dữ liệu người chơi' };

        playerData.VatPhamTieuThu = playerData.VatPhamTieuThu || [];
        playerData.ThanTienTyTy = playerData.ThanTienTyTy || {
            freePrayDate: null,
            totalPrays: 0
        };

        const todayStr = new Date().toDateString();

        if (type === 'get_state') {
            const canFree = playerData.ThanTienTyTy.freePrayDate !== todayStr;
            return {
                success: true,
                canFreePray: canFree,
                totalPrays: playerData.ThanTienTyTy.totalPrays
            };
        }

        if (type === 'pray_free') {
            if (playerData.ThanTienTyTy.freePrayDate === todayStr) {
                return { success: false, error: 'Hôm nay chưởng môn đã khấn vái Thần Tiên Tỷ Tỷ rồi! Hãy quay lại ngày mai hoặc cúng dường hương án!' };
            }

            playerData.ThanTienTyTy.freePrayDate = todayStr;
            playerData.ThanTienTyTy.totalPrays += 1;

            const rewardGold = 100;
            const rewardDan = 15;
            const rewardSam = 5;

            playerData.Account.Vang = (playerData.Account.Vang || 0) + rewardGold;
            let dan = playerData.VatPhamTieuThu.find(vp => vp.name === 'VP_BoiDuongDan');
            if (dan) dan.quantity += rewardDan; else playerData.VatPhamTieuThu.push({ name: 'VP_BoiDuongDan', quantity: rewardDan });

            let sam = playerData.VatPhamTieuThu.find(vp => vp.name === 'VP_BachNienSam');
            if (sam) sam.quantity += rewardSam; else playerData.VatPhamTieuThu.push({ name: 'VP_BachNienSam', quantity: rewardSam });

            db.savePlayerData(aid, playerData);

            return {
                success: true,
                message: `Thành tâm khấn vái trước ngọc tượng Thần Tiên Tỷ Tỷ!\nĐược ban phúc: +${rewardGold} Vàng, +${rewardDan} Bồi Dưỡng Đan, +${rewardSam} Bách Niên Sâm!`,
                playerData
            };
        }

        if (type === 'pray_gold' || type === 'pray_mega') {
            const cost = type === 'pray_mega' ? 300 : 100;
            if ((playerData.Account.Vang || 0) < cost) {
                return { success: false, error: `Cần ${cost} Vàng để dâng lễ Thần Tiên Tỷ Tỷ!` };
            }

            playerData.Account.Vang -= cost;
            playerData.ThanTienTyTy.totalPrays += 1;

            const godSkills = [
                { name: 'VC_CuuDuongThanCong_vo_cong_to', title: 'Cửu Dương Thần Công [Giáp]', desc: 'Chí dương chí thuần, nội lực hộ thể vô song' },
                { name: 'VC_CanKhonDaiNaDi_vo_cong_to', title: 'Càn Khôn Đại Na Di [Giáp]', desc: 'Chuyển dời kình lực, phản chấn tuyệt đỉnh Minh Giáo' },
                { name: 'VC_LucMachThanKiem_vo_cong_to', title: 'Lục Mạch Thần Kiếm [Giáp]', desc: 'Vô hình kiếm khí, tung hoành bát hoang vô địch' },
                { name: 'VC_DocCoCuuKiem_vo_cong_to', title: 'Độc Cô Cửu Kiếm [Giáp]', desc: 'Phá hết thiên hạ võ công, dĩ vô chiêu thắng hữu chiêu' },
                { name: 'VC_QuyHoaBaoDien_vo_cong_to', title: 'Quỳ Hoa Bảo Điển [Giáp]', desc: 'Thân pháp quỷ mị, xuất chiêu thần tốc đoạt mạng' },
                { name: 'VC_GiangLongThapBatChuong_vo_cong_to', title: 'Hàng Long Thập Bát Chưởng [Giáp]', desc: 'Dương cương đệ nhất thiên hạ của Cái Bang' }
            ];

            const pickedSkill = godSkills[Math.floor(Math.random() * godSkills.length)];
            const rewardDan = type === 'pray_mega' ? 50 : 20;

            let dan = playerData.VatPhamTieuThu.find(vp => vp.name === 'VP_BoiDuongDan');
            if (dan) dan.quantity += rewardDan; else playerData.VatPhamTieuThu.push({ name: 'VP_BoiDuongDan', quantity: rewardDan });

            // Give skill item
            playerData.TrangBi = playerData.TrangBi || [];
            playerData.TrangBi.push({
                userEquipId: 'skill_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
                name: pickedSkill.name,
                displayName: pickedSkill.title,
                type: 'skill',
                quality: 'Giáp',
                star: 1,
                statBonus: { atk: 1200, def: 800, hp: 3500 }
            });

            db.savePlayerData(aid, playerData);

            return {
                success: true,
                message: `Thần Tiên Tỷ Tỷ cảm động trước lòng thành!\nBan cho Tuyệt Thế Võ Công: 【${pickedSkill.title}】!\n+${rewardDan} Bồi Dưỡng Đan!`,
                rewardSkill: pickedSkill,
                playerData
            };
        }

        return { success: false, error: 'Hành động không hợp lệ' };
    }

    // ================= 4. TINH LUYỆN TRANG BỊ & ĐÚC THẦN BINH (img_34, img_06) =================
    tinhLuyenAction(body) {
        const { aid, userEquipId, useGold } = body;
        const playerData = db.getPlayerData(aid);
        if (!playerData) return { success: false, error: 'Không tìm thấy dữ liệu người chơi' };

        playerData.TrangBi = playerData.TrangBi || [];
        const equip = playerData.TrangBi.find(e => e.userEquipId === userEquipId || e.name === userEquipId);
        if (!equip) {
            return { success: false, error: 'Không tìm thấy trang bị cần tinh luyện trong hành trang!' };
        }

        equip.star = equip.star || 0;
        if (equip.star >= 10) {
            return { success: false, error: 'Trang bị này đã đạt cấp Tinh Luyện Tối Đa (10 Sao Thần Binh)!' };
        }

        const costBac = (equip.star + 1) * 80000;
        const costGold = useGold ? 30 : 0;

        if ((playerData.Account.Bac || 0) < costBac) {
            return { success: false, error: `Cần ${costBac.toLocaleString('vi-VN')} Bạc để tinh luyện lên ${equip.star + 1} Sao!` };
        }
        if (costGold > 0 && (playerData.Account.Vang || 0) < costGold) {
            return { success: false, error: `Cần ${costGold} Vàng để dùng Huyền Thiết Tinh Hoa tăng tỉ lệ 100%!` };
        }

        playerData.Account.Bac -= costBac;
        if (costGold > 0) playerData.Account.Vang -= costGold;

        // Upgrade star
        equip.star += 1;
        equip.refineLevel = equip.star;
        equip.statBonus = equip.statBonus || { atk: 200, def: 150, hp: 800 };
        equip.statBonus.atk = Math.round((equip.statBonus.atk || 200) * 1.15);
        equip.statBonus.def = Math.round((equip.statBonus.def || 150) * 1.15);
        equip.statBonus.hp = Math.round((equip.statBonus.hp || 800) * 1.15);

        db.savePlayerData(aid, playerData);

        return {
            success: true,
            message: `Tinh Luyện Thần Binh đại thành công!\nTrang bị đạt [${equip.star} Sao] ⭐\nChỉ số tăng cường toàn diện +15%!`,
            refinedEquip: equip,
            playerData
        };
    }

    // ================= 5. ĐÀO KHO BÁU ÔN HỰU SƠN & TUYỆT TÌNH CỐC (img_04, img_18, img_24) =================
    khobauAction(body) {
        const { aid, map } = body;
        const playerData = db.getPlayerData(aid);
        if (!playerData) return { success: false, error: 'Không tìm thấy dữ liệu người chơi' };

        playerData.VatPhamTieuThu = playerData.VatPhamTieuThu || [];
        playerData.KhoBau = playerData.KhoBau || {
            onHuuSonFloor: 1,
            tuyetTinhCocFloor: 1,
            totalTreasuresOpened: 0
        };

        if (map === 'onhuuson') {
            const costBac = 50000;
            if ((playerData.Account.Bac || 0) < costBac) {
                return { success: false, error: `Cần ${costBac.toLocaleString('vi-VN')} Bạc để thám hiểm Ôn Hựu Sơn!` };
            }

            playerData.Account.Bac -= costBac;
            playerData.KhoBau.onHuuSonFloor = (playerData.KhoBau.onHuuSonFloor % 50) + 1;
            playerData.KhoBau.totalTreasuresOpened += 1;

            const rewardDan = 10;
            const rewardSam = 3;
            const rewardGold = 50;

            playerData.Account.Vang = (playerData.Account.Vang || 0) + rewardGold;
            let dan = playerData.VatPhamTieuThu.find(vp => vp.name === 'VP_BoiDuongDan');
            if (dan) dan.quantity += rewardDan; else playerData.VatPhamTieuThu.push({ name: 'VP_BoiDuongDan', quantity: rewardDan });

            let sam = playerData.VatPhamTieuThu.find(vp => vp.name === 'VP_BachNienSam');
            if (sam) sam.quantity += rewardSam; else playerData.VatPhamTieuThu.push({ name: 'VP_BachNienSam', quantity: rewardSam });

            db.savePlayerData(aid, playerData);

            return {
                success: true,
                message: `Khai mở kho báu Tầng ${playerData.KhoBau.onHuuSonFloor} Ôn Hựu Sơn!\nThu hoạch: +${rewardGold} Vàng, +${rewardDan} Bồi Dưỡng Đan, +${rewardSam} Bách Niên Sâm!`,
                playerData,
                khoBauState: playerData.KhoBau
            };
        } else if (map === 'tuyettinhcoc') {
            const costGold = 60;
            if ((playerData.Account.Vang || 0) < costGold) {
                return { success: false, error: `Cần ${costGold} Vàng để dùng La Bàn thám hiểm Tuyệt Tình Cốc!` };
            }

            playerData.Account.Vang -= costGold;
            playerData.KhoBau.tuyetTinhCocFloor = (playerData.KhoBau.tuyetTinhCocFloor % 100) + 1;
            playerData.KhoBau.totalTreasuresOpened += 1;

            const rewardBac = 300000;
            const rewardDan = 25;
            const rewardSam = 10;

            playerData.Account.Bac = (playerData.Account.Bac || 0) + rewardBac;
            let dan = playerData.VatPhamTieuThu.find(vp => vp.name === 'VP_BoiDuongDan');
            if (dan) dan.quantity += rewardDan; else playerData.VatPhamTieuThu.push({ name: 'VP_BoiDuongDan', quantity: rewardDan });

            let sam = playerData.VatPhamTieuThu.find(vp => vp.name === 'VP_BachNienSam');
            if (sam) sam.quantity += rewardSam; else playerData.VatPhamTieuThu.push({ name: 'VP_BachNienSam', quantity: rewardSam });

            db.savePlayerData(aid, playerData);

            return {
                success: true,
                message: `Vượt hiểm trở thám hiểm Tầng ${playerData.KhoBau.tuyetTinhCocFloor} Tuyệt Tình Cốc!\nPhát hiện Thần Khố: +${rewardBac.toLocaleString('vi-VN')} Bạc, +${rewardDan} Bồi Dưỡng Đan, +${rewardSam} Bách Niên Sâm!`,
                playerData,
                khoBauState: playerData.KhoBau
            };
        }

        return { success: false, error: 'Địa danh thám hiểm không hợp lệ' };
    }
'''

# Insert before the last `}` of WebApiController
last_brace = content.rfind('}')
if last_brace != -1:
    new_content = content[:last_brace] + new_methods + content[last_brace:]
    with open(r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/src/routes/webApi.js', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print('Successfully updated webApi.js with 5 new feature methods!')
else:
    print('Failed to find last brace in webApi.js')
