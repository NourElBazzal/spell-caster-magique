class Vehicle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = 4;
    this.maxForce = 0.2;
    this.r = 6; // rayon du véhicule
  }

  // Comportement SEEK  chercher une cible
  seek(target) {
    let desired = p5.Vector.sub(target, this.pos);
    desired.setMag(this.maxSpeed);
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    return steer;
  }

  // Comportement FLEE  fuir une cible
  flee(target) {
    let f = this.seek(target);
    f.mult(-1);
    return f;
  }

  // Comportement ARRIVE  arriver doucement
  arrive(target) {
    let desired = p5.Vector.sub(target, this.pos);
    let d = desired.mag();
    let slowingRadius = 100;
    
    if (d < slowingRadius) {
      let speed = map(d, 0, slowingRadius, 0, this.maxSpeed);
      desired.setMag(speed);
    } else {
      desired.setMag(this.maxSpeed);
    }
    
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    return steer;
  }

  // Comportement WANDER  déambuler aléatoirement
  wander() {
    let wanderR = 50;
    let wanderD = 80;
    let change = 0.3;
    
    this.wanderTheta = this.wanderTheta || random(TWO_PI);
    this.wanderTheta += random(-change, change);
    
    let circlePos = this.vel.copy();
    circlePos.setMag(wanderD);
    circlePos.add(this.pos);
    
    let h = this.vel.heading();
    let circleOffset = createVector(
      wanderR * cos(this.wanderTheta + h),
      wanderR * sin(this.wanderTheta + h)
    );
    
    let target = p5.Vector.add(circlePos, circleOffset);
    return this.seek(target);
  }

  // Appliquer une force
  applyForce(force) {
    this.acc.add(force);
  }

  // Mettre à jour position
  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  edges() {
    let mx = (typeof MARGIN_X !== 'undefined') ? MARGIN_X : 0;
    let mt = (typeof MARGIN_TOP !== 'undefined') ? MARGIN_TOP : 0;
    let mb = (typeof MARGIN_BOT !== 'undefined') ? MARGIN_BOT : 0;

    if (this.pos.x > width - mx) 
      this.pos.x = mx;
    if (this.pos.x < mx) 
      this.pos.x = width - mx;
    if (this.pos.y > height - mb) 
      this.pos.y = mt;
    if (this.pos.y < mt)
      this.pos.y = height - mb;
  }
}