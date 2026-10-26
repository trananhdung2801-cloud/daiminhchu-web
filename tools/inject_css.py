import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

new_styles = '''
/* ================= NEW AUTHENTIC ACTIVITIES STYLES ================= */
.vantieu-cart-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(30, 20, 10, 0.7);
    border: 1px solid #78350f;
    border-radius: 6px;
    padding: 8px 12px;
    transition: all 0.2s ease;
}

.vantieu-cart-card:hover {
    border-color: #f59e0b;
    background: rgba(45, 25, 12, 0.85);
}

.tinhluyen-equip-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(25, 15, 8, 0.75);
    border: 1px solid #92400e;
    border-radius: 6px;
    padding: 8px 12px;
}

.boss-rank-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(0, 0, 0, 0.35);
    padding: 6px 10px;
    border-radius: 4px;
    border-left: 3px solid #f59e0b;
}
'''

with open(r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/css/style.css', 'w', encoding='utf-8') as f:
    f.write(css + '\n' + new_styles)

print("Updated style.css successfully!")
