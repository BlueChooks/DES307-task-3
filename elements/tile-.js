/**
 * Contains methods for getting and checking surrounding tiles, spawning a new plant
 * Contains information on water levels
 * Only one plant per tile (therefore only one child element allowed)
 */

let maxWaterTiles = 15;
let currentWaterTiles = 0;

class Tile extends HTMLElement {
    constructor(x, y) {
        super();
    
        this.x = x;
        this.y = y;

        this.moist = false;
        this.water = false;

        this.tree;
   
        this.setAttribute('x', x);
        this.setAttribute('y', y);

        this.tickSpeed = 500;

        this.addEventListener('click', () => this.useTool());
    }

    useTool() {
        if (document.getElementById('planter').classList.contains('active')) {
            this.plantTree();
        } else if (document.getElementById('axe').classList.contains('active')) {
            this.clearTree();
        } else if (document.getElementById('inspector').classList.contains('active')) {
            //
        } else {
            console.log ('No tool active. Click on a tree to test its spreading behaviour.');
            // console.log(this.water);
            if (this.hasTree()) {
                this.querySelector('tree-').spread();
            }
        }
    }

    // ---=== utilities ===--- //

    randomFrom(arr) { // returns a random item from given array
        let item = arr[Math.floor(Math.random() * arr.length)];
        return item;
    }

    hasTree() {
        return this.querySelector('tree-') ? true : false;
    }
    // ---=== child methods ===--- //

    // takes an array of HTMLElements (should be species) and adds them as children
    addResidents(arr) {
        arr.forEach(resident => {
            // this.appendChild(resident);
            this.innerHTML = resident;
        });
    }

    plantTree() {
        let needsMet = true;

            getSpeciesByName(currentSeed).needs.forEach(need => {
                if (!need.check(this)) {
                    needsMet = false;
                    return;
                }
            });
        // if (!this.querySelector('tree-')) {
        if (!this.hasTree() && needsMet) {
            this.innerHTML = `<tree- species="${currentSeed}"></tree->`;
            if (this.moist) {
                this.spreadMoist();
            }
        }
    }

    plantTreeAuto(speciesName) {
        // console.log(`plantTreeAuto(${speciesName})`);
        this.innerHTML = `<tree- species="${speciesName ? speciesName : currentSeed}"></tree->`;
        if (this.moist) {
                this.spreadMoist();
            }
    }

    getTree() {
        return this.hasTree() ? this.querySelector('tree-').getSpecies() : 'no tree';
    }

    clearTree() {
        if (this.hasTree()) {
            this.innerHTML = '';
            this.getSurrounds().forEach(tile => {
                if (!tile.shouldBeMoist()) {
                    tile.removeMoist();
                }
            });
        }
    }

    shouldBeMoist() {
        let shouldBeMoist = false;

        this.getSurrounds().forEach(tile => {
            if (tile.hasTree() && tile.moist || tile.water) {
                shouldBeMoist = true;
                return;
            }
        });

        return shouldBeMoist;
    }

    // returns an array of this tile's child elements (which should only be species)
    getResidents() {
        return Array.from(this.children);
    }

    // // checks whether this contains any species in given array
    // containsSpecies(speciesArr) {
    //     // return speciesArr.forEach(species => this.querySelectorAll('*').includes(species) ? true : false);
    //     return speciesArr.forEach(species => this.childNodes.includes(species) ? true : false);
    //     // only works for direct children, but I'm thinking animals should be grandchildren of tiles - nested in trees?
    // }

    // takes a string and a number. Returns how many of the given species exist within radius of this tile
    countSpecies(species, radius) {
        let allResidents = [];
        let count = 0;

        // fill allResidents
        this.getTilesWithinRadius(radius).forEach(tile => allResidents.concat(tile.getResidents()));

        // count allResidents
        alllResidents.forEach(resident => {
            if (resident.species === species) {
                count++;
            }
        });

        return count;
    }

    // ---=== grid methods ===--- //
    randomDirection() {
        return this.randomFrom(['up', 'down', 'left', 'right']);
        // return ['up', 'down', 'left', 'right'][Math.floor(Math.random() * 4)];
    }

    getTile(direction) {
        let targetX;
        let targetY;
        if (direction == 'up') {
            targetX = this.x;
            targetY = this.y - 1;
        } else if (direction == 'down') {
            targetX = this.x;
            targetY = this.y + 1;
        } else if (direction == 'left') {
            targetX = this.x - 1;
            targetY = this.y;
        } else {
            targetX = this.x + 1;
            targetY = this.y;
        }

        let targetElement = this.parentElement.parentElement.querySelector(`tile-[x="${targetX}"][y="${targetY}"]`);
        return targetElement ? targetElement : false;
    }

    // returns an array of existing surrounding cells
    // clunky - consider rewriting
    getSurrounds() {
        let surrounds = [
            this.getTile('up') ? this.getTile('up').getTile('left') : false,
            this.getTile('up'),
            this.getTile('up') ? this.getTile('up').getTile('right') : false,
            this.getTile('right'),
            this.getTile('down') ? this.getTile('down').getTile('right') : false,
            this.getTile('down'),
            this.getTile('down') ? this.getTile('down').getTile('left') : false,
            this.getTile('left')
        ];

        let validSurrounds = [];

        for (let i = 0; i < surrounds.length; i++) {
            if (surrounds[i]) {
                validSurrounds.push(surrounds[i]);
            }
        }
        return validSurrounds;
    }

    // scrubs through an array of tiles, gets all surrounding tiles,
    // and outputs an array containing surrounds - no duplicates
    getMultipleSurrounds(arr) {
        let output = [];

        arr.forEach(tile => {
            let surrounds = tile.getSurrounds();

            surrounds.forEach(item => {
                if (!output.includes(item)) {
                    output.push(item);
                }
            });
        });

        return output;
    }

    // gets every tile within a given radius of 'this' - no duplicates
    getTilesWithinRadius(radius) {
        let output = [this];

        while (radius > 0) {
            let temp = this.getMultipleSurrounds(output);
            temp.forEach(tile => {
                if (!output.includes(tile)) {
                    output.push(tile);
                }
            });
            radius--;
        }
        // output.forEach(tile => tile.innerHTML += 'o'); //  testing that each tile is only represented once
        return output;
    }

    // sets this tile to water
    setWater() {
        this.water = true;
        this.moist = false;
        if (this.classList.contains('moist')) {
            this.classList.remove('moist');
        }
        // this.style.backgroundColor = 'blue';
        currentWaterTiles++;

        // console.log(this.classList[0]);
        this.getSurrounds().forEach(tile => {
            if (!tile.water && !tile.moist) {tile.setMoist()}
        });
    }

    // sets this tile to moist
    setMoist() {
        if (!this.moist) {
            this.moist = true;
            this.classList.add('moist');
        } else {
            console.log('setMoist called, but tile already moist');
        }
    }

    removeMoist() {
        if (this.moist) {
            this.moist = false;
            this.classList.remove('moist');
        } else {
            console.log('removeMoist called, but tile not moist');
        }
    }

    // called when placing a tree. Spreads moisture around new tile
    spreadMoist() {
        if (this.hasTree()) {
            this.getSurrounds().forEach(tile => {
                if (!tile.water && !tile.moist) {
                    tile.setMoist();
                    tile.spreadMoist();
                }
            });
        }
    }

    // creates a pond of a specific size
    spreadPond() {
        this.setWater();
        this.classList.add('water');

        let spread = setInterval(() => {
            let targetTile = this.getTile(this.randomDirection());
            if (currentWaterTiles < maxWaterTiles) {
                if (targetTile && !targetTile.water) {
                    targetTile.spreadPond();
                }
            } else {
                clearInterval(spread);
            }
        }, 0);
    }

    // ---=== render ===--- //    

    connectedCallback() {
        //
    }
} customElements.define('tile-', Tile);