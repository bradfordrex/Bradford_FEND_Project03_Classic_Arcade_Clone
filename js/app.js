/* app.js
 *
 * Created by: Bradford Hill
 * Created on: 8/24/2015
 *
 * This file contains all code that initializes and updates
 * all objects used in the "Frogger" classic arcade game clone.
 * This game has enemy bugs, rock road blocks, and gems that must be collected.
 * It has one player with 3 lives and 10 levels that require the player to
 * capture all 5 of the water blocks to advance the next level.
 *
 * It declares and defines contructor Classes to create enemy bugs, stones,
 * and gem objects. It then draws the entities to the game board.
 *
 * It creates the player object, draws it on the canvas, and then listens for
 * and handles User input. It updates the player object based on user input.
 *
 * It then declares a Game Master object that contains all the functions
 * that control the rules of game play. Player lives, game level, etc. It then
 * updates and monitors game play to control the rules of the game. Keeps track
 * of which water squares have been captured, how many lives remain, and user
 * input to control "insturctions" and "game over" game messages.
 *
*/

/*
 * Enemy Class constructor
 * Creates the enemy objects and declares the variables needed for each bug.
 *
 * It takes in a Column, Row, Direction, and Seconds parameter. The seconds
 * refers to how many seconds it takes for the bug to cross the entire game
 * canvas. So more seconds means it moves slower.
 *
 * It sets the bugs starting posistion based on its direction. Right or left
 * side of the canvas. And sets the Y posistion value based on which row of
 * paved blocks on the game canvas. Row 1 is the top row, and row 3 is the
 * bottom row of paved blocks.
 *
 * It sets an animation delay based on the column parameter. This delay
 * animates the bugs into "columns" of bugs, one after the other. Column 1
 * goes first, column 2 follows right behind it, etc. Up to 5 columns, which
 * would create a constant line of bugs with no holes for the character to
 * pass through.
 *
 * It creates a delay counter variable that lives outside the update and render
 * methods, so that it will not be constantly reset.
 *
 * It then sets the URL of the bug image to a sprite variable. It also sets
 * the function to be run when a collision occurs. It calls a function on
 * collision, so that subclasses can change and add operations to the collision.
*/

var Enemy = function(col, row, dir, seconds) {
    'use strict';
    this.sprite = 'images/enemy-bug.png';
    this.delaycounter = 0;
    this.seconds = seconds;
    this.onCollision = function() {  // Sets the operation to call on collision
        gameMaster.loseLife();
    };

    if (col === 1) {                  // first bug to cross canvas
        this.delay = 0;
    }
    else if (col === 2) {             // second bug
        this.delay = 0.2 * seconds;
    }
    else if (col === 3) {             // third bug
        this.delay = 0.4 * seconds;
    }
    else if (col === 4) {             // fourth bug
        this.delay = 0.6 * seconds;
    }
    else {                            // fifth bug
        this.delay = 0.8 * seconds;
    }

    if (row === 1) {
        this.y = 60;                  // Top row
    }
    else if (row === 2) {
        this.y = 143;                 // Middle row
    }
    else {
        this.y = 226;                 // Bottom row
    }

    if (dir === 'right'){             // Start on the Left of canvas
        this.x = -110;
        this.startPos = -110;
        this.endPos = 515;
    }
    else if (dir === 'left'){         // Start on the Right of canvas
        this.x = 505;
        this.startPos = 515;
        this.endPos = -110;
    }
};

/*
 * Enemy Update Method - this code controls how the bugs are updated on
 * every frame of the animation / game.
 *
 * It calls the animate() function to move the bugs across the canvas, and it
 * has the collision detection algorithm for each bug. When the bug and the
 * character collide, it calls the loseLife() function.
 *
*/

Enemy.prototype.update = function(dt) {
    'use strict';
    this.delaycounter += dt;            // start the delay timer
    if (this.delaycounter > this.delay) {     // after delay, begin animation
        this.x = animate.move(
            this.x,
            this.startPos,
            this.endPos,
            this.seconds,
            dt,
            'repeat');
    }

    /*
     * COLLISION CHECKING
     * Checks if either the left side or the right side of the character image
     * fall inside the Bug image. Must check both sides, because the character
     * can move into the bugs from either side.
     * Does the left point (25,95) or right point (75,95) of the character
     * image fall inside the bug image range (2,76) - (98,144)
     */
    if (                                // Check Left side of Character
        player.x + 25 >= this.x + 2
        && player.x + 25 <= this.x + 98
        && player.y + 95 >= this.y + 76
        && player.y + 95 <= this.y + 144
    ){
        this.onCollision();             // if touching, call collision funcion
      }

    if (                                // Check Right side of Character
        player.x + 75 >= this.x + 2
        && player.x + 75 <= this.x + 98
        && player.y + 95 >= this.y + 76
        && player.y + 95 <= this.y + 144
    ){
        this.onCollision();             // if touching, call collision funcion
   }
};

/*
 * Enemy Render Method
 * Draw the enemy bug image to the canvas. Taking in the URL, X, and Y
 * from the Enemy variables set forth in the Class constructor.
 */

Enemy.prototype.render = function() {
    'use strict';
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/*
 * Rock Road Block Constructor Sub-Class of Enemy
 * Creates the rock objects, and assigns their x and y coordinates based on
 * the Column and Row parameters passed in.
 *
 * Columns are based on the paved block grid of the game canvas.
 * Column 1 is the first square on the left, Column 5 is the last square on the
 * right. Row 1 is the top, Row 3 is the bottom.
 *
 * It re-uses the update and render methods of the Enemy Super Class
 */
var Stone = function(col, row){
    'use strict';
    Enemy.call(this, col, row);         // copy in properties of Enemy class
    this.sprite = 'images/Rock.png';
    this.onCollision = function() {     // set unique collisio function.
        gameMaster.roadBlock();
    };
    if (col === 1) {            // First column on far left
        this.x = 1;
    }
    else if (col === 2) {       // second column
        this.x = 102;
    }
    else if (col === 3) {       // third column
        this.x = 203;
    }
    else if (col === 4) {       // fourth column
        this.x = 304;
    }
    else {                      // fifth column on far right
        this.x = 405;
    }
    console.log(this.x);
};
Stone.prototype = Object.create(Enemy.prototype); // Copy Enemy methods
Stone.prototype.constructor = Stone;             // Set constructor to Subclass
Stone.prototype.update = function() {       // Override the Enemy update method
    Enemy.prototype.update.call(this);    // copy properties of Enemy update
    this.x = this.x;                    // Takes away the animation on this.x
};

/*
 * Jewel constructor Sub Class and Methods
 * Creats a subclass of Stone. Then Reuses posistioning of the Stone class
 * based on column and row parameters.
 * Then sets unique image URL, and collision function.
 *
 * Delcares a vis variable to toggle the visablility of the gem when "collected"
 *
 * It then overrides the Update and Render methods to only update and draw
 * when the gem is visable.
 */

var Jewel = function (col, row) {
    'use strict';
    Stone.call(this, col, row);           // copy properties of Stone Subclass
    this.sprite = 'images/Gem Blue.png';
    this.vis = true;                      // create visability toggle variable
    this.onCollision = function() {     // Sets unique collision function
        if (this.vis === true){       // only runs CollectGem when visable
          gameMaster.collectGem();    // to keep from running more than once
        }
        this.vis = false;               // on collision; toggles visability off

    };
    gameMaster.gemCount += 1;   // adds 1 to gemCount tracking total of number
                                // of gems per level
};
Jewel.prototype = Object.create(Stone.prototype);  // copy Stone methods
Jewel.prototype.constructor = Jewel;    // set constructor to Jewel Subclass
Jewel.prototype.render = function () { // over ride render function
    'use strict';
    if (this.vis === true) {        // if Gem is visable, draw it to the canvas
    ctx.drawImage(Resources.get(this.sprite), this.x+12, this.y+38, 75, 115);
  }                             // Gem image must be scaled down to fit squares
};

/*
 * Player Character constructor Class
 * This class does not accept any parameters. It sets the characters default
 * posistion on the game map, as well as its image URL.
 *
 * Then creates Update, Render, and Input handling methods.
 */

var Character = function () {
    'use strict';
    this.sprite = 'images/char-boy.png';
    this.x = 203;
    this.y = 405;
};

/*
 * Character update method
 * Posistion checking determines when the character reaches the water.
 * Then calls the levelScore function to track which water squares have been
 * captured.
 */
Character.prototype.update = function(dt) {
    'use strict';
    if (this.y === -10) {          // Checks Y posistion to see if in Water row
        gameMaster.levelScore(this.x);
    }
};

/*
 * Character render method - Draws the player character to the game map
 */
Character.prototype.render = function() {
    'use strict';
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/*
 * User input Method
 * This fuction handles the character movement based on User Input
 * It accepts a key stroke parameter from the event listener and then
 * modifies the character x or y posistion value based on which key was pressed.
 *
 * It updates a user movment buffer to keep track of the last move; used by
 * the roadBlock function.
 *
 * If statements check to see if the game is over or if the game has been won
 * then disables user control when those system messages are activated. So
 * user can not move the character when "Game Over" is on screen. It also
 * checks every movement to see if it fits on the game map, and does not allow
 * the move if it goes off canvas.
 */
Character.prototype.handleInput = function(direction) {
    'use strict';
    var stepY = 83;               // sets the movement height of the character.
    var stepX = 101;              // sets the movement lenght of the character.
    gameMaster.lastMove = direction;           // updates movement buffer

    if (gameMaster.gameLevel <= 10 && gameMaster.playerLives > 0) {
    if (direction === 'up') {
        if (this.y-stepY >= -20) {          // check if move stays on map
          this.y -= stepY;
        }
      }
    else if (direction === 'down') {
        if (this.y+stepY <= 435) {          // check if move stays on map
          this.y += stepY;
        }
      }
    else if (direction === 'left') {
        if (this.x-stepX > 0) {             // check if move stays on map
          this.x -= stepX;
        }
      }
    else if (direction === 'right') {
        if (this.x+stepX < 505) {           // check if move stays on map
          this.x += stepX;
        }
      }
    }
};

// Declare global variables necessary for the game engine to operate
var player = [];
var allEnemies = [];

/*
 * GAME MASTER object
 * This object holds all functions that control game play. It holds variables
 * that track the current number of player lives, which level is loaded and
 * active, as well as how many gems are on the board, instruction visability,
 * captured goal squares, and users last move.
 *
 */

var gameMaster = {
    playerLives: 3,       // current player lives. Starts at 3.
    gameLevel : 1,        // current game level, starts at 1
    lastMove : '',        // holds User's last move
    gemCount : 0,     // # of gems on board not collected. Must be 0 to advance
    goalSquares : [ false,  // Tracks what water squares have been captured
                    false,  // starts at false, or no squares captured.
                    false,
                    false,
                    false],
    instructions : 'visable',   // instructions visability
    titleTimer : 0,       // Timer variable to time visability of "Level" Title
    /*
     * System Control input handling - accepts the key value of user input from
     * the even listener. Only accpets Spacebar and Enter. Controls spacebar's
     * command of instructions visability. And only allows Enter to work when
     * "Game Over" is displayed.
     */
    systemControl : function(keyCode) {
        'use strict';
        if (gameMaster.playerLives === 0) { // When game is over, accepts Enter
            if (keyCode == 'enter') {       // Key, and then resets the game
                gameMaster.gameLevel = 1;   // when pressed
                gameMaster.playerLives = 3;
                gameMaster.goalSquares = [false, false, false, false, false];
                gameMaster.levels();
            }
        }

        if (keyCode === 'spacebar') { // Spacebar toggles instruction visability
            if (gameMaster.instructions === 'visable') {
                gameMaster.instructions = 'hidden';
            } else {
                gameMaster.instructions = 'visable';
            }
        }
    },
    /*
     * Game Master Render function. - Holds all code to render images and text
     * to the game canvas.
     */
    render : function(dt){
        'use strict';
        if (gameMaster.instructions === 'visable') {
            // Draw rectangle box to hold instructions
            ctx.save();                   // ctx.save to create unique settings
            ctx.globalAlpha = 0.9;        // set opacity to 90%
            ctx.fillStyle = "lightblue";
            ctx.strokeStyle = "white";
            ctx.lineWidth = 5;
            ctx.fillRect(27, 75, 450, 450);
            ctx.strokeRect(27, 75, 450, 450);
            ctx.restore();        // restore canvas setting to before ctx.save

            // Draw the main title "How to Play"
            ctx.save();
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 5;
            ctx.font = "64px Impact";
            ctx.textAlign = "center";
            ctx.strokeText("How To Play", 250, 140);
            ctx.fillText("How To Play", 250, 140);
            ctx.restore();

            // Draw detailed instructions on how to play the game
            ctx.save();
            ctx.textAlign = "center";
            ctx.font = "18px arial";
            ctx.fillText("Move your character around the game", 250, 175);
            ctx.fillText("board using the arrow keys on your keyboard.", 250, 200);
            ctx.fillText("The object is to get your character to the water", 250, 240);
            ctx.fillText("without being hit by a bug!", 250, 265);
            ctx.fillText("You must capture all of the water squares", 250, 305);
            ctx.fillText("to advance to the next level.", 250, 330);
            ctx.fillText("Beware of Rocks, that will block your path!", 250, 370);
            ctx.fillText("When you see a gemstone, make sure to grab it.", 250, 410);
            ctx.fillText("You must pick up all gemstones", 250, 435);
            ctx.fillText("in order to advance!", 250, 460);
            ctx.restore();

            // Draw the instructions to begin playing the game
            ctx.save();
            ctx.font = "24px Impact";
            ctx.textAlign = "center";
            ctx.fillText("Press Spacebar to Begin", 250, 500);
            ctx.restore();

            // Draw the instructions on how to pull up the instructions menu when needed
            ctx.save();
            ctx.textAlign = "center";
            ctx.font = "12px arial";
            ctx.fillText("Press Spacebar at anytime to view instructions again.", 250, 515);
            ctx.restore();
        }

        // LIFE METER
        var meterX = 450;     // Set starting position of the meter
        var meterY = 505;
        ctx.save();                 // Set font properties for the text
        ctx.font = "24px Courier";
        ctx.fillText("Lives:", 275, 575);
        ctx.restore();

        // Loops through the amount of lives in the playerLives variable
        // and draws a small scale character image for each one
        var i = 0;
        while (i < gameMaster.playerLives) {
            ctx.drawImage(Resources.get(player.sprite), meterX - i*45, meterY, 51, 86);
            i += 1;
        }

        // CURRENT LEVEL
        // Draws current level display to the bottom left of the game map
        var levelBanner = "Level " + gameMaster.gameLevel; // set banner text
        if (gameMaster.gameLevel === 11) {    // Sets banner text to Level 10
            levelBanner = "Level " + 10;      // After game is won. Which sets
        }                                     // gameLevel to 11
        ctx.save();
        ctx.font = "24px Impact";
        ctx.fillText(levelBanner, 10, 575);
        ctx.restore();

        // CAPTURED SQUARES
        // Draws the key image on squares that have been captured
        var capturedSquare = 'images/Key.png';    // set image URL
        // Find length of Array
        var capturedSquareLength = gameMaster.goalSquares.length;
        var offset;                 // Declare offset variable
        gameMaster.goalSquares.forEach(function(val, i) {
            offset = 101 * i;           // set offset for each square in array
            if (val === true) {         // if square is captured, draw key
                ctx.drawImage(Resources.get(capturedSquare), 10 + offset, 15, 85, 120);
            }
        });

        // NEW LEVEL ACHIEVED
        if (gameMaster.gameLevel > 1) { // Only display for Level 2 and up
            gameMaster.titleTimer += dt;    // begin timer
            if (gameMaster.titleTimer < 2) { // display title for 2 seconds.
                var title = "Level  " + gameMaster.gameLevel;
                ctx.save();
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 5;
                ctx.font = "64px Impact";
                ctx.textAlign = "center";
                ctx.strokeText(title, 250, 250);
                ctx.fillText(title, 250, 250);
                ctx.restore();
            }
        }

        // GAME OVER
        // Display Game Over when player is out of lives.
        if (gameMaster.playerLives === 0) {
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
        }

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
        }
    },
    /*
     * Lose Life Function - this handls all code to be executed when a player
     * loses a life. Subtracts 1 from the total player life count, then resets
     * the player character to the default starting position.
     */
    loseLife : function (){
        'use strict';
        gameMaster.playerLives -= 1;  // subtract 1 from player life count
        player = new Character();     // reset character
    },
    /*
     * Road Block function - this creates the effect of stopping the players
     * movement by reversing the User's last move when character collides
     * with a rock.
     */
    roadBlock : function () {
        'use strict';
        if (gameMaster.lastMove === 'up') {
            player.handleInput('down');     // If  moved up, move back down
        } else if (gameMaster.lastMove === 'down') {
            player.handleInput('up');       // If  moved down, move back up
        } else if (gameMaster.lastMove === 'right') {
            player.handleInput('left');     // If  moved right, move back left
        } else if (gameMaster.lastMove === 'left') {
            player.handleInput('right');    // If  moved left, move back right
        }
    },
    /*
     * Collect Gem Function - runs when the character collides with a gem. It
     * then subtracts 1 from the gemCount. Once it hits 0, player can advance.
     */
    collectGem : function () {
        'use strict';
        gameMaster.gemCount -= 1; // Decrement the levels gem count by 1
    },
    /*
     * Level Victory Fuction - resets goal squares to false "uncollected"
     * then increments the game to the next level by adding one to the
     * game level variable. Calls the levels function to set up eneimes
     * It then resets the title timer to display level title for 2 seconds.
     */
    levelVictory : function() {
        'use strict';
        gameMaster.goalSquares = [  // clears all captured squares to begin
            false,                  // new level.
            false,
            false,
            false,
            false];
        gameMaster.gameLevel += 1;  // adds one to the game level variable
        if (gameMaster.gameLevel <= 10) { // reset title timer to display level
            gameMaster.titleTimer = 0;
        }
        gameMaster.levels();    // calls levels function to load next level
    },
    /*
     * Level Score function accepts the current character posisition
     * and then sets the square that the character reached to true (captured).
     * Updates the goalSquares array with the updated status.
     *
     * Then once all squares are true, and all gems collected, it calls
     * level victory function to advance a level.
     */
    levelScore : function (charXPosition) {
        'use strict';
        if (charXPosition === 1){       // square 1 , far left square
            gameMaster.goalSquares[0] = true;
            player = new Character();
        } else if (charXPosition === 102){    // square 2 captured
            gameMaster.goalSquares[1] = true;
            player = new Character();
        } else if (charXPosition === 203){    // square 3 captured
            gameMaster.goalSquares[2] = true;
            player = new Character();
        } else if (charXPosition === 304){    // square 4 captured
            gameMaster.goalSquares[3] = true;
            player = new Character();
        } else if (charXPosition === 405){    // square 5 captured
            gameMaster.goalSquares[4] = true;
            player = new Character();
        }
        // check that all squares are set to true, then trigger levelVictory
        if (gameMaster.goalSquares[0] === true
            && gameMaster.goalSquares[1] === true
            && gameMaster.goalSquares[2] === true
            && gameMaster.goalSquares[3] === true
            && gameMaster.goalSquares[4] === true
            && gameMaster.gemCount === 0)   // check all Gems are collected too
        {
            gameMaster.levelVictory(); // advance a level
        }
    },

    /*
     * GAME LEVELS
     * This function holds all the eneime and obstacle settings for each level.
     * It uses an if statemtn to check the value of the gameLevel variable,
     * then loads the appropriate level.
     *
     * Each level clears the allEnemies array. Then declares the rocks, gems,
     * and enemy objects for the level. The object holds the instantiate code
     * for each enemy and obstacle object. With the correct parameters set.
     * Column, Row, Direction, and Speed (Seconds Duration) for each bug.
     * Colum, Row for each rock and each gem.
     *
     * Finally, the function pushes all enemies into the allEnemies variable
     * which is grabbed by the game engine and rendered. It pushes them in order
     * gems then rocks then bugs, so that the bugs are always on top. Z order
     * is determined by order rendered.
     *
     * Levels 2 - 10 follow the same pattern as Level 1. Only commenting Level 1.
     */
    levels : function() {
        'use strict';
        // Declare fucntion wide variables
        var rocks = {};
        var gems = {};
        var enemies = {};

        // LEVEL 1
        if (gameMaster.gameLevel === 1){
            player = new Character();   // Reset character to start point
            allEnemies.splice(0,allEnemies.length); // clear all eneimes from previous level
            rocks = {};                   // add any obstacle rocks
            gems = {};                     // add any Gems
            enemies = {                   // add enemy bugs
                bug01: new Enemy(3, 1, 'right', 2),
                bug02: new Enemy(1, 2, 'right', 3),
                bug03: new Enemy(2, 3, 'right', 5)
            };
        }

        // LEVEL 2
        else if (gameMaster.gameLevel === 2){
            allEnemies.splice(0,allEnemies.length);
            player = new Character();
            rocks = {};
            gems = {};
            enemies = {
                bug01 : new Enemy(1, 1, 'left', 2),
                bug02 : new Enemy(1, 2, 'right', 4),
                bug03 : new Enemy(2, 2, 'right', 4),
                bug04 : new Enemy(3, 2, 'right', 4),
                bug05 : new Enemy(2, 3, 'right', 3)
            };
        }

        // LEVEL 3
        else if (gameMaster.gameLevel === 3){
            allEnemies.splice(0,allEnemies.length);
            player = new Character();
            rocks = {
                rock01 : new Stone(3,2)
            };
            gems = {};
            enemies = {
                bug01 : new Enemy(1, 1, 'right', 2.5),
                bug02 : new Enemy(4, 1, 'right', 2.5),
                bug03 : new Enemy(1, 2, 'left', 4),
                bug04 : new Enemy(3, 2, 'left', 4),
                bug05 : new Enemy(1, 3, 'left', 3)
            };
        }
        // LEVEL 4
        else if (gameMaster.gameLevel === 4){
            allEnemies.splice(0,allEnemies.length);
            player = new Character();
            rocks = {
                rock01 : new Stone(1,3),
                rock02 : new Stone(5,3)
            };
            gems = {};
            enemies = {
                bug01 : new Enemy(1, 1, 'right', 3),
                bug02 : new Enemy(2, 1, 'right', 3),
                bug03 : new Enemy(3, 1, 'right', 3),
                bug04 : new Enemy(2, 2, 'left', 4),
                bug05 : new Enemy(4, 2, 'left', 4),
                bug06 : new Enemy(5, 3, 'left', 1)
            };
        }

        // LEVEL 5
        else if (gameMaster.gameLevel === 5){
            allEnemies.splice(0,allEnemies.length);
            player = new Character();
            rocks = {};
            gems = {
                gem01 : new Jewel(3,2)
            };
            enemies = {
                bug01 : new Enemy(1, 1, 'right', 2),
                bug02 : new Enemy(2, 1, 'right', 2),
                bug03 : new Enemy(1, 2, 'left', 4),
                bug04 : new Enemy(3, 2, 'left', 4),
                bug05 : new Enemy(1, 3, 'right', 6),
                bug06 : new Enemy(2, 3, 'right', 6),
                bug07 : new Enemy(3, 3, 'right', 6)
            };
        }
        // LEVEL 6
        else if (gameMaster.gameLevel === 6){
            allEnemies.splice(0,allEnemies.length);
            player = new Character();
            rocks = {
                rock01 : new Stone(2,2),
                rock02 : new Stone(4,2)
            };
            gems = {
                gem01 : new Jewel(1,2),
                gem02 : new Jewel(3,2),
                gem03 : new Jewel(5,2)
            };
            enemies = {
                bug01 : new Enemy(1, 1, 'right', 3),
                bug02 : new Enemy(2, 1, 'right', 3),
                bug03 : new Enemy(3, 2, 'right', 5),
                bug04 : new Enemy(2, 2, 'right', 5),
                bug05 : new Enemy(3, 3, 'left', 1)
            };
        }
        // LEVEL 7
        else if (gameMaster.gameLevel === 7){
            allEnemies.splice(0,allEnemies.length);
            player = new Character();
            rocks ={
                rock01 : new Stone(1,3),
                rock02 : new Stone(2,3),
                rock03 : new Stone(4,3),
                rock04 : new Stone(5,3)
            };
            gems = {};
            enemies = {
                bug01 : new Enemy(1, 3, 'left', 3),
                bug02 : new Enemy(2, 3, 'left', 3),
                bug03 : new Enemy(3, 3, 'left', 3),
                bug04 : new Enemy(1, 2, 'right', 3),
                bug05 : new Enemy(5, 2, 'right', 3),
                bug06 : new Enemy(1, 1, 'left', 2.5)
            };
        }
        // LEVEL 8
        else if (gameMaster.gameLevel === 8){
            allEnemies.splice(0,allEnemies.length);
            player = new Character();
            rocks = {
                rock01 : new Stone(1,3),
                rock02 : new Stone(3,3),
                rock03 : new Stone(5,3),
                rock04 : new Stone(2,2)
            };
            gems = {
                gem01 : new Jewel(1,2),
                gem02 : new Jewel(2,3)
            };
            enemies = {
                bug01 : new Enemy(4, 3, 'left', 3),
                bug02 : new Enemy(2, 2, 'right', 4),
                bug03 : new Enemy(3, 2, 'right', 4),
                bug04 : new Enemy(1, 1, 'left', 3),
                bug05 : new Enemy(2, 1, 'left', 3),
                bug06 : new Enemy(3, 1, 'left', 3)
            };
        }
        // LEVEL 9
        else if (gameMaster.gameLevel === 9){
            allEnemies.splice(0,allEnemies.length);
            player = new Character();
            rocks = {
                rock01 : new Stone(1,3),
                rock02 : new Stone(2,2),
                rock03 : new Stone(5,3),
                rock04 : new Stone(4,2)
            };
            gems = {
                gem01 : new Jewel(5,2),
                gem02 : new Jewel(1,2)
            };
            enemies = {
                bug01 : new Enemy(1, 3, 'right', 2),
                bug02 : new Enemy(2, 3, 'right', 2),
                bug03 : new Enemy(1, 2, 'right', 3),
                bug04 : new Enemy(4, 2, 'right', 3),
                bug05 : new Enemy(1, 1, 'left', 4),
                bug06 : new Enemy(5, 1, 'left', 4)
            };
        }
        // LEVEL 10
        else if (gameMaster.gameLevel === 10){
            allEnemies.splice(0,allEnemies.length);
            player = new Character();
            rocks = {
                rock01 : new Stone(2,2),
                rock02 : new Stone(4,2),
                rock03 : new Stone(3,3)
            };
            gems = {
                gem01 : new Jewel(3,2),
                gem02 : new Jewel(2,3),
                gem03 : new Jewel(4,3)
            };
            enemies = {
                bug01 : new Enemy(1, 1, 'right', 5),
                bug02 : new Enemy(2, 1, 'right', 5),
                bug03 : new Enemy(3, 3, 'right', 2),
                bug04 : new Enemy(1, 2, 'left', 2)
            };
            // END OF GAME
            // Leaves level 10 running in background of "You Won" text
        }

        var jewels = Object.keys(gems);   // Push jewels into allEnemies array
        jewels.forEach(function(val){
            allEnemies.push(gems[val]);
        });
        var stones = Object.keys(rocks);  // Push rocks into allEnemies array
        stones.forEach(function(val){
            allEnemies.push(rocks[val]);
        });
        var bugs = Object.keys(enemies);  // Push bugs into allEnemies array
        bugs.forEach(function(val){
            allEnemies.push(enemies[val]);
        });

      }
};

// Start the game by calling the Levels function, which loads Level 1.
gameMaster.levels();

// This listens for key presses and sends the keys to your
// player.handleInput() method. You don't need to modify this.
// Added output of keys to the Game Master control for Game Over and Instructions
document.addEventListener('keyup', function(e) {
    'use strict';
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
