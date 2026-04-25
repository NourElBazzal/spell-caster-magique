class Wizard {
  constructor() {
    this.pos = createVector(width / 2, height / 2);
    this.targetPos = createVector(width / 2, height / 2);
    this.vel = createVector(0, 0);
    this.currentSpell = "none";
    this.wandAngle = 0;
    this.bodyBob = 0;
    this.bodyBobDir = 1;
    this.blinkTimer = 0;
    this.isBlinking = false;
  }

  update(handPos, spell) {
    this.currentSpell = spell;

    // Le sorcier EST la main — il suit exactement
    this.pos = handPos.copy();

    // Animation corps
    this.bodyBob += this.bodyBobDir * 0.05;
    if (this.bodyBob > 1 || this.bodyBob < -1) this.bodyBobDir *= -1;

    // Animation baguette
    this.wandAngle = map(sin(frameCount * 0.08), -1, 1, -0.4, 0.4);

    // Clignement
    this.blinkTimer++;
    if (this.blinkTimer > 180) {
      this.isBlinking = true;
      if (this.blinkTimer > 190) {
        this.isBlinking = false;
        this.blinkTimer = 0;
      }
    }
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y + this.bodyBob * 3);

    // Direction vers la main
    let spellCol = this.getSpellColor();

    // ===== CAPE =====
    fill(60, 20, 100);
    noStroke();
    // Corps cape
    beginShape();
    vertex(-18, 0);
    vertex(18, 0);
    vertex(22, 45);
    vertex(0, 50);
    vertex(-22, 45);
    endShape(CLOSE);

    // Étoiles sur la cape
    fill(spellCol);
    this.drawStar(-8, 20, 2, 5, 5);
    this.drawStar(8, 30, 2, 5, 5);
    this.drawStar(-5, 38, 1.5, 4, 5);

    // ===== CHAPEAU =====
    // Bord du chapeau
    fill(40, 10, 80);
    ellipse(0, -15, 36, 10);

    // Cone du chapeau
    fill(50, 15, 90);
    triangle(-12, -15, 12, -15, 0, -55);

    // Étoile sur le chapeau
    fill(spellCol);
    this.drawStar(0, -35, 3, 7, 5);

    // Bande du chapeau
    fill(spellCol);
    rect(-12, -20, 24, 6);

    // ===== VISAGE =====
    // Tête
    fill(255, 220, 180);
    ellipse(0, -5, 28, 26);

    // Yeux
    fill(30, 30, 80);
    if (!this.isBlinking) {
      ellipse(-6, -7, 6, 7);
      ellipse(6, -7, 6, 7);
      // Reflet yeux
      fill(255);
      ellipse(-5, -9, 2, 2);
      ellipse(7, -9, 2, 2);
    } else {
      // Clignement
      stroke(30, 30, 80);
      strokeWeight(1.5);
      line(-9, -7, -3, -7);
      line(3, -7, 9, -7);
      noStroke();
    }

    // Sourire
    noFill();
    stroke(150, 80, 60);
    strokeWeight(1.5);
    arc(0, -1, 12, 8, 0, PI);
    noStroke();

    // Joues roses
    fill(255, 150, 150, 100);
    ellipse(-9, -2, 8, 5);
    ellipse(9, -2, 8, 5);

    // Nez
    fill(220, 160, 130);
    ellipse(0, -3, 5, 4);

    // ===== BAGUETTE =====
    push();
    translate(15, 10);
    rotate(this.wandAngle + 0.5);

    // Manche baguette
    stroke(100, 60, 20);
    strokeWeight(3);
    line(0, 0, 25, 25);
    noStroke();

    // Bout magique baguette
    fill(spellCol);
    ellipse(25, 25, 10, 10);

    // Étincelles au bout
    if (this.currentSpell !== "none") {
      for (let i = 0; i < 3; i++) {
        let sparkX = 25 + random(-12, 12);
        let sparkY = 25 + random(-12, 12);
        fill(red(spellCol), green(spellCol), blue(spellCol), random(150, 255));
        ellipse(sparkX, sparkY, random(2, 5));
      }
    }
    pop();

    // ===== MAINS =====
    fill(255, 220, 180);
    // Main gauche
    ellipse(-20, 15, 10, 10);
    // Main droite (tient la baguette)
    ellipse(16, 12, 10, 10);

    pop();
  }

  getSpellColor() {
    switch(this.currentSpell) {
      case "arc-en-ciel": return color(255, 100, 200);
      case "nuage": return color(100, 200, 255);
      case "lune": return color(200, 200, 255);
      case "soleil": return color(255, 220, 100);
      default: return color(200, 180, 255);
    }
  }

  drawStar(x, y, r1, r2, npoints) {
    let angle = TWO_PI / npoints;
    let halfAngle = angle / 2.0;
    beginShape();
    for (let a = -HALF_PI; a < TWO_PI - HALF_PI; a += angle) {
      vertex(x + cos(a) * r2, y + sin(a) * r2);
      vertex(x + cos(a + halfAngle) * r1, y + sin(a + halfAngle) * r1);
    }
    endShape(CLOSE);
  }
}