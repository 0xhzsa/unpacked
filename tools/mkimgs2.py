import os

from PIL import Image

root = r"C:\Users\stagh\unpacked"
jobs = [
    # (src tools file, crop box l,t,r,b, out asset)
    ("win-penball.jpg", (0, 45, 700, 745), "penball.jpg"),
    ("win-candle.jpg", (320, 60, 1280, 969), "candle.jpg"),
]
src_d = os.path.join(root, "tools")
dst_d = os.path.join(root, "assets", "img")
for s, box, d in jobs:
    p = os.path.join(src_d, s)
    im = Image.open(p).convert("RGB").crop(box)
    if im.width > 1280:
        im = im.resize((1280, int(im.height * 1280 / im.width)), Image.LANCZOS)
    im.save(os.path.join(dst_d, d), "JPEG", quality=86, progressive=True, optimize=True)
    print("WROTE", d, im.size, os.path.getsize(os.path.join(dst_d, d)), "B")
