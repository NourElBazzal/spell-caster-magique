class Particle {
  constructor(x, y, col) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-4, 4), random(-6, -1));
    this.acc = createVector(0, 0.15); // gravité
    this.col = col;
    this.alpha = 255;
    this.size = random(6, 14);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.alpha -= 8; // disparaît progressivement
  }

  show() {
    noStroke();
    fill(red(this.col), green(this.col), blue(this.col), this.alpha);
    
    // Étoile ou cercle aléatoirement
    push();
    translate(this.pos.x, this.pos.y);
    if (random() > 0.5) {
      this.drawStar(0, 0, this.size * 0.4, this.size, 5);
    } else {
      ellipse(0, 0, this.size);
    }
    pop();
  }

  isDead() {
    return this.alpha <= 0;
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