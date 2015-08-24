// Class constructs the Enemies our player must avoid
var Enemy = function(col, row, dir, seconds) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    // Declare counting variables outside of the update and render scope
    // to count time in order to delay the bugs starting time
    this.delaycounter = 0;
    // map the seconds passed in when the bug is instantiated; represents
    // number of seconds it takes for the bug to get across the game board
    this.seconds = seconds;
    // set the bug's delay time based on the column passed in.
    // This creates the animation of one bug following another.
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
    // set the Y position of the bugs based on the row passed in. Top row is 1.
    if (row === 1) {
        this.y = 60
    }
    else if (row === 2) {
        this.y = 143
    }
    else {
        this.y = 226
    }
    // Based on direction
    // Set the enemies current x position, as well as a starting posistion variable to reset to.
    if (dir === 'right'){
        this.x = -110;
        this.startPos = -110;
        this.endPos = 515;
    }
    else if (dir === 'left'){
        this.x = 505;
        this.startPos = 515;
        this.endPos = -110;
    };
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt paramseter
    // which will ensure the game runs at the same speed for all computers
    // Begin the delay counter by incrementing the variable by the time delta
    this.delaycounter += dt;

    // Once the delay counter reaches the delay time, begin animation
    if (this.delaycounter > this.delay) {
        this.x = animate.move(this.x, this.startPos, this.endPos, this.seconds, dt, 'repeat');
    };

    // Collision checking
    // Must checks both sides of the character for touching
    // because character can move into bugs both ways
    // Check if the left point of the player character falls inside a bug
    // Does the point (25,95) on the character image fall inside the bug image
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
   // check right point of the player character, point (75,95) on the character image
   if (
        player.x + 75 >= this.x + 2
        && player.x + 75 <= this.x + 98
        && player.y + 95 >= this.y + 76
        && player.y + 95 <= this.y + 144
    ){
        gameMaster.loseLife();
   };
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Add stone obstacles to the game map
var Stone = function (col, row) {
    // Set the rock image for all stones
    // and function to call when player collides with stones
    this.sprite = 'images/Rock.png';
    this.onCollision = 'roadBlock';
    // Set the position of each rock based on the column and row input
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

// Update method for the rocks
Stone.prototype.update = function() {
  // Collision checking
  // Check if center point of the character image falls inside a rock
  // Does the point (50,95) on character image fall inside the rock (2,76) and (98,144)
    if (
        player.x + 50 >= this.x + 2
        && player.x + 50 <= this.x + 98
        && player.y + 95 >= this.y + 76
        && player.y + 95 <= this.y + 144
    ){
    // set visability to false. This does nothing on the stones, but when
    // this method becomes a subclass for the gems, it toggles their visabiltiy
        this.vis = false;
        gameMaster[this.onCollision]();
    };
}
// Draw the rock image to the canvas
Stone.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Jewel creation
// Subclass of Stone, reuse the positioning code
var Jewel = function (col, row) {
    Stone.call(this, col, row);
    //setting the unique Gem image for this subclass
    this.sprite = 'images/Gem Blue.png';
    // setting the collision function
    this.onCollision = 'collectGem';
    // Set visability status in variable outside of update and render
    this.vis = true;
    // Update the gameMaster gemCount so it knows
    // how many gems are in play during this level
    gameMaster.gemCount += 1;
};
// Create new object and assign it to Jewel.prototype so it will delegate
// failed lookups to Stone.prototype
Jewel.prototype = Object.create(Stone.prototype);

// Set the constructor new the Subclass to Jewel
Jewel.prototype.constructor = Jewel;
Jewel.prototype.update = function () {
    // Reuse the collision detection from Stone
    // if statement ensures it only runs collectGem() once
    if (this.vis === true){
        Stone.prototype.update.call(this);
    };
};

// Draw the gem image onto the game canvas
// scale it down to fit inside game squares
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
    // Sets the length of the character movement in pixels
    var stepY = 83;
    var stepX = 101;
    // Keep running buffer of players last move, in order
    // to reverse it when hitting a rock
    gameMaster.lastMove = direction;
    // Check each increment to make sure it fits inside game map
    // Then update the posistion value of the character accordingly
    // If statement disables user control of character if game is won or lost
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

// Declare global variables necessary for the game engine to operate
var player = [];
var allEnemies = [];

// Game Master object to hold all variables and functions
// needed by the game to monitor game play and render game statistics
var gameMaster = {
    // Total lives allowed by game. Loeing life reduces this initial count
    'playerLives': 3,
    // Initial Game Level is 1; winning increments this to the next level
    'gameLevel' : 1,
    // Holds the last move from the player input
    'lastMove' : '',
    // Total count of Gems on the canvas for current level
    'gemCount' : 0,
    // Array to track if the goal squares have been captured
    'goalSquares' : [false, false, false, false, false],
    // variable to toggle instructions visability
    'instructions' : 'visable',
    // variable to hold a timer count outside of the game master render function
    // so it won't constantly be reset
    'titleTimer' : 0,
    // handle user input to control game Master messages
    'systemControl' : function(keyCode) {
        //When the game is over, player has option to play again by pressing enter
        // When they do, resets lives, goal squares, and game levels;
        if (gameMaster.playerLives === 0) {
            if (keyCode == 'enter') {
                gameMaster.gameLevel = 1;
                gameMaster.playerLives = 3;
                gameMaster.goalSquares = [false, false, false, false, false];
                gameMaster.levels();
            }
        }
        // Spacebar toggles instructions overlay at any time
        if (keyCode === 'spacebar') {
            if (gameMaster.instructions === 'visable') {
                gameMaster.instructions = 'hidden';
            } else {
                gameMaster.instructions = 'visable';
            }
        }
    },
    // Holds all game master elements to be rendered to the canvas
    'render' : function(dt){
        // LIFE METER
        // Set the starting position of the meter, right justified
        var meterX = 450;
        var meterY = 505;
        // Set font properties for the text
        ctx.save();
        ctx.font = "24px Courier";
        ctx.fillText("Lives:", 275, 575);
        ctx.restore();
        // Draw small scale character image to represent remaining lives
        // Loops through the amount of lives in the playerLives variable
        for (i = 0; i < gameMaster.playerLives; i++ ){
            ctx.drawImage(Resources.get(player.sprite), meterX - i*45, meterY, 51, 86);
        }

        // CURRENT LEVEL
        // adds a banner to the bottom left with the current game level
        var levelBanner = "Level " + gameMaster.gameLevel;
        // Changes display to keep displaying Level 10 even after game is defeated
        if (gameMaster.gameLevel === 11) {
            levelBanner = "Level " + 10;
        }
        ctx.save();
        ctx.font = "24px Impact";
        ctx.fillText(levelBanner, 10, 575);
        ctx.restore();

        // CAPTURED SQUARES
        // Render the key image on squares that have been captured
        var capturedSquare = 'images/Key.png';
        var capturedSquareLength = gameMaster.goalSquares.length;
        for (var i = 0; i < capturedSquareLength; i++) {
            var offset = 101 * i;
            if (gameMaster.goalSquares[i] === true) {
                ctx.drawImage(Resources.get(capturedSquare), 10 + offset, 15, 85, 120);
            }
        };

        // NEW LEVEL ACHIEVED
        // Only begin displaying Levels for Level 2 and up
        if (gameMaster.gameLevel > 1) {
            // begin counting display duration in titleTimer
            gameMaster.titleTimer += dt;
            // Display the title until the timer reachers 2 seconds.
            if (gameMaster.titleTimer < 2) {
                var title = "Level " + gameMaster.gameLevel;
                ctx.save();
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 5;
                ctx.font = "64px Impact";
                ctx.textAlign = "center";
                ctx.strokeText(title, 250, 250);
                ctx.fillText(title, 250, 250);
                ctx.restore();
            }
        };

        // GAME OVER
        // Display Game Over when player is out of lives.
        if (gameMaster.playerLives === 0) {
            // Set the stroke, and text styles for GAME OVER
            ctx.save();
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 5;
            ctx.font = "64px Impact";
            ctx.textAlign = "center";
            ctx.strokeText("Game Over", 250, 250);
            ctx.fillText("Game Over", 250, 250);
            ctx.restore();

            ctx.save();
            ctx.font = "24px Impact";
            ctx.textAlign = "center";
            ctx.fillText("Press Enter to Play Again", 250, 425);
            ctx.restore();
        };

        // WIN THE ENTIRE GAME
        // Once player defeats level 10, display You've Won!
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
        //Decrement player lives by 1 and reset character to Starting point
        gameMaster.playerLives--;
        player = Character();
    },
    'roadBlock' : function () {
        // Block the players movement, by reversing their last input
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
        // Decrement the levels gem count by 1
        gameMaster.gemCount--;
    },
    'levelVictory' : function() {
        // reset goal squares to false ( not captured )
        gameMaster.goalSquares = [false, false, false, false, false];
        // Increment the gameLevel variable, to move up a level
        gameMaster.gameLevel++;
        // Reset title timer to display the next level title
        if (gameMaster.gameLevel <= 10) {
            gameMaster.titleTimer = 0;
        }
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
    },

    // GAME LEVELS
    'levels' : function() {
        // Declare fucntion wide variables
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
            rocks = {};
            // add any Gems
            gems = {};
            // Add our enemy bugs. With a column, row, direction and duration in seconds
            // The larger the seconds value, the slower the bug goes.
            enemies = {
                'bug01' : new Enemy(3, 1, 'right', 2),
                'bug02' : new Enemy(1, 2, 'right', 3),
                'bug03' : new Enemy(2, 3, 'right', 5),
            }
            // Push all bugs, gems, and rocks into global allEnemies array
            // They are done seperately to control which elements appear on top
            // Bugs added last to appear on top of all other elements
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
        // Only commenting the first level, all the rest are copies
        else if (gameMaster.gameLevel === 2){
            allEnemies.splice(0,allEnemies.length)
            player = Character();
            rocks = {};
            gems = {};
            enemies = {
                'bug01' : new Enemy(1, 1, 'left', 2),
                'bug02' : new Enemy(1, 2, 'right', 4),
                'bug03' : new Enemy(2, 2, 'right', 4),
                'bug04' : new Enemy(3, 2, 'right', 4),
                'bug07' : new Enemy(2, 3, 'right', 3),
            }
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
            allEnemies.splice(0,allEnemies.length)
            player = Character();
            rocks = {
                'rock01' : new Stone(3,2),
            };
            gems = {};
            enemies = {
                'bug01' : new Enemy(1, 1, 'right', 2.5),
                'bug02' : new Enemy(4, 1, 'right', 2.5),
                'bug03' : new Enemy(1, 2, 'left', 4),
                'bug04' : new Enemy(3, 2, 'left', 4),
                'bug05' : new Enemy(1, 3, 'left', 3)
            }
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
            allEnemies.splice(0,allEnemies.length)
            player = Character();
            rocks = {
                'rock01' : new Stone(1,3),
                'rock02' : new Stone(5,3)
            };
            gems = {};
            enemies = {
                'bug01' : new Enemy(1, 1, 'right', 3),
                'bug02' : new Enemy(2, 1, 'right', 3),
                'bug03' : new Enemy(3, 1, 'right', 3),
                'bug04' : new Enemy(2, 2, 'left', 4),
                'bug05' : new Enemy(4, 2, 'left', 4),
                'bug06' : new Enemy(5, 3, 'left', 1),
            }
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
            allEnemies.splice(0,allEnemies.length)
            player = Character();
            rocks = {};
            gems = {
                'gem01' : new Jewel(3,2),
            };
            enemies = {
                'bug01' : new Enemy(1, 1, 'right', 2),
                'bug02' : new Enemy(2, 1, 'right', 2),
                'bug03' : new Enemy(1, 2, 'left', 4),
                'bug04' : new Enemy(3, 2, 'left', 4),
                'bug05' : new Enemy(1, 3, 'right', 6),
                'bug06' : new Enemy(2, 3, 'right', 6),
                'bug07' : new Enemy(3, 3, 'right', 6),
            }
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
            allEnemies.splice(0,allEnemies.length)
            player = Character();
            rocks = {
                'rock01' : new Stone(2,2),
                'rock02' : new Stone(4,2)
            };
            gems = {
                'gem01' : new Jewel(1,2),
                'gem02' : new Jewel(3,2),
                'gem03' : new Jewel(5,2)
            };
            enemies = {
                'bug01' : new Enemy(1, 1, 'right', 3),
                'bug02' : new Enemy(2, 1, 'right', 3),
                'bug03' : new Enemy(3, 2, 'right', 5),
                'bug04' : new Enemy(2, 2, 'right', 5),
                'bug05' : new Enemy(3, 3, 'left', 1)
            }
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
            allEnemies.splice(0,allEnemies.length)
            player = Character();
            rocks ={
                'rock01' : new Stone(1,3),
                'rock02' : new Stone(2,3),
                'rock03' : new Stone(4,3),
                'rock04' : new Stone(5,3)
            };
            gems = {};
            enemies = {
                'bug01' : new Enemy(1, 3, 'left', 3),
                'bug02' : new Enemy(2, 3, 'left', 3),
                'bug03' : new Enemy(3, 3, 'left', 3),
                'bug04' : new Enemy(1, 2, 'right', 3),
                'bug05' : new Enemy(5, 2, 'right', 3),
                'bug06' : new Enemy(1, 1, 'left', 2.5),
            }
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
            allEnemies.splice(0,allEnemies.length)
            player = Character();
            rocks = {
                'rock01' : new Stone(1,3),
                'rock02' : new Stone(3,3),
                'rock03' : new Stone(5,3),
                'rock04' : new Stone(2,2),
            };
            gems = {
                'gem01' : new Jewel(1,2),
                'gem02' : new Jewel(2,3),
            };
            enemies = {
                'bug01' : new Enemy(4, 3, 'left', 3),
                'bug02' : new Enemy(2, 2, 'right', 4),
                'bug03' : new Enemy(3, 2, 'right', 4),
                'bug04' : new Enemy(1, 1, 'left', 3),
                'bug05' : new Enemy(2, 1, 'left', 3),
                'bug06' : new Enemy(3, 1, 'left', 3)
            }
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
            allEnemies.splice(0,allEnemies.length)
            player = Character();
            var rocks = {
                'rock01' : new Stone(1,3),
                'rock02' : new Stone(2,2),
                'rock03' : new Stone(5,3),
                'rock04' : new Stone(4,2)
            };
            var gems = {
                'gem01' : new Jewel(5,2),
                'gem02' : new Jewel(1,2)
            };
            var enemies = {
                'bug01' : new Enemy(1, 3, 'right', 2),
                'bug02' : new Enemy(2, 3, 'right', 2),
                'bug03' : new Enemy(1, 2, 'right', 3),
                'bug04' : new Enemy(4, 2, 'right', 3),
                'bug05' : new Enemy(1, 1, 'left', 4),
                'bug06' : new Enemy(5, 1, 'left', 4)
            }
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
            allEnemies.splice(0,allEnemies.length)
            player = Character();
            var rocks = {
                'rock01' : new Stone(2,2),
                'rock02' : new Stone(4,2),
                'rock03' : new Stone(3,3)
            };
            var gems = {
                'gem01' : new Jewel(3,2),
                'gem02' : new Jewel(2,3),
                'gem03' : new Jewel(4,3)
            };
            var enemies = {
                'bug01' : new Enemy(1, 1, 'right', 5),
                'bug02' : new Enemy(2, 1, 'right', 5),
                'bug03' : new Enemy(3, 3, 'right', 2),
                'bug04' : new Enemy(1, 2, 'left', 2)
            }
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
      },
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

// Levels function instanitates all enemies and obstacles
gameMaster.levels();

// This listens for key presses and sends the keys to your
// player.handleInput() method. You don't need to modify this.
// Added output of keys to the Game Master control for Game Over and Instructions
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
