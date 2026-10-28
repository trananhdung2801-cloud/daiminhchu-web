import os
import re
import json

def parse_scene_ui():
    game_unity_path = r'C:\Users\trananh.dung\Downloads\DMC_Project\ExportedProject\Assets\Game.unity'
    
    # Store parsed entities
    game_objects = {}  # id -> {'name': str, 'components': list}
    transforms = {}    # id -> {'go': str, 'parent': str, 'children': list, 'pos': [x,y,z], 'scale': [x,y,z]}
    ui_sprites = {}    # id -> {'go': str, 'spriteName': str, 'depth': int, 'atlasGuid': str, 'color': str}
    ui_buttons = {}    # id -> {'go': str, 'normal': str, 'hover': str, 'pressed': str}
    ui_labels = {}     # id -> {'go': str, 'text': str, 'fontSize': int, 'color': str}
    ui_anchors = {}    # id -> {'go': str, 'side': int, 'halfPixelOffset': bool, 'pixelOffset': [x,y], 'relativeOffset': [x,y]}
    
    with open(game_unity_path, 'r', encoding='utf-8', errors='ignore') as f:
        cur_type = None
        cur_id = None
        cur_block = []
        
        def process_block(b_type, b_id, lines):
            if b_type == '!u!1': # GameObject
                name = ''
                comps = []
                for l in lines:
                    if 'm_Name:' in l and not name:
                        name = l.split('m_Name:')[1].strip()
                    elif 'fileID:' in l and '- ' in l:
                        cid = l.split('fileID:')[1].split('}')[0].strip()
                        comps.append(cid)
                game_objects[b_id] = {'name': name, 'components': comps}
                
            elif b_type == '!u!4': # Transform
                go_id = None
                parent_id = None
                pos = [0, 0, 0]
                scale = [1, 1, 1]
                children = []
                
                for i, l in enumerate(lines):
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
                    elif '- {fileID:' in l and 'm_Children:' in lines[max(0, i-10):i+1]:
                        cid = l.split('fileID:')[1].split('}')[0].strip()
                        children.append(cid)
                        
                transforms[b_id] = {
                    'go': go_id,
                    'parent': parent_id,
                    'children': children,
                    'pos': pos,
                    'scale': scale
                }
                
            elif b_type == '!u!114': # MonoBehaviour
                text = ''.join(lines)
                go_id = None
                m = re.search(r'm_GameObject:\s*\{fileID:\s*(\d+)', text)
                if m: go_id = m.group(1)
                
                if 'mSpriteName:' in text:
                    m_s = re.search(r'mSpriteName:\s*([^\r\n]+)', text)
                    sname = m_s.group(1).strip() if m_s else ''
                    m_d = re.search(r'mDepth:\s*(\d+)', text)
                    depth = int(m_d.group(1)) if m_d else 0
                    ui_sprites[b_id] = {'go': go_id, 'spriteName': sname, 'depth': depth}
                    
                if 'mText:' in text:
                    m_t = re.search(r'mText:\s*(.*)', text)
                    tval = m_t.group(1).strip() if m_t else ''
                    ui_labels[b_id] = {'go': go_id, 'text': tval}
                    
                if 'normalSprite:' in text:
                    m_norm = re.search(r'normalSprite:\s*([^\r\n]+)', text)
                    m_hov = re.search(r'hoverSprite:\s*([^\r\n]+)', text)
                    m_pres = re.search(r'pressedSprite:\s*([^\r\n]+)', text)
                    ui_buttons[b_id] = {
                        'go': go_id,
                        'normal': m_norm.group(1).strip() if m_norm else '',
                        'hover': m_hov.group(1).strip() if m_hov else '',
                        'pressed': m_pres.group(1).strip() if m_pres else ''
                    }
                    
                if 'side:' in text and 'relativeOffset:' in text:
                    m_side = re.search(r'side:\s*(\d+)', text)
                    ui_anchors[b_id] = {
                        'go': go_id,
                        'side': int(m_side.group(1)) if m_side else 0
                    }

        for line in f:
            if line.startswith('--- !u!'):
                if cur_id:
                    process_block(cur_type, cur_id, cur_block)
                parts = line.strip().split()
                cur_type = parts[1]
                cur_id = parts[2].replace('&', '')
                cur_block = []
            elif cur_id is not None:
                cur_block.append(line)
        if cur_id:
            process_block(cur_type, cur_id, cur_block)

    print(f"Parsed {len(game_objects)} GameObjects, {len(transforms)} Transforms, {len(ui_sprites)} UISprites, {len(ui_buttons)} UIButtons, {len(ui_labels)} UILabels, {len(ui_anchors)} UIAnchors")

    # Build reverse lookup: go_id -> transform, sprites, buttons, labels, anchors
    go_to_tf = {v['go']: k for k, v in transforms.items() if v.get('go')}
    go_to_sprites = {}
    for sid, s in ui_sprites.items():
        gid = s['go']
        if gid:
            go_to_sprites.setdefault(gid, []).append(s)
            
    go_to_buttons = {}
    for bid, b in ui_buttons.items():
        gid = b['go']
        if gid:
            go_to_buttons.setdefault(gid, []).append(b)

    go_to_labels = {}
    for lid, l in ui_labels.items():
        gid = l['go']
        if gid:
            go_to_labels.setdefault(gid, []).append(l)

    go_to_anchors = {}
    for aid, a in ui_anchors.items():
        gid = a['go']
        if gid:
            go_to_anchors.setdefault(gid, []).append(a)

    def serialize_node(go_id):
        go = game_objects.get(go_id, {'name': 'Unknown'})
        tf_id = go_to_tf.get(go_id)
        tf = transforms.get(tf_id, {'pos': [0, 0, 0], 'scale': [1, 1, 1], 'children': []})
        
        node = {
            'go_id': go_id,
            'name': go['name'],
            'pos': tf['pos'],
            'scale': tf['scale'],
            'sprites': [s['spriteName'] for s in go_to_sprites.get(go_id, []) if s.get('spriteName')],
            'buttons': go_to_buttons.get(go_id, []),
            'labels': [l['text'] for l in go_to_labels.get(go_id, [])],
            'anchors': go_to_anchors.get(go_id, []),
            'children': []
        }
        
        for c_tf_id in tf.get('children', []):
            c_tf = transforms.get(c_tf_id)
            if c_tf and c_tf.get('go'):
                node['children'].append(serialize_node(c_tf['go']))
                
        return node

    # Serialize HomeForm [4278] and MenuGroup [5734]
    home_tree = serialize_node('4278')
    menu_tree = serialize_node('5734')
    
    server_dir = r'C:\Users\trananh.dung\Downloads\DaiMinhChu_Server'
    out_json = os.path.join(server_dir, 'public', 'assets', 'ui', 'dmc_authentic', 'unity_ui_tree.json')
    
    with open(out_json, 'w', encoding='utf-8') as f:
        json.dump({'home': home_tree, 'menu': menu_tree}, f, indent=2, ensure_ascii=False)
        
    print(f"Exported UI tree to {out_json}")

if __name__ == '__main__':
    parse_scene_ui()
