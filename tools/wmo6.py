# Round-3b fetch (session 23): retry the 3 failed object-20 photos with a
# Commons SEARCH fallback. Same fresh-IP pipeline. Attribution log: /data/log4.txt
import re
import struct
import time

import modal

app = modal.App("unpacked-photo-fetch-4")
vol = modal.Volume.from_name("unpacked-imgs", create_if_missing=True)
image = modal.Image.debian_slim().pip_install("requests")

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
API = "https://commons.wikimedia.org/w/api.php"

# (out, min_width, [explicit candidates], [search queries])
TARGETS = [
    ("speaker", 900,
     ["Lautsprecher_4-wege_2.jpg", "Tw15ul9.jpg", "Fostex_FE103Sigma.jpg"],
     ["loudspeaker driver cone magnet", "speaker chassis woofer", "full range loudspeaker unit"]),
    ("neodymium", 900,
     ["Neodymium_metal_chunk.jpg", "Neodymium-oxide.jpg", "Rare_earth_ore.jpg"],
     ["neodymium metal sample", "neodymium oxide powder", "rare earth minerals ore"]),
    ("mine", 700,
     ["Bingham_Canyon_Mine.jpg", "Chuquicamata_mine.jpg"],
     ["Bayan Obo mine", "open pit rare earth mine", "Bingham Canyon Mine"]),
]
GAP = 7.0


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

    def try_title(title, minw, out):
        """Return True if downloaded."""
        j = api({
            "action": "query", "prop": "imageinfo",
            "iiprop": "url|size|mime|extmetadata",
            "iiextmetadatafilter": "Artist|LicenseShortName",
            "iiurlwidth": "1280", "titles": "File:" + title,
        })
        if not j:
            time.sleep(GAP)
            return False
        pages = j.get("query", {}).get("pages", {})
        pg = next(iter(pages.values())) if pages else None
        ii = (pg or {}).get("imageinfo", [None])[0]
        if not ii:
            log.append(f"MISS {title}")
            time.sleep(GAP)
            return False
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
            return False
        buf = s.get(url, timeout=60).content
        dim = jpeg_dim(buf)
        if not dim or dim["w"] < minw:
            log.append(f"SIZED {title} dim={dim} bytes={len(buf)}")
            time.sleep(GAP)
            return False
        with open(f"/data/{out}.jpg", "wb") as f:
            f.write(buf)
        page = "https://commons.wikimedia.org/wiki/File:" + title.replace(" ", "_")
        log.append(f"OK {out}.jpg <- {title} | {plain('Artist')} | {plain('LicenseShortName')} | {dim['w']}x{dim['h']} | {len(buf)}B | {page}")
        return True

    for out, minw, cands, queries in TARGETS:
        done = False
        for c in cands:
            if try_title(c, minw, out):
                done = True
                break
        if not done:
            titles = []
            for q in queries:
                j = api({"action": "query", "list": "search", "srsearch": q,
                         "srnamespace": "6", "srlimit": "12"})
                time.sleep(GAP)
                if not j:
                    continue
                for hit in j.get("query", {}).get("search", []):
                    t = hit.get("title", "").replace("File:", "")
                    if re.search(r"\.(jpg|jpeg)$", t, re.I) and t not in titles:
                        titles.append(t)
                if len(titles) >= 18:
                    break
            log.append(f"SEARCH {out}: {len(titles)} titles")
            for t in titles[:14]:
                if re.search(r"(logo|diagram|icon|chart|map|\.svg)", t, re.I):
                    continue
                if try_title(t, minw, out):
                    done = True
                    break
        if not done:
            log.append(f"FAILED {out}")
        time.sleep(GAP)
    vol.commit()
    with open(f"/data/log4.txt", "w") as f:
        f.write("\n".join(log))
    return "\n".join(log)


@app.local_entrypoint()
def main():
    out = fetch.remote()
    print(out)
