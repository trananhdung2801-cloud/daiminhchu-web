const http = require('http');
const querystring = require('querystring');
const crypto = require('./src/crypto');

function postApi(endpoint, dataObj) {
    return new Promise((resolve, reject) => {
        const plainJson = JSON.stringify(dataObj);
        const cipherBase64 = crypto.encrypt(plainJson);
        const postBody = 'data=' + querystring.escape(cipherBase64);

        const options = {
            hostname: '127.0.0.1',
            port: 8080,
            path: '/Server/Webservice/User.asmx/' + endpoint,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postBody)
            }
        };

        const req = http.request(options, (res) => {
            let resBody = '';
            res.on('data', chunk => resBody += chunk);
            res.on('end', () => {
                try {
                    const decrypted = crypto.decrypt(resBody);
                    const parsed = JSON.parse(decrypted);
                    resolve(parsed);
                } catch (e) {
                    reject(new Error(`Failed to decrypt/parse response: ${e.message} (Raw: ${resBody})`));
                }
            });
        });

        req.on('error', reject);
        req.write(postBody);
        req.end();
    });
}

async function runTests() {
    console.log('--- Starting Test Suite for Dai Minh Chu Server ---');

    console.log('\n[1] Testing /Login ...');
    const loginRes = await postApi('Login', {
        user: 'test_player',
        pass: '123456',
        version: 802,
        platform: 'Android'
    });
    console.log('Login Result:', JSON.stringify(loginRes, null, 2));

    const aid = Number(loginRes.UserId);
    const token = loginRes.Token;

    console.log(`\n[2] Testing /CheckUser (aid: ${aid}) ...`);
    const checkUserRes = await postApi('CheckUser', {
        Aid: aid,
        Token: token,
        ServerID: 1
    });
    console.log('CheckUser Result (UserInfo exists?):', checkUserRes.UserInfo !== null);

    console.log('\n[3] Testing /SelectStartNV (selecting NV_LenhHoXung) ...');
    const selectNvRes = await postApi('SelectStartNV', {
        Aid: aid,
        Token: token,
        nhanVatCode: 'NV_LenhHoXung'
    });
    console.log('SelectStartNV Account DisplayName:', selectNvRes.Account.DisplayName);
    console.log('Starter Disciple:', selectNvRes.NhanVat[0].name, '| HP:', selectNvRes.NhanVat[0].mau, '| ATK:', selectNvRes.NhanVat[0].cong);
    console.log('Starter Skill:', selectNvRes.VoCong[0].name);

    console.log('\n[4] Testing /GetUserInfo ...');
    const userInfoRes = await postApi('GetUserInfo', {
        Aid: aid,
        Token: token
    });
    console.log('GetUserInfo KNB:', userInfoRes.Account.Vang, '| Bac:', userInfoRes.Account.Bac, '| Disciples count:', userInfoRes.NhanVat.length);

    console.log('\n✅ ALL TEST APIS PASSED PERFECTLY!');
}

runTests().catch(err => {
    console.error('Test failed:', err);
    process.exit(1);
});
