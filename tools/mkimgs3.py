import os

from PIL import Image

root = r"C:\Users\stagh\unpacked"
src = os.path.join(root, "tools")
dst = os.path.join(root, "assets", "img")

# candle: honest crop, no black padding (source win-candle is 1280x853)
im = Image.open(os.path.join(src, "win-candle.jpg")).convert("RGB").crop((320, 60, 1280, 853))
im.save(os.path.join(dst, "candle.jpg"), "JPEG", quality=86, progressive=True, optimize=True)
print("candle", im.size, os.path.getsize(os.path.join(dst, "candle.jpg")))

# chasenk: straight pass-through for now, crop decided after viewing
im = Image.open(os.path.join(src, "win-chasenk.jpg")).convert("RGB")
if im.width > 1280:
    im = im.resize((1280, int(im.height * 1280 / im.width)), Image.LANCZOS)
im.save(os.path.join(dst, "chasenk.jpg"), "JPEG", quality=86, progressive=True, optimize=True)
print("chasenk", im.size, os.path.getsize(os.path.join(dst, "chasenk.jpg")))
