const items = [
    'banana',
    'pasteque',
    'citron',
    'plum',
    'sept',
    'bigwin',
    'bar',
    'cerise',
    'orange',
]

const SOLDE_DEPART = 50 
const MISE_DEPART = 10   

const resultats = [null, null, null]
let enRotation = false

const bouton = document.getElementById('lancer')         
const rouleaux = document.querySelectorAll('.slot-img img') 
const message = document.getElementById('message')        
const gainsEl = document.getElementById('gainsDeUser')     
const miseInput = document.getElementById('miseDeUser')    
const miseAffichee = document.getElementById('miseAffichee')


const MISE_MIN = parseInt(miseInput.min, 10) || 10


const sons = {
    clic: new Audio('../sons/clic.mp3'),    
    bravo: new Audio('../sons/Bravo.mp3'), 
    klaxon: new Audio('../sons/klaxon.mp3'),
}

const jouerSon = (nom) => {
    const s = sons[nom]
    if (!s) return
    s.currentTime = 0
    s.play().catch(() => {})
}

const getSolde = () => parseInt(gainsEl.textContent, 10) || 0

const setSolde = (n) => {
    gainsEl.textContent = n
    gainsEl.classList.remove('flash')
    void gainsEl.offsetWidth 
    gainsEl.classList.add('flash')
}

const getMise = () => parseInt(miseInput.value, 10) || 0

const ajusterBornesMise = () => {
    const solde = getSolde()
    if (getMise() > solde) miseInput.value = Math.max(solde, MISE_MIN)
    if (getMise() < MISE_MIN) miseInput.value = MISE_MIN
}

const normaliserMise = () => {
    ajusterBornesMise()
    let m = getMise()
    const solde = getSolde()
    if (isNaN(m) || m < MISE_MIN) m = MISE_MIN
    if (m > solde) m = solde
    miseInput.value = m
}

const majEtat = () => {
    ajusterBornesMise()
    const m = getMise()
    const solde = getSolde()
    const valide = m >= MISE_MIN && m <= solde && solde > 0

    miseAffichee.textContent = m
    if (!enRotation) bouton.disabled = !valide
    return valide
}

const afficherMessage = (texte, classe) => {
    message.textContent = texte
    message.className = classe || ''
}

document.querySelectorAll('.chip').forEach((chip) => {
    chip.addEventListener('click', () => {
        if (enRotation) return // on ne change pas la mise pendant que ça tourne
        const solde = getSolde()

        if (chip.id === 'miseMax') {
            miseInput.value = solde                          
        } else if (chip.dataset.set) {
            miseInput.value = Math.min(parseInt(chip.dataset.set, 10), solde)
        } else if (chip.dataset.delta) {
            miseInput.value = getMise() + parseInt(chip.dataset.delta, 10)
        }

        normaliserMise()
        majEtat()
        jouerSon('clic')
    })
})

document.getElementById('reset').addEventListener('click', () => {
    if (enRotation) return
    setSolde(SOLDE_DEPART)
    miseInput.value = MISE_DEPART
    document.querySelectorAll('.slot-img').forEach((el) => el.classList.remove('gagnant'))
    afficherMessage('Partie réinitialisée. Lancez !', '')
    majEtat()
    jouerSon('clic')
})


const lancer = () => {
    if (enRotation) return

    const solde = getSolde()
    if (solde <= 0) {
        afficherMessage('💸 Plus de solde ! Réinitialise la partie.', 'perte')
        return
    }

    if (!majEtat()) {
        const m = getMise()
        afficherMessage(m > solde ? '⚠️ Mise supérieure au solde.' : '⚠️ Mise invalide.', 'perte')
        return
    }
    enRotation = true
    bouton.disabled = true

    afficherMessage('🎲 Ça tourne...', '')
    jouerSon('clic')

    rouleaux.forEach((imgEl, index) => {
        imgEl.closest('.slot-img').classList.remove('gagnant')
        const tempsArret = 1000 + 1000 * index
        randomizeImgs(imgEl, index, tempsArret)
    })
}

bouton.addEventListener('click', lancer)

const chooseRandom = (imgEl, index) => {
    const random = Math.floor(Math.random() * items.length) 
    const selectedItem = items[random]
    imgEl.src = `../images/slot_items/${selectedItem}.png`
    imgEl.alt = selectedItem
    imgEl.classList.add('animate')    
    resultats[index] = selectedItem     
}

const randomizeImgs = (imgEl, index, time) => {
    const timeInterval = setInterval(() => {
        chooseRandom(imgEl, index)
    }, 100)

    setTimeout(() => {
        clearInterval(timeInterval)        
        imgEl.classList.remove('animate')  
        jouerSon('clic')

        if (index === rouleaux.length - 1) {
            resultatMachine()
        }
    }, time)
}


const resultatMachine = () => {
    const mise = getMise()
    const solde = getSolde()
    const [a, b, c] = resultats 

    if (a === b && b === c) {
        setSolde(solde + mise * 10)
        afficherMessage(`🎉 JACKPOT ! +${mise * 10} 🎉`, 'jackpot')
        document.querySelectorAll('.slot-img').forEach((el) => el.classList.add('gagnant'))
        jouerSon('bravo')
    } else if (a === b || b === c || a === c) {
        setSolde(solde + mise * 2)
        afficherMessage(`✨ Bien joué ! +${mise * 2}`, 'gain')
        jouerSon('bravo')
    } else {
        setSolde(solde - mise)
        afficherMessage(`💥 Perdu... -${mise}`, 'perte')
        jouerSon('klaxon')
    }

    enRotation = false
    normaliserMise()
    majEtat()
}
majEtat()