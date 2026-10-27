import json
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('data/config/NhanVat.txt', 'r', encoding='utf-8') as f:
    nv = json.load(f)

for code in ['NV_TruongTamPhong', 'NV_TayMonXuyTuyet', 'NV_DongPhuongBatBai', 'NV_LenhHoXung']:
    cfg = nv.get(code, {})
    name = cfg.get('TenHienThi', code)
    print(f'\n=== {code} ({name}) ===')
    duyen = cfg.get('DuyenPhan', [])
    for d in duyen:
        print(' ', d)
