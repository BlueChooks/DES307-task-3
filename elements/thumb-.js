class Thumb extends HTMLElement {
    constructor() {
        super();
         this.species;
    }

    setSpecies(name) {
        let matchFound = false;
        
        speciesList.forEach(entry => {
            if (entry.name === name) {
                matchFound = true;
                this.species = entry;
                return;
            }
        });
        if (!matchFound) { console.log(`no match found for ${name} in element`, this) }
    }

    async render() {
        let thumb = `<div class='thumbnail'><img src="./img/${this.species.img}" ${this.species.unlocked ? 'class' : 'class="species-locked"'} /></div>`;
        let highlight = `<button class="highlighter"><i class="fas fa-eye"></i></button>`;

        this.innerHTML = thumb;
    }

    connectedCallback() {
        // console.log('thumb connectedCallback');
        this.setSpecies(this.getAttribute('species'));
        this.render().then(() => {
            this.querySelector('div').addEventListener('click', () => {
                let entryContainer = document.getElementById('entry-container');
                entryContainer.setSpecies(this.species.name);
                entryContainer.render();
                entryContainer.classList.remove('entry-collapsed');
            });

            // this.querySelector('.highlighter').addEventListener('click', () => {
            //     unhighlightAll();
            //     document.querySelectorAll('tile-').forEach(tile => {
            //         // console.log(this.species, tile.querySelector('tree-').species);
            //         // console.log(tile.hasTree() ? tile.querySelector('tree-').species : 0);
            //         if (tile.hasTree() && tile.querySelector('tree-').species === this.species) {
            //             tile.classList.add('highlight');
            //         }
            //     });
            //     toggleEncyclopediaDrawer();
            // });
        });
    }
} customElements.define('thumb-', Thumb);