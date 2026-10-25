window.CONTENT = {
  chains: [
    // =====================================================================
    // OBJECT: Mechanical Keyboard
    // Echelon 0: object -> 1: components -> 2: machines -> 3: raw materials -> 4: sources
    // =====================================================================
    {
      id: "keyboard",
      name: "Mechanical Keyboard",
      color: "#181410",
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
          color: "#181410",
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
          color: "#e0472b",
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
          color: "#181410",
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
          color: "#181410",
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
          color: "#5b7f96",
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
          color: "#5b7f96",
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
          color: "#5b7f96",
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
          color: "#e0472b",
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
          color: "#181410",
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
          color: "#181410",
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
          color: "#181410",
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
          color: "#a49e92",
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
          color: "#b93a1d",
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
      color: "#181410",
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
          color: "#181410",
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
          color: "#181410",
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
          color: "#181410",
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
          color: "#181410",
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
          color: "#5b7f96",
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
          color: "#5b7f96",
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
            "Wafios has built spring-coiling machinery in Reutlingen, Germany since 1914, and its first electronically controlled coiler of 1978 still defines the trade.",
          process: [
            "Feed music wire from spool into straightening rollers",
            "Coil wire around mandrel to programmed pitch",
            "Cut spring to length and form end hooks",
            "Stress-relieve spring in oven at 450 °C",
          ],
          color: "#5b7f96",
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
          color: "#181410",
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
          color: "#181410",
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
          color: "#181410",
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
          color: "#181410",
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
          color: "#b93a1d",
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
          color: "#181410",
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
          color: "#181410",
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
      color: "#181410",
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
            "Thomas Jefferson is credited with the first swivel chair: a Windsor he fitted with iron casters and a spindle while drafting the Declaration.",
          process: [
            "Assemble mesh back, seat foam, and mechanism",
            "Attach five-star base and gas lift cylinder",
            "Fit dual-wheel casters and armrests",
            "Load-test to BIFMA seating durability standard",
          ],
          color: "#181410",
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
          color: "#7d9a5e",
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
          color: "#181410",
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
            "The Aluminum Group office chair of 1958 put a cast-aluminum swivel base under office workers; gas-assist molding was commercialized in the 1970s for hollow parts.",
          process: [
            "Inject PA66 GF30 at 280 °C into five-star mold",
            "Introduce nitrogen gas to hollow out thick sections",
            "Cool and eject base with center bore for gas lift",
            "Deflash and load-test to BIFMA standard",
          ],
          color: "#181410",
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
          color: "#181410",
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
          color: "#5b7f96",
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
          color: "#5b7f96",
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
          color: "#5b7f96",
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
          color: "#e0472b",
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
          color: "#181410",
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
          color: "#e0472b",
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
          color: "#181410",
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
          color: "#181410",
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
      color: "#181410",
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
          color: "#5c564c",
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
          color: "#5c564c",
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
          color: "#e0472b",
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
          color: "#5b7f96",
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
          color: "#5b7f96",
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
          color: "#a49e92",
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
          color: "#a49e92",
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
          color: "#a49e92",
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
          color: "#a49e92",
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
      color: "#181410",
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
          color: "#181410",
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
          color: "#181410",
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
          color: "#181410",
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
          color: "#181410",
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
          color: "#5b7f96",
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
          color: "#5b7f96",
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
          color: "#181410",
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
          color: "#181410",
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
          color: "#181410",
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
      color: "#181410",
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
          color: "#a49e92",
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
          color: "#a49e92",
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
            "Extrusion pressing was patented by Joseph Bramah in 1797 for lead pipe, and aluminum extrusion for windows spread after World War II.",
          process: [
            "Preheat 6063-T5 billet to 450-500 °C",
            "Extrude through hollow window-profile die",
            "Quench, stretch, and age to T5 temper",
            "Cut, drill, and anodize frame members",
          ],
          color: "#181410",
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
          color: "#5b7f96",
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
            "Extrusion pressing was patented by Joseph Bramah in 1797 for lead pipe, and aluminum extrusion for windows spread after World War II.",
          process: [
            "Preheat billet in induction furnace",
            "Ram billet through extrusion die",
            "Quench profile on run-out table",
            "Stretch and artificially age to T5",
          ],
          color: "#5b7f96",
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
          color: "#a49e92",
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
          color: "#181410",
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
          color: "#a49e92",
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
          color: "#b93a1d",
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
      color: "#181410",
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
          color: "#5c564c",
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
          color: "#a49e92",
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
          color: "#7d9a5e",
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
          color: "#5b7f96",
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
          color: "#a49e92",
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
          color: "#e0a52f",
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
          color: "#7d9a5e",
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
          color: "#181410",
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
      color: "#181410",
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
            "Philip Diehl adapted his sewing-machine motor into a ceiling fan in New Jersey in the late 1880s, a few years after the first electric fans went on sale.",
          process: [
            "Stamp and pitch five steel blades",
            "Wind, connect and varnish the stator",
            "Die-cast the aluminum rotor and shaft",
            "Assemble, balance and burn-in under test",
          ],
          color: "#181410",
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
          color: "#181410",
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
          color: "#181410",
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
          color: "#181410",
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
          color: "#5b7f96",
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
          color: "#5b7f96",
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
            "By the 1920s wire enamel had largely replaced wound cotton and silk insulation, doubling the copper that fits in a motor.",
          process: [
            "Draw copper rod through diamond dies",
            "Anneal soft again at 450 °C",
            "Bake on enamel in successive passes",
            "Spark-test every meter before spooling",
          ],
          color: "#e0a52f",
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
          color: "#181410",
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
          color: "#e0a52f",
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
            "Magnetite mining at Kiruna, Sweden has moved a billion tonnes of ore since 1900, most of it to steel mills.",
          process: [
            "Drill and blast benches in the ore zone",
            "Load ore with 400-ton haul trucks",
            "Crush, screen and stockpile at the mine",
            "Rail to the steel mill blast furnace",
          ],
          color: "#181410",
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
      color: "#181410",
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
            "Paraffin wax was first isolated in 1830, from wood tar; James Young made it commercial out of Scottish coal and shale in the 1850s.",
          process: [
            "Dewax lube oil and filter the wax fraction",
            "Cast paraffin around a sized cotton wick",
            "Blow the glass chimney and seat base to base",
            "Light it: the flame melts a pool, the pool feeds the wick",
          ],
          color: "#e0a52f",
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
            "Until the 1850s candles were rendered from animal fat; paraffin burned cleaner, whiter and cheaper, and swept the market.",
          process: [
            "Solvent-dewax lube oil to separate wax",
            "Filter and hydrofinish until white",
            "Cast into blocks, then pillar molds",
            "Age the cast so crystals settle uniform",
          ],
          color: "#e0a52f",
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
          color: "#a49e92",
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
            "Braided wicks replaced twisted ones from the 1820s; the plait curls its burnt tip into the flame, trims itself and keeps the candle from smoking.",
          process: [
            "Spin cotton to fine yarn",
            "Braid three plies at a fixed angle",
            "Size in starch and cut to length",
            "Prime the tip with wax before packing",
          ],
          color: "#7d9a5e",
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
          color: "#5b7f96",
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
          color: "#5b7f96",
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
            "James Young's paraffin works at Bathgate sold Scotland's coal-to-candle wax from the 1850s; within thirty years whalers were out of the candle trade.",
          process: [
            "Chill and crystallize the dewaxed oil",
            "Filter the wax cake free of oil",
            "Bleach and filter until white",
            "Grade by melting point for casting",
          ],
          color: "#e0a52f",
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
          color: "#a49e92",
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
            "Josué Heilmann patented the first cotton-combing machine in 1845; combing out short fibres is what lets fine, strong yarns exist.",
          process: [
            "Card the ginned lint into sliver",
            "Comb out short fibres and neps",
            "Draw to an even strand",
            "Spin and wind onto tubes",
          ],
          color: "#7d9a5e",
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
          color: "#a49e92",
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
          color: "#181410",
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
          color: "#7d9a5e",
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
      color: "#181410",
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
            "Cane furniture spread through Europe after Portuguese traders shipped rattan from Southeast Asia in the seventeenth century; every conservatory chair since descends from that cargo.",
          process: [
            "Mortise and tenon the teak frame",
            "Steam-bend the arms and back rails",
            "Weave cane webbing into the frame",
            "Fit the loose cotton cushion",
          ],
          color: "#5c564c",
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
            "Teak has held its reputation since shipwrights found it shrugged off rot and sea water; the Admiralty built its fleets on Burmese teak.",
          process: [
            "Kiln-dry the sawn teak to 10%",
            "Cut mortises and shape tenons",
            "Glue, clamp and pin the frame",
            "Sand and oil the assembled frame",
          ],
          color: "#5c564c",
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
          color: "#7d9a5e",
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
            "Loose cushions came west with cotton from India; the word itself arrived through Old French, coissin, a stuffed case.",
          process: [
            "Weave and pre-shrink the canvas",
            "Cut and sew the ticking",
            "Fill with carded wadding",
            "Button through and close the seam",
          ],
          color: "#7d9a5e",
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
          color: "#5b7f96",
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
          color: "#5b7f96",
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
          color: "#5b7f96",
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
            "Rattan from Southeast Asia reached Europe in the seventeenth century; within a hundred years cane had replaced willow in nearly every chair seat.",
          process: [
            "Harvest the climbing cane",
            "Soak and peel the skin",
            "Split into even strands",
            "Sun-dry and bundle by grade",
          ],
          color: "#7d9a5e",
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
          color: "#5c564c",
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
            "Josué Heilmann patented the first cotton-combing machine in 1845; combing out short fibres is what lets fine, strong yarns exist.",
          process: [
            "Card the ginned lint into sliver",
            "Comb out short fibres and neps",
            "Draw to an even strand",
            "Spin and wind onto tubes",
          ],
          color: "#7d9a5e",
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
          color: "#7d9a5e",
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
          color: "#7d9a5e",
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
          color: "#7d9a5e",
          inputs: [],
        },
      ],
    },

    // =====================================================================
    // OBJECT: Insulated Steel Bottle (the TikTok-era 40 oz vacuum tumbler)
    // Echelon 0: object -> 1: components -> 2: machines -> 3: raw materials -> 4: sources
    // =====================================================================
    {
      id: "insulated-bottle",
      name: "Insulated Steel Bottle",
      color: "#181410",
      nodes: [
        {
          id: "insulated-bottle-01",
          name: "Insulated Steel Bottle",
          echelon: 0,
          description:
            "A double-wall vacuum vessel: two 304 stainless shells drawn from steel coil, welded neck to neck and evacuated so the gap conducts next to nothing. Forty ounces that keep ice for a day on a hot beach and steam quietly on a cold morning.",
          specs: [
            { label: "Volume", value: "1180", unit: "ml" },
            { label: "Ice retention", value: "24", unit: "h" },
            { label: "Heat retention", value: "12", unit: "h" },
            { label: "Mass", value: "0.55", unit: "kg" },
          ],
          history:
            "The 2020s' 40-ounce tumbler wave revived a 1913 design — and 'TikTok made me buy it' became a real retail channel.",
          process: [
            "Draw two steel shells on a press",
            "Weld, neck and evacuate the vessel",
            "Mold and fit the PP lid",
            "Leak-test every bottle under water",
          ],
          color: "#181410",
          inputs: [
            "insulated-bottle-shell-01",
            "insulated-bottle-lid-01",
            "insulated-bottle-boot-01",
          ],
        },
        {
          id: "insulated-bottle-shell-01",
          name: "Double-Wall Steel Shell",
          echelon: 1,
          description:
            "Two drawn 304 cups become one wall: they are necked together and laser-welded at a vacuum port, then the few-millimetre gap is pumped to a trace of air and pinched shut. The vacuum does the insulating; the steel only holds it.",
          specs: [
            { label: "Wall gauge", value: "0.5", unit: "mm" },
            { label: "Vacuum gap", value: "3", unit: "mm" },
            { label: "Liner coating", value: "Copper", unit: "" },
            { label: "Construction", value: "Two drawn cups", unit: "" },
          ],
          history:
            "Dewar never patented his 1892 vacuum flask — commercial versions were patented by others, and he lost the later court case over it.",
          process: [
            "Deep-draw two cups from 304 coil",
            "Neck the rims and align the walls",
            "Laser-weld the seam and vacuum port",
            "Pull a vacuum, then pinch the port shut",
          ],
          color: "#181410",
          inputs: ["insulated-bottle-vacuum-02"],
        },
        {
          id: "insulated-bottle-lid-01",
          name: "PP Straw Lid",
          echelon: 1,
          description:
            "The lid that sold the trend is plain polypropylene: a screw cap, a hinged spout and a floating straw ball that drinks from any angle the bottle is tipped. Three moldings snap together with one silicone seal ring, all dishwasher-safe.",
          specs: [
            { label: "Body", value: "Polypropylene", unit: "" },
            { label: "Straw", value: "Two-way valve", unit: "" },
            { label: "Seal", value: "One silicone ring", unit: "" },
            { label: "Dishwasher", value: "Top rack", unit: "" },
          ],
          history:
            "Straw lids carried the trend: Stanley's yearly sales ran from $73 million in 2019 to $750 million in 2023, almost all 40-ounce tumblers.",
          process: [
            "Injection-mold the PP body and cap",
            "Mold the silicone seal ring",
            "Snap in the floating straw ball",
            "Cycle-test the hinge and threads",
          ],
          color: "#e0472b",
          inputs: ["insulated-bottle-injpress-02"],
        },
        {
          id: "insulated-bottle-boot-01",
          name: "Silicone Boot",
          echelon: 1,
          description:
            "A soft silicone bumper stretched onto the base: it takes the desk drops, keeps the steel from ringing on tile, and survives dishwasher after dishwasher. It is the part that lets a viral bottle be used, not just displayed.",
          specs: [
            { label: "Material", value: "LSR silicone", unit: "" },
            { label: "Hardness", value: "35", unit: "Shore A" },
            { label: "Heat resistance", value: "200", unit: "°C" },
            { label: "Fit", value: "Shrink, no glue", unit: "" },
          ],
          history:
            "Silicone rubber began as a paste protecting airplane ignition parts in the 1940s; the same inertness now takes dishwasher heat.",
          process: [
            "Mill the silicone gum with platinum cure",
            "Injection-mold on a warm tool",
            "Stretch-fit it over the base",
            "Drop- and dishwasher-cycle test",
          ],
          color: "#e0472b",
          inputs: ["insulated-bottle-injpress-02", "insulated-bottle-silicone-03"],
        },
        {
          id: "insulated-bottle-press-02",
          name: "Deep-Drawing Press",
          echelon: 2,
          description:
            "A mechanical press with a blank holder draws flat 304 sheet into a cup in one stroke; a redraw press takes it the rest of the way to vessel height. The metal flows, thins by about ten percent, and work-hardens exactly where the wall needs it.",
          specs: [
            { label: "Press force", value: "320", unit: "t" },
            { label: "Redraw passes", value: "2", unit: "" },
            { label: "Stroke rate", value: "30", unit: "/min" },
            { label: "Wall thinning", value: "10", unit: "%" },
          ],
          history:
            "E. W. Bliss built double-action drawing presses in Brooklyn from 1867; brass cartridge caps were the trade's first mass run.",
          process: [
            "Cut a blank from the steel coil",
            "Clamp it under the blank holder",
            "Draw the cup, then redraw it taller",
            "Pass the shell to trim and anneal",
          ],
          color: "#5b7f96",
          inputs: ["insulated-bottle-coil-03"],
        },
        {
          id: "insulated-bottle-injpress-02",
          name: "Injection Molding Press",
          echelon: 2,
          description:
            "The same machine class that molds ABS keycaps molds the PP lid and the silicone boot: a hydraulic clamp shuts a tool-steel mold at 80 tons and injects 220 °C polymer at over 1000 bar, running 30-second cycles of injection, packing, cooling and ejection.",
          specs: [
            { label: "Clamp force", value: "80", unit: "tons" },
            { label: "Melt temperature", value: "220", unit: "°C" },
            { label: "Cycle time", value: "30", unit: "s" },
            { label: "Cavities", value: "2", unit: "" },
          ],
          history:
            "John Wesley Hyatt patented the first injection molding machine in 1872, for celluloid billiard balls as an ivory substitute.",
          process: [
            "Clamp the tool-steel mold shut",
            "Inject 220 °C polymer into cavities",
            "Pack and cool for 25 seconds",
            "Eject the part onto the conveyor",
          ],
          color: "#5b7f96",
          inputs: ["insulated-bottle-pp-03"],
        },
        {
          id: "insulated-bottle-vacuum-02",
          name: "Vacuum-Seal Line",
          echelon: 2,
          description:
            "The line where the tumbler gets its trick: drawn shells are necked together, laser-welded around a straw-thin vacuum port, evacuated through it, and the port is pinched and soldered shut. Every bottle is leak-checked, because one hairline crack ends the vacuum and the product.",
          specs: [
            { label: "Gap size", value: "3", unit: "mm" },
            { label: "Weld", value: "Laser, one pass", unit: "" },
            { label: "Leak test", value: "100", unit: "%" },
            { label: "Residual air", value: "A trace", unit: "" },
          ],
          history:
            "The 1913 Thermos already used a vacuum gap; only the pump-down time has shrunk since.",
          process: [
            "Neck inner and outer shells together",
            "Laser-weld the seam with a port",
            "Evacuate the gap to a near vacuum",
            "Pinch and seal the port shut",
          ],
          color: "#5b7f96",
          inputs: ["insulated-bottle-press-02"],
        },
        {
          id: "insulated-bottle-coil-03",
          name: "304 Steel Coil",
          echelon: 3,
          description:
            "18/8 stainless — eighteen percent chromium, eight percent nickel — rolled to half a millimetre and annealed. The chromium grabs oxygen at the surface and grows a self-healing oxide film, which is why the inside of the bottle never rusts from ice.",
          specs: [
            { label: "Chromium", value: "18", unit: "%" },
            { label: "Nickel", value: "8", unit: "%" },
            { label: "Gauge", value: "0.5", unit: "mm" },
            { label: "Finish", value: "2B mill", unit: "" },
          ],
          history:
            "Harry Brearley added chromium to iron in 1913 while chasing rifle-barrel steel; cutlery took the first prize.",
          process: [
            "Melt iron with chromium and nickel",
            "Continuous-cast and hot-roll to strip",
            "Cold-roll to half a millimetre",
            "Anneal, pickle and slit to coils",
          ],
          color: "#181410",
          inputs: ["insulated-bottle-ironmine-04"],
        },
        {
          id: "insulated-bottle-pp-03",
          name: "Polypropylene Pellets",
          echelon: 3,
          description:
            "Polypropylene is propylene chained into a thermoplastic that shrugs off solvents, folds a living hinge ten thousand times, and survives the dishwasher. Dried, colored food-safe and delivered as pellets to the molding press.",
          specs: [
            { label: "Molding temp", value: "220", unit: "°C" },
            { label: "Melt point", value: "165", unit: "°C" },
            { label: "Density", value: "0.90", unit: "g/cm³" },
            { label: "Type", value: "Homopolymer", unit: "" },
          ],
          history:
            "Propylene went from unwanted refinery gas to the world's second-largest plastic once Ziegler-Natta catalysts worked in 1954.",
          process: [
            "Crack naphtha into propylene feedstock",
            "Chain propylene with Ziegler-Natta catalyst",
            "Pelletize, dry and color the resin",
            "Load the molding press hopper",
          ],
          color: "#e0472b",
          inputs: ["insulated-bottle-oil-04"],
        },
        {
          id: "insulated-bottle-silicone-03",
          name: "Silicone Rubber Compound",
          echelon: 3,
          description:
            "Silicone starts as quartz: sand smelted into silicon at 2,000 °C opens into a silicon-oxygen backbone with methyl groups attached. It takes dishwasher heat and freezer mornings without complaint, and it grips without glue.",
          specs: [
            { label: "From", value: "Quartz sand", unit: "" },
            { label: "Cure", value: "Platinum", unit: "" },
            { label: "Elongation", value: "500", unit: "%" },
            { label: "Shore hardness", value: "35", unit: "A" },
          ],
          history:
            "Eugene Rochow reacted methyl chloride with silicon at General Electric in 1940 — nine tenths of all silicone still follows that route.",
          process: [
            "Smelt quartz into silicon metal",
            "React silicon with methyl chloride over copper",
            "Polymerize the siloxane backbone",
            "Add filler, catalyst and mill to gum",
          ],
          color: "#e0472b",
          inputs: ["insulated-bottle-sand-04"],
        },
        {
          id: "insulated-bottle-ironmine-04",
          name: "Iron Ore Mine",
          echelon: 4,
          description:
            "Banded iron formations blasted from an open pit that deepens year by year: hauled, crushed, beneficiated and pelletized at about sixty-two percent metal. Every gram of steel in the tumbler above was once loose rock like this.",
          specs: [
            { label: "Iron content", value: "62", unit: "%" },
            { label: "Silica content", value: "4", unit: "%" },
            { label: "Strip ratio", value: "2.5", unit: "w:o" },
            { label: "Transport", value: "Rail to mill", unit: "" },
          ],
          history:
            "Lake Superior's Mesabi Range ran the American steel age; its open pits still load trains this morning.",
          process: [
            "Drill and blast the iron formation",
            "Load ore into the haul trucks",
            "Crush, screen and concentrate",
            "Pelletize and rail to the steelworks",
          ],
          color: "#181410",
          inputs: [],
        },
        {
          id: "insulated-bottle-oil-04",
          name: "Crude Oil Well",
          echelon: 4,
          description:
            "Crude oil is drilled, not made: rotary rigs reach buried marine sediments, casing and cement keep the borehole alive, and distillation takes the light naphtha fraction off first. The propylene that becomes the lid's polypropylene starts down here.",
          specs: [
            { label: "Drilling depth", value: "3000", unit: "m" },
            { label: "Flow rate", value: "500", unit: "bbl/day" },
            { label: "API gravity", value: "35", unit: "°API" },
            { label: "Sulfur content", value: "0.5", unit: "%" },
          ],
          history:
            "Edwin Drake's Titusville well of 1859 launched the industry; modern wells only drill deeper and steer sideways.",
          process: [
            "Survey to find the hydrocarbon trap",
            "Drill and case the wellbore",
            "Cement the casing to isolate layers",
            "Pump the crude and associated gas",
          ],
          color: "#181410",
          inputs: [],
        },
        {
          id: "insulated-bottle-sand-04",
          name: "Silica Sand Quarry",
          echelon: 4,
          description:
            "Quartz sandstone is blasted at the face, washed, screened and magnetic-separated until less than a hundredth of a percent iron survives — the tint that would ruin glass. From this same sand, smelted to silicon metal, the silicone boot above begins.",
          specs: [
            { label: "Silica content", value: "98", unit: "%" },
            { label: "Iron oxide", value: "0.03", unit: "%" },
            { label: "Grain size", value: "0.3", unit: "mm" },
            { label: "Moisture", value: "0.5", unit: "%" },
          ],
          history:
            "Sand has been the main ingredient of glass since the first furnaces in Egypt and Mesopotamia, thousands of years ago.",
          process: [
            "Drill and blast the sandstone face",
            "Load and haul to the wash plant",
            "Wash, screen and magnetic-separate",
            "Dry and ship to glass and silicon plants",
          ],
          color: "#a49e92",
          inputs: [],
        },
      ],
    },

// =====================================================================
    // OBJECT: Wireless Earbuds (true wireless pair + charging case)
    // Echelon 0: object -> 1: components -> 2: machines -> 3: raw materials -> 4: sources
    // =====================================================================
    {
      id: "wireless-earbuds",
      name: "Wireless Earbuds",
      color: "#181410",
      nodes: [
        {
          id: "wireless-earbuds-01",
          name: "Wireless Earbuds",
          echelon: 0,
          description:
            "A pair of true-wireless earbuds is two independent computers: each carries a Bluetooth radio, a codec that compresses then rebuilds the audio, a micro loudspeaker motor with a neodymium magnet, microphones for calls and noise cancelling, and a button-cell lithium battery, all inside an injection-molded shell that a charging case tops up when the pair docks.",
          specs: [
            { label: "Per-ear cell", value: "Class ≈50", unit: "mAh" },
            { label: "Radio", value: "Bluetooth 5-class", unit: "" },
            { label: "Driver", value: "8-13", unit: "mm dynamic" },
            { label: "Run time", value: "5-7", unit: "h per charge" },
          ],
          history:
            "Apple shipped AirPods in 2016 and the category grew around them; the parts inside go back further: Bluetooth from a 1998 industry consortium, commercial lithium cells from 1991, sintered neodymium magnets from 1984.",
          process: [
            "Assemble driver, radio board, battery and antenna into the shell",
            "Pair, acoustic-tune and leak-test each earbud",
            "Foreign-object and charge-cycle test in the case",
            "Pack with cable, spare tips and case",
          ],
          color: "#181410",
          inputs: [
            "wireless-earbuds-driver-01",
            "wireless-earbuds-cell-01",
            "wireless-earbuds-shell-01",
          ],
        },
        {
          id: "wireless-earbuds-driver-01",
          name: "Micro Loudspeaker Driver",
          echelon: 1,
          description:
            "The driver is a miniature loudspeaker motor: an 8-13 mm cone glued to a tiny voice coil that sits in the gap of a neodymium ring magnet. Current through the coil pushes and pulls the cone against the magnet field thousands of times a second, which is the sound.",
          specs: [
            { label: "Cone", value: "8-13", unit: "mm" },
            { label: "Magnet", value: "Sintered NdFeB", unit: "" },
            { label: "Voice coil", value: "Enameled copper", unit: "" },
            { label: "Tuned with", value: "Semi-open mesh", unit: "" },
          ],
          history:
            "Every dynamic driver descends from the 1925 cone loudspeakers of Rice and Kellogg; miniaturizing theirs is what put a full-range speaker inside an ear.",
          process: [
            "Assemble the magnet ring into the yoke",
            "Wind and center the voice coil in the gap",
            "Glue the cone and surround to the frame",
            "Frequency-sweep test before the shell seals it",
          ],
          color: "#e0472b",
          inputs: ["wireless-earbuds-coiler-02", "wireless-earbuds-magnets-03"],
        },
        {
          id: "wireless-earbuds-cell-01",
          name: "Button-Cell Lithium Battery",
          echelon: 1,
          description:
            "Each earbud carries a small lithium battery, and the case carries its own larger one: the dynamics are the same as every lithium cell since 1991 - an intercalating carbon anode, a metal-oxide cathode, and lithium ions that shuttle back and forth between them across hundreds of charge cycles.",
          specs: [
            { label: "Chemistry", value: "Lithium-ion", unit: "" },
            { label: "Nominal voltage", value: "3.7-3.85", unit: "V" },
            { label: "Shape", value: "Pouch / button", unit: "" },
            { label: "Cycles", value: "300-500", unit: "typical" },
          ],
          history:
            "John Goodenough, Akira Yoshino and colleagues built the first practical rechargeable lithium cell, commercialized by Sony in 1991; all three shared the 2019 Nobel Prize for it.",
          process: [
            "Coat metal-oxide cathode and carbon anode foils",
            "Stack or wind layers with separator paper",
            "Fill with electrolyte and seal the pouch",
            "Format and cycle-test every cell",
          ],
          color: "#e0472b",
          inputs: ["wireless-earbuds-stacking-02", "wireless-earbuds-lithium-03"],
        },
        {
          id: "wireless-earbuds-shell-01",
          name: "Acoustic Housing",
          echelon: 1,
          description:
            "The housing is a two-part injection-molded shell that closes around everything else: driver, board, battery, antenna, microphone ports and the acoustic vents that tune how much outside sound leaks in. A silicone tip seals the whole assembly against the ear canal.",
          specs: [
            { label: "Material", value: "PC / ABS blend", unit: "" },
            { label: "Molded in", value: "Two-part shells", unit: "" },
            { label: "Tip", value: "Silicone, 3 sizes", unit: "" },
            { label: "Finish", value: "Matte, gloss nose", unit: "" },
          ],
          history:
            "Molding a shell this small with acoustic ports that actually tune sound became practical only with high-precision multi-cavity tooling of the 2010s.",
          process: [
            "Mold shell halves in a two-cavity tool",
            "Insert the driver, board and battery",
            "Ultrasonically weld or glue the halves shut",
            "Fit the silicone tip and mesh screens",
          ],
          color: "#e0472b",
          inputs: ["wireless-earbuds-inj-02", "wireless-earbuds-pellets-03"],
        },
        {
          id: "wireless-earbuds-coiler-02",
          name: "Voice-Coil Winder",
          echelon: 2,
          description:
            "A dedicated winder spins a few hundred turns of hair-thin enameled copper around the coil former at constant tension, then cuts and terminates the leads. The conductor is thinner than the adult hair it replaces in full-size speakers.",
          specs: [
            { label: "Wire", value: "≈0.03-0.05", unit: "mm" },
            { label: "Turns", value: "Dozens-hundreds", unit: "" },
            { label: "Tension", value: "Servo-controlled", unit: "" },
            { label: "Rate", value: "Seconds per coil", unit: "" },
          ],
          history:
            "Coil winders mechanized in the 1920s to mass-produce loudspeaker and radio coils; the same class of machine, scaled down, winds earbud voice coils today.",
          process: [
            "Load the former onto the spindle",
            "Wind the turn count under constant tension",
            "Cut, strip and terminate the leads",
            "Microscope-inspect the winding crest",
          ],
          color: "#5b7f96",
          inputs: ["wireless-earbuds-magwire-03"],
        },
        {
          id: "wireless-earbuds-stacking-02",
          name: "Cell Stacking Line",
          echelon: 2,
          description:
            "Pouch cells are built on a stacking line: cathode sheets, separator and anode sheets are laid alternately, tab-welded, folded into a flat stack, dried, soaked in electrolyte under vacuum and sealed into the aluminum-laminate pouch.",
          specs: [
            { label: "Environment", value: "Dry room", unit: "" },
            { label: "Filling", value: "Vacuum soak", unit: "" },
            { label: "Seal", value: "Heat + pressure", unit: "" },
            { label: "Checked", value: "Every cell", unit: "" },
          ],
          history:
            "Stacked-pouch cells came out of the 1990s consumer-electronics boom, when phone makers needed flat batteries shaped to fit the case instead of cylindrical cans.",
          process: [
            "Stack cathode, separator, anode sheets",
            "Weld tabs and fold the stack",
            "Vacuum-fill with electrolyte in a dry room",
            "Heat-seal the pouch and age-test",
          ],
          color: "#5b7f96",
          inputs: ["wireless-earbuds-lithium-03"],
        },
        {
          id: "wireless-earbuds-inj-02",
          name: "Injection Molding Press",
          echelon: 2,
          description:
            "The same machine class that molds keycaps molds earbud housings: a clamp shuts a hard steel mold at tens of tons, injects molten polymer into cavities smaller than a fingernail, packs it, cools it and ejects finished shells every few seconds.",
          specs: [
            { label: "Clamp force", value: "30-80", unit: "tons" },
            { label: "Melt temp", value: "200-240", unit: "°C" },
            { label: "Cycle", value: "10-30", unit: "s" },
            { label: "Cavities", value: "2-8", unit: "" },
          ],
          history:
            "John Wesley Hyatt patented the first injection molding machine in 1872 as a way to mold celluloid, an ivory substitute for billiard balls.",
          process: [
            "Dry the resin pellets before molding",
            "Clamp the mold and inject the melt",
            "Pack, hold, cool and eject the shells",
            "Sort visually and ultrasonic-weld pairs",
          ],
          color: "#5b7f96",
          inputs: ["wireless-earbuds-pellets-03"],
        },
        {
          id: "wireless-earbuds-magnets-03",
          name: "Sintered NdFeB Magnet",
          echelon: 3,
          description:
            "Neodymium-iron-boron magnets are sintered like porcelain: rare-earth alloy powder is pressed in a magnetic field, baked below melting until the grains fuse, then cut and magnetized. Gram for gram it is the strongest permanent-magnet material anyone sells.",
          specs: [
            { label: "Composition", value: "Nd-Fe-B", unit: "" },
            { label: "Invented", value: "1984", unit: "" },
            { label: "Grades", value: "N35-N52", unit: "" },
            { label: "Energy product", value: "Up to ~50", unit: "MGOe" },
          ],
          history:
            "Masato Sagawa and colleagues at Sumitomo announced neodymium magnets in 1984, roughly doubling the strength ceiling of the best magnets then in production.",
          process: [
            "Melt the alloy under argon",
            "Mill to a fine powder in an inert mill",
            "Press the powder while magnetically aligned",
            "Sinter, cut, coat, then magnetize",
          ],
          color: "#e0a52f",
          inputs: ["wireless-earbuds-mine-04", "wireless-earbuds-ironore-04"],
        },
        {
          id: "wireless-earbuds-magwire-03",
          name: "Enameled Copper Wire",
          echelon: 3,
          description:
            "Voice-coil wire starts as electrolytic copper drawn beyond hair thickness and baked thin in enamel so thousands of adjacent turns can sit side by side without letting current jump.",
          specs: [
            { label: "Diameter", value: "0.03-0.05", unit: "mm" },
            { label: "Conductor", value: "99.99", unit: "% Cu" },
            { label: "Insulation", value: "Enamel layers", unit: "" },
            { label: "Breakdown", value: "kV-class", unit: "" },
          ],
          history:
            "The same enameled wire technology that wraps ceiling-fan motors in the 1920s is drawn thinner and thinner toward earbud scales today.",
          process: [
            "Draw copper rod through diamond dies",
            "Anneal soft again after drawing",
            "Bake on enamel in successive passes",
            "Spark-test every meter before spooling",
          ],
          color: "#e0a52f",
          inputs: ["wireless-earbuds-coppermine-04"],
        },
        {
          id: "wireless-earbuds-lithium-03",
          name: "Lithium Compounds",
          echelon: 3,
          description:
            "Battery-grade lithium arrives as lithium carbonate or hydroxide - a white industrial salt - refined far enough that metallic contaminants are tracked in parts per million, because a stray iron particle can short a micro-thin separator.",
          specs: [
            { label: "Form", value: "Li2CO3 / LiOH", unit: "" },
            { label: "Purity", value: "99.5", unit: "% battery grade" },
            { label: "Contaminants", value: "Tracked in ppm", unit: "" },
            { label: "From", value: "Brine or spodumene", unit: "" },
          ],
          history:
            "Battery-grade lithium refining scaled with the laptop boom of the 1990s and then the smartphone decade; every earbud cell is fed from the same salt.",
          process: [
            "Extract lithium from brine or ore",
            "Concentrate and precipitate the salts",
            "Refine to battery-grade purity",
            "Bag, lab-check and ship dry",
          ],
          color: "#e0a52f",
          inputs: ["wireless-earbuds-saltlake-04"],
        },
        {
          id: "wireless-earbuds-pellets-03",
          name: "PC / ABS Pellets",
          echelon: 3,
          description:
            "The housing resin is a blend: polycarbonate for stiffness and toughness, ABS for gloss and cost. It arrives at the molder as small dried pellets, colored, so every shell in a run matches.",
          specs: [
            { label: "Blend", value: "PC + ABS", unit: "" },
            { label: "Dried before molding", value: "80-100", unit: "°C" },
            { label: "Pellet size", value: "2-4", unit: "mm" },
            { label: "Pellet spec", value: "Color-matched", unit: "" },
          ],
          history:
            "ABS grew out of the 1950s rubber-modified plastics of Marbon; polycarbonate arrived from GE's Dan Fox in 1955.",
          process: [
            "Compound the PC and ABS in an extruder",
            "Pelletize, dry and package the resin",
            "Color to the customer's swatch",
            "Ship to molding shops in sealed bags",
          ],
          color: "#e0472b",
          inputs: ["wireless-earbuds-oil-04"],
        },
        {
          id: "wireless-earbuds-coppermine-04",
          name: "Copper Mine",
          echelon: 4,
          description:
            "Coil, antenna and board traces begin in copper ore so low-grade that a tonne of rock carries barely one percent metal, concentrated by flotation, smelted and electrorefined to cathode purity.",
          specs: [
            { label: "Ore grade", value: "0.5-1", unit: "% Cu" },
            { label: "Rock per kg", value: "≈125", unit: "kg" },
            { label: "Cathode purity", value: "99.99", unit: "% Cu" },
            { label: "Smelters", value: "Concentrate-fed", unit: "" },
          ],
          history:
            "Chuquicamata in Chile has been mined for a century and remains one of the largest copper pits on Earth; the same copper wiring world descends from pits like it.",
          process: [
            "Blast and haul ore from the pit benches",
            "Flotation-concentrate to tens of percent",
            "Smelt and convert to blister copper",
            "Electrorefine to cathode sheets",
          ],
          color: "#181410",
          inputs: [],
        },
        {
          id: "wireless-earbuds-ironore-04",
          name: "Iron Ore Mine",
          echelon: 4,
          description:
            "The alloy called neodymium magnet is mostly iron - about two-thirds by weight - so the strongest magnet inside each earbud is, structurally, refined iron ore.",
          specs: [
            { label: "Iron content", value: "62-64", unit: "% Fe" },
            { label: "Form", value: "Hematite", unit: "" },
            { label: "Blasted in", value: "Terraced pits", unit: "" },
            { label: "Hauled by", value: "Rail and truck", unit: "" },
          ],
          history:
            "Iron ore mining scaled to open pits in the twentieth century around Lake Superior in America and the Hamersley ranges of western Australia.",
          process: [
            "Drill and blast the banded iron formation",
            "Load ore with the haul fleet",
            "Crush and beneficiate to pellets",
            "Ship to steel and alloy mills",
          ],
          color: "#181410",
          inputs: [],
        },
        {
          id: "wireless-earbuds-saltlake-04",
          name: "Lithium Salt Flat",
          echelon: 4,
          description:
            "Nearly half of the world's lithium comes out of salt flats: brine pumped into vast evaporation ponds, sun-dried for months, then refined. The rest is hard-rock spodumene, open-pit mined in Western Australia.",
          specs: [
            { label: "Brine Li", value: "0.04-0.15", unit: "%" },
            { label: "Evaporation", value: "6-18", unit: "months" },
            { label: "Hard rock", value: "Spodumene pits", unit: "" },
            { label: "Share", value: "Roughly half brine", unit: "" },
          ],
          history:
            "Salar de Atacama in Chile became a lithium brine source in the 1990s; the lithium age scaled on that water and the Australian pits that followed.",
          process: [
            "Pump lithium-bearing brine to ponds",
            "Evaporate for months, stage by stage",
            "Precipitate lithium salts",
            "Refine to battery grade",
          ],
          color: "#a49e92",
          inputs: [],
        },
        {
          id: "wireless-earbuds-oil-04",
          name: "Crude Oil Well",
          echelon: 4,
          description:
            "Everything polymer in the pair - housing, tips, case, cable jacket, pellets - begins as crude oil: drilled, refined, cracked into small molecules and chained long enough to be a plastic.",
          specs: [
            { label: "Drilling depth", value: "1-3", unit: "km typical" },
            { label: "First well", value: "1859", unit: "Titusville" },
            { label: "Cracks to", value: "Naphtha", unit: "" },
            { label: "Then chained", value: "PC / ABS", unit: "" },
          ],
          history:
            "Edwin Drake's 1859 Titusville well launched the industry that now, through cracking and polymerization, also supplies the world's plastics.",
          process: [
            "Survey and drill the reservoir",
            "Case, cement and perforate the well",
            "Lift crude to atmospheric pressure",
            "Refine and crack for plastic feedstock",
          ],
          color: "#181410",
          inputs: [],
        },
      ],
    },

// =====================================================================
    // OBJECT: Matcha Whisk (chasen, hand-split bamboo)
    // =====================================================================
    {
      id: "matcha-whisk",
      name: "Matcha Whisk",
      color: "#5c564c",
      nodes: [
        {
          id: "matcha-whisk-01",
          name: "Chasen (Bamboo Tea Whisk)",
          echelon: 0,
          description:
            "A chasen is carved and split from a single joint of bamboo: the upper fiber bundle is divided into tines, the outer skin kept where the shape should show, and the lower rows bound with thread to set the form. It whips matcha and hot water into the froth the tea ceremony expects - no other whisk shape does it as well.",
          specs: [
            { label: "Tines", value: "50-120", unit: "" },
            { label: "Made from", value: "One bamboo culm", unit: "" },
            { label: "Bound with", value: "Black thread", unit: "" },
            { label: "Retired", value: "When bent,", unit: "yrs" },
          ],
          history:
            "Chasen making settled in the Takayama district of Nara, Japan in the Muromachi period, roughly five hundred years ago, and its craft families still make nearly every whisk by hand.",
          process: [
            "Soak and quarter the seasoned bamboo culm",
            "Split and shave the fiber bundle into tines",
            "Curve the inner and outer tine rows",
            "Bind the lower rows with thread to set the hips",
          ],
          color: "#5c564c",
          inputs: ["matcha-whisk-tines-01", "matcha-whisk-knot-01"],
        },
        {
          id: "matcha-whisk-tines-01",
          name: "The Tines",
          echelon: 1,
          description:
            "The tines are the business end: the culm's fiber bundle divided lengthwise down to a hundred flexible prongs, each skived thinner toward the tip so the whole head flexes as one instrument. The craft is in the taper - a whisk cut carelessly whips unevenly or snaps.",
          specs: [
            { label: "Count", value: "50-120", unit: "per whisk" },
            { label: "Skived to", value: "Under 1", unit: "mm tip" },
            { label: "Rows", value: "Inner and outer", unit: "" },
            { label: "Flex", value: "Tuned by taper", unit: "" },
          ],
          history:
            "The tine count is a craft signature: thicker whisks for strong usucha, fewer and stiffer ones for the thick koicha served in the formal ceremony.",
          process: [
            "Mark the split lines around the fiber bundle",
            "Split with a knife down to the counted prongs",
            "Skive each tine thinner toward its tip",
            "Shape the curve of the bloom against a form",
          ],
          color: "#7d9a5e",
          inputs: ["matcha-whisk-splitter-02", "matcha-whisk-culm-03"],
        },
        {
          id: "matcha-whisk-knot-01",
          name: "The Binding",
          echelon: 1,
          description:
            "Black silk thread winds around the lower rows of tines, lifted with an awl, pulled tight, and locked - the binding sets the 'hips' that give a chasen its spring. It is both structure and the whisk's whole ornament.",
          specs: [
            { label: "Thread", value: "Silk", unit: "" },
            { label: "Color", value: "Black", unit: "" },
            { label: "Wraps", value: "Two bands", unit: "" },
            { label: "Function", value: "Sets the hips", unit: "" },
          ],
          history:
            "The binding is applied to hold the pushed-up curve while the bamboo dries, then left on permanently; a chasen without it relaxes open and whips weakly.",
          process: [
            "Lift the tine rows with an awl",
            "Wrap the thread band around the hips",
            "Pull to tension and lock the knot",
            "Check the bloom geometry against a form",
          ],
          color: "#7d9a5e",
          inputs: [],
        },
        {
          id: "matcha-whisk-splitter-02",
          name: "The Splitting Blade",
          echelon: 2,
          description:
            "The key tool is a stiff, curved blade worked by hand: it follows the marked lines and divides the fiber bundle without sawing. Industrial bamboo splitters run poles past a ring of blades for sticks and skewers; the chasen counterpart is one blade in steady hands, doing the same division at human speed.",
          specs: [
            { label: "Tool", value: "Hand splitting knife", unit: "" },
            { label: "Cuts per whisk", value: "Dozens", unit: "" },
            { label: "Quality gate", value: "No sawn fibers", unit: "" },
            { label: "Kin", value: "Industrial splitters", unit: "" },
          ],
          history:
            "Industrial splitting machines made bamboo skewers and chopstick blanks cheap worldwide; craft splitting survived in tea-whisk workshops because the fiber bundle must stay joined at its base.",
          process: [
            "Clamp the culm section in the vise",
            "Score the lines with the splitting knife",
            "Drive the blade down the fiber bundle",
            "Set the split rows aside for shaping",
          ],
          color: "#5b7f96",
          inputs: ["matcha-whisk-culm-03"],
        },
        {
          id: "matcha-whisk-culm-03",
          name: "Seasoned Bamboo Culm",
          echelon: 3,
          description:
            "Whisk bamboo is cut mature, then air-dried for years. Seasoning drops the moisture, sharpens the fibers, and turns the tan culm the color the craft expects; green wood would warp, soften, and smell of sap in the bowl.",
          specs: [
            { label: "Drying", value: "Air, ~2 years", unit: "" },
            { label: "Moisture down to", value: "≈10", unit: "%" },
            { label: "Species", value: "Madake bamboo", unit: "" },
            { label: "Signal", value: "Tan skin, hard", unit: "" },
          ],
          history:
            "The Japanese craft standard for whisk bamboo, madake, grows fast enough to harvest in years - one of the few stem crops that renews on a craftsman's timetable.",
          process: [
            "Cut mature winter culms",
            "Stack under cover to air-dry for years",
            "Sort culms by diameter and wall",
            "Cut whisk blanks from the best joints",
          ],
          color: "#7d9a5e",
          inputs: ["matcha-whisk-grove-04"],
        },
        {
          id: "matcha-whisk-grove-04",
          name: "The Bamboo Grove",
          echelon: 4,
          description:
            "It ends in a grove: bamboo pushes stems that harden to timber in a single season, so a managed grove yields on a few-year rotation instead of a generation's. The whisk above began inside one of those green stems.",
          specs: [
            { label: "Growth", value: "Season to timber", unit: "" },
            { label: "Rotation", value: "3-5", unit: "yr" },
            { label: "Grain", value: "Fiber bundle", unit: "" },
            { label: "Renewal", value: "Clump keeps", unit: "" },
          ],
          history:
            "Bamboo has fed and furnished East Asia for millennia; its speed of growth is why everything from scaffolding to whisk tines can be cut without ever felling a mature tree.",
          process: [
            "Select mature culms in the managed grove",
            "Cut at the base with the clump intact",
            "Trim branches and haul the poles",
            "Cure and stack under cover",
          ],
          color: "#7d9a5e",
          inputs: [],
        },
      ],
    },

// =====================================================================
    // OBJECT: LED Strip Light (addressable RGB ribbon)
    // =====================================================================
    {
      id: "led-strip",
      name: "LED Strip Light",
      color: "#181410",
      nodes: [
        {
          id: "led-strip-01",
          name: "LED Strip Light",
          echelon: 0,
          description:
            "An LED strip is a flexible printed circuit carrying repeating tiles of LED packages and, on addressable ribbons, a driver chip per tile: cut one edge, tin the pad, rewire the supply, and the light runs. Addressable 'RGBIC-style' strips control each tile separately, which is what makes the chasing and gradient effects.",
          specs: [
            { label: "LEDs", value: "30-96", unit: "per meter" },
            { label: "Voltage", value: "5 / 12 / 24", unit: "V DC" },
            { label: "Control", value: "Per-tile addressable", unit: "" },
            { label: "Sold as", value: "5 m reels", unit: "" },
          ],
          history:
            "The blue LED that made white light practical won Akasaki, Amano and Nakamura the 2014 Nobel Prize; the flexible-circuit strip came out of the same 2010s maker boom and the neon-rope products it later replaced.",
          process: [
            "Etch and laminate the flexible circuit reel",
            "Pick, place and reflow LED tiles onto it",
            "Test colors section by section",
            "Coat or sleeve, then wind onto reels",
          ],
          color: "#181410",
          inputs: ["led-strip-emitter-01", "led-strip-fpcb-01"],
        },
        {
          id: "led-strip-emitter-01",
          name: "LED Package",
          echelon: 1,
          description:
            "Each emitter is a plastic package holding red, green and blue LED chips wired to share one cathode; adding a phosphor over a blue chip makes white. The package is the interface between a crystal too fragile to handle and a circuit built by a placement machine.",
          specs: [
            { label: "Chips", value: "RGB (or +W)", unit: "" },
            { label: "Chips grow on", value: "GaN wafers", unit: "" },
            { label: "Package", value: "SMD 5050-class", unit: "" },
            { label: "Pads", value: "Four to six", unit: "" },
          ],
          history:
            "The first high-brightness blue LED came from GaN work at Nagoya and Nichia in the early 1990s; without it there is no white LED and no color-mixing strip.",
          process: [
            "Grow and dice the LED chips",
            "Bond chips onto the lead frame",
            "Wire, mold and cure the package",
            "Sort bins by brightness and color",
          ],
          color: "#e0472b",
          inputs: ["led-strip-smt-02", "led-strip-wafer-03"],
        },
        {
          id: "led-strip-fpcb-01",
          name: "Flex Circuit",
          echelon: 1,
          description:
            "The strip's body is a flexible printed circuit: rolled copper foil laminated to polyimide film, etched into traces, tinned on the pads. It bends around furniture and carries the current headroom that keeps voltage drop and dulling ends away.",
          specs: [
            { label: "Copper", value: "1-2", unit: "oz foil" },
            { label: "Substrate", value: "Polyimide film", unit: "" },
            { label: "Width", value: "8-12", unit: "mm" },
            { label: "Cut line", value: "Every tile", unit: "" },
          ],
          history:
            "Flexible circuits date to the 1940s patent literature and took off with camera and printer electronics; LED strips turned them into building decor.",
          process: [
            "Laminate copper foil to polyimide",
            "Print and etch the tile pattern",
            "Apply the solder-mask ink and legend",
            "Apply the adhesive backing and die-cut",
          ],
          color: "#e0472b",
          inputs: ["led-strip-smt-02", "led-strip-copper-03"],
        },
        {
          id: "led-strip-smt-02",
          name: "Placement Line",
          echelon: 2,
          description:
            "The reel runs through a placement line like any other board: paste-printed on the pads, LED packages and driver chips set by machines accurate to a few hundredths of a millimeter, then reflowed so every joint is one controlled temperature curve.",
          specs: [
            { label: "Placed per hour", value: "Tens of thousands", unit: "" },
            { label: "Accuracy", value: "≈0.05", unit: "mm" },
            { label: "Reflow peak", value: "245", unit: "°C" },
            { label: "Tested", value: "Every tile", unit: "" },
          ],
          history:
            "Surface-mount assembly became the default way electronics get built in the 1980s; LED strips ride the exact same production economics.",
          process: [
            "Feed the etched reel through paste printing",
            "Pick-and-place the LED packages and ICs",
            "Reflow-solder through the oven curve",
            "Optical-inspect and section-test each strip",
          ],
          color: "#5b7f96",
          inputs: ["led-strip-copper-03"],
        },
        {
          id: "led-strip-copper-03",
          name: "Rolled Copper Foil",
          echelon: 3,
          description:
            "The strip's conductor is copper foil rolled to thicknesses similar to kitchen foil - thin enough to flex ten thousand times, thick enough to carry several amperes the length of a five-meter reel.",
          specs: [
            { label: "Gauge", value: "35-70", unit: "µm" },
            { label: "Purity", value: "99.9", unit: "% Cu" },
            { label: "Rolled", value: "Cold, tight tolerance", unit: "" },
            { label: "Carries", value: "Up to ~5", unit: "A" },
          ],
          history:
            "Rolled-annealed foil came out of printed-circuit board making in the 1950s; flexible circuits ask more of it than rigid boards ever did.",
          process: [
            "Cast or roll copper to foil gauge",
            "Anneal soft for the flex cycle",
            "Slit to laminate width",
            "Ship on reels to circuit laminate plants",
          ],
          color: "#e0a52f",
          inputs: ["led-strip-mine-04"],
        },
        {
          id: "led-strip-wafer-03",
          name: "GaN-on-Sapphire Wafer",
          echelon: 3,
          description:
            "The blue LED chip begins as gallium nitride grown atom-layer by atom-layer on a sapphire disc; the crystal is diced into chips smaller than a grain of sand. A billion of them a year go into everything from traffic lights to strip tiles.",
          specs: [
            { label: "Layer", value: "GaN epitaxy", unit: "" },
            { label: "Substrate", value: "Sapphire disc", unit: "" },
            { label: "Chip size", value: "Fraction of a mm", unit: "" },
            { label: "Built in", value: "Cleanroom class", unit: "" },
          ],
          history:
            "Growing usable gallium nitride on sapphire was the breakthrough Akasaki and Amano solved at Nagoya University in 1992, and Nakamura turned it into a manufacturable blue LED at Nichia.",
          process: [
            "Polish sapphire discs to optical flatness",
            "Grow GaN layers in epitaxy reactors",
            "Add doping layers for color and drive",
            "Dice, test and bin the chips",
          ],
          color: "#e0a52f",
          inputs: ["led-strip-mine-04"],
        },
        {
          id: "led-strip-mine-04",
          name: "The Copper Mine",
          echelon: 4,
          description:
            "Foil, wires and board traces all begin in copper ore carrying under one percent metal from an open pit, concentrated and refined until it is pure enough for a circuit that flexes.",
          specs: [
            { label: "Ore grade", value: "0.5-1", unit: "% Cu" },
            { label: "Rock per kg", value: "≈125", unit: "kg" },
            { label: "Cathode", value: "99.99", unit: "% Cu" },
            { label: "Shipped", value: "To foil mills", unit: "" },
          ],
          history:
            "The copper that lights the strip descends from the same pit-to-refinery machine as every wiring harness on Earth.",
          process: [
            "Blast and haul the ore",
            "Concentrate by flotation",
            "Smelt, convert and fire-refine",
            "Electrorefine to cathode",
          ],
          color: "#181410",
          inputs: [],
        },
        {
          id: "led-strip-oil-04",
          name: "Crude Oil Well",
          echelon: 4,
          description:
            "The strip's sleeve, adhesive and carrier film come from oil: drilled crude, refined to naphtha, cracked into monomers and polymerized into the silicone or elastomer jacket that sheds weather and keeps dust off the light.",
          specs: [
            { label: "Depth", value: "1-3", unit: "km wells" },
            { label: "Cracks to", value: "Naphtha", unit: "" },
            { label: "Polymerizes to", value: "Sleeve polymers", unit: "" },
            { label: "Same well as", value: "Candles, jars", unit: "" },
          ],
          history:
            "Every plastic that coats and cases electronics is a branch of the same petrochemical tree planted at Titusville in 1859.",
          process: [
            "Drill and case the well",
            "Refine crude to naphtha",
            "Crack naphtha into monomers",
            "Polymerize into engineering plastics",
          ],
          color: "#181410",
          inputs: [],
        },
      ],
    },

// =====================================================================
    // OBJECT: Magnetic Power Bank (magnet-ring charger, Qi + coil)
    // =====================================================================
    {
      id: "magnet-power-bank",
      name: "Magnetic Power Bank",
      color: "#181410",
      nodes: [
        {
          id: "magnet-power-bank-01",
          name: "Magnetic Power Bank",
          echelon: 0,
          description:
            "This is a battery pack whose face is a ring of magnets around a charging coil: snap it to a phone and the coil lines up with the phone's receiver coil, and inductive charging starts without a cable. The magnet ring is what made snap-on charging a product category in late 2020.",
          specs: [
            { label: "Battery", value: "5000-10000", unit: "mAh class" },
            { label: "Snap", value: "Magnet ring", unit: "" },
            { label: "Charging", value: "Qi inductive", unit: "" },
            { label: "Category", value: "Since Oct 2020", unit: "" },
          ],
          history:
            "Apple introduced MagSafe with the iPhone 12 in October 2020, reviving the name from the 2006 MacBook charger; snap-on power banks followed within a season.",
          process: [
            "Stack cells, board and coil into the shell",
            "Align the magnet ring to the coil axis",
            "Calibrate and certify the Qi handshake",
            "Pack with cable and polarity card",
          ],
          color: "#181410",
          inputs: [
            "magnet-power-bank-coil-01",
            "magnet-power-bank-board-01",
            "magnet-power-bank-cells-01",
            "magnet-power-bank-ring-01",
          ],
        },
        {
          id: "magnet-power-bank-coil-01",
          name: "The Charging Coil",
          echelon: 1,
          description:
            "Behind the face sits a flat pancake coil: a disk of enameled copper wound in a spiral, which induces a matching current in the phone's receiver coil across a gap of millimeters. Alignment is everything - which is what the magnet ring guarantees.",
          specs: [
            { label: "Coil type", value: "Litz / spiral wound", unit: "" },
            { label: "Inductive gap", value: "2-8", unit: "mm" },
            { label: "Standard", value: "Qi (WPC, 2008)", unit: "" },
            { label: "Efficiency", value: "Tens of percent", unit: "" },
          ],
          history:
            "The Wireless Power Consortium published the Qi standard in 2008; before it, device-specific inductive pads fought each other with incompatible frequencies.",
          process: [
            "Wind the spiral onto the ferrite former",
            "Terminate the leads to the board",
            "Alignment-check against the magnet ring",
            "Cycle-test charge efficiency",
          ],
          color: "#e0472b",
          inputs: ["magnet-power-bank-winder-02", "magnet-power-bank-copper-03"],
        },
        {
          id: "magnet-power-bank-board-01",
          name: "The Control Board",
          echelon: 1,
          description:
            "A small protection and power board sits between the cells, the coil and the USB port: battery guards, a charge controller that negotiates with the phone, and the wake circuitry that notices when a device draws current.",
          specs: [
            { label: "Built as", value: "Multilayer PCB", unit: "" },
            { label: "Parts", value: "Chips + passives", unit: "" },
            { label: "Safety", value: "Overcurrent guards", unit: "" },
            { label: "Tests", value: "Every board", unit: "" },
          ],
          history:
            "Battery-protection boards became standard after early lithium incidents; every cell pack now ships with electronics that cut current long before the chemistry notices.",
          process: [
            "Etch and laminate the small board",
            "Place the controller and protection ICs",
            "Reflow, wash and function-test each board",
            "Mate it to the cells and the coil",
          ],
          color: "#e0472b",
          inputs: ["magnet-power-bank-smt-02", "magnet-power-bank-copper-03"],
        },
        {
          id: "magnet-power-bank-cells-01",
          name: "The Cells",
          echelon: 1,
          description:
            "Inside are lithium cells - cylindrical 18650-class or flat pouch cells - protected by a board that meters charge, guards against shorts, and reports state. The current that charges your phone has been shuttled by intercalation chemistry since Sony's 1991 cell.",
          specs: [
            { label: "Shape", value: "18650 / pouch", unit: "" },
            { label: "Nominal", value: "3.6-3.7", unit: "V" },
            { label: "Chemistry", value: "Li-ion", unit: "" },
            { label: "Cycle life", value: "300-500", unit: "typical" },
          ],
          history:
            "18650 cells powered the laptop era and then Tesla's first cars; pouch cells followed when phones wanted every millimeter inside the case.",
          process: [
            "Spot-weld or solder cell tabs",
            "Balance-charge the bank in groups",
            "Guard every cell against over-discharge",
            "Age and thermal-test the pack",
          ],
          color: "#e0472b",
          inputs: ["magnet-power-bank-stacking-02", "magnet-power-bank-lithium-03"],
        },
        {
          id: "magnet-power-bank-ring-01",
          name: "The Magnet Ring",
          echelon: 1,
          description:
            "A dozen or more arc magnets, alternating north-south around the coil's axis, form the ring that finds and holds the phone. The mechanical alignment they promise is why a snap-on bank still charges at full speed while it hangs off the back of a bag.",
          specs: [
            { label: "Count", value: "12-16", unit: "arc magnets" },
            { label: "Pattern", value: "Alternating poles", unit: "" },
            { label: "Grade", value: "N52-class NdFeB", unit: "" },
            { label: "Role", value: "Self-alignment", unit: "" },
          ],
          history:
            "Magnet arrays for self-aligning accessories date back to laptop dock designs; the 1984 neodymium magnet is what made rings this small strong enough to matter.",
          process: [
            "Magnetize the arcs in alternating directions",
            "Glue them into the ring carrier",
            "Check pull strength and alignment",
            "Fit the ring under the face shell",
          ],
          color: "#e0472b",
          inputs: ["magnet-power-bank-magnets-03"],
        },
        {
          id: "magnet-power-bank-winder-02",
          name: "The Coil Winder",
          echelon: 2,
          description:
            "Pancake coils are wound by machine: the winder lays enameled copper in continuous spiral turns under servo tension, splices the layer transitions, and finishes each coil in seconds. Hand winding cannot hold the turn count and consistency the Qi standard expects.",
          specs: [
            { label: "Turns", value: "Hundreds", unit: "" },
            { label: "Tension", value: "Constant servo", unit: "" },
            { label: "Wire", value: "Enameled copper", unit: "" },
            { label: "Rate", value: "Seconds per coil", unit: "" },
          ],
          history:
            "Winding machines date to the 1920s motor industry; Qi coils stretched them to flat spiral geometry with the same controlled-tension principle.",
          process: [
            "Load the flat former onto the spindle",
            "Wind the spiral turn count",
            "Guide the layer transition",
            "Cut, terminate and resistance-check",
          ],
          color: "#5b7f96",
          inputs: ["magnet-power-bank-copper-03"],
        },
        {
          id: "magnet-power-bank-stacking-02",
          name: "The Cell Line",
          echelon: 2,
          description:
            "Cell assembly lines run at battery suppliers: dry rooms, stacking and folding machines, vacuum electrolyte filling, cleanroom discipline and full electrical testing. A power bank maker simply buys the cells and welds them into a pack.",
          specs: [
            { label: "Environment", value: "Dry room", unit: "" },
            { label: "Filling", value: "Vacuum soak", unit: "" },
            { label: "Welding", value: "Ultrasonic / laser", unit: "" },
            { label: "Screening", value: "Every cell", unit: "" },
          ],
          history:
            "Cell-stack assembly changed little conceptually since Sony's 1991 line; dry-room discipline is the constant that keeps moisture out of lithium chemistry.",
          process: [
            "Cut and stack the electrode set",
            "Tab-weld, fold and vacuum-fill",
            "Heat-seal the pouch or crimp the can",
            "Format and test before shipping",
          ],
          color: "#5b7f96",
          inputs: ["magnet-power-bank-lithium-03"],
        },
        {
          id: "magnet-power-bank-smt-02",
          name: "The Placement Line",
          echelon: 2,
          description:
            "The bank's board is assembled on a surface-mount line like any other circuit: paste printed, parts placed by machine, reflowed, washed and tested before it meets a cell.",
          specs: [
            { label: "Placed per hour", value: "Tens of thousands", unit: "" },
            { label: "Reflow peak", value: "245", unit: "°C" },
            { label: "Accuracy", value: "≈0.05", unit: "mm" },
            { label: "Tested", value: "Every board", unit: "" },
          ],
          history:
            "Surface-mount assembly set the template for modern circuit boards in the 1980s; a charger board rides the same machines.",
          process: [
            "Print solder paste on the bare board",
            "Place the ICs and passives",
            "Reflow in the oven curve",
            "Inspect and function-test",
          ],
          color: "#5b7f96",
          inputs: ["magnet-power-bank-copper-03"],
        },
        {
          id: "magnet-power-bank-magnets-03",
          name: "Sintered NdFeB Magnet",
          echelon: 3,
          description:
            "The ring magnets are sintered neodymium-iron-boron: pressed rare-earth alloy powder, baked and magnetized. Grade N52 remains near the practical ceiling of permanent-magnet strength for a part this small - a few grams per ring that grip a phone across a case.",
          specs: [
            { label: "Composition", value: "Nd-Fe-B", unit: "" },
            { label: "Invented", value: "1984", unit: "" },
            { label: "Grade", value: "N52-class", unit: "" },
            { label: "Coat", value: "Ni-Cu-Ni", unit: "" },
          ],
          history:
            "Masato Sagawa and Sumitomo Special Metals announced sintered neodymium magnets in 1984, roughly doubling the strength ceiling any magnet could reach.",
          process: [
            "Melt the alloy under argon",
            "Mill to magnetically aligned powder",
            "Press and sinter the blanks",
            "Cut, coat and magnetize each arc",
          ],
          color: "#e0a52f",
          inputs: ["magnet-power-bank-mine-04", "magnet-power-bank-ironore-04"],
        },
        {
          id: "magnet-power-bank-copper-03",
          name: "Enameled Copper",
          echelon: 3,
          description:
            "The coil wire is copper refined to four nines, drawn to under a third of a millimeter, and baked in enamel; every turn of the pancake sits millimeters from its neighbors carrying amps without a single short.",
          specs: [
            { label: "Diameter", value: "0.1-0.3", unit: "mm" },
            { label: "Purity", value: "99.99", unit: "% Cu" },
            { label: "Enamel", value: "Polyester-imide", unit: "" },
            { label: "Tested", value: "Spark per meter", unit: "" },
          ],
          history:
            "Enameled magnet wire industrialized in the 1920s, doubling the copper that fits in a motor - and transferring the same trick to wireless charging coils a century later.",
          process: [
            "Draw copper rod through diamond dies",
            "Anneal between reductions",
            "Bake on the enamel layers",
            "Spark-test and spool",
          ],
          color: "#e0a52f",
          inputs: ["magnet-power-bank-mine-04"],
        },
        {
          id: "magnet-power-bank-lithium-03",
          name: "Lithium Compounds",
          echelon: 3,
          description:
            "The cells' cathodes begin as battery-grade lithium carbonate or hydroxide, refined from brine or ore to purities where metal contaminants get measured in parts per million.",
          specs: [
            { label: "Form", value: "Li2CO3 / LiOH", unit: "" },
            { label: "Purity", value: "99.5", unit: "% battery grade" },
            { label: "From", value: "Brine or spodumene", unit: "" },
            { label: "Contaminants", value: "Tracked in ppm", unit: "" },
          ],
          history:
            "Lithium refining scaled with laptops and phones; the power bank carries the same salt refinery inside its case.",
          process: [
            "Concentrate lithium from brine or ore",
            "Precipitate and wash the salts",
            "Refine to battery grade",
            "Dry-pack for cell makers",
          ],
          color: "#e0a52f",
          inputs: ["magnet-power-bank-saltlake-04"],
        },
        {
          id: "magnet-power-bank-mine-04",
          name: "The Copper Mine",
          echelon: 4,
          description:
            "Coil wire, board traces and cell tab foils all begin in copper ore so lean that producing a bank's worth of winding means crushing a wheelbarrow of rock for every coin of metal.",
          specs: [
            { label: "Ore grade", value: "0.5-1", unit: "% Cu" },
            { label: "Rock per kg", value: "≈125", unit: "kg" },
            { label: "Cathode purity", value: "99.99", unit: "% Cu" },
            { label: "Concentrator", value: "Flotation-fed", unit: "" },
          ],
          history:
            "Open-pit copper mining has done this job - low-grade rock in, refined metal out - for a century.",
          process: [
            "Blast and haul the ore",
            "Concentrate by flotation",
            "Smelt and convert",
            "Electrorefine to cathode",
          ],
          color: "#181410",
          inputs: [],
        },
        {
          id: "magnet-power-bank-ironore-04",
          name: "Iron Ore Mine",
          echelon: 4,
          description:
            "Two-thirds of every magnet is iron by weight; the rare earths supply is smaller and earlier in the supply chain, but the structural bulk of a ring magnet comes from refined ore at 60-percent-plus iron.",
          specs: [
            { label: "Iron content", value: "62-64", unit: "% Fe" },
            { label: "Form", value: "Pellets", unit: "" },
            { label: "Blasted in", value: "Open pits", unit: "" },
            { label: "Shipped", value: "By rail and sea", unit: "" },
          ],
          history:
            "Pelletized ore from pits like the Mesabi Range fed twentieth-century steelmaking - and now feeds rare-earth alloying too.",
          process: [
            "Drill and blast the formation",
            "Load and haul the ore",
            "Beneficiate and pelletize",
            "Rail to alloying mills",
          ],
          color: "#181410",
          inputs: [],
        },
        {
          id: "magnet-power-bank-saltlake-04",
          name: "Lithium Salt Flat",
          echelon: 4,
          description:
            "On salt flats like Atacama, brine is pumped to sun-evaporation ponds and dried for months to a lithium-rich concentrate; inland, mines crush spodumene ore for the same supply chain. Both end as the white battery-grade powder inside these cells.",
          specs: [
            { label: "Brine Li", value: "0.04-0.15", unit: "%" },
            { label: "Pond time", value: "6-18", unit: "months" },
            { label: "Hard rock", value: "Spodumene ore", unit: "" },
            { label: "Product", value: "Carbonate", unit: "" },
          ],
          history:
            "Salar de Atacama brine fed the first commercial battery-lithium supply chains in the 1990s and still carries much of today's production.",
          process: [
            "Pump brine to evaporation ponds",
            "Dry by sun, stage by stage",
            "Precipitate lithium salts",
            "Refine to battery grade",
          ],
          color: "#a49e92",
          inputs: [],
        },
      ],
    },

// =====================================================================
    // OBJECT: Slow-Rebound Stress Ball (memory-foam squeezee)
    // =====================================================================
    {
      id: "slow-rebound-ball",
      name: "Slow-Rebound Ball",
      color: "#5b7f96",
      nodes: [
        {
          id: "slow-rebound-ball-01",
          name: "Slow-Rebound Ball",
          echelon: 0,
          description:
            "The slow-rebound (squishy) ball is soft polyurethane foam formed in a two-part mold: squeeze it and the foam cells collapse and vent; let go and the cell walls re-inflate slowly - seconds, not milliseconds - which is why it crawls back to shape. The rebound rate is set by the foam chemistry itself.",
          specs: [
            { label: "Material", value: "Viscoelastic PU", unit: "" },
            { label: "Diameter", value: "40-70", unit: "mm" },
            { label: "Rebound time", value: "A few s", unit: "" },
            { label: "Skin", value: "Cast PU, painted", unit: "" },
          ],
          history:
            "The foam class came from NASA Ames work in 1966 - a material called 'Temper Foam', invented to cushion aircraft seats - and leaked into stress toys, mattresses and headphones.",
          process: [
            "Meter and mix the polyol and isocyanate",
            "Add pigment to the pour",
            "Fill and close the two-part mold",
            "Cure, demold, wash and paint",
          ],
          color: "#5b7f96",
          inputs: ["slow-rebound-ball-mold-tooling", "slow-rebound-ball-foam-03"],
        },
        {
          id: "slow-rebound-ball-mold-tooling",
          name: "The Mold",
          echelon: 1,
          description:
            "The ball is a hollow shell a few millimeters thick, shaped by a mating pair of aluminum molds: pour the reactive mix in, close, and let the foam expand to fill the cavity with its own gas. Edge parting lines, vent pins and surface grain all live inside these mold halves.",
          specs: [
            { label: "Tooling", value: "Aluminum pairs", unit: "" },
            { label: "Shots per mold", value: "One ball", unit: "" },
            { label: "Finish", value: "Textured skin", unit: "" },
            { label: "Vent", value: "Pin + parting", unit: "" },
          ],
          history:
            "Reaction-injection molding grew from polyurethane chemistry commercialized in the 1960s; where it parts from injection molding is that the melt heats itself - the reaction makes the heat.",
          process: [
            "Machine the two mold halves",
            "Drill vent and sprue pins",
            "Texture the cavity by etching",
            "Trial-shot and adjust the venting",
          ],
          color: "#5c564c",
          inputs: ["slow-rebound-ball-mill-02"],
        },
        {
          id: "slow-rebound-ball-mill-02",
          name: "The Casting Line",
          echelon: 2,
          description:
            "On the line, a metering head mixes the two chemical streams at the face of a closed mold; the liquid fill foams, expands, cures in minutes, and a break pin pops the finished ball out onto a belt for washing, drying and painting.",
          specs: [
            { label: "Shot", value: "Grams-metered", unit: "" },
            { label: "Mix time", value: "Fractions of a s", unit: "" },
            { label: "Cure", value: "5-15", unit: "min" },
            { label: "Then", value: "Wash, paint", unit: "" },
          ],
          history:
            "Reaction-injection molding machines turned polyurethane chemistry from batch buckets into continuously molded parts in the late 1960s.",
          process: [
            "Temperature-condition both resin streams",
            "Meter and impinge-mix at the head",
            "Shoot and dwell the mold",
            "Demold, wash, oven and paint",
          ],
          color: "#5b7f96",
          inputs: ["slow-rebound-ball-foam-03"],
        },
        {
          id: "slow-rebound-ball-foam-03",
          name: "The Foam Chemistry",
          echelon: 3,
          description:
            "Viscoelastic polyurethane is a polyol and an isocyanate stirred together with water, catalysts and silicone surfactant: the water makes the gas that blows the foam, and the chosen polyol controls how fast cells collapse and re-open - the 'slow rebound' is engineered in the formulation.",
          specs: [
            { label: "B-side", value: "Polyol blend", unit: "" },
            { label: "A-side", value: "MDI isocyanate", unit: "" },
            { label: "Blowing", value: "Water + CO2", unit: "" },
            { label: "Rebound", value: "Tuned by formula", unit: "" },
          ],
          history:
            "Otto Bayer's polyurethane chemistry dates to the late 1930s; NASA's 1966 slow-rebound version is just a formulation tuned for a long collapse curve.",
          process: [
            "Prepolymerize the isocyanate side",
            "Blend the polyol with water, pigment, catalyst",
            "Meter the two at a fixed ratio",
            "Let the reaction blow the foam",
          ],
          color: "#e0a52f",
          inputs: ["slow-rebound-ball-oil-04"],
        },
        {
          id: "slow-rebound-ball-ipaint-03",
          name: "The Paint Skin",
          echelon: 3,
          description:
            "Slow-rebound balls are painted in two passes: a flexible base coat that stretches with the foam, then the colored top. The paint has to cycle with the foam across thousands of squeezes or the ball loses its face.",
          specs: [
            { label: "Base coat", value: "Flexible PU", unit: "" },
            { label: "Top coat", value: "Pigmented", unit: "" },
            { label: "Drying", value: "Warm force", unit: "" },
            { label: "Requirement", value: "Cycles with foam", unit: "" },
          ],
          history:
            "Flexible-coating chemistry matured with the same polyurethane tree; the paint that wraps the ball is a cousin of its foam.",
          process: [
            "Preheat the cured ball",
            "Spray the flexible base coat",
            "Tack the colored top coat on",
            "Cycle-test and pack",
          ],
          color: "#e0472b",
          inputs: ["slow-rebound-ball-oil-04"],
        },
        {
          id: "slow-rebound-ball-oil-04",
          name: "Crude Oil Well",
          echelon: 4,
          description:
            "Both chemical streams begin as oil: cracked naphtha feeds the benzene routes to MDI and the propylene routes to polyols - the ball's whole body is petroleum rearranged.",
          specs: [
            { label: "Feed", value: "Naphtha", unit: "" },
            { label: "Cracker", value: "Thermal", unit: "" },
            { label: "Routes", value: "Benzene, propylene", unit: "" },
            { label: "First well", value: "1859", unit: "" },
          ],
          history:
            "The first commercial oil well in 1859 supplied kerosene for lamps; every urethane feedstock now draws on that same energy flow.",
          process: [
            "Drill and case the well",
            "Refine crude to naphtha",
            "Crack to aromatics and olefins",
            "Route to isocyanate and polyol plants",
          ],
          color: "#181410",
          inputs: [],
        },
      ],
    },

// =====================================================================
    // OBJECT: Mini Portable Blender (USB, motor-in-a-jar)
    // =====================================================================
    {
      id: "mini-blender",
      name: "Mini Portable Blender",
      color: "#181410",
      nodes: [
        {
          id: "mini-blender-01",
          name: "Mini Portable Blender",
          echelon: 0,
          description:
            "The portable blender collapses Stephen Poplawski's 1922 idea - a motor spinning blades at the bottom of a cup - into a single bottle: the jar, the blades, the motor, the battery and the board all live in one compact unit you charge over USB-C.",
          specs: [
            { label: "Jar", value: "Tritan, 400-650", unit: "ml" },
            { label: "Battery", value: "≈2000", unit: "mAh class" },
            { label: "Motor speed", value: "13,000-20,000", unit: "rpm class" },
            { label: "Charge", value: "USB-C", unit: "" },
          ],
          history:
            "Poplawski built the first drink mixer with spinning blades inside a cup in 1922; Fred Waring's team commercialized the blender in 1937, and in the 2010s a lithium battery made a version the size of a water bottle.",
          process: [
            "Fit motor, board and battery into the base",
            "Spin-balance the blade assembly",
            "Leak-test the jar seal",
            "Charge-cycle and safety-test",
          ],
          color: "#181410",
          inputs: ["mini-blender-motor-01", "mini-blender-blades-01", "mini-blender-jar-01"],
        },
        {
          id: "mini-blender-motor-01",
          name: "The DC Motor",
          echelon: 1,
          description:
            "A small brushed DC motor with a permanent-magnet stator: current flows through copper windings on the armature, the magnetic field pushes the rotor around, and the shaft carries the blade directly. It is the same physics Poplawski used in 1922, in a few dozen grams.",
          specs: [
            { label: "Type", value: "Brushed DC", unit: "" },
            { label: "Speed class", value: "≈20,000", unit: "rpm" },
            { label: "Magnets", value: "Ferrite or NdFeB", unit: "" },
            { label: "Windings", value: "Enameled copper", unit: "" },
          ],
          history:
            "Brushed commutator motors powered everything from sewing machines to toothbrushes; ferrite magnets of the 1950s made pocket-scale DC motors cheap.",
          process: [
            "Stack the laminated armature core",
            "Wind and terminate the coil groups",
            "Fit brushes, magnets and the commutator",
            "Run-in and balance the shaft",
          ],
          color: "#e0472b",
          inputs: ["mini-blender-winder-02", "mini-blender-magwire-03"],
        },
        {
          id: "mini-blender-blades-01",
          name: "The Blades",
          echelon: 1,
          description:
            "Four to six stainless blades, stamped flat and pressed into a curve, cut fruit by shear speed rather than sharpness of edge. Kitchen-grade stainless holds against acid and salt and survives a dishwasher or a decade of rinsing.",
          specs: [
            { label: "Count", value: "4-6", unit: "" },
            { label: "Steel", value: "Stainless", unit: "" },
            { label: "Formed by", value: "Stamping", unit: "" },
            { label: "Mounted on", value: "Bushed shaft", unit: "" },
          ],
          history:
            "Fred Osius's 1930s Waring Blendor spun the first mass-market blade set; blade geometry has barely changed since.",
          process: [
            "Blank the blade outline from strip steel",
            "Stamp the curve and formed edges",
            "Grind the cutting edge radius",
            "Weigh-match blades for spin balance",
          ],
          color: "#e0472b",
          inputs: ["mini-blender-stamper-02", "mini-blender-bladesteel-03"],
        },
        {
          id: "mini-blender-jar-01",
          name: "The Tritan Jar",
          echelon: 1,
          description:
            "The jar that doubles as a travel bottle is injection-molded Tritan copolyester - glass-clear, drop-resistant, and rated for food contact. On this part, the jar is the frame: on almost every product in the category, the motor and blades bolt to its base.",
          specs: [
            { label: "Material", value: "Tritan copolyester", unit: "" },
            { label: "Molding", value: "Injection", unit: "" },
            { label: "Volume", value: "400-650", unit: "ml" },
            { label: "Mouth", value: "Screw-cap", unit: "" },
          ],
          history:
            "Eastman brought Tritan to market in the 2000s as a BPA-free replacement for polycarbonate bottles; portable blenders picked it up for its clarity and toughness.",
          process: [
            "Dry the resin before molding",
            "Inject into a single-cavity jar tool",
            "Cut, inspect and leak-check the jar",
            "Fit the silicone seal and screw cap",
          ],
          color: "#e0472b",
          inputs: ["mini-blender-inj-02", "mini-blender-pellets-03"],
        },
        {
          id: "mini-blender-winder-02",
          name: "The Winder",
          echelon: 2,
          description:
            "The motor's copper coils are wound by machine: spun under constant tension through tenths-of-a-millimeter wire, cut and soldered to the commutator. Consistent turn counts keep the coil groups balanced.",
          specs: [
            { label: "Wire", value: "≈0.2", unit: "mm" },
            { label: "Turns", value: "Hundreds", unit: "" },
            { label: "Tension", value: "Servo-controlled", unit: "" },
            { label: "Tested", value: "Every armature", unit: "" },
          ],
          history:
            "Automatic winding machines replaced benches of hand winders in the 1930s and are the reason a DC motor can now be a commodity part.",
          process: [
            "Load the armature slot stack",
            "Wind the coil groups to turn count",
            "Cut, strip and commutator-solder",
            "Insulation-test at production speed",
          ],
          color: "#5b7f96",
          inputs: ["mini-blender-magwire-03"],
        },
        {
          id: "mini-blender-stamper-02",
          name: "The Blade Stamper",
          echelon: 2,
          description:
            "Blades blank from strip steel on a press stroke: a progressive die cuts the outline, forms the curve and punches the shaft hole in one pass. The same presses that make keyboard springs make blender blades.",
          specs: [
            { label: "Press force", value: "40-80", unit: "t" },
            { label: "Strokes", value: "40-60", unit: "per minute" },
            { label: "Die", value: "Progressive", unit: "" },
            { label: "Tolerance", value: "Hundredths of mm", unit: "" },
          ],
          history:
            "Progressive die stamping spread from the automotive industry of the 1920s and turned flat metal into shaped parts at commodity prices.",
          process: [
            "Feed stainless strip into the die",
            "Blank, form and punch in one stroke",
            "Grind and deburr the cutting edges",
            "Balance-check each finished blade",
          ],
          color: "#5b7f96",
          inputs: ["mini-blender-bladesteel-03"],
        },
        {
          id: "mini-blender-inj-02",
          name: "Injection Molding Press",
          echelon: 2,
          description:
            "The jar, cap and blade housing are injection-molded polymer: a clamp shuts the tool, molten polymer fills the cavity, packs, cools and ejects. Clarity is a molding-class challenge - jar warpage of a tenth of a millimeter shows in every pour.",
          specs: [
            { label: "Clamp", value: "80-150", unit: "tons" },
            { label: "Cycle", value: "20-40", unit: "s" },
            { label: "Cavity count", value: "1-2", unit: "" },
            { label: "Finish", value: "Water-clear", unit: "" },
          ],
          history:
            "Hyatt's 1872 injection patent made shaped plastics cheap; Tritan-era jar molding is only more controlled.",
          process: [
            "Dry and convey the resin to the hopper",
            "Inject, pack and cool the jar",
            "Eject and degate the part",
            "Inspect for warp and clarity",
          ],
          color: "#5b7f96",
          inputs: ["mini-blender-pellets-03"],
        },
        {
          id: "mini-blender-magwire-03",
          name: "Enameled Copper Wire",
          echelon: 3,
          description:
            "Motor wire is electrolytic copper drawn thin and coated in bake-on enamel so its own turns can sit touching without ever shorting; the coil groups of this motor are the same chemistry as a ceiling fan's, scaled to a few grams.",
          specs: [
            { label: "Diameter", value: "≈0.2", unit: "mm" },
            { label: "Purity", value: "99.99", unit: "% Cu" },
            { label: "Enamel", value: "Polyester-imide", unit: "" },
            { label: "Breakdown", value: "kV-class", unit: "" },
          ],
          history:
            "Wire enamel replaced wound cotton insulation in the 1920s, which is what let motors double their winding density.",
          process: [
            "Draw copper rod to gauge",
            "Anneal between passes",
            "Bake on enamel in layers",
            "Spark-test before spooling",
          ],
          color: "#e0a52f",
          inputs: ["mini-blender-mine-04"],
        },
        {
          id: "mini-blender-bladesteel-03",
          name: "Cold-Rolled Strip Steel",
          echelon: 3,
          description:
            "Blade strip begins as low-carbon stainless, rolled cold to gauge and annealed soft enough to curve in the press without cracking; the chromium in it is what keeps fruit acid and years of salt from ever pitting the edge.",
          specs: [
            { label: "Thickness", value: "0.4-0.8", unit: "mm" },
            { label: "Steel", value: "Stainless strip", unit: "" },
            { label: "Finish", value: "2B mill", unit: "" },
            { label: "Annealed", value: "Full soft", unit: "" },
          ],
          history:
            "Harry Brearley's 1913 chromium steel found its way to cutlery first; the same class of steel blades this cup.",
          process: [
            "Hot-roll and pickle the slab",
            "Cold-roll to trim strip",
            "Anneal in a bell furnace",
            "Slit and edge-round the coil",
          ],
          color: "#e0a52f",
          inputs: ["mini-blender-ironore-04"],
        },
        {
          id: "mini-blender-pellets-03",
          name: "Tritan Pellets",
          echelon: 3,
          description:
            "The jar's resin arrives as clear pellets: Tritan copolyester, BPA-free and glass-clear, tough enough to survive a drop off the counter. The pellets must be dried before molding or the finished jar picks up a haze.",
          specs: [
            { label: "Resin", value: "Tritan copolyester", unit: "" },
            { label: "Form", value: "Pellets", unit: "" },
            { label: "Melt point", value: "≈230", unit: "°C" },
            { label: "Dried to", value: "Low moisture", unit: "" },
          ],
          history:
            "BPA-free, glass-clear plastic for bottles is a 2000s-to-2010s story; Tritan's chemistry entered the market in the mid-2000s.",
          process: [
            "Polymerize in the reactor",
            "Pelletize and spiral-dry",
            "Bag to moisture spec",
            "Ship to molding shops",
          ],
          color: "#e0472b",
          inputs: ["mini-blender-oil-04"],
        },
        {
          id: "mini-blender-mine-04",
          name: "The Copper Mine",
          echelon: 4,
          description:
            "The motor's copper starts in ore: low-grade rock hauled to a concentrator, smelted and refined - the same wheelbarrows do everything electrical in the room.",
          specs: [
            { label: "Ore grade", value: "0.5-1", unit: "% Cu" },
            { label: "Rock per kg", value: "≈125", unit: "kg" },
            { label: "Cathode", value: "99.99", unit: "% Cu" },
            { label: "Pit", value: "Open, terraced", unit: "" },
          ],
          history:
            "Copper has been mined open-pit for a century; the winding in a quiet fan and the winding in this motor came from the same kind of pit.",
          process: [
            "Blast and haul the ore",
            "Concentrate by flotation",
            "Smelt, then fire-refine",
            "Electrorefine to cathode",
          ],
          color: "#181410",
          inputs: [],
        },
        {
          id: "mini-blender-ironore-04",
          name: "Iron Ore Mine",
          echelon: 4,
          description:
            "Steel's base is iron ore: titanium-scale hematite pelletized from beneficiated rock, then alloyed with chromium for the blade strip or left plain for the frame parts.",
          specs: [
            { label: "Iron content", value: "62-64", unit: "% Fe" },
            { label: "Pit", value: "Open, benches", unit: "" },
            { label: "Haul", value: "Rail to mill", unit: "" },
            { label: "Beneficiated to", value: "Pellets", unit: "" },
          ],
          history:
            "Mesabi-range ore ran the steel age; every stamped blade carries its iron through the same furnace.",
          process: [
            "Drill and blast the formation",
            "Load and transport by rail",
            "Beneficiate and pelletize",
            "Charge the mill furnace",
          ],
          color: "#181410",
          inputs: [],
        },
        {
          id: "mini-blender-oil-04",
          name: "Crude Oil Well",
          echelon: 4,
          description:
            "The jar's resin begins as oil: drilled, refined, cracked into monomers and polymerized into copolyester, then shipped as pellets to the molder.",
          specs: [
            { label: "Depth", value: "1-3", unit: "km" },
            { label: "Cracked to", value: "Monomers", unit: "" },
            { label: "Polymerized", value: "Copolyester", unit: "" },
            { label: "First well", value: "1859", unit: "" },
          ],
          history:
            "The same refinery that feeds kerosene and polypropylene also feeds the jar's polymer - a branch of Titusville's tree.",
          process: [
            "Drill and case the well",
            "Refine to naphtha",
            "Crack to monomers",
            "Polymerize and pelletize",
          ],
          color: "#181410",
          inputs: [],
        },
      ],
    },

// =====================================================================
    // OBJECT: Portable SSD (pocket NVMe drive)
    // =====================================================================
    {
      id: "portable-ssd",
      name: "Portable SSD",
      color: "#181410",
      nodes: [
        {
          id: "portable-ssd-01",
          name: "Portable SSD",
          echelon: 0,
          description:
            "A pocket SSD is a NAND chip set, a controller and a cable port inside a milled or stamped aluminum case: no moving parts, thousands of times faster per seek than the spinning drives it replaced, and designed to write terabytes back and forth for years.",
          specs: [
            { label: "Capacity", value: "500-2000", unit: "GB class" },
            { label: "Interface", value: "USB 3.2 / NVMe", unit: "" },
            { label: "Speed class", value: "≈1 GB/s", unit: "" },
            { label: "Form", value: "M.2 in shell", unit: "" },
          ],
          history:
            "Fujio Masuoka of Toshiba presented flash memory in 1984 and NAND in 1987; the consumer SSD reached pocket form when controllers and stacked NAND finally fit an M.2 profile.",
          process: [
            "Assemble NAND and controller on the PCB",
            "Program, test and identify the drive",
            "Fold, insert and seal in the shell",
            "Long-run endurance-test and pack",
          ],
          color: "#181410",
          inputs: ["portable-ssd-controller-01", "portable-ssd-nand-01", "portable-ssd-shell-01"],
        },
        {
          id: "portable-ssd-controller-01",
          name: "The Controller",
          echelon: 1,
          description:
            "The controller is a small ARM-core computer dedicated to a single job of translation: pretending a shrinking, wear-prone NAND array is a uniform disk. It manages pages, blocks, wear levelling, garbage collection and error-correction - in real time, for the life of the drive.",
          specs: [
            { label: "SoC", value: "ARM-core class", unit: "" },
            { label: "Runs", value: "Flash translation", unit: "" },
            { label: "Protocols", value: "NVMe / USB", unit: "" },
            { label: "Cache", value: "SRAM + DRAM class", unit: "" },
          ],
          history:
            "Flash translation layers were engineered in the 1990s; by the late 2000s vendors like SandForce shipped them as merchant controllers, and today they are SoCs bought in bulk by drive brands.",
          process: [
            "Design and tape out the SoC",
            "Fab the silicon on advanced nodes",
            "Package as the final ball-grid array",
            "Load firmware, test and bin",
          ],
          color: "#e0472b",
          inputs: ["portable-ssd-smt-02"],
        },
        {
          id: "portable-ssd-nand-01",
          name: "The NAND Flash",
          echelon: 1,
          description:
            "NAND flash stores bits as charge trapped in floating-gate cells stacked vertically in dozens of layers. It forgets slowly, wears with every write, and is the archival medium of the whole modern computer.",
          specs: [
            { label: "Invented", value: "1987", unit: "Toshiba" },
            { label: "3D layers", value: "Hundreds", unit: "" },
            { label: "Bits per cell", value: "2-4", unit: "TLC / QLC" },
            { label: "Production", value: "300 mm wafers", unit: "" },
          ],
          history:
            "Fujio Masuoka's NAND invention at Toshiba in 1987 replaced NOR's parallel access with serial blocks - the dense, cheap format that now holds the world's files.",
          process: [
            "Stack and etch the storage layers",
            "Dice wafers into dies",
            "Stack dies into bare-die packages",
            "Test, bin and ship the flash",
          ],
          color: "#e0472b",
          inputs: ["portable-ssd-wafer-03"],
        },
        {
          id: "portable-ssd-shell-01",
          name: "The Aluminum Shell",
          echelon: 1,
          description:
            "The shell is aluminum because it is the heat sink: the case touches the PCB's thermal pads, pulls NAND heat away during long writes, and doubles as the product's whole skin - extruded, machined, anodized.",
          specs: [
            { label: "Alloy", value: "6063 / 6061", unit: "" },
            { label: "Thermal", value: "≈200", unit: "W/mK" },
            { label: "Process", value: "Extrude + CNC", unit: "" },
            { label: "Finish", value: "Anodized", unit: "" },
          ],
          history:
            "Extruded aluminum heatsinks spread through electronics in the 1970s; a pocket SSD's shell is one of the few external surfaces still shaped by metal rather than plastic.",
          process: [
            "Extrude the profile and cut to length",
            "Machine the PCB bay",
            "Anodize for a hard finish",
            "Fit silicone pads and assemble",
          ],
          color: "#e0472b",
          inputs: ["portable-ssd-stamp-02", "portable-ssd-alum-03"],
        },
        {
          id: "portable-ssd-smt-02",
          name: "The Assembly Line",
          echelon: 2,
          description:
            "Controllers and NAND packages are set on the PCB by pick-and-place, reflowed at a tight temperature curve, then flashed, formatted and burn-in tested before they ever see a USB port.",
          specs: [
            { label: "Placement accuracy", value: "≈0.04", unit: "mm" },
            { label: "Reflow peak", value: "245", unit: "°C" },
            { label: "Tested", value: "Every drive", unit: "" },
            { label: "Tracked", value: "Chip-level serials", unit: "" },
          ],
          history:
            "SMT placement lines industrialized in the 1980s; an SSD is one of the cleanest, simplest boards such a line assembles for consumers.",
          process: [
            "Paste-print and load the bare PCB",
            "Place NAND, controller and power parts",
            "Reflow and optical-inspect",
            "Flash firmware and burn-in test",
          ],
          color: "#5b7f96",
          inputs: ["portable-ssd-wafer-03", "portable-ssd-copper-03"],
        },
        {
          id: "portable-ssd-stamp-02",
          name: "The Extrusion Line",
          echelon: 2,
          description:
            "Heated aluminum billet is forced through a die in one long push, emerging as the case's profile; cut, machined, straightened and heat-treated before anodizing. A continuous profile from one push is the whole price advantage.",
          specs: [
            { label: "Billet temp", value: "≈500", unit: "°C" },
            { label: "Press force", value: "Thousands of t", unit: "" },
            { label: "Profile", value: "Continuous", unit: "" },
            { label: "Aging", value: "T6 temper", unit: "" },
          ],
          history:
            "The extrusion process spread through aluminum products in the twentieth century; pocket SSDs simply inherited a well-run process.",
          process: [
            "Heat the billet to press temperature",
            "Push through the die in one stroke",
            "Cool, stretch and straighten",
            "T6-age, cut to length and anodize",
          ],
          color: "#5b7f96",
          inputs: ["portable-ssd-alum-03"],
        },
        {
          id: "portable-ssd-wafer-03",
          name: "The Silicon Wafer",
          echelon: 3,
          description:
            "Both silicon parts of the drive - the controller SoC and the NAND die - start as wafers of single-crystal silicon grown in crucible furnaces from electronics-grade silicon refined out of sand.",
          specs: [
            { label: "Diameter", value: "300", unit: "mm standard" },
            { label: "Purity", value: "9 nines", unit: "%" },
            { label: "Grown as", value: "Single crystal", unit: "" },
            { label: "Diced to", value: "Chips", unit: "" },
          ],
          history:
            "Czochralski's crystal-growing method of 1916 became the puller that has grown semiconductor-grade silicon since the 1960s.",
          process: [
            "Refine sand to trichlorosilane",
            "Reduce to polysilicon (Siemens route)",
            "Melt and pull the crystal boule",
            "Slice, lap, polish and ship wafers",
          ],
          color: "#a49e92",
          inputs: ["portable-ssd-quarry-04"],
        },
        {
          id: "portable-ssd-copper-03",
          name: "Copper and Laminates",
          echelon: 3,
          description:
            "Under the silicon sits the PCB: glass-fiber laminate with etched copper traces and finished pads. The drive's copper starts like every other wire on Earth.",
          specs: [
            { label: "Laminate", value: "FR-4 class", unit: "" },
            { label: "Foil", value: "1-2", unit: "oz copper" },
            { label: "Pads", value: "Ni-Au finish", unit: "" },
            { label: "Layers", value: "Multilayer", unit: "" },
          ],
          history:
            "Printed circuits took off with wartime radios and reframed electronics as a flat board; FR-4 has been standard for half a century.",
          process: [
            "Laminate copper to glass-fiber cloth",
            "Etch the circuit pattern",
            "Silk-screen the legend",
            "Finish pads for assembly",
          ],
          color: "#e0a52f",
          inputs: ["portable-ssd-mine-04"],
        },
        {
          id: "portable-ssd-alum-03",
          name: "Aluminum Billet",
          echelon: 3,
          description:
            "The case began as high-grade aluminum alloy billet: bauxite refined to alumina in a caustic-and-electricity process, smelted in electrolysis cells, then alloyed and cast for the extrusion line.",
          specs: [
            { label: "Ore", value: "Bauxite", unit: "" },
            { label: "Refined to", value: "Alumina", unit: "" },
            { label: "Smelted by", value: "Electrolysis", unit: "" },
            { label: "Alloys with", value: "Mg, Si", unit: "" },
          ],
          history:
            "Bauxite ore was identified at Les Baux in 1821; electrolytic aluminum from 1886 is the same route every can and case takes.",
          process: [
            "Mine and wash the bauxite",
            "Bayer-refine to alumina",
            "Smelt by Hall-Héroult electrolysis",
            "Alloy and cast the billet",
          ],
          color: "#e0a52f",
          inputs: ["portable-ssd-bauxite-04"],
        },
        {
          id: "portable-ssd-mine-04",
          name: "The Copper Mine",
          echelon: 4,
          description:
            "Every trace on the PCB traces back to a copper pit: ore at under one percent metal, hauled to a concentrator, smelted, refined into foil thick enough to bend.",
          specs: [
            { label: "Ore grade", value: "0.5-1", unit: "% Cu" },
            { label: "Rock per kg", value: "≈125", unit: "kg" },
            { label: "Cathode", value: "99.99", unit: "% Cu" },
            { label: "Producers", value: "Chile, Peru, DRC", unit: "" },
          ],
          history:
            "Chile's Atacama has produced copper at industrial scale for a hundred years; the copper sea never recedes.",
          process: [
            "Blast and haul the ore",
            "Concentrate by flotation",
            "Smelt to blister copper",
            "Electrorefine to cathode",
          ],
          color: "#181410",
          inputs: [],
        },
        {
          id: "portable-ssd-quarry-04",
          name: "The Quartz Quarry",
          echelon: 4,
          description:
            "High-purity quartzite is mined, washed and chemically refined into electronic-grade silicon; an SSD's chips are essentially washed rock that learned to remember.",
          specs: [
            { label: "Rock", value: "Quartzite", unit: "" },
            { label: "Refined to", value: "9-nines silicon", unit: "" },
            { label: "Route", value: "Siemens process", unit: "" },
            { label: "Crystals", value: "Czochralski", unit: "" },
          ],
          history:
            "The Siemens process has refined high-purity polysilicon since the mid-twentieth century and remains the standard route from sand to wafer.",
          process: [
            "Quarry silica at industrial purity",
            "Refine to trichlorosilane",
            "Reduce to polysilicon",
            "Pull the wafer-grade boule",
          ],
          color: "#a49e92",
          inputs: [],
        },
        {
          id: "portable-ssd-bauxite-04",
          name: "The Bauxite Mine",
          echelon: 4,
          description:
            "The case's aluminum began as laterite soil - red, iron-stained - strip-mined in tropical pits and shipped for refinement.",
          specs: [
            { label: "Ore", value: "Bauxite soil", unit: "" },
            { label: "Pit type", value: "Tropical strip", unit: "" },
            { label: "Alumina", value: "≈45", unit: "%" },
            { label: "Named for", value: "Les Baux, 1821", unit: "" },
          ],
          history:
            "Bauxite was named after Les Baux in Provence in 1821; today the largest mines run through tropical Australia, Guinea and Brazil.",
          process: [
            "Strip the soil, face the ore",
            "Crush and wash the bauxite",
            "Bayer-refine to alumina",
            "Smelt and cast ingots",
          ],
          color: "#181410",
          inputs: [],
        },
      ],
    },

// =====================================================================
    // OBJECT: Ballpoint Pen (twist-action, carbide ball)
    // =====================================================================
    {
      id: "ballpoint-pen",
      name: "Ballpoint Pen",
      color: "#181410",
      nodes: [
        {
          id: "ballpoint-pen-01",
          name: "Ballpoint Pen",
          echelon: 0,
          description:
            "A ballpoint pen writes by carrying thick paste ink on a rotating ball seated at the tip: as the ball rolls, ink transfers to paper and the gap recharges from the reservoir behind it. The twist action carries a spring that pushes the refill forward - an entire mechanism in a hand's width.",
          specs: [
            { label: "Ball", value: "0.5-1.0", unit: "mm carbide" },
            { label: "Refill", value: "G2-class", unit: "" },
            { label: "Action", value: "Twist", unit: "" },
            { label: "Weight", value: "≈35", unit: "g steel-barreled" },
          ],
          history:
            "László Bíró patented the practical ballpoint in 1938; his insight was not the ball alone but pairing it with thicker, pasty ink that would not leak or flood the socket.",
          process: [
            "Assemble refill, spring and mechanism into the barrel",
            "Torque-fit the twist mechanism",
            "Write-test the stroke on paper",
            "Inspect, cap and box",
          ],
          color: "#181410",
          inputs: ["ballpoint-pen-ball-01", "ballpoint-pen-spring-01", "ballpoint-pen-refill-01"],
        },
        {
          id: "ballpoint-pen-ball-01",
          name: "The Carbide Ball",
          echelon: 1,
          description:
            "The writing ball is sintered tungsten carbide: powder pressed into a sphere, sintered, and ground to roundness within a few ten-thousandths of a millimeter. It has to roll on paper for kilometers without deforming or dissolving in ink.",
          specs: [
            { label: "Diameter", value: "0.5-1.0", unit: "mm" },
            { label: "Material", value: "Tungsten carbide", unit: "" },
            { label: "Roundness", value: "Micron-class", unit: "" },
            { label: "Sintered from", value: "WC powder", unit: "" },
          ],
          history:
            "Tungsten carbide entered mass production as tooling in the 1920s; its hardness is what lets a ball smaller than a pin's head outlast the pen's ink.",
          process: [
            "Press the WC-cobalt powder into blanks",
            "Sinter near 1400 °C",
            "Roll-grind the balls to final size",
            "Sort and fit into the socket",
          ],
          color: "#e0472b",
          inputs: ["ballpoint-pen-grinder-02", "ballpoint-pen-carbide-03"],
        },
        {
          id: "ballpoint-pen-spring-01",
          name: "The Twist Spring",
          echelon: 1,
          description:
            "A small coiled spring inside the mechanism holds the refill forward against the tip and returns it under the twist action. It is the quietest part of the pen and the one every turn's torque pushes through.",
          specs: [
            { label: "Type", value: "Compression", unit: "" },
            { label: "Wire", value: "Stainless or music wire", unit: "" },
            { label: "Rate", value: "Fixed, matched", unit: "" },
            { label: "Cycles", value: "Thousands", unit: "" },
          ],
          history:
            "Compression springs wound from tempered wire are older industrial hardware than the pen itself; wire-drawing made them cheap in the late nineteenth century.",
          process: [
            "Draw the wire to gauge",
            "Coil on a multi-spindle winder",
            "Heat-treat the spring temper",
            "Load-test every batch",
          ],
          color: "#e0472b",
          inputs: ["ballpoint-pen-winder-02", "ballpoint-pen-steel-03"],
        },
        {
          id: "ballpoint-pen-refill-01",
          name: "The Refill",
          echelon: 1,
          description:
            "The refill is the standardized cartridge inside every twist pen: a tube of ink, a socketed nib carrying the ball, and a rear that seats into the mechanism. Standardized sizes are why a refill from one brand fits hundreds of pen bodies.",
          specs: [
            { label: "Standard", value: "G2 / D1 classes", unit: "" },
            { label: "Ink", value: "Pasty oil-based", unit: "" },
            { label: "Writes", value: "1-2", unit: "km class" },
            { label: "Fits", value: "Many pen brands", unit: "" },
          ],
          history:
            "After Bíró's patent, Marcel Bich launched the BIC Cristal in 1950 on a pen built around an easily replaced refill; the standardization that followed is why this one still fits.",
          process: [
            "Draw and cut the brass tube",
            "Extrude the paste into the barrel",
            "Seal the socket with the ball assembly",
            "Write-test each cartridge",
          ],
          color: "#e0472b",
          inputs: ["ballpoint-pen-filler-02", "ballpoint-pen-ink-03"],
        },
        {
          id: "ballpoint-pen-grinder-02",
          name: "The Ball Grinder",
          echelon: 2,
          description:
            "Sintered carbide blanks are rolled between grinding plates until every ball falls within its grade: micron-class roundness and diameter that decides whether the pen writes a hairline of ink or floods it.",
          specs: [
            { label: "Method", value: "Roll-grinding plates", unit: "" },
            { label: "Tolerance", value: "±0.001", unit: "mm class" },
            { label: "Sorted by", value: "Grade bins", unit: "" },
            { label: "Rate", value: "Thousands per hour", unit: "" },
          ],
          history:
            "Ball-grinding machines are as old as ball bearings; pen tips specify the same micron-class sorting.",
          process: [
            "Load sintered blanks into the grinder",
            "Roll between grooved plates",
            "Lap to final size and finish",
            "Gauge-sort balls by diameter",
          ],
          color: "#5b7f96",
          inputs: ["ballpoint-pen-carbide-03"],
        },
        {
          id: "ballpoint-pen-winder-02",
          name: "Spring Winding",
          echelon: 2,
          description:
            "Spring wire is coiled on controlled spindles: winders hold pitch and tension so every spring yields the same force rate, then the coil is heat-treated and stress-relieved.",
          specs: [
            { label: "Coil", value: "Right-hand pitch", unit: "" },
            { label: "Temper", value: "Set after heat", unit: "" },
            { label: "Force", value: "Rated per length", unit: "" },
            { label: "Tested", value: "Load on every batch", unit: "" },
          ],
          history:
            "Coil springs industrialized in the mid-nineteenth century; today's winder holds a tolerance the hand winder could not.",
          process: [
            "Draw the spring wire to spec",
            "Wind to turn count and pitch",
            "Stress-relieve and square the ends",
            "Load-test before assembly",
          ],
          color: "#5b7f96",
          inputs: ["ballpoint-pen-steel-03"],
        },
        {
          id: "ballpoint-pen-filler-02",
          name: "The Refill Assembly Line",
          echelon: 2,
          description:
            "Cartridge assembly runs as a small dedicated line: tube drawn and cut to length, ink extruded under vacuum to eliminate bubbles, ball socket sealed by press, and every single refill writes a stroke before packing.",
          specs: [
            { label: "Filling", value: "Vacuum extrude", unit: "" },
            { label: "Seal", value: "Crimp socket", unit: "" },
            { label: "Tested", value: "Every refill", unit: "" },
            { label: "Rate", value: "Tens per minute", unit: "" },
          ],
          history:
            "Refill assembly mechanized in the decades after Bich; the full write-test rule is how the category escaped the leaky reputation of its early years.",
          process: [
            "Draw and cut the tube stock",
            "Vacuum-fill the ink paste",
            "Set and crimp the nib socket",
            "Write-test, cap and tray",
          ],
          color: "#5b7f96",
          inputs: ["ballpoint-pen-ink-03"],
        },
        {
          id: "ballpoint-pen-carbide-03",
          name: "Tungsten Carbide Powder",
          echelon: 3,
          description:
            "Tungsten carbide is half tungsten metal from a wolframite or scheelite mine and half carbon, sintered with cobalt as the binder. Its hardness rides just below diamond - which is why it rolls and never flattens.",
          specs: [
            { label: "Formula", value: "WC", unit: "" },
            { label: "Hardness", value: "≈90", unit: "HRA" },
            { label: "Binder", value: "Cobalt", unit: "" },
            { label: "Sintered at", value: "≈1450", unit: "°C" },
          ],
          history:
            "Sintered tungsten carbide took hold in 1920s Germany for cutting tools; its use in pen balls is a mid-century spin-off.",
          process: [
            "Mill ore and refine to APT",
            "Reduce to tungsten powder",
            "Carburize with carbon to WC",
            "Blend cobalt binder and mill the powder",
          ],
          color: "#e0a52f",
          inputs: ["ballpoint-pen-wolframite-04"],
        },
        {
          id: "ballpoint-pen-steel-03",
          name: "Spring Wire Steel",
          echelon: 3,
          description:
            "Spring wire begins as steel rod drawn repeatedly through drawing dies until it reaches tenths of a millimeter, with temper and fatigue life preserved the whole way down.",
          specs: [
            { label: "Wire grade", value: "Spring steel", unit: "" },
            { label: "Gauge", value: "0.2-0.4", unit: "mm" },
            { label: "Drawn", value: "Multiple passes", unit: "" },
            { label: "Yield", value: "1.5-2", unit: "GPa class" },
          ],
          history:
            "Wire drawing dates back centuries; modern spring wire is a mid-nineteenth-century refinement of the same schedule.",
          process: [
            "Rough-draw from rod",
            "Intermediate anneal between passes",
            "Finish-draw to final gauge",
            "Temper and spool",
          ],
          color: "#e0a52f",
          inputs: ["ballpoint-pen-mine-04"],
        },
        {
          id: "ballpoint-pen-ink-03",
          name: "The Paste Ink",
          echelon: 3,
          description:
            "Ballpoint ink is deliberately pasty: dye or pigment in an oil-based carrier thickened to the point it will not flow on its own - the ball spreads what gravity alone would not deliver. Bíró's viscosity insight is the reason the category ever worked.",
          specs: [
            { label: "Base", value: "Oil / glycol", unit: "" },
            { label: "Consistency", value: "Paste", unit: "" },
            { label: "Dry time", value: "Seconds", unit: "" },
            { label: "Waterproof", value: "Largely", unit: "" },
          ],
          history:
            "Bíró and his brother refined the paste formulation in Argentina in the late 1930s; RAF navigators carried it into the war, and the writing world followed.",
          process: [
            "Dissolve dyes in the carrier",
            "Blend thickener to paste viscosity",
            "Degass and filter the ink",
            "Fill cartridges under vacuum",
          ],
          color: "#e0472b",
          inputs: ["ballpoint-pen-oil-04"],
        },
        {
          id: "ballpoint-pen-wolframite-04",
          name: "The Wolframite Mine",
          echelon: 4,
          description:
            "Tungsten starts as wolframite or scheelite ore from hard-rock veins; it is milled, refined to APT, reduced to tungsten metal powder, then joined to carbon. The ball in the pen is a mining province compressed to a pin's head.",
          specs: [
            { label: "Ore", value: "Wolframite / scheelite", unit: "" },
            { label: "Refined to", value: "APT", unit: "" },
            { label: "Reduced to", value: "W powder", unit: "" },
            { label: "Producers", value: "China-led", unit: "" },
          ],
          history:
            "Tungsten mining concentrated in China and the Iberian peninsula; the metal's hardness made it famous in tooling long before it came to pens.",
          process: [
            "Mine the vein and crush the ore",
            "Concentrate the tungsten minerals",
            "Refine to ammonium paratungstate",
            "Reduce to tungsten and carburize",
          ],
          color: "#181410",
          inputs: [],
        },
        {
          id: "ballpoint-pen-mine-04",
          name: "The Iron Ore Mine",
          echelon: 4,
          description:
            "Spring wire's steel begins in iron ore pit benches like every other steel the room holds, alloyed and drawn to a wire thinner than the ball it pushes forward.",
          specs: [
            { label: "Ore", value: "62", unit: "% Fe" },
            { label: "Blasted in", value: "Open pits", unit: "" },
            { label: "Hauled", value: "Rail to mill", unit: "" },
            { label: "Feed", value: "Blast furnace", unit: "" },
          ],
          history:
            "Open-pit iron ore ran the twentieth century's steel supply; a pen spring is one of its quietest descendants.",
          process: [
            "Drill and blast the bench",
            "Load and haul the ore",
            "Beneficiate the feed",
            "Charge the blast furnace",
          ],
          color: "#181410",
          inputs: [],
        },
        {
          id: "ballpoint-pen-oil-04",
          name: "Crude Oil Well",
          echelon: 4,
          description:
            "The ink's oil carrier and the barrel's polymers begin as crude: drilled, refined, cracked and chained. The oil carrier that keeps the ink pasty runs on the same wellhead as the barrel's plastic.",
          specs: [
            { label: "Carrier", value: "Oil / glycol", unit: "" },
            { label: "Cracked", value: "Feedstock", unit: "" },
            { label: "Depth", value: "1-3", unit: "km" },
            { label: "Same well as", value: "Candles, jars", unit: "" },
          ],
          history:
            "The carrier that keeps ballpoint ink pasty refines out of the same naphtha stream that feeds polypropylene and wax.",
          process: [
            "Drill and case the well",
            "Refine crude to carrier stock",
            "Blend with dyes and thickeners",
            "Ship to the refill line",
          ],
          color: "#181410",
          inputs: [],
        },
      ],
    },

    // =====================================================================
    // OBJECT: Fridge Record Player (object #20, session 23)
    // Echelon 0: object -> 1: parts -> 2: machine -> 3: material -> 4: source
    // =====================================================================
    {
      id: "fridge-player",
      name: "Fridge Record Player",
      color: "#170F14",
      nodes: [
        {
          id: "fridge-player-01",
          name: "Fridge Record Player",
          echelon: 0,
          description:
            "A palm-sized copy of this suitcase player, built to hang on the fridge door by magnet. Nine NFC discs ride its platter; tapping one picks the song stored on the 128 MB card while an LED pulses with the music.",
          specs: [
            { label: "Discs", value: "9", unit: "NFC" },
            { label: "Memory", value: "128", unit: "MB" },
            { label: "Mount", value: "Fridge magnet", unit: "" },
            { label: "Light", value: "Rhythm LED", unit: "" },
          ],
          history:
            "The 12-inch LP arrived in 1948; this player shrinks nine of them onto a card the size of a fingernail.",
          process: [
            "Build and test the main board",
            "Fit speaker, motor and magnets",
            "Load the card with songs",
            "Pair and tap-test each disc",
          ],
          color: "#181410",
          inputs: ["fridge-player-speaker-01", "fridge-player-magnet-01", "fridge-player-smt-02"],
        },
        {
          id: "fridge-player-speaker-01",
          name: "Micro Loudspeaker Driver",
          echelon: 1,
          description:
            "This tower shows the design at full size: a paper cone glued to a surround, a voice coil hanging in a magnet gap, a basket holding the stack square. The player's driver is the same machine, shrunk to two inches.",
          specs: [
            { label: "Type", value: "Moving-coil cone", unit: "" },
            { label: "Impedance", value: "4", unit: "Ω" },
            { label: "Cone since", value: "1925", unit: "" },
            { label: "Gap field", value: "NdFeB", unit: "" },
          ],
          history:
            "Chester Rice and Edward Kellogg published the moving-coil cone loudspeaker in 1925.",
          process: [
            "Press the paper cone",
            "Wind the voice coil",
            "Glue cone to the surround",
            "Seat the basket on its magnet",
          ],
          color: "#e0472b",
          inputs: ["fridge-player-oxides-03"],
        },
        {
          id: "fridge-player-magnet-01",
          name: "Sintered NdFeB Magnet",
          echelon: 1,
          description:
            "The disc on the back is sintered neodymium, plated nickel-copper-nickel on both faces: powder pressed in a magnetic field, baked below melting, then magnetized. Against the steel door it carries the whole player with margin.",
          specs: [
            { label: "Grade", value: "N35", unit: "" },
            { label: "Max operating temp", value: "80", unit: "°C" },
            { label: "Energy product", value: "33-36", unit: "MGOe" },
            { label: "Plating", value: "Ni-Cu-Ni", unit: "" },
          ],
          history:
            "General Motors' Magnequench put sintered NdFeB powder on the market in 1984.",
          process: [
            "Mill the alloy to powder",
            "Press in a magnetic field",
            "Sinter below melting",
            "Plate, slice and magnetize",
          ],
          color: "#e0a52f",
          inputs: ["fridge-player-oxides-03"],
        },
        {
          id: "fridge-player-smt-02",
          name: "SMT Assembly Line",
          echelon: 2,
          description:
            "The player's board is built by the class of line shown in this closeup: paste printed onto pads, parts placed at machine speed, one pass through the reflow oven. Optical inspection reads every joint before it ships.",
          specs: [
            { label: "Throughput", value: "45000", unit: "cph" },
            { label: "Placement", value: "0.05", unit: "mm" },
            { label: "Peak reflow", value: "245", unit: "°C" },
            { label: "After the oven", value: "Optical inspection", unit: "" },
          ],
          history:
            "Surface-mount assembly grew out of IBM's 1960s Saturn guidance-computer boards.",
          process: [
            "Print solder paste on pads",
            "Place parts at machine speed",
            "Reflow at 245 degrees",
            "Inspect every joint",
          ],
          color: "#5b7f96",
          inputs: [],
        },
        {
          id: "fridge-player-oxides-03",
          name: "Rare Earth Oxides",
          echelon: 3,
          description:
            "Before it is metal, the magnet is powder: the ore is roasted and leached until the rare earths come out in solution, then fished apart one element at a time. Seventeen of them leave the same vat; the player needs neodymium.",
          specs: [
            { label: "Family", value: "17", unit: "elements" },
            { label: "Purity", value: "99", unit: "%" },
            { label: "Separated by", value: "Solvent extraction", unit: "" },
            { label: "Next step", value: "NdFeB alloy", unit: "" },
          ],
          history:
            "Carl Auer von Welsbach isolated neodymium in 1885 and named it for the Greek for new birth.",
          process: [
            "Roast and leach the ore",
            "Separate each element",
            "Precipitate the oxides",
            "Reduce into metal alloy",
          ],
          color: "#e0a52f",
          inputs: ["fridge-player-mine-04"],
        },
        {
          id: "fridge-player-mine-04",
          name: "Rare Earth Mine",
          echelon: 4,
          description:
            "The ground under all of it is Bayan Obo: an open pit in Inner Mongolia whose benches and tailings ponds hold more than forty percent of the world's known rare earth reserves, at a grade of about six percent REO.",
          specs: [
            { label: "Known reserves", value: "40+", unit: "% of world" },
            { label: "REO grade", value: "6", unit: "%" },
            { label: "China's REO output", value: "≈70", unit: "%" },
            { label: "Discovered", value: "1927", unit: "" },
          ],
          history:
            "Iron ore drew geologists to Bayan Obo in 1927; the rare earths in the same rock were recognized in 1935.",
          process: [
            "Drill and blast the benches",
            "Haul ore to the crusher",
            "Float and concentrate the rock",
            "Ship to the separation plant",
          ],
          color: "#181410",
          inputs: [],
        },
      ],
    },
  ],
};