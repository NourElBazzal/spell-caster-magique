// Zone de jeu avec marges
let MARGIN_X = 40; // moins de marge gauche/droite
let MARGIN_TOP = 70; // un peu moins en haut
let MARGIN_BOT = 50; // moins en bas

let stars = [];
let messages = []; 
let handDetector;
let bg;
let currentSpell = "none";
let score = 0;
let highScore = 0;
let particles = [];
let totalStars = 15;
let soundManager;
let lastSpell = "none"; // pour éviter de rejouer en boucle
let wizard;

// Animation d'intro
let gameState = "intro"; // "intro" ou "playing"
let introAlpha = 255;
let introTimer = 0;

let showRulesPopup = false;
let pendingGameMode = "libre";

// Mode jeu
let gameMode = "libre"; // "libre" ou "timer"
let timerDuration = 60; // 60 secondes
let timerStart = 0;
let timerRemaining = 60;
let gameOver = false;

let badStars = []; // étoiles maléfiques
let totalBadStars = 3; // 3 étoiles maléfiques au début

let storyManager;
let storyState = "levelIntro"; // "levelIntro", "playing", "transition"
let levelStarsCollected = 0;
let levelIntroTimer = 0;

boss = null;
bossDefeated = false;
bossAppeared = false;
showBossIntro = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('Georgia');

  bg = new Background();

  // Une étoile spéciale dès le début
  stars.push(Star.createSpecial(random(width), random(height)));

  for (let i = 0; i < totalStars; i++) {
    stars.push(new Star(random(width), random(height)));
  }

  handDetector = new HandDetector();
  handDetector.setup();

  soundManager = new SoundManager();
  soundManager.setup();
  wizard = new Wizard();
  storyManager = new StoryManager();
}

function collectStar(i, star) {
  createCelebration(star.pos.x, star.pos.y, star.col);
  let points = star.isSpecial ? 3 : 1;
  score += points;
  if (score > highScore) highScore = score;
  soundManager.playCollect(star.isSpecial);
  showMessage(
    star.isSpecial ? "🌟 SUPER ÉTOILE ! +3" : null,
    star.pos.x, star.pos.y - 20
  );
  stars.splice(i, 1);

  // Compteur niveau histoire
  if (gameMode === "histoire") {
    levelStarsCollected++;
  } else {
    setTimeout(() => {
      if (random() < 0.2) {
        stars.push(Star.createSpecial(random(width), random(height)));
      } else {
        stars.push(new Star(random(width), random(height)));
      }
    }, 2000);
  }
}

function drawMagicFrame() {
  let mx = MARGIN_X;
  let mt = MARGIN_TOP;
  let mb = MARGIN_BOT;
  let pulse = map(sin(frameCount * 0.05), -1, 1, 0.8, 1);
  let pulse2 = map(sin(frameCount * 0.03 + 1), -1, 1, 100, 200);

  // Zones sombres sur les bords
  noStroke();
  fill(0, 0, 20, 120);
  rect(0, 0, mx, height);  // gauche
  rect(width - mx, 0, mx, height);  // droite
  rect(mx, 0, width - mx * 2, mt); // haut
  rect(mx, height - mb, width - mx * 2, mb); // bas

  // Bordure magique
  noFill();
  stroke(150, 80, 255, 30);
  strokeWeight(20);
  rect(mx, mt, width - mx * 2, height - mt - mb, 20);

  stroke(180, 100, 255, 60 * pulse);
  strokeWeight(8);
  rect(mx, mt, width - mx * 2, height - mt - mb, 20);

  stroke(220, 150, 255, pulse2);
  strokeWeight(2);
  rect(mx, mt, width - mx * 2, height - mt - mb, 20);
  noStroke();

  // Coins étoilés
  let corners = [
    {x: mx, y: mt},
    {x: width - mx, y: mt},
    {x: mx, y: height - mb},
    {x: width - mx, y: height - mb}
  ];

  for (let c of corners) {
    fill(200, 150, 255, 40);
    ellipse(c.x, c.y, 40, 40);
    fill(220, 180, 255, 200);
    drawCornerStar(c.x, c.y, 6, 14, 5);
  }

  // Particules sur la bordure
  if (frameCount % 3 === 0) {
    let side = floor(random(4));
    let px, py;
    if (side === 0) { px = random(mx, width - mx); py = mt; }
    else if (side === 1) { px = random(mx, width - mx); py = height - mb; }
    else if (side === 2) { px = mx; py = random(mt, height - mb); }
    else { px = width - mx; py = random(mt, height - mb); }

    fill(random([
      color(255, 100, 200, 150),
      color(100, 200, 255, 150),
      color(200, 150, 255, 150),
      color(255, 220, 100, 150)
    ]));
    ellipse(px, py, random(3, 7));
  }
}

function drawCornerStar(x, y, r1, r2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = -HALF_PI; a < TWO_PI - HALF_PI; a += angle) {
    vertex(x + cos(a) * r2, y + sin(a) * r2);
    vertex(x + cos(a + halfAngle) * r1, y + sin(a + halfAngle) * r1);
  }
  endShape(CLOSE);
}

function draw() {
  // Fond
  bg.show();

  if (gameState === "intro") {
    drawIntro();
    if (showRulesPopup) {
      drawRulesPopup();
    }
    return;
  }

  if (gameState === "gameover") {
    drawGameOver();
    handDetector.showMiniCam();
    return;
  }

  // Cadre magique avant tout le reste
  drawMagicFrame();

  // Déterminer le sort actif
  updateSpell();

  // Mode histoire
  if (gameMode === "histoire") {

    // Intro du niveau
    if (storyState === "levelIntro") {
      levelIntroTimer++;
      storyManager.showLevelIntro(levelIntroTimer);

      // Commencer si main détectée
      if (handDetector.predictions.length > 0 && levelIntroTimer > 60) {
        storyState = "playing";
        timerStart = millis();
      }
      handDetector.showMiniCam();
      return;
    }

    // Transition entre niveaux
    if (storyState === "transition") {
      let stillShowing = storyManager.showTransition(score);
      if (!stillShowing) {
        // Passer au niveau suivant
        let hasNext = storyManager.nextLevel();
        if (hasNext) {
          loadLevel();
          storyState = "levelIntro";
          levelIntroTimer = 0;
        } else {
          // Jeu terminé !
          gameState = "gameover";
        }
      }
      handDetector.showMiniCam();
      return;
    }

    // Timer du niveau
    timerRemaining = timerDuration - (millis() - timerStart) / 1000;
    if (timerRemaining <= 0) {
      timerRemaining = 0;
      gameState = "gameover";
    }

    // Vérifier si niveau terminé
    if (stars.length === 0 && storyState === "playing") {
      storyState = "transition";
      storyManager.levelComplete = true;
      storyManager.showingTransition = true;
      storyManager.transitionTimer = 0;
      soundManager.playCollect(true);
    }
  }

  // Gérer le timer
  if (gameMode === "timer" && !gameOver) {
    timerRemaining = timerDuration - (millis() - timerStart) / 1000;

    if (timerRemaining <= 0) {
      timerRemaining = 0;
      gameOver = true;
      gameState = "gameover";
    }
  }

  // Zones visuelles
  bg.showZones(handDetector.predictions.length > 0);

  // Masquer ce qui dépasse du cadre
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.roundRect( MARGIN_X, MARGIN_TOP, width - MARGIN_X * 2, height - MARGIN_TOP - MARGIN_BOT, 20);
  drawingContext.clip();

  // Étoiles
  for (let i = stars.length - 1; i >= 0; i--) {
    let star = stars[i];
    star.update(currentSpell, handDetector.handPos);
    star.show(currentSpell);

    // Collecter si main OUVERTE
    if (handDetector.predictions.length > 0 && handDetector.isOpen) {
      let d = dist(
        star.pos.x, star.pos.y,
        handDetector.handPos.x, handDetector.handPos.y
      );
      if (d < 40) {
        collectStar(i, star);
      }
    }
  }

  // Étoiles maléfiques
  for (let i = badStars.length - 1; i >= 0; i--) {
    let bad = badStars[i];
    bad.update(handDetector.handPos, handDetector.isOpen);
    bad.show();

    // Si attrapée → pénalité !
    if (handDetector.predictions.length > 0 && handDetector.isOpen) {
      let d = dist(
        bad.pos.x, bad.pos.y,
        handDetector.handPos.x, handDetector.handPos.y
      );

      if (d < 40) {
        // Pénalité !
        score = max(0, score + bad.points);
        soundManager.playNote(150, 0, 0.4, 0.3, 'sawtooth');
        showMessage("💀 -2 Attention !", bad.pos.x, bad.pos.y - 20);
        createCelebration(bad.pos.x, bad.pos.y, color(180, 50, 255));

        // Réapparaître ailleurs
        badStars[i] = new BadStar(
          random(width),
          random(height)
        );
      }
    }
  }

  // Apparition du boss après 30 points
  if (score >= 30 && !bossAppeared && gameMode !== "histoire") {
    bossAppeared = true;
    showBossIntro = true;
    bossIntroTimer = 0;
    boss = new Boss();
    showMessage("👁️ MALVINA APPARAÎT !", width/2, height/2);
    soundManager.playNote(150, 0, 0.8, 0.4, 'sawtooth');
  }

  // Boss
  if (boss && boss.isAlive) {
    boss.update(handDetector.handPos, handDetector.isOpen, currentSpell);
    boss.show();
  }

  // Intro du boss
  if (showBossIntro) {
    bossIntroTimer++;

    if (bossIntroTimer < 120) {
      // Fond assombri
      fill(0, 0, 0, 150);
      rect(0, 0, width, height);

      // Carte/popup centrée
      let cardW = 500;
      let cardH = 220;
      let cardX = width / 2 - cardW / 2;
      let cardY = height / 2 - cardH / 2;

      // Ombre de la carte
      fill(0, 0, 0, 100);
      rect(cardX + 8, cardY + 8, cardW, cardH, 20);

      // Corps de la carte
      fill(40, 0, 60);
      rect(cardX, cardY, cardW, cardH, 20);

      // Bordure animée
      let borderPulse = map(sin(frameCount * 0.1), -1, 1, 150, 255);
      stroke(255, 100, 0, borderPulse);
      strokeWeight(3);
      noFill();
      rect(cardX, cardY, cardW, cardH, 20);
      noStroke();

      // Titre
      fill(255, 100, 0);
      textSize(32);
      textAlign(CENTER);
      text("🐉 MALVINA ARRIVE ! 🐉", width / 2, cardY + 55);

      // Séparateur
      stroke(255, 100, 0, 100);
      strokeWeight(1);
      line(cardX + 30, cardY + 70, cardX + cardW - 30, cardY + 70);
      noStroke();

      // Description
      fill(200, 150, 255);
      textSize(16);
      text("La méchante sorcière dragon est là !", width / 2, cardY + 100);

      fill(255, 200, 100);
      textSize(14);
      text("⚔️ Touche-la avec ta main ouverte pour la blesser !", width / 2, cardY + 130);
      text("🌀 Elle fuit tes sorts mais t'attaque si tu n'en as pas !", width / 2, cardY + 155);

      // Compte à rebours
      let countdown = ceil(map(bossIntroTimer, 0, 120, 3, 0));
      fill(255, 100, 0, borderPulse);
      textSize(20);
      text(`Prépare-toi... ${countdown}`, width / 2, cardY + 195);

    } else {
      showBossIntro = false;
    }
  }

  // Boss vaincu
  if (boss && !boss.isAlive && !bossDefeated) {
    bossDefeated = true;
    score += 10; // Bonus victoire !
    showMessage("🏆 MALVINA VAINCUE ! +10 !", width/2, height/2);
    soundManager.playCollect(true);

    // Explosion de particules
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        createCelebration(
          boss.pos.x + random(-50, 50),
          boss.pos.y + random(-50, 50),
          color(255, random(50, 200), 255)
        );
      }, i * 200);
    }

    // Nouveau boss après 10 secondes plus fort
    setTimeout(() => {
      boss = new Boss();
      boss.health = 15;
      boss.maxHealth = 15;
      boss.maxSpeed = 3;
      bossDefeated = false;
      showMessage("👁️ MALVINA REVIENT ! +5 vie !", width/2, height/2);
    }, 10000);
  }

  // Particules
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].show();
    if (particles[i].isDead()) particles.splice(i, 1);
  }

  drawingContext.restore();

  // Sorcier
  if (handDetector.predictions.length > 0) {
    wizard.update(handDetector.handPos, currentSpell);
    wizard.show();
  }

  // Effets sort
  drawSpellEffect();
  handDetector.showMiniCam();
  drawMessages();
  // UI
  drawUI();

}

function drawRulesPopup() {
  // Fond féerique animé
  background(8, 8, 35);

  // Étoiles scintillantes derrière le popup
  for (let i = 0; i < 80; i++) {
    let x = noise(i * 0.5, frameCount * 0.005) * width;
    let y = noise(i * 0.5 + 100, frameCount * 0.005) * height;
    let alpha = map(sin(frameCount * 0.05 + i), -1, 1, 50, 200);
    let size = random(1, 3);
    noStroke();
    fill(255, 255, 255, alpha);
    ellipse(x, y, size);
  }

  // Particules magiques colorées
  for (let i = 0; i < 5; i++) {
    let px = random(width);
    let py = random(height);
    let cols = [
      color(255, 100, 200, 80),
      color(100, 200, 255, 80),
      color(200, 200, 255, 80),
      color(255, 220, 100, 80)
    ];
    fill(cols[floor(random(cols.length))]);
    ellipse(px, py, random(3, 8));
  }

  let popW = 520;
  let popH = 340;
  let popX = width / 2 - popW / 2;
  let popY = height / 2 - popH / 2;

  // Ombre
  fill(0, 0, 0, 100);
  rect(popX + 8, popY + 8, popW, popH, 20);

  // Corps popup
  fill(20, 10, 40);
  rect(popX, popY, popW, popH, 20);

  // Bordure animée dorée
  let pulse = map(sin(frameCount * 0.08), -1, 1, 150, 255);
  stroke(200, 150, 255, pulse);
  strokeWeight(2);
  noFill();
  rect(popX, popY, popW, popH, 20);
  noStroke();

  textAlign(CENTER);
  noStroke();

  // Titre
  fill(200, 150, 255);
  textSize(28);
  text("🪄 Avant de commencer !", width / 2, popY + 45);

  // Séparateur
  stroke(200, 150, 255, 80);
  line(popX + 30, popY + 58, popX + popW - 30, popY + 58);
  noStroke();

  // Règle 1
  fill(180, 50, 255);
  textSize(15);
  text("💀 Évite les étoiles violettes !", width / 2, popY + 85);
  fill(200, 180, 255, 180);
  textSize(12);
  text("Si tu les attrapes → -2 points !", width / 2, popY + 103);

  // Règle 2
  fill(255, 150, 0);
  textSize(15);
  text("🐉 Attention au Dragon Malvina !", width / 2, popY + 130);
  fill(200, 180, 255, 180);
  textSize(12);
  text("Apparaît à 30pts touche-la pour +10pts !", width / 2, popY + 148);

  // Règle 3
  fill(100, 255, 150);
  textSize(15);
  text("✋ Main ouverte = Sort actif", width / 2, popY + 175);
  fill(200, 180, 255, 180);
  textSize(12);
  text("Main fermée = Sort inactif", width / 2, popY + 193);

  // Règle 4
  fill(255, 220, 100);
  textSize(15);
  text("🌈 4 sorts selon la position de ta main", width / 2, popY + 220);
  fill(200, 180, 255, 180);
  textSize(12);
  text("HAUT → Arc-en-ciel  |  BAS → Nuage", width / 2, popY + 238);
  text("GAUCHE → Lune  |  DROITE → Soleil", width / 2, popY + 253);

  // Bouton J'ai compris
  let btnX = width / 2 - 100;
  let btnY = popY + popH - 65;
  let btnW = 200;
  let btnH = 45;

  let btnHover = mouseX > btnX && mouseX < btnX + btnW &&  mouseY > btnY && mouseY < btnY + btnH;

  // Lueur bouton
  fill(150, 50, 255, 40);
  rect(btnX - 2, btnY - 2, btnW + 4, btnH + 4, 14);

  // Corps bouton
  fill(btnHover ? color(160, 80, 255) : color(100, 30, 180));
  rect(btnX, btnY, btnW, btnH, 12);

  // Bordure bouton
  stroke(200, 150, 255, 180);
  strokeWeight(1);
  noFill();
  rect(btnX, btnY, btnW, btnH, 12);
  noStroke();

  fill(255, 220, 255);
  textSize(18);
  text("J'ai compris !", width / 2, btnY + 30);
}

function drawIntro() {
  introTimer++;

  // Titre principal
  textAlign(CENTER);
  noStroke();

  // Lueur derrière le titre
  fill(150, 50, 255, 30);
  textSize(90);
  text("✨ Spell Caster ✨", width / 2 + 3, height / 2 - 150 + 3);

  // Titre
  fill(255, 220, 100);
  textSize(80);
  text("✨ Spell Caster ✨", width / 2, height / 2 - 150);

  // Sous-titre
  fill(200, 180, 255);
  textSize(22);
  text("🪄 Attrape les étoiles magiques avec ta main !", width / 2, height / 2 - 85);

  // Instructions sorts
  fill(150, 200, 255, 200);
  textSize(16);
  text("       ✋ Main HAUT   → 🌈 Sort Arc-en-ciel", width / 2, height / 2 - 40);
  text("✋ Main BAS       → ☁️  Sort Nuage", width / 2, height / 2 - 12);
  text("✋ Main GAUCHE → 🌙 Sort Lune", width / 2, height / 2 + 16);
  text("✋ Main DROITE  → ☀️  Sort Soleil", width / 2, height / 2 + 44);

  // Boutons mode
  textSize(20);

  // Mode Libre
  let libreHover = mouseX > width/2 - 180 && mouseX < width/2 - 20 && mouseY > height/2 + 70 && mouseY < height/2 + 110;
  fill(libreHover ? color(100, 200, 255) : color(50, 100, 180));
  rect(width/2 - 180, height/2 + 70, 160, 40, 10);
  fill(255);
  textSize(18);
  text("🌟 Mode Libre", width/2 - 100, height/2 + 97);

  // Mode Timer
  let timerHover = mouseX > width/2 + 20 && mouseX < width/2 + 180 && mouseY > height/2 + 70 && mouseY < height/2 + 110;
  fill(timerHover ? color(255, 150, 100) : color(180, 80, 50));
  rect(width/2 + 20, height/2 + 70, 160, 40, 10);
  fill(255);
  textSize(18);
  text("⏱️ Mode Timer", width/2 + 100, height/2 + 97);

  // Mode Histoire  centré en dessous
  let histoireHover = mouseX > width/2 - 90 && mouseX < width/2 + 90 &&  mouseY > height/2 + 125 && mouseY < height/2 + 165;
  fill(histoireHover ? color(150, 255, 150) : color(50, 130, 50));
  rect(width/2 - 90, height/2 + 125, 180, 40, 10);
  fill(255);
  textSize(18);
  text("📖 Mode Histoire", width/2, height/2 + 152);

  // Instruction démarrer  bien en dessous
  let pulse = map(sin(frameCount * 0.05), -1, 1, 150, 255);
  fill(100, 255, 150, pulse);
  textSize(16);
  text("👆 Clique sur un mode ou montre ta main !", width / 2, height / 2 + 195);

  // Démarrer en mode libre si main détectée
  if (handDetector.predictions.length > 0 && introTimer > 60 && !showRulesPopup) {
    pendingGameMode = "libre";
    showRulesPopup = true;
  }
}

function updateSpell() {
  if (handDetector.isReady && handDetector.predictions.length > 0) {
    if (handDetector.isOpen) {
      switch(handDetector.zone) {
        case "haut": currentSpell = "arc-en-ciel"; break;
        case "bas": currentSpell = "nuage"; break;
        case "gauche": currentSpell = "lune"; break;
        case "droite": currentSpell = "soleil"; break;
      }
    } else {
      currentSpell = "none";
    }
  } else {
    currentSpell = "none";
  }

  // Jouer le son du sort quand il change
  if (currentSpell !== lastSpell && currentSpell !== "none") {
   soundManager.playSpell(currentSpell);
  }
  lastSpell = currentSpell;
}

function createCelebration(x, y, col) {
  for (let i = 0; i < 15; i++) {
    particles.push(new Particle(x, y, col));
  }
}

function drawSpellEffect() {
  if (!handDetector.isReady || handDetector.predictions.length === 0) return;

  let pos = handDetector.handPos;
  let isOpen = handDetector.isOpen;

  // Particules magiques si sort actif
  if (currentSpell !== "none" && isOpen) {
    let ringCol = getSpellColor(currentSpell);
    for (let i = 0; i < 3; i++) {
      let px = pos.x + random(-40, 40);
      let py = pos.y + random(-40, 40);
      noStroke();
      fill(red(ringCol), green(ringCol), blue(ringCol), random(100, 200));
      ellipse(px, py, random(3, 8));
    }
  }

  // Indicateur OUVERT/FERMÉ au dessus du sorcier
  let handColor = isOpen ? color(100, 255, 150) : color(255, 100, 100);
  fill(0, 0, 0, 150);
  rectMode(CENTER);
  rect(pos.x, pos.y - 75, 120, 26, 10);
  rectMode(CORNER);
  fill(red(handColor), green(handColor), blue(handColor));
  textSize(13);
  textAlign(CENTER);
  text(isOpen ? "✋ OUVERTE" : "✊ FERMÉE", pos.x, pos.y - 66);
}

function getSpellColor(spell) {
  switch(spell) {
    case "arc-en-ciel": return color(255, 100, 200);
    case "nuage": return color(100, 200, 255);
    case "lune": return color(200, 200, 255);
    case "soleil": return color(255, 220, 100);
    default: return color(255);
  }
}

function drawUI() {
  noStroke();
  textAlign(CENTER);

  // Score en haut
  fill(255, 220, 100);
  textSize(36);
  text(`⭐ ${score}`, width / 2, 45);

  // Meilleur score juste sous le score
  fill(200, 180, 255, 150);
  textSize(13);
  text(`Meilleur : ${highScore}`, width / 2, 65);

  // Timer EN DESSOUS du meilleur score
  if (gameMode === "timer") {
    let t = ceil(timerRemaining);
    let timerCol;
    if (t > 30) timerCol = color(100, 255, 150);
    else if (t > 10) timerCol = color(255, 200, 50);
    else timerCol = color(255, 80, 80);

    // Fond timer
    fill(0, 0, 0, 150);
    rectMode(CENTER);
    rect(width / 2, 95, 120, 30, 10);
    rectMode(CORNER);

    // Texte timer
    fill(timerCol);
    textSize(t <= 10 ? 26 : 20);
    textAlign(CENTER);
    text(`⏱️ ${t}s`, width / 2, 102);

    // Barre de progression
    let barW = 200;
    let barX = width / 2 - barW / 2;
    let progress = map(timerRemaining, 0, timerDuration, 0, barW);
    fill(50, 50, 50, 150);
    rect(barX, 114, barW, 6, 3);
    fill(red(timerCol), green(timerCol), blue(timerCol));
    rect(barX, 114, progress, 6, 3);
  }

  // Timer mode histoire
  if (gameMode === "histoire" && storyState === "playing") {
    let t = ceil(timerRemaining);
    let timerCol;
    if (t > 30) timerCol = color(100, 255, 150);
    else if (t > 10) timerCol = color(255, 200, 50);
    else timerCol = color(255, 80, 80);

    fill(0, 0, 0, 150);
    rectMode(CENTER);
    rect(width / 2, 95, 120, 30, 10);
    rectMode(CORNER);

    fill(timerCol);
    textSize(t <= 10 ? 26 : 20);
    textAlign(CENTER);
    text(`⏱️ ${t}s`, width / 2, 102);

    let barW = 200;
    let barX = width / 2 - barW / 2;
    let progress = map(timerRemaining, 0, timerDuration, 0, barW);
    fill(50, 50, 50, 150);
    rect(barX, 114, barW, 6, 3);
    fill(red(timerCol), green(timerCol), blue(timerCol));
    rect(barX, 114, progress, 6, 3);
  }

  // Niveau actuel en mode histoire
  if (gameMode === "histoire") {
    fill(200, 180, 255);
    textSize(14);
    textAlign(LEFT);
    text(`Niveau ${storyManager.currentLevel}/5`, 120, 32);

    // Barre de progression niveau
    storyManager.showLevelProgress();
  }

  // Sort actif en bas
  if (currentSpell !== "none") {
    let spellNames = {
      "arc-en-ciel": "🌈 Sort Arc-en-ciel",
      "nuage":       "☁️ Sort Nuage",
      "lune":        "🌙 Sort Lune",
      "soleil":      "☀️ Sort Soleil"
    };
    let c = getSpellColor(currentSpell);
    fill(red(c), green(c), blue(c));
    textSize(22);
    textAlign(CENTER);
    text(spellNames[currentSpell], width / 2, height - 20);
  }

  /*Avertissement étoiles maléfiques
  fill(180, 50, 255, 150);
  textSize(13);
  textAlign(LEFT);
  text("💀 Évite les étoiles violettes ! (-2)", 15, height - 15);*/

  // Indicateur boss
  if (boss && boss.isAlive && bossAppeared) {
    fill(255, 0, 100, 200);
    textSize(13);
    textAlign(RIGHT);
    text("👁️ Touche Malvina avec ta main !", width - 15, height - 15);
  }

  // Instructions si pas de main
  if (handDetector.isReady && handDetector.predictions.length === 0) {
    fill(200, 200, 255, 180);
    textSize(16);
    textAlign(CENTER);
    text("🖐️ Montre ta main pour lancer un sort !", width / 2, height - 20);
  } else if (handDetector.isReady && !handDetector.isOpen) {
    fill(200, 200, 255, 180);
    textSize(16);
    textAlign(CENTER);
    text("✋ Ouvre la main pour lancer un sort !", width / 2, height - 20);
  }

  // Bouton Menu en haut à gauche
  let btnHover = mouseX > 10 && mouseX < 110 && mouseY > 10 && mouseY < 45;

  // Lueur
  noStroke();
  fill(150, 50, 255, 40);
  rect(8, 8, 104, 39, 10);

  // Corps
  fill(btnHover ? color(160, 80, 255) : color(100, 30, 180, 220));
  rect(10, 10, 100, 35, 8);

  // Bordure
  stroke(200, 150, 255, 180);
  strokeWeight(1);
  noFill();
  rect(10, 10, 100, 35, 8);
  noStroke();

  // Texte
  fill(255, 220, 255);
  textSize(13);
  textAlign(LEFT);
  text("🏠 Menu", 20, 32);

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function showMessage(text, x, y) {
  let msgs = [
    "✨ Super !",
    "🌟 Magique !",
    "🎉 Incroyable !",
    "🪄 Bravo petit sorcier !",
    "💫 Fantastique !",
    "⭐ Parfait !",
    "🌈 Magnifique !"
  ];

  messages.push({
    text: text || msgs[floor(random(msgs.length))],
    x: x,
    y: y,
    alpha: 255,
    size: 22,
    vel: -2
  });
}

function drawMessages() {
  for (let i = messages.length - 1; i >= 0; i--) {
    let m = messages[i];
    m.y += m.vel;
    m.alpha -= 4;

    noStroke();
    textAlign(CENTER);

    // Ombre
    fill(0, 0, 0, m.alpha * 0.5);
    textSize(m.size);
    text(m.text, m.x + 2, m.y + 2);

    // Texte principal
    fill(255, 255, 150, m.alpha);
    text(m.text, m.x, m.y);

    if (m.alpha <= 0) messages.splice(i, 1);
  }
}

function loadLevel() {
  let level = storyManager.getCurrentLevel();
  stars = [];
  badStars = [];
  levelStarsCollected = 0;

  // Étoiles du niveau
  for (let i = 0; i < level.starCount; i++) {
    let s = new Star(random(width), random(height));
    s.maxSpeed = level.starSpeed;
    stars.push(s);
  }

  // Étoiles maléfiques du niveau
  for (let i = 0; i < level.badStarCount; i++) {
    badStars.push(new BadStar(random(width), random(height)));
  }

  // Timer du niveau
  if (gameMode === "histoire") {
    timerDuration = level.timeLimit;
    timerStart = millis();
    timerRemaining = level.timeLimit;
  }
}

function startGame(mode) {
  gameMode = mode;
  gameOver = false;
  score = 0;
  stars = [];
  badStars = [];
  particles = [];
  messages = [];
  wizard = new Wizard();
  boss = null;
  bossDefeated = false;
  bossAppeared = false;
  showBossIntro = false;

  if (mode === "histoire") {
    storyManager = new StoryManager();
    storyState = "levelIntro";
    levelIntroTimer = 0;
    levelStarsCollected = 0;
    loadLevel();
  } else {
    for (let i = 0; i < totalStars; i++) {
      if (random() < 0.2) {
        stars.push(Star.createSpecial(random(width), random(height)));
      } else {
        stars.push(new Star(random(width), random(height)));
      }
    }
    for (let i = 0; i < totalBadStars; i++) {
      badStars.push(new BadStar(random(width), random(height)));
    }
  }

  if (mode === "timer") {
    timerStart = millis();
    timerRemaining = timerDuration;
  }

  gameState = "playing";
  soundManager.ensureAudio();
}

function mousePressed() {
  // Popup règles  priorité absolue
  if (showRulesPopup) {
    let popH = 340;
    let popY = height / 2 - popH / 2;
    let btnX = width / 2 - 100;
    let btnY = popY + popH - 65;
    let btnW = 200;
    let btnH = 45;
    if (mouseX > btnX && mouseX < btnX + btnW && mouseY > btnY && mouseY < btnY + btnH) {
      showRulesPopup = false;
      startGame(pendingGameMode);
    }
    return;
  }

  if (gameState === "intro") {
    // Mode Libre
    if (mouseX > width/2 - 180 && mouseX < width/2 - 20 && mouseY > height/2 + 70 && mouseY < height/2 + 110) {
      pendingGameMode = "libre";
      showRulesPopup = true;
    }
    // Mode Timer
    if (mouseX > width/2 + 20 && mouseX < width/2 + 180 && mouseY > height/2 + 70 && mouseY < height/2 + 110) {
      pendingGameMode = "timer";
      showRulesPopup = true;
    }
    // Mode Histoire
    if (mouseX > width/2 - 90 && mouseX < width/2 + 90 && mouseY > height/2 + 125 && mouseY < height/2 + 165) {
      pendingGameMode = "histoire";
      showRulesPopup = true;
    }
  }

  // Bouton Menu pendant le jeu
  if (gameState === "playing") {
    if (mouseX > 10 && mouseX < 110 && mouseY > 10 && mouseY < 45) {
      gameState = "intro";
      introTimer = 0;
      currentSpell = "none";
      lastSpell = "none";
    }
  }

  // Rejouer depuis game over
  if (gameState === "gameover") {
    gameState = "intro";
    introTimer = 0;
  }
}

function drawGameOver() {
  // Fond semi-transparent
  fill(0, 0, 0, 180);
  rect(0, 0, width, height);

  textAlign(CENTER);
  noStroke();

  // Titre
  fill(255, 220, 100);
  textSize(70);
  text("⏰ Temps écoulé !", width / 2, height / 2 - 100);

  // Score final
  fill(255);
  textSize(30);
  text(`Tu as collecté ⭐ ${score} étoiles !`, width / 2, height / 2 - 30);

  // Meilleur score
  if (score >= highScore) {
    fill(255, 215, 0);
    textSize(26);
    text("🏆 NOUVEAU RECORD !", width / 2, height / 2 + 20);
  } else {
    fill(200, 180, 255);
    textSize(22);
    text(`Meilleur score : ${highScore}`, width / 2, height / 2 + 20);
  }

  // Message selon score
  fill(150, 255, 150);
  textSize(20);
  let msg = "";
  if (score < 10) msg = "Continue à t'entraîner petit sorcier ! 🪄";
  else if (score < 20) msg = "Pas mal du tout ! Tu progresses ! ⭐";
  else if (score < 35) msg = "Excellent sorcier ! Tu maîtrises la magie ! 🌟";
  else msg = "LÉGENDAIRE ! Tu es le grand sorcier ! 👑";
  text(msg, width / 2, height / 2 + 70);

  // Bouton rejouer
  let pulse = map(sin(frameCount * 0.05), -1, 1, 200, 255);
  fill(100, 200, 255, pulse);
  textSize(24);
  text("👆 Clique pour rejouer !", width / 2, height / 2 + 130);
}

