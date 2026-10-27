import sys
sys.stdout.reconfigure(encoding='utf-8')

dll_path = r'c:\Users\trananh.dung\Downloads\Dai Minh Chu_8.0.2_APKPure\assets\bin\Data\Managed\Assembly-CSharp.dll'
with open(dll_path, 'rb') as f:
    data = f.read()

pos = data.find(b'GetMaxSlotDoiHinh')
print('Found GetMaxSlotDoiHinh at:', pos)

# Also search for IL instructions or references to GetMaxSlotDoiHinh
# In .NET metadata, let's look for methods with this name
# Let's search strings around this position
print('Bytes around pos:')
print(data[pos-50:pos+150])
