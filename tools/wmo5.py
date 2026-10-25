# Round-3 fetch (session 23): object #20 "Fridge Record Player" photos.
# Same fresh-IP Wikimedia pipeline as wmo3/wmo4. Attribution log: /data/log3.txt
import re
import struct
import time

import modal

app = modal.App("unpacked-photo-fetch-3")
vol = modal.Volume.from_name("unpacked-imgs", create_if_missing=True)
image = modal.Image.debian_slim().pip_install("requests")

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
API = "https://commons.wikimedia.org/w/api.php"

TARGETS = [
    ["turntable", ["Crosley_Record_Player.jpg", "Technics_SL-1200MK2-2.jpg", "Portable_78_rpm_record_player.jpg"]],
    ["speaker", ["Fostex_FE206e_(modified)_full-range_drive_unit_loudspeaker,_using_a_whizzer_cone.jpg", "Rice_Kellogg_loudspeaker_1.jpg", "4-Wege_Lautsprecher.jpg"]],
    ["neomagnet", ["Big_neodymium_magnet.jpg", "Neodymium_magnet_lifting_spheres.jpg", "NeoCube.jpg"]],
    ["neodymium", ["Neodymium_metal.jpg", "Neodymium-2.jpg", "Neodymium_magnet_lifting_spheres.jpg"]],
    ["mine", ["Baiyunebo_ast_2006181.jpg", "Bingham_Canyon_Mine,_Utah.jpg", "Chuquicamata.jpg"]],
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
                    time.sleep(GAP)
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
                w0 = ii.get("width", 0)
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
    with open(f"/data/log3.txt", "w") as f:
        f.write("\n".join(log))
    return "\n".join(log)


@app.local_entrypoint()
def main():
    out = fetch.remote()
    print(out)
