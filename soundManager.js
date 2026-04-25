class SoundManager {
  constructor() {
    this.enabled = true;
    // API Web Audio native du navigateur
    this.ctx = null;
  }

  setup() {
    // Créer le contexte audio au premier clic/interaction
    document.addEventListener('click', () => this.initAudio(), { once: true });
    document.addEventListener('keydown', () => this.initAudio(), { once: true });
    // Aussi au premier mouvement de main détecté
    console.log("Sons prêts !");
  }

  initAudio() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    console.log("Audio démarré !");
  }

  // Activer l'audio si pas encore fait
  ensureAudio() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Jouer une note
  playNote(freq, startTime, duration, volume = 0.3, type = 'sine') {
    if (!this.enabled || !this.ctx) return;
    try {
      let osc = this.ctx.createOscillator();
      let gainNode = this.ctx.createGain();

      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);

      // Envelope
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);
    } catch(e) {}
  }

  // Son selon le sort
  playSpell(spell) {
    if (!this.enabled) return;
    this.ensureAudio();
    if (!this.ctx) return;

    let t = this.ctx.currentTime;

    switch(spell) {
      case "arc-en-ciel":
        // Aigu et joyeux — deux notes montantes
        this.playNote(880, t, 0.15, 0.2, 'sine');
        this.playNote(1100, t + 0.1, 0.2, 0.15, 'sine');
        this.playNote(1320, t + 0.2, 0.2, 0.1, 'sine');
        break;

      case "nuage":
        // Doux et apaisant — note grave douce
        this.playNote(330, t, 0.4, 0.15, 'triangle');
        this.playNote(440, t + 0.15, 0.3, 0.1, 'triangle');
        break;

      case "lune":
        // Mystérieux — notes descendantes
        this.playNote(660, t, 0.2, 0.2, 'sine');
        this.playNote(550, t + 0.15, 0.2, 0.15, 'sine');
        this.playNote(440, t + 0.3, 0.3, 0.1, 'sine');
        break;

      case "soleil":
        // Chaud et lumineux — accord majeur
        this.playNote(523, t, 0.3, 0.15, 'triangle');
        this.playNote(659, t + 0.05, 0.3, 0.15, 'triangle');
        this.playNote(784, t + 0.1, 0.3, 0.15, 'triangle');
        break;
    }
  }

  // Son de collection normale
  playCollect(special = false) {
    if (!this.enabled) return;
    this.ensureAudio();
    if (!this.ctx) return;

    let t = this.ctx.currentTime;

    if (special) {
      // Mélodie festive pour étoile spéciale
      let notes = [523, 659, 784, 1047, 1319];
      notes.forEach((freq, i) => {
        this.playNote(freq, t + i * 0.08, 0.15, 0.25, 'sine');
      });
    } else {
      // Son simple et satisfaisant
      this.playNote(880, t, 0.08, 0.2, 'sine');
      this.playNote(1100, t + 0.06, 0.1, 0.15, 'sine');
    }
  }
}