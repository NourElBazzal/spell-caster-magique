class SoundManager {
  constructor() {
    this.enabled = true;
    this.ctx = null;
    this.bgAudio = null;
  }

  setup() {
    console.log("Sons prêts !");
  }

  initAudio() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    console.log("Audio démarré !");
  }

  ensureAudio() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playNote(freq, startTime, duration, volume = 0.3, type = 'sine') {
    if (!this.enabled || !this.ctx) return;
    try {
      let osc = this.ctx.createOscillator();
      let gainNode = this.ctx.createGain();
      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);
      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);
    } catch(e) {}
  }

  playCollect(special = false) {
    if (!this.enabled) return;
    this.ensureAudio();
    if (!this.ctx) return;
    let t = this.ctx.currentTime;

    if (special) {
      let notes = [523, 659, 784, 1047, 1319];
      notes.forEach((freq, i) => {
        this.playNote(freq, t + i * 0.07, 0.15, 0.2, 'sine');
      });
    } else {
      this.playNote(880, t, 0.08, 0.15, 'sine');
      this.playNote(1100, t + 0.06, 0.1, 0.12, 'sine');
    }
  }

  playBossAppear() {
    if (!this.enabled) return;
    this.ensureAudio();
    if (!this.ctx) return;
    let t = this.ctx.currentTime;

    this.playNote(80, t, 1.0, 0.3, 'sawtooth');
    this.playNote(60, t + 0.2, 1.2, 0.25, 'sawtooth');
    this.playNote(220, t + 0.5, 0.2, 0.2, 'square');
    this.playNote(196, t + 0.7, 0.2, 0.2, 'square');
    this.playNote(165, t + 0.9, 0.3, 0.2, 'square');
    this.playNote(147, t + 1.2, 0.5, 0.2, 'square');

    this.pauseBgMusic();
    setTimeout(() => this.resumeBgMusic(), 2000);
  }

  playBossDefeated() {
    if (!this.enabled) return;
    this.ensureAudio();
    if (!this.ctx) return;
    let t = this.ctx.currentTime;

    let victory = [523, 659, 784, 659, 784, 1047];
    victory.forEach((freq, i) => {
      this.playNote(freq, t + i * 0.12, 0.2, 0.2, 'sine');
    });
  }

  // Musique fichier MP3
  startBgMusic(mode) {
    this.stopBgMusic();

    let musicFile;
    if (mode === "histoire") {
      musicFile = "magical-wizard-fantasy.mp3";
    } else if (mode === "timer") {
      musicFile = "hurry-up-happy-music.mp3";
    } else {
      musicFile = "fairy-tale.mp3";
    }

    console.log("Chargement:", musicFile);

    this.bgAudio = new Audio(musicFile);
    this.bgAudio.loop = true;
    this.bgAudio.volume = 0.3;
    this.bgAudio.play()
      .then(() => console.log("Musique lancée !"))
      .catch(e => console.log("Audio bloqué:", e));
  }

  stopBgMusic() {
    if (this.bgAudio) {
      this.bgAudio.pause();
      this.bgAudio.currentTime = 0;
      this.bgAudio = null;
    }
  }

  pauseBgMusic() {
    if (this.bgAudio) this.bgAudio.pause();
  }

  resumeBgMusic() {
    if (this.bgAudio) this.bgAudio.play();
  }
}