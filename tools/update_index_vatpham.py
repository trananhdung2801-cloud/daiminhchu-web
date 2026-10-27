import re

path = 'public/index.html'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

pattern = re.compile(r'<!-- Tab 8:.*?<div id="tab-items".*?</div>\s*</div>', re.DOTALL)
m = pattern.search(c)
if not m:
    print('Pattern not matched! Trying manual slice...')
    idx1 = c.find('id="tab-items"')
    print('idx1:', idx1)
else:
    print('Matched:', m.group(0)[:60])

new_block = '''<!-- Tab 8: 100% Authentic Vật Phẩm GUI Matching Original Game Screenshot -->
                <div id="tab-items" class="tab-view vatpham-authentic-view" style="display: none;">
                    <div class="vp-top-header-row">
                        <img src="/assets/ui/vatpham_authentic/tab_vatpham_plaque.png" class="vp-top-plaque" alt="Vật phẩm"/>
                    </div>
                    <div class="vp-subheader-banner"></div>
                    <div id="items-container" class="vp-items-board"></div>
                </div>'''

# Replace from '<div id="tab-items"' to the corresponding closing '</div>' of that tab
idx_start = c.find('<div id="tab-items"')
# Find next closing of tab-items
idx_end = c.find('</div>\n            </div>', idx_start)
if idx_end == -1:
    idx_end = c.find('</div>\r\n            </div>', idx_start)

if idx_start != -1 and idx_end != -1:
    # replace up to idx_end + len('</div>')
    old_sub = c[idx_start:idx_end+len('</div>')]
    c = c[:idx_start] + new_block.strip() + c[idx_end+len('</div>'):]
    with open(path, 'w', encoding='utf-8') as f:
        f.write(c)
    print('Replaced tab-items successfully!')
else:
    print('Could not find slice:', idx_start, idx_end)
