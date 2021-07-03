class RequisiteList extends HTMLElement {
    constructor(speciesName) {
        super();
        this.speciesName = speciesName;
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
        let content = '';
        this.species.needs.forEach(need => {
            let needIndex = this.species.needs.indexOf(need);
            content += `<requisite- species="${this.species.name}" needIndex="${needIndex}" class="requisite"></requisite->`;
        });

        this.innerHTML = content;
    }

    connectedCallback() {
        this.speciesName ? this.setSpecies(this.speciesName) : this.setSpecies(this.getAttribute('species'));
        this.render().then(() => {
            let index = 0;
            this.querySelectorAll('.requisite-dropper').forEach(element => {
                // add info dropdown functionality
                let dropdown = this.querySelectorAll('.requisite-dropdown')[index];
                element.addEventListener('click', () => {
                    dropdown.classList.contains('requisite-collapsed') ? dropdown.classList.remove('requisite-collapsed') : dropdown.classList.add('requisite-collapsed');
                });

                index++;
            });
        });
    }
} customElements.define('requisite-list', RequisiteList);