class Requisite extends HTMLElement {
    constructor() {
        super();
        this.needIndex;
        this.species;
        this.need;
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

    setNeed() {
        this.need = this.species.needs[this.getAttribute('needIndex')];
    }

    highlightFunctionality() {
        let btn = this.querySelector('.highlighter');
        if (this.need.check) {
            btn.addEventListener('click', () => {
                unhighlightAll();
                document.querySelectorAll('tile-').forEach(tile => {
                    if (this.need.check(tile) && !tile.water && !(this.species.type === 'tree' && tile.hasTree())) {
                        tile.classList.add('highlight');
                    }
                });

                // display unhighlight button
                document.getElementById('unhighlight').classList.remove('hidden');
                highlights = true;

                toggleEncyclopediaDrawer();
            });
        }

        let chev = this.querySelector('.requisite-dropper');
        chev.addEventListener('click', () => {
            if (chev.querySelector('i').classList.contains('fa-chevron-down')) {
                chev.querySelector('i').classList.remove('fa-chevron-down');
                chev.querySelector('i').classList.add('fa-chevron-up');
            } else {
                chev.querySelector('i').classList.remove('fa-chevron-up');
                chev.querySelector('i').classList.add('fa-chevron-down');
            }
        });
    }

    async render() {
        this.innerHTML = `
            <div class="requisite-summary">
                ${this.need.icon}
                <span class="body-text">${this.need.brief}</span>
                <button class="highlighter"><i class="fas fa-eye"></i></button>
                <button class="requisite-dropper hidden"><i class="fas fa-chevron-up"></i></button>
            </div>
            <div class="requisite-dropdown requisite-collapsed">
                <p>${this.need.info}</p>
            </div>
        `;
    }

    connectedCallback() {
        this.setSpecies(this.getAttribute('species'));
        this.setNeed();
        this.render().then(this.highlightFunctionality());
    }
} customElements.define('requisite-', Requisite);