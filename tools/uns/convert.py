from PIL import Image
im = Image.open(r"tools/uns/earbuds-A.jpg").convert("RGB")
im.save(r"assets/img/earbuds.jpg", "JPEG", quality=88)
print("earbuds converted", im.size)
