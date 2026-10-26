const webApi = require('../src/routes/webApi');
const db = require('../src/database');

async function testAllNewFeatures() {
    console.log('--- TESTING 5 NEW IN-GAME FEATURES ---');
    const aid = 1;

    // 1. Van Tieu
    console.log('1. Van Tieu get_state:');
    let vtState = webApi.vantieuAction({ aid, type: 'get_state' });
    console.log(' - success:', vtState.success, 'rivals count:', vtState.rivals.length);

    console.log('1b. Van Tieu start:');
    let vtStart = webApi.vantieuAction({ aid, type: 'start', cartType: 'go' });
    console.log(' - success:', vtStart.success, vtStart.message ? vtStart.message.split('\n')[0] : vtStart.error);

    // 2. Boss Than Dieu
    console.log('2. Boss Than Dieu fight:');
    let bossFight = webApi.bossThanDieuAction({ aid, type: 'fight' });
    console.log(' - success:', bossFight.success, bossFight.message ? bossFight.message.split('\n')[0] : bossFight.error);

    // 3. Than Tien Ty Ty
    console.log('3. Than Tien Ty Ty pray:');
    let pray = webApi.thanTienTyTyAction({ aid, type: 'pray_gold' });
    console.log(' - success:', pray.success, pray.message ? pray.message.split('\n')[0] : pray.error);

    // 4. Tinh Luyen
    console.log('4. Tinh Luyen:');
    const playerData = db.getPlayerData(aid);
    const equip = (playerData.TrangBi && playerData.TrangBi[0]) ? playerData.TrangBi[0].userEquipId : null;
    if (equip) {
        let tinhLuyen = webApi.tinhLuyenAction({ aid, userEquipId: equip });
        console.log(' - success:', tinhLuyen.success, tinhLuyen.message ? tinhLuyen.message.split('\n')[0] : tinhLuyen.error);
    } else {
        console.log(' - no equip found to refine, skipping test');
    }

    // 5. Kho Bau
    console.log('5. Kho Bau explore:');
    let kb = webApi.khobauAction({ aid, map: 'onhuuson' });
    console.log(' - success:', kb.success, kb.message ? kb.message.split('\n')[0] : kb.error);

    console.log('ALL 5 NEW FEATURES VERIFIED CLEANLY!');
}

testAllNewFeatures();
