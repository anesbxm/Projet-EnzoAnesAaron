document.querySelector('button').addEventListener('click', () => {
        const items = [
            'banane',
            'pasteque',
            'citron',
            'plum',
            'sept',
            'bigwin',
            'bar',
            'cerise',
            'orange',
        ]

        const random = Math.floor(Math.random() * 9)

        const selectedItem = items[random]
        document.querySelector("img").src = `../images/slot_items/${selectedItem}.png`
    });
