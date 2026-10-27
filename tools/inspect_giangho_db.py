import json
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('data/config/GiangHo.txt', 'r', encoding='utf-8') as f:
    gh = json.load(f)

print(f'Total chapters: {len(gh)}')

for i in range(min(5, len(gh))):
    ch = gh[i]
    name = ch.get('TenHienThi', '')
    desc = ch.get('MoTa', '')
    missions = ch.get('NhiemVuList', [])
    print(f'\n--- Chapter {i}: {name} ({len(missions)} missions) ---')
    print(f'Story Description: {desc}')
    for m_idx, m in enumerate(missions[:4]):
        m_name = m.get('TenHienThi', '')
        avatar_code = m.get('NhanVatDaiDienCode', '')
        exp = m.get('ExpThuong', 0)
        bac = m.get('BacThuong', 0)
        print(f'  Ải {m_idx+1}: {m_name} | Avatar: {avatar_code} | Exp: {exp} | Bạc: {bac}')
