/**
 * contains methods for monitoring global counts and whatnot
 * creates water source
 */

class Grid extends HTMLElement {
    constructor(future) {
        super();
        this.rows = this.getRowNum();
        this.cols = this.getColNum();
    }

    // ---=== utilities ===--- //

    getRowNum() {
        return this.getAttribute('rows') * 1;
    }

    getColNum() {
        return this.getAttribute('cols') * 1;
    }

    getRandomTile(numTiles, location) { // returns a random tile not within a certain number of tiles from a given location
        let attempt;
        let checkFailed;
        let checkFailed2;

        if (!numTiles) {
            return this.children[Math.floor(Math.random() * this.getRowNum())].children[Math.floor(Math.random() * this.getColNum())];
        }

        if (location === 'edge') {
            do {
                attempt = this.children[Math.floor(Math.random() * this.getRowNum())].children[Math.floor(Math.random() * this.getColNum())];
                checkFailed = (attempt.x < numTiles) || (attempt.x > this.getColNum() - numTiles) || (attempt.y < numTiles) || (attempt.y > this.getRowNum() - numTiles);
            } while (checkFailed);

            return attempt;
        } else  { // check against a specific tile. Assume location is a GridCell object AND ALSO THAT IT CAN'T BE NEAR AN EDGE
            do {
                attempt = this.children[Math.floor(Math.random() * this.getRowNum())].children[Math.floor(Math.random() * this.getColNum())];
                checkFailed = (attempt.x > location.x - numTiles) && (attempt.x < location.x + numTiles) && (attempt.y > location.y - numTiles) && (attempt.y < location.y + numTiles);
                checkFailed2 = (attempt.x < numTiles) || (attempt.x > this.getColNum() - numTiles) || (attempt.y < numTiles) || (attempt.y > this.getRowNum() - numTiles);
            } while (checkFailed || checkFailed2);
            return attempt;
        }

    }

    getRandomEdgeTile(edge) {
        if (edge == 'top') { return this.children[0].children[Math.floor(Math.random() * this.getColNum())]; }
        if (edge == 'bottom') { return this.children[this.getRowNum() - 1].children[Math.floor(Math.random() * this.getColNum())]; }
        if (edge == 'left') { return this.children[Math.floor(Math.random() * this.getRowNum())].children[0]; }
        if (edge == 'right') { return this.children[Math.floor(Math.random() * this.getRowNum())].children[this.getColNum() - 1]; }

        console.log('GetRandomEdgeTile error');
    }




    getTile(x, y) {
        // return the tile with the given coordinates
        return this.querySelectorAll('div')[y].querySelectorAll('tile-')[x];
    }

    createWaterSource(tile) {
        // spread water source from given tile
        tile.spreadPond();
    }

    randomSpread() {
        let spread = setInterval(() => {
            let trees = this.querySelectorAll('tree-');
            trees[Math.floor(Math.random() * trees.length)].spread();
        }, 10000);
    }

    // ---=== render ===--- //

    renderGrid() {
        for (let i = 0; i < this.rows; i++) {
            let newRow = document.createElement('div');
            newRow.classList.add('row');
            this.appendChild(newRow);

            for (let j = 0; j < this.cols; j++) {
                this.querySelectorAll('div.row')[i].appendChild(new Tile(j, i));
            }
        }
    }

    connectedCallback() {
        this.renderGrid();
        
        this.createWaterSource(this.getTile(0, 0));

        this.randomSpread();
    }
}
customElements.define('grid-', Grid);

