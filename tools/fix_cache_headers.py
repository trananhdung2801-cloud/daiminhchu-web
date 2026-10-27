import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/src/app.js', 'r', encoding='utf-8') as f:
    text = f.read()

target = """        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        res.writeHead(200, {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=86400'
        });"""

replacement = """        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        const isDynamic = ext === '.html' || ext === '.js' || ext === '.css';
        const cacheHeader = isDynamic
            ? 'no-cache, no-store, must-revalidate, max-age=0'
            : 'public, max-age=86400';

        res.writeHead(200, {
            'Content-Type': contentType,
            'Cache-Control': cacheHeader,
            'Pragma': isDynamic ? 'no-cache' : 'public',
            'Expires': isDynamic ? '0' : '86400'
        });"""

text_norm = text.replace('\r\n', '\n')
target_norm = target.replace('\r\n', '\n')
replacement_norm = replacement.replace('\r\n', '\n')

if target_norm in text_norm:
    text_norm = text_norm.replace(target_norm, replacement_norm)
    with open(r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/src/app.js', 'w', encoding='utf-8') as f:
        f.write(text_norm)
    print("Successfully updated Cache-Control in app.js!")
else:
    print("Could not find target in app.js!")
