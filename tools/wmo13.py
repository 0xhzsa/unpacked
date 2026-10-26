# Round-5 photos: curated Commons categories first, text-search fallback;
# candidates -> volume cand2-*, plus a labeled contact sheet.
import re
import struct
import time

import modal

app = modal.App("unpacked-photo-fetch-10")
vol = modal.Volume.from_name("unpacked-imgs", create_if_missing=True)
image = modal.Image.debian_slim().pip_install("requests", "pillow")

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
API = "https://commons.wikimedia.org/w/api.php"

# prefix -> (category, text-search query, n)
TARGETS = [
    ("chair",  "Office chairs",        "office chair", 8),
    ("metal",  "Computer desks",       "steel desk computer workplace", 8),
    ("glass",  "Window panes",         "window pane glass daylight interior", 8),
    ("bottle", "Vacuum flasks",        "stainless insulated bottle", 8),
    ("fan",    "Ceiling fans",         "wooden ceiling fan view from below", 8),
    ("candle", "Burning candles",      "lit candle dark background", 8),
    ("ssd",    "Solid-state drives",   "portable external SSD USB drive", 8),
    ("penball", "Ballpoint pens",      "ballpoint pen tip ball macro", 8),
    ("knot",   "",                     "chasen bamboo whisk binding knot", 8),
]
GAP = 4.0


def jpeg_dim(buf):
    if not buf or len(buf) < 4 or buf[0] != 0xFF or buf[1] != 0xD8:
        return None
    i = 2
    while i + 9 < len(buf):
        if buf[i] != 0xFF:
            i += 1
            continue
        m = buf[i + 1]
        if 0xC0 <= m <= 0xCF and m not in (0xC4, 0xC8, 0xCC):
            h = struct.unpack(">H", buf[i + 5:i + 7])[0]
            w = struct.unpack(">H", buf[i + 7:i + 9])[0]
            return {"h": h, "w": w}
        l = struct.unpack(">H", buf[i + 2:i + 4])[0]
        i += 2 + l
    return None


@app.function(image=image, volumes={"/data": vol}, timeout=1400)
def fetch():
    import requests

    log = []
    s = requests.Session()
    s.headers.update({"User-Agent": UA})

    def api(params):
        params = dict(params)
        params.update({"format": "json"})
        r = s.get(API, params=params, timeout=30)
        if r.status_code != 200:
            log.append(f"API {r.status_code}")
            return None
        return r.json()

    def grab(prefix, idx, title, ii):
        meta = ii.get("extmetadata", {}) or {}

        def plain(k):
            if not meta.get(k):
                return ""
            return re.sub(r"<[^>]*>", "", str(meta[k].get("value", ""))).replace("&amp;", "&").strip()

        mime = ii.get("mime", "")
        url = ii.get("thumburl") or ii.get("url")
        if not url or "jpeg" not in mime:
            return 0
        try:
            buf = s.get(url, timeout=60).content
        except Exception as e:
            log.append(f"ERR {title} {e}")
            return 0
        dim = jpeg_dim(buf)
        if not dim or dim["w"] < 800:
            log.append(f"SIZED {title} {dim}")
            return 0
        out = f"cand2-{prefix}-{idx}.jpg"
        with open(f"/data/{out}", "wb") as f:
            f.write(buf)
        page = "https://commons.wikimedia.org/wiki/" + title.replace(" ", "_").replace("File:", "File:")
        log.append(f"OK {out} <- {title} | {plain('Artist')} | {plain('LicenseShortName')} | {dim['w']}x{dim['h']} | {len(buf)}B | {page}")
        return 1

    for prefix, cat, q, n in TARGETS:
        got = 0
        if cat:
            j = api({
                "action": "query", "generator": "categorymembers",
                "gcmtitle": "Category:" + cat, "gcmnamespace": "6", "gcmlimit": "30",
                "prop": "imageinfo", "iiprop": "url|size|mime|extmetadata",
                "iiextmetadatafilter": "Artist|LicenseShortName", "iiurlwidth": "1280",
            })
            time.sleep(GAP)
            if j and j.get("query"):
                pages = j["query"].get("pages", {})
                pages = sorted(pages.values(), key=lambda p: (p.get("title", "")))
                for pg in pages:
                    if got >= n:
                        break
                    ii = (pg.get("imageinfo") or [None])[0]
                    if ii:
                        got += grab(prefix, got + 1, pg.get("title", ""), ii)
                        time.sleep(GAP)
        if got == 0 and q:
            j = api({
                "action": "query", "generator": "search",
                "gsrsearch": q, "gsrnamespace": "6", "gsrlimit": "20",
                "prop": "imageinfo", "iiprop": "url|size|mime|extmetadata",
                "iiextmetadatafilter": "Artist|LicenseShortName", "iiurlwidth": "1280",
            })
            time.sleep(GAP)
            if j and j.get("query"):
                pages = j["query"].get("pages", {})
                pages = sorted(pages.values(), key=lambda p: (p.get("index", 99)))
                for pg in pages:
                    if got >= n:
                        break
                    ii = (pg.get("imageinfo") or [None])[0]
                    if ii:
                        got += grab(prefix, got + 1, pg.get("title", ""), ii)
                        time.sleep(GAP)
        if got == 0:
            log.append(f"EMPTY {prefix}")
    vol.commit()
    with open("/data/log10.txt", "w") as f:
        f.write("\n".join(log))
    return "\n".join(log)


@app.function(image=image, volumes={"/data": vol}, timeout=300)
def sheet():
    import glob as g2

    from PIL import Image, ImageDraw

    files = sorted(g2.glob("/data/cand2-*.jpg"))
    cell_w, cell_h, lab = 320, 196, 18
    cols = 8
    rows = (len(files) + cols - 1) // cols
    sheetimg = Image.new("RGB", (cols * cell_w, rows * (cell_h + lab + 4)), (15, 13, 16))
    d = ImageDraw.Draw(sheetimg)
    for i, fp in enumerate(files):
        try:
            im = Image.open(fp).convert("RGB")
        except Exception:
            continue
        w, h = im.size
        scale = max(cell_w / w, cell_h / h)
        im = im.resize((max(cell_w, int(w * scale)), max(cell_h, int(h * scale))))
        left = (im.width - cell_w) // 2
        top = (im.height - cell_h) // 2
        im = im.crop((left, top, left + cell_w, top + cell_h))
        x, y = (i % cols) * cell_w, (i // cols) * (cell_h + lab + 4)
        sheetimg.paste(im, (x, y))
        d.text((x + 6, y + cell_h + 2), fp.split("/")[-1], fill=(242, 239, 233))
    sheetimg.save("/data/sheet10.png")
    return f"SHEET cells={len(files)}"


@app.local_entrypoint()
def main():
    log = fetch.remote()
    print(log)
    print(sheet.remote())
