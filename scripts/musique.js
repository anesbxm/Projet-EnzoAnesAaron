// ====================================================================
//  Musique de fond — générée en Web Audio API (aucun fichier requis)
//  Une petite mélodie de casino bouclée, avec basse + arpège.
//  Ajoute automatiquement un bouton flottant 🔊 pour activer/couper.
// ====================================================================

(() => {
    let ctx = null;          // AudioContext (créé au 1er clic, exigé par les navigateurs)
    let masterGain = null;   // volume global
    let loopTimer = null;    // timer de la boucle
    let enCours = false;

    // Notes (fréquences en Hz)
    const N = {
        C3: 130.81, E3: 164.81, G3: 196.0, A3: 220.0,
        C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23,
        G4: 392.0, A4: 440.0, B4: 493.88, C5: 523.25, E5: 659.25,
    };

    // Mélodie principale (note, durée en temps)
    const melodie = [
        [N.C4, 1], [N.E4, 1], [N.G4, 1], [N.C5, 1],
        [N.B4, 1], [N.G4, 1], [N.E4, 1], [N.G4, 1],
        [N.A4, 1], [N.F4, 1], [N.C4, 1], [N.F4, 1],
        [N.G4, 1], [N.E4, 1], [N.C4, 1], [N.G3, 1],
    ];

    // Ligne de basse
    const basse = [N.C3, N.C3, N.A3, N.A3, N.F4 / 2, N.F4 / 2, N.G3, N.G3];

    const TEMPO = 0.22; // durée d'un temps (secondes)

    // Joue une note avec une enveloppe douce
    const jouerNote = (freq, debut, duree, type, volume) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        osc.connect(gain);
        gain.connect(masterGain);

        const t = ctx.currentTime + debut;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(volume, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + duree);

        osc.start(t);
        osc.stop(t + duree + 0.05);
    };

    // Joue une fois toute la séquence
    const jouerBoucle = () => {
        let temps = 0;

        melodie.forEach(([freq, d]) => {
            jouerNote(freq, temps, d * TEMPO * 0.9, 'triangle', 0.18);
            temps += d * TEMPO;
        });

        // Basse, sur toute la durée de la mélodie
        const dureeTotale = melodie.reduce((s, [, d]) => s + d, 0) * TEMPO;
        const pasBasse = dureeTotale / basse.length;
        basse.forEach((freq, i) => {
            jouerNote(freq, i * pasBasse, pasBasse * 0.95, 'sine', 0.25);
        });

        // Replanifie la boucle
        loopTimer = setTimeout(jouerBoucle, dureeTotale * 1000);
    };

    const demarrer = () => {
        if (!ctx) {
            ctx = new (window.AudioContext || window.webkitAudioContext)();
            masterGain = ctx.createGain();
            masterGain.gain.value = 0.5;
            masterGain.connect(ctx.destination);
        }
        if (ctx.state === 'suspended') ctx.resume();
        enCours = true;
        jouerBoucle();
    };

    const arreter = () => {
        enCours = false;
        if (loopTimer) clearTimeout(loopTimer);
        if (ctx) ctx.suspend();
    };

    // Bouton flottant
    const creerBouton = () => {
        const btn = document.createElement('button');
        btn.id = 'btn-musique';
        btn.type = 'button';
        btn.textContent = '🔈 Musique';
        btn.title = 'Activer / couper la musique';
        document.body.appendChild(btn);

        btn.addEventListener('click', () => {
            if (enCours) {
                arreter();
                btn.textContent = '🔈 Musique';
                btn.classList.remove('actif');
            } else {
                demarrer();
                btn.textContent = '🔊 Musique';
                btn.classList.add('actif');
            }
        });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', creerBouton);
    } else {
        creerBouton();
    }
})();
