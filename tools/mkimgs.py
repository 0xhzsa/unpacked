import os

from PIL import Image

JOBS = [
    ("win-chair.jpg", "chair.jpg", 1280),
    ("win-candle.jpg", "candle.jpg", 1280),
    ("win-fan.jpg", "fan.jpg", 1280),
    ("win-penball.jpg", "penball.jpg", 1280),
    ("win-chasenk.jpg", "chasenk.jpg", 1280),
]
root = r"C:\Users\stagh\unpacked"
src = os.path.join(root, "tools")
dst = os.path.join(root, "assets", "img")
for s, d, maxw in JOBS:
    p = os.path.join(src, s)
    out = os.path.join(dst, d)
    if not os.path.exists(p):
        print("MISS", s)
        continue
    im = Image.open(p).convert("RGB")
    w, h = im.size
    if w > maxw:
        im = im.resize((maxw, int(h * maxw / w)), Image.LANCZOS)
    im.save(out, "JPEG", quality=84, progressive=True, optimize=True)
    print("WROTE", d, im.size, os.path.getsize(out), "B")
