class Entry extends HTMLElement {
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

    // <button class="highlighter"><i class="fas fa-eye"></i></button> // goes under the <h1>
    async render() {
        let titleArea = `
            <div class="entry-title-area">
                <span class="entry-exit"><i class="fas fa-chevron-left"></i></span>
                <h1>${this.species.unlocked ? this.species.name : '???'}</h1>
            </div>
        `;

        let infoArea = `
            <div id="entry-info-area">
                <div id="entry-img-container">
                    <img src="./img/${this.species.img}" ${this.species.unlocked ? 'class' : 'class="species-locked"'} />
                </div>
                <div id="entry">
                    <h2>Description</h2>
                    <p id="entry-body" class="body-text">${this.species.unlocked ? this.species.description : this.species.lockedDesc}</p>
                    <h2>Needs</h2>
                    <requisite-list species="${this.species.name}"></requisite-list>
                </div>
            </div>
        `

        this.innerHTML = titleArea + infoArea;
        this.querySelector('.entry-exit').addEventListener('click', () => {
            this.classList.add('entry-collapsed');
        });
    }

    connectedCallback() {
        this.setSpecies(this.getAttribute('species'));
        this.render().then(() => {
            this.querySelector('.entry-exit').addEventListener('click', () => {
                this.classList.add('entry-collapsed');
            });

            // console.log(this.querySelector('.highlighter').innerHTML);
            // this.querySelector('.highlighter').addEventListener('click', () => {
            //     unhighlightAll();
            //     document.querySelectorAll('tile-').forEach(tile => {
            //         if (tile.hasTree() && tile.querySelector('tree-').species === this.species) {
            //             tile.classList.add('highlight');
            //         }
            //     });

            //     document.getElementById('unhighlight').classList.remove('hidden');
            //     highlights = true;

            //     toggleEncyclopediaDrawer();
            // });
        });
    }
} customElements.define('entry-', Entry);