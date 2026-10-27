from PIL import Image

im_tl = Image.open(r"C:\Users\trananh.dung\.gemini\antigravity\brain\c5662992-6914-4398-a616-eb4454ce7882\.user_uploaded\media_1793077664238_d62bba4b.jpg")
# The scroll is at y: 236 to 872
# Let's inspect the 5 avatars in im_tl:
# 1. Top Avatar (above yellow dragon):
# x: ~225 to ~305, y: ~320 to ~405
# 2. Left Avatar (left of brown dragon):
# x: ~80 to ~160, y: ~460 to ~540
# 3. Right Avatar (right of green dragon):
# x: ~380 to ~460, y: ~460 to ~540
# 4. Bottom-Left Avatar (below red dragon):
# x: ~115 to ~195, y: ~680 to ~760
# 5. Bottom-Right Avatar (below blue dragon):
# x: ~340 to ~420, y: ~680 to ~760

print("Scroll offset y = 236")
print("Top avatar:", (225, 320 - 236), (305, 405 - 236))
print("Left avatar:", (80, 460 - 236), (160, 540 - 236))
print("Right avatar:", (380, 460 - 236), (460, 540 - 236))
print("Bottom-left avatar:", (115, 680 - 236), (195, 760 - 236))
print("Bottom-right avatar:", (340, 680 - 236), (420, 760 - 236))
