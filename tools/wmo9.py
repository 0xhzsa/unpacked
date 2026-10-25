# Round-3e probe: earbuds + blender replacement titles only (no fetches).
# Picks happen by hand; fetch runs next as wmo10.
import modal

app = modal.App("unpacked-title-probe")
vol = modal.Volume.from_name("unpacked-imgs", create_if_missing=True)
image = modal.Image.debian_slim().pip_install("requests")

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
API = "https://commons.wikimedia.org/w/api.php"
GAP = 7.0

PROBES = [
    ("earbuds", ["true wireless earbuds", "TWS earbuds", "earbuds charging case",
                 "wireless earphones desk", "apple airpods photo", "samsung galaxy buds",
                 "earbuds on wooden table", "bluetooth earphones pair"]),
    ("blender", ["portable blender", "smoothie blender cup", "mason jar blender",
                 "immersion blender kitchen", "blender bottle drink", "personal smoothie maker"]),
]


@app.function(image=image, volumes={"/data": vol}, timeout=600)
def fetch():
    import requests

    log = []
    s = requests.Session()
    s.headers.update({"User-Agent": UA})

    for out, queries in PROBES:
        titles = []
        for q in queries:
            params = {"action": "query", "list": "search", "srsearch": q,
                      "srnamespace": "6", "srlimit": "14", "format": "json"}
            r = s.get(API, params=params, timeout=30)
            if r.status_code != 200:
                log.append(f"API {r.status_code}")
                import time
                time.sleep(GAP)
                continue
            j = r.json()
            for hit in j.get("query", {}).get("search", []):
                t = hit.get("title", "").replace("File:", "")
                if t not in titles:
                    titles.append(t)
            import time
            time.sleep(GAP)
        log.append(f"== {out} ({len(titles)}) ==")
        for t in titles:
            log.append(t)
    return "\n".join(log)


@app.local_entrypoint()
def main():
    out = fetch.remote()
    print(out)
