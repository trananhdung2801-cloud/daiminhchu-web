import urllib.request
import re
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')
url = "https://www.youtube.com/watch?v=GQs_-2SLt1s"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
try:
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode("utf-8", "ignore")
    title_match = re.search(r"<title>(.*?)</title>", html)
    print("Title:", title_match.group(1) if title_match else "None")
    
    # Extract video details
    vdetails = re.search(r'"videoDetails":(\{.*?"shortDescription":".*?"\})', html)
    if vdetails:
        print("Details snippet:", vdetails.group(1)[:300])
except Exception as e:
    print("Error:", e)
