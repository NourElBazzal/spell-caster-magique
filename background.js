class Background {
  constructor() {
    // Étoiles décoratives fixes
    this.staticStars = [];
    for (let i = 0; i < 150; i++) {
      this.staticStars.push({
        x: random(width),
        y: random(height),
        size: random(1, 3),
        brightness: random(100, 255),
        twinkleSpeed: random(0.02, 0.08)
      });
    }
    this.time = 0;
  }

  show() {
    this.time += 0.01;

    // Fond simple et rapide — plus de boucle lente !
    background(8, 8, 35);

    // Étoiles fixes scintillantes
    noStroke();
    for (let s of this.staticStars) {
      let twinkle = map(
        sin(this.time * s.twinkleSpeed * 100), 
        -1, 1, 
        80, s.brightness
      );
      fill(255, 255, 255, twinkle);
      ellipse(s.x, s.y, s.size);
    }
  }

  // Dessiner les zones de sorts
  showZones(spellActive) {
    if (!spellActive) return;

    noFill();
    strokeWeight(1);

    // Juste les bordures légères des zones
    stroke(255, 100, 200, 20);
    rect(0, 0, width, height * 0.33);

    stroke(100, 200, 255, 20);
    rect(0, height * 0.66, width, height * 0.34);

    stroke(200, 200, 255, 20);
    rect(0, height * 0.33, width * 0.5, height * 0.33);

    stroke(255, 220, 100, 20);
    rect(width * 0.5, height * 0.33, width * 0.5, height * 0.33);

    noStroke();
    textSize(13);

    // Labels discrets sur les côtés seulement
    fill(200, 200, 255, 100);
    textAlign(LEFT);
    text("🌙 Lune", 15, height / 2);

    fill(255, 220, 100, 100);
    textAlign(RIGHT);
    text("☀️ Soleil", width - 15, height / 2);

    // Nuage en bas, pas en haut pour ne pas gêner le score
    fill(100, 200, 255, 100);
    textAlign(CENTER);
    text("☁️ Nuage", width / 2, height - 60);

    // Arc-en-ciel très discret sous le score
    fill(255, 100, 200, 80);
    textAlign(CENTER);
    textSize(11);
    text("🌈 Arc-en-ciel", width / 2, 82);

    noStroke();
    textAlign(CENTER);
  }
}