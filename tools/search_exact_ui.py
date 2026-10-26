import os
import sys
sys.stdout.reconfigure(encoding='utf-8')

ui_path = r'C:/Users/trananh.dung/Downloads/DaiMinhChu_Server/public/assets/ui'
files = sorted(os.listdir(ui_path))
print(f"Total files in public/assets/ui: {len(files)}")

# Find exact files matching user screenshot:
# In the screenshot:
# 1. 6 gold buttons with silver border: Đệ tử, Trang bị, Võ công, Kinh Mạch, Chân khí, Khẩu quyết
# 2. Main menu icons: Long Châu, Liên Server, Luận kiếm Liên Cụm, Ám khí, Fanpage, Liên minh
# 3. Bottom utility icons: Tay nải, Võ lâm phổ, Truyền thư, Ân oán, Trò chuyện, Cài đặt
# 4. Bottom tabs: Tr.chủ, D.trận, Gi.hồ, L.công, Kỳ ngộ, Chợ, L.kiếm, L.Minh
# 5. Header icons: EXP bar, VIP badge, coin/gold, silver, stamina (foot/kick), qi (meditation)

targets = ['detu', 'trangbi', 'vocong', 'kinhmach', 'chankhi', 'khauquyet',
           'longchau', 'lienserver', 'luankiem', 'amkhi', 'fanpage', 'lienminh',
           'taynai', 'volam', 'truyenthu', 'an_oan', 'trochuyen', 'caidat',
           'trangchu', 'dantran', 'giangho', 'luyencong', 'kyngo', 'cho',
           'theluc', 'khiluc', 'vip', 'level', 'exp']

for f in files:
    f_l = f.lower()
    for t in targets:
        if t in f_l:
            print(f"[{t}] -> {f}")
