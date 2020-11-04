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
      expect(a.guessWord).toEqual('game');
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

    describe('deletePlayer', () => {

      it('should be able to delete a player', () => {
        a.addPlayer(123);
        a.addPlayer(321);

        a.deletePlayer(123);
        a.deletePlayer(123);
        expect(a.players).toEqual({'321': new Player(321, 6)});
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

    describe('makeGuess', () => {

      it('should let a player make a guess', () => {

        a.addPlayer('one');
        a.setGuessWord('debug');

        a.makeGuess('one', 'd');
        expect(a.players['one'].attempts).toEqual(['d']);
        expect(a.players['one'].correct).toEqual(['d']);
        expect(a.players['one'].wrongAttempts).toEqual(0);
      });

      it('should record a player win and reward them bonusPoints', () => {
        a.addPlayer('one');
        a.setGuessWord('debug');

        a.makeGuess('one', 'debug');
        expect(a.players['one'].score).toEqual(115)
        expect(a.winners).toEqual(['one'])
        expect(a.finished).toEqual(1)

        a.addPlayer('two');
        a.makeGuess('two', 'debug');
        expect(a.players['one'].score).toEqual(115)
        expect(a.winners).toEqual(['one', 'two'])
        expect(a.finished).toEqual(2)
      });

      it('should record when a player loses', () => {
        a.addPlayer('one');
        a.setGuessWord('debug');
        a.players['one'].wrongAttempts = 5;

        a.makeGuess('one', 'debad');
        expect(a.winners).toEqual([])
        expect(a.finished).toEqual(1)
      });
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
        expect(a.guessWord).toEqual('game')
      });

      it('should convert the word toLowerCase', () => {

        a.setGuessWord('GaME!')

        expect(a.guessWord).toEqual('game!')
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
        expect(a.guessWord).toEqual('');
        expect(a.players['one']).toEqual( new Player('one', 6) );
        expect(a.players['two']).toEqual( new Player('two', 6) );
        expect(a.players['three']).toEqual( new Player('three', 6) );


      });
    });
  });
});
