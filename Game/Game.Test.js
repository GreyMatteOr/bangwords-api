let Game = require("./Game");
const Player = require('../Player/Player.js');

describe('Game', () => {

  let a;
  beforeEach(() => {
    a = new Game();
    a.setGuessWord('game')
  })

  describe('Initialization', () => {
    it("should have a word to guess", () => {
      expect(a.wordToGuess).toEqual('game');
    });

    it("should have a `maxWrongAttempts` property", () => {
      expect(a.maxWrongAttempts).toEqual(6);
    });

    it("should store who the generator is", () => {
      expect(a.generatorID).toEqual(null);
    });

    it("should store who the current players are", () => {
      expect(a.players).toEqual({});
    });

    it("should count how many players have finished", () => {
      expect(a.finished).toEqual(0);
    });

    it("should keep track of winners in order", () => {
      expect(a.winners).toEqual([]);
    })

    it("should keep track of the player count", () => {
      expect(a.count).toEqual(0);
    })
  });

  describe('Methods', () => {

    describe('addPlayer', () => {

      it('should create an instance of `Player` and store it', () => {
        a.addPlayer(123);
        expect(a.players[123]).toBeInstanceOf(Player);

        a.addPlayer(321);
        expect(Object.keys(a.players)).toEqual(['123', '321'])
      });
    });

    describe('getNextPlayer', () => {

      it('should cycle the player', () => {
        a.addPlayer('one');
        a.addPlayer('two');
        a.addPlayer('three');

        expect(a.generatorID).toEqual(null);
        expect(a.getNextPlayer()).toEqual('one');
        expect(a.getNextPlayer()).toEqual('two');
        expect(a.getNextPlayer()).toEqual('three');
        expect(a.getNextPlayer()).toEqual('one');

      });
    });

    describe('isOver', () => {

      it('should return `true` if everyone has finished, else `false`', () => {
        a.addPlayer('123')
        expect(a.isOver()).toEqual(false)
        a.addPlayer('234')
        expect(a.isOver()).toEqual(false)
        a.addPlayer('345')
        expect(a.isOver()).toEqual(false)

        a.finished++;
        expect(a.isOver()).toEqual(false)
        a.finished++;
        expect(a.isOver()).toEqual(false)
        a.finished++;
        expect(a.isOver()).toEqual(true)
      })
    });

    describe('removePlayer', () => {

      it('should delete a player from the `players` Object', () => {
        a.addPlayer('one');
        expect(a.players['one']).toBeInstanceOf(Player);

        a.removePlayer('one');
        expect(a.players).toEqual({});

      });
    });

    describe('setGuessWord', () => {

      it('should set the word to guess', () => {
        expect(a.wordToGuess).toEqual('game')
      });

      it('should convert the word toLowerCase', () => {

        a.setGuessWord('GaME!')

        expect(a.wordToGuess).toEqual('game!')
      });
    });

    describe('setGenerator', () => {

      it('should set the id of who is the current generator', () => {

        a.setGenerator(123);

        expect(a.generatorID).toEqual(123);
      });
    });

    describe('verifyGen', () => {

      it('should return `true` if id matches. Else, `false`', () => {

        a.setGenerator('123');

        expect(a.verifyGen('123')).toEqual(true);
        expect(a.verifyGen('12')).toEqual(false);
      });
    });

    describe('reset', () => {

      it('should reset the game', () => {
        a.addPlayer('one');
        a.addPlayer('two');
        a.addPlayer('three');

        a.getNextPlayer()
        a.reset();

        expect(a.count).toEqual(1);
        expect(a.finished).toEqual(0);
        expect(a.generatorID).toEqual('two');
        expect(a.winners).toEqual([])
        expect(a.wordToGuess).toEqual('');
        expect(a.players['one']).toEqual( new Player('one') );
        expect(a.players['two']).toEqual( new Player('two') );
        expect(a.players['three']).toEqual( new Player('three') );


      });
    });
  });
});
