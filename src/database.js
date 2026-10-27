const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');
const configLoader = require('./configLoader');

const DB_PATH = path.join(__dirname, '..', 'data', 'game.db');

class DatabaseManager {
    constructor() {
        const dataDir = path.dirname(DB_PATH);
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        this.db = new DatabaseSync(DB_PATH);
        this.initTables();
    }

    initTables() {
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                aid INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                token TEXT,
                created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS player_data (
                aid INTEGER PRIMARY KEY,
                data_json TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                FOREIGN KEY (aid) REFERENCES users (aid)
            );
        `);
    }

    findUserByUsername(username) {
        const stmt = this.db.prepare('SELECT * FROM users WHERE username = ?');
        return stmt.get(username);
    }

    findUserByToken(token) {
        if (!token) return null;
        const stmt = this.db.prepare('SELECT * FROM users WHERE token = ?');
        return stmt.get(token);
    }

    findUserByAid(aid) {
        const stmt = this.db.prepare('SELECT * FROM users WHERE aid = ?');
        return stmt.get(aid);
    }

    getLastActiveAid() {
        const u = this.findUserByUsername('MinhChu');
        if (u) return u.aid;
        const row = this.db.prepare('SELECT aid FROM player_data ORDER BY updated_at DESC LIMIT 1').get();
        return row ? row.aid : 1;
    }

    createUser(username, password) {
        const now = new Date().toISOString();
        const token = 'TOKEN_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
        const stmt = this.db.prepare(`
            INSERT INTO users (username, password, token, created_at)
            VALUES (?, ?, ?, ?)
        `);
        const result = stmt.run(username, password, token, now);
        return {
            aid: Number(result.lastInsertRowid),
            username,
            token
        };
    }

    updateUserToken(aid, token) {
        const stmt = this.db.prepare('UPDATE users SET token = ? WHERE aid = ?');
        stmt.run(token, aid);
    }

    getPlayerData(aid) {
        const stmt = this.db.prepare('SELECT data_json FROM player_data WHERE aid = ?');
        const row = stmt.get(aid);
        if (!row || !row.data_json) return null;
        try {
            const data = JSON.parse(row.data_json);
            if (!data.GiangHoProgress) {
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
            return data;
        } catch (e) {
            console.error('[DB] Error parsing player data for aid', aid, e);
            return null;
        }
    }

    savePlayerData(aid, data) {
        const json = JSON.stringify(data);
        const now = new Date().toISOString();
        const stmt = this.db.prepare(`
            INSERT INTO player_data (aid, data_json, updated_at)
            VALUES (?, ?, ?)
            ON CONFLICT(aid) DO UPDATE SET data_json = excluded.data_json, updated_at = excluded.updated_at
        `);
        stmt.run(aid, json, now);
    }

    /**
     * Initializes default game state for a new player once they select their starter disciple.
     */
    createInitialPlayerData(aid, username, starterNvCode) {
        configLoader.loadAll();
        const nvCfg = configLoader.getNhanVat(starterNvCode) || {};
        const defaultVcCode = nvCfg.VoCongMacDinh || 'VC_VoDanhChuongPhap';

        const nowIso = new Date().toISOString().replace('Z', '');

        const initialData = {
            ErrorCode: 1,
            ErrorMsg: '',
            Account: {
                DisplayName: username || 'Minh Chủ',
                PublisherAccount: username || 'Minh Chủ',
                Level: 1,
                Exp: 0,
                ExpMax: 100,
                Bac: 500000,
                Vang: 2000,
                Vip: 1,
                RegisterTime: nowIso,
                SoLuotVanTieu: 3,
                SoLuotCuopTieu: 5,
                TanThuFlag: 1,
                GoiVipFlag: 0,
                LoaiTra: 0,
                SoGoiTra: 0,
                SoLuotChonTraMienPhi: 1,
                SoLuotUongTra: 0,
                SoTienDaNap: 0,
                MauKhauQuyetLvl: 0,
                CongKhauQuyetLvl: 0,
                ThuKhauQuyetLvl: 0,
                NoiLucKhauQuyetLvl: 0,
                MauKhauQuyetExp: 0,
                CongKhauQuyetExp: 0,
                ThuKhauQuyetExp: 0,
                NoiLucKhauQuyetExp: 0,
                DoanDuCount: 0,
                DoanDuToDayCount: 0,
                DoanDuTime: nowIso,
                CaoNhanAllCount: 0,
                CaoNhan: '',
                ThuongNhanThanBi: '',
                NhiemVuHangNgay: '',
                DanhHieuBanTau: 0,
                DanhHieuBatMon: '',
                GhiChuUser: '',
                DanhHieuGameViet: 0,
                DanhSachDatCuocWorldCup: []
            },
            DoiHinh: {
                slot1: 1,
                slot2: 0,
                slot3: 0,
                slot4: 0,
                slot5: 0,
                slot6: 0,
                slot7: 0,
                slot8: 0,
                thattinh1: 0,
                thattinh2: 0,
                thattinh3: 0,
                thattinh4: 0,
                thattinh5: 0,
                thattinh6: 0,
                thattinh7: 0,
                thattinh8: 0,
                thattinh9: 0,
                thattinh10: 0,
                levelThatTinh1: 0,
                levelThatTinh2: 0,
                levelThatTinh3: 0,
                levelThatTinh4: 0,
                levelThatTinh5: 0,
                levelThatTinh6: 0,
                levelThatTinh7: 0,
                levelThatTinh8: 0,
                levelThatTinh9: 0,
                levelThatTinh10: 0,
                amtran1: 0,
                amtran2: 0,
                amtran3: 0,
                amtran4: 0,
                amtran5: 0,
                amtran6: 0,
                amtran7: 0,
                amtran8: 0,
                amtran9: 0,
                amtran10: 0,
                nvLongTran1: 0,
                nvLongTran2: 0,
                nvLongTran3: 0,
                nvLongTran4: 0,
                nvLongTran5: 0,
                lcLongTran1: 0,
                lcLongTran2: 0,
                lcLongTran3: 0,
                lcLongTran4: 0,
                lcLongTran5: 0,
                _HauCung1: 0,
                _HauCung2: 0,
                _HauCung3: 0,
                _HauCung4: 0,
                _HauCung5: 0,
                _HauCung6: 0,
                _HauCung7: 0,
                _HauCung8: 0
            },
            NhanVat: [
                {
                    id: 1,
                    name: starterNvCode,
                    level: 1,
                    exp: 0,
                    expMax: 100,
                    mau: nvCfg.MauCoSo || 100,
                    cong: nvCfg.CongCoSo || 50,
                    thu: nvCfg.ThuCoSo || 40,
                    noicong: nvCfg.NoiLucCoSo || 60,
                    voCong1Level: 1,
                    kyNgoCocLevel: 0,
                    voCong2ID: 0,
                    voCong3ID: 0,
                    voCong4ID: 0,
                    vuKhiID: 0,
                    aoGiapID: 0,
                    trangSucID: 0,
                    thoiTrangID: 0,
                    longChauID: 0,
                    amKhiID: 0,
                    orb1ID: 0,
                    orb2ID: 0,
                    orb3ID: 0,
                    orb4ID: 0,
                    orb5ID: 0,
                    orb6ID: 0,
                    orb7ID: 0,
                    orb8ID: 0,
                    uongTraTiemLuc: 0,
                    themHonTiemLucLevel: 0,
                    kimCham1ID: 0,
                    kimCham2ID: 0,
                    kimCham3ID: 0,
                    kimCham4ID: 0,
                    kimCham5ID: 0,
                    kimCham6ID: 0,
                    kimCham7ID: 0,
                    kimCham8ID: 0,
                    epDuyen: '',
                    epDuyenCount: 0,
                    danDuocTiemLuc: 0,
                    capHoangKimVoCong: 0,
                    capHoangKimNhanVat: 0
                }
            ],
            HonNhanVat: [],
            TrangBi: [],
            VoCong: [
                {
                    iD: 1,
                    name: defaultVcCode,
                    level: 1,
                    equipNhanVatID: 1,
                    capHoangKim: 0
                }
            ],
            Orb: [],
            VatPhamTieuThu: [
                {
                    iD: 1,
                    name: 'VP_GaQuay',
                    quantity: 5
                },
                {
                    iD: 2,
                    name: 'VP_RuouNuNhiHong',
                    quantity: 5
                }
            ],
            TanChuong: [],
            GiangHoProgress: {
                maxChapterIdx: 0,
                maxMissionIdx: 0
            },
            GiangHo: [
                {
                    giangHoIndx: 0,
                    hoanThanh: 0,
                    nhiemvu: '0'
                }
            ],
            DanhSon: [],
            Mails: [],
            BanBe: [],
            LongChau: [],
            AmKhi: [],
            KimCham: [],
            LuanKiem: {
                id: 1,
                hang: 1000,
                luotLk: 10,
                diemTichLuy: 0,
                lastTimeGetDiem: nowIso,
                getRewardTop1000: 0,
                getRewardTop500: 0,
                getRewardTop200: 0,
                getRewardTop100: 0,
                getRewardTop50: 0,
                getRewardTop10: 0,
                getRewardTop1: 0
            },
            MoiRuou: {
                moiRuouCount: 0,
                nhanRuouCount: 0,
                shareFB: 0,
                doiVp1: 0,
                doiVp2: 0,
                doiVp3: 0,
                doiVp4: 0,
                tichLuyNapKNB: 0
            },
            LienMinh: {
                aid: aid,
                lienMinhID: 0,
                status: 0,
                congHien: 0,
                congHienFreeCount: 0,
                hacMocNhaiEnable: 0,
                hacMocLenhUsed: 0,
                xoSoLienMinh: 0,
                giaXoSoLienMinh: 0,
                thoigianThamGiaHacMocNhai: nowIso,
                DiemHoangBang: 0,
                IsLastHitHoangBang: false,
                LevelBuff: 0,
                ExpBuff: 0,
                Level: 0
            },
            DanhHieu: {
                aid: aid,
                giangHoHaoKiet: 0,
                quyTanThanPhan: 0,
                kyKiemThienHa: 0,
                ducHuyetPhanChien: 0,
                dungSiXungTran: 0,
                tuyTamVoHoc: 0,
                tamLongThamNguyet: 0,
                soLanDongNhan: 0,
                soLanTanChuong: 0
            },
            GiaTriThoiGian: {
                LuotNV: 30,
                LuotNVMax: 30,
                LuotTD: 30,
                LuotTDMax: 30,
                LastTimeGetLuotNV: nowIso,
                LastTimeGetLuotTD: nowIso,
                TimeServer: nowIso,
                LayNhanVat1Time: nowIso,
                LayNhanVat1Num: 0,
                LayNhanVat2Time: nowIso,
                LayNhanVat3Time: nowIso,
                LayNVCount1: 0,
                LayNVCount2: 0,
                LayNVCount3: 0,
                LastTimeLogin: nowIso,
                LatTheBai: 0,
                LuyenKhiType: 0,
                LuyenKhiTime: nowIso,
                AnGaCount: 0,
                EventOanTuTiStatus: 0,
                EventOanTuTiTime: nowIso,
                EventOanTuTiVatPham: '',
                DenLongCount: 0,
                NhanVatBeQuanID: 0,
                BeQuanTime: nowIso,
                DenLongTime: nowIso,
                HuaNguyen: 0,
                LastTimeDanhNhanhGH: nowIso,
                PhucHoiTheLucToDay: 0,
                PhucHoiKhiLucToDay: 0
            },
            ServerInfo: {
                ruongMayMan: '',
                countRuongMayMan: 0,
                timeHanNgoc: nowIso,
                timeTyVo: nowIso,
                goiVatPham: '',
                phieuLuuDoanDu: '',
                lockTinhNang: '',
                eventNhatTamNhiDung: '',
                moiRuou: '',
                bauCua: '',
                vuongNguYen: '',
                thanLongDaoVatPham: '',
                kyNgoDoiVatPham: '',
                eventWorldCup: '',
                napXuNhanThuong: '',
                tichLuyTieu: '',
                eventTrungThu: '',
                eventThuongTet: '',
                HapHuyetGiapHeSo: [],
                HapHuyetHeSo: [],
                PhaChanGiapHeSo: [],
                PhaChanHeSo: [],
                CangKhiGiapHeSo: [],
                CangKhiHeSo: [],
                PhanChanGiapHeSo: [],
                PhanChanHeSo: [],
                KhiHuyetGiapHeSo: [],
                KhiHuyetHeSo: [],
                HoTheGiapHeSo: [],
                HoTheHeSo: [],
                RuongThachSanhTime: nowIso,
                EventKhieuChienInfo: '',
                MiniBoss: '',
                FlappyDieuTime: nowIso
            }
        };

        this.savePlayerData(aid, initialData);
        return initialData;
    }
}

const dbInstance = new DatabaseManager();
module.exports = dbInstance;
