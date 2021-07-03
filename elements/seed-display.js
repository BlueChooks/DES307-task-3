class SeedDisplay extends HTMLElement {
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

    hide() {
        if (!this.classList.contains('hidden')) {
            this.classList.add('hidden');
        }
    }

    show() {
        if (this.classList.contains('hidden')) {
            this.classList.remove('hidden');
        }
    }

    // changes global currentSeed in relation to current. Used by buttons
    // need to account for locked species
    changeSeed(direction) {
        let unlockedSpec = [];
        let spec;
        let index;

        speciesList.forEach(entry => {
            if (entry.unlocked) {
                unlockedSpec.push(entry);
            }
        });

        unlockedSpec.forEach(entry => {
            if (entry.name === currentSeed) {
                spec = entry;
            }
        });

        index = unlockedSpec.indexOf(spec);

        if (direction === 'up') {
            let newIndex = index != unlockedSpec.length - 1 ? index + 1 : 0;
            currentSeed = unlockedSpec[newIndex].name;
        } else {
            let newIndex = index > 0 ? index - 1 : unlockedSpec.length - 1;
            currentSeed = unlockedSpec[newIndex].name;
        }
        
        this.connectedCallback();
    }

    // must be called after render()
    addFunctionsToBtns() {
        this.querySelector('#seed-picker-up').addEventListener('click', () => {
            this.changeSeed('up');
        });

        this.querySelector('#seed-picker-down').addEventListener('click', () => {
            this.changeSeed('down');
        });
    }

    render() {
        this.setSpecies(currentSeed);
        this.innerHTML = `
            <div></div>
            <div class="seed-display-main">
                <button id="seed-picker-up"><i class="fas fa-chevron-up"></i></button>
                <p>${this.species.name}</p>
                <img src="./img/${this.species.img}" />
                <button id="seed-picker-down"><i class="fas fa-chevron-down"></i></button>
            </div>
        `;
    }

    connectedCallback() {
        this.render();
        // this.querySelector('img').addEventListener('click', () => {
        //     this.hide();
        // });

        this.addFunctionsToBtns();
    }
} customElements.define('seed-display', SeedDisplay);