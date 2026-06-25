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

document.querySelector('button').addEventListener('click', () => {

    // document.querySelectorAll("img").forEach((imgEl) => {
    // const random = Math.floor(Math.random() * items.length)
    // const selectedItem = items[random]
    // imgEl.src = `../images/slot_items/${selectedItem}.png`
    // })
    document.querySelectorAll('img').forEach((imgEl, index) => {
        const randomTime = 1000 + 1000 * index
        randomizeImgs(imgEl, randomTime)
     //   chooseRandom(imgEl)
       // setTimeout(() => {

       // }, randomTime
    })
})

const randomizeImgs = (imgEl, time) => {
    const timeInterval = setInterval(() => {
        imgEl.classList.remove("animate")
        chooseRandom(imgEl);
    }, 100)

    setTimeout(() => {
        imgEl.classList.remove("animate")
        clearInterval(timeInterval);
        console.log(`Rouleau ${index} : ${resultats[index]}`);

        if (index === 2) {
            resultatMachine();
        }
    }, time)   // ← time ici, pas hardcodé

    const chooseRandom = (imgEl) => {
        const random = Math.floor(Math.random() * items.length)
        const selectedItem = items[random]
        imgEl.src = `../images/slot_items/${selectedItem}.png`
        imgEl.classList.add("animate")
        resultats[index] = selectedItem;
    };
}