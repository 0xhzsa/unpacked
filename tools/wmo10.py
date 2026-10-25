# Round-3f: fetch multiple named candidates per slot (earbuds-a..e, blender-a..e).
# Viewer picks the winner locally; losers get pruned from the volume later.
import re
import struct
import time

import modal

app = modal.App("unpacked-photo-fetch-7")
vol = modal.Volume.from_name("unpacked-imgs", create_if_missing=True)
image = modal.Image.debian_slim().pip_install("requests")

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
API = "https://commons.wikimedia.org/w/api.php"

TARGETS = [
    ("earbuds-a", "Fifth-generation AirPods in their charging case.jpg"),
    ("earbuds-b", "Samsung Galaxy Buds2 Pro (Graphite).jpg"),
    ("earbuds-c", "Here One earbuds in white charging case.jpg"),
    ("earbuds-d", "Samsung Galaxy Buds Live.jpg"),
    ("earbuds-e", "JLab true wireless.jpg"),
    ("blender-a", "Fruit preparation for healthy smoothie in a bright kitchen during morning.jpg"),
    ("blender-b", "Avocado, milk, condensed milk and ice smoothies - Amazing Chef food processor.jpg"),
    ("blender-c", "Girafe (cuisine).JPG"),
    ("blender-d", "Clear Blender Bottles at the Housewares Show (6833468208).jpg"),
    ("blender-e", "Banna Yogurt Smoothie.jpg"),
]
GAP = 6.5


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


@app.function(image=image, volumes={"/data": vol}, timeout=900)
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

    for out, title in TARGETS:
        j = api({
            "action": "query", "prop": "imageinfo",
            "iiprop": "url|size|mime|extmetadata",
            "iiextmetadatafilter": "Artist|LicenseShortName",
            "iiurlwidth": "1280", "titles": "File:" + title,
        })
        if not j:
            time.sleep(GAP)
            continue
        pages = j.get("query", {}).get("pages", {})
        pg = next(iter(pages.values())) if pages else None
        ii = (pg or {}).get("imageinfo", [None])[0]
        if not ii:
            log.append(f"MISS {title}")
            time.sleep(GAP)
            continue
        meta = ii.get("extmetadata", {}) or {}

        def plain(k):
            if not meta.get(k):
                return ""
            return re.sub(r"<[^>]*>", "", str(meta[k].get("value", ""))).replace("&amp;", "&").strip()

        url = ii.get("thumburl") or ii.get("url")
        mime = ii.get("mime", "")
        if not url or not ("jpeg" in mime or "jpg" in mime.lower()):
            log.append(f"SKIP2 {title} mime={mime}")
            time.sleep(GAP)
            continue
        buf = s.get(url, timeout=60).content
        dim = jpeg_dim(buf)
        if not dim or dim["w"] < 700:
            log.append(f"SIZED {title} dim={dim} bytes={len(buf)}")
            time.sleep(GAP)
            continue
        with open(f"/data/{out}.jpg", "wb") as f:
            f.write(buf)
        page = "https://commons.wikimedia.org/wiki/File:" + title.replace(" ", "_")
        log.append(f"OK {out}.jpg <- {title} | {plain('Artist')} | {plain('LicenseShortName')} | {dim['w']}x{dim['h']} | {len(buf)}B | {page}")
        time.sleep(GAP)
    vol.commit()
    with open("/data/log7.txt", "w") as f:
        f.write("\n".join(log))
    return "\n".join(log)


@app.local_entrypoint()
def main():
    out = fetch.remote()
    print(out)
