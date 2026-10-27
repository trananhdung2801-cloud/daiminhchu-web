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

    const sceneEl = document.getElementById('kyngo-view-theluc');
    if (tab === 'theluc') {
        if (sceneEl) sceneEl.style.display = 'block';
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
}

// ================= 100% AUTHENTIC THƯỞNG TIÊU (TÍCH LŨY TIÊU) SYSTEM (media_1793066770174_4d94b8e6.jpg) =================
let tltCountdownTimer = null;
let tltRemainingSeconds = 71 * 86400 + 1 * 3600 + 15 * 60 + 47; // 71 ngày 1 giờ 15 phút 47 giây

function startTltCountdown() {
    if (tltCountdownTimer) clearInterval(tltCountdownTimer);

    function tick() {
        if (tltRemainingSeconds > 0) {
            tltRemainingSeconds--;
        }
        const days = Math.floor(tltRemainingSeconds / 86400);
        const rem = tltRemainingSeconds % 86400;
        const hours = Math.floor(rem / 3600);
        const mins = Math.floor((rem % 3600) / 60);
        const secs = rem % 60;

        const daysEl = document.getElementById('tlt-countdown-days');
        const hmsEl = document.getElementById('tlt-countdown-hms');
        if (daysEl) daysEl.textContent = days;
        if (hmsEl) {
            const hStr = hours < 10 ? '0' + hours : hours;
            const mStr = mins < 10 ? '0' + mins : mins;
            const sStr = secs < 10 ? '0' + secs : secs;
            hmsEl.textContent = `${hStr} giờ ${mStr} phút ${sStr} giây`;
        }
    }

    tick();
    tltCountdownTimer = setInterval(tick, 1000);
}

function updateTltSpentAmount() {
    const el = document.getElementById('tlt-spent-amount');
    if (!el) return;
    let spent = 2; // Default baseline matching original screenshot
    if (GameState.playerData && GameState.playerData.Account && typeof GameState.playerData.Account.TotalSpentKnb === 'number') {
        spent = Math.max(2, GameState.playerData.Account.TotalSpentKnb);
    }
    el.textContent = spent.toLocaleString('vi-VN');
}

function showRewardDetail(name, desc) {
    sound.play('click');
    alert(`🎁 [THƯỞNG TÍCH LŨY TIÊU] 🎁\\n\\n${name}\\n${desc}\\n\\n(Phần thưởng tự động phát qua Hộp Thư Truyền Tin khi đạt mốc tích lũy!)`);
}'''

if old_func in code:
    code = code.replace(old_func, new_func)
    with open('public/js/game.js', 'w', encoding='utf-8') as f:
        f.write(code)
    print('Updated switchKyngoSubTab in game.js successfully!')
else:
    print('old_func not found!')
