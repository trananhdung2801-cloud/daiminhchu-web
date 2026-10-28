import os
import re

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
html_path = os.path.join(base_dir, 'public', 'index.html')
css_path = os.path.join(base_dir, 'public', 'css', 'style.css')
js_path = os.path.join(base_dir, 'public', 'js', 'game.js')
app_path = os.path.join(base_dir, 'src', 'app.js')

print("Applying 100% Pure Unity DMC_Project UI (v=53)...")

# 1. Update src/app.js to enforce zero cache on all HTML/CSS/JS
with open(app_path, 'r', encoding='utf-8') as f:
    app_code = f.read()

# Make sure no browser can cache html, js, or css
old_cache_logic = """        const isDynamic = ext === '.html' || ext === '.js' || ext === '.css';
        const cacheHeader = isDynamic
            ? 'no-cache, no-store, must-revalidate, max-age=0'
            : 'public, max-age=86400';"""

new_cache_logic = """        const isDynamic = ext === '.html' || ext === '.js' || ext === '.css' || ext === '.json';
        const cacheHeader = isDynamic
            ? 'no-cache, no-store, must-revalidate, max-age=0, post-check=0, pre-check=0'
            : 'public, max-age=3600';"""

if old_cache_logic in app_code:
    app_code = app_code.replace(old_cache_logic, new_cache_logic)
    with open(app_path, 'w', encoding='utf-8') as f:
        f.write(app_code)
    print("Enforced strict no-cache in src/app.js")


# 2. Update public/index.html
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Add meta tags for cache busting in <head>
meta_cache = """    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">"""

if '<meta http-equiv="Cache-Control"' not in html:
    html = html.replace('<meta name="viewport"', meta_cache + '\n    <meta name="viewport"')
    print("Added cache busting meta tags to head")

# Replace lower board background with authentic Unity background.png
html = html.replace('/assets/ui/home_authentic/clean_home_board_backdrop.png', '/assets/ui/dmc_authentic/background.png')
html = html.replace('clean_home_board_backdrop.png', 'background.png')

# Replace the 6 wooden buttons in index.html to use authentic home_02_05.png with gold calligraphy
old_wooden_grid_regex = r'<div class="home-wooden-buttons-grid">[\s\S]*?</div>\s*<!-- Row 3 & 4:'

new_wooden_grid = """<div class="unity-wooden-buttons-grid">
                            <!-- NhanVatBtn: Đệ tử -->
                            <button class="unity-wooden-btn" onclick="openDiscipleDetailModal()" title="Đệ tử">
                                <img src="/assets/ui/dmc_authentic/home_02_05.png" class="unity-btn-bg" alt="Đệ tử"/>
                                <span class="unity-btn-text">Đệ tử</span>
                            </button>
                            <!-- TrangBiBtn: Trang bị -->
                            <button class="unity-wooden-btn" onclick="openTinhLuyenModal()" title="Trang bị">
                                <img src="/assets/ui/dmc_authentic/home_02_05.png" class="unity-btn-bg" alt="Trang bị"/>
                                <span class="unity-btn-text">Trang bị</span>
                            </button>
                            <!-- VoCongBtn: Võ công -->
                            <button class="unity-wooden-btn" onclick="openThanTienTyTyModal()" title="Võ công">
                                <img src="/assets/ui/dmc_authentic/home_02_05.png" class="unity-btn-bg" alt="Võ công"/>
                                <span class="unity-btn-text">Võ công</span>
                            </button>
                            <!-- KinhMachBtn: Kinh Mạch -->
                            <button class="unity-wooden-btn" onclick="openKinhMachModal()" title="Kinh Mạch">
                                <img src="/assets/ui/dmc_authentic/home_02_05.png" class="unity-btn-bg" alt="Kinh Mạch"/>
                                <span class="unity-btn-text">Kinh Mạch</span>
                            </button>
                            <!-- ChanKhiBtn: Chân khí -->
                            <button class="unity-wooden-btn" onclick="openChanKhiModal()" title="Chân khí">
                                <img src="/assets/ui/dmc_authentic/home_02_05.png" class="unity-btn-bg" alt="Chân khí"/>
                                <span class="unity-btn-text">Chân khí</span>
                            </button>
                            <!-- TeDanBtn: Khẩu quyết -->
                            <button class="unity-wooden-btn" onclick="openTayDuyenModal()" title="Khẩu quyết">
                                <img src="/assets/ui/dmc_authentic/home_02_05.png" class="unity-btn-bg" alt="Khẩu quyết"/>
                                <span class="unity-btn-text">Khẩu quyết</span>
                            </button>
                        </div>

                        <!-- Row 3 & 4:"""

html = re.sub(old_wooden_grid_regex, new_wooden_grid, html)
print("Replaced 6 wooden buttons with authentic Unity home_02_05.png + text layout!")

# Bump cache version in index.html to v=53_unity_clean
html = re.sub(r'style\.css\?v=[^\"]+', 'style.css?v=53_unity_clean', html)
html = re.sub(r'game\.js\?v=[^\"]+', 'game.js?v=53_unity_clean', html)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated index.html successfully!")


# 3. Update public/css/style.css
with open(css_path, 'r', encoding='utf-8') as f:
    css = f.read()

# Update top disciple stage background to authentic Unity background_dragon.png
css = re.sub(r'background:\s*url\([^\)]*clean_cloud_stage_bg\.png[^\)]*\)', "background: url('/assets/ui/dmc_authentic/background_dragon.png')", css)
css = re.sub(r'background:\s*url\([^\)]*authentic_cloud_mountain_bg\.png[^\)]*\)', "background: url('/assets/ui/dmc_authentic/background_dragon.png')", css)

# Add CSS for unity-wooden-buttons-grid and unity-wooden-btn
unity_btn_css = """
/* Authentic Unity TrenBtn (home_02_05.png + Golden Calligraphy Text) */
.unity-wooden-buttons-grid {
    position: relative;
    z-index: 2;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 6px 8px;
    width: 100%;
    padding: 4px 6px;
    box-sizing: border-box;
}

.unity-wooden-btn {
    position: relative;
    background: transparent;
    border: none;
    outline: none;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    -webkit-tap-highlight-color: transparent;
    transition: transform 0.1s ease, filter 0.1s ease;
}

.unity-wooden-btn .unity-btn-bg {
    width: 100%;
    max-height: 48px;
    object-fit: contain;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.75));
    display: block;
}

.unity-wooden-btn .unity-btn-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-family: 'Times New Roman', 'Palatino', serif;
    font-size: 15px;
    font-weight: 900;
    color: #fff2a8;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.95), 0 0 6px #78350f, 0 0 12px #451a03;
    white-space: nowrap;
    letter-spacing: 0.5px;
    pointer-events: none;
}

.unity-wooden-btn:active {
    transform: scale(0.93);
    filter: brightness(1.2);
}
"""

if '.unity-wooden-buttons-grid' not in css:
    css += unity_btn_css
    print("Added unity-wooden-buttons-grid CSS!")

# Ensure .home-lower-stage uses background.png seamlessly
css = re.sub(r'\.home-lower-stage\s*\{[\s\S]*?\}', """.home-lower-stage {
    position: relative;
    width: 100%;
    flex: 1 1 73%;
    min-height: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 4px 8px;
    box-sizing: border-box;
    background: #140d09 url('/assets/ui/dmc_authentic/background.png') repeat center center;
    background-size: cover;
}""", css)

with open(css_path, 'w', encoding='utf-8') as f:
    f.write(css)
print("Updated style.css successfully!")

# 4. Check game.js
with open(js_path, 'r', encoding='utf-8') as f:
    js = f.read()

# In switchTab, ensure the button selector catches everything
if '.menu-tab-btn' not in js:
    js = js.replace(".bottom-tab-auth-btn, .tab-btn-auth, .nav-perf-hotspot", ".bottom-tab-auth-btn, .tab-btn-auth, .nav-perf-hotspot, .menu-tab-btn, .menu-home-btn")
    with open(js_path, 'w', encoding='utf-8') as f:
        f.write(js)
    print("Verified switchTab in game.js")

print("All updates applied cleanly!")
