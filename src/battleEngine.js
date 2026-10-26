const configLoader = require('./configLoader');

/**
 * Combat Simulation Engine for Dai Minh Chu
 * Simulates turn-based combat according to character stats and skills.
 */
class BattleEngine {
    constructor() {
        configLoader.loadAll();
    }

    /**
     * Simulate a stage battle between Player's Formation and Enemy Formation.
     * @param {Array} playerFormation Array of player disciple objects
     * @param {Array} enemyFormation Array of enemy objects from GiangHo mission
     * @param {Object} mission GiangHo mission config
     */
    simulateBattle(playerFormation, enemyFormation, mission) {
        // Prepare combatants
        const teamPlayer = playerFormation.map((p, idx) => ({
            id: p.id,
            slot: idx,
            name: p.name,
            displayName: p.displayName || (configLoader.getNhanVat(p.name) || {}).TenHienThi || p.name,
            maxHp: p.mau || 100,
            currentHp: p.mau || 100,
            atk: p.cong || 50,
            def: p.thu || 40,
            inner: p.noicong || 60,
            skill: p.skillCode || (configLoader.getNhanVat(p.name) || {}).VoCongMacDinh || 'VC_VoDanhChuongPhap',
            skillLevel: p.voCong1Level || 1,
            isPlayer: true,
            isAlive: true
        }));

        const teamEnemy = enemyFormation.map((e, idx) => ({
            id: idx + 100,
            slot: idx,
            name: e.NhanVatCode,
            displayName: (configLoader.getNhanVat(e.NhanVatCode) || {}).TenHienThi || e.NhanVatCode,
            maxHp: e.Mau || 80,
            currentHp: e.Mau || 80,
            atk: e.Cong || 40,
            def: e.Thu || 30,
            inner: e.NoiLuc || 50,
            skill: e.VoCong1Code || 'VC_VoDanhKiemPhap',
            skillLevel: e.VoCong1Level || 1,
            isPlayer: false,
            isAlive: true
        }));

        const logs = [];
        let round = 1;

        // Round 1: Lane vs Lane (1v1 matching slots)
        const maxSlots = Math.max(teamPlayer.length, teamEnemy.length);
        for (let s = 0; s < maxSlots; s++) {
            const p = teamPlayer[s];
            const e = teamEnemy[s];

            if (p && e && p.isAlive && e.isAlive) {
                // Player attacks Enemy
                this._executeAttack(p, e, logs, round);
                if (e.isAlive) {
                    // Enemy counter-attacks Player
                    this._executeAttack(e, p, logs, round);
                }
            } else if (p && p.isAlive) {
                // Target next alive enemy
                const target = teamEnemy.find(t => t.isAlive);
                if (target) {
                    this._executeAttack(p, target, logs, round);
                }
            } else if (e && e.isAlive) {
                // Target next alive player
                const target = teamPlayer.find(t => t.isAlive);
                if (target) {
                    this._executeAttack(e, target, logs, round);
                }
            }

            if (this._isTeamDead(teamPlayer) || this._isTeamDead(teamEnemy)) {
                break;
            }
        }

        // Round 2: Free for all if both teams still have survivors (up to 3 turns)
        if (!this._isTeamDead(teamPlayer) && !this._isTeamDead(teamEnemy)) {
            round = 2;
            for (let turn = 0; turn < 4; turn++) {
                const alivePlayers = teamPlayer.filter(p => p.isAlive);
                const aliveEnemies = teamEnemy.filter(e => e.isAlive);

                if (alivePlayers.length === 0 || aliveEnemies.length === 0) break;

                const attackerP = alivePlayers[turn % alivePlayers.length];
                const defenderE = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
                this._executeAttack(attackerP, defenderE, logs, round);

                if (defenderE.isAlive) {
                    this._executeAttack(defenderE, attackerP, logs, round);
                }
            }
        }

        const isWin = this._isTeamDead(teamEnemy);
        const aliveCount = teamPlayer.filter(p => p.isAlive).length;
        let stars = 0;
        if (isWin) {
            if (aliveCount === teamPlayer.length) stars = 3;
            else if (aliveCount >= teamPlayer.length / 2) stars = 2;
            else stars = 1;
        }

        return {
            isWin,
            stars,
            expGained: isWin ? (mission.ExpThuong || 10) : 2,
            bacGained: isWin ? (mission.BacThuong || 50) : 10,
            teamPlayer,
            teamEnemy,
            logs
        };
    }

    _executeAttack(attacker, defender, logs, round) {
        if (!attacker.isAlive || !defender.isAlive) return;

        // Check skill trigger (35% base chance)
        const vcCfg = configLoader.getVoCong(attacker.skill) || {};
        const isSkill = Math.random() < 0.40;
        let skillName = null;
        let damage = 0;

        const variance = 0.9 + Math.random() * 0.2; // 90% - 110%

        if (isSkill) {
            skillName = vcCfg.TenHienThi || 'Võ Công';
            const skillFactor = 1.3 + (attacker.skillLevel * 0.1);
            damage = Math.round(Math.max(10, (attacker.atk * skillFactor + attacker.inner * 0.3) - defender.def * 0.8) * variance);
        } else {
            damage = Math.round(Math.max(5, (attacker.atk - defender.def * 0.7)) * variance);
        }

        const isCrit = Math.random() < 0.15;
        if (isCrit) {
            damage = Math.round(damage * 1.5);
        }

        defender.currentHp = Math.max(0, defender.currentHp - damage);
        if (defender.currentHp === 0) {
            defender.isAlive = false;
        }

        logs.push({
            round,
            attackerId: attacker.id,
            attackerSlot: attacker.slot,
            attackerName: attacker.displayName,
            isPlayerAttacker: attacker.isPlayer,
            defenderId: defender.id,
            defenderSlot: defender.slot,
            defenderName: defender.displayName,
            isSkill,
            skillName,
            damage,
            isCrit,
            defenderHpRemaining: defender.currentHp,
            isKilled: !defender.isAlive
        });
    }

    _isTeamDead(team) {
        return team.every(member => !member.isAlive);
    }
}

const battleEngineInstance = new BattleEngine();
module.exports = battleEngineInstance;
