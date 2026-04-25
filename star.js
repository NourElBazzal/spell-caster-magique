class Star extends Vehicle {
  constructor(x, y) {
    super(x, y);
    this.maxSpeed = 2;
    this.maxForce = 0.1;
    this.r = 12;

    this.col = color(
      random(150, 255),
      random(150, 255),
      random(200, 255)
    );

    this.brightness = random(150, 255);
    this.brightnessDir = 1;
    this.angle = random(TWO_PI);
    
    // Sort actif sur cette étoile
    this.currentSpell = "none";
  }

  // Appliquer un sort
  applySpell(spell, handPos) {
    this.currentSpell = spell;
    let force;

    switch(spell) {
      case "arc-en-ciel":
        // SEEK — étoiles foncent vers la main
        force = this.seek(handPos);
        force.mult(2.5);
        this.applyForce(force);
        this.maxSpeed = 5;
        break;

      case "nuage":
        // WANDER — étoiles déambulent paisiblement
        force = this.wander();
        force.mult(0.5);
        this.applyForce(force);
        this.maxSpeed = 1.5;
        break;

      case "lune":
        // ARRIVE — étoiles convergent doucement au centre
        let centre = createVector(width / 2, height / 2);
        force = this.arrive(centre);
        force.mult(1.5);
        this.applyForce(force);
        this.maxSpeed = 3;
        break;

      case "soleil":
        // PURSUE — étoiles tourbillonnent autour de la main
        let offset = createVector(
          cos(this.angle) * 150,
          sin(this.angle) * 150
        );
        let orbitTarget = p5.Vector.add(handPos, offset);
        force = this.arrive(orbitTarget);
        force.mult(2);
        this.applyForce(force);
        this.angle += 0.03;
        this.maxSpeed = 4;
        break;

      default:
        // Pas de sort — wander normal
        force = this.wander();
        this.applyForce(force);
        this.maxSpeed = 2;
        break;
    }
  }

  update(spell, handPos) {
    this.applySpell(spell, handPos);
    super.update();
    this.edges();

    // Scintillement
    this.brightness += this.brightnessDir * 3;
    if (this.brightness > 255 || this.brightness < 150) {
      this.brightnessDir *= -1;
    }

    // Rotation visuelle
    if (spell === "soleil") {
      this.angle += 0.02;
    }
  }

  show(spell) {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);

    if (this.isSpecial) {
      // Étoile spéciale : effet arc-en-ciel pulsant
      this.specialAngle = (this.specialAngle || 0) + 0.05;
      let pulse = map(sin(this.specialAngle), -1, 1, 0.8, 1.3);

      // Grande lueur dorée
      noStroke();
      fill(255, 215, 0, 40);
      ellipse(0, 0, this.r * 5 * pulse, this.r * 5 * pulse);

      fill(255, 215, 0, 80);
      ellipse(0, 0, this.r * 3.5 * pulse, this.r * 3.5 * pulse);

      // Étoile dorée
      fill(255, 215, 0, this.brightness);
      this.drawStar(0, 0, this.r * 0.5, this.r * 1.2, 5);

      // Couronne de petites étoiles
      for (let i = 0; i < 5; i++) {
        let a = (TWO_PI / 5) * i + this.specialAngle;
        let px = cos(a) * this.r * 2;
        let py = sin(a) * this.r * 2;
        fill(255, 255, 100, 180);
        ellipse(px, py, 4, 4);
      }

    } else {
      // Étoile normale
      let displayCol = this.getSpellColor(spell);
      noStroke();
      fill(red(displayCol), green(displayCol), blue(displayCol), 60);
      ellipse(0, 0, this.r * 3.5, this.r * 3.5);
      fill(red(displayCol), green(displayCol), blue(displayCol), this.brightness);
      this.drawStar(0, 0, this.r * 0.5, this.r, 5);
    }

    pop();
  }

  getSpellColor(spell) {
    switch(spell) {
      case "arc-en-ciel": return color(255, 100, 200); // Rose magique 🌈
      case "nuage": return color(100, 200, 255); // Bleu ciel ☁️
      case "lune": return color(200, 200, 255); // Violet lune 🌙
      case "soleil": return color(255, 220, 100); // Or soleil ☀️
      default: return this.col;              // Couleur normale
    }
  }

  drawStar(x, y, r1, r2, npoints) {
    let angle = TWO_PI / npoints;
    let halfAngle = angle / 2.0;
    beginShape();
    for (let a = -HALF_PI; a < TWO_PI - HALF_PI; a += angle) {
      let sx = x + cos(a) * r2;
      let sy = y + sin(a) * r2;
      vertex(sx, sy);
      sx = x + cos(a + halfAngle) * r1;
      sy = y + sin(a + halfAngle) * r1;
      vertex(sx, sy);
    }
    endShape(CLOSE);
  }

  // Méthode statique pour créer une étoile spéciale
  static createSpecial(x, y) {
    let s = new Star(x, y);
    s.isSpecial = true;
    s.points = 3;
    s.r = 18; // plus grande
    s.maxSpeed = 3;
    s.col = color(255, 215, 0); // or
    s.specialAngle = 0;
    return s;
  }
}