window.CONTENT = {
  chains: [
    // =====================================================================
    // OBJECT: Mechanical Keyboard
    // Echelon 0: object -> 1: components -> 2: machines -> 3: raw materials -> 4: sources
    // =====================================================================
    {
      id: "keyboard",
      name: "Mechanical Keyboard",
      color: "#263238",
      nodes: [
        {
          id: "keyboard-01",
          name: "Mechanical Keyboard",
          echelon: 0,
          description:
            "A mechanical keyboard registers each keystroke through an individual switch rather than a shared rubber membrane, sending scan codes across a PCB matrix to a microcontroller that reports HID keystrokes over USB at 1000 Hz polling.",
          specs: [
            { label: "Switch type", value: "Cherry MX-style linear", unit: "" },
            { label: "Actuation force", value: "45", unit: "cN" },
            { label: "Polling rate", value: "1000", unit: "Hz" },
            { label: "Key count", value: "87", unit: "keys" },
          ],
          history:
            "Buckling-spring key switches were patented by IBM in the 1970s and debuted commercially in the 1981 IBM Model F keyboard.",
          process: [
            "Design PCB switch matrix and plate layout in CAD",
            "Assemble switches, PCB, and keycaps into chassis",
            "Flash QMK firmware and run key-by-key continuity test",
            "Package with detachable cable and keycap puller",
          ],
          color: "#263238",
          inputs: [
            "keyboard-keycap-01",
            "keyboard-pcba-01",
            "keyboard-case-01",
          ],
        },
        {
          id: "keyboard-keycap-01",
          name: "Keycap Set (ABS)",
          echelon: 1,
          description:
            "Keycaps are injection-molded from ABS resin at 220 °C in a P20 tool-steel mold with SPI B-1 polish for a glossy, wear-resistant surface, with legends formed by double-shot molding or pad printing.",
          specs: [
            { label: "Material", value: "ABS", unit: "" },
            { label: "Melt temperature", value: "220", unit: "°C" },
            { label: "Cycle time", value: "30", unit: "s" },
            { label: "Wall thickness", value: "1.2", unit: "mm" },
          ],
          history:
            "John Wesley Hyatt invented celluloid in 1869 and patented the first injection molding machine in 1872, initially for celluloid billiard balls as an ivory substitute.",
          process: [
            "Dry ABS pellets at 80 °C for four hours",
            "Inject 220 °C resin into two-cavity P20 steel mold",
            "Pack, cool, and eject after a 30-second cycle",
            "Pad-print or dye-sublimate legends onto cap surface",
          ],
          color: "#FF7043",
          inputs: ["keyboard-inj-02"],
        },
        {
          id: "keyboard-pcba-01",
          name: "PCB Assembly",
          echelon: 1,
          description:
            "A two-layer FR-4 PCB routes 87 switches in a row-column matrix scanned at 1 kHz by an ARM Cortex-M microcontroller, with series diodes on every switch to prevent ghosting during rollover.",
          specs: [
            { label: "Layers", value: "2", unit: "" },
            { label: "MCU", value: "STM32F4", unit: "" },
            { label: "Scan rate", value: "1000", unit: "Hz" },
            { label: "Thickness", value: "1.6", unit: "mm" },
          ],
          history:
            "Surface-mount technology was pioneered by IBM in the 1960s for the Saturn Launch Vehicle Computer, replacing through-hole assembly.",
          process: [
            "Stencil-print solder paste onto FR-4 pads",
            "Place switches, diodes, and MCU by pick-and-place",
            "Reflow solder at 245 °C peak temperature",
            "Flash firmware and test every matrix contact",
          ],
          color: "#4A90E2",
          inputs: ["keyboard-smt-02"],
        },
        {
          id: "keyboard-case-01",
          name: "Aluminum Case",
          echelon: 1,
          description:
            "The case is CNC-milled from a 6061-T6 aluminum billet to hold the PCB on threaded standoffs, then sandblasted and Type II anodized for a hard, corrosion-resistant matte finish.",
          specs: [
            { label: "Material", value: "6061-T6 aluminum", unit: "" },
            { label: "Finish", value: "Type II anodize", unit: "" },
            { label: "Mass", value: "900", unit: "g" },
            { label: "Plate thickness", value: "1.5", unit: "mm" },
          ],
          history:
            "The IBM Model F keyboard of 1981 popularized the heavy steel-and-plastic chassis that modern custom keyboards still emulate.",
          process: [
            "Face-mill aluminum billet to a flat datum",
            "Drill and tap PCB standoff holes",
            "Contour-mill the chassis profile with a 6 mm carbide end mill",
            "Deburr, then anodize and seal in sulfuric acid bath",
          ],
          color: "#9E9E9E",
          inputs: ["keyboard-cnc-02"],
        },
        {
          id: "keyboard-inj-02",
          name: "Injection Molding Press",
          echelon: 2,
          description:
            "A hydraulic press clamps P20 tool-steel mold halves at 80 tons and injects 220 °C ABS into keycap cavities at over 1000 bar holding pressure, running 30-second cycles of injection, packing, cooling, and ejection.",
          specs: [
            { label: "Clamp force", value: "80", unit: "tons" },
            { label: "Mold steel", value: "P20", unit: "" },
            { label: "Mold finish", value: "SPI B-1", unit: "" },
            { label: "Cycle time", value: "30", unit: "s" },
          ],
          history:
            "John Wesley Hyatt invented celluloid in 1869 and patented the first injection molding machine in 1872, initially for celluloid billiard balls as an ivory substitute.",
          process: [
            "Clamp P20 mold halves under 80 tons",
            "Inject 220 °C ABS into keycap cavities",
            "Pack and cool parts for 20-30 seconds",
            "Eject keycaps with ejector pins",
          ],
          color: "#BDBDBD",
          inputs: ["keyboard-abs-03"],
        },
        {
          id: "keyboard-smt-02",
          name: "SMT Assembly Line",
          echelon: 2,
          description:
            "An SMT line solders paste onto FR-4 pads, places diodes, resistors, and the microcontroller with 0.02 mm placement accuracy, then reflows at 245 °C peak in nitrogen to prevent oxidation.",
          specs: [
            { label: "Placement accuracy", value: "0.02", unit: "mm" },
            { label: "Peak reflow temp", value: "245", unit: "°C" },
            { label: "Throughput", value: "30000", unit: "cph" },
            { label: "Atmosphere", value: "Nitrogen", unit: "" },
          ],
          history:
            "Surface-mount technology was pioneered by IBM in the 1960s for the Saturn Launch Vehicle Computer, replacing through-hole assembly.",
          process: [
            "Stencil-print solder paste onto PCB pads",
            "Place components with high-speed pick-and-place head",
            "Reflow solder in five-zone oven at 245 °C peak",
            "Inspect solder joints with automated optical inspection",
          ],
          color: "#4CAF50",
          inputs: ["keyboard-fr4-03"],
        },
        {
          id: "keyboard-cnc-02",
          name: "CNC Milling Machine",
          echelon: 2,
          description:
            "A 3-axis CNC mill cuts the keyboard case from 6061-T6 billet using carbide end mills at 12000 RPM, achieving 0.01 mm positional accuracy on mounting holes and plate cutouts.",
          specs: [
            { label: "Spindle speed", value: "12000", unit: "RPM" },
            { label: "Positional accuracy", value: "0.01", unit: "mm" },
            { label: "Axis travel", value: "500", unit: "mm" },
            { label: "Tool diameter", value: "6", unit: "mm" },
          ],
          history:
            "Numerical control machining was developed at MIT in 1952 for aircraft part production, evolving into modern CNC machine tools.",
          process: [
            "Face-mill aluminum billet to flat datum surface",
            "Drill and tap PCB standoff mounting holes",
            "Contour-mill outer chassis profile with carbide end mill",
            "Deburr edges and inspect dimensions with CMM",
          ],
          color: "#9B59B6",
          inputs: ["keyboard-alu-03"],
        },
        {
          id: "keyboard-abs-03",
          name: "ABS Resin Pellets",
          echelon: 3,
          description:
            "ABS (acrylonitrile butadiene styrene) is a thermoplastic terpolymer combining acrylonitrile for chemical resistance, butadiene for impact toughness, and styrene for rigidity and gloss; injection-molding grade flows at 220 °C and shrinks about 0.6 % on cooling.",
          specs: [
            { label: "Melt temperature", value: "220", unit: "°C" },
            { label: "Density", value: "1.04", unit: "g/cm³" },
            { label: "Shrinkage", value: "0.6", unit: "%" },
            { label: "Izod impact", value: "200", unit: "J/m" },
          ],
          history:
            "ABS was first commercialized by BorgWarner in the early 1940s and became famous as the material of LEGO bricks starting in 1963.",
          process: [
            "Polymerize acrylonitrile, butadiene, and styrene monomers",
            "Compound pellets with colorants and UV stabilizers",
            "Dry resin to below 0.05 % moisture content",
            "Feed pellets into injection molding machine hopper",
          ],
          color: "#FFFFFF",
          inputs: ["keyboard-petroleum-04"],
        },
        {
          id: "keyboard-fr4-03",
          name: "FR-4 Copper Clad Laminate",
          echelon: 3,
          description:
            "FR-4 is a glass-reinforced epoxy laminate woven from E-glass fabric impregnated with flame-retardant epoxy resin, copper-clad on both sides for PCB traces, with a dielectric constant around 4.3 and Tg near 170 °C.",
          specs: [
            { label: "Glass transition temp", value: "170", unit: "°C" },
            { label: "Dielectric constant", value: "4.3", unit: "" },
            { label: "Copper thickness", value: "35", unit: "µm" },
            { label: "Board thickness", value: "1.6", unit: "mm" },
          ],
          history:
            "FR-4 replaced phenolics in the 1960s as the standard PCB substrate, defined by the NEMA LI 1 flammability rating.",
          process: [
            "Weave E-glass fabric on industrial looms",
            "Impregnate fabric with flame-retardant epoxy resin",
            "Laminate copper foil to both sides under heat and pressure",
            "Cut and drill panels to PCB fabrication dimensions",
          ],
          color: "#AABBCC",
          inputs: ["keyboard-silica-04"],
        },
        {
          id: "keyboard-alu-03",
          name: "6061-T6 Aluminum Billet",
          echelon: 3,
          description:
            "6061-T6 aluminum is a precipitation-hardened magnesium-silicon alloy, solution heat treated and artificially aged to T6 temper for roughly 276 MPa yield strength; it machines well and anodizes to a durable finish.",
          specs: [
            { label: "Yield strength", value: "276", unit: "MPa" },
            { label: "Density", value: "2.7", unit: "g/cm³" },
            { label: "Hardness", value: "95", unit: "HB" },
            { label: "Thermal conductivity", value: "167", unit: "W/m·K" },
          ],
          history:
            "Aluminum 6061 was developed by Alcoa in 1935 and became a structural mainstay of aircraft and bicycle frames by the 1970s.",
          process: [
            "Extract alumina from bauxite via the Bayer process",
            "Electrolytically reduce alumina to aluminum in Hall-Héroult cells",
            "Alloy with magnesium and silicon, cast into billets",
            "Solution heat treat and artificially age to T6 temper",
          ],
          color: "#C0C0C0",
          inputs: ["keyboard-bauxite-04"],
        },
        {
          id: "keyboard-petroleum-04",
          name: "Crude Oil Well",
          echelon: 4,
          description:
            "Crude oil is extracted from sedimentary rock formations via rotary drilling rigs reaching 1500-5000 m depth, then fractional distillation separates naphtha feedstocks for petrochemical cracking into ethylene, propylene, and benzene derivatives.",
          specs: [
            { label: "Drilling depth", value: "3000", unit: "m" },
            { label: "Flow rate", value: "500", unit: "bbl/day" },
            { label: "API gravity", value: "35", unit: "°API" },
            { label: "Sulfur content", value: "0.5", unit: "%" },
          ],
          history:
            "The first commercial oil well was drilled by Edwin Drake in Titusville, Pennsylvania in 1859, launching the modern petroleum industry.",
          process: [
            "Seismic survey to locate subsurface hydrocarbon traps",
            "Drill rotary wellbore to target reservoir depth",
            "Install casing and cement to isolate formations",
            "Pump crude oil to surface via artificial lift or natural flow",
          ],
          color: "#3B3B3B",
          inputs: [],
        },
        {
          id: "keyboard-silica-04",
          name: "Silica Sand Mine",
          echelon: 4,
          description:
            "Silica sand is mined from quartz-rich sandstone deposits for glass fiber and silicon production, washed and screened to remove clay and iron contaminants that would discolor the glass.",
          specs: [
            { label: "Silica content", value: "95", unit: "%" },
            { label: "Iron oxide", value: "0.03", unit: "%" },
            { label: "Grain size", value: "0.3", unit: "mm" },
            { label: "Mine depth", value: "30", unit: "m" },
          ],
          history:
            "Industrial silica sand mining expanded in the 19th century to supply glassworks and foundries across the United States.",
          process: [
            "Clear overburden above sandstone deposit",
            "Excavate sand with hydraulic excavators",
            "Wash and screen to remove clay and iron",
            "Dry and stockpile for glass and silicon feedstock",
          ],
          color: "#F5F5F5",
          inputs: [],
        },
        {
          id: "keyboard-bauxite-04",
          name: "Bauxite Mine",
          echelon: 4,
          description:
            "Bauxite is a sedimentary rock rich in aluminum hydroxides and iron oxides, mined by open-pit methods and refined via the Bayer process into alumina for electrolytic smelting.",
          specs: [
            { label: "Alumina content", value: "45", unit: "%" },
            { label: "Silica content", value: "5", unit: "%" },
            { label: "Mine depth", value: "30", unit: "m" },
            { label: "Strip ratio", value: "1.5", unit: "w:o" },
          ],
          history:
            "Bauxite was first identified near Les Baux-de-Provence, France by geologist Pierre Berthier in 1821, giving the ore its name.",
          process: [
            "Clear and drill overburden above bauxite lens",
            "Excavate ore with hydraulic excavators and haul trucks",
            "Crush and wash bauxite to remove clay and silica",
            "Transport washed ore to Bayer refinery for alumina extraction",
          ],
          color: "#D4A017",
          inputs: [],
        },
      ],
    },

    // =====================================================================
    // OBJECT: LED Desk Lamp
    // =====================================================================
    {
      id: "desk-lamp",
      name: "LED Desk Lamp",
      color: "#37474F",
      nodes: [
        {
          id: "desk-lamp-01",
          name: "LED Desk Lamp",
          echelon: 0,
          description:
            "An LED desk lamp mounts an array of mid-power SMD LEDs on a metal-core PCB behind a PMMA diffuser, driven by a constant-current regulator holding 350 mA per string at adjustable correlated color temperature.",
          specs: [
            { label: "LED package", value: "2835 SMD", unit: "" },
            { label: "CCT", value: "4000", unit: "K" },
            { label: "CRI", value: "90", unit: "Ra" },
            { label: "Luminous flux", value: "450", unit: "lm" },
          ],
          history:
            "Nick Holonyak demonstrated the first practical visible-spectrum LED at General Electric in 1962, emitting red light from gallium arsenide phosphide.",
          process: [
            "Design LED array, optics, and driver circuit",
            "Assemble head, arm, base, and power cord",
            "Photometric test for flux, CCT, and uniformity",
            "Package with power adapter and user manual",
          ],
          color: "#37474F",
          inputs: [
            "desk-lamp-head-01",
            "desk-lamp-base-01",
            "desk-lamp-arm-01",
          ],
        },
        {
          id: "desk-lamp-head-01",
          name: "LED Head Assembly",
          echelon: 1,
          description:
            "The lamp head solders 2835 SMD LEDs onto an aluminum metal-core PCB beneath a micro-prismatic PMMA diffuser that homogenizes point sources into uniform task illumination at 90 CRI.",
          specs: [
            { label: "LED type", value: "2835 SMD", unit: "" },
            { label: "CCT", value: "4000", unit: "K" },
            { label: "CRI", value: "90", unit: "Ra" },
            { label: "Driver current", value: "350", unit: "mA" },
          ],
          history:
            "The first practical visible-spectrum LED was demonstrated by Nick Holonyak at GE in 1962, emitting red light from gallium arsenide phosphide.",
          process: [
            "Solder 2835 LEDs onto aluminum-core MCPCB",
            "Laminate PMMA diffuser over LED array",
            "Wire constant-current driver to PCB header",
            "Age-test each head for 24 hours at full brightness",
          ],
          color: "#FFFFFF",
          inputs: ["desk-lamp-smt-02"],
        },
        {
          id: "desk-lamp-base-01",
          name: "Weighted Steel Base",
          echelon: 1,
          description:
            "The base is a deep-drawn SPCC cold-rolled steel shell filled with concrete ballast, providing about 1.8 kg of static mass to resist tipping at maximum arm extension, finished in textured black powder coat.",
          specs: [
            { label: "Mass", value: "1800", unit: "g" },
            { label: "Material", value: "SPCC cold-rolled steel", unit: "" },
            { label: "Finish", value: "Powder coat", unit: "" },
            { label: "Base diameter", value: "180", unit: "mm" },
          ],
          history:
            "Deep drawing of sheet metal was industrialized by Ford in the 1910s for automobile body panels such as the Model T hood.",
          process: [
            "Blank SPCC steel coil into 200 mm diameter discs",
            "Deep-draw shells in a 100-ton hydraulic press",
            "Fill base cavity with concrete ballast",
            "Electrostatic powder coat and cure at 180 °C",
          ],
          color: "#212121",
          inputs: ["desk-lamp-press-02"],
        },
        {
          id: "desk-lamp-arm-01",
          name: "Counterbalanced Arm",
          echelon: 1,
          description:
            "The arm uses an ASTM A229 music-wire torsion spring inside a steel tube to counterbalance the head weight, with friction hinges at shoulder and elbow joints for position holding.",
          specs: [
            { label: "Spring wire", value: "ASTM A229 music wire", unit: "" },
            { label: "Wire diameter", value: "2.5", unit: "mm" },
            { label: "Reach", value: "600", unit: "mm" },
            { label: "Pivot type", value: "Friction hinge", unit: "" },
          ],
          history:
            "George Carwardine introduced the Anglepoise balanced-arm lamp in 1934, its spring mechanism keeping the head at any position without counterweights.",
          process: [
            "Coil music wire into torsion spring on CNC spring coiler",
            "Heat treat spring at 450 °C then stress relieve",
            "Swage steel tubing around spring inner core",
            "Rivet friction hinges at arm joints",
          ],
          color: "#FF7043",
          inputs: ["desk-lamp-coiler-02"],
        },
        {
          id: "desk-lamp-smt-02",
          name: "SMT LED Placement Line",
          echelon: 2,
          description:
            "A pick-and-place machine mounts 2835 LED packages onto metal-core PCBs with 0.05 mm accuracy, followed by reflow soldering in a vapor-phase oven for even heat distribution on thermally dense boards.",
          specs: [
            { label: "Placement speed", value: "45000", unit: "cph" },
            { label: "Placement accuracy", value: "0.05", unit: "mm" },
            { label: "Reflow peak", value: "260", unit: "°C" },
            { label: "Board material", value: "Aluminum MCPCB", unit: "" },
          ],
          history:
            "Surface-mount assembly enabled miniaturization of consumer electronics starting with Japanese calculators and watches in the 1970s.",
          process: [
            "Print solder paste on MCPCB stencil",
            "Place 2835 LEDs and resistors with pick-and-place",
            "Reflow solder in vapor-phase oven",
            "Test LED strings with automated test fixture",
          ],
          color: "#4CAF50",
          inputs: ["desk-lamp-mcpcb-03"],
        },
        {
          id: "desk-lamp-press-02",
          name: "Hydraulic Stamping Press",
          echelon: 2,
          description:
            "A 100-ton hydraulic press deep-draws SPCC cold-rolled steel blanks into lamp base shells using a draw die with blank-holder pressure to prevent wrinkling during forming.",
          specs: [
            { label: "Press tonnage", value: "100", unit: "tons" },
            { label: "Blank size", value: "200", unit: "mm" },
            { label: "Draw depth", value: "80", unit: "mm" },
            { label: "Cycle time", value: "15", unit: "s" },
          ],
          history:
            "The hydraulic press was invented by Joseph Bramah in 1795, applying Pascal's law to multiply force for industrial forming.",
          process: [
            "Blank steel coil into circular discs",
            "Position blank over draw die with blank holder",
            "Deep-draw shell in single 100-ton stroke",
            "Trim flange and inspect for wrinkles or tears",
          ],
          color: "#78909C",
          inputs: ["desk-lamp-spcc-03"],
        },
        {
          id: "desk-lamp-coiler-02",
          name: "Wafios Spring Coiler",
          echelon: 2,
          description:
            "A Wafios CNC spring coiler forms ASTM A229 music wire into torsion springs by feeding wire through guide pins and coiling around a mandrel at up to 100 pieces per minute with programmable pitch and torque.",
          specs: [
            { label: "Wire range", value: "0.3-10", unit: "mm" },
            { label: "Production rate", value: "100", unit: "pcs/min" },
            { label: "Mandrel diameter", value: "8", unit: "mm" },
            { label: "Control", value: "CNC", unit: "" },
          ],
          history:
            "Wafios, founded in Reutlingen, Germany in 1921, pioneered CNC spring coiling machines now used for lamp balances and vehicle suspension springs worldwide.",
          process: [
            "Feed music wire from spool into straightening rollers",
            "Coil wire around mandrel to programmed pitch",
            "Cut spring to length and form end hooks",
            "Stress-relieve spring in oven at 450 °C",
          ],
          color: "#FB8C00",
          inputs: ["desk-lamp-musicwire-03"],
        },
        {
          id: "desk-lamp-mcpcb-03",
          name: "Aluminum Metal-Core PCB",
          echelon: 3,
          description:
            "An aluminum metal-core PCB uses a thin dielectric layer between copper circuit and aluminum base to conduct heat away from high-power LEDs, keeping junction temperatures below 85 °C for long lumen maintenance.",
          specs: [
            { label: "Base material", value: "6061 aluminum", unit: "" },
            { label: "Copper thickness", value: "35", unit: "µm" },
            { label: "Thermal conductivity", value: "2.0", unit: "W/m·K" },
            { label: "Board thickness", value: "1.6", unit: "mm" },
          ],
          history:
            "Metal-core PCBs emerged in the 1990s as power LEDs generated too much heat for standard FR-4 substrates.",
          process: [
            "Laminate copper foil to dielectric-aluminum stack",
            "Etch circuit pattern with ferric chloride",
            "Drill mounting holes and route board outline",
            "Apply solder mask and surface finish",
          ],
          color: "#C0C0C0",
          inputs: ["desk-lamp-bauxite-04"],
        },
        {
          id: "desk-lamp-spcc-03",
          name: "SPCC Cold-Rolled Steel Coil",
          echelon: 3,
          description:
            "SPCC is a commercial cold-rolled steel per JIS G3141, pickled, cold reduced, annealed, and temper rolled for deep drawability in lamp bases and appliance panels.",
          specs: [
            { label: "Standard", value: "JIS G3141", unit: "" },
            { label: "Tensile strength", value: "270", unit: "MPa" },
            { label: "Thickness", value: "1.2", unit: "mm" },
            { label: "Surface", value: "Matte finish", unit: "" },
          ],
          history:
            "Cold rolling of steel was developed in the 19th century to produce smooth, gauge-accurate sheet for precision forming.",
          process: [
            "Pickle hot-rolled coil in sulfuric acid bath",
            "Cold roll to final gauge at room temperature",
            "Anneal in bell furnace to restore ductility",
            "Temper roll and coil for stamping feedstock",
          ],
          color: "#90A4AE",
          inputs: ["desk-lamp-ironore-04"],
        },
        {
          id: "desk-lamp-musicwire-03",
          name: "ASTM A229 Music Wire",
          echelon: 3,
          description:
            "ASTM A229 music wire is a high-carbon spring steel, cold drawn and patented for high tensile strength and fatigue resistance in torsion springs that must hold position over millions of cycles.",
          specs: [
            { label: "Standard", value: "ASTM A229", unit: "" },
            { label: "Tensile strength", value: "2000", unit: "MPa" },
            { label: "Carbon content", value: "0.85", unit: "%" },
            { label: "Wire diameter", value: "2.5", unit: "mm" },
          ],
          history:
            "Music wire was developed in the 19th century for piano strings, then adopted for precision springs because of its uniform draw and fatigue life.",
          process: [
            "Draw high-carbon rod through progressively smaller dies",
            "Patent in lead bath at 850-900 °C for fine pearlite",
            "Cold draw to final spring wire diameter",
            "Spool and inspect for surface defects",
          ],
          color: "#546E7A",
          inputs: ["desk-lamp-ironore-04"],
        },
        {
          id: "desk-lamp-solder-03",
          name: "Solder Paste",
          echelon: 3,
          description:
            "Solder paste is a sticky grey compound of microscopic tin-silver-copper spheres suspended in flux, stencil-printed onto every PCB pad; a reflow oven at 235 °C melts it in seconds so all components bond at once.",
          specs: [
            { label: "Alloy", value: "SAC305", unit: "" },
            { label: "Powder size", value: "25", unit: "µm" },
            { label: "Melting point", value: "217", unit: "°C" },
            { label: "Print thickness", value: "0.12", unit: "mm" },
          ],
          history:
            "Lead-free SAC305 rosin-core pastes were standardized in the 2000s. Tin itself has been metallurgy's knot-tyer since the Bronze Age, when people first blended it with copper into bronze.",
          process: [
            "Atomize molten tin alloy into microspheres",
            "Mix spheres with flux into printable paste",
            "Stencil-print paste over every PCB pad",
            "Reflow at 235 °C so pads wet and bond",
          ],
          color: "#455A64",
          inputs: ["desk-lamp-cassiterite-04"],
        },
        {
          id: "desk-lamp-bauxite-04",
          name: "Bauxite Mine",
          echelon: 4,
          description:
            "Bauxite is a sedimentary rock rich in aluminum hydroxides and iron oxides, mined by open-pit methods and refined via the Bayer process into alumina for electrolytic smelting.",
          specs: [
            { label: "Alumina content", value: "45", unit: "%" },
            { label: "Silica content", value: "5", unit: "%" },
            { label: "Mine depth", value: "30", unit: "m" },
            { label: "Strip ratio", value: "1.5", unit: "w:o" },
          ],
          history:
            "Bauxite was first identified near Les Baux-de-Provence, France by geologist Pierre Berthier in 1821, giving the ore its name.",
          process: [
            "Clear and drill overburden above bauxite lens",
            "Excavate ore with hydraulic excavators and haul trucks",
            "Crush and wash bauxite to remove clay and silica",
            "Transport washed ore to Bayer refinery for alumina extraction",
          ],
          color: "#D4A017",
          inputs: [],
        },
        {
          id: "desk-lamp-ironore-04",
          name: "Iron Ore Mine",
          echelon: 4,
          description:
            "Iron ore is mined from banded iron formations or hematite deposits by open-pit methods, then crushed, screened, and beneficiated into lump or sinter feed for the blast furnace.",
          specs: [
            { label: "Iron content", value: "62", unit: "%" },
            { label: "Silica content", value: "4", unit: "%" },
            { label: "Mine depth", value: "100", unit: "m" },
            { label: "Strip ratio", value: "2.5", unit: "w:o" },
          ],
          history:
            "Large-scale iron ore mining began in the 19th century in the Lake Superior district, feeding America's early steel mills.",
          process: [
            "Drill and blast iron-bearing rock",
            "Load ore with hydraulic shovels into haul trucks",
            "Crush and screen to lump and fines products",
            "Stockpile or rail to steel mill blast furnace",
          ],
          color: "#795548",
          inputs: [],
        },
        {
          id: "desk-lamp-cassiterite-04",
          name: "Cassiterite Mine",
          echelon: 4,
          description:
            "Cassiterite is tin dioxide, the ore of tin, dredged from alluvial gravels and dug from open pits, then roasted and smelted at 1200 °C into the 99.9 % tin that gives solder its lowest-melting alloy.",
          specs: [
            { label: "Chemistry", value: "SnO2", unit: "" },
            { label: "Tin content", value: "70", unit: "%" },
            { label: "Smelt temperature", value: "1200", unit: "°C" },
            { label: "Tin melts at", value: "232", unit: "°C" },
          ],
          history:
            "Cassiterite fed the Bronze Age: tin from Cornwall's gravels crossed Europe to meet copper a thousand years before anyone wrote it down. The trade routes alone powered a metal economy.",
          process: [
            "Dredge or open-pit mine cassiterite gravels",
            "Wash and gravity-separate the dense ore",
            "Roast to strip sulfur and other impurities",
            "Smelt at 1200 °C into tin metal ingots",
          ],
          color: "#607D8B",
          inputs: [],
        },
      ],
    },

    // =====================================================================
    // OBJECT: Ergonomic Office Chair
    // =====================================================================
    {
      id: "office-chair",
      name: "Ergonomic Office Chair",
      color: "#455A64",
      nodes: [
        {
          id: "office-chair-01",
          name: "Ergonomic Office Chair",
          echelon: 0,
          description:
            "An ergonomic office chair combines a warp-knitted mesh back, a padded seat, a five-star base, and a recline mechanism with height adjustment to support the user through long periods of seated work.",
          specs: [
            { label: "Weight rating", value: "113", unit: "kg" },
            { label: "Seat height", value: "420-520", unit: "mm" },
            { label: "Recline angle", value: "120", unit: "deg" },
            { label: "Standard", value: "BIFMA X5.1", unit: "" },
          ],
          history:
            "Thomas Jefferson invented the swivel chair in 1776 by fitting a Windsor chair with iron casters and a central spindle.",
          process: [
            "Assemble mesh back, seat foam, and mechanism",
            "Attach five-star base and gas lift cylinder",
            "Fit dual-wheel casters and armrests",
            "Load-test to BIFMA seating durability standard",
          ],
          color: "#455A64",
          inputs: [
            "office-chair-mesh-01",
            "office-chair-frame-01",
            "office-chair-base-01",
            "office-chair-casters-01",
          ],
        },
        {
          id: "office-chair-mesh-01",
          name: "Mesh Seat and Back",
          echelon: 1,
          description:
            "Warp-knitted nylon 66 monofilament mesh, often thermoplastic-elastomer coated, provides breathable support with controlled elastic deflection over a molded seat pan or back frame.",
          specs: [
            { label: "Material", value: "Nylon 66 monofilament", unit: "" },
            { label: "Areal weight", value: "180", unit: "g/m²" },
            { label: "Gauge", value: "24", unit: "needles/inch" },
            { label: "Elongation", value: "30", unit: "%" },
          ],
          history:
            "Herman Miller's Aeron chair of 1994 introduced Pellicle mesh upholstery, designed by Bill Stumpf and Don Chadwick.",
          process: [
            "Extrude nylon 66 pellets into monofilament yarn",
            "Warp-knit mesh on raschel machine with programmed pattern",
            "Heat-set mesh to stabilize dimensions",
            "Laminate to seat pan or bond to back frame",
          ],
          color: "#37474F",
          inputs: ["office-chair-loom-02"],
        },
        {
          id: "office-chair-frame-01",
          name: "Reclining Mechanism and Frame",
          echelon: 1,
          description:
            "The frame uses stamped high-strength steel brackets and a recline mechanism with torsion spring, providing adjustable lumbar support and tilt tension while meeting office seating strength standards.",
          specs: [
            { label: "Material", value: "DP600 dual-phase steel", unit: "" },
            { label: "Yield strength", value: "340", unit: "MPa" },
            { label: "Sheet thickness", value: "2.0", unit: "mm" },
            { label: "Recline range", value: "100-120", unit: "deg" },
          ],
          history:
            "Thomas E. Warren patented the Centripetal Spring Armchair in 1849, the first swiveling, tilting office chair on castors.",
          process: [
            "Blank DP600 steel coil on hydraulic press",
            "Progressive-stamp brackets and mechanism parts",
            "Weld frame subassemblies with resistance spot welds",
            "Zinc-plate and powder coat for corrosion resistance",
          ],
          color: "#546E7A",
          inputs: ["office-chair-stamping-02"],
        },
        {
          id: "office-chair-base-01",
          name: "Five-Star Base",
          echelon: 1,
          description:
            "The five-star base is gas-assist injection molded from PA66 glass-filled resin, producing a hollow, stiff structure that resists the 113 kg BIFMA static load without sink marks.",
          specs: [
            { label: "Material", value: "PA66 glass-filled", unit: "" },
            { label: "Melt temperature", value: "280", unit: "°C" },
            { label: "Glass content", value: "30", unit: "%" },
            { label: "Star diameter", value: "640", unit: "mm" },
          ],
          history:
            "The five-star swivel base debuted with the Eames Aluminum Group in 1958; gas-assist molding was commercialized in the 1970s for thick hollow parts.",
          process: [
            "Inject PA66 GF30 at 280 °C into five-star mold",
            "Introduce nitrogen gas to hollow out thick sections",
            "Cool and eject base with center bore for gas lift",
            "Deflash and load-test to BIFMA standard",
          ],
          color: "#37474F",
          inputs: ["office-chair-injection-02"],
        },
        {
          id: "office-chair-casters-01",
          name: "Dual-Wheel Casters",
          echelon: 1,
          description:
            "Dual-wheel casters use nylon 6 wheels with POM tyres on a pressed-steel yoke, swiveling on a ball race to let the chair roll freely across carpet and hard floors.",
          specs: [
            { label: "Wheel material", value: "Nylon 6 / POM", unit: "" },
            { label: "Wheel diameter", value: "65", unit: "mm" },
            { label: "Yoke material", value: "Pressed steel", unit: "" },
            { label: "Load per caster", value: "50", unit: "kg" },
          ],
          history:
            "Furniture casters were patented by David A. Fisher in 1876, adding mobility to chairs and desks in offices and factories.",
          process: [
            "Injection mold nylon 6 wheel halves",
            "Press-steel yoke stamped and welded",
            "Assemble wheels, ball race, and yoke",
            "Swage caster stem into five-star base bore",
          ],
          color: "#FF7043",
          inputs: ["office-chair-injection-02"],
        },
        {
          id: "office-chair-loom-02",
          name: "Warp Knitting Machine",
          echelon: 2,
          description:
            "A Karl Mayer warp-knitting machine interloops nylon 66 monofilament at up to 3000 courses per minute to produce the breathable mesh sheet used for chair backs and seats.",
          specs: [
            { label: "Machine gauge", value: "24", unit: "needles/inch" },
            { label: "Production speed", value: "3000", unit: "courses/min" },
            { label: "Yarn type", value: "Monofilament", unit: "" },
            { label: "Fabric width", value: "2000", unit: "mm" },
          ],
          history:
            "Warp knitting was mechanized in the 18th century and industrialized in the 20th for technical textiles such as furniture mesh.",
          process: [
            "Creel thousands of nylon monofilament ends",
            "Knit mesh sheet with programmed needle selection",
            "Roll and inspect fabric for dropped stitches",
            "Heat-set and ship to upholstery cutter",
          ],
          color: "#4CAF50",
          inputs: ["office-chair-nylon-03"],
        },
        {
          id: "office-chair-stamping-02",
          name: "Progressive Stamping Die",
          echelon: 2,
          description:
            "A 200-ton mechanical progressive stamping press feeds DP600 dual-phase steel coil through a sequence of die stations—pierce, blank, form, and bend—to produce chair brackets and mechanism parts at high speed.",
          specs: [
            { label: "Press tonnage", value: "200", unit: "tons" },
            { label: "Material", value: "DP600 dual-phase steel", unit: "" },
            { label: "Strokes per minute", value: "60", unit: "spm" },
            { label: "Die stations", value: "12", unit: "" },
          ],
          history:
            "Progressive die stamping was developed for automotive body production in the early 20th century and remains a high-volume forming method.",
          process: [
            "Feed DP600 coil into uncoiler and straightener",
            "Pierce holes in first die stations",
            "Blank and form brackets through subsequent stations",
            "Separate finished parts and stack",
          ],
          color: "#78909C",
          inputs: ["office-chair-steel-03"],
        },
        {
          id: "office-chair-injection-02",
          name: "Gas-Assist Injection Molding Machine",
          echelon: 2,
          description:
            "A gas-assist injection molding machine injects PA66 glass-filled resin at 280 °C into the five-star mold, then introduces nitrogen to hollow thick sections, running cycles of roughly 60-90 seconds.",
          specs: [
            { label: "Clamp force", value: "300", unit: "tons" },
            { label: "Melt temperature", value: "280", unit: "°C" },
            { label: "Gas assist pressure", value: "150", unit: "bar" },
            { label: "Cycle time", value: "75", unit: "s" },
          ],
          history:
            "Gas-assisted injection molding was commercialized in the 1970s to produce thick, hollow plastic parts without sink marks.",
          process: [
            "Inject PA66 GF30 resin into five-star mold",
            "Inject nitrogen gas to form internal hollow channel",
            "Hold pressure and cool part in mold",
            "Eject base and trim gate and runner",
          ],
          color: "#FB8C00",
          inputs: ["office-chair-pa-03"],
        },
        {
          id: "office-chair-nylon-03",
          name: "Nylon 66 Monofilament",
          echelon: 3,
          description:
            "Nylon 66 is a polyamide made from hexamethylenediamine and adipic acid, melt-spun into monofilament yarn with high tensile strength and abrasion resistance for warp-knitted chair mesh.",
          specs: [
            { label: "Melting point", value: "265", unit: "°C" },
            { label: "Tenacity", value: "700", unit: "MPa" },
            { label: "Denier", value: "200", unit: "D" },
            { label: "Moisture regain", value: "4.5", unit: "%" },
          ],
          history:
            "Nylon 66 was invented by Wallace Carothers at DuPont in 1935, the first fully synthetic fiber to reach commercial production.",
          process: [
            "Polymerize hexamethylenediamine and adipic acid",
            "Melt-spin polymer through spinneret into filament",
            "Draw and heat-set monofilament yarn",
            "Wind onto spools for knitting machines",
          ],
          color: "#FFF9C4",
          inputs: ["office-chair-petroleum-04"],
        },
        {
          id: "office-chair-steel-03",
          name: "DP600 Dual-Phase Steel Sheet",
          echelon: 3,
          description:
            "DP600 dual-phase steel combines soft ferrite with hard martensite islands for roughly 340 MPa yield strength and 600 MPa tensile strength, offering good formability for stamped chair brackets.",
          specs: [
            { label: "Yield strength", value: "340", unit: "MPa" },
            { label: "Tensile strength", value: "600", unit: "MPa" },
            { label: "Sheet thickness", value: "2.0", unit: "mm" },
            { label: "Coating", value: "Zinc", unit: "g/m²" },
          ],
          history:
            "Dual-phase steels were developed in the 1970s for automotive crash structures needing strength and formability.",
          process: [
            "Melt iron and scrap in basic oxygen furnace",
            "Cast slab and hot roll to coil",
            "Cold roll, anneal, and galvanize sheet",
            "Coil DP600 for stamping plant delivery",
          ],
          color: "#90A4AE",
          inputs: ["office-chair-ironore-04"],
        },
        {
          id: "office-chair-pa-03",
          name: "PA66 Glass-Filled Resin",
          echelon: 3,
          description:
            "PA66 glass-filled resin blends polyamide 66 with 30 % glass fiber for stiffness and creep resistance, injection molded at 280 °C into structural parts such as chair bases.",
          specs: [
            { label: "Material", value: "PA66 GF30", unit: "" },
            { label: "Melt temperature", value: "280", unit: "°C" },
            { label: "Glass content", value: "30", unit: "%" },
            { label: "Flexural modulus", value: "9000", unit: "MPa" },
          ],
          history:
            "Nylon 66 was invented by Wallace Carothers at DuPont in 1935, the first fully synthetic fiber to reach commercial production.",
          process: [
            "Polymerize hexamethylenediamine and adipic acid",
            "Compound PA66 with 30 % glass fiber",
            "Extrude and pelletize compounded resin",
            "Dry pellets before molding to prevent hydrolysis",
          ],
          color: "#FFF9C4",
          inputs: ["office-chair-petroleum-04"],
        },
        {
          id: "office-chair-petroleum-04",
          name: "Crude Oil Well",
          echelon: 4,
          description:
            "Crude oil is extracted from sedimentary rock formations via rotary drilling rigs reaching 1500-5000 m depth, then fractional distillation separates naphtha feedstocks for petrochemical cracking into nylon intermediates.",
          specs: [
            { label: "Drilling depth", value: "3000", unit: "m" },
            { label: "Flow rate", value: "500", unit: "bbl/day" },
            { label: "API gravity", value: "35", unit: "°API" },
            { label: "Sulfur content", value: "0.5", unit: "%" },
          ],
          history:
            "The first commercial oil well was drilled by Edwin Drake in Titusville, Pennsylvania in 1859, launching the modern petroleum industry.",
          process: [
            "Seismic survey to locate subsurface hydrocarbon traps",
            "Drill rotary wellbore to target reservoir depth",
            "Install casing and cement to isolate formations",
            "Pump crude oil to surface via artificial lift or natural flow",
          ],
          color: "#3B3B3B",
          inputs: [],
        },
        {
          id: "office-chair-ironore-04",
          name: "Iron Ore Mine",
          echelon: 4,
          description:
            "Iron ore is mined from banded iron formations or hematite deposits by open-pit methods, then crushed, screened, and beneficiated into lump or sinter feed for the blast furnace.",
          specs: [
            { label: "Iron content", value: "62", unit: "%" },
            { label: "Silica content", value: "4", unit: "%" },
            { label: "Mine depth", value: "100", unit: "m" },
            { label: "Strip ratio", value: "2.5", unit: "w:o" },
          ],
          history:
            "Large-scale iron ore mining began in the 19th century in the Lake Superior district, feeding America's early steel mills.",
          process: [
            "Drill and blast iron-bearing rock",
            "Load ore with hydraulic shovels into haul trucks",
            "Crush and screen to lump and fines products",
            "Stockpile or rail to steel mill blast furnace",
          ],
          color: "#795548",
          inputs: [],
        },
      ],
    },

    // =====================================================================
    // OBJECT: Ceramic Mug
    // =====================================================================
    {
      id: "ceramic-mug",
      name: "Ceramic Mug",
      color: "#5D4037",
      nodes: [
        {
          id: "ceramic-mug-01",
          name: "Ceramic Mug",
          echelon: 0,
          description:
            "A ceramic mug consists of a stoneware body thrown or jiggered from clay and coated with a feldspathic glaze, fired to vitrification at about 1250 °C so it holds hot liquids without absorbing water.",
          specs: [
            { label: "Body material", value: "Stoneware clay", unit: "" },
            { label: "Firing temperature", value: "1250", unit: "°C" },
            { label: "Water absorption", value: "2", unit: "%" },
            { label: "Capacity", value: "350", unit: "ml" },
          ],
          history:
            "Stoneware mugs were produced in China during the Tang Dynasty (618-907 CE), while Meissen made the first European hard-paste porcelain in 1710.",
          process: [
            "Wedged clay thrown or jiggered into mug shape",
            "Handle pulled and attached while leather-hard",
            "Bisque fired at 900 °C, then glazed",
            "Glost fired at 1250 °C to vitrify body and melt glaze",
          ],
          color: "#5D4037",
          inputs: ["ceramic-mug-body-01", "ceramic-mug-glaze-01"],
        },
        {
          id: "ceramic-mug-body-01",
          name: "Stoneware Body",
          echelon: 1,
          description:
            "The stoneware body is a plastic blend of ball clay, kaolin, feldspar, and silica, de-aired in a vacuum pugmill and extruded into columns before jiggering on a rotating plaster mold.",
          specs: [
            { label: "Body type", value: "Stoneware", unit: "" },
            { label: "Bisque temperature", value: "900", unit: "°C" },
            { label: "Glost temperature", value: "1250", unit: "°C" },
            { label: "Wall thickness", value: "4", unit: "mm" },
          ],
          history:
            "Stoneware mugs were produced in China during the Tang Dynasty (618-907 CE), while Meissen made the first European hard-paste porcelain in 1710.",
          process: [
            "Blend ball clay, kaolin, feldspar, and silica with water",
            "De-air and extrude in vacuum pugmill",
            "Jigger profile against rotating plaster mold",
            "Trim leather-hard mug and attach handle",
          ],
          color: "#8D6E63",
          inputs: ["ceramic-mug-pugmill-02"],
        },
        {
          id: "ceramic-mug-glaze-01",
          name: "Feldspathic Glaze",
          echelon: 1,
          description:
            "The glaze is a slurry of feldspar, quartz, whiting, and kaolin colored with metal oxides, ball-milled to fine particles and sprayed or dipped onto bisque ware before melting into a glassy coating.",
          specs: [
            { label: "Firing temperature", value: "1250", unit: "°C" },
            { label: "Particle size", value: "45", unit: "µm" },
            { label: "Specific gravity", value: "1.5", unit: "" },
            { label: "Expansion", value: "6", unit: "x10⁻⁶/K" },
          ],
          history:
            "Feldspathic glazes have been used since ancient Chinese stoneware, with cobalt oxide producing classic blue decoration.",
          process: [
            "Weigh feldspar, quartz, whiting, kaolin, and oxides",
            "Ball mill with alumina balls in water slurry",
            "Sieve and adjust specific gravity",
            "Dip or spray glaze onto bisque-fired mug",
          ],
          color: "#FF7043",
          inputs: ["ceramic-mug-ballmill-02"],
        },
        {
          id: "ceramic-mug-pugmill-02",
          name: "Vacuum Pugmill",
          echelon: 2,
          description:
            "A vacuum pugmill mixes clay body with water, removes air bubbles under vacuum, and extrudes a continuous de-aired clay column ready for jiggering or throwing.",
          specs: [
            { label: "Capacity", value: "200", unit: "kg/hr" },
            { label: "Vacuum level", value: "-0.08", unit: "MPa" },
            { label: "Extrusion diameter", value: "120", unit: "mm" },
            { label: "Power", value: "5.5", unit: "kW" },
          ],
          history:
            "Pugmills have been used since the 18th century to prepare clay bodies for pottery and brick production.",
          process: [
            "Load clay body and water into hopper",
            "Mix and de-air under vacuum in auger chamber",
            "Extrude solid clay column through die",
            "Cut column into sections for forming",
          ],
          color: "#795548",
          inputs: ["ceramic-mug-kaolin-03"],
        },
        {
          id: "ceramic-mug-ballmill-02",
          name: "Ceramic Ball Mill",
          echelon: 2,
          description:
            "A ceramic ball mill grinds glaze raw materials with alumina balls in water for several hours, reducing particle size to about 45 microns for a smooth, defect-free glaze layer.",
          specs: [
            { label: "Mill volume", value: "200", unit: "L" },
            { label: "Grinding media", value: "Alumina balls", unit: "" },
            { label: "Rotation speed", value: "30", unit: "RPM" },
            { label: "Grind time", value: "6", unit: "hr" },
          ],
          history:
            "Ball milling of ceramic glazes became standard in the 19th century to produce smooth, uniformly colored surfaces.",
          process: [
            "Charge raw materials, water, and alumina balls into mill",
            "Rotate drum to grind glaze to target fineness",
            "Check particle size by wet sieving",
            "Pump slurry to storage tank for glazing",
          ],
          color: "#BDBDBD",
          inputs: ["ceramic-mug-feldspar-03"],
        },
        {
          id: "ceramic-mug-kaolin-03",
          name: "Kaolin Clay",
          echelon: 3,
          description:
            "Kaolin is a primary white clay composed mainly of kaolinite (Al2Si2O5(OH)4), mined and washed to low iron content so fired ceramic bodies stay white and translucent.",
          specs: [
            { label: "Chemistry", value: "Al2Si2O5(OH)4", unit: "" },
            { label: "Iron oxide", value: "0.5", unit: "%" },
            { label: "Particle size", value: "2", unit: "µm" },
            { label: "Plasticity", value: "Medium", unit: "" },
          ],
          history:
            "Kaolin takes its name from Gaoling hill near Jingdezhen, China, where it supplied imperial porcelain for centuries.",
          process: [
            "Mine kaolinized granite by open-pit methods",
            "Slurry and wash sand, mica, and iron impurities",
            "Filter press clay into cakes",
            "Dry and mill to powder for body mixing",
          ],
          color: "#F5F5F5",
          inputs: ["ceramic-mug-kaolinmine-04"],
        },
        {
          id: "ceramic-mug-feldspar-03",
          name: "Feldspar and Quartz",
          echelon: 3,
          description:
            "Feldspar acts as the ceramic flux that lowers vitrification temperature, while quartz provides skeletal strength; both are milled and blended into stoneware bodies and glazes.",
          specs: [
            { label: "Fluxing agent", value: "Feldspar", unit: "" },
            { label: "Melting range", value: "1100-1300", unit: "°C" },
            { label: "Particle size", value: "45", unit: "µm" },
            { label: "Specific gravity", value: "2.55", unit: "" },
          ],
          history:
            "Feldspar has been used as a ceramic flux since ancient Chinese stoneware and porcelain production.",
          process: [
            "Mine feldspar and quartz from pegmatite deposits",
            "Crush and grind to ceramic-grade fineness",
            "Magnetic-separate iron contaminants",
            "Blend into body or glaze recipes",
          ],
          color: "#ECEFF1",
          inputs: ["ceramic-mug-feldsparmine-04"],
        },
        {
          id: "ceramic-mug-kaolinmine-04",
          name: "Kaolin Mine",
          echelon: 4,
          description:
            "Kaolin is mined from weathered granite deposits by open-pit methods, then slurried, centrifuged, and filtered to remove sand, mica, and iron before shipment to ceramic plants.",
          specs: [
            { label: "Kaolinite content", value: "90", unit: "%" },
            { label: "Iron oxide", value: "0.5", unit: "%" },
            { label: "Mine depth", value: "20", unit: "m" },
            { label: "Whiteness", value: "85", unit: "ISO" },
          ],
          history:
            "Kaolin takes its name from Gaoling hill near Jingdezhen, China, where it supplied imperial porcelain for centuries.",
          process: [
            "Strip overburden above kaolin lens",
            "Mine kaolinized granite with excavators",
            "Slurry and centrifuge to remove grit",
            "Filter press and dry kaolin cake",
          ],
          color: "#F5F5F5",
          inputs: [],
        },
        {
          id: "ceramic-mug-feldsparmine-04",
          name: "Feldspar Quarry",
          echelon: 4,
          description:
            "Feldspar is quarried from pegmatite or granite formations, crushed, and milled to ceramic grade for use as a flux in stoneware bodies and glazes.",
          specs: [
            { label: "Feldspar content", value: "80", unit: "%" },
            { label: "Iron oxide", value: "0.1", unit: "%" },
            { label: "Particle size", value: "200", unit: "mesh" },
            { label: "Specific gravity", value: "2.55", unit: "" },
          ],
          history:
            "Feldspar has been used as a ceramic flux since ancient Chinese stoneware and porcelain production.",
          process: [
            "Drill and blast pegmatite deposit",
            "Load ore and haul to crusher",
            "Crush, mill, and magnetic-separate iron",
            "Bag and ship to ceramic factory",
          ],
          color: "#ECEFF1",
          inputs: [],
        },
      ],
    },

    // =====================================================================
    // OBJECT: Steel Desk
    // =====================================================================
    {
      id: "steel-desk",
      name: "Steel Desk",
      color: "#37474F",
      nodes: [
        {
          id: "steel-desk-01",
          name: "Steel Desk",
          echelon: 0,
          description:
            "A steel office desk combines a powder-coated SPCC desktop, ERW tubular steel legs, and stamped drawer boxes into a rigid, weld-framed workstation that replaced wooden rolltop desks in the 20th century.",
          specs: [
            { label: "Desktop size", value: "1200 x 600", unit: "mm" },
            { label: "Steel thickness", value: "1.2", unit: "mm" },
            { label: "Finish", value: "Powder coat", unit: "" },
            { label: "Leg tube", value: "25 mm ERW", unit: "" },
          ],
          history:
            "All-steel office desks displaced wooden rolltop desks in the 1920s, with Steelcase founded in 1912 as the Metal Office Furniture Company.",
          process: [
            "Stamp desktop, legs, and drawer components",
            "Weld tubular legs to desktop frame",
            "Assemble drawer box and slides",
            "Powder coat and package for shipment",
          ],
          color: "#37474F",
          inputs: [
            "steel-desk-top-01",
            "steel-desk-legs-01",
            "steel-desk-drawer-01",
          ],
        },
        {
          id: "steel-desk-top-01",
          name: "Steel Desktop",
          echelon: 1,
          description:
            "The desktop is a 1.2 mm SPCC cold-rolled steel sheet, blanked and formed with stiffening ribs, powder coated in textured finish, and spot-welded to the leg frame.",
          specs: [
            { label: "Material", value: "SPCC cold-rolled steel", unit: "" },
            { label: "Thickness", value: "1.2", unit: "mm" },
            { label: "Finish", value: "Powder coat", unit: "" },
            { label: "Size", value: "1200 x 600", unit: "mm" },
          ],
          history:
            "All-steel office desks displaced wooden rolltop desks in the 1920s, with Steelcase founded in 1912 as the Metal Office Furniture Company.",
          process: [
            "Blank SPCC coil to 1200 x 600 mm sheet",
            "Form stiffening ribs and front edge",
            "Powder coat and cure at 180 °C",
            "Spot-weld to leg frame assembly",
          ],
          color: "#78909C",
          inputs: ["steel-desk-press-02"],
        },
        {
          id: "steel-desk-legs-01",
          name: "Tubular Steel Legs",
          echelon: 1,
          description:
            "The legs are ERW electric-resistance-welded round steel tube, 25 mm diameter with 1.2 mm wall, welded to the desktop frame and fitted with adjustable plastic glides.",
          specs: [
            { label: "Tube type", value: "ERW round tube", unit: "" },
            { label: "Diameter", value: "25", unit: "mm" },
            { label: "Wall thickness", value: "1.2", unit: "mm" },
            { label: "Finish", value: "Powder coat", unit: "" },
          ],
          history:
            "Electric resistance welding of tube was developed in the 1920s for high-speed production of steel furniture and conduit.",
          process: [
            "Form SKMP strip into tube on ERW mill",
            "High-frequency weld seam at 400 kHz",
            "Cut tube to leg length and deburr",
            "Weld to desktop and fit plastic glides",
          ],
          color: "#546E7A",
          inputs: ["steel-desk-erw-02"],
        },
        {
          id: "steel-desk-drawer-01",
          name: "Steel Drawer Box",
          echelon: 1,
          description:
            "The drawer box is stamped from SPCC sheet with a front panel, back, and sides, running on full-extension ball-bearing slides and secured with a cam lock.",
          specs: [
            { label: "Material", value: "SPCC cold-rolled steel", unit: "" },
            { label: "Thickness", value: "0.8", unit: "mm" },
            { label: "Slide type", value: "Ball-bearing", unit: "" },
            { label: "Lock", value: "Cam lock", unit: "" },
          ],
          history:
            "All-steel office desks displaced wooden rolltop desks in the 1920s, with Steelcase founded in 1912 as the Metal Office Furniture Company.",
          process: [
            "Blank and draw SPCC sheet into box sides",
            "Stamp front panel with lock hole",
            "Spot-weld box assembly and fit slides",
            "Powder coat and install cam lock",
          ],
          color: "#78909C",
          inputs: ["steel-desk-press-02"],
        },
        {
          id: "steel-desk-press-02",
          name: "Progressive Stamping Press",
          echelon: 2,
          description:
            "A 200-ton mechanical progressive press feeds SPCC coil through die stations that pierce, blank, and form desktop and drawer parts at up to 60 strokes per minute.",
          specs: [
            { label: "Press tonnage", value: "200", unit: "tons" },
            { label: "Material", value: "SPCC cold-rolled steel", unit: "" },
            { label: "Strokes per minute", value: "60", unit: "spm" },
            { label: "Die stations", value: "10", unit: "" },
          ],
          history:
            "Progressive die stamping was developed for automotive body production in the early 20th century and remains a high-volume forming method.",
          process: [
            "Feed SPCC coil into uncoiler and straightener",
            "Pierce holes in early die stations",
            "Blank and form desktop and drawer parts",
            "Separate finished parts and stack",
          ],
          color: "#BDBDBD",
          inputs: ["steel-desk-spcc-03"],
        },
        {
          id: "steel-desk-erw-02",
          name: "ERW Tube Mill",
          echelon: 2,
          description:
            "An ERW tube mill forms SKMP cold-formed steel strip into round tube, high-frequency welds the seam at about 400 kHz, trims flash, and cuts tube to desk leg length.",
          specs: [
            { label: "Tube diameter", value: "25", unit: "mm" },
            { label: "Wall thickness", value: "1.2", unit: "mm" },
            { label: "Weld frequency", value: "400", unit: "kHz" },
            { label: "Line speed", value: "15", unit: "m/min" },
          ],
          history:
            "Electric resistance welding of tube was developed in the 1920s for high-speed production of steel furniture and conduit.",
          process: [
            "Uncoil and form SKMP strip around rolls",
            "High-frequency weld tube seam",
            "Trim weld flash and size tube",
            "Cut to leg length and deburr ends",
          ],
          color: "#FB8C00",
          inputs: ["steel-desk-skmp-03"],
        },
        {
          id: "steel-desk-spcc-03",
          name: "SPCC Cold-Rolled Steel Coil",
          echelon: 3,
          description:
            "SPCC is a commercial cold-rolled steel per JIS G3141, pickled, cold reduced, annealed, and temper rolled for stamping desk tops and drawer boxes.",
          specs: [
            { label: "Standard", value: "JIS G3141", unit: "" },
            { label: "Tensile strength", value: "270", unit: "MPa" },
            { label: "Thickness", value: "1.2", unit: "mm" },
            { label: "Surface", value: "Matte finish", unit: "" },
          ],
          history:
            "Cold rolling of steel was developed in the 19th century to produce smooth, gauge-accurate sheet for precision forming.",
          process: [
            "Pickle hot-rolled coil in sulfuric acid bath",
            "Cold roll to final gauge at room temperature",
            "Anneal in bell furnace to restore ductility",
            "Temper roll and coil for stamping feedstock",
          ],
          color: "#90A4AE",
          inputs: ["steel-desk-ironore-04"],
        },
        {
          id: "steel-desk-skmp-03",
          name: "SKMP Cold-Formed Steel Strip",
          echelon: 3,
          description:
            "SKMP is cold-rolled steel strip per JIS G3144 intended for welded tube, with good weldability and formability for ERW desk legs.",
          specs: [
            { label: "Standard", value: "JIS G3144", unit: "" },
            { label: "Tensile strength", value: "270", unit: "MPa" },
            { label: "Strip width", value: "78", unit: "mm" },
            { label: "Thickness", value: "1.2", unit: "mm" },
          ],
          history:
            "Cold rolling of steel was developed in the 19th century to produce smooth, gauge-accurate sheet for precision forming.",
          process: [
            "Pickle hot-rolled coil in sulfuric acid bath",
            "Cold roll to strip gauge at room temperature",
            "Anneal and temper roll for weldability",
            "Slit to coil width for tube mill",
          ],
          color: "#90A4AE",
          inputs: ["steel-desk-ironore-04"],
        },
        {
          id: "steel-desk-ironore-04",
          name: "Iron Ore Mine",
          echelon: 4,
          description:
            "Iron ore is mined from banded iron formations or hematite deposits by open-pit methods, then crushed, screened, and beneficiated into lump or sinter feed for the blast furnace.",
          specs: [
            { label: "Iron content", value: "62", unit: "%" },
            { label: "Silica content", value: "4", unit: "%" },
            { label: "Mine depth", value: "100", unit: "m" },
            { label: "Strip ratio", value: "2.5", unit: "w:o" },
          ],
          history:
            "Large-scale iron ore mining began in the 19th century in the Lake Superior district, feeding America's early steel mills.",
          process: [
            "Drill and blast iron-bearing rock",
            "Load ore with hydraulic shovels into haul trucks",
            "Crush and screen to lump and fines products",
            "Stockpile or rail to steel mill blast furnace",
          ],
          color: "#795548",
          inputs: [],
        },
      ],
    },

    // =====================================================================
    // OBJECT: Float Glass Window
    // =====================================================================
    {
      id: "glass-window",
      name: "Float Glass Window",
      color: "#607D8B",
      nodes: [
        {
          id: "glass-window-01",
          name: "Float Glass Window",
          echelon: 0,
          description:
            "A float glass window consists of soda-lime glass panes made on a Pilkington float line, fitted into an extruded 6063-T5 aluminum frame with weather seals and insulating glass spacers.",
          specs: [
            { label: "Glass type", value: "Soda-lime float", unit: "" },
            { label: "Thickness", value: "4", unit: "mm" },
            { label: "Frame material", value: "6063-T5 aluminum", unit: "" },
            { label: "U-value", value: "2.8", unit: "W/m²K" },
          ],
          history:
            "Alastair Pilkington invented the float glass process in 1952, commercialized in 1959, replacing ground and polished plate glass.",
          process: [
            "Cut float glass to window size",
            "Assemble aluminum frame with corners",
            "Glaze pane with gaskets and spacers",
            "Weather-seal and package for shipment",
          ],
          color: "#607D8B",
          inputs: ["glass-window-pane-01", "glass-window-frame-01"],
        },
        {
          id: "glass-window-pane-01",
          name: "Float Glass Pane",
          echelon: 1,
          description:
            "Soda-lime glass is melted at 1550 °C and floated on a molten tin bath in the Pilkington process, forming a ribbon of perfectly flat glass that is annealed in the lehr and cut to jumbo sheets.",
          specs: [
            { label: "Glass type", value: "Soda-lime float", unit: "" },
            { label: "Thickness", value: "4", unit: "mm" },
            { label: "Melt temperature", value: "1550", unit: "°C" },
            { label: "Tin bath temp", value: "1000", unit: "°C" },
          ],
          history:
            "Alastair Pilkington invented the float glass process in 1952, commercialized in 1959, replacing ground and polished plate glass.",
          process: [
            "Batch sand, soda ash, limestone, and cullet",
            "Melt batch in furnace at 1550 °C",
            "Float glass ribbon on molten tin bath",
            "Anneal in lehr and cut to jumbo sheets",
          ],
          color: "#ECEFF1",
          inputs: ["glass-window-float-02"],
        },
        {
          id: "glass-window-frame-01",
          name: "Extruded Aluminum Frame",
          echelon: 1,
          description:
            "The frame is 6063-T5 aluminum extruded through a hollow die at about 450 °C, then quenched, stretched, and artificially aged for architectural window profiles with good anodizing response.",
          specs: [
            { label: "Alloy", value: "6063-T5", unit: "" },
            { label: "Billet temp", value: "450", unit: "°C" },
            { label: "Finish", value: "Clear anodize", unit: "" },
            { label: "Profile", value: "Hollow frame", unit: "" },
          ],
          history:
            "Extrusion pressing was patented by Joseph Bramah in 1795 for lead pipe, and aluminum extrusion for windows spread after World War II.",
          process: [
            "Preheat 6063-T5 billet to 450-500 °C",
            "Extrude through hollow window-profile die",
            "Quench, stretch, and age to T5 temper",
            "Cut, drill, and anodize frame members",
          ],
          color: "#C0C0C0",
          inputs: ["glass-window-extrusion-02"],
        },
        {
          id: "glass-window-float-02",
          name: "Pilkington Float Line",
          echelon: 2,
          description:
            "A Pilkington float line melts soda-lime batch at 1550 °C and floats the glass ribbon on molten tin at about 1000 °C, then anneals it in a lehr cooling from 600 °C to room temperature.",
          specs: [
            { label: "Melt temperature", value: "1550", unit: "°C" },
            { label: "Tin bath temperature", value: "1000", unit: "°C" },
            { label: "Anneal lehr temp", value: "600", unit: "°C" },
            { label: "Ribbon width", value: "3210", unit: "mm" },
          ],
          history:
            "Alastair Pilkington invented the float glass process in 1952, commercialized in 1959, replacing ground and polished plate glass.",
          process: [
            "Charge sand, soda ash, limestone, cullet to furnace",
            "Melt batch at 1550 °C and refine",
            "Float ribbon on molten tin bath to flatness",
            "Anneal in lehr and cut jumbo sheets",
          ],
          color: "#FB8C00",
          inputs: ["glass-window-soda-03"],
        },
        {
          id: "glass-window-extrusion-02",
          name: "Aluminum Extrusion Press",
          echelon: 2,
          description:
            "A horizontal extrusion press pushes preheated 6063-T5 billet through a die at 100-1000 tons ram pressure, producing hollow window profiles that are quenched and aged.",
          specs: [
            { label: "Press force", value: "1000", unit: "tons" },
            { label: "Billet temperature", value: "475", unit: "°C" },
            { label: "Die type", value: "Hollow portrait die", unit: "" },
            { label: "Exit speed", value: "10", unit: "m/min" },
          ],
          history:
            "Extrusion pressing was patented by Joseph Bramah in 1795 for lead pipe, and aluminum extrusion for windows spread after World War II.",
          process: [
            "Preheat billet in induction furnace",
            "Ram billet through extrusion die",
            "Quench profile on run-out table",
            "Stretch and artificially age to T5",
          ],
          color: "#BDBDBD",
          inputs: ["glass-window-alu-03"],
        },
        {
          id: "glass-window-soda-03",
          name: "Soda-Lime Glass Batch",
          echelon: 3,
          description:
            "Soda-lime glass batch blends about 72 % silica sand, 15 % soda ash, 9 % lime, and cullet; soda lowers the melting temperature while lime improves chemical durability.",
          specs: [
            { label: "Silica content", value: "72", unit: "%" },
            { label: "Soda ash content", value: "15", unit: "%" },
            { label: "Lime content", value: "9", unit: "%" },
            { label: "Cullet content", value: "25", unit: "%" },
          ],
          history:
            "Soda-lime glass has dominated window production since ancient Roman times because of its low cost and good working range.",
          process: [
            "Weigh sand, soda ash, limestone, dolomite, and cullet",
            "Blend batch in mixing silo",
            "Charge to furnace with batch charger",
            "Melt at 1550 °C for float line feed",
          ],
          color: "#ECEFF1",
          inputs: ["glass-window-sand-04"],
        },
        {
          id: "glass-window-alu-03",
          name: "6063-T5 Aluminum Billet",
          echelon: 3,
          description:
            "6063-T5 is an aluminum-magnesium-silicon extrusion alloy solution heat treated and artificially aged for architectural profiles, offering good corrosion response and anodizing appearance.",
          specs: [
            { label: "Alloy", value: "6063-T5", unit: "" },
            { label: "Yield strength", value: "110", unit: "MPa" },
            { label: "Billet diameter", value: "178", unit: "mm" },
            { label: "Billet length", value: "600", unit: "mm" },
          ],
          history:
            "Aluminum 6063 was developed as the premier architectural extrusion alloy for windows, curtain walls, and storefronts.",
          process: [
            "Extract alumina from bauxite via Bayer process",
            "Electrolytically reduce aluminum in Hall-Héroult cells",
            "Alloy with magnesium and silicon, cast billet",
            "Solution heat treat and artificially age to T5",
          ],
          color: "#C0C0C0",
          inputs: ["glass-window-bauxite-04"],
        },
        {
          id: "glass-window-sand-04",
          name: "Silica Sand Quarry",
          echelon: 4,
          description:
            "Low-iron silica sand is quarried from quartz sandstone, washed, and screened to meet glass-grade chemistry, since iron impurities would tint the float glass green.",
          specs: [
            { label: "Silica content", value: "98", unit: "%" },
            { label: "Iron oxide", value: "0.03", unit: "%" },
            { label: "Grain size", value: "0.3", unit: "mm" },
            { label: "Moisture", value: "0.5", unit: "%" },
          ],
          history:
            "Silica sand has been the primary ingredient of glass since Mesopotamian and Egyptian glassmaking thousands of years ago.",
          process: [
            "Drill and blast quartz sandstone deposit",
            "Load ore and haul to washing plant",
            "Wash, screen, and magnetic-separate iron",
            "Dry and stockpile for glass batch",
          ],
          color: "#F5F5F5",
          inputs: [],
        },
        {
          id: "glass-window-bauxite-04",
          name: "Bauxite Mine",
          echelon: 4,
          description:
            "Bauxite is a sedimentary rock rich in aluminum hydroxides and iron oxides, mined by open-pit methods and refined via the Bayer process into alumina for electrolytic smelting.",
          specs: [
            { label: "Alumina content", value: "45", unit: "%" },
            { label: "Silica content", value: "5", unit: "%" },
            { label: "Mine depth", value: "30", unit: "m" },
            { label: "Strip ratio", value: "1.5", unit: "w:o" },
          ],
          history:
            "Bauxite was first identified near Les Baux-de-Provence, France by geologist Pierre Berthier in 1821, giving the ore its name.",
          process: [
            "Clear and drill overburden above bauxite lens",
            "Excavate ore with hydraulic excavators and haul trucks",
            "Crush and wash bauxite to remove clay and silica",
            "Transport washed ore to Bayer refinery for alumina extraction",
          ],
          color: "#D4A017",
          inputs: [],
        },
      ],
    },

    // =====================================================================
    // OBJECT: Hardcover Book
    // =====================================================================
    {
      id: "hardcover-book",
      name: "Hardcover Book",
      color: "#4E342E",
      nodes: [
        {
          id: "hardcover-book-01",
          name: "Hardcover Book",
          echelon: 0,
          description:
            "A hardcover book is printed signatures sewn through their folds into a page block, rounded and backed over a spine lining, then cased in binder's board wrapped with printed cloth and anchored by glued endpapers.",
          specs: [
            { label: "Signatures sewn", value: "21", unit: "" },
            { label: "Pages", value: "336", unit: "" },
            { label: "Weight", value: "640", unit: "g" },
            { label: "Opens flat", value: "Yes", unit: "" },
          ],
          history:
            "Machine-made case binding took hold in the 1830s, when publishers began issuing novels already bound in cloth boards instead of selling them in loose paper wrappers.",
          process: [
            "Fold printed sheets into 16-page signatures",
            "Sew signatures through their folds onto tapes",
            "Round and back the block, thump it square",
            "Glue endpapers and case the block in boards",
          ],
          color: "#4E342E",
          inputs: ["hardcover-book-pages-01", "hardcover-book-cover-01"],
        },
        {
          id: "hardcover-book-pages-01",
          name: "Sewn Page Block",
          echelon: 1,
          description:
            "The page block is a stack of 16-page signatures folded from printed sheets and sewn through the fold with linen thread, the structure that lets a well-made book open flat and hold together for a century.",
          specs: [
            { label: "Signature", value: "16", unit: "pages" },
            { label: "Thread", value: "Linen", unit: "" },
            { label: "Paper", value: "90", unit: "g/m²" },
            { label: "Block", value: "21", unit: "signatures" },
          ],
          history:
            "Sewing through the fold is as old as the codex itself; the earliest bound books in Egypt already used the technique.",
          process: [
            "Print text sheets four pages to a side",
            "Fold sheets into 16-page signatures",
            "Sew through the fold on a gathering-sewing machine",
            "Trim three edges flush on a guillotine",
          ],
          color: "#8D6E63",
          inputs: ["hardcover-book-press-02"],
        },
        {
          id: "hardcover-book-cover-01",
          name: "Cloth-Wrapped Case",
          echelon: 1,
          description:
            "The case is two binder's boards and a spine strip joined by a cloth covering, printed, foil-stamped and square-cut; the sewn block meets this ready-made case only at the endpapers.",
          specs: [
            { label: "Board thickness", value: "2", unit: "mm" },
            { label: "Covering", value: "Buckram cloth", unit: "" },
            { label: "Foil stamping", value: "120", unit: "°C" },
            { label: "Case weight", value: "180", unit: "g" },
          ],
          history:
            "Cloth-wrapped boards replaced leather when William Pickering began selling books already bound in buckram around 1820.",
          process: [
            "Cut binder's board to case dimensions",
            "Print and foil-stamp the cover cloth",
            "Glue boards and spine cloth into one case",
            "Casing-in machine glues block to endpapers",
          ],
          color: "#A1887F",
          inputs: ["hardcover-book-paper-03", "hardcover-book-glue-03"],
        },
        {
          id: "hardcover-book-press-02",
          name: "Offset Press",
          echelon: 2,
          description:
            "A heatset web offset press prints from giant paper rolls, not stacks of sheets: water keeps ink off the blank areas, four CMYK units color each side, and the web folds itself into signatures at the delivery.",
          specs: [
            { label: "Web speed", value: "10", unit: "m/s" },
            { label: "Ink units", value: "4", unit: "" },
            { label: "Roll weight", value: "9", unit: "t" },
            { label: "Per impression", value: "32", unit: "pages" },
          ],
          history:
            "Offset printing came from Ira Rubel of New Jersey, who patented a rubber-blanket press in 1904 after noticing how cleanly it printed paper bags.",
          process: [
            "Mount aluminum plates on the plate cylinders",
            "Dampen plates, then meter ink to the blankets",
            "Print both sides of the moving paper web",
            "Dry, chill and fold the web into signatures",
          ],
          color: "#455A64",
          inputs: ["hardcover-book-paper-03"],
        },
        {
          id: "hardcover-book-paper-03",
          name: "Coated Book Paper",
          echelon: 3,
          description:
            "The pages are thin paper: cellulose fibers cooked free of wood chips, washed, bleached and formed into a wet web, then filled with clay, sized and supercalendered into a bright printable surface.",
          specs: [
            { label: "Basis weight", value: "90", unit: "g/m²" },
            { label: "Thickness", value: "0.1", unit: "mm" },
            { label: "Coat weight", value: "12", unit: "g/m²" },
            { label: "Brightness", value: "92", unit: "%" },
          ],
          history:
            "Paper became affordable to the masses after the Fourdrinier brothers' continuous paper machine started running in 1803.",
          process: [
            "Cook wood chips in sulfite liquor to pulp",
            "Wash, bleach and beat fibers to fibrillate",
            "Form the sheet on a Fourdrinier wire",
            "Press, dry, size and calender onto the reel",
          ],
          color: "#F5F5F5",
          inputs: ["hardcover-book-forest-04"],
        },
        {
          id: "hardcover-book-glue-03",
          name: "Binding Adhesive",
          echelon: 3,
          description:
            "Hot-melt binding adhesive is a tacky resin that melts in a glue pot around 170 °C, is rolled onto the spine as a 0.4 mm film and sets rigid within seconds, locking the finished block inside its case.",
          specs: [
            { label: "Melt temperature", value: "170", unit: "°C" },
            { label: "Open time", value: "5", unit: "s" },
            { label: "Set time", value: "10", unit: "s" },
            { label: "Type", value: "EVA copolymer", unit: "" },
          ],
          history:
            "Hot-melt adhesives entered bookbinding in the 1940s, making the perfect-bound paperback possible a decade later.",
          process: [
            "Synthesize EVA resin with tackifiers and wax",
            "Melt pellets into a viscous pot glue",
            "Roll a 0.4 mm film onto the spine",
            "Chill and cure seconds after casing-in",
          ],
          color: "#FFB74D",
          inputs: ["hardcover-book-petroleum-04"],
        },
        {
          id: "hardcover-book-forest-04",
          name: "Spruce Forest",
          echelon: 4,
          description:
            "Managed spruce and pine forests supply the wood whose fiber becomes the pages: harvested on long rotations, debarked and chipped at the landing before the truck ever leaves for the mill.",
          specs: [
            { label: "Rotation", value: "80", unit: "years" },
            { label: "Growth", value: "6", unit: "m³/ha/yr" },
            { label: "Books per tree", value: "60", unit: "" },
            { label: "Chip size", value: "20", unit: "mm" },
          ],
          history:
            "Wood displaced cotton rags as the world's paper fiber after Friedrich Keller's 1843 wood-grinding pulper made mechanical pulp practical.",
          process: [
            "Thin and fell on a managed rotation",
            "Debark and chip logs at the landing",
            "Haul chips by truck to the pulp mill",
            "Replant for the next rotation",
          ],
          color: "#5D4037",
          inputs: [],
        },
        {
          id: "hardcover-book-petroleum-04",
          name: "Crude Oil Well",
          echelon: 4,
          description:
            "The adhesive and the cloth backing and the foil stamping all begin as crude oil: refineries split naphtha in steam crackers into ethylene and vinyl acetate, the two ingredients of the glue holding the block to the case.",
          specs: [
            { label: "Well depth", value: "2", unit: "km" },
            { label: "Naphtha yield", value: "20", unit: "%" },
            { label: "Cracker temp", value: "850", unit: "°C" },
            { label: "Glue per book", value: "9", unit: "g" },
          ],
          history:
            "Naphtha cracking for chemicals began in the 1930s, when the first steam crackers turned refinery fractions into new plastics and resins.",
          process: [
            "Drill and pump crude from the reservoir",
            "Distill crude into fractions at the refinery",
            "Steam-crack naphtha into ethylene and VAM",
            "Polymerize into EVA binding resin",
          ],
          color: "#37474F",
          inputs: [],
        },
      ],
    },

    // =====================================================================
    // OBJECT: Ceiling Fan
    // =====================================================================
    {
      id: "ceiling-fan",
      name: "Ceiling Fan",
      color: "#37474F",
      nodes: [
        {
          id: "ceiling-fan-01",
          name: "Ceiling Fan",
          echelon: 0,
          description:
            "A ceiling fan is a single-phase induction motor hung above you, with nine pressed-steel blades bolted to its bell housing and a capacitor that sets the speed; 250 rpm on 60 watts, all day, quietly.",
          specs: [
            { label: "Blades", value: "5", unit: "" },
            { label: "Speed", value: "250", unit: "rpm" },
            { label: "Power", value: "60", unit: "W" },
            { label: "Weight", value: "7", unit: "kg" },
          ],
          history:
            "Philip Diehl adapted his sewing-machine motor into a ceiling fan in New Jersey in 1885, a few years after the first electric fans went on sale.",
          process: [
            "Stamp and pitch five steel blades",
            "Wind, connect and varnish the stator",
            "Die-cast the aluminum rotor and shaft",
            "Assemble, balance and burn-in under test",
          ],
          color: "#37474F",
          inputs: ["ceiling-fan-motor-01", "ceiling-fan-blades-01", "ceiling-fan-hardware-01"],
        },
        {
          id: "ceiling-fan-motor-01",
          name: "Induction Motor",
          echelon: 1,
          description:
            "The motor is two enameled-copper windings pressed into a laminated steel stator; alternating current drags the aluminum rotor around at 250 rpm, with no brushes anywhere to wear out.",
          specs: [
            { label: "Stator slots", value: "24", unit: "" },
            { label: "Copper", value: "0.4", unit: "kg" },
            { label: "Run capacitor", value: "1.5", unit: "µF" },
            { label: "Bearing", value: "Sealed, oiled", unit: "" },
          ],
          history:
            "Nikola Tesla's 1888 induction-motor patent set the working principle every ceiling fan still follows.",
          process: [
            "Stack and rivet silicon-steel laminations",
            "Insert wound coils into the stator slots",
            "Connect, dip in varnish and bake",
            "Press the shaft into the rotor, fit bearings",
          ],
          color: "#6D4C41",
          inputs: ["ceiling-fan-winder-02"],
        },
        {
          id: "ceiling-fan-blades-01",
          name: "Pressed-Steel Blades",
          echelon: 1,
          description:
            "Blades are stamped from cold-rolled steel sheet, bent to a pitch of 23 degrees and powder-coated, then weigh-matched so the whole assembly spins without a wobble.",
          specs: [
            { label: "Pitch", value: "23", unit: "°" },
            { label: "Thickness", value: "0.7", unit: "mm" },
            { label: "Balance", value: "±1.5", unit: "g" },
            { label: "Coating", value: "Powder epoxy", unit: "" },
          ],
          history:
            "Fan blades were hand-carved wood until pressed steel took over fan production lines in the 1930s.",
          process: [
            "Blank the blade outline from steel sheet",
            "Bend to a fixed pitch in the same stroke",
            "Powder-coat and bake the blade",
            "Weigh-match blades before assembly",
          ],
          color: "#78909C",
          inputs: ["ceiling-fan-stamping-02"],
        },
        {
          id: "ceiling-fan-hardware-01",
          name: "Steel Fasteners",
          echelon: 1,
          description:
            "The bolts that hold fan to ceiling are standard fasteners: cold-headed steel machine bolts with rolled threads, zinc-plated, torqued to a spec and forgotten for decades.",
          specs: [
            { label: "Size", value: "M8", unit: "" },
            { label: "Grade", value: "8.8", unit: "" },
            { label: "Torque", value: "18", unit: "Nm" },
            { label: "Plating", value: "Zinc", unit: "" },
          ],
          history:
            "Thread-rolling machines of the 1840s first made screws fast and cheap enough to become standard hardware.",
          process: [
            "Cold-head the bolt blank from wire",
            "Roll the thread between grooved dies",
            "Heat-treat to grade 8.8",
            "Zinc-plate and pack loose hardware",
          ],
          color: "#B0BEC5",
          inputs: ["ceiling-fan-ironore-04"],
        },
        {
          id: "ceiling-fan-winder-02",
          name: "Coil Winding Machine",
          echelon: 2,
          description:
            "A winding machine spools thousands of turns of enameled copper around the bobbin at constant servo tension, then cuts, crimps and unmounts the finished coil without a hand ever touching the wire.",
          specs: [
            { label: "Turns per coil", value: "1100", unit: "" },
            { label: "Tension", value: "±0.2", unit: "N" },
            { label: "Cycle", value: "48", unit: "s" },
            { label: "Wire", value: "0.31", unit: "mm" },
          ],
          history:
            "Automatic coil winders mechanized motor factories from the 1920s onward, replacing benches of hand winders.",
          process: [
            "Load bobbins onto the winding fixtures",
            "Guide wire with servo tension control",
            "Wind the turn count and cross over",
            "Cut, crimp and unload the finished coil",
          ],
          color: "#455A64",
          inputs: ["ceiling-fan-magwire-03"],
        },
        {
          id: "ceiling-fan-stamping-02",
          name: "Progressive Die Press",
          echelon: 2,
          description:
            "A mechanical press strokes a progressive die: the steel coil feeds one station forward each stroke, the blade is blanked, pitched and flanged without ever leaving the strip until ejection.",
          specs: [
            { label: "Press force", value: "60", unit: "t" },
            { label: "Strokes", value: "40", unit: "/min" },
            { label: "Die stations", value: "6", unit: "" },
            { label: "Pitch tolerance", value: "±0.5", unit: "°" },
          ],
          history:
            "Progressive die stamping spread from the automotive industry of the 1920s into every appliance factory.",
          process: [
            "Feed coil through the progressive die",
            "Blank the outline at the first station",
            "Form pitch and flanges mid-stroke",
            "Eject, deburr and carton to pallets",
          ],
          color: "#455A64",
          inputs: ["ceiling-fan-bladesteel-03"],
        },
        {
          id: "ceiling-fan-magwire-03",
          name: "Enameled Copper Wire",
          echelon: 3,
          description:
            "Magnet wire is electrolytic copper drawn through diamond dies to 0.31 mm, annealed soft again, then baked with insulating enamel in layers so coils can be wound touching without ever shorting.",
          specs: [
            { label: "Diameter", value: "0.31", unit: "mm" },
            { label: "Conductor", value: "99.99", unit: "% Cu" },
            { label: "Insulation", value: "Polyester-imide", unit: "" },
            { label: "Breakdown", value: "4", unit: "kV" },
          ],
          history:
            "Wire enamel replaced wound cotton and silk insulation in the 1920s, doubling the copper that fits in a motor.",
          process: [
            "Draw copper rod through diamond dies",
            "Anneal soft again at 450 °C",
            "Bake on enamel in successive passes",
            "Spark-test every meter before spooling",
          ],
          color: "#8D6E63",
          inputs: ["ceiling-fan-copper-04"],
        },
        {
          id: "ceiling-fan-bladesteel-03",
          name: "Cold-Rolled Steel Coil",
          echelon: 3,
          description:
            "Blades begin as a coil of low-carbon cold-rolled steel: pickled of its oxide scale, rolled to 0.7 mm on tandem mills and annealed soft enough to bend to pitch without cracking.",
          specs: [
            { label: "Thickness", value: "0.7", unit: "mm" },
            { label: "Yield", value: "210", unit: "MPa" },
            { label: "Coil weight", value: "8", unit: "t" },
            { label: "Carbon", value: "0.06", unit: "%" },
          ],
          history:
            "Continuous cold-strip mills began rolling thin flat steel in bulk during the 1920s.",
          process: [
            "Pickle oxides from the hot slab",
            "Cold-roll to gauge on a tandem mill",
            "Anneal in a bell furnace",
            "Temper-roll and oil the finished coil",
          ],
          color: "#B0BEC5",
          inputs: ["ceiling-fan-ironore-04"],
        },
        {
          id: "ceiling-fan-copper-04",
          name: "Copper Mine",
          echelon: 4,
          description:
            "The winding's copper leaves the ground as chalcopyrite ore running under one percent metal, is concentrated by flotation, smelted and electrorefined until it becomes 99.99 % cathode copper for wire drawing.",
          specs: [
            { label: "Ore grade", value: "0.8", unit: "% Cu" },
            { label: "Rock per kg", value: "125", unit: "kg" },
            { label: "Pit depth", value: "900", unit: "m" },
            { label: "Cathode", value: "99.99", unit: "% Cu" },
          ],
          history:
            "Copper smelting is older than writing: furnaces at Feinan in Jordan worked the ore nearly 7,000 years ago.",
          process: [
            "Blast and haul ore from open-pit benches",
            "Float the concentrate to 30 % Cu",
            "Smelt and convert to blister copper",
            "Electrorefine to cathodes for wire",
          ],
          color: "#B87333",
          inputs: [],
        },
        {
          id: "ceiling-fan-ironore-04",
          name: "Iron Ore Mine",
          echelon: 4,
          description:
            "Blade and fastener steel begins as hematite iron ore from open-pit mines, hauled by rail to blast furnaces where coke and lime strip the oxygen into molten iron.",
          specs: [
            { label: "Ore grade", value: "62", unit: "% Fe" },
            { label: "Furnace temp", value: "1500", unit: "°C" },
            { label: "Coke per tonne", value: "300", unit: "kg" },
            { label: "Rail haul", value: "40", unit: "km" },
          ],
          history:
            "Hematite mining at Kiruna, Sweden has moved a billion tonnes of ore since 1900, most of it to steel mills.",
          process: [
            "Drill and blast benches in the ore zone",
            "Load ore with 400-ton haul trucks",
            "Crush, screen and stockpile at the mine",
            "Rail to the steel mill blast furnace",
          ],
          color: "#795548",
          inputs: [],
        },
      ],
    },

    // =====================================================================
    // OBJECT: Candle (under its glass chimney)
    // =====================================================================
    {
      id: "candle",
      name: "Candle",
      color: "#EAD9B0",
      nodes: [
        {
          id: "candle-01",
          name: "Candle",
          echelon: 0,
          description:
            "A candle is a column of food-grade paraffin wax around a braided cotton wick, standing under a soda-lime glass chimney that shields the flame from every draught in the room.",
          specs: [
            { label: "Wax mass", value: "200", unit: "g" },
            { label: "Burn time", value: "45", unit: "h" },
            { label: "Flame temperature", value: "850", unit: "°C" },
            { label: "Wax origin", value: "Crude oil", unit: "" },
          ],
          history:
            "Paraffin wax was first distilled from petroleum in the 1830s; by 1890 it had displaced tallow and beeswax as the world's candle material almost overnight.",
          process: [
            "Dewax lube oil and filter the wax fraction",
            "Cast paraffin around a sized cotton wick",
            "Blow the glass chimney and seat base to base",
            "Light it: the flame melts a pool, the pool feeds the wick",
          ],
          color: "#EAD9B0",
          inputs: ["candle-wax-01", "candle-chimney-01", "candle-wick-01"],
        },
        {
          id: "candle-wax-01",
          name: "Wax Body",
          echelon: 1,
          description:
            "The wax body is refined paraffin, the heavy fraction left after crude oil is distilled into fuels. It is dewaxed from lube oil, filtered white, and cast into a free-standing column.",
          specs: [
            { label: "Melting point", value: "58", unit: "°C" },
            { label: "Grade", value: "Food", unit: "" },
            { label: "Shrink on cooling", value: "2", unit: "%" },
          ],
          history:
            "Until the 1850s candles were rendered animal fat; paraffin made a cleaner, whiter, cheaper candle and ended the tallow trade within a decade.",
          process: [
            "Solvent-dewax lube oil to separate wax",
            "Filter and hydrofinish until white",
            "Cast into blocks, then pillar molds",
            "Age the cast so crystals settle uniform",
          ],
          color: "#F2E7CF",
          inputs: ["candle-distill-02", "candle-paraffin-03"],
        },
        {
          id: "candle-chimney-01",
          name: "Glass Chimney",
          echelon: 1,
          description:
            "The chimney is a thin soda-lime glass cylinder, blown as one piece so no seam runs where the flame's heat would find it. It stands loose in a brass collar and lifts off for lighting.",
          specs: [
            { label: "Wall thickness", value: "1.2", unit: "mm" },
            { label: "Glass", value: "Soda-lime", unit: "" },
            { label: "Formed at", value: "1100", unit: "°C" },
          ],
          history:
            "Glass chimneys were invented for Argand lamps in 1784; shielding the flame doubled its light and took the smoke off every ceiling in Europe.",
          process: [
            "Gather soda-lime glass on the blow head",
            "Blow and spin the cylinder to gauge",
            "Anneal slowly so no stress is locked in",
            "Fire-polish the rim and fit the collar",
          ],
          color: "#CFE0E4",
          inputs: ["candle-blow-02", "candle-batch-03"],
        },
        {
          id: "candle-wick-01",
          name: "Cotton Wick",
          echelon: 1,
          description:
            "The wick is braided cotton, sized in starch so it stands up while lit. The braid angle is the whole trick: it curls the tip into the hot zone where the flame trims itself to a stub of carbon.",
          specs: [
            { label: "Braid", value: "3-ply cotton", unit: "" },
            { label: "Sizing", value: "Starch", unit: "" },
            { label: "Capillary", value: "0.5", unit: "mm" },
          ],
          history:
            "Braided wicks replaced twisted ones in 1834, when Robert Wells patented the plait that curls the burnt tip into the flame and keeps the candle from smoking.",
          process: [
            "Spin cotton to fine yarn",
            "Braid three plies at a fixed angle",
            "Size in starch and cut to length",
            "Prime the tip with wax before packing",
          ],
          color: "#8D7B62",
          inputs: ["candle-cotton-03"],
        },
        {
          id: "candle-distill-02",
          name: "Vacuum Distillation Unit",
          echelon: 2,
          description:
            "A vacuum distillation unit pulls crude oil apart under reduced pressure, so the heavy tail boils at a temperature that does not coke it. Lubricating oil comes off the column; the wax stays behind in it.",
          specs: [
            { label: "Pressure", value: "25", unit: "mbar" },
            { label: "Bottom temp", value: "350", unit: "°C" },
            { label: "Cut point", value: "550", unit: "°C" },
          ],
          history:
            "Vacuum distillation was installed at refineries from the 1930s to stop heavy oil from cooking to coke in the furnace; every later deep-conversion refinery descends from it.",
          process: [
            "Pump atmospheric residue into the column",
            "Flash it under vacuum at 350 °C",
            "Draw lube cuts from the side",
            "Send the wax-rich raffinate to dewaxing",
          ],
          color: "#7E8B92",
          inputs: ["candle-paraffin-03"],
        },
        {
          id: "candle-blow-02",
          name: "Blow-and-Blow Machine",
          echelon: 2,
          description:
            "A blow-and-blow machine forms glass cylinders with air alone: a gob drops into a blank mold, a puff settles it, and a final blow opens it out to full gauge against the heated walls.",
          specs: [
            { label: "Mold temp", value: "550", unit: "°C" },
            { label: "Cycle", value: "12", unit: "s" },
            { label: "Gob weight", value: "180", unit: "g" },
          ],
          history:
            "Michael Owens' automatic bottle machine (1903) ended mouth-blown glass; its descendants still blow every chimney, jar and bottle by air pressure alone.",
          process: [
            "Drop a weighed gob into the blank mold",
            "Settle the gob with a puff of air",
            "Blow the parison against the mold wall",
            "Transfer, final-blow, and anneal",
          ],
          color: "#90A4AE",
          inputs: ["candle-batch-03"],
        },
        {
          id: "candle-paraffin-03",
          name: "Refined Paraffin Wax",
          echelon: 3,
          description:
            "Refined paraffin is the crystalline fraction dewaxed out of lubricating oil: white, odorless, inert. The same material seals jam jars, coats cheese, and fills the space between toothpaste tubes on a production line.",
          specs: [
            { label: "Oil content", value: "<0.5", unit: "%" },
            { label: "Saybolt colour", value: "+30", unit: "" },
            { label: "Drop melting point", value: "58", unit: "°C" },
          ],
          history:
            "In 1857 the Boyd candle works in Scotland first sold petroleum paraffin candles at scale; within thirty years whaling ships were no longer in the candle business.",
          process: [
            "Chill and crystallize the dewaxed oil",
            "Filter the wax cake free of oil",
            "Bleach and filter until white",
            "Grade by melting point for casting",
          ],
          color: "#EDE3C8",
          inputs: ["candle-crude-04"],
        },
        {
          id: "candle-batch-03",
          name: "Soda-Lime Glass Batch",
          echelon: 3,
          description:
            "Glass is mostly just sand, three-quarters of it, with a little soda ash and lime to lower the melting point and keep the rain from dissolving it.",
          specs: [
            { label: "Sand", value: "72", unit: "%" },
            { label: "Soda ash", value: "15", unit: "%" },
            { label: "Recycled glass", value: "25", unit: "%" },
          ],
          history:
            "This recipe, sand plus soda plus lime, is essentially unchanged since ancient Rome. It's the cheapest way to make glass.",
          process: [
            "Weigh sand, soda ash, limestone, cullet",
            "Mix with water to control dust",
            "Charge the furnace at 1550 °C",
            "Skim the melt and refine it",
          ],
          color: "#CFD8DC",
          inputs: ["candle-quarry-04"],
        },
        {
          id: "candle-cotton-03",
          name: "Combed Cotton Yarn",
          echelon: 3,
          description:
            "Combed cotton yarn is cotton drawn to an even twist after the short fibres are combed out. Even twist matters here: a wick that varies in density varies in capillarity, and the flame wanders with it.",
          specs: [
            { label: "Count", value: "Ne 40", unit: "" },
            { label: "Twist", value: "420", unit: "tpm" },
            { label: "Short fibre removed", value: "15", unit: "%" },
          ],
          history:
            "Combing cotton to remove short fibres was mechanised in Lancashire in the 1820s; the resulting yarn was strong enough for the first cotton sailcloth.",
          process: [
            "Card the ginned lint into sliver",
            "Comb out short fibres and neps",
            "Draw to an even strand",
            "Spin and wind onto tubes",
          ],
          color: "#D9CDB4",
          inputs: ["candle-field-04"],
        },
        {
          id: "candle-quarry-04",
          name: "Silica Sand Quarry",
          echelon: 4,
          description:
            "It starts as ordinary quartz sand, washed until it's almost pure. Let in a little iron and the whole pane would turn green, so they wash it obsessively.",
          specs: [
            { label: "Pure silica", value: "98", unit: "%" },
            { label: "Iron kept under", value: "0.03", unit: "%" },
            { label: "Grain size", value: "0.3", unit: "mm" },
          ],
          history:
            "Sand has been the main ingredient in glass since the first glassmakers in Egypt and Mesopotamia, thousands of years ago.",
          process: [
            "Dredge or drill the sand face",
            "Wash out clay and soluble salts",
            "Separate fines and grade by size",
            "Stockpile under cover, dry",
          ],
          color: "#B0BEC5",
          inputs: [],
        },
        {
          id: "candle-crude-04",
          name: "Crude Oil Well",
          echelon: 4,
          description:
            "Crude oil is the remains of marine plankton, buried under rock for fifty million years and cooked to petroleum. Everything refined from it — fuel, wax, plastic — was once pressure and time.",
          specs: [
            { label: "Age", value: "50", unit: "Ma" },
            { label: "Well depth", value: "2000", unit: "m" },
            { label: "API gravity", value: "34", unit: "°" },
          ],
          history:
            "The first commercial oil well was drilled in 1859 at Titusville, Pennsylvania, by men who wanted kerosene for lamps, not fuel for engines.",
          process: [
            "Drill to the reservoir rock",
            "Case and perforate the wellbore",
            "Lift oil with reservoir pressure",
            "Separate oil, gas and formation water",
          ],
          color: "#4E4238",
          inputs: [],
        },
        {
          id: "candle-field-04",
          name: "Cotton Field",
          echelon: 4,
          description:
            "Cotton is a shrub that grows bolls of seed-borne fibre. Roughly a third of the harvested weight of the boll is lint; the rest is seed and burr, split off at the gin hours after picking.",
          specs: [
            { label: "Lint share", value: "33", unit: "%" },
            { label: "Fibre length", value: "28", unit: "mm" },
            { label: "Lint yield", value: "1", unit: "t/ha" },
          ],
          history:
            "Cotton has been spun for at least seven thousand years; the cotton gin of 1793 made it profitable to grow anywhere in the American south.",
          process: [
            "Pick the open bolls from the shrub",
            "Gin to separate lint from seed",
            "Bale the lint at 220 kg",
            "Grade the bale by staple and colour",
          ],
          color: "#7C8B5B",
          inputs: [],
        },
      ],
    },

    // =====================================================================
    // OBJECT: Rattan Armchair
    // =====================================================================
    {
      id: "armchair",
      name: "Rattan Armchair",
      color: "#C9A97A",
      nodes: [
        {
          id: "armchair-01",
          name: "Rattan Armchair",
          echelon: 0,
          description:
            "A rattan armchair is a joined teak frame with hand-woven cane webbing for the back and seat, and a loose cotton cushion. The cane came from a palm; the frame from a tree; the cushion from a shrub.",
          specs: [
            { label: "Frame", value: "Teak", unit: "" },
            { label: "Webbing", value: "Cane, 6", unit: "mm" },
            { label: "Weight", value: "6", unit: "kg" },
            { label: "Load", value: "120", unit: "kg" },
          ],
          history:
            "Cane furniture spread through Europe after Portuguese traders shipped rattan from Southeast Asia in the 1650s; every conservatory chair since descends from that cargo.",
          process: [
            "Mortise and tenon the teak frame",
            "Steam-bend the arms and back rails",
            "Weave cane webbing into the frame",
            "Fit the loose cotton cushion",
          ],
          color: "#C9A97A",
          inputs: ["armchair-frame-01", "armchair-cane-01", "armchair-cushion-01"],
        },
        {
          id: "armchair-frame-01",
          name: "Teak Frame",
          echelon: 1,
          description:
            "The frame is kiln-dried teak, jointed with mortise and tenon and glued, never screwed. Teak carries its own oil, which is why outdoor cane furniture survives decades of rain without rotting its joints.",
          specs: [
            { label: "Density", value: "0.65", unit: "g/cm³" },
            { label: "Moisture", value: "10", unit: "%" },
            { label: "Joint", value: "Mortise & tenon", unit: "" },
          ],
          history:
            "Teak has held its reputation since shipwrights found it would outlast iron fastenings; the Admiralty built its fleets on Burmese teak in the age of sail.",
          process: [
            "Kiln-dry the sawn teak to 10%",
            "Cut mortises and shape tenons",
            "Glue, clamp and pin the frame",
            "Sand and oil the assembled frame",
          ],
          color: "#8A5A3B",
          inputs: ["armchair-mortiser-02", "armchair-teak-03"],
        },
        {
          id: "armchair-cane-01",
          name: "Cane Webbing",
          echelon: 1,
          description:
            "Cane webbing is rattan peeled, split to six-millimetre strands and woven open so a backrest breathes. It arrives as pre-woven panels that are stretched into rebate grooves and pegged with cane rattles.",
          specs: [
            { label: "Strand width", value: "6", unit: "mm" },
            { label: "Pattern", value: "Open octagonal", unit: "" },
            { label: "Tension", value: "Dry-fitted", unit: "" },
          ],
          history:
            "Before plastic mesh, cane webbing was the standard seat for everything from wheelchairs to opera boxes; caning a chair is a trade older than the factories that replaced it.",
          process: [
            "Peel and split rattan to strand",
            "Weave the panel on a frame",
            "Soak, stretch and peg into the rebate",
            "Let it dry drum-tight",
          ],
          color: "#D8BC8E",
          inputs: ["armchair-splitter-02", "armchair-peels-03"],
        },
        {
          id: "armchair-cushion-01",
          name: "Cotton Cushion",
          echelon: 1,
          description:
            "The cushion is combed cotton canvas filled with cotton wadding, buttoned so the filling cannot migrate. Cotton because it breathes against skin and takes the dye the rest of the room already wears.",
          specs: [
            { label: "Cover", value: "Cotton canvas", unit: "" },
            { label: "Fill", value: "Cotton wadding", unit: "" },
            { label: "Buttons", value: "4", unit: "" },
          ],
          history:
            "Loose cushions came west with cotton from India; the word itself is from quishion, the French for a stuffed case.",
          process: [
            "Weave and pre-shrink the canvas",
            "Cut and sew the ticking",
            "Fill with carded wadding",
            "Button through and close the seam",
          ],
          color: "#E5DDCB",
          inputs: ["armchair-rapier-02", "armchair-cotton-03"],
        },
        {
          id: "armchair-splitter-02",
          name: "Rattan Splitting Machine",
          echelon: 2,
          description:
            "A splitting machine takes whole rattan poles and runs them past a ring of blades that peel them into even strands in one pass. The round skin becomes rattan core; the inside becomes webbing strands.",
          specs: [
            { label: "Pole diameter", value: "12-25", unit: "mm" },
            { label: "Strands", value: "4-8", unit: "/pass" },
            { label: "Motor", value: "1.5", unit: "kW" },
          ],
          history:
            "Rattan splitting was hand work with a knife until machines appeared in Southeast Asian workshops early last century; the geometry of the blades still follows the knife.",
          process: [
            "Soak the poles until pliable",
            "Feed the pole through the blade ring",
            "Split to even strands",
            "Dry and grade the strands",
          ],
          color: "#7A8B87",
          inputs: ["armchair-peels-03"],
        },
        {
          id: "armchair-mortiser-02",
          name: "Chain Mortiser",
          echelon: 2,
          description:
            "A chain mortiser drives a rotating chain of chisels straight down into the frame member, cutting a clean rectangular mortise for a tenon. Furniture legs are hollowed by this one machine in every workshop that builds to last.",
          specs: [
            { label: "Chain", value: "Half-inch", unit: "" },
            { label: "Cut depth", value: "100", unit: "mm" },
            { label: "Cycle", value: "4", unit: "s" },
          ],
          history:
            "Mortise-and-tenon joints are older than written history; the chain mortiser simply replaced the man with the mallet, and kept the joint.",
          process: [
            "Clamp the frame member",
            "Plunge the chain into the marked face",
            "Clear the chips from the pocket",
            "Check the mortise against the tenon",
          ],
          color: "#77808A",
          inputs: ["armchair-teak-03"],
        },
        {
          id: "armchair-rapier-02",
          name: "Rapier Loom",
          echelon: 2,
          description:
            "A rapier loom carries the weft across the warp in a flying rapier tip, one thread at a time. It is how cotton canvas gets its tight even weave, at widths no hand loom reaches.",
          specs: [
            { label: "Weft insertion", value: "Rapier", unit: "" },
            { label: "Width", value: "1.9", unit: "m" },
            { label: "Speed", value: "600", unit: " picks/min" },
          ],
          history:
            "The rapier loom was commercialised in the 1950s, ending the shuttle's scream in textile halls and making wide canvas cheap enough for furniture.",
          process: [
            "Warp the loom and tie the ends",
            "Feed weft to the receiving rapier",
            "Beat the pick into the cloth fell",
            "Wind the cloth onto the take-up",
          ],
          color: "#808A94",
          inputs: ["armchair-cotton-03"],
        },
        {
          id: "armchair-peels-03",
          name: "Rattan Peels",
          echelon: 3,
          description:
            "Rattan peels are the outer skin of the rattan cane, split off the pole and dried. The same harvest makes garden canes, chair seats, walking sticks and the core reeds inside every piece of bent furniture.",
          specs: [
            { label: "Moisture after drying", value: "12", unit: "%" },
            { label: "Pole length", value: "4", unit: "m" },
            { label: "Skin hardness", value: "High", unit: "" },
          ],
          history:
            "Rattan trade from Southeast Asia reached Europe by 1605; within a century cane had replaced willow in nearly every chair seat it touched.",
          process: [
            "Harvest the climbing cane",
            "Soak and peel the skin",
            "Split into even strands",
            "Sun-dry and bundle by grade",
          ],
          color: "#B99668",
          inputs: ["armchair-grove-04"],
        },
        {
          id: "armchair-teak-03",
          name: "Teak Timber",
          echelon: 3,
          description:
            "Teak timber is sawn from plantation trees about thirty years old. Its grain carries silica and natural oils, which is why it dulls a saw blade and shrugs off weather in the same hour.",
          specs: [
            { label: "Log rotation", value: "30", unit: "yr" },
            { label: "Sawing", value: "Quarter-sawn", unit: "" },
            { label: "Durability class", value: "1", unit: "" },
          ],
          history:
            "Teak was so valued for ships that the British crown took over Burmese teak forests in 1856 to keep the navy supplied.",
          process: [
            "Fell and buck the plantation log",
            "Quarter-sawn for stable boards",
            "Kiln-dry to ten percent",
            "Grade and sticker the stock",
          ],
          color: "#8A5A3B",
          inputs: ["armchair-teakplant-04"],
        },
        {
          id: "armchair-cotton-03",
          name: "Combed Cotton Yarn",
          echelon: 3,
          description:
            "Combed cotton yarn is cotton drawn to an even twist after the short fibres are combed out, which is what lets canvas wear for decades without thinning at the seams.",
          specs: [
            { label: "Count", value: "Ne 20", unit: "" },
            { label: "Twist", value: "480", unit: "tpm" },
            { label: "Short fibre removed", value: "15", unit: "%" },
          ],
          history:
            "Combing cotton to remove short fibres was mechanised in Lancashire in the 1820s; the resulting yarn was strong enough for the first cotton sailcloth.",
          process: [
            "Card the ginned lint into sliver",
            "Comb out short fibres and neps",
            "Draw to an even strand",
            "Spin and wind onto tubes",
          ],
          color: "#D9CDB4",
          inputs: ["armchair-field-04"],
        },
        {
          id: "armchair-grove-04",
          name: "Rattan Grove",
          echelon: 4,
          description:
            "Rattan is a climbing palm that hauls itself up forest canopy on hooked tendrils. It is cut like a crop, not felled: the clump keeps growing, which makes it one of the few timbers that renews in years, not decades.",
          specs: [
            { label: "Growth", value: "Climbing palm", unit: "" },
            { label: "Harvest cycle", value: "7", unit: "yr" },
            { label: "Cane length", value: "100", unit: "m" },
          ],
          history:
            "Ninety percent of the world's rattan comes from Indonesian and Philippine forest, where it grows back fast enough to be worth protecting the forest for.",
          process: [
            "Follow the cane into the canopy",
            "Cut and field-strip the vine",
            "Drag canes to the river or road",
            "Sell by diameter and length",
          ],
          color: "#5F7350",
          inputs: [],
        },
        {
          id: "armchair-teakplant-04",
          name: "Teak Plantation",
          echelon: 4,
          description:
            "A teak plantation is a felled-and-replanted forest, thinned on a thirty-year cycle. The trees stand in rows like any crop, but they take a human career to reach sawlog size.",
          specs: [
            { label: "Rotation", value: "30", unit: "yr" },
            { label: "Spacing", value: "3", unit: "m" },
            { label: "Share of supply", value: "90", unit: "%" },
          ],
          history:
            "Most teak now comes from plantations in Java and Latin America; natural teak forest has shrunk to fragments of what the shipwrights logged.",
          process: [
            "Clear, plant, and stake the seedlings",
            "Thin at year ten",
            "Prune for clear boles",
            "Fell and replant at year thirty",
          ],
          color: "#6E7A52",
          inputs: [],
        },
        {
          id: "armchair-field-04",
          name: "Cotton Field",
          echelon: 4,
          description:
            "Cotton is a shrub that grows bolls of seed-borne fibre. Roughly a third of the harvested weight of the boll is lint; the rest is seed and burr, split off at the gin hours after picking.",
          specs: [
            { label: "Lint share", value: "33", unit: "%" },
            { label: "Fibre length", value: "28", unit: "mm" },
            { label: "Lint yield", value: "1", unit: "t/ha" },
          ],
          history:
            "Cotton has been spun for at least seven thousand years; the cotton gin of 1793 made it profitable to grow anywhere in the American south.",
          process: [
            "Pick the open bolls from the shrub",
            "Gin to separate lint from seed",
            "Bale the lint at 220 kg",
            "Grade the bale by staple and colour",
          ],
          color: "#7C8B5B",
          inputs: [],
        },
      ],
    },
  ],
};