// Enemies our player must avoid
var Enemy = function(col , row, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    // set the enemy speed to the object
    this.speed = speed;

    // Give the enemy a starting posistion and Y value based on col and row
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

    // Loop enemy bugs by restarting enemies to startPos
    // Requires less objects created per level
    if (this.x < 1010 + this.startPos) {
          this.x = this.x + this.speed * dt;
        } else {this.x = this.startPos};

    // Collision checking
    // check if the left point of the player character falls inside a bug
   if (player.x + 18 >= this.x + 2
      && player.x + 18 <= this.x + 98
      && player.y + 95 >= this.y + 76
      && player.y + 95 <= this.y + 144
    ){
     gamePlay.loseLife();
   };
   // check if the right point of the player character falls inside a bug
   if (player.x + 84 >= this.x + 2
      && player.x + 84 <= this.x + 98
      && player.y + 95 >= this.y + 76
      && player.y + 95 <= this.y + 144
    ){
     gamePlay.loseLife();
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
    // Create the actual player Object - called Player.prototype
  var obj = Object.create(playerClass.prototype);
    // Set the image url and starting coordinates for the player character
  obj.sprite = 'images/char-boy.png';
  obj.x = 203;
  obj.y = 405;
    // return the object to the outer scope
  return obj;
}
  // here we create the update method for the player class, which is attached to the object that is created by the class
  // the update could be reffered to as the Animate function as this is where the animation commands go.
  // also passing in the time delta to use for animation commands
playerClass.prototype.update = function(dt) {
    // once the player reaches the water, Reset, and perform action
      if (this.y === -10) {
          gamePlay.levelVictory();
          player = playerClass();
      }

}
  // here we create the render method, which tells the app to draw the character to the game map, using the information from the update / animate method
playerClass.prototype.render = function() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

  // here is the handle input method for the player class
playerClass.prototype.handleInput = function(direction) {
  // set the length of the character movement
    var stepY = 83;
    var stepX = 101;

  // Check each increment to make sure it fits inside game map
  // Then update the posistion value of the character accordingly
    if (direction === 'up') {
          if (this.y-stepY >= -20) {
            this.y = this.y-stepY;
    }
    } else if (direction === 'down') {
          if (this.y+stepY <= 435) {
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
var player = [];
var allEnemies = [];
var gamePlay = {
  'playerLives': 3,
  'gameLevel' : 1,
  'renderLifeMeter' : function(){
    // draw little guys depending on number of lives
    // x position of key life
    var meterX = 450;
    var meterY = 505;
    ctx.font = "24px Courier";
    // ctx.fillText("Lives:", meterX - gamePlay.playerLives * 55, 575);
    ctx.fillText("Lives:", 275, 575);
    for (i = 0; i < gamePlay.playerLives; i++ ){
      ctx.drawImage(Resources.get(player.sprite), meterX - i*45, meterY, 51, 86);
    }
  },
  'loseLife' : function (){
    gamePlay.playerLives = gamePlay.playerLives - 1;
    if (gamePlay.playerLives > 0) {
      // reset player character
      player = playerClass();
    } else {
      gamePlay.gameOver();
    }
    return gamePlay.playerLives;
  },
  'gameOver' : function () {
    player = playerClass();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 5;
    ctx.font = "64px Impact";
    ctx.textAlign = "center";
    ctx.strokeText("Game Over", 250, 250);
    ctx.fillText("Game Over", 250, 250);
    window.requestAnimationFrame(gamePlay.gameOver);
  },
  'levelVictory' : function() {
    gamePlay.gameLevel++;
    // victory animation functioin would go here
    gamePlay.levels();
  },
  'levels' : function() {
    if (gamePlay.gameLevel === 1){
      // set player character to starting position
      player = playerClass();
      // Add our enemy bugs. With a column, row, and speed
      var enemies = {
        'bug01' : new Enemy(1, 1, 100),
        'bug02' : new Enemy(2, 2, 100),
        'bug03' : new Enemy(3, 3, 100),
        'bug04' : new Enemy(3, 1, 100)
      }
      // push all enemy objects into allEnemies array
      for (bug in enemies){
        allEnemies.push(enemies[bug]);
      }
    } else if (gamePlay.gameLevel === 2){
      // clear the previous level from the allEnemies Array
      allEnemies.splice(0,allEnemies.length)
      // reset player character to starting posistion
      player = playerClass();
      // add enemies and push into allEnemies array
      var enemies = {
        'bug01' : new Enemy(1, 1, 300),
        'bug02' : new Enemy(1, 2, 100),
        'bug03' : new Enemy(3, 3, 200),
        'bug04' : new Enemy(2, 1, 300)
      }
      for (bug in enemies){
        allEnemies.push(enemies[bug]);
      }
    }
  }
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

gamePlay.levels();

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
