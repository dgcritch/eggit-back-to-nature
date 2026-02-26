const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const worldHeight = 5000; 

// ==========================================
//      PROCEDURAL TEXTURE GENERATOR
// ==========================================
const textures = {};
function generateTextures() {
    let c = document.createElement('canvas');
    c.width = 40; c.height = 40;
    let cx = c.getContext('2d');
    
    cx.fillStyle = "#4a524c";
    cx.fillRect(0, 0, 40, 40);
    
    for (let i = 0; i < 60; i++) {
        cx.fillStyle = Math.random() > 0.5 ? "#3a423c" : "#556259"; 
        cx.fillRect(Math.floor(Math.random() * 40), Math.floor(Math.random() * 40), 2, 2);
    }
    cx.fillStyle = "#2a322c";
    cx.fillRect(0, 19, 40, 2);
    
    textures.urbanConcrete = ctx.createPattern(c, 'repeat');
}

// ==========================================
//      GAME ENGINE 
// ==========================================
let gameState = "PLAYING"; 
let currentLevel = 1;
let checkpointLevel = 1; 

let score = 0;
let lives = 3;
let twigsCollected = 0;
let sunstonesCollected = 0;
let isGolden = false;

let keys = {};
let isTouching = false;

let egg = { x: 400, y: 4900, radius: 15, dy: 0, jumpPower: -7.3, moveSpeed: 4.5 };
let gravity = 0.10; 
const bounce = -7.3;  
let cameraY = worldHeight - canvas.height;

let currentLevelData, platforms, activeCoins, activeHazards, activeGems, activeTwigs, activeSunstones, currentTheme;

function playSound(id) {
    const sound = document.getElementById(id);
    if (sound) {
        sound.currentTime = 0; 
        sound.play().catch(e => {});
    }
}

function loadLevel(levelNum) {
    currentLevelData = levelLibrary[levelNum] || levelLibrary[1];
    platforms = JSON.parse(JSON.stringify(currentLevelData.platforms));
    activeCoins = currentLevelData.coins ? JSON.parse(JSON.stringify(currentLevelData.coins)) : [];
    activeGems = currentLevelData.gems ? JSON.parse(JSON.stringify(currentLevelData.gems)) : [];
    activeTwigs = currentLevelData.twigs ? JSON.parse(JSON.stringify(currentLevelData.twigs)) : [];
    activeSunstones = currentLevelData.sunstones ? JSON.parse(JSON.stringify(currentLevelData.sunstones)) : [];
    activeHazards = currentLevelData.hazards ? JSON.parse(JSON.stringify(currentLevelData.hazards)) : [];
    
    currentTheme = themeLibrary[currentLevelData.theme || "matrix"];
    canvas.style.background = currentTheme.bg; 
    
    if (levelNum === 1 || levelNum === 10 || levelNum === 20 || levelNum === 30 || levelNum === 40) checkpointLevel = levelNum;

    initParticles(currentTheme.particle);
    
    egg.y = 4900;
    egg.x = 400;
    egg.dy = 0;
    cameraY = worldHeight - canvas.height;
    gameState = "PLAYING";
}

let backgroundParticles = [];
const digitalSymbols = ["01", "00", "{ }", "=>", "f()", "∑", "Ω", "∆", "∫", "<?>"];
function initParticles(type) {
    backgroundParticles = [];
    for (let i = 0; i < 40; i++) {
        if (type === "digital") {
            backgroundParticles.push({ x: Math.random() * canvas.width, y: Math.random() * worldHeight, text: digitalSymbols[Math.floor(Math.random() * digitalSymbols.length)], speed: 0.05 + Math.random() * 0.1, opacity: 0.1 + Math.random() * 0.2, type: "text" });
        } else if (type === "ash") {
            backgroundParticles.push({ x: Math.random() * canvas.width, y: Math.random() * worldHeight, size: 1 + Math.random() * 3, speed: 0.5 + Math.random() * 1.0, opacity: 0.2 + Math.random() * 0.3, type: "ash" });
        }
    }
}

function handleDeath() {
    if (gameState !== "PLAYING") return;
    playSound('sfx_death');
    lives--;
    if (lives <= 0) {
        gameState = "GAME_OVER";
    } else {
        loadLevel(checkpointLevel);
    }
}

function handleWin() {
    playSound('sfx_win');
    gameState = "LEVEL_CLEAR";
}

function advanceLevel() {
    let levels = Object.keys(levelLibrary).map(Number).sort((a,b)=>a-b);
    let nextLevel = levels[levels.indexOf(currentLevel) + 1];
    currentLevel = nextLevel ? nextLevel : 1; 
    loadLevel(currentLevel);
}

function restartGame() {
    lives = 3; score = 0; twigsCollected = 0; sunstonesCollected = 0; isGolden = false; currentLevel = 1;
    loadLevel(currentLevel);
}

window.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    if (e.code === 'KeyR') {
        if (gameState === "LEVEL_CLEAR") advanceLevel();
        else if (gameState === "GAME_OVER") restartGame();
    }
    if (e.code === 'KeyN' && gameState === "PLAYING") advanceLevel();
});
window.addEventListener('keyup', (e) => { keys[e.code] = false; });

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault(); isTouching = true;
    if (gameState === "LEVEL_CLEAR") advanceLevel(); else if (gameState === "GAME_OVER") restartGame();
    handleTouch(e);
}, {passive: false});
canvas.addEventListener('touchmove', (e) => { e.preventDefault(); handleTouch(e); }, {passive: false});
canvas.addEventListener('touchend', () => isTouching = false);

function handleTouch(e) {
    let rect = canvas.getBoundingClientRect();
    let touchX = e.touches[0].clientX - rect.left;
    let scaleX = canvas.width / rect.width;
    egg.x = touchX * scaleX;
}

function drawPlatform(plat) {
    if (plat.state === 'falling') return;

    let style = currentTheme.renderStyle; 
    ctx.save();
    
    if (plat.state === 'shaking') {
        ctx.translate(Math.random() * 4 - 2, Math.random() * 4 - 2);
    }

    let tileSize = 15; 
    
    if (plat.isGoal) {
        ctx.fillStyle = "gold"; ctx.fillRect(plat.x, plat.y - cameraY, plat.width, plat.height);
        ctx.strokeStyle = "#FFF"; ctx.lineWidth = 2; ctx.strokeRect(plat.x, plat.y - cameraY, plat.width, plat.height);
        ctx.restore(); return;
    }

    for (let px = 0; px < plat.width; px += tileSize) {
        for (let py = 0; py < plat.height; py += tileSize) {
            let isTop = (py === 0);
            let drawX = plat.x + px; let drawY = plat.y - cameraY + py;
            let w = Math.min(tileSize, plat.width - px); let h = Math.min(tileSize, plat.height - py);

            if (style === "digital") {
                ctx.fillStyle = isTop ? currentTheme.tileTop : currentTheme.tileBottom; ctx.fillRect(drawX, drawY, w, h);
                ctx.strokeStyle = "rgba(0,0,0,0.5)"; ctx.lineWidth = 1; ctx.strokeRect(drawX, drawY, w, h);
                if (isTop) { ctx.fillStyle = "#FFF"; ctx.fillRect(drawX + w/2 - 1, drawY + h/2 - 1, 2, 2); }
            } else if (style === "industrial") {
                ctx.fillStyle = isTop ? currentTheme.tileTop : currentTheme.tileBottom; ctx.fillRect(drawX, drawY, w, h);
                ctx.strokeStyle = "#111"; ctx.lineWidth = 1; ctx.strokeRect(drawX, drawY, w, h);
                if (w >= tileSize && h >= tileSize) {
                    ctx.fillStyle = "rgba(0,0,0,0.6)"; ctx.fillRect(drawX + 2, drawY + 2, 2, 2); ctx.fillRect(drawX + w - 4, drawY + h - 4, 2, 2);
                }
            }
        }
    }
    
    if (style === "urban") {
        ctx.fillStyle = textures.urbanConcrete || currentTheme.platformBody;
        ctx.fillRect(plat.x, plat.y - cameraY, plat.width, plat.height);
        
        ctx.fillStyle = "#5c705c"; 
        ctx.fillRect(plat.x, plat.y - cameraY, plat.width, 4); 
        
        for(let dx = 0; dx < plat.width; dx += 4) {
            let dripLength = Math.abs(Math.sin((plat.x + dx) * 0.3) + Math.cos((plat.x + dx) * 0.7)) * 5;
            if (dripLength > 2) {
                ctx.fillRect(plat.x + dx, plat.y - cameraY + 4, 4, dripLength);
            }
        }
    }

    ctx.strokeStyle = "#000"; ctx.lineWidth = 2; ctx.strokeRect(plat.x, plat.y - cameraY, plat.width, plat.height);
    ctx.restore();
}

function drawItems() {
    activeCoins.forEach(coin => {
        ctx.save(); let spin = Math.sin(Date.now() / 150); 
        ctx.fillStyle = "#FFD700"; ctx.strokeStyle = "#DAA520"; ctx.lineWidth = 2;
        ctx.beginPath(); let coinWidth = 12 * Math.abs(spin);
        ctx.fillRect(coin.x - coinWidth/2, coin.y - cameraY - 10, coinWidth, 20); ctx.strokeRect(coin.x - coinWidth/2, coin.y - cameraY - 10, coinWidth, 20);
        ctx.restore();
    });

    activeGems.forEach(gem => {
        ctx.save(); let hover = Math.sin(Date.now() / 200) * 4; ctx.translate(gem.x, gem.y - cameraY + hover);
        ctx.fillStyle = "#E0B0FF"; ctx.strokeStyle = "#8A2BE2"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(0, -10); ctx.lineTo(8, 0); ctx.lineTo(0, 10); ctx.lineTo(-8, 0); ctx.closePath();
        ctx.fill(); ctx.stroke(); ctx.fillStyle = "#FFF"; ctx.fillRect(-3, -5, 3, 3); ctx.restore();
    });

    activeTwigs.forEach(twig => {
        ctx.save(); ctx.translate(twig.x, twig.y - cameraY); ctx.strokeStyle = "#8B4513"; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(-6, -6); ctx.lineTo(6, 6); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, -2); ctx.lineTo(-8, 4); ctx.stroke();
        ctx.fillStyle = "#32CD32"; ctx.fillRect(2, -8, 4, 4); ctx.restore();
    });

    activeSunstones.forEach(stone => {
        ctx.save(); let pulse = 1 + Math.abs(Math.sin(Date.now() / 300)) * 0.2; ctx.translate(stone.x, stone.y - cameraY);
        ctx.scale(pulse, pulse); ctx.fillStyle = "#FF8C00"; ctx.beginPath(); ctx.arc(0, 0, 8, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#FFD700"; ctx.beginPath(); ctx.arc(0, 0, 4, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    });

    activeHazards.forEach(hazard => {
        ctx.save(); ctx.fillStyle = "#FF0000"; ctx.strokeStyle = "#880000"; ctx.lineWidth = 2;
        let spikeCount = Math.max(1, Math.floor(hazard.width / 10)); let spikeW = hazard.width / spikeCount;
        ctx.beginPath();
        for (let i = 0; i < spikeCount; i++) {
            let sx = hazard.x + (i * spikeW); let sy = hazard.y - cameraY + hazard.height;
            ctx.moveTo(sx, sy); ctx.lineTo(sx + (spikeW / 2), hazard.y - cameraY); ctx.lineTo(sx + spikeW, sy);
        }
        ctx.fill(); ctx.stroke(); ctx.restore();
    });
}

function drawEgg() {
    ctx.save(); ctx.translate(egg.x, egg.y - cameraY);
    if (isGolden) { ctx.beginPath(); ctx.arc(0, 0, egg.radius * 1.5, 0, Math.PI * 2); ctx.fillStyle = "rgba(255, 215, 0, 0.4)"; ctx.fill(); }
    ctx.beginPath(); ctx.moveTo(0, -egg.radius * 1.2); ctx.bezierCurveTo(egg.radius * 0.8, -egg.radius * 1.2, egg.radius * 1.1, egg.radius * 1.0, 0, egg.radius * 1.1);
    ctx.bezierCurveTo(-egg.radius * 1.1, egg.radius * 1.0, -egg.radius * 0.8, -egg.radius * 1.2, 0, -egg.radius * 1.2);
    ctx.fillStyle = "#FFD700"; ctx.fill();
    ctx.beginPath(); ctx.ellipse(-4, -6, 3, 5, Math.PI / 4, 0, Math.PI * 2); ctx.fillStyle = "rgba(255, 255, 255, 0.5)"; ctx.fill(); ctx.restore();
}

function drawHUD() {
    ctx.save(); ctx.font = "20px 'Press Start 2P', monospace"; ctx.fillStyle = currentTheme.uiColor; ctx.textAlign = "left";
    ctx.fillText(`SCORE:${score.toString().padStart(5, '0')}`, 20, 40);
    ctx.fillText(`LIVES:`, 20, 75);
    for(let i=0; i<lives; i++) { ctx.beginPath(); ctx.arc(140 + (i * 25), 68, 8, 0, Math.PI*2); ctx.fillStyle = "#FFD700"; ctx.fill(); }

    ctx.font = "16px 'VT323', monospace"; let hudY = 100;
    if (twigsCollected > 0) { ctx.fillStyle = "#CD853F"; ctx.fillText(`TWIGS: ${twigsCollected}/5`, 20, hudY); hudY += 25; }
    if (isGolden) { ctx.fillStyle = "#FFD700"; ctx.fillText(`GOLDEN SHELL ACTIVE! (2x Pts)`, 20, hudY); } 
    else if (sunstonesCollected > 0) { ctx.fillStyle = "#FF8C00"; ctx.fillText(`SUNSTONES: ${sunstonesCollected}/3`, 20, hudY); }

    ctx.fillStyle = currentTheme.uiColor; ctx.textAlign = "right";
    ctx.fillText(`ZONE: ${currentTheme.zoneName}`, canvas.width - 20, 40);
    ctx.fillText(`LEVEL: ${currentLevel}`, canvas.width - 20, 65);
    ctx.restore();
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Draw Background
    ctx.save();
    ctx.fillStyle = currentTheme.bgDetail; let paraOffset = (-cameraY * 0.1) % 400; 
    for (let py = paraOffset - 400; py < canvas.height + 400; py += 400) {
        if (currentTheme.bgType === "grid") { ctx.fillRect(100, py, 150, 300); ctx.fillRect(500, py + 150, 200, 350); } 
        else if (currentTheme.bgType === "industrial") { ctx.fillRect(50, py, 80, 400); ctx.fillRect(650, py, 100, 400); ctx.beginPath(); ctx.arc(400, py + 200, 150, 0, Math.PI*2); ctx.fill(); }
        else if (currentTheme.bgType === "urban") { 
            ctx.fillStyle = currentTheme.bgDetail; 
            ctx.fillRect(100, py + 50, 120, 350); 
            ctx.fillRect(120, py + 30, 60, 20); 
            ctx.fillRect(450, py, 150, 400); 
            ctx.fillRect(470, py - 40, 80, 40); 
            ctx.fillRect(560, py - 20, 40, 20); 
            ctx.fillStyle = currentTheme.bg; 
            for(let wy = py + 40; wy < py + 300; wy += 40) {
                ctx.fillRect(480, wy, 15, 20);
                ctx.fillRect(520, wy, 15, 20);
            }
            ctx.fillStyle = "#1e2620"; 
            ctx.fillRect(250, py + 150, 100, 250); 
            ctx.fillRect(260, py + 130, 50, 20); 
        }
        else if (currentTheme.bgType === "rural") { ctx.beginPath(); ctx.moveTo(150, py + 400); ctx.lineTo(250, py + 100); ctx.lineTo(350, py + 400); ctx.fill(); ctx.beginPath(); ctx.moveTo(500, py + 400); ctx.lineTo(650, py + 50); ctx.lineTo(800, py + 400); ctx.fill(); }
        else if (currentTheme.bgType === "wild") { ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(150, py + 300); ctx.lineTo(200, py); ctx.fill(); ctx.beginPath(); ctx.moveTo(550, py); ctx.lineTo(650, py + 400); ctx.lineTo(800, py); ctx.fill(); }
    }

    if (currentTheme.bgType === "grid") {
        ctx.strokeStyle = currentTheme.grid; ctx.lineWidth = 1; let gridOffset = (-cameraY * 0.4) % 80;
        for (let y = gridOffset; y <= canvas.height; y += 80) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke(); }
        for (let x = 0; x <= canvas.width; x += 80) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke(); }
    } else if (currentTheme.bgType === "industrial") {
        ctx.strokeStyle = currentTheme.grid; ctx.lineWidth = 2; let plateHeight = 200; let plateOffset = (-cameraY * 0.4) % plateHeight;
        for (let y = plateOffset; y <= canvas.height; y += plateHeight) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke(); ctx.fillStyle = "#111"; for (let x = 20; x < canvas.width; x+=100) { ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI*2); ctx.fill(); } }
    }

    backgroundParticles.forEach(p => {
        if (p.type === "text") { let drawY = (p.y - cameraY * 0.6) % 1500; if (drawY < 0) drawY += 1500; if (drawY < canvas.height) { ctx.font = "12px monospace"; ctx.fillStyle = `rgba(${currentTheme.runeColor}, ${p.opacity})`; ctx.fillText(p.text, p.x, drawY); } } 
        else if (p.type === "ash") { let drawY = (p.y + (Date.now() * 0.05 * p.speed) - cameraY * 0.2) % 1500; while (drawY < 0) drawY += 1500; while (drawY > 1500) drawY -= 1500; if (drawY < canvas.height) { ctx.beginPath(); ctx.arc(p.x, drawY, p.size, 0, Math.PI * 2); ctx.fillStyle = `rgba(${currentTheme.runeColor}, ${p.opacity})`; ctx.fill(); } }
    });
    ctx.restore();

    // 2. Physics & Engine Updates
    if (gameState === "PLAYING") {
        if (!isTouching) {
            if (keys['ArrowLeft']) egg.x -= egg.moveSpeed;
            if (keys['ArrowRight']) egg.x += egg.moveSpeed;
        }
        egg.dy += gravity;
        egg.y += egg.dy;

        // --- PLATFORM UPDATES (Moving & Crumbling Logic) ---
        platforms.forEach(plat => {
            if (plat.patrolX) {
                if (plat.originX === undefined) { plat.originX = plat.x; plat.dir = 1; }
                plat.x += plat.speed * plat.dir;
                if (Math.abs(plat.x - plat.originX) >= plat.patrolX) plat.dir *= -1;
            }

            if (plat.isCrumbling) {
                if (!plat.state) { plat.state = 'idle'; plat.originY = plat.y; }
                if (plat.state === 'shaking') {
                    plat.crumbleTimer--;
                    if (plat.crumbleTimer <= 0) { plat.state = 'falling'; plat.dy = 0; plat.respawnTimer = 180; }
                } else if (plat.state === 'falling') {
                    plat.dy += gravity; plat.y += plat.dy; plat.respawnTimer--;
                    if (plat.respawnTimer <= 0) { plat.state = 'idle'; plat.y = plat.originY; plat.dy = 0; }
                }
            }
        });

        let multi = isGolden ? 2 : 1; 

        for (let i = activeCoins.length - 1; i >= 0; i--) { let c = activeCoins[i]; if (Math.hypot(egg.x - c.x, egg.y - c.y) < egg.radius + 15) { activeCoins.splice(i, 1); score += (10 * multi); playSound('sfx_coin'); } }
        for (let i = activeGems.length - 1; i >= 0; i--) { let g = activeGems[i]; if (Math.hypot(egg.x - g.x, egg.y - g.y) < egg.radius + 15) { activeGems.splice(i, 1); score += (50 * multi); playSound('sfx_gem'); } }
        for (let i = activeTwigs.length - 1; i >= 0; i--) { let t = activeTwigs[i]; if (Math.hypot(egg.x - t.x, egg.y - t.y) < egg.radius + 15) { activeTwigs.splice(i, 1); twigsCollected++; score += 5; playSound('sfx_powerup'); if (twigsCollected >= 5) { lives++; twigsCollected = 0; score += 100; } } }
        for (let i = activeSunstones.length - 1; i >= 0; i--) { let s = activeSunstones[i]; if (Math.hypot(egg.x - s.x, egg.y - s.y) < egg.radius + 15) { activeSunstones.splice(i, 1); sunstonesCollected++; score += 10; playSound('sfx_powerup'); if (sunstonesCollected >= 3) { isGolden = true; sunstonesCollected = 0; score += 200; } } }

        activeHazards.forEach(h => {
            if (egg.x > h.x && egg.x < h.x + h.width && egg.y + egg.radius > h.y && egg.y - egg.radius < h.y + h.height) {
                if (isGolden) { isGolden = false; egg.dy = bounce * 0.8; egg.y = h.y - egg.radius; playSound('sfx_crumble'); } 
                else handleDeath();
            }
        });

        platforms.forEach(plat => {
            if (plat.state !== 'falling' && egg.dy > 0 && egg.y + egg.radius > plat.y && egg.y + egg.radius < plat.y + plat.height && egg.x > plat.x && egg.x < plat.x + plat.width) {
                egg.y = plat.y - egg.radius;
                egg.dy = bounce;
                playSound('sfx_jump');
                if (plat.isGoal) handleWin();
                
                if (plat.isCrumbling && plat.state === 'idle') {
                    plat.state = 'shaking'; plat.crumbleTimer = 30; playSound('sfx_crumble');
                }
            }
        });

        if (egg.x < egg.radius) egg.x = egg.radius;
        if (egg.x > canvas.width - egg.radius) egg.x = canvas.width - egg.radius;
        if (egg.y + egg.radius > worldHeight) { egg.y = worldHeight - egg.radius; egg.dy = bounce; playSound('sfx_jump'); }
    }

    let targetY = egg.y - (canvas.height * 0.7); cameraY += (targetY - cameraY) * 0.08;
    if (cameraY > worldHeight - canvas.height) cameraY = worldHeight - canvas.height;
    if (cameraY < -200) cameraY = -200;

    platforms.forEach(plat => drawPlatform(plat));
    drawItems(); drawEgg(); drawHUD(); 

    if (gameState === "LEVEL_CLEAR") {
        ctx.fillStyle = "rgba(0, 0, 0, 0.85)"; ctx.fillRect(0, 0, canvas.width, canvas.height); let boxW = Math.min(canvas.width * 0.85, 500); let boxH = 280;
        ctx.save(); ctx.fillStyle = "#222"; ctx.strokeStyle = currentTheme.uiColor; ctx.lineWidth = 4; ctx.fillRect(canvas.width/2 - boxW/2, canvas.height/2 - boxH/2, boxW, boxH); ctx.strokeRect(canvas.width/2 - boxW/2, canvas.height/2 - boxH/2, boxW, boxH);
        ctx.fillStyle = currentTheme.uiColor; ctx.textAlign = "center"; ctx.font = "24px 'Press Start 2P', monospace"; ctx.fillText(`LEVEL ${currentLevel} CLEAR`, canvas.width/2, canvas.height/2 - 30); ctx.font = "24px 'VT323', monospace"; ctx.fillStyle = "#FFFFFF"; ctx.fillText("Well done little egg...", canvas.width/2, canvas.height/2 + 20); ctx.fillStyle = "rgba(255, 255, 255, 0.6)"; ctx.fillText("Tap or Press 'R' for Next Stage", canvas.width/2, canvas.height/2 + 80); ctx.restore();
    } else if (gameState === "GAME_OVER") {
        ctx.fillStyle = "rgba(100, 0, 0, 0.85)"; ctx.fillRect(0, 0, canvas.width, canvas.height); let boxW = Math.min(canvas.width * 0.85, 500); let boxH = 280;
        ctx.save(); ctx.fillStyle = "#111"; ctx.strokeStyle = "#FF0000"; ctx.lineWidth = 4; ctx.fillRect(canvas.width/2 - boxW/2, canvas.height/2 - boxH/2, boxW, boxH); ctx.strokeRect(canvas.width/2 - boxW/2, canvas.height/2 - boxH/2, boxW, boxH);
        ctx.fillStyle = "#FF0000"; ctx.textAlign = "center"; ctx.font = "32px 'Press Start 2P', monospace"; ctx.fillText(`GAME OVER`, canvas.width/2, canvas.height/2 - 30); ctx.font = "24px 'VT323', monospace"; ctx.fillStyle = "#FFFFFF"; ctx.fillText(`FINAL SCORE: ${score}`, canvas.width/2, canvas.height/2 + 20); ctx.fillStyle = "rgba(255, 255, 255, 0.6)"; ctx.fillText("Tap or Press 'R' to Retry", canvas.width/2, canvas.height/2 + 80); ctx.restore();
    }

    requestAnimationFrame(update);
}

generateTextures();
loadLevel(1);
update();
