import json
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('data/config/VatPhamTieuThu.txt', 'r', encoding='utf-8') as f:
    items = json.load(f)

print(f'Total consumable items: {len(items)}')

for k in ['VP_RuongMayMan', 'VP_BachNienSam', 'VP_GaQuay', 'VP_RuouNuNhiHong', 'VP_BoiDuongDan']:
    it = items.get(k, {})
    name = it.get('TenHienThi', '')
    desc = it.get('MoTa', '')
    hang = it.get('Hang', '')
    print(f'  • {k}: {name} (Hạng {hang}) -> {desc}')

print('\nSample 10 items:')
for k in list(items.keys())[:10]:
    it = items[k]
    print(f'  • {k}: {it.get("TenHienThi")} -> {it.get("MoTa")}')
