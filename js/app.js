// Enemies our player must avoid
var Enemy = function(locx, locy, velocity) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.x = locx;
    this.y = locy;
    this.speed = velocity;
    this.collision = false;
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + (this.speed*dt);
    if (this.x > ctx.canvas.width) {
        this.x = -(Resources.get(this.sprite).width);
        this.collision = false;
    };
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var playeroffsetx = 0,
    playeroffsety = 0,
    startplayerx = 202,
    startplayery = 415,
    maxlifes = 3,
    countCollisions = 0,
    playervelocityx = 101,
    playervelocityy = 83,
    initEnemies,
    countEnemies = 1,
    level = 1,
    playerscore = 60,
    startEnemyy,
    startEnemyx,
    velocityEnemy,
    collisionsound = document.getElementById("collision"),
    introsound = document.getElementById("intro"),
    leveldonesound = document.getElementById("applause"),
    clicksound = document.getElementById("click");

var Player = function(locx, locy) {
    this.sprite = 'images/char-boy.png';
    this.x = locx;
    this.y = locy;
    this.levelfinished = false;
};

Player.prototype.update = function(dt) {
    this.x = this.x + playeroffsetx;
    this.y = this.y + playeroffsety;
    if ((this.y == 0) && !(player.levelfinished)) {
        leveldone();
    }
    if (this.x < 0) {
        this.x = 0;
    }
    if (this.x > ctx.canvas.width-(Resources.get(this.sprite).width)) {
        this.x = ctx.canvas.width-(Resources.get(this.sprite).width);
    }
    if (this.y < 0) {
        this.y = 0;
    }
    if (this.y > ctx.canvas.height-(Resources.get(this.sprite).height)) {
        this.y = startplayery;
    }
    playeroffsety = 0;
    playeroffsetx = 0;
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(pressedkeycode) {
    if (!(player.levelfinished)) {
        if (countCollisions < maxlifes) {
            clicksound.play();
        }
        if (pressedkeycode == 'left') {
            playeroffsetx = -playervelocityx;
            playeroffsety = 0;
        }
        if (pressedkeycode == 'up') {
            playeroffsety = -playervelocityy;
            playeroffsetx = 0;
        }
        if (pressedkeycode == 'right') {
            playeroffsetx = playervelocityx;
            playeroffsety = 0;
        }
        if (pressedkeycode == 'down') {
            playeroffsety = playervelocityy;
            playeroffsetx = 0;
        }
    }
};

function checkCollisions() {
    allEnemies.forEach(function(enemy){
        if ((Math.abs(player.y - enemy.y) < 40) && (Math.abs(enemy.x - player.x) < 40) && !(enemy.collision)) {
                countCollisions++;
                enemy.collision = true;
                if (countCollisions <= maxlifes) {
                    collisionsound.play();
                    playerscore = playerscore - 50;
                }
        };
    })
};

// Player reached top of screen --> next level
function leveldone() {
    player.levelfinished = true;
    leveldonesound.play();
    allEnemies = [];
    setTimeout(function() {
        ++level;
        playerscore = playerscore + 30;
        populateEnemies();
        player.x = startplayerx;
        player.y = startplayery;
        player.levelfinished = false;
        }, 5000);
}

function populateEnemies() {
    for (initEnemies = 0; initEnemies < (Math.floor(level/3) + 1); initEnemies++) {
        for (var rows = 1; rows <= 3; rows++){
            startEnemyx = (250-(rows*30))*initEnemies+50;
            startEnemyy = rows*83-20;
            velocityEnemy = 30*(4-rows+(level%3));
            allEnemies.push(new Enemy(startEnemyx, startEnemyy, velocityEnemy));
        }
    };
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
introsound.play();
var player = new Player (startplayerx, startplayery);
var allEnemies = [];
populateEnemies();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});