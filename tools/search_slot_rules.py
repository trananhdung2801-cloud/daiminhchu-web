import re
import sys
sys.stdout.reconfigure(encoding='utf-8')

dll_path = r'c:\Users\trananh.dung\Downloads\Dai Minh Chu_8.0.2_APKPure\assets\bin\Data\Managed\Assembly-CSharp.dll'
with open(dll_path, 'rb') as f:
    data = f.read()

# Search for methods in DoiHinh or BatQuaiTran
text = data.decode('latin-1', errors='ignore')

# Search for slot unlock level rules
# Look for number arrays or conditions like: level >= 2, level >= 5, level >= 10 etc.
patterns = [
    r'Slot\d',
    r'OpenSlot',
    r'GetSlotCount',
    r'MaxSlot',
    r'CheckUnlock',
    r'IsSlotOpen',
    r'SoLuongDeTu',
    r'SoDeTu'
]

for pat in patterns:
    matches = list(re.finditer(pat, text, re.IGNORECASE))
    print(f"Pattern {pat}: {len(matches)} matches")
    for m in matches[:5]:
        start = max(0, m.start() - 30)
        end = min(len(text), m.end() + 50)
        clean = ''.join(c if 32 <= ord(c) < 127 else ' ' for c in text[start:end])
        print('  ->', clean.strip())
