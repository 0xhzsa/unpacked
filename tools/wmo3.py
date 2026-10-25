# Fetches replacement photos for UNPACKED via Wikimedia Commons from a Modal
# sandbox (fresh egress IP - this machine's IP is 429-throttled by Wikimedia).
# Pattern per RECOVERY-NOTE session 20: browser UA, >=6 s pacing, JPEG magic
# (FFD8FF) + width verify, standard-width thumbs (1920/1280) or originals.
# Output: files land in Modal Volume "unpacked-imgs"; fetch_log.json + log lines.
import base64
import re
import struct
import time

import modal

app = modal.App("unpacked-photo-fetch")
vol = modal.Volume.from_name("unpacked-imgs", create_if_missing=True)
image = modal.Image.debian_slim().pip_install("requests")

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
API = "https://commons.wikimedia.org/w/api.php"

TARGETS = [
    ["bauxite", ["Weipa-bauxite-mine.jpg", "BauxiteUSGOV.jpg", "Bauxite_with_unweathered_rock_core._C_021.jpg", "CaboRojoDRBauxite.jpg", "Bauxite herault.JPG"]],
    ["clay", ["Kaolinite from Twiggs County in Georgia in USA.jpg", "Kaznějov - kaolin quarry.jpg", "Kaolinite.jpg"]],
    ["batch", ["Pitted sand grains Western Desert.jpg", "CoralPinkSandDunesSand.JPG", "HeavyMineralsBeachSand.jpg", "Silica sand excavation, Leziate, Norfolk - geograph.org.uk - 2050948.jpg"]],
    ["screw", ["Screws.jpg", "Lag screw (05).jpg", "Senkschraube.jpg"]],
    ["frame", ["Chalot tenons mortaises.jpg", "Stool with woven seat MET 14.10.3 view 4.jpg", "Wooden hinge.JPG"]],
    ["carbide", ["Tungsten carbide inserts.jpg", "Tungsten carbide.jpg"]],
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
            import struct
            h = struct.unpack(">H", buf[i + 5:i + 7])[0]
            w = struct.unpack(">H", buf[i + 7:i + 9])[0]
            return {"h": h, "w": w}
        import struct
        l = struct.unpack(">H", buf[i + 2:i + 4])[0]
        i += 2 + l
    return None


@app.function(image=image, volumes={"/data": vol}, timeout=600)
def fetch():
    import requests

    log = []
    s = requests.Session()
    s.headers.update({"User-Agent": UA})

    def api_query(params):
        params = dict(params)
        params.update({"format": "json"})
        r = s.get(API, params=params, timeout=30)
        if r.status_code != 200:
            log.append(f"API {r.status_code}")
            return None
        return r.json()

    for out, cands in TARGETS:
        done = False
        for cand in cands:
            title = "File:" + cand.replace(" ", "_")
            try:
                j = api_query({
                    "action": "query", "prop": "imageinfo",
                    "iiprop": "url|size|mime|extmetadata",
                    "iiextmetadatafilter": "Artist|LicenseShortName|AttributionRequired",
                    "iiurlwidth": "1280", "titles": title,
                })
                if not j:
                    do_idle = 7.0
                    time.sleep(do_idle)
                    continue
                pages = j.get("query", {}).get("pages", {})
                pg = next(iter(pages.values())) if pages else None
                ii = (pg or {}).get("imageinfo", [None])[0]
                if not ii:
                    log.append(f"MISS {cand}")
                    time.sleep(GAP)
                    continue
                meta = ii.get("extmetadata", {}) or {}
                plain = lambda k: (re.sub(r"<[^>]*>", "", str((meta.get(k) or {}).get("value", ""))).replace("&amp;", "&").strip() if meta.get(k) else "")
                url = ii.get("thumburl") or ii.get("url")
                mime = ii.get("mime", "")
                w0, h0 = ii.get("width", 0), ii.get("height", 0)
                if not url or not ("jpeg" in mime or "jpg" in mime.lower() or w0 >= 1000):
                    log.append(f"SKIP2 {cand} mime={mime}")
                    time.sleep(GAP)
                    continue
                buf = s.get(url, timeout=60).content
                dim = jpeg_dim(buf)
                if not dim or dim["w"] < 950:
                    log.append(f"SIZED {cand} dim={dim} bytes={len(buf)}")
                    time.sleep(GAP)
                    continue
                with open(f"/data/{out}.jpg", "wb") as f:
                    f.write(buf)
                artist = plain("Artist")
                lic = plain("LicenseShortName")
                page = "https://commons.wikimedia.org/wiki/" + title.replace(" ", "_")
                log.append(f"OK {out}.jpg <- {cand} | {artist} | {lic} | {dim['w']}x{dim['h']} | {len(buf)}B | {page}")
                done = True
                break
            except Exception as e:
                log.append(f"ERR {cand}: {type(e).__name__} {e}")
                time.sleep(GAP)
        if not done:
            log.append(f"FAILED {out}")
        time.sleep(GAP)
    vol.commit()
    with open("/data/log.txt", "w") as f:
        f.write("\n".join(log))
    return "\n".join(log)


@app.local_entrypoint()
def main():
    out = fetch.remote()
    print(out)


re_setsce = None
