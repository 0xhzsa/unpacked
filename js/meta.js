// js/meta.js - v3 design system data: line identity, per-line accent + ground, series copy.
// Codes and accents are fixed (one per line, no adjacent repeats in wall order).
// Taglines carried verbatim from js/journey.js (audited). Grounds are the room "We end at" strings.
window.UNPACKED_META = {
  series: {
    name: "UNPACKED",
    tag: "every ordinary thing starts somewhere",
    intro: "Nineteen objects in one room. Every one of them has a line: a chain of machines, wells, mines and fields that ends somewhere real. Ride any line down to its ground.",
    groundsNote: "19 lines end in 13 grounds",
    shareKicker: "I rode",
    shareFooter: "unpacked. every stop, every stat verified.",
    shareUrl: "https://0xhzsa.github.io/unpacked/"
  },
  fams: {
    oil: { label: "Crude oil", gives: "plastic, foam, resin" },
    bauxite: { label: "Bauxite", gives: "aluminum" },
    kaolin: { label: "Kaolin", gives: "china clay" },
    iron: { label: "Iron ore", gives: "steel" },
    sand: { label: "Silica sand", gives: "glass" },
    spruce: { label: "Spruce", gives: "paper" },
    copper: { label: "Copper", gives: "wire, foil" },
    grove: { label: "Palm and bamboo", gives: "cane, tines" },
    lithium: { label: "Lithium", gives: "brine batteries" }
  },
  lines: {
    "keyboard":         { code: "KB", acc: "#FF6B8B", fam: "oil",     ground: "A crude oil well",  kind: "Well",   quip: "Every switch in the room began this story in this hole.",                         tagline: "Eighty-seven tiny machines, none of them from the same place." },
    "desk-lamp":        { code: "LT", acc: "#FFD34D", fam: "bauxite", ground: "A bauxite mine",    kind: "Mine",   quip: "Red dirt melted into metal, still carrying the electricity it cost.",             tagline: "450 lumens, traced back to red dirt and a bolt of lightning." },
    "office-chair":     { code: "CH", acc: "#B18CFF", fam: "oil",     ground: "A crude oil well",  kind: "Well",   quip: "Same well as the keyboard, different shape: plastic and trapped gas.",             tagline: "113 kilograms, held up by plastic, steel and trapped gas." },
    "ceramic-mug":      { code: "MG", acc: "#66E8D2", fam: "kaolin",  ground: "A kaolin mine",     kind: "Mine",   quip: "Mud that learned to hold coffee.",                                                tagline: "Mud, turned to stone by fire, holding your coffee." },
    "steel-desk":       { code: "DK", acc: "#8FA0B5", fam: "iron",    ground: "An iron ore mine",  kind: "Mine",   quip: "Benches of ore, rolled to one thin sheet.",                                       tagline: "One thin sheet of steel, from a furnace and a hundred-meter pit." },
    "glass-window":     { code: "GL", acc: "#74E0FF", fam: "sand",    ground: "A sand quarry",     kind: "Quarry", quip: "Sand washed clean enough to disappear.",                                          tagline: "A ribbon of glass, floated flat and never touched by a tool." },
    "hardcover-book":   { code: "BK", acc: "#E8E4D9", fam: "spruce",  ground: "A spruce forest",   kind: "Forest", quip: "Every unread page is still standing here.",                                       tagline: "A forest, flattened into 336 pages and glued around cardboard." },
    "ceiling-fan":      { code: "FN", acc: "#FF8A3D", fam: "copper",  ground: "A copper mine",     kind: "Mine",   quip: "The hum over your bed starts in benches like these.",                             tagline: "Quiet work overhead, ending in a half-kilometer copper hole." },
    "candle":           { code: "CD", acc: "#FFA94D", fam: "sand",    ground: "A sand quarry",     kind: "Quarry", quip: "Quartz clean down to the hundredth of a percent.",                                tagline: "Crude oil that never learned to be fuel, burning under a glass hat." },
    "armchair":         { code: "AR", acc: "#D9B98A", fam: "grove",   ground: "A rattan grove",    kind: "Grove",  quip: "Cut the palm and the clump pays you back.",                                       tagline: "A climbing palm, split by machine and woven into a teak skeleton." },
    "insulated-bottle": { code: "BT", acc: "#5FA8E8", fam: "iron",    ground: "An iron ore mine",  kind: "Mine",   quip: "Ore benches, drawn thin enough to hold ice for a day.",                           tagline: "Forty ounces of steel with a vacuum where summer can't reach." },
    "wireless-earbuds": { code: "EB", acc: "#FF4E5E", fam: "copper",  ground: "A copper pit",      kind: "Pit",    quip: "Every coin of copper in your ear was hauled up by the ton.",                      tagline: "Two tiny computers, traced back to salt flats and copper pits." },
    "matcha-whisk":     { code: "MW", acc: "#8AC926", fam: "grove",   ground: "A bamboo grove",    kind: "Grove",  quip: "Timber in one season, gone and back again.",                                      tagline: "One culm of bamboo, split into a hundred tines by hand." },
    "led-strip":        { code: "LS", acc: "#59F07B", fam: "copper",  ground: "A copper mine",     kind: "Mine",   quip: "Same copper country, another reel: foil for the glow.",                           tagline: "Five meters of blue crystals, traced back to a copper pit." },
    "magnet-power-bank":{ code: "PB", acc: "#C084FC", fam: "lithium", ground: "A lithium flat",    kind: "Flat",   quip: "A flat the size of a small country, sun-dried into pocket batteries.",            tagline: "Snap-on charging, traced back to magnets, lithium and copper." },
    "slow-rebound-ball":{ code: "SB", acc: "#00B3A4", fam: "oil",     ground: "A crude oil well",  kind: "Well",   quip: "The foam is petroleum recalculated as a slow spring.",                            tagline: "A ball that remembers its shape - NASA foam at desk scale." },
    "mini-blender":     { code: "BL", acc: "#FF7A5C", fam: "oil",     ground: "A crude oil well",  kind: "Well",   quip: "Clear plastic is crude oil taught to disappear.",                                 tagline: "Poplawski's 1922 blades, shrunk into a bottle." },
    "portable-ssd":     { code: "SD", acc: "#E4E9F0", fam: "bauxite", ground: "A bauxite pit",     kind: "Pit",    quip: "Same red dirt, last stop: the shell your files sleep in.",                        tagline: "A data center in a coin pocket - no moving parts." },
    "ballpoint-pen":    { code: "PN", acc: "#D8B04A", fam: "iron",    ground: "Iron ore benches",  kind: "Pit",    quip: "Iron benches feed every spring in every pen.",                                    tagline: "A carbide ball rolling in a paste of ink - Bíró's escaper." }
  }
};
