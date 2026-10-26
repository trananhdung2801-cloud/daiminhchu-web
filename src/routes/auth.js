const db = require('../database');
const crypto = require('../crypto');

const SERVER_HOST = 'http://127.0.0.1:8080';
const SERVER_ASMX_URL = `${SERVER_HOST}/Server/Webservice/User.asmx`;

/**
 * Handle /Login request
 */
function handleLogin(reqData) {
    console.log('[Auth] Login request:', reqData);
    const username = (reqData.user || reqData.User || 'player').trim();
    const password = (reqData.pass || reqData.Pass || '123456').trim();

    let user = db.findUserByUsername(username);
    if (!user) {
        user = db.createUser(username, password);
        console.log(`[Auth] Registered new account: ${username} (aid: ${user.aid})`);
    } else {
        // Refresh token
        const newToken = 'TOKEN_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
        db.updateUserToken(user.aid, newToken);
        user.token = newToken;
    }

    const response = {
        ErrorCode: 1,
        ErrorMsg: '',
        Token: user.token,
        UserId: String(user.aid),
        SohaToken: 'SOHA_' + user.aid,
        Servers: [
            {
                serverID: 1,
                name: 'Server 1 - Hoa Sơn Luận Kiếm',
                url: SERVER_ASMX_URL,
                status: 'Tốt'
            }
        ],
        ListUserServer: [
            {
                serverID: 1,
                name: 'Server 1 - Hoa Sơn Luận Kiếm',
                url: SERVER_ASMX_URL,
                status: 'Tốt'
            }
        ],
        UrlUpdateAndroid: '',
        UrlIphoneAppstore: '',
        UrlIphoneJb: '',
        UrlWPJb: '',
        LoginCfg: {
            version: 802,
            androidUrl: '',
            appstoreUrl: '',
            jbUrl: '',
            cfgAndroidUrl: '',
            cfgAndroidCRC: 0,
            cfgIOSUrl: '',
            cfgIOSCRC: 0,
            cfgWindowUrl: '',
            cfgWindowCRC: 0,
            cfgVer: 11,
            WPUrl: '',
            cfgWPUrl: '',
            cfgWPCRC: 0
        }
    };

    return response;
}

/**
 * Handle /CheckUser request
 */
function handleCheckUser(reqData) {
    console.log('[Auth] CheckUser request:', reqData);
    const aid = Number(reqData.aid || reqData.Aid || 1);
    const serverId = Number(reqData.serverID || reqData.ServerID || 1);

    const playerData = db.getPlayerData(aid);

    const response = {
        ErrorCode: 1,
        ErrorMsg: '',
        Aid: aid,
        ServerID: serverId,
        EventAnGaLuotCount: 0,
        LoginMessage: [],
        servers: {
            systemMessage: 'Chào mừng Minh Chủ bước chân vào thế giới Kiếm Hiệp!'
        },
        // If user already picked character, return playerData, otherwise null to trigger intro selection
        UserInfo: playerData || null
    };

    return response;
}

/**
 * Handle /SelectStartNV request (when player picks their initial disciple)
 */
function handleSelectStartNV(reqData) {
    console.log('[Auth] SelectStartNV request:', reqData);
    const aid = Number(reqData.aid || reqData.Aid || 1);
    const starterCode = reqData.nhanVatCode || reqData.NhanVatCode || 'NV_LenhHoXung';

    const user = db.findUserByAid(aid);
    const username = user ? user.username : 'Minh Chủ';

    const initialPlayerData = db.createInitialPlayerData(aid, username, starterCode);
    console.log(`[Auth] Created initial character for aid ${aid} with ${starterCode}`);

    return initialPlayerData;
}

/**
 * Handle /GetUserInfo request
 */
function handleGetUserInfo(reqData) {
    console.log('[Auth] GetUserInfo request:', reqData);
    const aid = Number(reqData.aid || reqData.Aid || 1);

    let playerData = db.getPlayerData(aid);
    if (!playerData) {
        const user = db.findUserByAid(aid);
        const username = user ? user.username : 'Minh Chủ';
        playerData = db.createInitialPlayerData(aid, username, 'NV_LenhHoXung');
    }

    return playerData;
}

module.exports = {
    handleLogin,
    handleCheckUser,
    handleSelectStartNV,
    handleGetUserInfo
};
