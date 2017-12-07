from evaluation import Evaluation


class PositionEvaluation(Evaluation):
    '''Evaluation object for a position evaluation'''

    def __init__(self, results, player_number, rewards=(2, -2, 1.5, 0, 0)):
        '''
        results is a set containing any of the numbers 0, 1, 2, or 3
        "the player" is the player whose player number is player_number
        0 means the player can win from this position
        1 means the opponent can win from this position
        2 means the player can force a tie from this position
        3 means the opponent can force a tie from this position

        player_number is the number of the player that the results are for
        rewards is in the form [points for win, points for loss, points for force tie,
                                points for forced tie, points for undetermined]
        rewards allows this to actually be a subclass of Evaluation by computing a value
        '''
        self.results = results
        self.player_number = player_number
        self.rewards = rewards
        super().__init__(self.compute_value())

    def compute_value(self):
        '''Compute the value of this evaluation from the results and rewards'''
        if self.win():
            return self.rewards[0]
        elif self.lose():
            return self.rewards[1]
        elif self.force_tie():
            return self.rewards[2]
        elif self.forced_tie():
            return self.rewards[3]
        else:
            return self.rewards[4]

    def win(self):
        '''Return whether or not this game is a winning position for the player'''
        return 0 in self.results

    def lose(self):
        '''Return whether or not this game is a losing position for the player'''
        return 1 in self.results

    def force_tie(self):
        '''Return whether or not the player can force a tie from this position'''
        return 2 in self.results

    def forced_tie(self):
        '''Return whether or not the player's opponent can force a tie from this position'''
        return 3 in self.results

    def __str__(self):
        '''Return a human-understandable string'''
        return "<PositionEvaluation object with results: {}>".format(self.results)


def position_eval(game, player_number, depth, rewards=(2, -2, 1.5, 0, 0)):
    '''Returns a PositionEvaluation object that stores if the game position is a certain win, loss, or tie for the player
    The game is analyzed `depth` moves out from the given state.
    If `depth` is -1, it will evaluate the entire game.

    The parameter `rewards` is merely passed on to the PositionEvaluation object this function returns
    '''

    def any_one(evaluations, value):
        '''Returns whether or not any one of the evaluations has the given value in its results'''
        for e in evaluations:
            if value in e.results:
                return True
        return False

    def all_ones(evaluations, value):
        '''Returns whether or not all of the evaluations has the given value in their results'''
        for e in evaluations:
            if value not in e.results:
                return False
        return True

    # see the form of results in the PositionEvaluation class
    results = set()
    if depth == 0:
        winner = game.who_won()
        # undetermined games don't fit in any category
        if winner is not None:
            if winner == -1:
                # this could be either a force tie or forced tie, so add both
                results.add(3)
                results.add(4)
            elif winner == player_number:
                # win
                results.add(0)
            else:
                # loss; winner is opponent
                results.add(1)
    else:
        # compute the position evaluation for each of the lower games
        lower_level = [position_eval(lower_game, player_number, depth - 1, rewards)
                       for lower_game in game.get_next_level()]
        # set up faster functions to work with our lower_level variable
        any_or_all = [lambda v: any_one(lower_level, v), lambda v: all_ones(lower_level, v)]
        if game.active_player != player_number:
            '''if the player we're evaluating is not the active player, `any` and `all` reverses
            for example, when the opponent is making the move, "if any future positions are wins, this position is a win" becomes
            ..."if all future positions are wins, this position is a win"
            ...because unless all of the positions are wins for the main player, the opponent could just choose another path.
            '''
            # reverse which one is used
            any_or_all.reverse()
        # if any future positions are wins, this position is a win
        if any_or_all[0](0):
            results.add(0)
        # if all future positions are losses, this position is a loss
        if any_or_all[1](1):
            results.add(1)
        # if any future positions are force ties, this position is a force tie
        if any_or_all[0](3):
            results.add(3)
        # if all future positions are forced ties, this position is a forced tie
        if any_or_all[1](4):
            results.add(4)

    return PositionEvaluation(results, player_number, rewards)


if __name__ == "__main__":
    from tic_tac_toe import TicTacToe

    t = TicTacToe()
    t.make_move(0)
    t.make_move(1)
    t.make_move(3)
    t.make_move(2)
    # t.make_move(6)

    print(position_eval(t, player_number=1, depth=1))