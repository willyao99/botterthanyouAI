import random


class Player:
    def make_move(self, game):
        '''Make a move in the game (a Game object)'''
        raise NotImplementedError

    def __str__(self):
        "<Player object>"


class RandomPlayer(Player):
    @classmethod
    def get_random_game(cls, game_cls):
        '''Returns a random game of the class game_cls which must be a subclass of Game'''
        game = game_cls()
        while game.who_won() is None:
            game.make_move(random.choice(game.get_possible_moves()))
        return game

    def make_move(self, game):
        '''Make a random move'''
        game.make_move(random.choice(game.get_possible_moves()))

    def __str__(self):
        '''Simple printing'''
        return "<RandomPlayer object>"


class HumanPlayer(Player):
    '''A class to allow humans to play a game in the terminal.
    Used for debugging before creating a GUI/website.

    Assumes that the game implements a __str__ method that prints out something human-understandable.
    '''

    def make_move(self, game):
        moves = game.get_possible_moves()
        print(game)
        # keep on asking until we get a valid response
        while True:
            try:
                # if all the moves are integers
                if False not in [isinstance(move, int) for move in moves]:
                    # print the human-numbered (starting at 1) version of those moves
                    print("Moves:\n{}".format([move + 1 for move in moves]))
                    # request a move
                    move = int(input("Type the move you'd like to do: ")) - 1
                else:
                    # print out a dictionary of indexes/keys the user can type and the corresponding move
                    moves_dict = {}
                    for i, move in enumerate(moves):
                        moves_dict[i] = move
                    print("Moves:\n{}".format(moves_dict))
                    # request a move
                    index = int(input("Type the index of the move you'd like to do: "))
                    # get the move from the dictionary
                    move = moves_dict[index]
                break
            except Exception:
                # tell the user their input was invalid and re-run the loop
                print("Sorry, that didn't work.")

        # make the move
        game.make_move(move)