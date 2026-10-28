import os
import sys

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
html_path = os.path.join(base_dir, 'public', 'index.html')
css_path = os.path.join(base_dir, 'public', 'css', 'style.css')
js_path = os.path.join(base_dir, 'public', 'js', 'game.js')

print(f"Applying clean authentic home v=51...")

# 1. Update index.html
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Replace lower board screenshot with clean_home_board_backdrop.png
if 'home_lower_board_authentic.png' in html:
    html = html.replace('home_lower_board_authentic.png', 'clean_home_board_backdrop.png')
    print("Replaced lower board image with clean_home_board_backdrop.png in index.html")

# Bump version to v=51
html = html.replace('style.css?v=50', 'style.css?v=51')
html = html.replace('game.js?v=50', 'game.js?v=51')
print("Bumped asset version to v=51 in index.html")

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)


# 2. Update style.css
with open(css_path, 'r', encoding='utf-8') as f:
    css = f.read()

# Replace top backdrop with clean_cloud_stage_bg.png
css = css.replace("url('/assets/ui/home_authentic/authentic_cloud_mountain_bg.png')", "url('/assets/ui/home_authentic/clean_cloud_stage_bg.png')")
print("Updated top disciple stage background to clean_cloud_stage_bg.png")

# Remove duplicate .home-cloud-stage-scroll definition with overflow: hidden
duplicate_scroll_css = """
.home-cloud-stage-scroll {
    display: flex;
    align-items: flex-end;
    justify-content: space-evenly;
    height: 100%;
    width: 100%;
    overflow: hidden;
    padding: 0 4px 6px 4px;
    position: relative;
    z-index: 2;
}"""

if duplicate_scroll_css in css:
    css = css.replace(duplicate_scroll_css, "")
    print("Removed duplicate .home-cloud-stage-scroll with overflow: hidden")
else:
    # Try alternate indentation if any
    import re
    css = re.sub(r'\.home-cloud-stage-scroll\s*\{\s*display:\s*flex;\s*align-items:\s*flex-end;\s*justify-content:\s*space-evenly;\s*height:\s*100%;\s*width:\s*100%;\s*overflow:\s*hidden;[^\}]*\}', '', css)
    print("Re-checked and cleared duplicate .home-cloud-stage-scroll")

# Update .home-cloud-stage-scroll rules for smooth swipe & grab
scroll_target = """.home-cloud-stage-scroll {
    display: flex;
    align-items: flex-end;
    height: 100%;
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
    padding: 0 0 4px 0;
    position: relative;
    z-index: 2;
}"""

scroll_replacement = """.home-cloud-stage-scroll {
    display: flex;
    align-items: flex-end;
    height: 100%;
    width: 100%;
    overflow-x: auto !important;
    overflow-y: hidden !important;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
    -ms-overflow-style: none;
    -webkit-overflow-scrolling: touch;
    touch-action: pan-x;
    cursor: grab;
    user-select: none;
    padding: 0 0 2px 0;
    position: relative;
    z-index: 2;
}

.home-cloud-stage-scroll.grabbing {
    cursor: grabbing !important;
    scroll-snap-type: none !important;
}"""

if scroll_target in css:
    css = css.replace(scroll_target, scroll_replacement)
    print("Updated .home-cloud-stage-scroll with grab & smooth touch pan-x")

# Update .cloud-bust-card to overflow: visible
old_card_css = """.cloud-bust-card {
    width: 20%;
    flex: 0 0 20%;
    height: 100%;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    position: relative;
    cursor: pointer;
    scroll-snap-align: center;
    user-select: none;
    overflow: hidden;
    transition: transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1), z-index 0.25s ease;
}"""

new_card_css = """.cloud-bust-card {
    width: 20%;
    min-width: 20%;
    max-width: 20%;
    flex: 0 0 20%;
    height: 100%;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    position: relative;
    cursor: pointer;
    scroll-snap-align: center;
    user-select: none;
    overflow: visible;
    transition: transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1), z-index 0.25s ease;
}"""

if old_card_css in css:
    css = css.replace(old_card_css, new_card_css)
    print("Updated .cloud-bust-card to overflow: visible")

# Update .home-utilities-row to ensure it never gets cut in half
old_util_row = """.home-utilities-row {
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 2px 2px;
    margin-bottom: 2px;
}"""

new_util_row = """.home-utilities-row {
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    flex: 0 0 auto;
    min-height: 46px;
    padding: 2px 4px;
    margin-bottom: 4px;
}"""

if old_util_row in css:
    css = css.replace(old_util_row, new_util_row)
    print("Updated .home-utilities-row with flex: 0 0 auto; min-height: 46px")

with open(css_path, 'w', encoding='utf-8') as f:
    f.write(css)


# 3. Update game.js
with open(js_path, 'r', encoding='utf-8') as f:
    js = f.read()

# Enhance renderHomeCloudDisciples
old_render_fn = """function renderHomeCloudDisciples() {
    const container = document.getElementById('home-cloud-disciples');
    if (!container || !GameState.playerData) return;

    container.innerHTML = '';
    const dh = GameState.playerData.DoiHinh || {};
    const level = (GameState.playerData.Account && GameState.playerData.Account.Level) ? Number(GameState.playerData.Account.Level) : 1;
    const maxSlots = getMaxSlotDoiHinh(level);

    // Render full 8 formation slots in interactive swipe carousel (5 slots visible at once)
    for (let slot = 1; slot <= 8; slot++) {
        const card = document.createElement('div');
        card.className = 'cloud-bust-card';
        card.dataset.slot = slot;

        // Slot 3 (the middle slot among 1,2,3,4,5) is zoomed in initially
        if (slot === 3) card.classList.add('center-focus');

        const isUnlocked = slot <= maxSlots;
        const discipleId = Number(dh['slot' + slot] || 0);
        const disciple = (isUnlocked && discipleId > 0)
            ? (GameState.playerData.NhanVat || []).find(nv => Number(nv.id || nv.Id) === discipleId)
            : null;

        if (isUnlocked && disciple) {
            const code = disciple.name || disciple.Code;
            const cfg = getDiscipleCfg(code);
            card.onclick = () => openDiscipleDetailModal(code);
            card.title = `${cfg.TenHienThi || code} - Nhấn để xem chi tiết`;
            card.innerHTML = `
                <img class="cloud-bust-img" src="${getAvatarUrl(code)}" onerror="this.src='/assets/images/NV_DuongQua_ava_to.png'" alt="${cfg.TenHienThi || code}"/>
            `;
        } else if (isUnlocked) {
            // Unlocked empty slot: Show authentic grey silhouette in the mist!
            card.onclick = () => switchTab('formation');
            card.title = `Vị trí #${slot} còn trống - Nhấn để xuất chiến đệ tử`;
            card.innerHTML = `
                <img class="cloud-bust-img sil-empty" src="/assets/ui/home_authentic/clean_silhouette_empty.png" alt="Trống"/>
            `;
        } else {
            // Locked slot: Subtle semi-transparent silhouette
            const reqLv = getRequiredLevelForSlot(slot);
            card.onclick = () => alert(`🔒 Vị trí #${slot} yêu cầu đạt Đẳng cấp ${reqLv} để mở khóa!`);
            card.title = `Khóa - Cần Đẳng cấp ${reqLv} mở khóa`;
            card.innerHTML = `
                <img class="cloud-bust-img sil-empty" src="/assets/ui/home_authentic/clean_silhouette_empty.png" style="opacity: 0.28; filter: grayscale(100%);" alt="Khóa"/>
            `;
        }

        container.appendChild(card);
    }

    // Dynamic Center Focus Listener on swipe/scroll
    function updateCenterFocus() {
        const scrollLeft = container.scrollLeft;
        const slotWidth = container.offsetWidth / 5;
        if (!slotWidth) return;
        // Center slot index (0 to 7) is closest to center of visible 5 slots
        const centerIdx = Math.min(7, Math.max(0, Math.round(scrollLeft / slotWidth) + 2));
        container.querySelectorAll('.cloud-bust-card').forEach((card, idx) => {
            card.classList.toggle('center-focus', idx === centerIdx);
        });
    }

    container.onscroll = updateCenterFocus;

    // Mouse drag support for desktop swiping
    let isDown = false;
    let startX, scrollLeftVal;
    container.onmousedown = (e) => {
        isDown = true;
        startX = e.pageX - container.offsetLeft;
        scrollLeftVal = container.scrollLeft;
    };
    container.onmouseleave = () => { isDown = false; };
    container.onmouseup = () => { isDown = false; };
    container.onmousemove = (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 1.5;
        container.scrollLeft = scrollLeftVal - walk;
        updateCenterFocus();
    };
}"""

new_render_fn = """function renderHomeCloudDisciples() {
    const container = document.getElementById('home-cloud-disciples');
    if (!container || !GameState.playerData) return;

    container.innerHTML = '';
    const dh = GameState.playerData.DoiHinh || {};
    const level = (GameState.playerData.Account && GameState.playerData.Account.Level) ? Number(GameState.playerData.Account.Level) : 1;
    const maxSlots = getMaxSlotDoiHinh(level);

    let dragMoved = false;

    // Render full 8 formation slots in interactive swipe carousel (5 slots visible at once)
    for (let slot = 1; slot <= 8; slot++) {
        const card = document.createElement('div');
        card.className = 'cloud-bust-card';
        card.dataset.slot = slot;

        // Slot 3 (the middle slot among 1,2,3,4,5) is zoomed in initially
        if (slot === 3) card.classList.add('center-focus');

        const isUnlocked = slot <= maxSlots;
        const discipleId = Number(dh['slot' + slot] || 0);
        const disciple = (isUnlocked && discipleId > 0)
            ? (GameState.playerData.NhanVat || []).find(nv => Number(nv.id || nv.Id) === discipleId)
            : null;

        if (isUnlocked && disciple) {
            const code = disciple.name || disciple.Code;
            const cfg = getDiscipleCfg(code);
            card.onclick = (e) => {
                if (dragMoved) return;
                openDiscipleDetailModal(code);
            };
            card.title = `${cfg.TenHienThi || code} - Nhấn để xem chi tiết`;
            card.innerHTML = `
                <img class="cloud-bust-img" src="${getAvatarUrl(code)}" onerror="this.src='/assets/images/NV_DuongQua_ava_to.png'" alt="${cfg.TenHienThi || code}"/>
            `;
        } else if (isUnlocked) {
            // Unlocked empty slot: Show authentic grey silhouette in the mist!
            card.onclick = (e) => {
                if (dragMoved) return;
                switchTab('formation');
            };
            card.title = `Vị trí #${slot} còn trống - Nhấn để xuất chiến đệ tử`;
            card.innerHTML = `
                <img class="cloud-bust-img sil-empty" src="/assets/ui/home_authentic/clean_silhouette_empty.png" alt="Trống"/>
            `;
        } else {
            // Locked slot: Subtle semi-transparent silhouette
            const reqLv = getRequiredLevelForSlot(slot);
            card.onclick = (e) => {
                if (dragMoved) return;
                alert(`🔒 Vị trí #${slot} yêu cầu đạt Đẳng cấp ${reqLv} để mở khóa!`);
            };
            card.title = `Khóa - Cần Đẳng cấp ${reqLv} mở khóa`;
            card.innerHTML = `
                <img class="cloud-bust-img sil-empty" src="/assets/ui/home_authentic/clean_silhouette_empty.png" style="opacity: 0.28; filter: grayscale(100%);" alt="Khóa"/>
            `;
        }

        container.appendChild(card);
    }

    // Dynamic Center Focus Listener on swipe/scroll
    function updateCenterFocus() {
        const slotWidth = container.offsetWidth / 5;
        if (!slotWidth) return;
        // Center slot index (0 to 7) is closest to center of visible 5 slots
        const centerIdx = Math.min(7, Math.max(0, Math.round(container.scrollLeft / slotWidth) + 2));
        container.querySelectorAll('.cloud-bust-card').forEach((card, idx) => {
            card.classList.toggle('center-focus', idx === centerIdx);
        });
    }

    container.onscroll = updateCenterFocus;

    // Desktop mouse wheel support (horizontal swipe via wheel)
    container.onwheel = (e) => {
        if (e.deltaY) {
            e.preventDefault();
            container.scrollLeft += e.deltaY * 0.8;
            updateCenterFocus();
        }
    };

    // Mouse drag support for desktop swiping
    let isDown = false;
    let startX = 0;
    let scrollStart = 0;

    container.onmousedown = (e) => {
        isDown = true;
        dragMoved = false;
        container.classList.add('grabbing');
        startX = e.pageX - container.offsetLeft;
        scrollStart = container.scrollLeft;
    };

    const handleMouseUp = () => {
        if (isDown) {
            isDown = false;
            container.classList.remove('grabbing');
            const slotWidth = container.offsetWidth / 5;
            if (slotWidth) {
                const targetSlot = Math.round(container.scrollLeft / slotWidth);
                container.scrollTo({ left: targetSlot * slotWidth, behavior: 'smooth' });
            }
            setTimeout(() => { dragMoved = false; }, 80);
        }
    };

    window.addEventListener('mouseup', handleMouseUp);

    container.onmousemove = (e) => {
        if (!isDown) return;
        const x = e.pageX - container.offsetLeft;
        const dist = (x - startX);
        if (Math.abs(dist) > 5) {
            dragMoved = true;
            e.preventDefault();
            container.scrollLeft = scrollStart - dist;
            updateCenterFocus();
        }
    };
}"""

if old_render_fn in js:
    js = js.replace(old_render_fn, new_render_fn)
    print("Updated renderHomeCloudDisciples with wheel and grab-drag support")
else:
    print("WARNING: Could not find exact old_render_fn in game.js!")

with open(js_path, 'w', encoding='utf-8') as f:
    f.write(js)

print("Finished applying authentic home v=51!")
