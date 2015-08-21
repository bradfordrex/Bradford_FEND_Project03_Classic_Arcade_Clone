// Enemies our player must avoid
var Enemy = function(col , row) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    if (col === 1) {
      this.x = -101;
      this.startPos = -101;
    } else if (col === 2) {
      this.x = -202;
      this.startPos = -202;
    } else if (col === 3) {
      this.x = -303;
      this.startPos = -303;
    } else if (col === 4) {
      this.x = -404;
      this.startPos = -404;
    } else {
      this.x = -505;
      this.startPos = -505;
    };
    if (row === 1) {
      this.y = 60
    } else if (row === 2) {
      this.y = 143
    } else {
      this.y = 226
    }
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers
    // Loop animation by restarting enemies to startPos
    if (this.x < 505) {
          this.x = this.x + 100 * dt;
        } else {this.x = this.startPos};
    // Collision checking
    // check if the left point of the player character falls inside a bug
   if (player.x + 25 >= this.x
      && player.x + 25 <= this.x + 100
      && player.y + 100 >= this.y + 100
      && player.y + 100 <= this.y + 150
    ){
     player = playerClass();
   };
   // check if the right point of the player character falls inside a bug
   if (player.x + 75 >= this.x
      && player.x + 75 <= this.x + 100
      && player.y + 100 >= this.y + 100
      && player.y + 100 <= this.y + 150
    ){
     player = playerClass();
   };
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

// player class - which creates the player object
var playerClass = function () {
    // here we create the actual player Object - called Player.prototype
  var obj = Object.create(playerClass.prototype);
    // here we set the .loc key of the object to the value passed into the function / object of the location
  obj.sprite = 'images/char-boy.png';
  obj.x = 203;
  obj.y = 405;
    // here we retur  the object to the outer scope
  return obj;
}
  // here we create the update method for the player class, which is attached to the object that is created by the class
  // the update could be reffered to as the Animate function as this is where the animation commands go.
  // also passing in the time delta to use for animation commands
playerClass.prototype.update = function(dt) {
      if (this.y === -10) {
        ctx.fillRect(player.x,player.y, 25, 25);
         player = playerClass();
      }

}
  // here we create the render method, which tells the app to draw the character to the game map, using the information from the update / animate method
playerClass.prototype.render = function() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

  // here is the handle input method for the player class
playerClass.prototype.handleInput = function(direction) {
    var stepY = 83;
    var stepX = 101;
     console.log(this.x);
    if (direction === 'up') {
          if (this.y-stepY >= -15) {
            this.y = this.y-stepY;
    }
    } else if (direction === 'down') {
          if (this.y+stepY <= 415) {
            this.y = this.y+stepY;
    }
    } else if (direction === 'left') {
          if (this.x-stepX > 0) {
            this.x = this.x-stepX;
    }
    } else if (direction === 'right') {
          if (this.x+stepX < 505) {
            this.x = this.x+stepX;
    }
    }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player = playerClass();
var bug01 = new Enemy(1, 1);
var bug02 = new Enemy(2, 2);
var bug03 = new Enemy(3, 3);

var allEnemies = [
  bug01,
  bug02,
  bug03
];


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
