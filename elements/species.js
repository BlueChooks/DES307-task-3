let stubDesc = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
let lockedDesc = 'Unlock this species to learn more';

// ---=== needs ===--- //
let moistSoil = {
    name: 'moistSoil',
    icon: '<i class="fas fa-tint"></i>',
    brief: 'Moist Soil',
    info: 'Can only spread to tiles with moist soil. Moist soil can be found adjacent to water sources and trees.',
    check: tile => {
        return tile.moist && !tile.hasTree() ? true : false;
    }
};

let dryTolerant = {
    name: 'dryTolerant',
    icon: '<i class="fas fa-tint-slash"></i>',
    brief: 'Tolerates Low Moisture',
    info: 'Can spread slowly to tiles without access to water.',
    check: tile => {
        return !tile.hasTree();
    }
}

let fullSun = {
    name: 'fullSun',
    icon: '<i class="fas fa-sun"></i>',
    brief: 'Full Sun',
    info: 'Cannot spread to a tile without any empty neighbours.',
    check: tile => {
        let treeCount = 0;
        let surrounds = tile.getSurrounds();
        surrounds.forEach(t => {
            if (t.hasTree()) {
                treeCount++;
            };
        });

        return (treeCount < surrounds.length) && !tile.hasTree() ? true : false;
    }
};

let lowLightTolerant = {
    name: 'lowLightTolerant',
    icon: '<i class="fas fa-cloud-sun"></i>',
    brief: 'Tolerates Low Light',
    info: 'Can spread slowly to tiles without any empty neighbours.', 
    check: tile => {
        return !tile.hasTree();
    }
};

let waterAdjacent = {
    name: 'waterAdjacent',
    icon: '<i class="fas fa-tint"></i>',
    brief: 'Thirsty',
    info: 'Only grows next to water tiles',
    check: tile => {
        let surrounds = tile.getSurrounds();
        let hasWater = false;
         surrounds.forEach(t => {
            if (t.water) {
                hasWater = true;
                return;
            }
        });

        return hasWater && !tile.water && !tile.hasTree();
    }
}

let parasitic = {
    name: 'parasitic',
    icon: '<i class="fas fa-bug"></i>',
    brief: 'Parasitic',
    info: 'Must replace an existing tree',
    check: tile => {
        // console.log('parasitic', tile.hasTree());
        return tile.hasTree();
    }
}

let frugivores = {
    name: 'frugivore',
    icon: '<i class="fas fa-apple-alt"></i>',
    brief: 'Distributed by frugivores',
    info: 'Can only appear within two tiles of fruit-eating birds. These birds live in eucalyptus trees that are within two tiles of at least one lilly pilly',
    check: tile => {
        let surrounds = tile.getTilesWithinRadius(2);
        // console.log(surrounds[0].hasTree() ? surrounds[0].getTree() : 'other');
        let surroundingEucalypts = [];
        let proximityConditionsMet = false;
        surrounds.forEach(t => { // reduce surrounds to just eucalypt tiles
            if (t.hasTree() && t.getTree() === 'eucalyptus') {
                surroundingEucalypts.push(t);
                // console.log(tile);
            }
        });

        
        if (surroundingEucalypts.length > 0) {
            // console.log(surroundingEucalypts);
            surroundingEucalypts.forEach(t => {
                let s = t.getTilesWithinRadius(2);
                s.forEach(ss => {
                    if (ss.hasTree() && ss.getTree() === 'lilly pilly') {
                        // console.log('found');
                        proximityConditionsMet = true;
                        return;
                    }
                });
            });
        } else {
            return false;
        }

        return proximityConditionsMet;
    }
}

// ---=== actual list ===--- //
let speciesList = [
    {
        name: 'lilly pilly',
        unlocked: true,
        type: 'tree',
        img: 'tree2.png',
        description: `Lilly Pilly trees' thick, glossy foliage makes them great ornamental plants and bushes. They produce little fuzzy flowers and small fruits that are sometimes called 'Roseapples'.`,
        lockedDesc: lockedDesc,
        needs: [
            lowLightTolerant,
            dryTolerant
        ],
        spreads: [
            'lilly pilly',
            'strangler fig',
            'birdwing vine'
        ]
    },
    
    {
        name: 'eucalyptus',
        unlocked: true,
        type: 'tree',
        img: 'gum.png',
        description: 'Eucalyptus trees, commonly called "Gum trees", can grow to a hight of 70 metres. They produce little fuzzy flowers and distinctive seed capsules called "gumnuts".',
        lockedDesc: lockedDesc,
        needs: [
            fullSun,
            moistSoil
        ],
        spreads: [
            'eucalyptus',
            'birdwing vine'
        ]
    },
    {
        name: 'birdwing vine',
        unlocked: false,
        type: 'tree',
        img: 'birdwing.png',
        description: `The Richmond Birdwing vine is the only source of food for the endangered Richmond Birdwing Butterfly. It produces beautful trumpet-shaped flowers.`,
        lockedDesc: lockedDesc,
        needs: [
            waterAdjacent
        ],
        spreads: [
            'birdwing vine'
        ]
    },
    {
        name: 'strangler fig',
        unlocked: false,
        type: 'tree',
        img: 'fig.png',
        description: `Strangler Figs begin life not on the ground, but in crevices at the tops of other trees. As they grow, their roots make their way down their host's trunk to the ground, 'strangling' and replacing it in the process.`,
        lockedDesc: lockedDesc,
        needs: [
            parasitic,
            frugivores
        ],
        spreads: [
            'strangler fig',
            'birdwing vine'
        ]
    }
    
];