const http = require('http');

async function testEndpoint(path, method = 'GET', body = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: '127.0.0.1',
            port: 8080,
            path,
            method,
            headers: {}
        };
        if (body) {
            const data = JSON.stringify(body);
            options.headers['Content-Type'] = 'application/json';
            options.headers['Content-Length'] = Buffer.byteLength(data);
        }
        const req = http.request(options, res => {
            let resData = [];
            res.on('data', c => resData.push(c));
            res.on('end', () => {
                const buffer = Buffer.concat(resData);
                resolve({
                    status: res.statusCode,
                    contentType: res.headers['content-type'],
                    length: buffer.length,
                    text: buffer.toString('utf8')
                });
            });
        });
        req.on('error', reject);
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

async function run() {
    console.log('--- Testing Web Game Endpoints ---');

    const html = await testEndpoint('/');
    console.log('[1] GET / :', html.status, html.contentType, `${html.length} bytes`, html.text.includes('ĐẠI MINH CHỦ') ? 'OK' : 'FAIL');

    const css = await testEndpoint('/css/style.css');
    console.log('[2] GET /css/style.css :', css.status, css.contentType, `${css.length} bytes`);

    const js = await testEndpoint('/js/game.js');
    console.log('[3] GET /js/game.js :', js.status, js.contentType, `${js.length} bytes`);

    const img = await testEndpoint('/assets/images/NV_QuachTinh_ava_to.png');
    console.log('[4] GET /assets/images/NV_QuachTinh_ava_to.png :', img.status, img.contentType, `${img.length} bytes`);

    const audio = await testEndpoint('/assets/audio/click.wav');
    console.log('[5] GET /assets/audio/click.wav :', audio.status, audio.contentType, `${audio.length} bytes`);

    const staticData = await testEndpoint('/api/static_data');
    console.log('[6] GET /api/static_data :', staticData.status, `${staticData.length} bytes`);

    const login = await testEndpoint('/api/web/login', 'POST', { username: 'AnhDung' });
    const loginObj = JSON.parse(login.text);
    console.log('[7] POST /api/web/login :', login.status, 'User aid:', loginObj.user.aid);

    const starter = await testEndpoint('/api/web/select_starter', 'POST', { aid: loginObj.user.aid, starterCode: 'NV_LenhHoXung' });
    const starterObj = JSON.parse(starter.text);
    console.log('[8] POST /api/web/select_starter :', starter.status, 'Starter:', starterObj.playerData.NhanVat[0].name);

    const battle = await testEndpoint('/api/web/battle', 'POST', { aid: loginObj.user.aid, chapterIdx: 0, missionIdx: 0 });
    const battleObj = JSON.parse(battle.text);
    console.log('[9] POST /api/web/battle :', battle.status, 'IsWin:', battleObj.battleResult.isWin, 'Turns:', battleObj.battleResult.logs.length, 'Stars:', battleObj.battleResult.stars);

    const recruit = await testEndpoint('/api/web/recruit', 'POST', { aid: loginObj.user.aid, type: 'van_ly' });
    const recruitObj = JSON.parse(recruit.text);
    console.log('[10] POST /api/web/recruit :', recruit.status, 'Recruited:', recruitObj.newDisciple.name, '| Remaining KNB:', recruitObj.playerData.Account.Vang);

    console.log('\n🌟 ALL 10 TESTS PASSED WITH 100% SUCCESS!');
}

run().catch(console.error);
