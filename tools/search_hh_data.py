import os

def search_text_in_files(directory, term):
    results = []
    for root, dirs, files in os.walk(directory):
        for f in files:
            if f.endswith((".js", ".json", ".txt")):
                p = os.path.join(root, f)
                try:
                    with open(p, "r", encoding="utf-8", errors="ignore") as file:
                        c = file.read()
                        if term.lower() in c.lower():
                            results.append(p)
                except:
                    pass
    return results

matches = search_text_in_files(r"C:\Users\trananh.dung\Downloads\DaiMinhChu_Server", "HuongHuong")
print("Matches in server:", matches)
