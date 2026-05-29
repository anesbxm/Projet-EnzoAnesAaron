// Création du contexte graphique
const cvs = document.getElementById("zone_de_dessin");
cvs.width = 800;
cvs.height = 850;
const ctx = cvs.getContext("2d");
const largImg = 120;
const hautImg = 160;
const xO = 10;
const yO = 10;
let tabImagesCliquee1 =[];
let tabImagesCliquee2 =[];
let compteurImage = 0;


// Création des images
for (let i=0; i<=8; i++){
    window["img" + i] = new Image();
    window["img" + i].src = "../images/img" + i + ".jpg";
}

// Stockage des images dans un tableau
const tabImages = [];
for(let i=0; i<=7; i++){
    tabImages[2*i] = window["img" + (i+1)];
    tabImages[2*i+1] = window["img" + (i+1)];
}

// Mélange aléatoire des images du tabImages
tabImages.sort(() => Math.random() - 0.5);

// Création du tableau des images trouvées
const tabImagesTrouvees = [];
for(let i=0; i<=15; i++){
    tabImagesTrouvees[i]=img0;
}


// Dessin des images vignettes

function dessineImages(ctx, tabImg){
    for(let i=0; i<=3; i++){
        ctx.drawImage(tabImg[i],xO +i*largImg, yO);
        ctx.drawImage(tabImg[4 + i],xO +i*largImg, yO + hautImg);
        ctx.drawImage(tabImg[8 + i],xO +i*largImg, yO + 2*hautImg);
        ctx.drawImage(tabImg[12 + i],xO +i*largImg, yO + 3*hautImg);
    }
}

// Dessin de la grille
function dessineGrille(ctx){
    ctx.strokeStyle = "gold";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for(let i=0; i<=4; i++){
        // Lignes verticales
        ctx.moveTo(xO + i*largImg, yO);
        ctx.lineTo(xO +i*largImg, yO + 4*hautImg);
        // Lignes horizontales
        ctx.moveTo(xO, yO + i*hautImg);
        ctx.lineTo(xO + 4*largImg, yO + i*hautImg);
    }
    ctx.stroke();
}

// Action souris sur la zone de dessin
cvs.addEventListener("click", infoImageCliquee);
function infoImageCliquee(e) {
    const decalageSouris = 8;
    let x = Math.floor((e.clientX - decalageSouris) / largImg);
    let y = Math.floor((e.clientY - decalageSouris) / hautImg);
    let imageCliquee;

    if (y === 0) {
        switch (x) {
            case 0:
                imageCliquee = tabImages[0];
                break;
            case 1:
                imageCliquee = tabImages[1];
                break;
            case 2:
                imageCliquee = tabImages[2];
                break;
            case 3:
                imageCliquee = tabImages[3];
                break;
        }

    } else if (y === 1) {
        switch (x) {
            case 0:
                imageCliquee = tabImages[4];
                break;
            case 1:
                imageCliquee = tabImages[5];
                break;
            case 2:
                imageCliquee = tabImages[6];
                break;
            case 3:
                imageCliquee = tabImages[7];
                break;
        }

    } else if (y === 2) {
        switch (x) {
            case 0:
                imageCliquee = tabImages[8];
                break;
            case 1:
                imageCliquee = tabImages[9];
                break;
            case 2:
                imageCliquee = tabImages[10];
                break;
            case 3:
                imageCliquee = tabImages[11];
                break;
        }
    } else if (y === 3) {
        switch (x) {
            case 0:
                imageCliquee = tabImages[12];
                break;
            case 1:
                imageCliquee = tabImages[13];
                break;
            case 2:
                imageCliquee = tabImages[14];
                break;
            case 3:
                imageCliquee = tabImages[15];
                break;
        }
    }

    if (compteurImage === 0) {
        tabImagesCliquee1 = [imageCliquee, x * largImg + xO, y * hautImg + yO];
        tabImagesCliquee2 = [];
        compteurImage = 1;
    } else if (x * largImg + xO !== tabImagesCliquee1[1] || y * hautImg + yO !== tabImagesCliquee1[2])
        tabImagesCliquee2 = [imageCliquee, x * largImg + xO, y * hautImg + yO];
    compteurImage = 0;
    dessine();
}


function dessinImageCliquee(ctx){
    if (tabImagesCliquee1.length > 0){
        ctx.drawImage(tabImagesCliquee1[0], tabImagesCliquee1[1], tabImagesCliquee1[2])
    }
    if (tabImagesCliquee2.length > 0){
        ctx.drawImage(tabImagesCliquee2[0], tabImagesCliquee2[1], tabImagesCliquee2[2])
    }
}
function dessine(){
    dessineImages(ctx, tabImagesTrouvees);
    dessinImageCliquee(ctx)
    dessineGrille(ctx);
}

window.onload = () => {dessine();}

















