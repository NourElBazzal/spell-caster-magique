class Boss extends Vehicle {
  constructor() {
    super(width / 2, height / 2);
    this.maxSpeed = 2;
    this.maxForce = 0.08;
    this.r = 40;
    this.health = 10;// 10 points de vie
    this.maxHealth = 10;
    this.isAlive = true;
    this.hitTimer = 0; // flash quand touché
    this.angle = 0;
    this.orbitAngle = 0;
    this.wanderTheta = 0;
    this.phase = "wander"; // "wander" ou "pursue"
    this.phaseTimer = 0;
    this.shieldAngle = 0;

    // Étoiles orbitales (bouclier)
    this.shieldStars = [];
    for (let i = 0; i < 5; i++) {
      this.shieldStars.push({
        angle: (TWO_PI / 5) * i,
        size: random(6, 10)
      });
    }
  }

  update(handPos, isOpen, currentSpell) {
    if (!this.isAlive) return;

    this.phaseTimer++;
    this.angle += 0.02;
    this.shieldAngle += 0.03;

    // Alterner entre wander et pursue
    if (this.phaseTimer > 180) {
      this.phase = this.phase === "wander" ? "pursue" : "wander";
      this.phaseTimer = 0;
    }

    let force;
    if (this.phase === "wander") {
      // 🌀 WANDER — déambuler mystérieusement
      force = this.wander();
      this.maxSpeed = 1.5;
    } else {
      // 🏃 PURSUE — fuir la main si sort actif
      if (isOpen && currentSpell !== "none") {
        force = this.flee(handPos);
        this.maxSpeed = 3;
      } else {
        // Poursuivre la main si pas de sort !
        force = this.seek(handPos);
        this.maxSpeed = 2;
      }
    }

    this.applyForce(force);
    super.update();
    this.edges();

    // Timer de hit
    if (this.hitTimer > 0) this.hitTimer--;

    // Vérifier si touché par la main
    if (isOpen && handPos) {
      let d = dist(this.pos.x, this.pos.y, handPos.x, handPos.y);
      if (d < this.r + 30) {
        this.hit();
      }
    }
  }

  hit() {
    if (this.hitTimer > 0) return; // invincible pendant le flash
    this.health--;
    this.hitTimer = 20;
    if (this.health <= 0) {
      this.isAlive = false;
    }
  }

  show() {
    if (!this.isAlive) return;

    push();
    translate(this.pos.x, this.pos.y);

    let flashAlpha = this.hitTimer > 0 ?
      map(this.hitTimer, 20, 0, 200, 0) : 0;

    let healthRatio = this.health / this.maxHealth;
    let auraSize = map(sin(frameCount * 0.05), -1, 1, 0.9, 1.1);

    // Aura externe
    noStroke();
    fill(255, 50, 50, 15);
    ellipse(0, 0, this.r * 6 * auraSize);
    fill(255, 100, 0, 25);
    ellipse(0, 0, this.r * 4 * auraSize);

    // Flash si touché
    if (this.hitTimer > 0) {
      fill(255, 255, 255, flashAlpha);
      ellipse(0, 0, this.r * 3);
    }

    // ===== CORPS DRAGON =====
    rotate(this.angle * 0.5);

    // Couleur selon santé
    let bossR = lerp(255, 200, healthRatio);
    let bossG = lerp(50, 50, healthRatio);
    let bossB = lerp(0, 255, healthRatio);

    // Ailes
    fill(bossR, bossG, bossB, 150);
    // Aile gauche
    beginShape();
    vertex(0, 0);
    vertex(-this.r * 2.5, -this.r * 1.5);
    vertex(-this.r * 3, this.r * 0.5);
    vertex(-this.r * 1.5, this.r * 1);
    endShape(CLOSE);
    // Aile droite
    beginShape();
    vertex(0, 0);
    vertex(this.r * 2.5, -this.r * 1.5);
    vertex(this.r * 3, this.r * 0.5);
    vertex(this.r * 1.5, this.r * 1);
    endShape(CLOSE);

    // Corps principal
    fill(bossR, bossG, bossB, 230);
    ellipse(0, 0, this.r * 1.8, this.r * 2.2);

    // Ventre
    fill(255, 200, 100, 180);
    ellipse(0, this.r * 0.3, this.r * 0.9, this.r * 1.2);

    // Tête
    fill(bossR, bossG, bossB, 230);
    ellipse(0, -this.r * 1.2, this.r * 1.3, this.r * 1.2);

    // Cornes
    fill(255, 220, 0);
    triangle(-this.r * 0.5, -this.r * 1.6,
             -this.r * 0.2, -this.r * 1.8,
             -this.r * 0.1, -this.r * 1.4);
    triangle(this.r * 0.5, -this.r * 1.6,
             this.r * 0.2, -this.r * 1.8,
             this.r * 0.1, -this.r * 1.4);

    // Yeux qui brillent
    fill(255, 255, 0);
    ellipse(-this.r * 0.3, -this.r * 1.3, this.r * 0.35);
    ellipse(this.r * 0.3, -this.r * 1.3, this.r * 0.35);

    fill(255, 0, 0);
    ellipse(-this.r * 0.3, -this.r * 1.3, this.r * 0.18);
    ellipse(this.r * 0.3, -this.r * 1.3, this.r * 0.18);

    // Pupilles
    fill(0);
    ellipse(-this.r * 0.3, -this.r * 1.3, this.r * 0.08);
    ellipse(this.r * 0.3, -this.r * 1.3, this.r * 0.08);

    // Bouche avec flammes
    fill(255, 100, 0);
    arc(0, -this.r * 1.0, this.r * 0.8, this.r * 0.4, 0, PI);

    // Flammes
    if (frameCount % 3 === 0) {
      fill(255, random(100, 200), 0, 200);
      ellipse(random(-10, 10), -this.r * 0.8, random(8, 15));
    }

    // Queue
    noFill();
    stroke(bossR, bossG, bossB, 180);
    strokeWeight(6);
    beginShape();
    vertex(0, this.r);
    vertex(-this.r * 0.5, this.r * 1.5);
    vertex(this.r * 0.8, this.r * 2);
    vertex(-this.r * 0.3, this.r * 2.5);
    endShape();
    noStroke();

    pop();

    // Étoiles orbitantes
    push();
    translate(this.pos.x, this.pos.y);
    for (let s of this.shieldStars) {
      s.angle += 0.04;
      let sx = cos(s.angle) * (this.r * 2.8);
      let sy = sin(s.angle) * (this.r * 2.8);
      fill(255, 150, 0, 200);
      this.drawStar(sx, sy, s.size * 0.4, s.size, 5);
    }
    pop();

    // Nom + barre de vie
    noStroke();
    fill(255, 150, 0);
    textSize(16);
    textAlign(CENTER);
    text("🐉 MALVINA 🐉", this.pos.x, this.pos.y - this.r * 3);

    fill(255, 200, 100, 150);
    textSize(11);
    text(
      this.phase === "wander" ? "🌀 Invocation..." : "⚡ Attaque !",
      this.pos.x,
      this.pos.y - this.r * 2.6
    );

    this.showHealthBar();
  }

  showHealthBar() {
    let barW = 120;
    let barH = 12;
    let barX = this.pos.x - barW / 2;
    let barY = this.pos.y + this.r * 2;

    // Fond barre
    noStroke();
    fill(50, 0, 50, 200);
    rect(barX - 2, barY - 2, barW + 4, barH + 4, 4);

    // Barre de vie
    let healthRatio = this.health / this.maxHealth;
    let healthCol = lerpColor(
      color(255, 50, 50),
      color(100, 255, 100),
      healthRatio
    );
    fill(healthCol);
    rect(barX, barY, barW * healthRatio, barH, 3);

    // Texte vie
    fill(255);
    textSize(10);
    textAlign(CENTER);
    text(`❤️ ${this.health}/${this.maxHealth}`, this.pos.x, barY + barH + 12);
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