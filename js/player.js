/*jslint browser this */
/*global _, shipFactory, player, utils */

(function (global) {
    "use strict";

    var ship = {dom: {parentNode: {removeChild: function () {}}}};

    var player = {
        grid: [],
        tries: [],
        fleet: [],
        game: null,
        activeShip: 0,
        setGame: function(game){
        this.game = game},
        init: function () {
            // créé la flotte
            this.fleet.push(shipFactory.build(shipFactory.TYPE_BATTLESHIP));
            this.fleet.push(shipFactory.build(shipFactory.TYPE_DESTROYER));
            this.fleet.push(shipFactory.build(shipFactory.TYPE_SUBMARINE));
            this.fleet.push(shipFactory.build(shipFactory.TYPE_SMALL_SHIP));

            // créé les grilles
            this.grid = utils.createGrid(10, 10);
            this.tries = utils.createGrid(10, 10);
        },
        play: function (col, line) {
            // appel la fonction fire du game, et lui passe une calback pour récupérer le résultat du tir
            this.game.fire(this, col, line, _.bind(function (hasSucced) {
                this.tries[line][col] = hasSucced;
            }, this));
        },
        // quand il est attaqué le joueur doit dire si il a un bateaux ou non à l'emplacement choisi par l'adversaire
        receiveAttack: function (col, line, callback) {
            var succeed = false;
            
            var target = this.game.players.indexOf(this) === 0
            ? this.game.players[1]
            : this.game.players[0];

            if (this.grid[line][col] !== 0 && this.grid[line][col] !== false) {
                succeed = true;
                this.grid[line][col] = 0;
            }
            // ajout png  et classe
            var png = (succeed === true) ? "toucher": "rater"; 
            if(target === this.game.players[1]){
                this.game.grid.querySelector(`.row:nth-child(${line+1}) .cell:nth-child(${col+1})`).classList.add(png);
            }

            //ajout sound effect
            const successhot = (succeed === true)? new Audio("../sound/success.mp3") : new Audio("../sound/flop.mp3");
            setTimeout(() => {successhot.play()}, 1000);
            callback.call(undefined, succeed);
        },
        setActiveShipPosition: function (x, y) {
            var ship = this.fleet[this.activeShip];
            var i = 0;

            while (i < ship.getLife()) {
                if (this.grid[y][x + i] !== 0) {
                    return  false;
                }
                this.grid[y][x + i] = ship.getId();
                i += 1;
            }

            return true;
        },
        clearPreview: function () {
            this.fleet.forEach(function (ship) {
                if (ship.dom.parentNode) {
                    ship.dom.parentNode.removeChild(ship.dom);
                }
            });
        },
        resetShipPlacement: function () {
            this.clearPreview();

            this.activeShip = 0;
            this.grid = utils.createGrid(10, 10);
        },
        activateNextShip: function () {
            if (this.activeShip < this.fleet.length - 1) {
                this.activeShip += 1;
                return true;
            } else {
                return false;
            }
        },
        renderTries: function (grid) {
            this.tries.forEach(function (row, rid) {
                row.forEach(function (val, col) {
                    var node = grid.querySelector('.row:nth-child(' + (rid + 1) + ') .cell:nth-child(' + (col + 1) + ')');

                    if (val === true) {
                        node.style.backgroundColor = '#e60019';
                    } else if (val === false) {
                        node.style.backgroundColor = '#aeaeae';
                    }
                });
            });
        },
        renderShips: function (grid) {
            
        }
    };

    global.player = player;

}(this));
