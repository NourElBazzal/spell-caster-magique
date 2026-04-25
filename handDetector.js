class HandDetector {
  constructor() {
    this.handpose = null;
    this.video = null;
    this.predictions = [];
    this.isReady = false;

    this.handPos = createVector(width / 2, height / 2);
    this.isOpen = false;
    this.zone = "none";
    this.fingersUp = 0;
  }

  setup() {
    this.video = createCapture(VIDEO, () => {
      console.log("Webcam prête !");

      // Syntaxe ML5 v0.6.1
      this.handpose = ml5.handpose(this.video, () => {
        console.log("ML5 HandPose prêt !");
        this.isReady = true;
      });

      this.handpose.on("predict", (results) => {
        this.predictions = results;
        if (results.length > 0) {
          this.analyze();
        } else {
          this.isOpen = false;
          this.zone = "none";
        }
      });
    });

    this.video.size(320, 240);
    this.video.hide();
  }

  analyze() {
    if (this.predictions.length === 0) return;

    let hand = this.predictions[0];
    let landmarks = hand.landmarks;

    let rawX = landmarks[0][0];
    let rawY = landmarks[0][1];

    // Les vraies dimensions de la vidéo détectées
    let vidW = this.video.width;
    let vidH = this.video.height;

    // Mappage de la position de la main sur l'écran
    // rawY va de ~230 à ~520 environ
    this.handPos = createVector(
    map(rawX, 0, 640, width, 0), // miroir horizontal
    map(rawY, 230, 520, 0, height)  // valeurs réelles observées
    );

    // Main ouverte ou fermée
    this.fingersUp = this.countFingersUp(landmarks);
    this.isOpen = this.fingersUp >= 3;

    // Zone basée sur position MAPPÉE sur l'écran
    let x = this.handPos.x;
    let y = this.handPos.y;

    // Zones
    if (rawY < 310) {
      this.zone = "haut"; //Arc-en-ciel
    } else if (rawY > 430) {
      this.zone = "bas"; //Nuage
    } else {
      if (rawX >= 320) {
        this.zone = "gauche";  //Lune (main à droite de l'écran)
      } else {
        this.zone = "droite"; // Soleil (main à gauche de l'écran)
      }
    }
  }

  countFingersUp(landmarks) {
    let fingers = [
      [8, 6],   // index
      [12, 10], // majeur
      [16, 14], // annulaire
      [20, 18]  // auriculaire
    ];

    let count = 0;
    for (let [tip, mid] of fingers) {
      if (landmarks[tip][1] < landmarks[mid][1]) {
        count++;
      }
    }
    return count;
  }

  showDebug() {
    if (!this.isReady || this.predictions.length === 0) return;
    // cercle magique autour de la main
  }

  showHand() {
    if (!this.isReady || this.predictions.length === 0) return;

    let hand = this.predictions[0];
    let landmarks = hand.landmarks;

    // Connexions entre les points de la main
    let connections = [
      // Pouce
      [0, 1], [1, 2], [2, 3], [3, 4],
      // Index
      [0, 5], [5, 6], [6, 7], [7, 8],
      // Majeur
      [0, 9], [9, 10], [10, 11], [11, 12],
      // Annulaire
      [0, 13], [13, 14], [14, 15], [15, 16],
      // Auriculaire
      [0, 17], [17, 18], [18, 19], [19, 20],
      // Paume
      [5, 9], [9, 13], [13, 17]
    ];

    // Convertir les landmarks en coordonnées écran
    let points = landmarks.map(lm => ({
      x: map(lm[0], 0, this.video.width, width, 0),
      y: map(lm[1], 0, this.video.height, 0, height)
    }));

    // Couleur selon état main
    let handColor = this.isOpen ? 
      color(100, 255, 150) :  // vert = ouverte
      color(255, 100, 100);   // rouge = fermée

    // Dessiner les connexions (squelette)
    stroke(red(handColor), green(handColor), blue(handColor), 180);
    strokeWeight(2);
    for (let [a, b] of connections) {
      line(points[a].x, points[a].y, points[b].x, points[b].y);
    }

    // Dessiner les points
    for (let i = 0; i < points.length; i++) {
      // Bouts des doigts plus grands
      let isFingertip = [4, 8, 12, 16, 20].includes(i);
      let size = isFingertip ? 10 : 6;

      // Lueur
      noStroke();
      fill(red(handColor), green(handColor), blue(handColor), 60);
      ellipse(points[i].x, points[i].y, size * 2.5);

      // Point
      fill(red(handColor), green(handColor), blue(handColor), 220);
      ellipse(points[i].x, points[i].y, size);
    }

    // Indicateur OUVERT / FERMÉ au-dessus du poignet
    let wrist = points[0];
    noStroke();
    
    // Fond de l'indicateur
    fill(0, 0, 0, 150);
    rectMode(CENTER);
    rect(wrist.x, wrist.y - 35, 110, 28, 10);
    rectMode(CORNER);

    // Texte
    fill(red(handColor), green(handColor), blue(handColor));
    textSize(14);
    textAlign(CENTER);
    text(
      this.isOpen ? "✋ OUVERTE" : "✊ FERMÉE",
      wrist.x,
      wrist.y - 27
    );

    // Anneau magique autour du poignet
    noFill();
    stroke(red(handColor), green(handColor), blue(handColor), 100);
    strokeWeight(1.5);
    let ringSize = map(sin(frameCount * 0.1), -1, 1, 45, 65);
    ellipse(wrist.x, wrist.y, ringSize);
    noStroke();
  }

  showMiniCam() {
    if (!this.isReady || !this.video) return;

    let camW = 220;
    let camH = 165;
    let camX = width - camW - 15;
    let camY = height - camH - 15;

    push();

    // Fond
    noStroke();
    fill(0, 0, 0, 180);
    rect(camX - 4, camY - 26, camW + 8, camH + 34, 12);

    // Bordure colorée selon état
    let borderCol = this.isOpen ?
      color(100, 255, 150) :
      color(255, 100, 100);

    stroke(red(borderCol), green(borderCol), blue(borderCol), 200);
    strokeWeight(2);
    noFill();
    rect(camX - 4, camY - 26, camW + 8, camH + 34, 12);
    noStroke();

    // Label en haut
    fill(red(borderCol), green(borderCol), blue(borderCol));
    textSize(11);
    textAlign(CENTER);
    text(
      this.predictions.length > 0
        ? (this.isOpen ? "✋ OUVERTE" : "✊ FERMÉE")
        : "🖐️ Montre ta main !",
      camX + camW / 2,
      camY - 10
    );

    // Point LIVE
    fill(255, 80, 80);
    ellipse(camX + 8, camY - 18, 7);
    fill(255);
    textSize(9);
    textAlign(LEFT);
    text("LIVE", camX + 14, camY - 13);

    // Image webcam miroir
    push();
    translate(camX + camW, camY);
    scale(-1, 1);
    image(this.video, 0, 0, camW, camH);
    pop();

    // Squelette aligné sur la mini cam
    if (this.predictions.length > 0) {
      let hand = this.predictions[0];
      let landmarks = hand.landmarks;

      let connections = [
        [0,1],[1,2],[2,3],[3,4],
        [0,5],[5,6],[6,7],[7,8],
        [0,9],[9,10],[10,11],[11,12],
        [0,13],[13,14],[14,15],[15,16],
        [0,17],[17,18],[18,19],[19,20],
        [5,9],[9,13],[13,17]
      ];

      // Mapping correct — miroir horizontal
      // video.width réel utilisé pour le mapping
      let vw = this.video.elt.videoWidth || this.video.width;
      let vh = this.video.elt.videoHeight || this.video.height;

      let pts = landmarks.map(lm => ({
        // Miroir : on inverse X comme pour l'image
        x: camX + map(lm[0], 0, vw, camW, 0),
        y: camY + map(lm[1], 0, vh, 0, camH)
      }));

      // Connexions
      stroke(red(borderCol), green(borderCol), blue(borderCol), 200);
      strokeWeight(1.5);
      for (let [a, b] of connections) {
        line(pts[a].x, pts[a].y, pts[b].x, pts[b].y);
      }

      // Points articulaires
      noStroke();
      for (let i = 0; i < pts.length; i++) {
        let isTip = [4, 8, 12, 16, 20].includes(i);

        // Lueur
        fill(red(borderCol), green(borderCol), blue(borderCol), 60);
        ellipse(pts[i].x, pts[i].y, isTip ? 12 : 8);

        // Point
        fill(red(borderCol), green(borderCol), blue(borderCol), 230);
        ellipse(pts[i].x, pts[i].y, isTip ? 7 : 4);
      }
    }

    pop();
  }
}