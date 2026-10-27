import sys, os
sys.stdout.reconfigure(encoding='utf-8')
os.chdir(r'C:\Users\trananh.dung\Downloads\DaiMinhChu_Server')

with open('public/js/game.js', 'r', encoding='utf-8') as f:
    code = f.read()

old_func = '''function switchKyngoSubTab(tab) {
    sound.play('click');
    currentKyngoSubTab = tab;

    document.querySelectorAll('.kyngo-icon-btn').forEach(btn => btn.classList.remove('active'));
    const btn = document.getElementById('btn-kyngo-' + tab);
    if (btn) btn.classList.add('active');

    const theLucEl = document.getElementById('kyngo-view-theluc');
    const thuongTieuEl = document.getElementById('kyngo-view-thuongtieu');

    if (tab === 'theluc') {
        if (theLucEl) theLucEl.style.display = 'block';
        if (thuongTieuEl) thuongTieuEl.style.display = 'none';
    } else if (tab === 'thuongtieu') {
        if (theLucEl) theLucEl.style.display = 'none';
        if (thuongTieuEl) thuongTieuEl.style.display = 'block';
        startTltCountdown();
        updateTltSpentAmount();
    } else if (tab === 'bequan') {
        openBeQuanModal();
    } else if (tab === 'thambai') {
        alert('🌸 [THAM BÁI THẦN TIÊN TỶ TỶ] 🌸\\nChưởng môn thành tâm tham bái tượng ngọc Vô Lượng Sơn, nhận được sự gia hộ từ Thần Tiên Tỷ Tỷ: +100 KNB, +50.000 Ngân Lượng!');
        if (GameState.playerData && GameState.playerData.Account) {
            GameState.playerData.Account.Vang = (GameState.playerData.Account.Vang || 0) + 100;
            GameState.playerData.Account.Bac = (GameState.playerData.Account.Bac || 0) + 50000;
            updateHeader();
        }
    } else if (tab === 'tieubao') {
        alert('🎲 [VI TIỂU BẢO ĐỔ SẮC] 🎲\\nVi Tiểu Bảo: "Đại ca! Đến Lệ Xuân Viện lắc vài ván xúc xắc kiếm bạc cùng tiểu đệ nào!"');
    } else if (tab === 'thuongnhan') {
        switchTab('market');
    } else if (tab === 'baucua') {
        alert('🎲 [BẦU CUA TÔM CÁ] 🎲\\nSòng Bầu Cua tấp nập tại Lệ Xuân Viện đang diễn ra sôi nổi! Chưởng môn hãy tham gia đặt cược rinh thưởng lớn!');
    } else if (tab === 'thuongdai') {
        alert('⚔️ [THƯỢNG ĐÀI LUẬN VÕ] ⚔️\\nĐại hội tỷ võ Thượng Đài quy tụ anh hùng bốn phương. Thách đấu cao thủ ghi danh bảng vàng!');
    } else if (tab === 'thuychien') {
        alert('⛵ [THỦY CHIẾN HOÀNG HÀ] ⛵\\nChiến thuyền xông pha khói lửa, tranh đoạt thủy lộ và kho báu đường sông võ lâm!');
    } else if (tab === 'lanhhai') {
        alert('🏝️ [LÃNH HẢI TRANH BÁ] 🏝️\\nKhai phá hoang đảo ngoài khơi xa, tiêu diệt thủy tặc và thu thập dị bảo biển sâu!');
    }
}'''

new_func = '''function switchKyngoSubTab(tab) {
    sound.play('click');
    currentKyngoSubTab = tab;

    document.querySelectorAll('.kyngo-icon-btn').forEach(btn => btn.classList.remove('active'));
    const btn = document.getElementById('btn-kyngo-' + tab);
    if (btn) btn.classList.add('active');

    const theLucEl = document.getElementById('kyngo-view-theluc');
    const thuongTieuEl = document.getElementById('kyngo-view-thuongtieu');
    const bauCuaEl = document.getElementById('kyngo-view-baucua');

    if (tab === 'theluc') {
        if (theLucEl) theLucEl.style.display = 'block';
        if (thuongTieuEl) thuongTieuEl.style.display = 'none';
        if (bauCuaEl) bauCuaEl.style.display = 'none';
    } else if (tab === 'thuongtieu') {
        if (theLucEl) theLucEl.style.display = 'none';
        if (thuongTieuEl) thuongTieuEl.style.display = 'block';
        if (bauCuaEl) bauCuaEl.style.display = 'none';
        startTltCountdown();
        updateTltSpentAmount();
    } else if (tab === 'baucua') {
        if (theLucEl) theLucEl.style.display = 'none';
        if (thuongTieuEl) thuongTieuEl.style.display = 'none';
        if (bauCuaEl) bauCuaEl.style.display = 'block';
        initBauCuaState();
    } else if (tab === 'bequan') {
        openBeQuanModal();
    } else if (tab === 'thambai') {
        alert('🌸 [THAM BÁI THẦN TIÊN TỶ TỶ] 🌸\\nChưởng môn thành tâm tham bái tượng ngọc Vô Lượng Sơn, nhận được sự gia hộ từ Thần Tiên Tỷ Tỷ: +100 KNB, +50.000 Ngân Lượng!');
        if (GameState.playerData && GameState.playerData.Account) {
            GameState.playerData.Account.Vang = (GameState.playerData.Account.Vang || 0) + 100;
            GameState.playerData.Account.Bac = (GameState.playerData.Account.Bac || 0) + 50000;
            updateHeader();
        }
    } else if (tab === 'tieubao') {
        alert('🎲 [VI TIỂU BẢO ĐỔ SẮC] 🎲\\nVi Tiểu Bảo: "Đại ca! Đến Lệ Xuân Viện lắc vài ván xúc xắc kiếm bạc cùng tiểu đệ nào!"');
    } else if (tab === 'thuongnhan') {
        switchTab('market');
    } else if (tab === 'thuongdai') {
        alert('⚔️ [THƯỢNG ĐÀI LUẬN VÕ] ⚔️\\nĐại hội tỷ võ Thượng Đài quy tụ anh hùng bốn phương. Thách đấu cao thủ ghi danh bảng vàng!');
    } else if (tab === 'thuychien') {
        alert('⛵ [THỦY CHIẾN HOÀNG HÀ] ⛵\\nChiến thuyền xông pha khói lửa, tranh đoạt thủy lộ và kho báu đường sông võ lâm!');
    } else if (tab === 'lanhhai') {
        alert('🏝️ [LÃNH HẢI TRANH BÁ] 🏝️\\nKhai phá hoang đảo ngoài khơi xa, tiêu diệt thủy tặc và thu thập dị bảo biển sâu!');
    }
}

// ================= 100% AUTHENTIC BẦU CUA TÔM CÁ SYSTEM (media_1793068015082_01406808.jpg) =================
let currentBcChipAmount = 10000;
let bcFreeTurns = 50;
let isBcRolling = false;
let currentBcBets = {
    nai: 0,
    bau: 0,
    ga: 0,
    ca: 0,
    cua: 0,
    tom: 0
};
let bcHistoryLogs = [
    { round: 1, dice: ['bau', 'cua', 'tom'], win: 150000 }
];

function initBauCuaState() {
    updateBauCuaDisplay();
}

function updateBauCuaDisplay() {
    // Current Bac
    const bacEl = document.getElementById('bc-current-bac-val');
    let bac = 121754235;
    if (GameState.playerData && GameState.playerData.Account && typeof GameState.playerData.Account.Bac === 'number') {
        bac = GameState.playerData.Account.Bac;
    }
    if (bacEl) bacEl.innerText = bac.toLocaleString('vi-VN');

    // Free turns
    const turnsEl = document.getElementById('bc-free-turns-val');
    if (turnsEl) turnsEl.innerText = bcFreeTurns;

    // Total Bet
    let total = 0;
    Object.keys(currentBcBets).forEach(k => {
        total += currentBcBets[k];
        const chipEl = document.getElementById('bc-chip-' + k);
        if (chipEl) {
            if (currentBcBets[k] > 0) {
                chipEl.style.display = 'block';
                const kVal = Math.round(currentBcBets[k] / 1000);
                chipEl.innerText = kVal >= 1000 ? (kVal / 1000).toFixed(1) + 'M' : kVal + 'K';
            } else {
                chipEl.style.display = 'none';
            }
        }
    });

    const totalEl = document.getElementById('bc-total-bet-val');
    if (totalEl) totalEl.innerText = total.toLocaleString('vi-VN');
}

function selectChipAmount(amt, btnEl) {
    sound.play('click');
    currentBcChipAmount = amt;
    document.querySelectorAll('.bc-chip-btn').forEach(b => b.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');
}

function placeBetOnCard(cardKey) {
    if (isBcRolling) return;
    sound.play('click');

    let currentBac = 121754235;
    if (GameState.playerData && GameState.playerData.Account && typeof GameState.playerData.Account.Bac === 'number') {
        currentBac = GameState.playerData.Account.Bac;
    }

    let totalCurrent = 0;
    Object.keys(currentBcBets).forEach(k => { totalCurrent += currentBcBets[k]; });

    if (bcFreeTurns <= 0 && (totalCurrent + currentBcChipAmount) > currentBac) {
        alert('❌ Ngân Lượng không đủ để tiếp tục đặt cược!');
        return;
    }

    currentBcBets[cardKey] = (currentBcBets[cardKey] || 0) + currentBcChipAmount;
    updateBauCuaDisplay();
}

function clearAllBauCuaBets() {
    if (isBcRolling) return;
    sound.play('click');
    Object.keys(currentBcBets).forEach(k => { currentBcBets[k] = 0; });
    document.querySelectorAll('.bc-card-spot').forEach(c => c.classList.remove('winner'));
    updateBauCuaDisplay();
}

function doPlayBauCua() {
    if (isBcRolling) return;

    let totalBet = 0;
    Object.keys(currentBcBets).forEach(k => { totalBet += currentBcBets[k]; });

    if (totalBet === 0) {
        // Auto bet default on Bầu if player pressed play without selecting
        currentBcBets['bau'] = currentBcChipAmount;
        totalBet = currentBcChipAmount;
        updateBauCuaDisplay();
    }

    let currentBac = 121754235;
    if (GameState.playerData && GameState.playerData.Account && typeof GameState.playerData.Account.Bac === 'number') {
        currentBac = GameState.playerData.Account.Bac;
    }

    // Deduct bet if not free
    if (bcFreeTurns > 0) {
        bcFreeTurns--;
    } else {
        if (currentBac < totalBet) {
            alert('❌ Bạn không đủ Ngân Lượng để cược ' + totalBet.toLocaleString('vi-VN') + ' Bạc!');
            return;
        }
        if (GameState.playerData && GameState.playerData.Account) {
            GameState.playerData.Account.Bac -= totalBet;
            updateHeader();
        }
    }

    isBcRolling = true;
    sound.play('click');

    // Remove previous winner highlights
    document.querySelectorAll('.bc-card-spot').forEach(c => c.classList.remove('winner'));

    const tray = document.getElementById('bc-dice-tray');
    if (tray) tray.classList.add('rolling');

    const faces = ['nai', 'bau', 'ga', 'ca', 'cua', 'tom'];
    let rollInterval = setInterval(() => {
        const r1 = faces[Math.floor(Math.random() * faces.length)];
        const r2 = faces[Math.floor(Math.random() * faces.length)];
        const r3 = faces[Math.floor(Math.random() * faces.length)];
        const f1 = document.getElementById('bc-face-1');
        const f2 = document.getElementById('bc-face-2');
        const f3 = document.getElementById('bc-face-3');
        if (f1) f1.src = '/assets/ui/kyngo_authentic/baucua_card_' + r1 + '.png';
        if (f2) f2.src = '/assets/ui/kyngo_authentic/baucua_card_' + r2 + '.png';
        if (f3) f3.src = '/assets/ui/kyngo_authentic/baucua_card_' + r3 + '.png';
    }, 70);

    setTimeout(() => {
        clearInterval(rollInterval);
        if (tray) tray.classList.remove('rolling');
        isBcRolling = false;

        // Final result dice
        const d1 = faces[Math.floor(Math.random() * faces.length)];
        const d2 = faces[Math.floor(Math.random() * faces.length)];
        const d3 = faces[Math.floor(Math.random() * faces.length)];
        const finalResults = [d1, d2, d3];

        const f1 = document.getElementById('bc-face-1');
        const f2 = document.getElementById('bc-face-2');
        const f3 = document.getElementById('bc-face-3');
        if (f1) f1.src = '/assets/ui/kyngo_authentic/baucua_card_' + d1 + '.png';
        if (f2) f2.src = '/assets/ui/kyngo_authentic/baucua_card_' + d2 + '.png';
        if (f3) f3.src = '/assets/ui/kyngo_authentic/baucua_card_' + d3 + '.png';

        // Highlight winning cards
        finalResults.forEach(r => {
            const spot = document.querySelector('.bc-spot-' + r);
            if (spot) spot.classList.add('winner');
        });

        // Calculate payout
        let totalWin = 0;
        Object.keys(currentBcBets).forEach(card => {
            const betAmt = currentBcBets[card];
            if (betAmt > 0) {
                const count = finalResults.filter(x => x === card).length;
                if (count > 0) {
                    totalWin += betAmt + (betAmt * count);
                }
            }
        });

        const namesMap = {
            nai: 'Nai',
            bau: 'Bầu',
            ga: 'Gà',
            ca: 'Cá',
            cua: 'Cua',
            tom: 'Tôm'
        };
        const resText = `[ ${namesMap[d1]} - ${namesMap[d2]} - ${namesMap[d3]} ]`;

        bcHistoryLogs.unshift({
            round: bcHistoryLogs.length + 1,
            dice: finalResults,
            win: totalWin
        });

        if (totalWin > 0) {
            sound.play('thang');
            if (GameState.playerData && GameState.playerData.Account) {
                GameState.playerData.Account.Bac = (GameState.playerData.Account.Bac || 0) + totalWin;
                updateHeader();
            }
            updateBauCuaDisplay();
            setTimeout(() => {
                alert(`🎉 [VI TIỂU BẢO ĐỔ SẮC - THẮNG LỚN] 🎉\\n\\nKết quả ra: ${resText}\\n\\nChúc mừng Chưởng Môn đã đại thắng: +${totalWin.toLocaleString('vi-VN')} Bạc!`);
            }, 300);
        } else {
            sound.play('chet_m');
            updateBauCuaDisplay();
            setTimeout(() => {
                alert(`🎲 [VI TIỂU BẢO ĐỔ SẮC] 🎲\\n\\nKết quả ra: ${resText}\\n\\nTiếc quá! Ván này không trúng, Chưởng Môn hãy thử lại ván sau!`);
            }, 300);
        }
    }, 1200);
}

function openBauCuaRankModal() {
    sound.play('click');
    let myBac = 121754235;
    if (GameState.playerData && GameState.playerData.Account && typeof GameState.playerData.Account.Bac === 'number') {
        myBac = GameState.playerData.Account.Bac;
    }
    const leaderBoard = [
        '🏆 BẢNG VÀNG THẦN BÀI LỆ XUÂN VIỆN 🏆',
        '---------------------------------------',
        '1. 👑 Vi Tiểu Bảo - 999.999.999 Bạc',
        '2. 🥈 Đoàn Dự - 688.500.000 Bạc',
        '3. 🥉 Lệnh Hồ Xung - 320.000.000 Bạc',
        '4. ⭐ Chưởng Môn (Hạng 4) - ' + myBac.toLocaleString('vi-VN') + ' Bạc',
        '5. 🎖️ Điền Bá Quang - 150.000.000 Bạc',
        '---------------------------------------',
        'Cược càng nhiều, rinh Bạc vô hạn cùng Vi Tiểu Bảo!'
    ].join('\\n');
    alert(leaderBoard);
}

function openBauCuaHistoryModal() {
    sound.play('click');
    const namesMap = { nai: 'Nai', bau: 'Bầu', ga: 'Gà', ca: 'Cá', cua: 'Cua', tom: 'Tôm' };
    const logs = bcHistoryLogs.slice(0, 8).map((log, idx) => {
        const dStr = log.dice.map(d => namesMap[d] || d).join(', ');
        return `#${log.round}: [${dStr}] -> ${log.win > 0 ? '+ ' + log.win.toLocaleString('vi-VN') + ' Bạc' : 'Thua'}`;
    }).join('\\n');

    alert(`📜 [TƯỜNG TRÌNH KẾT QUẢ GẦN NHẤT] 📜\\n---------------------------------\\n${logs || 'Chưa có ván cược nào'}`);
}'''

if old_func in code:
    code = code.replace(old_func, new_func)
    with open('public/js/game.js', 'w', encoding='utf-8') as f:
        f.write(code)
    print('Updated public/js/game.js with Bau Cua logic successfully!')
else:
    print('old_func not found!')
