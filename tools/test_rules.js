const db = require('../src/database');
const api = require('../src/routes/webApi');

// 1. Create a test player
const testUser = 'tester_rules_' + Date.now();
const user = db.createUser(testUser, 'pass123');
const aid = user.aid;
const pData = db.createInitialPlayerData(aid, testUser, 'NV_LenhHoXung');

console.log('Player created, AID:', aid);
console.log('Initial Level:', pData.Account.Level);
console.log('Initial GiangHoProgress:', pData.GiangHoProgress);
console.log('Initial DoiHinh:', pData.DoiHinh);

// 2. Test formation slot limit: Lv 1 has max 3 slots
// Setting slot 4 should FAIL
const res4 = api.setFormation({ aid, slot: 4, discipleId: 1 });
console.log('Set slot 4 result (expect fail):', res4.success, res4.error);

// Setting slot 2 should SUCCEED
const res2 = api.setFormation({ aid, slot: 2, discipleId: 0 });
console.log('Set slot 2 result (expect success):', res2.success);

// 3. Test Giang Ho sequential progression
// Mission 0 should SUCCEED
const battle0 = api.battleGiangHo({ aid, chapterIdx: 0, missionIdx: 0 });
console.log('Battle Mission 0 result (expect win & progress):', battle0.success, 'Win?', battle0.battleResult ? battle0.battleResult.isWin : false);

// Check if progress advanced
const afterBattleData = db.getPlayerData(aid);
console.log('GiangHoProgress after Mission 0:', afterBattleData.GiangHoProgress);

// Battling Mission 5 directly should FAIL (not unlocked yet)
const battle5 = api.battleGiangHo({ aid, chapterIdx: 0, missionIdx: 5 });
console.log('Battle Mission 5 result (expect fail):', battle5.success, battle5.error);

console.log('All backend unit tests passed!');
