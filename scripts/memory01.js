// Création du contexte graphique
const cvs = document.getElementById("zone_de_dessin");
const ctx = cvs.getContext("2d");
const largImg = 100, hautImg = 135;
const xO = 8, yO = 8, esp = 5;

cvs.width  = 4 * largImg + 3 * esp + 2 * xO;
cvs.height = 4 * hautImg + 3 * esp + 2 * yO;

// Variables de jeu
let tabImagesCliquee1 = [], tabImagesCliquee2 = [];
let compteurImage = 0, compteurImagesTrouvees = 0;
let finDuJeu = false, animationEnCours = false, enAttenteRetournement = false;

// Variables pour le système de timer
let compteurEssaisRates = 0, tempsRestant = 90;
let timerActif = false, intervalTimer = null;

// Création des sons
const sonClic   = new Audio("../sons/clic.mp3");
const sonKlaxon = new Audio("../sons/bingo.mp3");
const sonBravo  = new Audio("../sons/Bravo.mp3");
const sonTimer  = new Audio("../sons/1m30.mp3");
const sonX2     = new Audio("../sons/caPasseX2.mp3");
const sonGameOver = new Audio("../sons/gameOOverArcade.mp3");

// Création des images
window["img0"] = new Image();
window["img0"].src = "../images/noir.png";

for (let i = 1; i <= 8; i++) {
    window["img" + i] = new Image();
    window["img" + i].src = "../images/img" + i + ".jpg";
}

// Stockage des images dans un tableau (chaque image en double)
const tabImages = [];
for (let i = 0; i <= 7; i++) {
    tabImages[2 * i]     = window["img" + (i + 1)];
    tabImages[2 * i + 1] = window["img" + (i + 1)];
}

// Mélange aléatoire
tabImages.sort(() => Math.random() - 0.5);

// Tableau des images trouvées (toutes cachées au départ)
const tabImagesTrouvees = new Array(16).fill(img0);

// Calcul de la position en pixels d'une case
function getPx(x) { return xO + x * (largImg + esp); }
function getPy(y) { return yO + y * (hautImg + esp); }

// Mise à jour des compteurs HTML
function mettreAJourCompteurs() {
    const pairestrouvees = compteurImagesTrouvees / 2;
    const paireRestantes = 8 - pairestrouvees;
    document.getElementById("compteurTrouves").textContent = pairestrouvees + " combinaison(s) trouvée(s)";
    document.getElementById("compteurRestant").textContent = "Il vous reste " + paireRestantes + " combinaison(s) à trouver";
}

// Mise à jour des infos de difficulté
function mettreAJourInfosDifficulte() {
    const avantTimer = 10 - compteurEssaisRates;
    const avantX2    = 20 - compteurEssaisRates;

    if (compteurEssaisRates < 10) {
        document.getElementById("infoAvantTimer").textContent = "⚠️ Timer dans : " + avantTimer + " essai(s) raté(s)";
        document.getElementById("infoAvantX2").textContent    = "⚡ x2 dans : "    + avantX2    + " essai(s) raté(s)";
    } else if (compteurEssaisRates < 20) {
        document.getElementById("infoAvantTimer").textContent = "⏱️ Timer en cours !";
        document.getElementById("infoAvantX2").textContent    = "⚡ x2 dans : " + avantX2 + " essai(s) raté(s)";
    } else {
        document.getElementById("infoAvantTimer").textContent = "⏱️ Timer en cours !";
        document.getElementById("infoAvantX2").textContent    = "🔥 Compteur x2 actif !";
    }
}

// Dessin des images sur la grille
function dessineImages(ctx, tabImg) {
    for (let col = 0; col <= 3; col++) {
        for (let lig = 0; lig <= 3; lig++) {
            ctx.drawImage(tabImg[lig * 4 + col], getPx(col), getPy(lig), largImg, hautImg);
        }
    }
}

// Dessin des bordures de la grille
function dessineGrille(ctx) {
    ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
    ctx.lineWidth = 1;
    for (let col = 0; col <= 3; col++) {
        for (let lig = 0; lig <= 3; lig++) {
            ctx.strokeRect(getPx(col), getPy(lig), largImg, hautImg);
        }
    }
}

// Dessin des cartes actuellement retournées
function dessinImageCliquee(ctx) {
    if (tabImagesCliquee1.length > 0)
        ctx.drawImage(tabImagesCliquee1[0], tabImagesCliquee1[1], tabImagesCliquee1[2], largImg, hautImg);
    if (tabImagesCliquee2.length > 0)
        ctx.drawImage(tabImagesCliquee2[0], tabImagesCliquee2[1], tabImagesCliquee2[2], largImg, hautImg);
}

// Affichage du timer dans le panneau d'infos (HTML, plus sur le canvas)
function dessineTimer() {
    const elTimer = document.getElementById("timer");
    if (!timerActif) {
        elTimer.textContent = "";
        elTimer.classList.remove("urgent");
        return;
    }
    const minutes  = Math.floor(tempsRestant / 60);
    const secondes = tempsRestant % 60;
    const texte    = minutes + ":" + (secondes < 10 ? "0" : "") + secondes;

    elTimer.textContent = texte;
    elTimer.classList.toggle("urgent", tempsRestant <= 10);
}

// Redessine tout le canvas
function dessineTout() {
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    dessineImages(ctx, tabImagesTrouvees);
    dessinImageCliquee(ctx);
    dessineGrille(ctx);
    dessineTimer();
}

// Lancement ou accélération du timer
function lancerTimer(vitesse) {
    clearInterval(intervalTimer);
    intervalTimer = setInterval(() => {
        tempsRestant--;
        dessineTout();
        if (tempsRestant <= 0) {
            clearInterval(intervalTimer);
            timerActif = false;
            finDuJeu   = true;
            sonGameOver.play();
            document.getElementById("message").textContent = "Vous avez perdu ! Cliquez sur la grille pour recommencer.";
        }
    }, vitesse);
}

// Animation de retournement d'une case
function animFlip(px, py, fromImg, toImg, callback) {
    animationEnCours = true;
    const duration  = 300;
    const startTime = performance.now();

    function animate(currentTime) {
        let progress = (currentTime - startTime) / duration;
        if (progress > 1) progress = 1;

        let scaleX, imgADessiner;
        if (progress < 0.5) {
            scaleX       = 1 - progress * 2;
            imgADessiner = fromImg;
        } else {
            scaleX       = (progress - 0.5) * 2;
            imgADessiner = toImg;
        }
        if (scaleX < 0.05) scaleX = 0.05;

        ctx.clearRect(0, 0, cvs.width, cvs.height);
        dessineImages(ctx, tabImagesTrouvees);
        dessinImageCliquee(ctx);
        dessineGrille(ctx);
        dessineTimer();

        // Fond noir pendant le flip
        ctx.fillStyle = "#000000";
        ctx.fillRect(px, py, largImg, hautImg);

        const cx = px + largImg / 2;
        const cy = py + hautImg / 2;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(scaleX, 1);
        ctx.drawImage(imgADessiner, -largImg / 2, -hautImg / 2, largImg, hautImg);
        ctx.restore();
        dessineGrille(ctx);

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            animationEnCours = false;
            if (callback) callback();
        }
    }
    requestAnimationFrame(animate);
}

// Changement de background via la liste déroulante
document.getElementById("choixBackground").addEventListener("change", function() {
    document.body.style.backgroundImage = "url('../images/" + this.value + ".png')";
});

// Clic sur le canvas
cvs.addEventListener("click", infoImageCliquee);
function infoImageCliquee(e) {
    if (animationEnCours || enAttenteRetournement) return;

    const rect   = cvs.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Trouver la case cliquée
    let x = -1, y = -1;
    for (let col = 0; col <= 3; col++) {
        for (let lig = 0; lig <= 3; lig++) {
            if (mouseX >= getPx(col) && mouseX <= getPx(col) + largImg &&
                mouseY >= getPy(lig) && mouseY <= getPy(lig) + hautImg) {
                x = col;
                y = lig;
            }
        }
    }

    if (x === -1 || y === -1) return;

    if (finDuJeu === false) {
        const index       = y * 4 + x;
        const px          = getPx(x);
        const py          = getPy(y);
        const imageCliquee = tabImages[index];

        if (tabImagesTrouvees[index] !== img0) return;
        if (compteurImage === 1 && px === tabImagesCliquee1[1] && py === tabImagesCliquee1[2]) return;

        sonClic.play();

        if (compteurImage === 0) {
            animFlip(px, py, img0, imageCliquee, () => {
                tabImagesCliquee1 = [imageCliquee, px, py, index];
                tabImagesCliquee2 = [];
                compteurImage = 1;
            });
        } else {
            tabImagesCliquee2 = [];
            animFlip(px, py, img0, imageCliquee, () => {
                tabImagesCliquee2 = [imageCliquee, px, py, index];
                compteurImage = 0;

                if (tabImagesCliquee1[0] === tabImagesCliquee2[0]) {
                    // Paire trouvée !
                    sonKlaxon.play();
                    tabImagesTrouvees[tabImagesCliquee1[3]] = tabImagesCliquee1[0];
                    tabImagesTrouvees[tabImagesCliquee2[3]] = tabImagesCliquee2[0];
                    compteurImagesTrouvees += 2;
                    tabImagesCliquee1 = [];
                    tabImagesCliquee2 = [];
                    dessineTout();
                    mettreAJourCompteurs();

                    if (compteurImagesTrouvees >= 16) {
                        finDuJeu = true;
                        clearInterval(intervalTimer);
                        sonBravo.play();
                        document.getElementById("message").textContent = "Vous avez gagné, bravo !! Cliquez sur la grille pour recommencer.";
                    }
                } else {
                    // Paire ratée
                    compteurEssaisRates++;
                    mettreAJourInfosDifficulte();

                    if (compteurEssaisRates === 10) {
                        timerActif = true;
                        tempsRestant = 90;
                        sonTimer.play();
                        lancerTimer(1000);
                    } else if (compteurEssaisRates === 20) {
                        sonX2.play();
                        lancerTimer(500);
                    }

                    enAttenteRetournement = true;
                    const c1 = tabImagesCliquee1;
                    const c2 = tabImagesCliquee2;
                    tabImagesCliquee1 = [];
                    tabImagesCliquee2 = [];

                    setTimeout(() => {
                        let restant = 2;
                        const fin = () => { if (--restant === 0) enAttenteRetournement = false; };
                        animFlip(c1[1], c1[2], c1[0], img0, fin);
                        animFlip(c2[1], c2[2], c2[0], img0, fin);
                    }, 600);
                }
            });
        }
    } else {
        rechargeLeJeu();
    }
}

function rechargeLeJeu() {
    clearInterval(intervalTimer);
    location.reload();
}

window.onload = () => {
    let imagesChargees = 0;

    function verifierChargement() {
        imagesChargees++;
        if (imagesChargees === 9) {
            dessineTout();
            mettreAJourCompteurs();
            mettreAJourInfosDifficulte();
        }
    }

    for (let i = 0; i <= 8; i++) {
        if (window["img" + i].complete) {
            verifierChargement();
        } else {
            window["img" + i].onload = verifierChargement;
        }
    }
};












