const Player = require('./Player.js');

describe('Player', () => {
  let player
  beforeEach(() => {
    player = new Player('name', 6);
  })
  describe('initialization', () => {

    it('should have properties', () => {
      expect(player.attempts).toEqual([])
      expect(player.correct).toEqual([])
      expect(player.id).toEqual('name')
      expect(player.maxWrongAttempts).toEqual(6);
      expect(player.score).toEqual(0)
      expect(player.wrongAttempts).toEqual(0)
    });
  });
  describe('methods', () => {

    describe('addPoints', () => {

      it('should be able to addPoints', () => {

        player.addPoints(5);
        expect(player.score).toEqual(5);
      });
    });

    describe('checkGameWon', () => {

      it('should return true if the player guesses the word', () =>{
        player.correct = ['debug', '', 's']
        expect(player.checkGameWon('debug')).toEqual(true);
      });

      it('should return true if the all the letters have been guessed', () =>{
        player.correct = ['d', 'e', 'b', 'x', 'u', 'g']
        expect(player.checkGameWon('debug')).toEqual(true);
      });

      it('should return false, otherwise', () => {
        player.correct = ['d', 'e', 'b', 'u', 'f']
        expect(player.checkGameWon('debug')).toEqual(false);

        player.correct = ['d', 'e', 'b', 'u', 'gebug']
        expect(player.checkGameWon('debug')).toEqual(false);
      })

      it('should add 10 points per attemptLeft after a win', () => {
        player.correct = ['d', 'e', 'b', 'x', 'u', 'g'];
        player.wrongAttempts = 4;
        player.checkGameWon('debug');
        expect(player.score).toEqual(20);
      })

      it('should an additional 5 points per blank', () => {
        player.correct = ['d', 'e', 'b', 'x', 'u', 'debug'];
        player.wrongAttempts = 1;
        player.checkGameWon('debug');
        expect(player.score).toEqual(55);
      })
    })

    describe('getAttemptsLeft', () => {

      it('should return the number of attempts a player has left', () => {
        expect(player.getAttemptsLeft()).toEqual(6);

        player.wrongAttempts = 10;
        expect(player.getAttemptsLeft()).toEqual(-4);
      });
    });

    describe('getRevealed', () => {

      it('should return the letters that have been correctly guessed', () => {
        player.correct = ['d', 'e', 'b', 'x', 'u', 'g'];
        let correctOutput = ['d','e','b','u','g','g','_','_','g',' ','_','_',' ','_','u','_','!'];
        expect(player.getRevealed('debugging is fun!')).toEqual(correctOutput)
      });

      it('should return the number of empty spaces when `inPoints` is `true`', () =>{
        player.correct = ['d', 'e', 'b', 'x', 'u', 'g'];
        expect(player.getRevealed('debugging is fun!', true)).toEqual(6)
      });
    });

    describe('reset', () => {

      it('should refresh the state for a new round', () => {
        player.attempts = ['a',1,2,'play'];
        player.correct = ['fan', 3];
        player.wrongAttempts = 19;

        player.reset();

        expect(player.attempts).toEqual([]);
        expect(player.correct).toEqual([]);
        expect(player.wrongAttempts).toEqual(0);
      });
    });

    describe('attempt', () => {

      it("should increase `this.wrongAttempts` when wrong", () => {

        player.attempt('game', 'C');
        player.attempt('game', 'd');

        expect(player.wrongAttempts).toEqual(2);
      });

      it("should not affect `this.wrongAttempts` on a correct guess or one that has already occured ", () => {

        player.attempt('game', 'g');
        player.attempt('game', 'G');

        expect(player.wrongAttempts).toEqual(0);

        player.attempt('game', 'c');
        player.attempt('game', 'C');

        expect(player.wrongAttempts).toEqual(1);
      });

      it("should not add a bad guess  to `this.correct`", () => {

        player.attempt('game', 'c');

        expect(player.correct.length).toEqual(0);
      })

      it("should added a correct guess to `this.correct`", () => {

        player.attempt('game', 'e');
        player.attempt('game', 'g');

        expect(player.correct).toEqual(['e', 'g']);
      })

      it("should end in a win when all letters have been guessed", () => {

        player.attempt('game', 'a');
        player.attempt('game', 'e');
        player.attempt('game', 'g');

        expect(player.attempt('game', 'm')).toEqual(true);
        expect(player.attempt('game', 'game')).toEqual(true);
      })
    });
  });
});
