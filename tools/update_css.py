import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('public/css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Replace .bottom-nav-authentic-perfect block
old_bottom_nav = '''.bottom-nav-authentic-perfect {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 480px;
    aspect-ratio: 576 / 85;
    z-index: 1000;
    overflow: hidden;
}'''

new_bottom_nav = '''.bottom-nav-authentic-perfect {
    position: relative;
    width: 100%;
    aspect-ratio: 576 / 85;
    z-index: 100;
    flex-shrink: 0;
    overflow: hidden;
    margin-top: auto;
    border-top: 1px solid #78350f;
    box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.5);
}'''

if old_bottom_nav in css:
    css = css.replace(old_bottom_nav, new_bottom_nav)
    print('Replaced .bottom-nav-authentic-perfect successfully!')
else:
    print('Warning: old_bottom_nav exact match not found')

# Add cloud stage and lower stage styles
cloud_styles = '''
/* ================= DYNAMIC AUTHENTIC CLOUD FORMATION CAROUSEL ================= */
.home-cloud-stage-wrapper {
    position: relative;
    width: 100%;
    height: 195px;
    background: url('/assets/ui/home_authentic/cloud_mountain_bg.png') no-repeat center top;
    background-size: cover;
    border-bottom: 2px solid #573010;
    overflow: hidden;
    flex-shrink: 0;
}

.home-cloud-stage-scroll {
    display: flex;
    align-items: flex-end;
    height: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 0 12px 6px 12px;
    gap: 12px;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
}

.home-cloud-stage-scroll::-webkit-scrollbar {
    display: none;
}

.cloud-slot-card {
    width: 84px;
    height: 180px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    position: relative;
    cursor: pointer;
    scroll-snap-align: center;
    user-select: none;
    touch-action: pan-x;
    transition: transform 0.15s ease;
}

.cloud-slot-card:active {
    transform: scale(0.96);
}

.cloud-slot-badge {
    position: absolute;
    top: 4px;
    left: 4px;
    background: rgba(0, 0, 0, 0.8);
    border: 1px solid #b45309;
    border-radius: 4px;
    color: #ffd700;
    font-size: 10px;
    font-weight: 900;
    padding: 1px 5px;
    z-index: 10;
    text-shadow: 1px 1px 2px #000;
}

.cloud-figure-wrapper {
    position: relative;
    width: 80px;
    height: 108px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
}

.cloud-figure-img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.65));
    animation: cloudFloat 3s ease-in-out infinite alternate;
}

@keyframes cloudFloat {
    from { transform: translateY(0px); }
    to { transform: translateY(-3px); }
}

.cloud-pedestal-img {
    width: 84px;
    height: 36px;
    object-fit: contain;
    margin-top: -15px;
    z-index: 1;
    pointer-events: none;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5));
}

.cloud-hero-plate {
    width: 100%;
    background: linear-gradient(180deg, #451a03 0%, #1c0a00 100%);
    border: 1px solid #d97706;
    border-radius: 4px;
    padding: 2px 2px;
    text-align: center;
    margin-top: -2px;
    z-index: 3;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
}

.cloud-hero-name {
    font-size: 10px;
    font-weight: bold;
    color: #fef08a;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-shadow: 1px 1px 2px #000;
}

.cloud-hero-sub {
    font-size: 9px;
    font-weight: bold;
    color: #ffd700;
}

.cloud-empty-box {
    width: 62px;
    height: 76px;
    border: 2px dashed #b45309;
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #fde047;
    font-size: 26px;
    font-weight: 900;
    z-index: 2;
    margin-bottom: 4px;
    text-shadow: 0 0 6px rgba(253, 224, 71, 0.6);
}

.cloud-locked-box {
    width: 62px;
    height: 76px;
    border: 1px solid #4b5563;
    border-radius: 8px;
    background: rgba(17, 24, 39, 0.65);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #9ca3af;
    font-size: 22px;
    z-index: 2;
    margin-bottom: 4px;
}

/* Authentic Carved Lower Board */
.home-lower-stage {
    position: relative;
    width: 100%;
    aspect-ratio: 576 / 505;
    margin: 0 auto;
    flex-shrink: 0;
}

.home-lower-bg {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    pointer-events: none;
}
'''

# Replace .home-perfect-view padding
css = css.replace('padding-bottom: 75px !important;', 'padding-bottom: 0px !important;')

# Append cloud styles if not present
if '.home-cloud-stage-wrapper' not in css:
    css += '\n' + cloud_styles
    print('Appended cloud formation styles!')

with open('public/css/style.css', 'w', encoding='utf-8') as f:
    f.write(css)

print('Updated public/css/style.css successfully!')
