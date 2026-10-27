import re
import sys
sys.stdout.reconfigure(encoding='utf-8')

dll_path = r'c:\Users\trananh.dung\Downloads\Dai Minh Chu_8.0.2_APKPure\assets\bin\Data\Managed\Assembly-CSharp.dll'
with open(dll_path, 'rb') as f:
    data = f.read()

# Find strings matching slot or doihinh or giangho
text = data.decode('latin-1', errors='ignore')

# Search for formation slot unlock rules or levels
keywords = ['doihinh', 'slot', 'unlock', 'open', 'chapter', 'giangho', 'quaman', 'mo_slot']
matches = set()
for kw in keywords:
    for m in re.finditer(re.escape(kw), text, re.IGNORECASE):
        start = max(0, m.start() - 40)
        end = min(len(text), m.end() + 60)
        snippet = text[start:end]
        # Clean non-printable characters
        clean = ''.join(c if 32 <= ord(c) < 127 else ' ' for c in snippet)
        matches.add(clean.strip())

print(f"Total snippets found: {len(matches)}")
for s in sorted(matches)[:40]:
    if any(k in s.lower() for k in ['level', 'cap', 'slot', 'dantran', 'unlock', 'open', 'giangho', 'doihinh']):
        print(' *', s)
