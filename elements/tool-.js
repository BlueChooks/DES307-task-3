class Tool extends HTMLElement {
    constructor() {
        super();
        //
    }

    setSpecies(name) {
        let matchFound = false;
        let species;
        
        speciesList.forEach(entry => {
            if (entry.name === name) {
                matchFound = true;
                species = entry;
                return;
            }
        });
        if (!matchFound) { console.log(`no match found for ${name} in element` , this) }
        return species ? species : false;
    }

    renderSeedDisplay() {
        let species = this.setSpecies(currentSeed);

        let display = `
            <div id="seed-display" class="">
                <div></div>
                <div class="seed-display-main">
                    <button id="seed-picker-up"><i class="fas fa-chevron-up"></i></button>
                    <p>${species.name}</p>
                    <img src="./img/${species.img}" />
                    <button id="seed-picker-up"><i class="fas fa-chevron-down"></i></button>
                </div>
            </div>
        `;

        if (!this.parentElement.querySelector('#seed-display')) {
            this.parentElement.innerHTML += display;
        }
    }

    // openEncyclopedia() {
    //     // infoDrawer.classList.remove('info-collapsed');
    //     toggleEncyclopediaDrawer();
    // }

    async render() {
        if (this.id === 'inspector') {
            this.innerHTML = '<i class="fas fa-search"></i>';
        } else if (this.id === 'axe') {
            this.innerHTML = '<i class="fas fa-trash"></i>';
        } else if (this.id === 'planter') {
            this.innerHTML = '<i class="fas fa-seedling"></i>';
        } else if (this.id === 'unhighlight') {
            this.innerHTML = '<i class="fas fa-eye-slash"></i>';
        } else {
            console.log('tool render error. id: ', this.id);
        }
    }

    connectedCallback() {
        this.render().then(this.addEventListener('click', () => {
            let tools = this.parentElement.querySelectorAll('tool-');

            // remove all active
            tools.forEach(tool => {
                if (tool !== this && tool.classList.contains('active')) {
                    tool.classList.remove('active');
                }
            });
            
            if (!(this.id === 'unhighlight')) {
                this.classList.contains('active') ? this.classList.remove('active') : this.classList.add('active');
            }

            if (this.id === 'planter') {
                document.querySelector('seed-display').classList.contains('hidden') ? document.querySelector('seed-display').show() : document.querySelector('seed-display').hide();
            } else {
                document.querySelector('seed-display').hide();
            }

            if (this.id === 'unhighlight') {
                unhighlightAll();
                this.classList.add('hidden');
            }

            // inspector handled elsewhere
        }));
    }

} customElements.define('tool-', Tool);