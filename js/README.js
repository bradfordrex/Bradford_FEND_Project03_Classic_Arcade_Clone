/* README.js
 * This file provides games instructional overlay.
 * draws the initial instructions on the screen, and then toggles visability
 * by a variable in the GameMaster obect in app.js.
 */

 var gamePlayInstructions = function () {
   if (gameMaster.instructions === 'visable') {
   // draw a rectangle to hold all the instructions;
   ctx.save();
   ctx.globalAlpha = .9;
   ctx.fillStyle = "lightblue";
   ctx.strokeStyle = "white";
   ctx.lineWidth = 5;
   ctx.fillRect(27,75,450,450);
   ctx.strokeRect(27,75,450,450);
   ctx.restore();

   // Draw the main title "How to Play"
   ctx.save();
   ctx.strokeStyle = 'white';
   ctx.lineWidth = 5;
   ctx.font = "64px Impact";
   ctx.textAlign = "center";
   ctx.strokeText("How To Play", 250, 140);
   ctx.fillText("How To Play", 250, 140);
   ctx.restore();

   // Draw detailed instructions on how to playing
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

   // Draw the instruction to begin playing the game
   ctx.save();
   ctx.textAlign = "center";
   ctx.fillText("Press Spacebar to Begin", 250, 500);
   ctx.restore();

   // Draw the instruction on how to pull up the instructions
   ctx.save();
   ctx.textAlign = "center";
   ctx.font = "12px arial";
   ctx.fillText("Press Spacebar at anytime to view instructions again.", 250, 515);
   ctx.restore();
   };
 };