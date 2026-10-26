const url = require('url');
const path = require('path');
const fs = require('fs');
const querystring = require('querystring');
const crypto = require('./crypto');
const authRoutes = require('./routes/auth');
const webApi = require('./routes/webApi');
const configLoader = require('./configLoader');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.ico': 'image/x-icon',
    '.svg': 'image/svg+xml'
};

function serveStaticFile(req, res, pathname) {
    let safePath = path.normalize(decodeURIComponent(pathname)).replace(/^(\.\.[\/\\])+/, '');
    if (safePath === '/' || safePath === '\\' || safePath === '') {
        safePath = 'index.html';
    }

    const filePath = path.join(PUBLIC_DIR, safePath);
    if (!filePath.startsWith(PUBLIC_DIR)) {
        res.writeHead(403);
        res.end('Forbidden');
        return true;
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        res.writeHead(200, {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=86400'
        });
        fs.createReadStream(filePath).pipe(res);
        return true;
    }
    return false;
}

function sendJson(res, statusCode, data) {
    const json = JSON.stringify(data);
    res.writeHead(statusCode, {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end(json);
}

function handleHttpRequest(req, res) {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname || '';

    // CORS preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        res.end();
        return;
    }

    // 1. Web REST API
    if (pathname === '/api/static_data' && req.method === 'GET') {
        return sendJson(res, 200, webApi.getStaticData());
    }

    if (pathname.startsWith('/api/web/') && req.method === 'POST') {
        let bodyRaw = '';
        req.on('data', chunk => bodyRaw += chunk);
        req.on('end', () => {
            let body = {};
            try { if (bodyRaw) body = JSON.parse(bodyRaw); } catch (e) {}

            const action = pathname.replace('/api/web/', '').toLowerCase();
            let result = { success: false, error: 'Unknown action' };

            switch (action) {
                case 'login':
                    result = webApi.login(body);
                    break;
                case 'register':
                    result = webApi.register(body);
                    break;
                case 'select_starter':
                    result = webApi.selectStarter(body);
                    break;
                case 'get_state':
                    result = webApi.getState(body);
                    break;
                case 'battle':
                    result = webApi.battleGiangHo(body);
                    break;
                case 'recruit':
                    result = webApi.recruitDisciple(body);
                    break;
                case 'set_formation':
                    result = webApi.setFormation(body);
                    break;
                case 'use_item':
                    result = webApi.useItem(body);
                    break;
                case 'recharge':
                    result = webApi.recharge(body);
                    break;
                case 'admin_action':
                    result = webApi.adminAction(body);
                    break;
                case 'boiduong':
                    result = webApi.boiduong(body);
                    break;
                case 'get_luankiem':
                    result = webApi.getLuankiem(body);
                    break;
                case 'challenge_luankiem':
                    result = webApi.challengeLuankiem(body);
                    break;
                case 'eat_chicken':
                    result = webApi.eatChicken(body);
                    break;
                case 'open_treasure':
                    result = webApi.openTreasureBox(body);
                    break;
                case 'huyetchien_get_state':
                    result = webApi.huyetChienGetState(body);
                    break;
                case 'huyetchien_fight':
                    result = webApi.huyetChienFight(body);
                    break;
                case 'huyetchien_buff':
                    result = webApi.huyetChienBuff(body);
                    break;
                case 'kinhmach_upgrade':
                    result = webApi.kinhMachUpgrade(body);
                    break;
                case 'chankhi_equip':
                    result = webApi.chanKhiEquip(body);
                    break;
                case 'truyencong':
                    result = webApi.truyenCong(body);
                    break;
                case 'tayduyen':
                    result = webApi.tayDuyen(body);
                    break;
                case 'bequan_action':
                    result = webApi.beQuanAction(body);
                    break;
                case 'lienminh_action':
                    result = webApi.lienMinhAction(body);
                    break;
                case 'giftcode_redeem':
                    result = webApi.giftcodeRedeem(body);
                    break;
                case 'get_server_rankings':
                    result = webApi.getServerRankings(body);
                    break;
                case 'vantieu_action':
                    result = webApi.vantieuAction(body);
                    break;
                case 'boss_thandieu_action':
                    result = webApi.bossThanDieuAction(body);
                    break;
                case 'thantientyty_action':
                    result = webApi.thanTienTyTyAction(body);
                    break;
                case 'tinhluyen_action':
                    result = webApi.tinhLuyenAction(body);
                    break;
                case 'khobau_action':
                    result = webApi.khobauAction(body);
                    break;
                default:
                    return sendJson(res, 404, result);
            }
            return sendJson(res, 200, result);
        });
        return;
    }

    // 2. Mobile ASMX / AES POST Requests
    if (req.method === 'POST') {
        let rawBody = '';
        req.on('data', chunk => rawBody += chunk);
        req.on('end', () => {
            let reqData = {};
            try {
                let cipherText = '';
                if (rawBody.startsWith('data=')) {
                    cipherText = decodeURIComponent(rawBody.substring(5));
                } else if (rawBody.includes('data=')) {
                    const parsed = querystring.parse(rawBody);
                    cipherText = parsed.data || '';
                } else {
                    cipherText = rawBody;
                }

                if (cipherText) {
                    const decryptedJson = crypto.decrypt(cipherText);
                    reqData = JSON.parse(decryptedJson);
                }
            } catch (err) {
                console.error('[HTTP] Error decrypting mobile request:', err.message);
            }

            const pathParts = pathname.split('/').filter(Boolean);
            const action = pathParts.length > 0 ? pathParts[pathParts.length - 1].toLowerCase() : '';
            let responseObj = null;

            switch (action) {
                case 'login':
                case 'directlogin':
                case 'loginsoha':
                    responseObj = authRoutes.handleLogin(reqData);
                    break;
                case 'checkuser':
                case 'userappendserver':
                    responseObj = authRoutes.handleCheckUser(reqData);
                    break;
                case 'selectstartnv':
                case 'selectstartnhanvat':
                    responseObj = authRoutes.handleSelectStartNV(reqData);
                    break;
                case 'getuserinfo':
                    responseObj = authRoutes.handleGetUserInfo(reqData);
                    break;
                default:
                    responseObj = { ErrorCode: 1, ErrorMsg: '' };
                    break;
            }

            const responseJson = JSON.stringify(responseObj);
            const encryptedResponse = crypto.encrypt(responseJson);

            res.writeHead(200, {
                'Content-Type': 'text/plain; charset=utf-8',
                'Content-Length': Buffer.byteLength(encryptedResponse)
            });
            res.end(encryptedResponse);
        });
        return;
    }

    // 3. Static File Server for Web Game
    if (req.method === 'GET') {
        const handled = serveStaticFile(req, res, pathname);
        if (!handled) {
            serveStaticFile(req, res, 'index.html');
        }
    }
}

module.exports = {
    handleHttpRequest
};
