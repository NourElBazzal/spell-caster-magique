class BadStar extends Vehicle {
  constructor(x, y) {
    super(x, y);
    this.maxSpeed = 3;
    this.maxForce = 0.15;
    this.r = 14;
    this.isBad = true;
    this.points = -2; // pénalité si attrapée !

    // Couleur violette/rouge menaçante
    this.col = color(180, 50, 255);
    this.brightness = random(150, 255);
    this.brightnessDir = 1;
    this.angle = random(TWO_PI);
    this.wanderTheta = random(TWO_PI);

    // Aura maléfique
    this.auraSize = 0;
    this.auraDir = 1;
  }

  update(handPos, isOpen) {
    let force;

    if (isOpen && handPos) {
      // 🧲 FLEE — fuir la main quand elle est ouverte !
      let d = dist(this.pos.x, this.pos.y, handPos.x, handPos.y);

      if (d < 300) {
        // Si la main est proche → fuit rapidement
        force = this.flee(handPos);
        force.mult(2.5);
        this.maxSpeed = 5;
      } else {
        // Sinon → déambule
        force = this.wander();
        this.maxSpeed = 2;
      }
    } else {
      // Main fermée → wander normal
      force = this.wander();
      this.maxSpeed = 2;
    }

    this.applyForce(force);
    super.update();
    this.edges();

    // Scintillement
    this.brightness += this.brightnessDir * 4;
    if (this.brightness > 255 || this.brightness < 150) {
      this.brightnessDir *= -1;
    }

    // Aura pulsante
    this.auraSize += this.auraDir * 0.5;
    if (this.auraSize > 15 || this.auraSize < 0) {
      this.auraDir *= -1;
    }

    this.angle += 0.03;
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y);

    // Aura maléfique externe
    noStroke();
    fill(180, 50, 255, 20);
    ellipse(0, 0, (this.r + this.auraSize) * 5);

    fill(180, 50, 255, 40);
    ellipse(0, 0, (this.r + this.auraSize) * 3.5);

    // Rotation inverse pour effet maléfique
    rotate(-this.angle * 2);

    // Corps de l'étoile maléfique
    fill(180, 50, 255, this.brightness);
    this.drawStar(0, 0, this.r * 0.4, this.r, 6); // 6 branches !

    // Centre noir
    fill(20, 0, 40, 200);
    ellipse(0, 0, this.r * 0.8);

    // Petit crâne symbolique au centre
    fill(180, 50, 255, 200);
    textSize(10);
    textAlign(CENTER);
    text("💀", 0, 4);

    pop();
  }

  // Dessiner étoile à 6 branches
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