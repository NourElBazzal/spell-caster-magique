class StoryManager {
  constructor() {
    this.currentLevel = 1;
    this.maxLevels = 5;
    this.levelComplete = false;
    this.showingTransition = false;
    this.transitionTimer = 0;
    this.transitionDuration = 180; // 3 secondes

    // Configuration de chaque niveau
    this.levels = [
      {
        level: 1,
        title: "La Forêt Enchantée 🌲",
        story: "Malvina a éparpillé 5 étoiles dans la forêt...\nUtilise le Sort Arc-en-ciel pour les attraper !",
        bgColor: [8, 30, 8],// vert sombre
        starCount: 5,
        badStarCount: 1,
        starSpeed: 1.5,
        timeLimit: 45,
        hint: "💡 Main en HAUT → 🌈 Sort Arc-en-ciel"
      },
      {
        level: 2,
        title: "Le Lac Mystérieux 🌊",
        story: "Les étoiles flottent sur le lac enchanté...\nLe Sort Nuage les guidera vers toi !",
        bgColor: [5, 15, 35], // bleu sombre
        starCount: 8,
        badStarCount: 2,
        starSpeed: 2,
        timeLimit: 50,
        hint: "💡 Main en BAS → ☁️ Sort Nuage"
      },
      {
        level: 3,
        title: "La Montagne de la Lune 🌙",
        story: "Les étoiles sont cachées dans les nuages...\nLe Sort Lune les rassemblera au centre !",
        bgColor: [15, 5, 35], // violet sombre
        starCount: 10,
        badStarCount: 3,
        starSpeed: 2.5,
        timeLimit: 55,
        hint: "💡 Main à GAUCHE → 🌙 Sort Lune"
      },
      {
        level: 4,
        title: "Le Désert du Soleil ☀️",
        story: "Les étoiles tourbillonnent dans le vent chaud...\nLe Sort Soleil les fera danser vers toi !",
        bgColor: [35, 20, 5],// orange sombre
        starCount: 12,
        badStarCount: 4,
        starSpeed: 3,
        timeLimit: 60,
        hint: "💡 Main à DROITE → ☀️ Sort Soleil"
      },
      {
        level: 5,
        title: "Le Château de Malvina 🏰",
        story: "Bataille finale ! Malvina envoie ses étoiles maléfiques...\nUtilise TOUS les sorts pour sauver le royaume !",
        bgColor: [25, 5, 5], // rouge sombre
        starCount: 15,
        badStarCount: 6,
        starSpeed: 3.5,
        timeLimit: 70,
        hint: "💡 Utilise tous les sorts !"
      }
    ];
  }

  getCurrentLevel() {
    return this.levels[this.currentLevel - 1];
  }

  // Vérifier si le niveau est terminé
  checkLevelComplete(starsCollected, totalStars) {
    if (starsCollected >= totalStars && !this.levelComplete) {
      this.levelComplete = true;
      this.showingTransition = true;
      this.transitionTimer = 0;
      return true;
    }
    return false;
  }

  // Passer au niveau suivant
  nextLevel() {
    if (this.currentLevel < this.maxLevels) {
      this.currentLevel++;
      this.levelComplete = false;
      this.showingTransition = false;
      return true;
    }
    return false; // Jeu terminé !
  }

  // Dessiner la transition entre niveaux
  showTransition(starsCollected) {
    if (!this.showingTransition) return false;

    this.transitionTimer++;

    // Fond noir semi-transparent
    fill(0, 0, 0, 200);
    rect(0, 0, width, height);

    let level = this.getCurrentLevel();
    textAlign(CENTER);
    noStroke();

    if (this.transitionTimer < 60) {
      // Phase 1 : Niveau terminé !
      let alpha = map(this.transitionTimer, 0, 60, 0, 255);

      fill(255, 220, 100, alpha);
      textSize(60);
      text("✨ Niveau terminé ! ✨", width / 2, height / 2 - 80);

      fill(255, 255, 255, alpha);
      textSize(28);
      text(`Tu as sauvé toutes les étoiles !`, width / 2, height / 2 - 20);

      // Étoiles collectées
      fill(255, 220, 100, alpha);
      textSize(36);
      text(`⭐ ${starsCollected}`, width / 2, height / 2 + 40);

    } else if (this.transitionTimer < 120) {
      // Phase 2 : Prochain niveau
      let nextLvl = this.levels[this.currentLevel]; // niveau suivant

      if (nextLvl) {
        fill(200, 180, 255);
        textSize(30);
        text(`Niveau ${this.currentLevel + 1} : ${nextLvl.title}`, width / 2, height / 2 - 60);

        fill(150, 200, 255);
        textSize(20);
        text(nextLvl.story, width / 2, height / 2);

        fill(255, 220, 100);
        textSize(18);
        text(nextLvl.hint, width / 2, height / 2 + 80);
      } else {
        // Dernier niveau terminé
        fill(255, 220, 100);
        textSize(50);
        text("🏆 VICTOIRE TOTALE ! 🏆", width / 2, height / 2 - 40);

        fill(255);
        textSize(24);
        text("Tu as sauvé tout le royaume !", width / 2, height / 2 + 30);
      }

    } else if (this.transitionTimer < this.transitionDuration) {
      // Phase 3 : Compte à rebours
      let countdown = ceil(map(
        this.transitionTimer,
        120, this.transitionDuration,
        3, 0
      ));

      fill(100, 255, 150);
      textSize(80);
      text(countdown, width / 2, height / 2);

      fill(200, 200, 255);
      textSize(20);
      text("Prépare-toi...", width / 2, height / 2 + 70);

    } else {
      // Transition terminée
      this.showingTransition = false;
      return false;
    }

    return true;
  }

  // Dessiner l'écran d'intro du niveau
  showLevelIntro(timer) {
    let level = this.getCurrentLevel();

    fill(0, 0, 0, 150);
    rect(0, 0, width, height);

    textAlign(CENTER);
    noStroke();

    // Numéro de niveau
    fill(255, 220, 100);
    textSize(22);
    text(`— Niveau ${this.currentLevel} sur ${this.maxLevels} —`, width / 2, height / 2 - 100);

    // Titre
    fill(200, 180, 255);
    textSize(40);
    text(level.title, width / 2, height / 2 - 60);

    // Histoire
    fill(150, 200, 255);
    textSize(18);
    text(level.story, width / 2, height / 2);

    // Hint
    fill(255, 220, 100);
    textSize(16);
    text(level.hint, width / 2, height / 2 + 60);

    // Barre de progression niveaux
    this.showLevelProgress();

    // Bouton commencer
    let pulse = map(sin(timer * 0.05), -1, 1, 150, 255);
    fill(100, 255, 150, pulse);
    textSize(20);
    text("🖐️ Montre ta main pour commencer !", width / 2, height / 2 + 110);
  }

  // Barre de progression des niveaux
  showLevelProgress() {
    let barY = height - 40;
    let barW = 300;
    let barX = width / 2 - barW / 2;
    let stepW = barW / this.maxLevels;

    noStroke();
    for (let i = 0; i < this.maxLevels; i++) {
      if (i < this.currentLevel - 1) {
        fill(255, 220, 100); // complété
      } else if (i === this.currentLevel - 1) {
        fill(100, 255, 150); // actuel
      } else {
        fill(80, 80, 80); // à venir
      }
      ellipse(barX + i * stepW + stepW / 2, barY, 20, 20);

      fill(255);
      textSize(10);
      text(i + 1, barX + i * stepW + stepW / 2, barY + 4);
    }

    // Ligne entre les points
    for (let i = 0; i < this.maxLevels - 1; i++) {
      let col = i < this.currentLevel - 1 ? color(255, 220, 100) : color(80, 80, 80);
      stroke(col);
      strokeWeight(2);
      line(
        barX + i * stepW + stepW / 2 + 11,
        barY,
        barX + (i + 1) * stepW + stepW / 2 - 11,
        barY
      );
    }
    noStroke();
  }
}