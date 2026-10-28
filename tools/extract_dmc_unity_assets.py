import os
import re
from PIL import Image

def main():
    project_dir = r'C:\Users\trananh.dung\Downloads\DMC_Project\ExportedProject\Assets'
    go_dir = os.path.join(project_dir, 'GameObject')
    tex_dir = os.path.join(project_dir, 'Texture2D')
    
    server_dir = r'C:\Users\trananh.dung\Downloads\DaiMinhChu_Server'
    out_dir = os.path.join(server_dir, 'public', 'assets', 'ui', 'dmc_authentic')
    os.makedirs(out_dir, exist_ok=True)
    
    atlases = [
        ('GUIAtlas.prefab', 'GUIAtlas.png'),
        ('IconAtlas.prefab', 'IconAtlas.png'),
        ('KyNgoAtlas.prefab', 'KyNgoAtlas.png'),
        ('N2_GUIAtlas.prefab', 'N2_GUIAtlas.png'),
        ('N3_GUIAtlas.prefab', 'N3_GUIAtlas.png'),
        ('N4_GUIAtlas.prefab', 'N4_GUIAtlas.png'),
        ('NVAvatarSmallAtlas.prefab', 'NVAvatarSmallAtlas.png'),
        ('OtherAvatarSmallAtlas.prefab', 'OtherAvatarSmallAtlas.png')
    ]
    
    manifest = {}
    total_extracted = 0
    
    for prefab_name, tex_name in atlases:
        prefab_path = os.path.join(go_dir, prefab_name)
        tex_path = os.path.join(tex_dir, tex_name)
        
        if not os.path.exists(prefab_path) or not os.path.exists(tex_path):
            print(f"Skipping {prefab_name} (files not found)")
            continue
            
        print(f"\nProcessing {prefab_name} with texture {tex_name}...")
        tex = Image.open(tex_path).convert('RGBA')
        tex_w, tex_h = tex.size
        
        with open(prefab_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
            
        # Parse sprites: - name: ... outer: ... x: ... y: ... width: ... height: ...
        sprite_blocks = content.split('- name:')
        atlas_count = 0
        
        for block in sprite_blocks[1:]:
            lines = block.split('\n')
            name = lines[0].strip()
            
            # extract outer rect
            m_x = re.search(r'\bx:\s*(\d+)', block)
            m_y = re.search(r'\by:\s*(\d+)', block)
            m_w = re.search(r'\bwidth:\s*(\d+)', block)
            m_h = re.search(r'\bheight:\s*(\d+)', block)
            
            if not (m_x and m_y and m_w and m_h):
                continue
                
            x = int(m_x.group(1))
            y = int(m_y.group(1))
            w = int(m_w.group(1))
            h = int(m_h.group(1))
            
            if w <= 0 or h <= 0 or x + w > tex_w or y + h > tex_h:
                continue
                
            # Crop sprite
            crop = tex.crop((x, y, x + w, y + h))
            
            # Sanitize filename (replace invalid Windows chars like / : * ? " < > |)
            safe_name = re.sub(r'[\\/*?:"<>|]', '_', name) + '.png'
            save_path = os.path.join(out_dir, safe_name)
            
            crop.save(save_path, 'PNG')
            
            manifest[name] = {
                'atlas': prefab_name.replace('.prefab', ''),
                'file': safe_name,
                'path': f'/assets/ui/dmc_authentic/{safe_name}',
                'rect': [x, y, w, h]
            }
            
            atlas_count += 1
            total_extracted += 1
            
        print(f"  Extracted {atlas_count} sprites from {prefab_name}")
        
    print(f"\nTotal extracted sprites: {total_extracted}")
    
    # Save manifest
    manifest_path = os.path.join(server_dir, 'public', 'assets', 'ui', 'dmc_authentic', 'sprites_manifest.json')
    import json
    with open(manifest_path, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)
        
    print(f"Saved manifest to {manifest_path}")

if __name__ == '__main__':
    main()
