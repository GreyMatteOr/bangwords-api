let io = require('socket.io-client');
let { server, rooms } = require('./server.js');
let request = require('supertest');
let Game = require('./Game/Game.js');

let socket, app, socketIsLoaded, callCount, result;

function mockSetState(data, done) {
  callCount++;
  result = data;
  done();
}

describe('server', function() {

  beforeAll( (done) => {
    socket = io.connect('http://localhost:3001', {
      'reconnection delay' : 0
      , 'reopen delay' : 0
      , 'force new connection' : true
    });

    socket.on('connect', function() {
      socketIsLoaded = true;
      done();
    });

    socket.on('result', (data) => mockSetState(data, done) );
  });

  it('should connect on load', async (done) => {
    expect(socketIsLoaded).toEqual(true)
    done();
  });

  it('should be able to join a game', async (done) => {
    callCount = 0;
    socket.emit('joinGame', true);
    setTimeout(() => {
      expect(callCount).toEqual(1);
      expect(result).toEqual({
        display: [],
        isOver: false,
        remainingGuesses: 6,
        attempts: [],
        isGameReady: false
      })
      done();
    }, 50)
  });

  it('should be able to set a word', async (done) => {
    callCount = 0;
    socket.emit('setWord', 'debug');
    setTimeout(() => {
      expect(callCount).toEqual(1);
      expect(result).toEqual({
        display: ['_', '_', '_', '_', '_'],
        isOver: false,
        remainingGuesses: 6,
        attempts: [],
        isGameReady: false
      })
      done();
    }, 400)
  });

  it('should be able to make a guess', async (done) => {
    callCount = 0;
    socket.emit('makeGuess', 'd');
    socket.emit('makeGuess', 'x')
    setTimeout(() => {
      expect(callCount).toEqual(2);
      expect(result).toEqual({
        display: ['d', '_', '_', '_', '_'],
        isOver: false,
        remainingGuesses: 5,
        attempts: ['d', 'x'],
        isGameReady: false
      })
      done();
    }, 80)
  });

  afterAll( (done) => {
    if(socket.connected) {
      socketIsLoaded = false;
      socket.disconnect();
    }
    server.close(done)
    done();
  });
});
