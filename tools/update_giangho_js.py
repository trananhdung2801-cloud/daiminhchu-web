import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('public/js/game.js', 'r', encoding='utf-8') as f:
    js = f.read()

new_giangho_impl = '''// 3. Giang Ho Tab (100% AUTHENTIC GUI MATCHING ORIGINAL SCREENSHOT)
function selectGiangHoChapter(chIdx) {
    sound.play('click');
    const ghProg = (GameState.playerData && GameState.playerData.GiangHoProgress)
        ? GameState.playerData.GiangHoProgress
        : { maxChapterIdx: 0, maxMissionIdx: 0 };
    if (chIdx > ghProg.maxChapterIdx) {
        alert('🔒 Chương này chưa mở khóa! Hãy vượt qua tất cả các ải của chương trước.');
        return;
    }
    GameState.currentChapterIdx = chIdx;
    renderGiangHo();
}

function renderGiangHo() {
    if (!GameState.staticData || !GameState.staticData.giangHo) return;
    const chapters = GameState.staticData.giangHo;
    const ghProg = (GameState.playerData && GameState.playerData.GiangHoProgress)
        ? GameState.playerData.GiangHoProgress
        : { maxChapterIdx: 0, maxMissionIdx: 0, stars: {} };

    if (GameState.currentChapterIdx === undefined || GameState.currentChapterIdx === null) {
        GameState.currentChapterIdx = ghProg.maxChapterIdx || 0;
    }
    if (GameState.currentChapterIdx > ghProg.maxChapterIdx) {
        GameState.currentChapterIdx = ghProg.maxChapterIdx;
    }

    const currentChapter = chapters[GameState.currentChapterIdx] || chapters[0];

    // 1. Render Horizontal Paper Scroll Track of Chapter Plaques
    const track = document.getElementById('gh-chapter-track');
    if (track) {
        track.innerHTML = '';
        // Show chapters up to maxChapterIdx + 1 locked
        const maxVisible = Math.min(ghProg.maxChapterIdx + 2, chapters.length);
        for (let i = 0; i < maxVisible; i++) {
            const ch = chapters[i];
            const isUnlocked = i <= ghProg.maxChapterIdx;
            const isActive = i === GameState.currentChapterIdx;

            const plaque = document.createElement('div');
            plaque.className = `gh-plaque-btn ${isActive ? 'active' : (isUnlocked ? 'inactive' : 'locked')}`;
            plaque.title = ch.tenHienThi;
            plaque.innerText = isUnlocked ? ch.tenHienThi : `🔒 ${ch.tenHienThi}`;
            plaque.onclick = () => selectGiangHoChapter(i);

            track.appendChild(plaque);

            // Auto-scroll track to active plaque
            if (isActive) {
                setTimeout(() => {
                    plaque.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                }, 50);
            }
        }
    }

    // 2. Render Chapter Story Lore Box
    const storyEl = document.getElementById('gh-chapter-story');
    if (storyEl) {
        storyEl.innerText = currentChapter.moTa || 'Nội bộ Cái Bang xuất hiện rạn nứt, hãy lên đường dẹp loạn giang hồ!';
    }

    // 3. Render Mission Wooden Planks List
    const list = document.getElementById('gh-mission-list');
    if (!list) return;
    list.innerHTML = '';

    const missions = currentChapter.nhiemVuList || [];
    missions.forEach((m, idx) => {
        const isUnlocked = (GameState.currentChapterIdx < ghProg.maxChapterIdx) ||
                           (GameState.currentChapterIdx === ghProg.maxChapterIdx && idx <= ghProg.maxMissionIdx);
        const isCleared = (GameState.currentChapterIdx < ghProg.maxChapterIdx) ||
                          (GameState.currentChapterIdx === ghProg.maxChapterIdx && idx < ghProg.maxMissionIdx);

        const starKey = GameState.currentChapterIdx + '_' + idx;
        const stars = (ghProg.stars && ghProg.stars[starKey]) ? Number(ghProg.stars[starKey]) : (isCleared ? 3 : 0);

        // Avatar url: if NV_ use official hero avatar, else generic NPC
        let avaUrl = '/assets/images/NC_Generic_NhanSi.png';
        if (m.daiDienCode && m.daiDienCode.startsWith('NV_')) {
            avaUrl = `/assets/images/${m.daiDienCode}_ava_to.png`;
        }

        const plank = document.createElement('div');
        plank.className = 'gh-mission-plank';

        // Stars row HTML
        let starsHtml = '';
        if (stars > 0) {
            starsHtml = `<div class="gh-stars-row">` +
                '<img src="/assets/ui/icon_star.png" class="gh-star-img" alt="Star"/>'.repeat(stars) +
                `</div>`;
        } else {
            starsHtml = `<div class="gh-stars-row" style="opacity: 0.35;">` +
                '<img src="/assets/ui/icon_star.png" class="gh-star-img" alt="Star"/>' +
                `</div>`;
        }

        const btnHtml = isUnlocked
            ? `<button class="gh-btn-danh" onclick="startBattle(${GameState.currentChapterIdx}, ${idx})" title="Khiêu chiến ải ${idx + 1}">
                   ${starsHtml}
                   <span class="gh-btn-danh-text">Đánh</span>
               </button>`
            : `<button class="gh-btn-danh locked" disabled title="Ải chưa mở khóa">
                   <span class="gh-btn-danh-text" style="color: #94a3b8; font-size: 11px;">🔒 Khóa</span>
               </button>`;

        plank.innerHTML = `
            <div class="gh-mission-avatar-box">
                <img class="gh-mission-avatar-img" src="${avaUrl}" onerror="this.src='/assets/images/NC_Generic_NhanSi.png'" alt="Avatar"/>
            </div>
            <div class="gh-mission-info">
                <h4 class="gh-mission-title">Ải ${idx + 1}: ${m.tenHienThi}</h4>
                <p class="gh-mission-reward">Thưởng: +${m.expThuong || 10} Exp, +${m.bacThuong || 50} Bạc</p>
            </div>
            ${btnHtml}
        `;

        list.appendChild(plank);
    });
}
'''

# Find existing renderGiangHo and changeGiangHoChapter block and replace it
start_marker = '// 3. Giang Ho Tab'
end_marker = '// 4. Recruit Tab'

p1 = js.find(start_marker)
p2 = js.find(end_marker)

if p1 != -1 and p2 != -1:
    js = js[:p1] + new_giangho_impl + '\n' + js[p2:]
    with open('public/js/game.js', 'w', encoding='utf-8') as f:
        f.write(js)
    print('Updated renderGiangHo in public/js/game.js successfully!')
else:
    print('Error: Could not find markers in game.js', p1, p2)
