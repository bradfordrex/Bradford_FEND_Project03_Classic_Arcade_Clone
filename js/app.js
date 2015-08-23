// Enemies our player must avoid
// Easily set the position, movement and speed of each Bug when instantiating them
var Enemy = function(col , row, dir, seconds) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.counter = 0;
    this.delaycounter = 0;


    // Set the enemies starting posistion and Y value based on the col and row
    // Based on Direction, set the enemy speed to the speed value passed in
    if (dir === 'right'){
      this.seconds = seconds;
      this.x = -110;
      this.startPos = -110;
      this.direction = 1;
        if (col === 1) {
          this.delay = 0;
        }
        else if (col === 2) {
          this.delay = .2 * seconds;
        }
        else if (col === 3) {
          this.delay = .4 * seconds;
        }
        else if (col === 4) {
          this.delay = .6 * seconds;
        }
        else {
          this.delay = .8 * seconds;
        }
    }
      // Reverse the direction of movement by multipling speed by -1
      // Set starting positions to Right side of canvas for Left direction
    else if (dir === 'left'){
      this.seconds = seconds;
      this.x = 505;
      this.startPos = 505;
      this.direction = -1;
        if (col === 1) {
          this.delay = 0;
        }
        else if (col === 2) {
          this.delay = .2 * seconds;
        }
        else if (col === 3) {
          this.delay = .4 * seconds;
        }
        else if (col === 4) {
          this.delay = .6 * seconds;
        }
        else {
          this.delay = .8 * seconds;
        }
    };
      // set the Y value of the bugs based on their row
    if (row === 1) {
        this.y = 60
    }
    else if (row === 2) {
        this.y = 143
    }
    else {
        this.y = 226
    }
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt paramseter
    // which will ensure the game runs at the same speed for
    // all computers
// I should pass into the enemy the seconds I want it to take
// then I calculate the movement per cycle as:
this.delaycounter += dt;
if (this.delaycounter > this.delay) {
if (this.counter < this.seconds) {
  this.counter += dt;
  var distance = 625;
  var rate = distance / this.seconds;
// speed gives us pixels/second
  this.x += rate * dt * this.direction} else {
    this.counter = 0;
    this.x = this.startPos};
  };

// movement then calculates pixels/cycle
// still how do we then delay the second bugs?
// maybe make a loop, that checks if i < delay. Delay is set in seonds and converted to cycles
// var delay = seconds
// var delaycounter = 0 + dt
// begin animation once delaycounter > delay
    // Loop enemy bugs by restarting enemies to startPos
    // once they have gone off scree / canvas
    // Lets us reuse the objects
    //if (this.x < 1010 + this.startPos && this.x > -1010 + this.startPos) {
    //      this.x = this.x + this.speed * dt;
    //    }
    //else {this.x = this.startPos};

    // Collision checking
    // Checks both sides of the character for touching because of the movement
    // of the bugs and the character.
    // check if the left point of the player character falls inside a bug
    // Does the point (18,95) on the character image fall inside the bug image
    // from (2,76) to (98,144)
    if (
        player.x + 25 >= this.x + 2
        && player.x + 25 <= this.x + 98
        && player.y + 95 >= this.y + 76
        && player.y + 95 <= this.y + 144
    ){
    // if they are touching, player loses a life
        gameMaster.loseLife();
    };
   // check if the right point of the player character falls inside a bug
   // Does the point (84,95) on the character image fall inisde the bug image
   // from (2,76) to (98,144)
   if (
        player.x + 75 >= this.x + 2
        && player.x + 75 <= this.x + 98
        && player.y + 95 >= this.y + 76
        && player.y + 95 <= this.y + 144
    ){
        gameMaster.loseLife();
   };
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Add stone obstacles to the game map
var Stone = function (col, row) {
  // Set the rock image for all stones
  this.sprite = 'images/Rock.png';
  // Set the position of each rock based on the col and row input
  // Set the collumn position
  if (col === 1) {
    this.x = 1;
  }
  else if (col === 2) {
    this.x = 102;
  }
  else if (col === 3) {
    this.x = 203;
  }
  else if (col === 4) {
    this.x = 304;
  }
  else {
    this.x = 405;
  };
  // Set the Y value based on the row
  if (row === 1) {
    this.y = 60
  }
  else if (row === 2) {
    this.y = 143
  }
  else {
    this.y = 226
  };
}

// Update function to be performed on the rocks
// Rocks do not move, so there is no animation
// Including the rocks unique collision operation
Stone.prototype.update = function() {
  // Collision checking
  // Check if the center point of the  character image falls inside a rock
  // Does the point (50,95) fall inside the rock
 if (
      player.x + 50 >= this.x + 2
      && player.x + 50 <= this.x + 98
      && player.y + 95 >= this.y + 76
      && player.y + 95 <= this.y + 144
  ){
      gameMaster.roadBlock();
 };
}
// Draw the rock image to the canvas
Stone.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Jewel creation
// Subclass of Stone, because the positioning on the map is the same
var Jewel = function (col, row) {
      Stone.call(this, col, row);
      //setting the unique Gem image for this subclass
      this.sprite = 'images/Gem Blue.png';
      //Create variable to toggle visability status, that is only
      //called once, and not updated constantly by the engine
      this.vis = true;
      //update the gameMaster gemCount so it knows how many gems
      //are in play during this level
      gameMaster.gemCount = gameMaster.gemCount +1;
};
// create new object and assign it to Jewel.prototype so it will delegate
// failed lookups to Stone.prototype
Jewel.prototype = Object.create(Stone.prototype);
// set the constructor new the Subclass Jewel and not to Stone
Jewel.prototype.constructor = Jewel;
Jewel.prototype.update = function () {
      //Stone.prototype.update.call(this);
      // Collision checking
      // Check if the center point of the  character image falls inside a gem
      // Does the point (50,95) fall inside the gem
      // If character touches gem, turn visability off
      // and call the collectGem function
    if (this.vis === true){
     if (
         player.x + 50 >= this.x + 2
         && player.x + 50 <= this.x + 98
         && player.y + 95 >= this.y + 76
         && player.y + 95 <= this.y + 144
      ){
         this.vis = false;
         gameMaster.collectGem();
     };
   };
};
// draw the gem image onto the game canvas
// scale it down to fit better inside game squares
Jewel.prototype.render = function () {
  if (this.vis === true) {
  ctx.drawImage(Resources.get(this.sprite), this.x+12, this.y+38, 75, 115);
  }
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Character = function () {
  // Create the Character object
  var obj = Object.create(Character.prototype);
  // Set the image url and starting coordinates for the player character
  obj.sprite = 'images/char-boy.png';
  obj.x = 203;
  obj.y = 405;
  // return the object to the outer scope
  return obj;
};
// Create the update method for the Character class
// This handles collision checking of the character with the water
Character.prototype.update = function(dt) {
    // Check if the player reaches the water.
    // Once it does, call levelScore
    if (this.y === -10) {
        gameMaster.levelScore(this.x);
    }
};
// Draw the character image to the game canvas
Character.prototype.render = function() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
// Method for handling user input
Character.prototype.handleInput = function(direction) {
  // set the length of the character movement in pixels
    var stepY = 83;
    var stepX = 101;
  // Keep running buffer of players last move, in order
  // to reverse it when hitting a rock
    gameMaster.lastMove = direction;
  // Check each increment to make sure it fits inside game map
  // Then update the posistion value of the character accordingly
  if (gameMaster.gameLevel <= 10 && gameMaster.playerLives > 0) {
    if (direction === 'up') {
          if (this.y-stepY >= -20) {
            this.y -= stepY;
          }
    }
    else if (direction === 'down') {
          if (this.y+stepY <= 435) {
            this.y += stepY;
          }
    }
    else if (direction === 'left') {
          if (this.x-stepX > 0) {
            this.x -= stepX;
          }
    }
    else if (direction === 'right') {
          if (this.x+stepX < 505) {
            this.x += stepX;
          }
    }
    }
  };


// declaring global variables necessary for the game engine to operate
var player = [];
var allEnemies = [];

// Creating Game Master object to hold all variables and functions
// needed by the game to enforce rules, and render game statistics
var gameMaster = {
  // Total number of lives allowed by the game. Loeing a life reduces this
  // initial count
  'playerLives': 3,
  // Initial Game Level is 1; winning increments this to the next level
  'gameLevel' : 1,
  // Holds the last move from the player input
  'lastMove' : '',
  // Total count of Gems on the canvas for current level
  'gemCount' : 0,
  // Array to track if the goal squares have been captured
  'goalSquares' : [false, false, false, false, false],
  'instructions' : 'visable',
  'systemControl' : function(keyCode) {
    //When the game is over, player has option to play again by pressing enter
      if (gameMaster.playerLives === 0) {
        if (keyCode == 'enter') {
          gameMaster.gameLevel = 1;
          gameMaster.playerLives = 3;
          gameMaster.goalSquares = [false, false, false, false, false];
          gameMaster.levels();
        }
      }
      if (keyCode === 'spacebar') {
        if (gameMaster.instructions === 'visable') {
          gameMaster.instructions = 'hidden';
        } else {
          gameMaster.instructions = 'visable';
        }
      }

  },
  // Holds all game master elements to be rendered to the canvas
  'render' : function(){

    // LIFE METER
    // Set the starting position of the meter, right justified
    var meterX = 450;
    var meterY = 505;
    // Set font properties for the text
    ctx.font = "24px Courier";
    ctx.fillText("Lives:", 275, 575);
    // Draw small scale character image to represent remaining lives
    // Loops through the amount of lives in the playerLives variable
    for (i = 0; i < gameMaster.playerLives; i++ ){
      ctx.drawImage(Resources.get(player.sprite), meterX - i*45, meterY, 51, 86);
    }

    // CURRENT LEVEL
    // adds a banner to the bottom left with the current game level
    var levelBanner = "Level " + gameMaster.gameLevel;
    if (gameMaster.gameLevel === 11) {
      levelBanner = "Level " + 10;
    }
    ctx.font = "24px Impact";
    ctx.fillText(levelBanner, 10, 575);

    // CAPTURED SQUARES
    // Render the key image on squares that have been captured
    var capturedSquare = 'images/Key.png';
    if (gameMaster.goalSquares[0] === true) {
      ctx.drawImage(Resources.get(capturedSquare), 10, 15, 85, 120);
    };
    if (gameMaster.goalSquares[1] === true) {
      ctx.drawImage(Resources.get(capturedSquare), 111, 15, 85, 120);
    };
    if (gameMaster.goalSquares[2] === true) {
      ctx.drawImage(Resources.get(capturedSquare), 212, 15, 85, 120);
    };
    if (gameMaster.goalSquares[3] === true) {
      ctx.drawImage(Resources.get(capturedSquare), 313, 15, 85, 120);
    };
    if (gameMaster.goalSquares[4] === true) {
      ctx.drawImage(Resources.get(capturedSquare), 414, 15, 85, 120);
    };

    // GAME OVER
    if (gameMaster.playerLives === 0) {
    // reset character to starting position
    //player = Character();
    // set the stroke, and text styles for GAME OVER
    ctx.save();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 5;
    ctx.font = "64px Impact";
    ctx.textAlign = "center";
    ctx.strokeText("Game Over", 250, 250);
    ctx.fillText("Game Over", 250, 250);
    ctx.restore();

    ctx.save();
    ctx.textAlign = "center";
    ctx.fillText("Press Enter to Play Again", 250, 425);
    ctx.restore();
    };

    // WIN THE ENTIRE GAME
    if (gameMaster.gameLevel > 10) {
    ctx.save();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 5;
    ctx.font = "64px Impact";
    ctx.textAlign = "center";
    ctx.strokeText("You Won!", 250, 250);
    ctx.fillText("You Won!", 250, 250);
    ctx.restore();
    };
  },
  'loseLife' : function (){
    //created a function for this action in case I want to add animation for losing a life
    gameMaster.playerLives--;
    player = Character();
  },
  'roadBlock' : function () {
    if (gameMaster.lastMove === 'up') {
      player.handleInput('down');
    } else if (gameMaster.lastMove === 'down') {
      player.handleInput('up');
    } else if (gameMaster.lastMove === 'right') {
      player.handleInput('left');
    } else if (gameMaster.lastMove === 'left') {
      player.handleInput('right');
    };
  },
  'collectGem' : function () {
    //created function to hold possible animation
    gameMaster.gemCount--;
  },
  'levelVictory' : function() {
    // reset goal squares to false ( not captured )
    gameMaster.goalSquares = [false, false, false, false, false];
    // Increment the gameLevel variable, to move up a level
    gameMaster.gameLevel++;
    // victory animation function would go here
    // call the levels function to set up next level
    gameMaster.levels();
  },
  'levelScore' : function (charXPosition) {
      // Function keeps track of what goal squares have been captured
      // Once all squares and gems are captured, it calls the Level Victory function
      // determine which square the character was in and set that square to true
      if (charXPosition === 1){
        gameMaster.goalSquares[0] = true;
        player = Character();
      } else if (charXPosition === 102){
        gameMaster.goalSquares[1] = true;
        player = Character();
      } else if (charXPosition === 203){
        gameMaster.goalSquares[2] = true;
        player = Character();
      } else if (charXPosition === 304){
        gameMaster.goalSquares[3] = true;
        player = Character();
      } else if (charXPosition === 405){
        gameMaster.goalSquares[4] = true;
        player = Character();
      };
      // check that all squares are set to true, then trigger levelVictory
      if (gameMaster.goalSquares[0] === true
          && gameMaster.goalSquares[1] === true
          && gameMaster.goalSquares[2] === true
          && gameMaster.goalSquares[3] === true
          && gameMaster.goalSquares[4] === true
          && gameMaster.gemCount === 0)
          {
            gameMaster.levelVictory();
      };

      // Here is a way to check if all squares are captured by looping
      // however, I am not sure it saves anything or is reall worth it
      // will stick with the simple solution of one if statement.
      //var allSquaresCaptured = false;
      //for (square in gameMaster.goalSquares) {
      //    if (gameMaster.goalSquares[square] === true) {
    //        allSquaresCaptured = true;
    //      } else {
    //        allSquaresCaptured = false;
    //        break;
    //      }
    //  }
    //  if(allSquaresCaptured === true && gameMaster.gemCount === 0) {
    //    gameMaster.levelVictory();
    //  }
  },
  // GAME LEVELS
  // Holds all levels of the game
  // each level has the eneimes and obstacles for that level
  'levels' : function() {
    var rocks = {};
    var gems = {};
    var enemies = {};

    // LEVEL 1
    if (gameMaster.gameLevel === 1){
      // set player character to starting position
      player = Character();
      // clear the previous level from the allEnemies Array
      allEnemies.splice(0,allEnemies.length)
      // add any obstacle rocks
      rocks = [];
      // add any Gems
      gems = [];
      // Add our enemy bugs. With a column, row, direction and duration in seconds
      // The larger the second number, the slower the bug goes, because it takes longer
      // to travel across the canvas
      // add them last to appear on top of all other elements
      enemies = {
        'bug01' : new Enemy(3, 1, 'right', 2),
        'bug02' : new Enemy(1, 2, 'right', 3),
        'bug03' : new Enemy(2, 3, 'right', 5),
      }
      // push all bugs, gems, and rocks into allEnemies array
      // They are done seperately to control which elements appear on top
      for (rock in rocks){
        allEnemies.push(rocks[rock]);
      };
      for (gem in gems){
        allEnemies.push(gems[gem]);
      };
      for (bug in enemies){
        allEnemies.push(enemies[bug]);
      };
    }
    // LEVEL 2
    else if (gameMaster.gameLevel === 2){
      // clear the previous level from the allEnemies Array
      allEnemies.splice(0,allEnemies.length)
      // set player character to starting position
      player = Character();
      // add any obstacle rocks
      rocks = {};
      // add any Gems
      gems = {};
      // Add our enemy bugs. With a column, row, direction and speed
      // add them last to appear on top of all other elements
      enemies = {
        'bug01' : new Enemy(1, 1, 'left', 2),
        'bug02' : new Enemy(1, 2, 'right', 4),
        'bug03' : new Enemy(2, 2, 'right', 4),
        'bug04' : new Enemy(3, 2, 'right', 4),
        'bug07' : new Enemy(2, 3, 'right', 3),
      }
      // push all bugs, gems, and rocks into allEnemies array
      // They are done seperately to control which elements appear on top
      for (rock in rocks){
        allEnemies.push(rocks[rock]);
      };
      for (gem in gems){
        allEnemies.push(gems[gem]);
      };
      for (bug in enemies){
        allEnemies.push(enemies[bug]);
      };
    }
    // LEVEL 3
    else if (gameMaster.gameLevel === 3){
      // clear the previous level from the allEnemies Array
      allEnemies.splice(0,allEnemies.length)
      // set player character to starting position
      player = Character();
      // add any obstacle rocks
      rocks = {
        'rock01' : new Stone(3,2),
      };
      // add any Gems
      gems = {};
      // Add our enemy bugs. With a column, row, direction and speed
      // add them last to appear on top of all other elements
      enemies = {
        'bug01' : new Enemy(1, 1, 'right', 2.5),
        'bug02' : new Enemy(4, 1, 'right', 2.5),
        'bug03' : new Enemy(1, 2, 'left', 4),
        'bug04' : new Enemy(3, 2, 'left', 4),
        'bug05' : new Enemy(1, 3, 'left', 3)
      }
      // push all bugs, gems, and rocks into allEnemies array
      // They are done seperately to control which elements appear on top
      for (rock in rocks){
        allEnemies.push(rocks[rock]);
      };
      for (gem in gems){
        allEnemies.push(gems[gem]);
      };
      for (bug in enemies){
        allEnemies.push(enemies[bug]);
      };
    }
    // LEVEL 4
    else if (gameMaster.gameLevel === 4){
      // clear the previous level from the allEnemies Array
      allEnemies.splice(0,allEnemies.length)
      // set player character to starting position
      player = Character();
      // add any obstacle rocks
      rocks = {
        'rock01' : new Stone(1,3),
        'rock02' : new Stone(5,3)
      };
      // add any Gems
      gems = {};
      // Add our enemy bugs. With a column, row, direction and speed
      // add them last to appear on top of all other elements
      enemies = {
        'bug01' : new Enemy(1, 1, 'right', 3),
        'bug02' : new Enemy(2, 1, 'right', 3),
        'bug03' : new Enemy(3, 1, 'right', 3),
        'bug04' : new Enemy(2, 2, 'left', 4),
        'bug05' : new Enemy(4, 2, 'left', 4),
        'bug06' : new Enemy(5, 3, 'left', 1),
      }
      // push all bugs, gems, and rocks into allEnemies array
      // They are done seperately to control which elements appear on top
      for (rock in rocks){
        allEnemies.push(rocks[rock]);
      };
      for (gem in gems){
        allEnemies.push(gems[gem]);
      };
      for (bug in enemies){
        allEnemies.push(enemies[bug]);
      };
    }
    // LEVEL 5
    else if (gameMaster.gameLevel === 5){
      // clear the previous level from the allEnemies Array
      allEnemies.splice(0,allEnemies.length)
      // set player character to starting position
      player = Character();
      // add any obstacle rocks
      rocks = {};
      // add any Gems
      gems = {
        'gem01' : new Jewel(3,2),
      };
      // Add our enemy bugs. With a column, row, direction and speed
      // add them last to appear on top of all other elements
      enemies = {
        'bug01' : new Enemy(1, 1, 'right', 2),
        'bug02' : new Enemy(2, 1, 'right', 2),
        'bug03' : new Enemy(1, 2, 'left', 4),
        'bug04' : new Enemy(3, 2, 'left', 4),
        'bug05' : new Enemy(1, 3, 'right', 6),
        'bug06' : new Enemy(2, 3, 'right', 6),
        'bug07' : new Enemy(3, 3, 'right', 6),
      }
      // push all bugs, gems, and rocks into allEnemies array
      // They are done seperately to control which elements appear on top
      for (rock in rocks){
        allEnemies.push(rocks[rock]);
      };
      for (gem in gems){
        allEnemies.push(gems[gem]);
      };
      for (bug in enemies){
        allEnemies.push(enemies[bug]);
      };
    }
    // LEVEL 6
    else if (gameMaster.gameLevel === 6){
      // clear the previous level from the allEnemies Array
      allEnemies.splice(0,allEnemies.length)
      // set player character to starting position
      player = Character();
      // add any obstacle rocks
      rocks = {
        'rock01' : new Stone(2,2),
        'rock02' : new Stone(4,2)
      };
      // add any Gems
      gems = {
        'gem01' : new Jewel(1,2),
        'gem02' : new Jewel(3,2),
        'gem03' : new Jewel(5,2)
      };
      // Add our enemy bugs. With a column, row, direction and speed
      // add them last to appear on top of all other elements
      enemies = {
        'bug01' : new Enemy(1, 1, 'right', 3),
        'bug02' : new Enemy(2, 1, 'right', 3),
        'bug03' : new Enemy(3, 2, 'right', 5),
        'bug04' : new Enemy(2, 2, 'right', 5),
        'bug05' : new Enemy(3, 3, 'left', 1)
      }
      // push all bugs, gems, and rocks into allEnemies array
      // They are done seperately to control which elements appear on top
      for (rock in rocks){
        allEnemies.push(rocks[rock]);
      };
      for (gem in gems){
        allEnemies.push(gems[gem]);
      };
      for (bug in enemies){
        allEnemies.push(enemies[bug]);
      };
    }
    // LEVEL 7
    else if (gameMaster.gameLevel === 7){
      // clear the previous level from the allEnemies Array
      allEnemies.splice(0,allEnemies.length)
      // set player character to starting position
      player = Character();
      // add any obstacle rocks
      rocks ={
        'rock01' : new Stone(1,3),
        'rock02' : new Stone(2,3),
        'rock03' : new Stone(4,3),
        'rock04' : new Stone(5,3)
      };
      // add any Gems
      gems = {};
      // Add our enemy bugs. With a column, row, direction and speed
      // add them last to appear on top of all other elements
      enemies = {
        'bug01' : new Enemy(1, 3, 'left', 3),
        'bug02' : new Enemy(2, 3, 'left', 3),
        'bug03' : new Enemy(3, 3, 'left', 3),
        'bug04' : new Enemy(1, 2, 'right', 3),
        'bug05' : new Enemy(5, 2, 'right', 3),
        'bug06' : new Enemy(1, 1, 'left', 2.5),

      }
      // push all bugs, gems, and rocks into allEnemies array
      // They are done seperately to control which elements appear on top
      for (rock in rocks){
        allEnemies.push(rocks[rock]);
      };
      for (gem in gems){
        allEnemies.push(gems[gem]);
      };
      for (bug in enemies){
        allEnemies.push(enemies[bug]);
      };
    }
    // LEVEL 8
    else if (gameMaster.gameLevel === 8){
      // clear the previous level from the allEnemies Array
      allEnemies.splice(0,allEnemies.length)
      // set player character to starting position
      player = Character();
      // add any obstacle rocks
      rocks = {
        'rock01' : new Stone(1,3),
        'rock02' : new Stone(3,3),
        'rock03' : new Stone(5,3),
        'rock04' : new Stone(2,2),
      };
      // add any Gems
      gems = {
        'gem01' : new Jewel(1,2),
        'gem02' : new Jewel(2,3),
      };
      // Add our enemy bugs. With a column, row, direction and speed
      // add them last to appear on top of all other elements
      enemies = {
        'bug01' : new Enemy(4, 3, 'left', 3),
        'bug02' : new Enemy(2, 2, 'right', 4),
        'bug03' : new Enemy(3, 2, 'right', 4),
        'bug04' : new Enemy(1, 1, 'left', 3),
        'bug05' : new Enemy(2, 1, 'left', 3),
        'bug06' : new Enemy(3, 1, 'left', 3)
      }
      // push all bugs, gems, and rocks into allEnemies array
      // They are done seperately to control which elements appear on top
      for (rock in rocks){
        allEnemies.push(rocks[rock]);
      };
      for (gem in gems){
        allEnemies.push(gems[gem]);
      };
      for (bug in enemies){
        allEnemies.push(enemies[bug]);
      };
    }
    // LEVEL 9
    else if (gameMaster.gameLevel === 9){
      // clear the previous level from the allEnemies Array
      allEnemies.splice(0,allEnemies.length)
      // set player character to starting position
      player = Character();
      // add any obstacle rocks
      var rocks = {
        'rock01' : new Stone(1,3),
        'rock02' : new Stone(2,2),
        'rock03' : new Stone(5,3),
        'rock04' : new Stone(4,2)
      };
      // add any Gems
      var gems = {
        'gem01' : new Jewel(5,2),
        'gem02' : new Jewel(1,2)
      };
      // Add our enemy bugs. With a column, row, direction and speed
      // add them last to appear on top of all other elements
      var enemies = {
        'bug01' : new Enemy(1, 3, 'right', 2),
        'bug02' : new Enemy(2, 3, 'right', 2),
        'bug03' : new Enemy(1, 2, 'right', 3),
        'bug04' : new Enemy(4, 2, 'right', 3),
        'bug05' : new Enemy(1, 1, 'left', 4),
        'bug06' : new Enemy(5, 1, 'left', 4)
      }
      // push all bugs, gems, and rocks into allEnemies array
      // They are done seperately to control which elements appear on top
      for (rock in rocks){
        allEnemies.push(rocks[rock]);
      };
      for (gem in gems){
        allEnemies.push(gems[gem]);
      };
      for (bug in enemies){
        allEnemies.push(enemies[bug]);
      };
    }
    // LEVEL 10
    else if (gameMaster.gameLevel === 10){
      // clear the previous level from the allEnemies Array
      allEnemies.splice(0,allEnemies.length)
      // set player character to starting position
      player = Character();
      // add any obstacle rocks
      var rocks = {
        'rock01' : new Stone(2,2),
        'rock02' : new Stone(4,2),
        'rock03' : new Stone(3,3)
      };
      // add any Gems
      var gems = {
        'gem01' : new Jewel(3,2),
        'gem02' : new Jewel(2,3),
        'gem03' : new Jewel(4,3)
      };
      // Add our enemy bugs. With a column, row, direction and speed
      // add them last to appear on top of all other elements
      var enemies = {
        'bug01' : new Enemy(1, 1, 'right', 5),
        'bug02' : new Enemy(2, 1, 'right', 5),
        'bug03' : new Enemy(3, 3, 'right', 2),
        'bug04' : new Enemy(1, 2, 'left', 2)
      }
      // push all bugs, gems, and rocks into allEnemies array
      // They are done seperately to control which elements appear on top
      for (rock in rocks){
        allEnemies.push(rocks[rock]);
      };
      for (gem in gems){
        allEnemies.push(gems[gem]);
      };
      for (bug in enemies){
        allEnemies.push(enemies[bug]);
      };
    }
    // END OF GAME
    // Leaving level 10 running in background of winning text
    }
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

// levels function instanitates all enemies and obstacles
gameMaster.levels();

// This listens for key presses and sends the keys to your
// player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        13: 'enter',
        32: 'spacebar',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
    gameMaster.systemControl(allowedKeys[e.keyCode]);
});
