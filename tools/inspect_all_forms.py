import os, re, json, sys

def inspect_forms():
    game_unity_path = r'C:\Users\trananh.dung\Downloads\DMC_Project\ExportedProject\Assets\Game.unity'
    
    game_objects = {}
    transforms = {}
    tf_parent = {}
    tf_children = {}
    go_to_tf = {}
    tf_to_go = {}
    ui_sprites = {}
    ui_labels = {}
    ui_anchors = {}

    with open(game_unity_path, 'r', encoding='utf-8', errors='ignore') as f:
        cur_type = None
        cur_id = None
        cur_block = []
        
        def process(b_type, b_id, lines):
            if b_type == '!u!1':
                name = ''
                for l in lines:
                    if 'm_Name:' in l and not name:
                        name = l.split('m_Name:')[1].strip()
                        break
                game_objects[b_id] = name
            elif b_type == '!u!4':
                go_id = None
                parent_id = None
                pos = [0, 0, 0]
                scale = [1, 1, 1]
                for l in lines:
                    if 'm_GameObject:' in l:
                        go_id = l.split('fileID:')[1].split('}')[0].strip()
                    elif 'm_Father:' in l:
                        parent_id = l.split('fileID:')[1].split('}')[0].strip()
                    elif 'm_LocalPosition:' in l:
                        m = re.search(r'x:\s*([^,]+),\s*y:\s*([^,]+),\s*z:\s*([^\}]+)', l)
                        if m:
                            try: pos = [float(m.group(1)), float(m.group(2)), float(m.group(3))]
                            except: pass
                    elif 'm_LocalScale:' in l:
                        m = re.search(r'x:\s*([^,]+),\s*y:\s*([^,]+),\s*z:\s*([^\}]+)', l)
                        if m:
                            try: scale = [float(m.group(1)), float(m.group(2)), float(m.group(3))]
                            except: pass
                transforms[b_id] = {'go': go_id, 'parent': parent_id, 'pos': pos, 'scale': scale}
                if go_id:
                    go_to_tf[go_id] = b_id
                    tf_to_go[b_id] = go_id
                if parent_id:
                    tf_parent[b_id] = parent_id
                    tf_children.setdefault(parent_id, []).append(b_id)
            elif b_type == '!u!114':
                text = ''.join(lines)
                m_go = re.search(r'm_GameObject:\s*\{fileID:\s*(\d+)', text)
                go_id = m_go.group(1) if m_go else None
                if go_id:
                    if 'mSpriteName:' in text:
                        m_s = re.search(r'mSpriteName:\s*([^\r\n]+)', text)
                        if m_s and m_s.group(1).strip():
                            ui_sprites.setdefault(go_id, []).append(m_s.group(1).strip())
                    if 'mText:' in text:
                        m_t = re.search(r'mText:\s*(.*)', text)
                        if m_t and m_t.group(1).strip():
                            ui_labels.setdefault(go_id, []).append(m_t.group(1).strip())

        for line in f:
            if line.startswith('--- !u!'):
                if cur_id: process(cur_type, cur_id, cur_block)
                parts = line.strip().split()
                cur_type = parts[1]
                cur_id = parts[2].replace('&', '')
                cur_block = []
            elif cur_id: cur_block.append(line)
        if cur_id: process(cur_type, cur_id, cur_block)

    def get_all_descendant_sprites(go_id):
        sprites = list(ui_sprites.get(go_id, []))
        tf_id = go_to_tf.get(go_id)
        if tf_id:
            for c_tf in tf_children.get(tf_id, []):
                c_go = tf_to_go.get(c_tf)
                if c_go:
                    sprites.extend(get_all_descendant_sprites(c_go))
        return sprites

    # List key forms under InGame
    form_ids = {
        'Login': '1243',
        'GameBorder': '2235',
        'HomeForm': '4278',
        'MenuGroup': '5734',
        'DanTranForm': '3122',
        'GiangHoForm': '437',
        'TrangBiForm': '5363',
        'VoCongForm': '2799',
        'ChanKhiForm': '1819',
        'ThamNgoForm': '3358',
        'TinhLuyenTrangBiForm': '319',
        'EquipTrangBiForm': '445',
        'EquipVoCongForm': '1037',
        'EquipChanKhiForm': '1375',
        'NhanVatForm': '1699',
        'CuaHangForm': '3139',
        'KyNgoForm': '478',
        'LienServerForm': '359',
        'LongChauForm': '5455',
        'AmKhiForm': '3770',
        'KhauQuyetForm': '5651',
        'VoLamPhoForm': '4415',
        'MailForm': '1117',
        'TroChuyenForm': '4632',
        'SettingsForm': '442',
        'SelectThamNgoVoCongForm': '3072'
    }

    results = {}
    for name, fid in form_ids.items():
        sprites = get_all_descendant_sprites(fid)
        unique_sprites = sorted(list(set(sprites)))
        results[name] = {
            'go_id': fid,
            'total_sprites': len(sprites),
            'unique_sprites_count': len(unique_sprites),
            'unique_sprites': unique_sprites
        }
        print(f"{name:25s}: {len(unique_sprites):3d} unique sprites (sample: {unique_sprites[:6]})")

    out_path = r'C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\assets\ui\dmc_authentic\all_forms_sprites.json'
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    print(f"\nSaved all forms sprites breakdown to {out_path}")

if __name__ == '__main__':
    inspect_forms()
