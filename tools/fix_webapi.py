import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/routes/webApi.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if 'yêu cầu đạt Đẳng cấp' in l and 'return' in l:
        lines[i] = "            return { success: false, error: 'Vị trí #' + slot + ' yêu cầu đạt Đẳng cấp ' + reqLv + ' để mở khóa!' };\n"

with open('src/routes/webApi.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print('Updated successfully!')
