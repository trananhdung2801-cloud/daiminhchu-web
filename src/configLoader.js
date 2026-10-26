const fs = require('fs');
const path = require('path');

const CONFIG_DIR = path.join(__dirname, '..', 'data', 'config');

class ConfigLoader {
    constructor() {
        this.nhanVat = {};
        this.trangBi = {};
        this.voCong = {};
        this.giangHo = [];
        this.other = {};
        this.vatPhamTieuThu = {};
        this.chanKhi = {};
        this.kimCham = {};
        this.longChau = {};
        this.huyetChien = {};
        this.isLoaded = false;
    }

    loadAll() {
        if (this.isLoaded) return;

        try {
            this.nhanVat = this._loadJson('NhanVat.txt') || {};
            this.trangBi = this._loadJson('TrangBi.txt') || {};
            this.voCong = this._loadJson('VoCong.txt') || {};
            this.giangHo = this._loadJson('GiangHo.txt') || [];
            this.other = this._loadJson('Other.txt') || {};
            this.vatPhamTieuThu = this._loadJson('VatPhamTieuThu.txt') || {};
            this.chanKhi = this._loadJson('ChanKhi.txt') || {};
            this.kimCham = this._loadJson('KimCham.txt') || {};
            this.longChau = this._loadJson('LongChau.txt') || {};
            this.huyetChien = this._loadJson('HuyetChien.txt') || {};
            this.isLoaded = true;

            console.log(`[ConfigLoader] Loaded static data:`);
            console.log(`  - NhanVat: ${Object.keys(this.nhanVat).length} characters`);
            console.log(`  - TrangBi: ${Object.keys(this.trangBi).length} equipment items`);
            console.log(`  - VoCong: ${Object.keys(this.voCong).length} martial arts skills`);
            console.log(`  - GiangHo: ${this.giangHo.length} chapters/maps`);
        } catch (err) {
            console.error('[ConfigLoader] Error loading config files:', err);
        }
    }

    _loadJson(fileName) {
        const filePath = path.join(CONFIG_DIR, fileName);
        if (!fs.existsSync(filePath)) {
            console.warn(`[ConfigLoader] Warning: ${fileName} not found at ${filePath}`);
            return null;
        }
        const raw = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(raw);
    }

    getNhanVat(codeName) {
        return this.nhanVat[codeName] || null;
    }

    getTrangBi(codeName) {
        return this.trangBi[codeName] || null;
    }

    getVoCong(codeName) {
        return this.voCong[codeName] || null;
    }
}

const configLoaderInstance = new ConfigLoader();
module.exports = configLoaderInstance;
