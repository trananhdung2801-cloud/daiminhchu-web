import os

apk_res = r"C:\Users\trananh.dung\Downloads\Dai Minh Chu_8.0.2_APKPure\res"
server_assets = r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server\public\assets"

def search_files(directory, keywords):
    matches = []
    for root, dirs, files in os.walk(directory):
        for f in files:
            lower = f.lower()
            if any(k in lower for k in keywords):
                matches.append(os.path.join(root, f))
    return matches

print("Searching for scroll / card / hero assets...")
card_files = search_files(server_assets, ["scroll", "card", "hero", "duyen", "stat", "dantran", "khim"])
print(f"Found {len(card_files)} in server public/assets")
for f in card_files[:15]:
    print(" ", os.path.relpath(f, server_assets))

apk_matches = search_files(apk_res, ["scroll", "dantran", "card", "huonghuong", "boiduong", "hero", "kim"])
print(f"Found {len(apk_matches)} in APK res")
for f in apk_matches[:20]:
    print(" ", os.path.basename(f))
