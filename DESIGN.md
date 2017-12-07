*Welcome to the Botter Than You DOCS by London Lowmanstone and William Yao*

INTRODUCTION
============

Botter Than You is a web application that runs a computer bot that plays two player games.

TOOLS
=====

* Front End:
    * HTML templates, CSS, Javascript, HTML5 Canvas
* Backend:
    * Python Flask
* Frontend to Backend Communication:
    * jQuery, Ajax

FUNCTIONALITY
=============

* Front End: 
    * Uses 5 HTML templates, 3 Javascript files and 2 css stylesheets. The HTML templates use the CSS stylesheets and renders the canvas on the page.
* Backend: 
    * Minimax algorithm is used to solve tic-tac-toe upon launch of the application
    * Monte Carlo algorithm and position evaluation function are used to inform the connect4 player

TOUR
====

The overall goal of this project is to create a model for bots that can play any two player game. Not just the ones you see here (tic-tac-toe and connect4), but *any* two-player game.

We think we've succeeded.

Last year in high school, London worked on a project where he built a computer that would learn to play tic-tac-toe using reinforcement learning.
Originally, this project was supposed to build on that, but took a completely different turn when we added minimax and the MonteCarlo algorithms and discovered how powerful they were.
This project is now completely separate from the original, with a new `Game` class, new Players, and a completely different way of approaching game play.

To understand this project, first take a look at the `Game` class in `game.py` which defines what a two-player game is.
Remember, any class that implements those methods can be played by the bots. (I'm planning on adding Nine Men's Morris later on this year.)

Then, take a look at how the `TicTacToe` and `ConnectFour` classes are actually implemented.
This will help you to understand how to implement a game.

After that, start looking at the `position_eval` function (in `position_evaluation.py`) or the `monte_carlo_eval` function (in `monte_carlo_evaluation.py`).
This will help you to understand how games are evaluated and comprehend the basic recursion methods used.

Next, look at different players such as the `BasicMonteCarloPlayer` (in the `Unused` folder) or the `AdvisedMonteCarloPlayer` (in `advised_monte_carlo_player.py`).
This will show you how we built players that make moves based on the evaluation functions.

Also, note that our players have no knowledge of how connect4 or tic-tac-toe are actually played; they merely respond to certain actions leading to certain end states.
And yet, they play so well! This is part of what makes our model so generalizable.

This would be a good point to look at the `performace_testers` module which has a `test_against` function that will allow you to play against any of the players.
Feel free to use the default tic-tac-toe one, or initialize your own and see how well it does!

After looking at some of the more normal players, take a look at the `complete_minimax` (in `minimax.py`) function, which returns a dictionary of information about the game.
You can then look at `SolvePlayer` (in `solve_player.py`) to see how a player is built using that type of return value.
Our tic-tac-toe player uses this in order to completely solve tic-tac-toe and play it perfectly.

Now that you've seen how the different players are implemented, take a look at `application.py` to understand how our front end establishes a website with more advanced user interaction.
Especially notice how modular the code is: the routes `/human_move` and `/bot_move` can be used for both tic-tac-toe and connect4!
All we do is load up a different bot that is a little more suited for each game.

And that's Botter Than You! Please, fool around, play some games, and have fun!

DESIGN DECISIONS
================

HTML5 Canvas
------------

Deciding to use HTML5 Canvas as the main interaction point for users was probably the biggest decision in this entire project.
Our main reasons for using the canvas element are

* It allows us to draw games onto the screen without being constrained by HTML and CSS
* It allows us to interact directly with the user - we decide what clicks do

HTML5 Canvas does not come without downsides though:

* It's Very hard to deal with resizing screens
* All interactions need to be coded (including basic button functionality)
* Updating/refreshing the screen can be complicated
    * We managed to avoid this for the most part by reloading the page when a game is restarted

Flask
-----

We debated using many things other than Flask, but eventually we decided to use Flask because of:

* The CS50 support system
    * TFs and students all know how to use it
* It works well with HTML5 canvas
* Integrates rather seamlessly with Python

[Brython](http://brython.info/) was the biggest contender for a while before we ran into some import bugs with it and found out just how viable Flask was.

Other
-----

Other design decisions include:

* Why our minimax doesn't use alpha/beta pruning
    * Alpha/beta pruning is useful for speed in the one calculation of the best move to do, but that calculation must be done for each move
    * Our method only needs to be run once (for about 10 seconds!) and then all the moves can be looked up from a dictionary
    * While this doesn't work well for very complex games (use `game.get_complexity(-1)` to see the complexity of a game), it works quite well for our tic-tac-toe player
* Why we put in a fake delay on our tic-tac-toe player
    * It looked weird to have the bot respond nearly instantaneously


FILES
=====

FRONT-END
---------

* static folder:
    * logos folder:
        * Contains png files that are used throughout the project
            * BotterThanYou.PNG is used on the homepage, see index.html template
            * Connect4.PNG is used on the connect4 page, see connect4.js
            * Tic-Tac-Toe.PNG is used on the tictactoe page, see tictactoe.js
    * javascript files
        * connect4.js
            * javascript for connect4 game page
        * index.js
            * javascript for homepage
        * indexstyle.css
            * css styling for homepage, taken from https://bootswatch.com/
        * style.css
            * css styling for other pages, taken from https://bootswatch.com/
    * tictactoe.js
        * javascript for tictactoe game page
* templates folder:
    * Contains html templates that are used within the project
    about.html
        * html template for the about page, uses style.css
    connect4.html
        * html template for the connect4 game page, uses style.css
    * index.html
        * html template for the homepage, uses indexstyle.css
    * instructions.html
        * html template for the instruction manual, uses style.css
    * tictactoe.html
        * html template for the tictactoe game page, uses style.css


BACK END
--------
(in order of most important)

* application.py
    * Drives the Flask app
    * This one file runs the entire website, so all the code eventually is used here
* game.py
    * Defines general class, `Game`, for games
        * TicTacToe and ConnectFour classes inherit from this class
    * This is the most important class to understand
        * Any game that inherits from this class and implements the methods can be played by our bots
        * How this class was implemented dictated how other functions play and interact with the games
* players.py, `Player` for players
        * All players, such as `SolvePlayer` and `AdvisedMonteCarloPlayer` inherit from this class
    * Defines basic players
        * RandomPlayer
            * Used for simulating random games
            * At the heart of the Monte Carlo algorithm
        * HumanPlayer
            * Used for playing against a player in the terminal
            * Usually used with the `test_against` function found in the `performance_testers` module
* performance_testers.py
    * Provides a function for testing different players
        * This is how most of the player testing for this project was done
        * Test players against each other
        * Play against players by having one player be a HumanPlayer (defined in the `players` module)
* evaluation.py
    * Basic Evaluation Class
    * All evaluators return an Evaluation object (or a subclass of Evaluation)
        * This includes functions like `monte_carlo_eval` and `position_eval`
* monte\_carlo\_evaluation.py
    * Module that implements evaluation of game states using the monte carlo algorithm
    * This is the heart of our connect4 player
        * Allows the player to make moves that make sense in the long run
* position_eval.py
    * Evaluates a position to determine what possibilities can occur in the game
    * A faster alternative to minimax of computing best moves and worst moves
    * This is what stops our connect4 player from making stupid moves
* advised\_monte\_carlo\_player.py
    * The player class we use for playing connect4
    * Uses MonteCarlo to simulate long-term games
    * Uses position evaluation to make short-term decisions
* minimax.py
    * Generalizable implementation of the minimax algorithm
* solve_player.py
    * A player that solves the entire game and then makes moves based on the solved game
    * This is the heart of our tic-tac-toe player
* connect_four.py
    * Game class for connect4
* tic\_tac\_toe.py
    * Game class for tic-tac-toe
* useful_functions.py
    * Merely contains a function that's useful for printing out the percentage complete a loop is
    * Used in the `test_against` function (define in the `players` module)

*This was Botter Than You! Thanks for reading.*