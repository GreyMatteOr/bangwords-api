const Player = require('./Player.js');

describe('Player', () => {
  let player
  beforeEach(() => {
    player = new Player(1);
  })
  describe('initialization', () => {

    it('should have properties', () => {
      expect(player.attempts).toEqual([])
      expect(player.correct).toEqual([])
      expect(player.id).toEqual(1)
      expect(player.score).toEqual(0)
      expect(player.wrongAttempts).toEqual(0)
    });
  });
  describe('methods', () => {

    describe('addScore', () => {

      it('should be able to addScore', () => {

        player.addScore(5);
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
    })

    describe('getAttemptsLeft', () => {

      it('should return the number of attempts a player has left', () => {
        expect(player.getAttemptsLeft(6)).toEqual(6);
        expect(player.getAttemptsLeft(8)).toEqual(8);

        player.wrongAttempts = 10;
        expect(player.getAttemptsLeft(8)).toEqual(-2);
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

    describe('reviewAttempt', () => {

      it("should increase `this.wrongAttempts` when wrong", () => {

        player.reviewAttempt('game', 'C');
        player.reviewAttempt('game', 'd');

        expect(player.wrongAttempts).toEqual(2);
      });

      it("should not affect `this.wrongAttempts` on a correct guess or one that has already occured ", () => {

        player.reviewAttempt('game', 'g');
        player.reviewAttempt('game', 'G');

        expect(player.wrongAttempts).toEqual(0);

        player.reviewAttempt('game', 'c');
        player.reviewAttempt('game', 'C');

        expect(player.wrongAttempts).toEqual(1);
      });

      it("should not add a bad guess  to `this.correct`", () => {

        player.reviewAttempt('game', 'c');

        expect(player.correct.length).toEqual(0);
      })

      it("should added a correct guess to `this.correct`", () => {

        player.reviewAttempt('game', 'e');
        player.reviewAttempt('game', 'g');

        expect(player.correct).toEqual(['e', 'g']);
      })

      it("should end in a win when all letters have been guessed", () => {

        player.reviewAttempt('game', 'a');
        player.reviewAttempt('game', 'e');
        player.reviewAttempt('game', 'g');

        expect(player.reviewAttempt('game', 'm')).toEqual(true);
        expect(player.reviewAttempt('game', 'game')).toEqual(true);
      })
    });
  });
});
