import sys
sys.stdout.reconfigure(encoding='utf-8')

# Bytes: 02 1f 19 3e 02 00 00 00 1e 2a ...
# In .NET IL:
# 02 = ldarg.0
# 1f <val> = ldc.i4.s <val>
# 3e <target> = bge.un.s or bgt ... wait, 3e is bge.s / bgt.s (or 3c/3d/3e)
# 1e = ldc.i4.8
# 2a = ret

rules = [
    ("Level >= 25", "8 slots"),
    ("Level >= 20", "7 slots"),
    ("Level >= 15", "6 slots"),
    ("Level >= 10", "5 slots"),
    ("Level >= 3",  "4 slots"),
    ("Level >= 1",  "3 slots (Tân thủ khởi đầu)")
]

print("=== CHUẨN GỐC TỪ DLL Assembly-CSharp.dll ===")
print("Quy tắc mở khóa Slot Đệ Tử Đội Hình (GetMaxSlotDoiHinh):")
for r in rules:
    print(f" * {r[0]} -> Mở {r[1]}")
