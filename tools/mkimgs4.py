import os

from PIL import Image

root = r"C:\Users\stagh\unpacked"
out = os.path.join(root, "assets", "img", "chasenk.jpg")
im = Image.open(os.path.join(root, "tools", "win-chasenk.jpg")).convert("RGB").crop((600, 0, 1280, 1119))
im.save(out, "JPEG", quality=86, progressive=True, optimize=True)
print("chasenk", im.size, os.path.getsize(out))
