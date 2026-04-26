# ✨ Spell Caster Magique ✨

> _"La méchante sorcière Malvina a éparpillé les étoiles magiques dans le royaume !  
> Toi, petit sorcier apprenti, tu dois les attraper avec ta main magique !"_

**Jouer au jeu** : [spell-caster-magique sur GitHub Pages](https://NourElBazzal.github.io/spell-caster-magique)

**Vidéo de démonstration** : [Voir sur YouTube](#)

---

## A propos du jeu

**Spell Caster Magique** est un jeu éducatif interactif destiné aux **enfants de 4 à 10 ans**.  
Il utilise la webcam pour détecter la main du joueur en temps réel grâce à **ML5.js HandPose**.  
Le joueur lance des sorts magiques en positionnant sa main dans différentes zones de l'écran.

Développé dans le cadre du **Mini Projet Master 2 MIAGE IA2** - cours de Michel Buffa  
**Université Côte d'Azur**

---

## Comment jouer

### 1. Prérequis

- Un ordinateur avec une **webcam**
- Un navigateur moderne (Chrome recommandé)
- **Autoriser l'accès à la webcam** quand le navigateur le demande

### 2. Démarrage

1. Ouvre le jeu dans ton navigateur
2. Attends que ML5 charge (2-3 secondes)
3. Montre ta main à la webcam ou clique sur un mode
4. Lis les règles dans le popup puis clique "J'ai compris !"
5. Joue !

### 3. Quitter un mode

Clique sur le bouton **Menu** en haut à gauche pour revenir au menu principal à tout moment.

---

## Les gestes magiques

| Geste               | Action              |
| ------------------- | ------------------- |
| ✋ **Main ouverte** | Lance le sort actif |
| ✊ **Main fermée**  | Désactive le sort   |

---

## Les zones de sorts

L'écran est divisé en **4 zones** selon la position de ta main :

        ┌───────────────────────────────────────┐
        │                                       │
        │        🌈 Sort Arc-en-ciel            │
        │   Main en HAUT de l'écran             │
        │   → Behavior : SEEK                   │
        │   → Les étoiles foncent vers ta main  │
        │                                       │
        ├─────────────────────┬─────────────────┤
        │                     │                 │
        │  🌙 Sort Lune       │  ☀️ Sort Soleil│
        │  Main à GAUCHE      │  Main à DROITE  │
        │  → Behavior :       │  → Behavior :   │
        │    ARRIVE           │    PURSUE       │
        │  → Étoiles          │  → Étoiles      │
        │    convergent       │    tourbillon   │
        │    au centre        │    autour       │
        │                     │                 │
        ├─────────────────────┴─────────────────┤
        │                                       │
        │          ☁️ Sort Nuage                │
        │    Main en BAS de l'écran             │
        │    → Behavior : WANDER                │
        │    → Les étoiles déambulent           │
        │      paisiblement                     │
        │                                       │
        └───────────────────────────────────────┘

💡 Main OUVERTE ✋ → Sort actif !
💡 Main FERMÉE ✊ → Sort inactif

### Détails des sorts

| Sort               | Zone          | Behavior                                  | Effet visuel      |
| ------------------ | ------------- | ----------------------------------------- | ----------------- |
| 🌈 **Arc-en-ciel** | Main en HAUT  | **Seek** - étoiles foncent vers ta main   | Étoiles roses     |
| ☁️ **Nuage**       | Main en BAS   | **Wander** - étoiles déambulent           | Étoiles bleues    |
| 🌙 **Lune**        | Main à GAUCHE | **Arrive** - étoiles convergent au centre | Étoiles violettes |
| ☀️ **Soleil**      | Main à DROITE | **Pursue** - étoiles tourbillonnent       | Étoiles dorées    |

---

## Les modes de jeu

### Mode Libre

- Pas de limite de temps
- Collecte un maximum d'étoiles
- Parfait pour apprendre les sorts
- Le boss Malvina apparaît à **30 points** !
- Musique : _fairy-tale.mp3_

### Mode Timer

- **60 secondes** pour collecter un maximum d'étoiles
- Le timer change de couleur selon le temps restant :
  - Vert : plus de 30 secondes
  - Orange : entre 10 et 30 secondes
  - Rouge : moins de 10 secondes
- Écran de fin avec ton score et un message selon ta performance
- Musique : _hurry-up-happy-music.mp3_

### Mode Histoire - 5 Niveaux

La méchante sorcière Malvina a éparpillé les étoiles dans tout le royaume !
Musique : _magical-wizard-fantasy.mp3_

| Niveau | Titre                     | Étoiles | Obstacles | Temps |
| ------ | ------------------------- | ------- | --------- | ----- |
| 1      | 🌲 La Forêt Enchantée     | 5       | 1         | 45s   |
| 2      | 🌊 Le Lac Mystérieux      | 8       | 2         | 50s   |
| 3      | 🌙 La Montagne de la Lune | 10      | 3         | 55s   |
| 4      | ☀️ Le Désert du Soleil    | 12      | 4         | 60s   |
| 5      | 🏰 Le Château de Malvina  | 15      | 6         | 70s   |

---

## Les types d'étoiles

| Étoile                           | Description                 | Points |
| -------------------------------- | --------------------------- | ------ |
| ⭐ **Étoile normale**            | Déambule avec le sort actif | +1     |
| 🌟 **Étoile spéciale dorée**     | Scintille et pulse - rare ! | +3     |
| 💀 **Étoile maléfique violette** | Fuit ta main - à éviter !   | -2     |

---

## Le Boss - Malvina le Dragon

Malvina apparaît quand tu atteins **30 points** en mode Libre ou Timer !

**Comportements de Malvina :**

- **Phase Invocation** : utilise le behavior **Wander** - déambule mystérieusement
- **Phase Attaque** : utilise le behavior **Flee** quand tu lances un sort, et **Seek** si tu n'en as pas !
- **10 points de vie** - touche-la avec ta main ouverte pour la blesser
- **+10 points** si tu la vaincs
- Elle **revient plus forte** (+5 vie) après 10 secondes !

---

## Interface du jeu

### Écran principal

- **Score** en haut au centre
- **Meilleur score** juste en dessous
- **Bouton Menu** en haut à gauche pour revenir au menu
- **Cadre magique violet** qui délimite la zone de jeu
- **Sorcier animé** qui suit ta main
- **Messages encourageants** qui flottent
- **Mini caméra LIVE** en bas à droite avec squelette de la main
- **Nom du sort actif** en bas au centre

### Indicateur de main

- Squelette **vert** = main ouverte → sort actif
- Squelette **rouge** = main fermée → sort inactif

### Popup de règles

Avant chaque partie, un popup s'affiche avec les règles essentielles. Le joueur doit cliquer sur **"J'ai compris !"** pour commencer.

---

## Technologies utilisées

| Technologie        | Usage                                         |
| ------------------ | --------------------------------------------- |
| **P5.js** v1.9.0   | Moteur graphique et animations                |
| **ML5.js** v0.6.1  | Détection de la main (HandPose)               |
| **Web Audio API**  | Sons de collection et effets sonores          |
| **HTML5 Audio**    | Musiques de fond (fairy-tale, wizard-fantasy) |
| **JavaScript ES6** | Logique du jeu                                |
| **HTML5 / CSS3**   | Structure de la page                          |

---

## Architecture du code

```
SpellCaster/
│
├── index.html                    # Point d'entrée du jeu
│
├── sketch.js                     # Boucle principale P5.js
│                                 # Gestion des modes, score, timer
│
├── vehicle.js                    # Classe de BASE
│                                 # Contient : seek, flee, arrive, wander
│                                 # Tous les objets animés en héritent
│
├── star.js                       # Étoiles magiques
│                                 # Sous-classe de Vehicle
│                                 # Réagit aux sorts (seek/flee/arrive/wander)
│
├── badStar.js                    # Étoiles maléfiques
│                                 # Sous-classe de Vehicle
│                                 # Behavior : flee (fuit la main)
│
├── boss.js                       # Boss Malvina le Dragon
│                                 # Sous-classe de Vehicle
│                                 # Behaviors : wander + flee + seek
│
├── particle.js                   # Particules de célébration
│                                 # Effet visuel quand étoile collectée
│
├── background.js                 # Fond étoilé animé
│                                 # Zones visuelles des sorts
│
├── wizard.js                     # Personnage sorcier animé
│                                 # Suit la main du joueur
│
├── storyManager.js               # Gestion du Mode Histoire
│                                 # 5 niveaux avec scénario
│
├── handDetector.js               # ML5.js HandPose
│                                 # Détection main, zones, doigts
│
└── soundManager.js               # Sons via Web Audio API
│                                 # Sons différents par sort
│
├── fairy-tale.mp3                # Musique modes Libre
├── hurry-up-happy-music.mp3      # Musique modes Timer
└── magical-wizard-fantasy.mp3    # Musique Mode Histoire
```

---

## Steering Behaviors utilisés

Ce projet implémente les **steering behaviors** vus en cours :

| Behavior   | Où                        | Description                              |
| ---------- | ------------------------- | ---------------------------------------- |
| **Seek**   | Sort Arc-en-ciel          | Étoiles cherchent la position de la main |
| **Flee**   | Étoiles maléfiques + Boss | Fuient la main du joueur                 |
| **Arrive** | Sort Lune                 | Étoiles arrivent doucement au centre     |
| **Wander** | Sort Nuage + Boss         | Déambulation aléatoire naturelle         |
| **Pursue** | Sort Soleil               | Étoiles orbitent autour de la main       |

---

## ML5.js - HandPose

Le jeu utilise **ML5.js v0.6.1** avec le modèle **HandPose** pour :

- Détecter la **position de la main** en temps réel
- Détecter si la main est **ouverte ou fermée** (comptage des doigts)
- Déterminer la **zone** (haut/bas/gauche/droite)
- Afficher le **squelette** de la main (21 landmarks) dans la mini caméra

### Calibration des zones

Les zones sont calibrées selon les coordonnées réelles de la webcam (640x480) :

- **Haut** : rawY < 310
- **Bas** : rawY > 430
- **Lune** : rawX >= 320 (zone milieu)
- **Soleil** : rawX < 320 (zone milieu)

---

## NOTRE EXPÉRIENCE

### Pourquoi ce jeu ?

Nous avons choisi de créer **Spell Caster Magique** car nous voulions faire quelque chose d'original et d'éducatif pour les enfants. L'idée de contrôler un jeu avec sa main sans toucher d'écran nous semblait magique et accessible pour tous les âges.

### Les behaviors choisis

Nous avons choisi d'utiliser **Seek, Flee, Arrive et Wander** car ce sont les plus visuellement expressifs - on voit clairement la différence de comportement entre chaque sort. Le **Flee** sur les étoiles maléfiques et le boss crée une vraie tension de gameplay.

### Les difficultés rencontrées

**1. Compatibilité ML5.js**
La plus grande difficulté a été de trouver la bonne version de ML5.js. La version 1.3.1 (latest) avait des erreurs avec `p5.Oscillator is not a constructor` et `estimateHands`. Après plusieurs essais, la version **0.6.1** s'est révélée la plus stable.

**2. Calibration des zones**
Les coordonnées retournées par ML5 ne correspondaient pas aux dimensions attendues. La webcam retourne des coordonnées en **640px** (videoWidth réel) alors que la vidéo P5 était configurée en 320px. Il a fallu analyser les valeurs rawX et rawY en temps réel pour calibrer correctement les zones Lune/Soleil.

**3. Mapping des coordonnées**
Le miroir horizontal de la webcam rendait les zones gauche/droite inversées. Il a fallu inverser le mapping pour que le mouvement à l'écran corresponde au mouvement naturel de la main.

**4. Sons sans fichiers audio**
P5.sound n'était pas compatible avec notre version. La solution a été d'utiliser directement la **Web Audio API** du navigateur pour générer les sons programmatiquement, et l'API HTML5 Audio pour les musiques de fond.

**5. Décalage des coordonnées de la souris**
Le CSS `display: flex` sur le body décalait le canvas, rendant les clics sur les boutons inopérants. La solution a été de positionner le canvas en `fixed` avec `top: 0; left: 0`.

### Ce que nous avons appris

- L'intégration de ML5.js avec P5.js n'est pas triviale - les versions sont très importantes
- Les steering behaviors sont très puissants visuellement avec très peu de code
- La calibration en temps réel (logs des coordonnées) est essentielle
- Il vaut mieux un projet simple et bien fini qu'un projet ambitieux incomplet

### Outils utilisés

- **IDE** : Visual Studio Code + extension Live Server
- **IA** : Claude (Anthropic) pour l'aide au développement
- **Debug** : Console Chrome DevTools
- **Musiques** : Pixabay (libre de droits)

---

## Références

- [Craig Reynolds - Steering Behaviors (GDC 1999)](https://www.scribd.com/doc/289872753/Reviewing-Craig-W-Reynolds-paper-1999)
- [The Nature of Code - Daniel Shiffman](https://natureofcode.com/book/)
- [ML5.js Documentation](https://ml5js.org/)
- [P5.js Reference](https://p5js.org/reference/)
- [The Coding Train - Steering Behaviors](https://thecodingtrain.com/tracks/the-nature-of-code-2)
- [Pixabay - Musiques libres de droits](https://pixabay.com/music/)
