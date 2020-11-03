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
    })
  })
});
