// Figure out who's going first
let init_player = document.getElementById("player").value;

// Sets up HTML5 canvas and context as variables
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

// Creates image object with source as a png file from the static folder
let title_image = new Image();
title_image.src = "../static/logos/Tic-Tac-Toe.PNG";

// Draws the title image on the screen once it is ready
title_image.onload = function(){
  ctx.drawImage(title_image, 370, 30,280,200);
};

// Makes gradient variable, used for aesthetic appeal, inspired by stackoverflow
let gradient=ctx.createLinearGradient(0,0,canvas.width,0);
gradient.addColorStop("0","magenta");
gradient.addColorStop("0.5","blue");
gradient.addColorStop("1.0","red");

// Sets a few inital context properties
ctx.fillStyle=gradient;
ctx.textAlign='center';

// Button class that takes in text, coordinates and width, height data
function Button(text, x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    //this.clicked = false;
    //this.hovered = false;
    this.text = text;
}

// Function that draws X on canvas based on coordinates passed in
function drawX(x, y){
    ctx.strokeStyle=gradient;
    ctx.beginPath();
    ctx.moveTo(x - 20, y - 20);
    ctx.lineTo(x + 20, y + 20);

    ctx.moveTo(x + 20, y - 20);
    ctx.lineTo(x - 20, y + 20);
    ctx.stroke();
}

// Function that draws O on canvas based on coordinates passed in
function drawO(x, y){
  ctx.strokeStyle = 'red';
  ctx.beginPath();  
  ctx.arc(x,y,30,0,2*Math.PI);
  ctx.stroke();
}

// Function to draw buttons on canvas, arguments include button object, color, text color
function drawButton(btninfo, btncol, txtcol) {
    ctx.fillStyle=btncol;
    ctx.fillRect(btninfo.x,btninfo.y,btninfo.width,btninfo.height);
    
    ctx.fillStyle=txtcol;
    ctx.font='13pt Verdana';
    ctx.fillText(btninfo.text, btninfo.x + 50, btninfo.y + 30);
}

// Creates instances of two buttons and draws them on canvas
let backButton = new Button("BACK",100, 700, 100, 50);
let restartButton = new Button("RESTART", 800, 700, 100, 50);

drawButton(backButton, "yellow", "blue");
drawButton(restartButton, "yellow", "blue");

// Sets some line properties before drawing board on canvas
ctx.lineCap='round';
ctx.lineWidth = 10;
ctx.strokeStyle = 'black';

// Draw tictacoe board using coordinate system
ctx.beginPath();
ctx.moveTo(290,430);
ctx.lineTo(710,430);
ctx.stroke();

ctx.beginPath();
ctx.moveTo(290,570);
ctx.lineTo(710,570);
ctx.stroke();

ctx.beginPath();
ctx.moveTo(430,290);
ctx.lineTo(430,710);
ctx.stroke();

ctx.beginPath();
ctx.moveTo(570,290);
ctx.lineTo(570,710);
ctx.stroke();

/* Creates list of moves that player can make based on x, y location.
   i.e TicTacToe has 9 possible moves, one for each square of the grid.
   This makes a list of rectangles (x, y, width, height) that represent each of the 9 squares on the board.
*/
var moves =[];
for (var j = 0; j < 3; j++){
  for(var i = 0; i < 3; i++){
    var move = {
      x: 290 + 140*i,
      y: 290 + 140*j,
      width: 140,
      height:140,
    };
  moves.push(move);
  }
}

// Adjusts mouse click to canvas coordinates
function getXY(canvas, event){ 
  const rect = canvas.getBoundingClientRect();
  const y = event.clientY - rect.top;
  const x = event.clientX - rect.left;
  return {x:x, y:y};
}

// Function to determine if mouse is within a certain rect using x, y
// Inspired by StackOverflow
function isInside(pos, rect) {
    return pos.x > rect.x && pos.x < rect.x+rect.width && pos.y < rect.y+rect.height && pos.y > rect.y;
}

// Deal with user clicks
document.addEventListener('click', function(e) {
  const XY = getXY(canvas, e);
  
  // If back button clicked, go back to the main page
  if (isInside(XY, backButton)) {
    window.location = '/';
    return;
  }
  
  // If restart button clicked, restart game from blank board
  if (isInside(XY, restartButton)){
    window.location = '/tictactoe';
    return;
  }
  
  // Checks if a human made a move
  for (var i = 0; i < moves.length; i++){
    if (isInside(XY, moves[i])){
      human_move(i);
      return;
    }
  }
}, false);

function human_move(move_num) {
  $.post("/human_move", {"move": move_num}, function(data) {
    render_board(data);
    if (data["bot_move"] == 1) {
      bot_move();
    }
  });
}

function bot_move() {
  $("#waiting").show();
  $.post("/bot_move", {}, function(data) {
    render_board(data);
    $("#waiting").hide();
  });
}

// Renders board that represents current game state from data passed from python backend
ctx.font = "40px Verdana";
function render_board(data) {
  for (var j = 0; j < 3; j++){
    for (var i = 0; i < 3; i++){
      var val = data["" + (j * 3 + i)];
      if (val == 0) {
        drawO(290 + 140*i + 75, 140 + 140*j + 215);
      }
      else if (val == 1) {
        drawX(290 + 140*i + 75, 140 + 140*j + 215);
      }
    }
  }
  
  // This will never execute becuase the bot will never lose
  if (data["winner"] == 0){
    ctx.fillStyle = 'green';
    ctx.fillText("YOU WON!", 250, 120);
  }
  if (data["winner"] == 1){
    ctx.fillStyle = 'red';
    ctx.fillText("YOU LOST!", 250, 120);
  }
  if (data["winner"] == -1){
    ctx.fillStyle = 'white';
    ctx.fillText("A TIE!", 250, 120);
  }
}

// Once the window has loaded, check if we should request a bot move
$(window).on("load", function() {
  // if the first player is the bot, request the bot's move
  if (init_player == 1) {
    bot_move();
  }
});