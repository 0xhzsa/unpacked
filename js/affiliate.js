/* ============================================================
   AFFILIATE CONFIG — the only file you edit to monetize.

   HOW IT WORKS
   On every object's first stop ("The object"), descent.js asks
   this file for a "Where to get one" link. Three ways to answer:

   1. TAG only:    set `tag` below and leave links alone.
                   Every object gets an Amazon search link with
                   your tag appended automatically.

   2. Per object:  put plain text in `links` — it becomes an
                   Amazon search for those words (+ your tag).
                       "mechanical-keyboard": "keychron q1 pro"

   3. Full URL:    point at any store. Put {tag} where your
                   affiliate tag belongs; it gets substituted.
                       "hardcover-book": "https://bookshop.org/a/{tag}/…"

   An empty string "" hides the button for that object.
   Leaving `tag` empty hides ALL buy buttons site-wide —
   the site stays fully functional, just unmonetized.
   ============================================================ */

window.UNPACKED_AFFILIATE = {
  // Your Amazon Associates tag, e.g. "unpacked-20". Empty = no buy buttons.
  tag: "",

  // Per-object overrides (keys are the chain ids in js/journey.js).
  links: {
    "keyboard":       "mechanical keyboard",
    "desk-lamp":      "LED desk lamp",
    "office-chair":   "ergonomic office chair",
    "ceramic-mug":    "ceramic mug",
    "steel-desk":     "steel desk",
    "glass-window":   "",                    // nobody buys a window mid-story
    "hardcover-book": "hardcover book",
    "ceiling-fan":    "ceiling fan",
    "candle":         "scented candle",
    "armchair":       "rattan armchair",
    "insulated-bottle": "40 oz insulated tumbler",
    "wireless-earbuds": "wireless earbuds",
    "matcha-whisk": "matcha whisk chasen",
    "led-strip": "led strip lights",
    "magnet-power-bank": "magnetic power bank",
    "slow-rebound-ball": "slow rebound squishy ball",
    "mini-blender": "portable blender",
    "portable-ssd": "portable ssd",
    "ballpoint-pen": "ballpoint pen",
    "fridge-player": "mini record player fridge magnet"
  },

  // Honest, required disclosure. Shown in small print with the button.
  disclosure: "As an Amazon Associate, this site earns from qualifying purchases — at no extra cost to you."
};

/* Resolves a chain id to a URL, or null when the button should not show.
   descent.js calls this lazily at render time — no load-order coupling. */
window.UNPACKED_AFFILIATE_URL = function (objectId, objectName) {
  var cfg = window.UNPACKED_AFFILIATE || {};
  if (!cfg.tag) return null;                   // no tag configured -> no buy buttons anywhere
  var links = cfg.links || {};
  var raw = Object.prototype.hasOwnProperty.call(links, objectId)
    ? links[objectId]
    : (objectName || "");
  if (!raw) return null;                       // "" or unset -> no button

  var url;
  if (/^https?:/i.test(raw)) {
    var hadPlaceholder = String(raw).indexOf("{tag}") > -1;
    url = String(raw).replace("{tag}", encodeURIComponent(cfg.tag || ""));
    if (cfg.tag && !hadPlaceholder) {
      url += (url.indexOf("?") > -1 ? "&" : "?") + "tag=" + encodeURIComponent(cfg.tag);
    }
  } else {
    url = "https://www.amazon.com/s?k=" +
      String(raw).trim().toLowerCase().split(/\s+/).map(encodeURIComponent).join("+");
    if (cfg.tag) url += "&tag=" + encodeURIComponent(cfg.tag);
  }
  return url;
};
