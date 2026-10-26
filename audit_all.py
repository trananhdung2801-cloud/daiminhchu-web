import os
import subprocess
import json

orig_folder = r"C:\Users\trananh.dung\Downloads\Ảnh game ĐMC"
files = sorted(os.listdir(orig_folder))

results = []

for idx, f in enumerate(files, 1):
    fp = os.path.join(orig_folder, f)
    cmd = ['powershell', '-ExecutionPolicy', 'Bypass', '-File', 'do_ocr.ps1', fp]
    proc = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, encoding='utf-8', errors='ignore')
    lines = [line.strip() for line in proc.stdout.splitlines() if line.strip()]
    results.append({
        'index': idx,
        'filename': f,
        'lines': lines
    })
    print(f"[{idx:02d}] {f}: {len(lines)} lines detected")

with open('full_audit_results.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print("Saved all results to full_audit_results.json")
