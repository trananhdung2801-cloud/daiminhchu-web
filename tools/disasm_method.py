import struct
import sys
sys.stdout.reconfigure(encoding='utf-8')

dll_path = r'c:\Users\trananh.dung\Downloads\Dai Minh Chu_8.0.2_APKPure\assets\bin\Data\Managed\Assembly-CSharp.dll'
with open(dll_path, 'rb') as f:
    data = f.read()

# PE Header
e_lfanew = struct.unpack_from('<I', data, 0x3C)[0]
optional_header = e_lfanew + 24
# Magic: 0x10b (PE32)
magic = struct.unpack_from('<H', data, optional_header)[0]
# CLI header is at data directory 14 (offset 208 from optional_header for PE32)
cli_rva = struct.unpack_from('<I', data, optional_header + 208)[0]

# Section headers
num_sections = struct.unpack_from('<H', data, e_lfanew + 6)[0]
opt_hdr_size = struct.unpack_from('<H', data, e_lfanew + 20)[0]
sec_start = optional_header + opt_hdr_size

sections = []
for i in range(num_sections):
    sec = data[sec_start + i*40 : sec_start + (i+1)*40]
    name = sec[:8].rstrip(b'\x00').decode('ascii', errors='ignore')
    vsize, vrva, raw_size, raw_offset = struct.unpack_from('<IIII', sec, 8)
    sections.append((name, vrva, vsize, raw_offset, raw_size))

def rva_to_offset(rva):
    for name, vrva, vsize, raw_offset, raw_size in sections:
        if vrva <= rva < vrva + vsize:
            return raw_offset + (rva - vrva)
    return None

cli_offset = rva_to_offset(cli_rva)
metadata_rva = struct.unpack_from('<I', data, cli_offset + 8)[0]
metadata_offset = rva_to_offset(metadata_rva)

# Metadata root: signature 0x424A5342 (BSJB)
version_len = struct.unpack_from('<I', data, metadata_offset + 12)[0]
streams_offset = metadata_offset + 16 + version_len
# Stream headers start after flags (2 bytes) and num_streams (2 bytes)
# Align version_len
num_streams = struct.unpack_from('<H', data, metadata_offset + 18 + ((version_len + 3) & ~3))[0]
stream_headers_start = metadata_offset + 20 + ((version_len + 3) & ~3)

streams = {}
cur = stream_headers_start
for _ in range(num_streams):
    offset, size = struct.unpack_from('<II', data, cur)
    cur += 8
    sname = []
    while data[cur] != 0:
        sname.append(chr(data[cur]))
        cur += 1
    cur = (cur + 4) & ~3
    name = ''.join(sname)
    streams[name] = (metadata_offset + offset, size)

print('Streams:', streams.keys())

strings_offset, strings_size = streams['#Strings']
strings_data = data[strings_offset : strings_offset + strings_size]

# Find "GetMaxSlotDoiHinh" offset in #Strings
target_name = b'GetMaxSlotDoiHinh\x00'
s_idx = strings_data.find(target_name)
print('Target in #Strings at offset:', s_idx)

# Tables stream #~
tables_offset, tables_size = streams['#~']
# Table stream header:
# 4 bytes reserved, 1 byte major, 1 byte minor, 1 byte heapSizes, 1 byte reserved, 8 bytes valid (mask of present tables)
major, minor, heap_sizes = struct.unpack_from('<BBB', data, tables_offset + 4)
valid = struct.unpack_from('<Q', data, tables_offset + 8)[0]
print(f'HeapSizes: 0x{heap_sizes:x}, Valid: 0x{valid:x}')

# Count tables present
table_counts = {}
cur_tables = tables_offset + 24
for i in range(64):
    if (valid >> i) & 1:
        cnt = struct.unpack_from('<I', data, cur_tables)[0]
        cur_tables += 4
        table_counts[i] = cnt

# Table 6 is MethodDef (0x06)
method_count = table_counts.get(6, 0)
print('MethodDef count:', method_count)

# String index size: 4 if (heap_sizes & 1) else 2
str_idx_size = 4 if (heap_sizes & 1) else 2
guid_idx_size = 4 if (heap_sizes & 2) else 2
blob_idx_size = 4 if (heap_sizes & 4) else 2

# Calculate row sizes for tables before 6:
# 0: Module (2 + str + 3*guid)
# 1: TypeRef (ResolutionScope + str + str)
# 2: TypeDef (4 + str + str + TypeDefOrRef + Field + Method)
# MethodDef: RVA(4) + ImplFlags(2) + Flags(2) + Name(str) + Signature(blob) + ParamList(Param)
# Let's search MethodDef rows where Name == s_idx:
# Scan raw bytes in table stream for Name == s_idx!
target_bytes = struct.pack('<I' if str_idx_size == 4 else '<H', s_idx)
print('Searching target bytes in tables stream...')
pos = tables_offset
while True:
    pos = data.find(target_bytes, pos + 1, tables_offset + tables_size)
    if pos == -1:
        break
    # Check if this could be a MethodDef row
    # In MethodDef: RVA is at -8 from Name, or check RVA validity
    try:
        rva = struct.unpack_from('<I', data, pos - 4)[0]
        off = rva_to_offset(rva)
        if off and off < len(data):
            print(f'Candidate MethodDef at {pos}, RVA: 0x{rva:x}, file offset: 0x{off:x}')
            # Read method header:
            # CorILMethod_Tiny: (header & 3) == 2, code_size = header >> 2
            # CorILMethod_Fat: (header & 3) == 3
            hdr = data[off]
            if (hdr & 3) == 2:
                code_size = hdr >> 2
                body = data[off + 1 : off + 1 + code_size]
                print(f'  Tiny method, size {code_size}: {body.hex()}')
            elif (hdr & 3) == 3:
                flags, size_dwords = struct.unpack_from('<HH', data, off)
                code_size = struct.unpack_from('<I', data, off + 4)[0]
                body_start = off + (size_dwords * 4)
                body = data[body_start : body_start + code_size]
                print(f'  Fat method, code size {code_size}: {body.hex()}')
    except Exception as ex:
        pass
