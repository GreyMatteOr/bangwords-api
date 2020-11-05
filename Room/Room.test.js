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
          'zxcv': 'two1'
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
          hasWord: true,
          isGameReady: false,
          isOver: true,
          isWon: false,
          playerNames: ['one'],
          scores: {
            'one': {
            "attempts": 5,
            "didWin": null,
            "score": 0,
            }
          }
        });

        room.addPlayer('qwer', 'two');
        room.game.setGenerator('qwer')

        room.game.makeGuess('asdf', 'debug');
        expect(room.getStateData('asdf')).toEqual({
          attempts: ['d', 'x', 'debug'],
          attemptsLeft: 5,
          display: ['d','_','_','_','_'],
          hasGenerator: true,
          hasWord: true,
          isGameReady: false,
          isOver: true,
          isWon: true,
          playerNames: ['one', 'two'],
          scores: {
            one: {
              attempts: 5,
              didWin: true,
              score: 100,
            },
            two: {
              attempts: 6,
              didWin: "gen",
              score: 0,
            }
          }
        });

      });
    });

    describe('getPlayerCount', () => {

      it('should return the count of current players', () => {

        room.addPlayer('asdf', 'two');
        expect(room.getPlayerCount()).toEqual(1);
        room.addPlayer('asdf', 'two');
        expect(room.getPlayerCount()).toEqual(1);
        room.addPlayer('qwer', 'one');
        expect(room.getPlayerCount()).toEqual(2);
        room.addPlayer('zxcv', 'one');
        expect(room.getPlayerCount()).toEqual(3);

        room.deletePlayer('asdf');
        expect(room.getPlayerCount()).toEqual(2);
        room.deletePlayer('asdf');
        expect(room.getPlayerCount()).toEqual(2);
      })
    });

    describe('getScores', () => {

      it('should return an object with a userName and a score for each player', () => {
        room.addPlayer('asdf', 'two');
        room.addPlayer('asdf', 'two');
        expect(room.getScores()).toEqual({
          "two1": {
            "attempts": 6,
            "didWin": null,
            "score": 0,
         }
       });

        room.addPlayer('qwer', 'one');
        expect(room.getScores()).toEqual(
          {
            one: {
              attempts: 6,
              didWin: null,
              score: 0
            },
            two1: {
              attempts: 6,
              didWin: null,
              score: 0
            }
          }
        );

        room.game.getPlayer( 'asdf' ).score = 154
        expect(room.getScores()).toEqual(
          {
            one: {
              attempts: 6,
              didWin: null,
              score: 0,
            },
            two1: {
              attempts: 6,
              didWin: null,
              score: 154,
            }
          }
        );

        room.deletePlayer('asdf');
        expect(room.getScores()).toEqual(
          {
            one: {
              attempts: 6,
              didWin: null,
              score: 0,
            }
          }
        );
      });
    });

    describe('isGameReady', () => {

      it('should return true when there are 2 players, a guessword, and the game is not over', () => {
        room.addPlayer('asdf', 'one');
        room.addPlayer('qwer', 'two');
        room.game.setGuessWord('debug');

        expect(room.isGameReady()).toEqual(true);
      });

      it('should return false when there are less than 2 players', () => {
        room.addPlayer('asdf', 'one');
        room.game.setGuessWord('debug');

        expect(room.isGameReady()).toEqual(false);
      });

      it('should return false when there is not a guessword', () => {
        room.addPlayer('asdf', 'one');
        room.addPlayer('qwer', 'two');

        expect(room.isGameReady()).toEqual(false);
      });

      it('should return false when the game is over', () => {
        room.addPlayer('asdf', 'one');
        room.addPlayer('qwer', 'two');
        room.game.setGuessWord('debug');
        room.game.finished = 2;

        expect(room.isGameReady()).toEqual(true);
      });
    });
  });
});
