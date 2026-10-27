import sys, os
sys.stdout.reconfigure(encoding='utf-8')
os.chdir(r'C:\Users\trananh.dung\Downloads\DaiMinhChu_Server')

with open('public/js/game.js', 'r', encoding='utf-8') as f:
    code = f.read()

# In switchTab('luyencong'):
code = code.replace("case 'luyencong':\n            renderDisciples();\n            break;",
                    "case 'luyencong':\n            renderDisciples();\n            switchLuyencongSubTab('luyendieu');\n            break;")

new_ld_logic = '''
// ================= 100% AUTHENTIC LUYỆN CÔNG & LUYỆN ĐIÊU SYSTEM (media_1793068206949_7469be7e.jpg) =================
let currentLuyencongSubTab = 'luyendieu';
let ldPlaysCount = 1;
let ldHighScore = 1234;
let ldGameRunning = false;
let ldAnimationId = null;

function switchLuyencongSubTab(tab) {
    sound.play('click');
    currentLuyencongSubTab = tab;

    document.querySelectorAll('.lc-icon-btn').forEach(btn => btn.classList.remove('active'));
    const btn = document.getElementById('btn-lc-' + tab);
    if (btn) btn.classList.add('active');

    const ldView = document.getElementById('luyencong-view-luyendieu');
    if (tab === 'luyendieu') {
        if (ldView) ldView.style.display = 'flex';
        updateLuyenDieuDisplay();
    } else if (tab === 'ngunhac') {
        alert('⚔️ [NGŨ NHẠC KIẾM PHÁI] ⚔️\\nNăm ngọn kiếm sơn Thái Sơn, Hoa Sơn, Hành Sơn, Hằng Sơn, Tung Sơn mở hội so kiếm đoạt chức Ngũ Nhạc Minh Chủ!');
    } else if (tab === 'vantieu') {
        if (typeof openVanTieuModal === 'function') openVanTieuModal();
        else alert('🚚 [VẬN TIÊU VÕ LÂM] 🚚\\nTiêu cục sẵn sàng khai tiễn hộ tống vàng bạc qua ải giang hồ!');
    } else if (tab === 'tucung') {
        if (typeof openHuyetChienModal === 'function') openHuyetChienModal();
        else alert('💀 [TỬ CUNG - HUYẾT CHIẾN HẮC MỘC NHAI] 💀\\nThách đấu đại ma đầu Hắc Mộc Nhai rinh kỳ trân dị bảo!');
    } else if (tab === 'tongkim') {
        alert('🛡️ [TỐNG KIM CHIẾN TRƯỜNG] 🛡️\\nHai phe Tống - Kim giao tranh vạn binh khởi nghĩa! Chưởng môn chuẩn bị xuất trận lập công!');
    }
}

function updateLuyenDieuDisplay() {
    const playsEl = document.getElementById('ld-plays-count');
    const scoreEl = document.getElementById('ld-highscore-val');
    if (playsEl) playsEl.innerText = ldPlaysCount;
    if (scoreEl) scoreEl.innerText = ldHighScore;
}

function openLuyenDieuLeaderboard() {
    sound.play('click');
    const board = [
        '🦅 BẢNG VÀNG THẦN ĐIÊU HÀNH HIỆP 🦅',
        '---------------------------------------',
        '1. 👑 Qui Ẩn Giang Hồ - 1234 Điểm',
        '2. 🥈 Dương Quá - 1150 Điểm',
        '3. 🥉 Quách Tĩnh - 980 Điểm',
        '4. ⭐ Chưởng Môn (Hiện tại) - ' + ldHighScore + ' Điểm',
        '5. 🎖️ Tiểu Long Nữ - 850 Điểm',
        '---------------------------------------',
        'Luyện Điêu càng xa, nhận thưởng Bạc và Đan Dược càng lớn!'
    ].join('\\n');
    alert(board);
}

function startLuyenDieuMiniGame() {
    sound.play('click');
    const canvas = document.getElementById('ld-flappy-canvas');
    const birdBox = document.getElementById('ld-bird-box');
    const btnsRow = document.getElementById('ld-buttons-row');
    if (!canvas) return;

    if (birdBox) birdBox.style.display = 'none';
    if (btnsRow) btnsRow.style.display = 'none';
    canvas.style.display = 'block';

    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width || 430;
    canvas.height = rect.height || 560;
    const ctx = canvas.getContext('2d');

    const birdImg = new Image();
    birdImg.src = '/assets/ui/luyencong_authentic/bird_ld.png';

    // Game state
    let birdY = canvas.height * 0.4;
    let velocity = 0;
    const gravity = 0.38;
    const jump = -6.5;
    let score = 0;
    let pipes = [];
    let frame = 0;
    ldGameRunning = true;

    function flap() {
        if (!ldGameRunning) return;
        velocity = jump;
        sound.play('click');
    }

    canvas.onclick = flap;
    canvas.ontouchstart = (e) => { e.preventDefault(); flap(); };

    function spawnPipe() {
        const gap = 140;
        const minH = 50;
        const maxH = canvas.height - 240 - gap;
        const topH = Math.floor(Math.random() * (maxH - minH)) + minH;
        pipes.push({
            x: canvas.width,
            topH: topH,
            bottomY: topH + gap,
            passed: false
        });
    }

    function loop() {
        if (!ldGameRunning) return;
        frame++;

        // Update bird
        velocity += gravity;
        birdY += velocity;

        // Spawn pipes every 100 frames
        if (frame % 110 === 0) {
            spawnPipe();
        }

        // Move pipes
        for (let i = 0; i < pipes.length; i++) {
            pipes[i].x -= 2.2;
            if (!pipes[i].passed && pipes[i].x < 80) {
                pipes[i].passed = true;
                score += 50;
            }
        }
        pipes = pipes.filter(p => p.x > -60);

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw bamboo / stone pillars
        for (let i = 0; i < pipes.length; i++) {
            const p = pipes[i];
            // Top pillar
            ctx.fillStyle = '#4d7c0f';
            ctx.fillRect(p.x, 0, 48, p.topH);
            ctx.strokeStyle = '#1e3a08';
            ctx.lineWidth = 2.5;
            ctx.strokeRect(p.x, 0, 48, p.topH);

            // Bottom pillar
            const botH = canvas.height - p.bottomY - 60;
            ctx.fillRect(p.x, p.bottomY, 48, botH);
            ctx.strokeRect(p.x, p.bottomY, 48, botH);
        }

        // Draw bird
        ctx.save();
        ctx.translate(90, birdY);
        const rot = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, velocity * 0.08));
        ctx.rotate(rot);
        ctx.drawImage(birdImg, -28, -24, 56, 48);
        ctx.restore();

        // Draw live score
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 24px sans-serif';
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 6;
        ctx.textAlign = 'center';
        ctx.fillText('Điểm: ' + score, canvas.width / 2, 45);

        // Check collision with ground or ceiling
        if (birdY > canvas.height - 85 || birdY < 10) {
            endGame(score);
            return;
        }

        // Check collision with pipes
        for (let i = 0; i < pipes.length; i++) {
            const p = pipes[i];
            if (p.x < 114 && p.x + 48 > 66) {
                if (birdY - 18 < p.topH || birdY + 18 > p.bottomY) {
                    endGame(score);
                    return;
                }
            }
        }

        ldAnimationId = requestAnimationFrame(loop);
    }

    function endGame(finalScore) {
        ldGameRunning = false;
        if (ldAnimationId) cancelAnimationFrame(ldAnimationId);
        sound.play('chet_m');

        ldPlaysCount++;
        if (finalScore > ldHighScore) {
            ldHighScore = finalScore;
            sound.play('renxong');
        }

        const bonusBac = Math.max(5000, finalScore * 20);
        if (GameState.playerData && GameState.playerData.Account) {
            GameState.playerData.Account.Bac = (GameState.playerData.Account.Bac || 0) + bonusBac;
            updateHeader();
        }

        updateLuyenDieuDisplay();

        setTimeout(() => {
            alert(`🦅 [LUYỆN ĐIÊU KẾT THÚC] 🦅\\n\\nĐiểm số đạt được: ${finalScore} Điểm!\\nThưởng hành hiệp: +${bonusBac.toLocaleString('vi-VN')} Bạc!\\n\\nĐiểm cao nhất hiện tại: ${ldHighScore}`);
            canvas.style.display = 'none';
            if (birdBox) birdBox.style.display = 'block';
            if (btnsRow) btnsRow.style.display = 'flex';
        }, 200);
    }

    ldAnimationId = requestAnimationFrame(loop);
}
'''

code += '\n' + new_ld_logic

with open('public/js/game.js', 'w', encoding='utf-8') as f:
    f.write(code)

print('Appended Luyện Công & Luyện Điêu logic successfully!')
