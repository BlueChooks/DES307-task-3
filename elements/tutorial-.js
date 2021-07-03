class Tutorial extends HTMLElement {
    constructor() {
        super();
        //
    }

    async render() {
        let entries = [
            `Welcome to Rainforest. This game is still in development, and is currently designed to be viewed with an iPhone8+ in landscape mode. Please open your browser's 'inspect' panel and change your browser window to this configuration before continuing.`,
            `Your rainforest begins as an empty field. You can plant trees with the 'planter' <i class="fas fa-seedling"></i> tool. Selecting it will open a window that lets you choose which tree to plant. Each tree has its own requirements for where it can be planted. Some can grow anywhere, but some can only grow in moist soil. Moist soil is originally only found adjacent to a water source, but planting trees helps dry soil to retain moisture, allowing moist soil to spread away from the water.`,
            `After a while, trees will start to spread on their own. Some trees will even attract animals which will bring seeds from outside of the forest. When a new species is discovered this way, its encyclopedia entry will be completed and its seeds will be unlocked, so you can plant it yourself.`,
            `You can find information about each tree in the encyclopedia, including where they can be planted. The highlight <i class="fas fa-eye"></i> tool will show you which tiles meet certain requirements. The highlights can be dismissed with the unhighlight <i class="fas fa-eye-slash"></i> tool.`,
            `You can view information about a species by finding it in the encyclopedia or by tapping on it with the 'inspector' <i class="fas fa-search"></i> tool. You can also cut down a tree with the 'delete' <i class="fas fa-trash"></i> tool.`,
            `Can you discover all the trees?`
        ]
        // console.log(tutIndex, entries.length);

        
        this.innerHTML = `
            <p>${tutEntries[tutIndex]}</p>
            <div>
            <button id="tut-next">${tutIndex < tutEntries.length - 1 ? 'Next' : 'Start'}</button>
                <button id="tut-back"${tutIndex > 0 ? '' : ' class="hidden"'}>Back</button>
            </div>
        `;
    }

    connectedCallback() {
        // console.log('tutorial');
        this.render().then(() => {
            this.querySelector('#tut-back').addEventListener('click', () => {
                tutIndex--;
                this.connectedCallback();
            });

            this.querySelector('#tut-next').addEventListener('click', () => {
                if (tutIndex < tutEntries.length - 1) {
                    tutIndex++;
                    this.connectedCallback();
                } else {
                    this.classList.add('hidden');
                }
            });
        });
    }
} customElements.define('tutorial-', Tutorial);