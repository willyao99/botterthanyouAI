'''
Written by London Lowmanstone
Based on code I wrote in high school.
'''
import random
import useful_functions as useful


def test_against(players, game_class, rounds=50, games_per_round=1000, comment=2, pct_increment=2):
    '''Returns a tuple of lists in the form (highs, lows, ranges, averages) with stats for player 0's performance against player 1
    Each list is in the form [wins, losses, ties], and the names are pretty self-explanatory.
    For example, highs is a list of the most amount of wins, losses, and ties it achieved across any round.

    players: a tuple in the form (player 0, player 1) where both are Player objects
    game_class: a class that subclasses Game; the game the players will play
    rounds: the number of rounds the players will play against each other
    games_per_round: how many games are played per round
    comment: how verbose the print statements are; higher integers give more print statements
    pct_increment: how much the percentage should increase by when it prints out
    '''

    # default to values for each list that will be overridden
    lows = [games_per_round + 1] * 3
    highs = [-1] * 3
    overall = [0] * 3
    for i in range(rounds):
        results = [0] * 3  # [wins, losses, ties] for the player
        for game_num in range(games_per_round):
            if comment > 3:
                print("Testing game {}/{}".format((game_num + 1), games_per_round))
            game = game_class()
            # randomize who goes first
            game.active_player = random.choice([0, 1])
            while game.who_won() is None:
                players[game.active_player].make_move(game)
                if comment > 5:
                    print(game)

            # update the results; this works because player 0 is always the player we care about
            results[game.who_won()] += 1
            if comment > 3:
                if comment > 4:
                    print(game)
                print("Results so far in round:\n{}".format(results))

        if comment > 2:
            print("Results of one round:\n{}".format(results))

        if pct_increment > 0 and comment > 1:
            useful.print_percent(i, rounds, increment_amt=pct_increment, round_amt=i)

        # update the lists
        for j, testVal in enumerate(results):
            lows[j] = min(lows[j], testVal)
            highs[j] = max(highs[j], testVal)
            overall[j] += testVal

    # compute the other stats lists
    ranges = [highs[i] - lows[i] for i in range(3)]
    avgs = [overall[i] / rounds for i in range(3)]

    if comment > 0:
        print("Highs: {}".format(highs))
        print("Lows: {}".format(lows))
        print("Ranges: {}".format(ranges))
        print("Averages: {}".format(avgs))
    return (highs, lows, ranges, avgs)


if __name__ == "__main__":
    '''Play and test different players.
    Currently this is set up for you to play against the perfect tic-tac-toe player
    '''
    '''
    These are some notes about how good different players were against each other:
    
    # significant difference: 74 - 15, no ties.
    # test_against((BasicMonteCarloPlayer(30, 1), BasicMonteCarloPlayer(30)), ConnectFour, 100, 100, comment=4)
    
    # no significant difference: 29 - 28 - 2
    # test_against((BasicMonteCarloPlayer(40, 1), BasicMonteCarloPlayer(30, 1)), ConnectFour, 1, 100, comment=4)
    
    # significant: 71 - 6 - 2 (Mainly lost when it had a perfect trap set up that was blocked by an opponent, then it gave up easy wins; should be fixed with minimax)
    # test_against((BasicMonteCarloPlayer(5, 3), BasicMonteCarloPlayer(30)), ConnectFour, 1, 100, comment=6)
    '''
    from tic_tac_toe import TicTacToe
    from connect_four import ConnectFour
    from players import RandomPlayer, HumanPlayer
    from solve_player import SolvePlayer
    s = SolvePlayer()
    print("Solving tic-tac-toe...")
    s.make_move(TicTacToe())
    print("Tic-tac-toe solved!")
    # Test how good the human player is against the perfect tic-tac-toe player
    test_against((HumanPlayer(), s), TicTacToe, 10, 100, comment=5)