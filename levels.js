// ==========================================
//      THEME LIBRARY
// ==========================================
const themeLibrary = {
    "matrix": { zoneName: "THE MATRIX", bgType: "grid", renderStyle: "digital", bg: "#051105", grid: "#122512", platformBody: "#1a3a1a", platformGlow: "#39ff14", tileTop: "#39ff14", tileBottom: "#0a1a0a", bgDetail: "#0a220a", runeColor: "0, 255, 0", uiColor: "#00FF00", particle: "digital", musicId: "audio_zone1" },
    "synthwave": { zoneName: "THE MATRIX", bgType: "grid", renderStyle: "digital", bg: "#1a0b1a", grid: "#331033", platformBody: "#2a002a", platformGlow: "#ff00ff", tileTop: "#ff00ff", tileBottom: "#1a001a", bgDetail: "#2a0b2a", runeColor: "255, 0, 255", uiColor: "#00FFFF", particle: "digital", musicId: "audio_zone1" },
    "ice": { zoneName: "THE MATRIX", bgType: "grid", renderStyle: "digital", bg: "#05111a", grid: "#0d2b3a", platformBody: "#002a3a", platformGlow: "#00ffff", tileTop: "#00ffff", tileBottom: "#001a2a", bgDetail: "#0a1a2a", runeColor: "0, 255, 255", uiColor: "#ffffff", particle: "digital", musicId: "audio_zone1" },
    "rust": { zoneName: "THE FOUNDRY", bgType: "industrial", renderStyle: "industrial", bg: "#1a0500", grid: "#331500", platformBody: "#3d1e12", platformGlow: "#ff4500", tileTop: "#8b3a1a", tileBottom: "#3d1e12", bgDetail: "#2a0a00", runeColor: "255, 140, 0", uiColor: "#ff8c00", particle: "ash", musicId: "audio_zone2" },
    "magma": { zoneName: "THE FOUNDRY", bgType: "industrial", renderStyle: "industrial", bg: "#1a0000", grid: "#3a0000", platformBody: "#2a0000", platformGlow: "#ff0000", tileTop: "#ff4500", tileBottom: "#2a0000", bgDetail: "#2a0000", runeColor: "255, 100, 0", uiColor: "#ff0000", particle: "ash", musicId: "audio_zone2" },
    "steel": { zoneName: "THE FOUNDRY", bgType: "industrial", renderStyle: "industrial", bg: "#101010", grid: "#2a2a2a", platformBody: "#2f2f2f", platformGlow: "#ffffff", tileTop: "#aaaaaa", tileBottom: "#2f2f2f", bgDetail: "#1a1a1a", runeColor: "150, 150, 150", uiColor: "#ffffff", particle: "ash", musicId: "audio_zone2" },
    "ruins": { zoneName: "THE RUINS", bgType: "urban", renderStyle: "urban", bg: "#1e2420", grid: "#2a322c", platformBody: "#4a524c", platformGlow: "#556259", tileTop: "#556259", tileBottom: "#3a423c", bgDetail: "#161c18", runeColor: "150, 160, 150", uiColor: "#8f9c92", particle: "ash", musicId: "audio_zone1" },
    "overgrowth": { zoneName: "THE OVERGROWTH", bgType: "rural", renderStyle: "industrial", bg: "#152215", grid: "#1e331e", platformBody: "#3e2723", platformGlow: "#2e7d32", tileTop: "#2e7d32", tileBottom: "#3e2723", bgDetail: "#0d170d", runeColor: "100, 200, 100", uiColor: "#5c9e5c", particle: "ash", musicId: "audio_zone2" },
    "wilderness": { zoneName: "THE WILDERNESS", bgType: "wild", renderStyle: "industrial", bg: "#0a1215", grid: "#12242a", platformBody: "#263238", platformGlow: "#004d40", tileTop: "#004d40", tileBottom: "#1b262c", bgDetail: "#060b0d", runeColor: "0, 255, 150", uiColor: "#00e676", particle: "ash", musicId: "audio_zone1" }
};

// ==========================================
//      LEVEL LIBRARY
// ==========================================
const levelLibrary = {
    // ----------------------------------------------------
    // ZONE 1: THE DIGITAL REALM (Levels 1 - 10)
    // ----------------------------------------------------
    1: { 
        theme: "matrix", 
        platforms: [ 
            { x: 300, y: 4950, width: 200, height: 20 }, // Start
            { x: 500, y: 4800, width: 150, height: 15 }, 
            { x: 200, y: 4650, width: 150, height: 15 }, 
            { x: 500, y: 4500, width: 140, height: 15 }, 
            { x: 150, y: 4350, width: 130, height: 15 }, 
            { x: 450, y: 4200, width: 120, height: 15 }, 
            { x: 150, y: 4050, width: 120, height: 15 }, 
            { x: 320, y: 3900, width: 150, height: 20, isGoal: true } 
        ], 
        coins: [ {x: 575, y: 4760}, {x: 275, y: 4610}, {x: 570, y: 4460}, {x: 215, y: 4310} ]
    },
    2: { 
        theme: "matrix", 
        platforms: [ 
            { x: 300, y: 4950, width: 150, height: 20 }, 
            { x: 100, y: 4800, width: 100, height: 15 }, 
            { x: 350, y: 4650, width: 100, height: 15 }, 
            { x: 600, y: 4500, width: 100, height: 15 }, 
            { x: 350, y: 4350, width: 100, height: 15 }, 
            { x: 100, y: 4200, width: 100, height: 15 }, 
            { x: 300, y: 4000, width: 150, height: 20, isGoal: true } 
        ], 
        coins: [ {x: 150, y: 4760}, {x: 650, y: 4460} ], 
        twigs: [ {x: 400, y: 4610} ] 
    },
    3: { 
        theme: "matrix", 
        platforms: [ 
            { x: 350, y: 4950, width: 100, height: 20 }, 
            { x: 350, y: 4750, width: 70, height: 15 }, 
            { x: 200, y: 4600, width: 60, height: 15 }, 
            { x: 500, y: 4600, width: 60, height: 15 }, 
            { x: 350, y: 4450, width: 60, height: 15 }, 
            { x: 200, y: 4300, width: 50, height: 15 }, 
            { x: 500, y: 4300, width: 50, height: 15 }, 
            { x: 350, y: 4100, width: 100, height: 20, isGoal: true } 
        ], 
        gems: [ {x: 380, y: 4400} ], 
        hazards: [ {x: 360, y: 4735, width: 50, height: 15} ] // First hazard introduced
    },
    4: { 
        theme: "synthwave", // Visual switch
        platforms: [ 
            { x: 350, y: 4950, width: 150, height: 20 }, 
            { x: 200, y: 4800, width: 80, height: 15, patrolX: 100, speed: 1.5 }, // First Moving Platform
            { x: 500, y: 4600, width: 80, height: 15 }, 
            { x: 300, y: 4400, width: 80, height: 15, patrolX: 80, speed: 2 }, // Faster moving platform
            { x: 500, y: 4200, width: 80, height: 15 }, 
            { x: 350, y: 4000, width: 150, height: 20, isGoal: true } 
        ],
        coins: [ {x: 540, y: 4560}, {x: 540, y: 4160} ]
    },
    5: { 
        theme: "synthwave", 
        platforms: [ 
            { x: 350, y: 4950, width: 150, height: 20 }, 
            { x: 100, y: 4800, width: 60, height: 15 }, 
            { x: 350, y: 4650, width: 60, height: 15 }, 
            { x: 600, y: 4500, width: 60, height: 15 }, 
            { x: 350, y: 4350, width: 60, height: 15 }, 
            { x: 100, y: 4200, width: 60, height: 15 }, 
            { x: 350, y: 4000, width: 150, height: 20, isGoal: true } 
        ],
        sunstones: [ {x: 380, y: 4600} ], // Introduce Sunstone
        hazards: [ {x: 100, y: 4785, width: 20, height: 15}, {x: 600, y: 4485, width: 20, height: 15} ]
    },
    6: { 
        theme: "synthwave", 
        platforms: [ 
            { x: 350, y: 4950, width: 150, height: 20 }, 
            { x: 350, y: 4750, width: 150, height: 15, patrolX: 150, speed: 2 }, 
            { x: 350, y: 4550, width: 100, height: 15 }, 
            { x: 150, y: 4400, width: 80, height: 15, patrolX: 50, speed: 1 }, 
            { x: 550, y: 4250, width: 80, height: 15, patrolX: 50, speed: 1 }, 
            { x: 350, y: 4050, width: 150, height: 20, isGoal: true } 
        ],
        twigs: [ {x: 400, y: 4500} ]
    },
    7: { 
        theme: "ice", // Visual switch
        platforms: [ 
            { x: 350, y: 4950, width: 150, height: 20 }, 
            { x: 450, y: 4800, width: 50, height: 15 }, // Small precision jumps
            { x: 250, y: 4650, width: 50, height: 15 }, 
            { x: 450, y: 4500, width: 50, height: 15 }, 
            { x: 250, y: 4350, width: 50, height: 15 }, 
            { x: 450, y: 4200, width: 50, height: 15 }, 
            { x: 350, y: 4000, width: 150, height: 20, isGoal: true } 
        ],
        coins: [ {x: 475, y: 4760}, {x: 275, y: 4610}, {x: 475, y: 4460}, {x: 275, y: 4310} ]
    },
    8: { 
        theme: "ice", 
        platforms: [ 
            { x: 350, y: 4950, width: 150, height: 20 }, 
            { x: 200, y: 4800, width: 100, height: 15, isCrumbling: true }, // Introduce Crumbling
            { x: 400, y: 4650, width: 100, height: 15, isCrumbling: true }, 
            { x: 600, y: 4500, width: 100, height: 15, isCrumbling: true }, 
            { x: 400, y: 4350, width: 80, height: 15 }, // Safe spot
            { x: 200, y: 4200, width: 80, height: 15, isCrumbling: true }, 
            { x: 350, y: 4000, width: 150, height: 20, isGoal: true } 
        ],
        gems: [ {x: 440, y: 4300} ]
    },
    9: { 
        theme: "ice", 
        platforms: [ 
            { x: 350, y: 4950, width: 150, height: 20 }, 
            { x: 350, y: 4750, width: 60, height: 15, patrolX: 200, speed: 3 }, // Fast moving
            { x: 350, y: 4550, width: 60, height: 15 }, 
            { x: 350, y: 4350, width: 60, height: 15, patrolX: 200, speed: 3 }, 
            { x: 350, y: 4150, width: 150, height: 20, isGoal: true } 
        ],
        hazards: [ {x: 350, y: 4535, width: 60, height: 15} ], // Spike on the safe middle platform!
        sunstones: [ {x: 380, y: 4700} ]
    },
    10: { 
        // ZONE 1 FINALE
        theme: "matrix", 
        platforms: [ 
            { x: 300, y: 4950, width: 200, height: 20 }, 
            { x: 100, y: 4800, width: 80, height: 15, isCrumbling: true }, 
            { x: 350, y: 4650, width: 100, height: 15, patrolX: 100, speed: 2 }, 
            { x: 600, y: 4500, width: 80, height: 15, isCrumbling: true }, 
            { x: 350, y: 4350, width: 80, height: 15 }, 
            { x: 100, y: 4200, width: 80, height: 15, patrolX: 50, speed: 1.5 }, 
            { x: 350, y: 4000, width: 200, height: 20, isGoal: true } 
        ], 
        hazards: [ {x: 370, y: 4335, width: 40, height: 15} ],
        gems: [ {x: 450, y: 3950} ],
        twigs: [ {x: 140, y: 4750} ]
    },
    
    // ----------------------------------------------------
    // PREVIEW OF ZONE 2 (Placeholder so you can keep playing)
    // ----------------------------------------------------
    11: { theme: "rust", platforms: [ { x: 350, y: 4950, width: 150, height: 20 }, { x: 350, y: 4750, width: 100, height: 15 }, { x: 350, y: 4550, width: 150, height: 20, isGoal: true } ] }
};