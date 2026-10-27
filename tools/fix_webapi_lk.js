const fs = require('fs');
const path = require('path');

const webApiPath = path.join(__dirname, '..', 'src', 'routes', 'webApi.js');
let code = fs.readFileSync(webApiPath, 'utf8');

const targetStr = `    getLuankiem(body) {
        const aid = Number(body.aid) || (db.users && db.users[0] ? db.users[0].aid : 1);
        const playerData = db.getPlayerData(aid);
        if (!playerData) return { success: false, error: 'User not found' };

        // Authentic rankings from original screenshots (media_1793066389467_415a4942.jpg & media_1793066392887_120cba87.jpg)
        const topRankings = [
            {
                rank: 1,
                name: '$ CÔ CHỦ NHỎ `;

const replacementStr = `    getLuankiem(body) {
        const aid = Number(body.aid) || (db.users && db.users[0] ? db.users[0].aid : 1);
        const playerData = db.getPlayerData(aid);
        if (!playerData) return { success: false, error: 'User not found' };

        // Authentic rankings from original screenshots (media_1793066389467_415a4942.jpg & media_1793066392887_120cba87.jpg)
        const topRankings = [
            {
                rank: 1,
                name: '$ CÔ CHỦ NHỎ $',
                server: 'S19.',
                level: 371,
                point: 94185286,
                rewardBonus: 50,
                disciples: ['NV_TieuLongNu', 'NV_DuongQua', 'NV_LenhHoXung'],
                bt: [1, 1, 5],
                hasStar: false
            },
            {
                rank: 2,
                name: 'Chelsea.VN',
                server: 'S19.',
                level: 383,
                point: 88720100,
                rewardBonus: 48,
                disciples: ['NV_LenhHoXung', 'NV_DongPhuongBatBai', 'NV_TruongTamPhong'],
                bt: [1, 2, 1],
                hasStar: true
            },
            {
                rank: 3,
                name: '25/6/2020 ĐIE',
                server: 'S160.',
                level: 274,
                point: 75200300,
                rewardBonus: 46,
                disciples: ['NV_DoanDu', 'NV_HoangDung', 'NV_LenhHoXung'],
                bt: [3, 2, 4],
                hasStar: true
            },
            {
                rank: 4,
                name: 'Bingo Bingo',
                server: 'S17.',
                level: 458,
                point: 69150000,
                rewardBonus: 44,
                disciples: ['NV_TieuPhong', 'NV_HuTruc', 'NV_QuachTinh'],
                bt: [2, 3, 5],
                hasStar: true
            },
            {
                rank: 5,
                name: 'TÂYSỞBÁVƯƠNG',
                server: 'S1.',
                level: 364,
                point: 61400200,
                rewardBonus: 42,
                disciples: ['NV_DongPhuongBatBai', 'NV_DocCoCauBai', 'NV_LenhHoXung'],
                bt: [1, 2, 3],
                hasStar: true
            },
            {
                rank: 6,
                name: 'SÁT THẦN DIỆT PHẬT',
                server: 'S19.',
                level: 451,
                point: 55900000,
                rewardBonus: 40,
                disciples: ['NV_DuongQua', 'NV_TieuPhong', 'NV_HoangDung'],
                bt: [2, 4, 3],
                hasStar: true
            },
            {
                rank: 7,
                name: 'GẤU ĐẠI VƯƠNG',
                server: 'S178.',
                level: 357,
                point: 48300000,
                rewardBonus: 38,
                disciples: ['NV_QuachTinh', 'NV_HoangDung', 'NV_HongThatCong'],
                bt: [3, 3, 4],
                hasStar: true
            }
        ];

        let userRank = playerData.Account.LuankiemRank || 3222;
        let userPoints = playerData.Account.LuankiemPoints || 11730;

        return {
            success: true,
            userRank,
            userPoints,
            remainingFights: playerData.GiaTriThoiGian.LuotTD || 10,
            rankings: topRankings,
            playerData
        };
    }

    claimLuankiemReward(body) {
        const aid = Number(body.aid) || (db.users && db.users[0] ? db.users[0].aid : 1);
        const playerData = db.getPlayerData(aid);
        if (!playerData) return { success: false, error: 'User not found' };

        const rewardPts = 50;
        const rewardBac = 50000;
        playerData.Account.LuankiemPoints = (playerData.Account.LuankiemPoints || 0) + rewardPts;
        playerData.Account.Bac = (playerData.Account.Bac || 0) + rewardBac;
        db.savePlayerData(aid, playerData);

        return {
            success: true,
            message: 'Cập nhật thứ hạng thành công! Nhận thưởng giữ hạng: +' + rewardPts + ' Điểm Luận Kiếm, +' + rewardBac.toLocaleString() + ' Ngân Lượng!',
            playerData
        };
    }

    challengeLuankiem(body) {`;

code = code.replace(targetStr, replacementStr);
fs.writeFileSync(webApiPath, code, 'utf8');
console.log('Fixed webApi.js successfully');
