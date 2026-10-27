import struct
import sys
sys.stdout.reconfigure(encoding='utf-8')

dll_path = r'c:\Users\trananh.dung\Downloads\Dai Minh Chu_8.0.2_APKPure\assets\bin\Data\Managed\Assembly-CSharp.dll'
with open(dll_path, 'rb') as f:
    data = f.read()

e_lfanew = struct.unpack_from('<I', data, 0x3C)[0]
optional_header = e_lfanew + 24
cli_rva = struct.unpack_from('<I', data, optional_header + 208)[0]
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
version_len = struct.unpack_from('<I', data, metadata_offset + 12)[0]
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
    streams[''.join(sname)] = (metadata_offset + offset, size)

strings_offset, strings_size = streams['#Strings']
target_name = b'GetMaxSlotDoiHinh\x00'
s_idx = data[strings_offset : strings_offset + strings_size].find(target_name)
print('Target s_idx:', s_idx)

tables_offset, tables_size = streams['#~']
major, minor, heap_sizes = struct.unpack_from('<BBB', data, tables_offset + 4)
valid = struct.unpack_from('<Q', data, tables_offset + 8)[0]
str_idx_size = 4 if (heap_sizes & 1) else 2
guid_idx_size = 4 if (heap_sizes & 2) else 2
blob_idx_size = 4 if (heap_sizes & 4) else 2

table_counts = {}
cur_tables = tables_offset + 24
for i in range(64):
    if (valid >> i) & 1:
        cnt = struct.unpack_from('<I', data, cur_tables)[0]
        cur_tables += 4
        table_counts[i] = cnt

def get_coded_idx_size(tables, tag_bits):
    max_count = max([table_counts.get(t, 0) for t in tables] + [0])
    return 2 if max_count < (1 << (16 - tag_bits)) else 4

def get_simple_idx_size(table_id):
    return 2 if table_counts.get(table_id, 0) < 65536 else 4

# Row sizes for tables 0..5
# 0: Module: 2 + str + 3*guid
# 1: TypeRef: ResolutionScope (coded 2 bits: 0,1,26,27) + str + str
# 2: TypeDef: 4 + str + str + TypeDefOrRef (coded 2 bits: 2,1,27) + Field(simple 4) + Method(simple 6)
# 4: Field: 2 + str + blob
row_sizes = {
    0: 2 + str_idx_size + 3 * guid_idx_size,
    1: get_coded_idx_size([0, 1, 26, 27], 2) + 2 * str_idx_size,
    2: 4 + 2 * str_idx_size + get_coded_idx_size([2, 1, 27], 2) + get_simple_idx_size(4) + get_simple_idx_size(6),
    4: 2 + str_idx_size + blob_idx_size
}

# Offset of table 6:
table_start = cur_tables
for t in range(6):
    if (valid >> t) & 1:
        table_start += table_counts[t] * row_sizes[t]

method_row_size = 4 + 2 + 2 + str_idx_size + blob_idx_size + get_simple_idx_size(8)
print('MethodDef start offset:', table_start, 'row size:', method_row_size)

# Scan MethodDef table for s_idx
for r in range(table_counts[6]):
    row_off = table_start + r * method_row_size
    rva = struct.unpack_from('<I', data, row_off)[0]
    name_idx = struct.unpack_from('<I' if str_idx_size == 4 else '<H', data, row_off + 8)[0]
    if name_idx == s_idx:
        print(f'FOUND MethodDef row {r}! RVA: 0x{rva:x}')
        off = rva_to_offset(rva)
        print(f'File offset: 0x{off:x}')
        hdr = data[off]
        if (hdr & 3) == 2:
            code_size = hdr >> 2
            body = data[off + 1 : off + 1 + code_size]
        else:
            size_dwords = (struct.unpack_from('<H', data, off)[0] >> 12)
            code_size = struct.unpack_from('<I', data, off + 4)[0]
            body = data[off + size_dwords * 4 : off + size_dwords * 4 + code_size]
        print(f'Code size: {len(body)}, IL bytes: {body.hex()}')
