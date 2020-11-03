const Player = require('./Player.js');

describe('Player', () => {
  let player
  beforeEach(() => {
    player = new Player(1);
  })
  describe('initialization', () => {

    it('should have properties', () => {
      expect(player.attemptedGuesses).toEqual([])
      expect(player.correctGuesses).toEqual([])
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
        player.correctGuesses = ['debug', '', 's']
        expect(player.checkGameWon('debug')).toEqual(true);
      });

      it('should return true if the all the letters have been guessed', () =>{
        player.correctGuesses = ['d', 'e', 'b', 'x', 'u', 'g']
        expect(player.checkGameWon('debug')).toEqual(true);
      });

      it('should return false, otherwise', () => {
        player.correctGuesses = ['d', 'e', 'b', 'u', 'f']
        expect(player.checkGameWon('debug')).toEqual(false);

        player.correctGuesses = ['d', 'e', 'b', 'u', 'gebug']
        expect(player.checkGameWon('debug')).toEqual(false);

      })
    })
  });
});
