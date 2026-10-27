import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Add fine-tuned style
fine_tuning = """
/* ================= FINE-TUNED HOME & CONTAINER FIXES ================= */
.game-container {
    max-width: 480px;
    margin: 0 auto;
    position: relative;
    overflow-x: hidden;
}

.content-area {
    padding: 0 !important;
}

#tab-home {
    padding-bottom: 75px;
}

.home-cloud-stage {
    height: 200px;
}

.home-cloud-disciples-row {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    width: 100%;
    padding-bottom: 8px;
}

.home-cloud-disciple-item img {
    height: 145px;
    object-fit: contain;
}
"""

with open(r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/css/style.css', 'w', encoding='utf-8') as f:
    f.write(css + '\n' + fine_tuning)

print("Appended fine-tuning CSS to style.css!")
