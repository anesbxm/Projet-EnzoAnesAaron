// --- Éléments du HTML ---
const boutonsChoix = document.querySelectorAll(".bouton-arcade");
const boutonReset = document.getElementById("bouton-reset");
const mainJoueur = document.getElementById("main-joueur");
const mainMachine = document.getElementById("main-machine");
const badgeCentral = document.getElementById("badge-central");
const messageEl = document.getElementById("message");
const scoreJoueurEl = document.getElementById("score-joueur");
const scoreMachineEl = document.getElementById("score-machine");

// --- Variables du jeu ---
let scoreJoueur = 0;
let scoreMachine = 0;
let contexteAudio = null;

const emojis = {
  pierre: "✊",
  feuille: "✋",
  ciseaux: "✌️"
};

const choixPossibles = ["pierre", "feuille", "ciseaux"];

// Ce que chaque choix bat
const batAdverse = {
  pierre: "ciseaux",
  feuille: "pierre",
  ciseaux: "feuille"
};

// --- Jouer un son (généré directement, pas besoin de fichier audio) ---
function jouerSon(frequence, duree, type) {
  if (!contexteAudio) {
    contexteAudio = new AudioContext();
  }

  const oscillateur = contexteAudio.createOscillator();
  const volume = contexteAudio.createGain();

  oscillateur.type = type;
  oscillateur.frequency.value = frequence;
  oscillateur.connect(volume);
  volume.connect(contexteAudio.destination);

  volume.gain.setValueAtTime(0.2, contexteAudio.currentTime);
  volume.gain.exponentialRampToValueAtTime(0.001, contexteAudio.currentTime + duree);

  oscillateur.start();
  oscillateur.stop(contexteAudio.currentTime + duree);
}

// --- Écouter les clics sur les 3 boutons ---
boutonsChoix.forEach(function (bouton) {
  bouton.addEventListener("click", function () {
    const choixJoueur = bouton.dataset.choix;
    lancerManche(choixJoueur);
  });
});

// --- Lancer une manche : compte à rebours puis révélation ---
function lancerManche(choixJoueur) {
  basculerBoutons(false);

  messageEl.textContent = "Prépare-toi...";
  mainJoueur.className = "main secousse";
  mainMachine.className = "main secousse";
  mainJoueur.textContent = "✊";
  mainMachine.textContent = "✊";

  let compte = 3;
  badgeCentral.textContent = compte;
  jouerSon(440, 0.12, "square");

  const intervalle = setInterval(function () {
    compte = compte - 1;

    if (compte > 0) {
      badgeCentral.textContent = compte;
      jouerSon(440, 0.12, "square");
    } else {
      clearInterval(intervalle);
      badgeCentral.textContent = "GO !";
      jouerSon(880, 0.18, "square");

      setTimeout(function () {
        reveler(choixJoueur);
      }, 350);
    }
  }, 600);
}

// --- Révéler les choix et calculer le résultat ---
function reveler(choixJoueur) {
  const indexHasard = Math.floor(Math.random() * 3);
  const choixMachine = choixPossibles[indexHasard];

  mainJoueur.classList.remove("secousse");
  mainMachine.classList.remove("secousse");
  mainJoueur.textContent = emojis[choixJoueur];
  mainMachine.textContent = emojis[choixMachine];

  const resultat = determinerVainqueur(choixJoueur, choixMachine);
  afficherResultat(resultat);

  setTimeout(function () {
    badgeCentral.textContent = "VS";
    mainJoueur.className = "main";
    mainMachine.className = "main";
    basculerBoutons(true);
  }, 1800);
}

// Renvoie "joueur", "machine" ou "egalite"
function determinerVainqueur(choixJoueur, choixMachine) {
  if (choixJoueur === choixMachine) {
    return "egalite";
  }

  if (batAdverse[choixJoueur] === choixMachine) {
    return "joueur";
  }

  return "machine";
}

// --- Afficher le message, le score et le son du résultat ---
function afficherResultat(resultat) {
  if (resultat === "joueur") {
    scoreJoueur = scoreJoueur + 1;
    scoreJoueurEl.textContent = scoreJoueur;
    messageEl.textContent = "🎉 TU GAGNES CETTE MANCHE !";
    mainJoueur.classList.add("gagnant");
    mainMachine.classList.add("perdant");
    jouerSon(523, 0.18, "sine");
  }

  if (resultat === "machine") {
    scoreMachine = scoreMachine + 1;
    scoreMachineEl.textContent = scoreMachine;
    messageEl.textContent = "💀 LA MACHINE GAGNE...";
    mainMachine.classList.add("gagnant");
    mainJoueur.classList.add("perdant");
    jouerSon(160, 0.45, "sawtooth");
  }

  if (resultat === "egalite") {
    messageEl.textContent = "🤝 ÉGALITÉ !";
    jouerSon(330, 0.3, "triangle");
  }
}

// --- Activer ou désactiver les 3 boutons ---
function basculerBoutons(actif) {
  boutonsChoix.forEach(function (bouton) {
    bouton.disabled = !actif;
  });
}

// --- Réinitialiser le score ---
boutonReset.addEventListener("click", function () {
  scoreJoueur = 0;
  scoreMachine = 0;
  scoreJoueurEl.textContent = 0;
  scoreMachineEl.textContent = 0;
  messageEl.textContent = "Score remis à zéro. À toi de jouer !";
});