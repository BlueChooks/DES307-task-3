class Tree extends HTMLElement {
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

    getSpecies() {
        return this.species.name;
    }

    // gets empty tiles within a given radius. Used to find a tile to spread to
    getEmptySurrounds(radius) {
        let surrounds = this.parentElement.getTilesWithinRadius(radius);
        let emptySurrounds = [];
        surrounds.forEach(t => { // reduce surrounds to just eucalypt tiles
            if (!t.hasTree() && !t.water) {
                emptySurrounds.push(t);
                // console.log(tile);
            }
        });
        
        return emptySurrounds;
    }

    // picks an option this species' spreads[]
    // checks that species' needs against empty surrounding tiles
    // picks a valid empty tile and spawns the chosen species in it
    spread() {
        let targetSpecies = getSpeciesByName(this.species.spreads[Math.floor(Math.random() * this.species.spreads.length)]);
        let surrounds = this.parentElement.getSurrounds();
        let temp = [];
        surrounds.forEach(tile => { // remove water tiles
            if (!tile.water) {
                temp.push(tile);
            }
        });
        surrounds = temp;
        temp = [];

        surrounds.forEach(tile => {
            let needsMet = 0;
            targetSpecies.needs.forEach(need => {
                if (!need.check(tile)) {
                    return;
                } else {
                    needsMet++;
                }
            });

            if (needsMet === targetSpecies.needs.length) {
                temp.push(tile);
            }
        });
        surrounds = temp;
        temp = [];

        if (surrounds.length > 0) {
            surrounds[Math.floor(Math.random() * surrounds.length)].plantTreeAuto(targetSpecies.name);
            if (!targetSpecies.unlocked) {
                targetSpecies.unlocked = true;
                document.querySelectorAll('thumb-').forEach(thumb => thumb.connectedCallback());
            }
        }
    }

    async render() {
        // careful - can't call twice without deleting inhabitants
        this.innerHTML = `
            <img src="./img/${this.species.img}" />
        `;
    }

    connectedCallback() {
        this.setSpecies(this.getAttribute('species'));

        // feed some sort of info to global counters
        this.render().then(() => {
            this.addEventListener('click', () => {
                if (document.getElementById('inspector').classList.contains('active')) {
                    toggleEncyclopediaDrawer();
                    let entryContainer = document.getElementById('entry-container');
                    entryContainer.setSpecies(this.species.name);
                    entryContainer.render();
                    // entryContainer.connectedCallback();
                    entryContainer.classList.remove('entry-collapsed');
                }
            });
        });
    }
} customElements.define('tree-', Tree);