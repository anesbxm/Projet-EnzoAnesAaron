// Création du contexte graphique
const cvs = document.getElementById("zone_de_dessin");
cvs.width = 800;
cvs.height = 850;
const ctx = cvs.getContext("2d");
const largImg = 120;
const hautImg = 160;
const xO = 10;
const yO = 10;


// Création des images
for (let i=O; i<=8; i++){
    window["img" + i] = new Image();
    window["img" + i].src = "images/img" + i + ".jpg";
}

// Stockage des images dans un tableau
const tabImages = [];
for(let i=0; i<=7; i++){
    tabImages[2*i] = window["img" + (i+1)];
    tabImages[2*i+1] = window["img" + (i+1)];
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

function dessine(){
    dessineImages(ctx, tabImages);
    dessineGrille(ctx);
}

dessine();

















