let Game = require("../Game/Game.js");
const Player = require('../Player/Player.js');
const Room = require('./Room.js')

describe('Room', () => {

  let room;
  beforeEach( () => {
    room = new Room('room-debug');
  });

  describe('initialization', () => {

    it('should have properties', () => {
      expect(room.id).toEqual('room-debug');
      expect(room.playerNames).toEqual({});
      expect(room.game).toEqual(new Game());
    });
  });

  describe('methods', () => {

    describe('addPlayer', () => {

      it('should add a new Player to the game', () => {

        room.addPlayer('asdf', 'one');
        room.addPlayer('qwer', 'two');
        room.addPlayer('zxcv', 'two');

        expect(room.playerNames).toEqual({
          'asdf': 'one',
          'qwer': 'two',
          'zxcv': 'two'
        });

        expect(room.game.players).toEqual({
          'asdf': new Player('asdf', 6),
          'qwer': new Player('qwer', 6),
          'zxcv': new Player('zxcv', 6)
        })

      });
    });

    describe('deletePlayer', () => {

      it('should delete an existing Player from the game', () => {

        room.addPlayer('asdf', 'one');
        room.addPlayer('qwer', 'two');
        room.addPlayer('zxcv', 'two');

        room.deletePlayer('asdf');
        room.deletePlayer('asdf');
        room.deletePlayer('zxcv');
        expect(room.playerNames).toEqual({'qwer': 'two'});
        expect(room.game.players).toEqual({'qwer': new Player('qwer', 6)});
      });
    });

    describe('getPlayerName', () => {

      it('should get the userName associated with an id', () => {
        room.addPlayer('asdf', 'one');
        expect(room.getPlayerName('asdf')).toEqual('one');
      });
    });

    describe('getStateData', () => {

      it('should return the important info to display', () => {
        room.addPlayer('asdf', 'one');
        room.game.setGuessWord('debug');
        room.game.makeGuess('asdf', 'd');
        room.game.makeGuess('asdf', 'x');

        expect(room.getStateData('asdf')).toEqual({
          attempts: ['d', 'x'],
          attemptsLeft: 5,
          display: ['d','_','_','_','_'],
          hasGenerator: false,
          isGameReady: false,
          isOver: false,
          isWon: false,
          playerNames: ['one'],
          scores: {'one': 0}
        });

        room.addPlayer('qwer', 'two');
        room.game.setGenerator('qwer')

        room.game.makeGuess('asdf', 'debug');
        expect(room.getStateData('asdf')).toEqual({
          attempts: ['d', 'x', 'debug'],
          attemptsLeft: 5,
          display: ['d','_','_','_','_'],
          hasGenerator: true,
          isGameReady: true,
          isOver: false,
          isWon: true,
          playerNames: ['one', 'two'],
          scores: {'one': 100, 'two': 0}
        });

      });
    });
  });
});
