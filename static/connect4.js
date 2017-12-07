// Figure out who's going first
let init_player = document.getElementById("player").value;

// Sets up HTML5 canvas and context as variables
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

// Gradient variable for aesthetic purposes and usage
let gradient=ctx.createLinearGradient(0,0,canvas.width,0);
gradient.addColorStop("0","magenta");
gradient.addColorStop("0.5","blue");
gradient.addColorStop("1.0","red");

// Set inital context properties
ctx.fillStyle=gradient;
ctx.textAlign='center';

// Title image
let title_image = new Image();
title_image.src = "../static/logos/Connect4.PNG";

// Draws the title image on the screen once it is ready
title_image.onload = function(){
  ctx.drawImage(title_image, 400, 30,150,100);
};

// Button class with attributes for text, coordinate location, width/height data
function Button(text, x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    //this.clicked = false;
    //this.hovered = false;
    this.text = text;
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

// Sets context properties to draw game board
ctx.lineCap='round';
ctx.lineWidth = 10;
ctx.strokeStyle = gradient;

// Draws game board for connect4
for (var i = 0; i < 7; i++){
    ctx.beginPath();
    ctx.moveTo(100, 90*i+150);
    ctx.lineTo(870, 90*i+150);
    ctx.stroke();    
}

for (var j = 0; j < 8; j++){
    ctx.beginPath();
    ctx.moveTo(110*j + 100, 150);
    ctx.lineTo(110*j + 100, 690);
    ctx.stroke();
}

/* Creates list of moves that player can make based on x, y location.
   i.e Connect4 has 7 possible moves, one for each column of the grid.
   This makes a list of rectangles (x, y, width, height) that represent each of the 7 columns on the board.
*/
var moves =[];
  for(i = 0; i < 7; i++){
    var move = {
      x: 100 + 110*i,
      y: 150,
      width: 110,
      height: 600,
  };
  moves.push(move);
  
}

// Adjusts mouse location to canvas coordinates
function getXY(canvas, event){ 
  const rect = canvas.getBoundingClientRect();
  const y = event.clientY - rect.top;
  const x = event.clientX - rect.left;
  return {x:x, y:y};
}

// Takes in a mouse position and a rectangle and determines if mouse location is contained within
function isInside(pos, rect) {
    return pos.x > rect.x && pos.x < rect.x+rect.width && pos.y < rect.y+rect.height && pos.y > rect.y;
}


// Function that draws an X on the canvas at location x, y
function drawX(x, y){
    ctx.strokeStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(x - 20, y - 20);
    ctx.lineTo(x + 20, y + 20);

    ctx.moveTo(x + 20, y - 20);
    ctx.lineTo(x - 20, y + 20);
    ctx.stroke();
}

// Function that draws an O on the canvas at location x, y
function drawO(x, y){
  ctx.strokeStyle = 'red';
  ctx.beginPath();  
  ctx.arc(x,y,30,0,2*Math.PI);
  ctx.stroke();
}

// Deal with user clicks
// Inspired by StackOverflow
document.addEventListener('click', function(e) {
  const XY = getXY(canvas, e);
  
  // If back button clicked, go back to the main page
  if(isInside(XY, backButton)) {
    window.location = '/';
    return;
  }
  
  // If restart button clicked, restart game from blank board
  if (isInside(XY, restartButton)){
    window.location = '/connect4';
    return;
  }
  
  // Check if a human made a move
  for (var i = 0; i < moves.length; i++){
    if (isInside(XY, moves[i])){
      human_move(i);
      return;
    }
  }
}, false);

// Passes data back to front end after human makes a move
function human_move(move_num) {
  $.post("/human_move", {"move": move_num}, function(data) {
    render_board(data);
    if (data["bot_move"] == 1) {
      bot_move();
    }
  });
}

// Passes data back to front end after bot makes a move
function bot_move() {
  $("#waiting").show();
  $.post("/bot_move", {}, function(data) {
    render_board(data);
    $("#waiting").hide();
  });
}

/* Renders current state of the game on the canvas based 
   on information that was passed to it from application.py
   in the form of a json
*/
ctx.font = "60px Verdana";
function render_board(data) {
  for (var j = 0; j < 6; j++){
    for (var i = 0; i < 7; i++){
      var val = data["" + (j * 7 + i)];
      if (val == 0) {
        drawO(100 + 110*i + 50, 150 + 90*j + 45);
      } 
      else if (val == 1) {
        drawX(100 + 110*i + 50, 150 + 90*j + 50);
      }
    }
  }
  
  // this condition will be satifised very, very rarely; if at all
  if (data["winner"] == 0){
    ctx.fillStyle = 'green';
    ctx.fillText("YOU WON!", 200, 120);
  }
  
  if (data["winner"] == 1){
    ctx.fillStyle = 'red';
    ctx.fillText("YOU LOST!", 200, 120);
  }
  
  if (data["winner"] == -1){
    ctx.fillStyle = 'blue';
    ctx.fillText("A TIE!", 200, 120);
  }
}

// Once the window has loaded, check if we should request a bot move
$(window).on("load", function() {
  // if the first player is the bot, request the bot's move
  if (init_player == 1) {
    bot_move();
  }
});