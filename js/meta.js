// js/meta.js - v3 design system data: line identity, per-line accent + ground, series copy.
// Codes and accents are fixed (one per line, no adjacent repeats in wall order).
// Taglines carried verbatim from js/journey.js (audited). Grounds are the room "We end at" strings.
window.UNPACKED_META = {
  series: {
    name: "UNPACKED",
    tag: "every ordinary thing starts somewhere",
    intro: "Twenty objects in one room. Every one of them has a line: a chain of machines, wells, mines and fields that ends somewhere real. Ride any line down to its ground.",
    groundsNote: "20 lines end in 14 grounds",
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
    lithium: { label: "Lithium", gives: "brine batteries" },
    re:      { label: "Rare earth", gives: "neodymium magnets" }
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
    "ballpoint-pen":    { code: "PN", acc: "#D8B04A", fam: "iron",    ground: "Iron ore benches",  kind: "Pit",    quip: "Iron benches feed every spring in every pen.",                                    tagline: "A carbide ball rolling in a paste of ink - Bíró's escaper." },
    "fridge-player":   { code: "FP", acc: "#FF4FA3", fam: "re",     ground: "A rare earth mine", kind: "Mine",   quip: "The disc on your fridge door was rock in Inner Mongolia last century.",            tagline: "Nine little records, one magnet, traced down to a pit the size of a town." }
  }
};

// Per-photo credits for files whose source is on record (RECOVERY-NOTE.md).
// Keys are assets/img basenames; files absent here fall back to the generic
// "Wikimedia Commons" station-sheet credit. Titles are exact Commons
// filenames; artists/licenses as recorded in the fetch logs (no fabrication).
window.UNPACKED_CREDITS = {
  "room":        { title: "Laptop and lamp on table (Unsplash).jpg", licc: "CC0", url: "https://commons.wikimedia.org/wiki/File:Laptop_and_lamp_on_table_(Unsplash).jpg" },
  "mug":         { title: "Polka-dot mug (Unsplash).jpg", licc: "CC0", url: "https://commons.wikimedia.org/wiki/File:Polka-dot_mug_(Unsplash).jpg" },
  "minekaolin":  { title: "China clay pit, Wheal Martyn 1.jpg", licc: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:China_clay_pit,_Wheal_Martyn_1.jpg" },
  "mineiron":    { title: "2025-01-18 Hull-Rust-Mahoning Open Pit Iron Mine, view from visitor center.jpg", licc: "CC BY 4.0", url: "https://commons.wikimedia.org/wiki/File:2025-01-18_Hull-Rust-Mahoning_Open_Pit_Iron_Mine,_view_from_visitor_center.jpg" },
  "mineiron2":   { title: "Schefferville open pit mining for iron ore.jpg", licc: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Schefferville_open_pit_mining_for_iron_ore.jpg" },
  "mineiron3":   { title: "One of the iron ore mines in Keonjhar district.jpg", licc: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:One_of_the_iron_ore_mines_in_Keonjhar_district.jpg" },
  "minecopper":  { title: "2019 Bingham Canyon Mine 02.jpg", licc: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:2019_Bingham_Canyon_Mine_02.jpg" },
  "minecopper2": { title: "Elshitsa-open-pit-copper-mine.jpg", licc: "CC BY-SA 3.0", url: "https://commons.wikimedia.org/wiki/File:Elshitsa-open-pit-copper-mine.jpg" },
  "minecopper3": { title: "Mina de Chuquicamata, Calama, Chile, 2016-02-01, DD 110-112 PAN.JPG", licc: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Mina_de_Chuquicamata,_Calama,_Chile,_2016-02-01,_DD_110-112_PAN.JPG" },
  "press-a":     { title: "Arburg-swiss plastic 2026.jpg", licc: "CC0", url: "https://commons.wikimedia.org/wiki/File:Arburg-swiss_plastic_2026.jpg" },
  "press-b":     { title: "Injection Molding Machine with a robot arm.jpg", licc: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Injection_Molding_Machine_with_a_robot_arm.jpg" },
  "press-c":     { title: "Machine injection platique Engel (4).jpg", licc: "CC0", url: "https://commons.wikimedia.org/wiki/File:Machine_injection_platique_Engel_(4).jpg" },
  "castfoam":    { title: "Molded polyurethane foam.JPG", licc: "CC BY-SA 3.0", url: "https://commons.wikimedia.org/wiki/File:Molded_polyurethane_foam.JPG" },
  "saltflat":    { title: "Salar de Olaroz, Jujuy, Argentina.jpg", licc: "CC BY-SA 2.0", url: "https://commons.wikimedia.org/wiki/File:Salar_de_Olaroz,_Jujuy,_Argentina.jpg" },
  "ssdpcb":      { title: "Intenso 2.5- 128 GB SATA III SSD - board - Silicon Motion SM2246EN-40585.jpg", licc: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Intenso_2.5-_128_GB_SATA_III_SSD_-_board_-_Silicon_Motion_SM2246EN-40585.jpg" },
  "sand":        { title: "Silica sand excavation, Leziate, Norfolk - geograph.org.uk - 2050948.jpg", licc: "CC BY-SA 2.0", url: "https://commons.wikimedia.org/wiki/File:Silica_sand_excavation,_Leziate,_Norfolk_-_geograph.org.uk_-_2050948.jpg" },
  "magnets":     { title: "Bar-magnets-attracting-iron-filings max.jpg", licc: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Bar-magnets-attracting-iron-filings_max.jpg" },
  "ledreel":     { title: "Light blue LED strip.jpg", licc: "CC0", url: "https://commons.wikimedia.org/wiki/File:Light_blue_LED_strip.jpg" },
  "ledstrip":    { title: "LED strip closeup.jpg", licc: "CC BY 4.0", url: "https://commons.wikimedia.org/wiki/File:LED_strip_closeup.jpg" },
  "ssd":         { title: "SanDisk Extreme Portable SSD 1 TB - front view.jpg", licc: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:SanDisk_Extreme_Portable_SSD_1_TB_-_front_view.jpg" },
  "earbuds":     { title: "AirPods.jpg", licc: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:AirPods.jpg" },
  "chasen":      { title: "Chasen-side-fs PNr°0499.jpg", licc: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Chasen-side-fs_PNr%C2%B00499.jpg" },
  "battery":     { title: "18650 and 21700 lithium ion battery cell.jpg", licc: "CC0", url: "https://commons.wikimedia.org/wiki/File:18650_and_21700_lithium_ion_battery_cell.jpg" },
  "powerbank":   { title: "Power bank.jpg", licc: "CC BY-SA 3.0", url: "https://commons.wikimedia.org/wiki/File:Power_bank.jpg" },
  "pb-internals":{ title: "Powerbank integrated charging controller with LEDs and heat sink (Selectec HYT-Q3).jpg", licc: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Powerbank_integrated_charging_controller_with_LEDs_and_heat_sink_(Selectec_HYT-Q3).jpg" },
  "blender":     { title: "Pink portable blender.jpg", licc: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Pink_portable_blender.jpg" },
  "bamboo":      { title: "Golden Green Bamboo Stalks.jpg", licc: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Golden_Green_Bamboo_Stalks.jpg" },
  "desk-lamp-smt-02": { title: "Pick and place internals of surface mount machine.JPG", licc: "CC BY-SA 3.0", url: "https://commons.wikimedia.org/wiki/File:Pick_and_place_internals_of_surface_mount_machine.JPG" },
  "led-strip-smt-02": { title: "Pick and place internals of surface mount machine.JPG", licc: "CC BY-SA 3.0", url: "https://commons.wikimedia.org/wiki/File:Pick_and_place_internals_of_surface_mount_machine.JPG" },
  "bauxite":  { title: "Bauxite with unweathered rock core. C 021.jpg", licc: "CC BY-SA 2.5", url: "https://commons.wikimedia.org/wiki/File:Bauxite_with_unweathered_rock_core._C_021.jpg" },
  "clay":     { title: "Kaolinite from Twiggs County in Georgia in USA.jpg", licc: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Kaolinite_from_Twiggs_County_in_Georgia_in_USA.jpg" },
  "batch":    { title: "Pitted sand grains Western Desert.jpg", licc: "CC0", url: "https://commons.wikimedia.org/wiki/File:Pitted_sand_grains_Western_Desert.jpg" },
  "screw":    { title: "Lag screw (05).jpg", licc: "CC BY-SA 3.0", url: "https://commons.wikimedia.org/wiki/File:Lag_screw_(05).jpg" },
  "frame":    { title: "Stool with woven seat MET 14.10.3 view 4.jpg", licc: "CC0", url: "https://commons.wikimedia.org/wiki/File:Stool_with_woven_seat_MET_14.10.3_view_4.jpg" },
  "carbide":  { title: "Tungsten carbide.jpg", licc: "Public domain", url: "https://commons.wikimedia.org/wiki/File:Tungsten_carbide.jpg" },
  "press-a":  { title: "PlasticsInjectionMoulderJones.jpg", licc: "CC BY-SA 2.5", url: "https://commons.wikimedia.org/wiki/File:PlasticsInjectionMoulderJones.jpg" },
  "press-b":  { title: "LegoSpritzguss.JPG", licc: "CC BY 3.0", url: "https://commons.wikimedia.org/wiki/File:LegoSpritzguss.JPG" },
  "stamping": { title: "Deep Draw Line example by Pressteck Italy.jpg", licc: "CC BY-SA 2.0", url: "https://commons.wikimedia.org/wiki/File:Deep_Draw_Line_example_by_Pressteck_Italy.jpg" },
  "pen":      { title: "03-BICcristal2008-03-26.jpg", licc: "CC BY 3.0", url: "https://commons.wikimedia.org/wiki/File:03-BICcristal2008-03-26.jpg" },
  "portable-ssd-smt-02": { title: "Smt_closeup.jpg", licc: "CC BY-SA 3.0", url: "https://commons.wikimedia.org/wiki/File:Smt_closeup.jpg" },
  "turntable": { title: "Crosley_Record_Player.jpg", licc: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Crosley_Record_Player.jpg" },
  "speaker": { title: "Lautsprecher 4-wege 2.jpg", licc: "CC BY-SA 2.5", url: "https://commons.wikimedia.org/wiki/File:Lautsprecher_4-wege_2.jpg" },
  "neomagnet": { title: "NeoCube.jpg", licc: "CC BY-SA 3.0", url: "https://commons.wikimedia.org/wiki/File:NeoCube.jpg" },
  "neodymium": { title: "Rareearthoxides.jpg", licc: "Public domain", url: "https://commons.wikimedia.org/wiki/File:Rareearthoxides.jpg" },
  "mine": { title: "Baiyunebo ast 2006181.jpg", licc: "Public domain", url: "https://commons.wikimedia.org/wiki/File:Baiyunebo_ast_2006181.jpg" }
};
