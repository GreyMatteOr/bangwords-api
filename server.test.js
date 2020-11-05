let io = require('socket.io-client');
let { server, rooms, players, joinRoom, leaveRoom } = require('./server.js');
const Room = require('./Room/Room.js');

let result = [], responseCount = 0, joinedRooms = [], socket;

function mockSetState(data, done) {
  responseCount++;
  result.push(data);
  done();
}

describe('server', () => {

  beforeAll( (done) => {
    socket = io.connect('http://localhost:3001', {
      'reconnection delay' : 0
      , 'reopen delay' : 0
      , 'force new connection' : true
    });

    socket.on('connect', function() {
      done();
    });

    socket.on('result', (data) => mockSetState(data, done) );
    socket.on('chatMessage', (data) => mockSetState(data, done) );
    done();
  });

  it('should let a socket connect', async (done) => {
    setTimeout(() => {
      expect(socket.connected).toEqual(true);
      expect(responseCount).toEqual(2);
      expect(result).toEqual([
        {numOnline: 1},
        {rooms: [], isLoading: false}
      ])
      done();
    }, 80);
  });

  describe('methods', () => {

    describe('joinRoom', () => {

      it('should add a socket to a `room`', (done) => {

        joinedRooms = []
        socket.join = (roomID) => joinedRooms.push(roomID)
        rooms['debug1'] = new Room('debug1');

        expect(joinRoom(socket, rooms['debug1'])).toEqual({
          inRoom: true,
          hasGenerator: false
        });

        expect(joinedRooms).toEqual(['debug1']);
        expect(players).toEqual({[socket.id]: 'debug1'})
        done();
      });
    })

    describe('leaveRoom', () => {

      it('should remove a socket from a `room`', (done) => {

        joinedRooms = []
        socket.join = (roomID) => joinedRooms.push(roomID)
        socket.leave = (roomID) => {
          joinedRooms = joinedRooms.filter(id => id !== roomID);
        }
        rooms['debug1'] = new Room('debug1');

        joinRoom(socket, rooms['debug1']);
        leaveRoom(socket)

        expect(rooms).toEqual({});
        expect(players).toEqual({[socket.id]: null});
        expect(joinedRooms).toEqual([]);
        done();
      });

      it('should delete the room if afterwards it is empty', (done) => {
        expect(rooms).toEqual({});
        done();
      });
    });
  });

  describe('socket-events', () => {

    describe('createRoom', () => {

      it('should be able to create a room', async (done) => {
        responseCount = 0;
        result = [];
        joinedRooms = [];
        socket.emit('createRoom', 'debug-room');
        setTimeout(() => {
          expect(responseCount).toEqual(3);
          expect(result).toEqual([
            {rooms: []},
            {hasGenerator: false, inRoom: true},
            {rooms:['debug-room']}
          ]);
          expect(rooms).toEqual({'debug-room': new Room('debug-room')});
          expect(players[socket.id]).toEqual('debug-room');
          done();
        }, 100)
      });

      it('should not be ablt to create a room that exists already', async (done) => {
        responseCount = 0;
        result = [];
        socket.emit('createRoom', 'debug-room');
        setTimeout(() => {
          expect(responseCount).toEqual(1);
          expect(result).toEqual([
            {errorMSG: `A room with the name 'debug-room' already exists! Choose again`}
          ]);
          expect(rooms).toEqual({'debug-room': new Room('debug-room')});
          expect(players[socket.id]).toEqual('debug-room');
          done();
        }, 100)
      });
    });

    describe('joinRoom', () => {

      it('should be able to join a game', async (done) => {

        responseCount = 0;
        result = [];
        socket.emit('joinRoom', 'debug-room');
        setTimeout(() => {
          expect(responseCount).toEqual(1);
          expect(result).toEqual([{hasGenerator: false, inRoom: true}])
          done();
        }, 80)
      });

      it('should not be able to join a game if the room does not exist', async (done) => {

        responseCount = 0;
        result = [];
        socket.emit('joinRoom', 'debug-room1');
        setTimeout(() => {
          expect(responseCount).toEqual(1);
          expect(result).toEqual([{errorMSG: `Room with name 'debug-room1' does not exist.`}])
          done();
        }, 80)
      });
    });

    describe('leaveRoom', () => {

      it('should be able to leave a room', async (done) => {

        responseCount = 0;
        result = [];
        joinedRooms = [];
        socket.join = (roomID) => joinedRooms.push(roomID)
        socket.leave = (roomID) => {
          joinedRooms = joinedRooms.filter(id => id !== roomID);
        }

        socket.emit('joinRoom', 'debug-room');
        socket.emit('leaveRoom');

        setTimeout(() => {
          expect(responseCount).toEqual(3);
          expect(result).toEqual([
            {inRoom: true, hasGenerator: false},
            { rooms: []},
            {inRoom: false, isGenerator: null}]);
          expect(joinedRooms).toEqual([]);
          expect(rooms).toEqual({});
          expect(players).toEqual({[socket.id]: null})
          done();
        }, 70);
      });
    });

    describe('makeGuess', () => {

      it('should be able to make a guess', (done) => {

        responseCount = 0;
        result = [];

        socket.emit('createRoom', 'debug-room');
        socket.emit('setRole', true, 'Billy'),
        socket.emit('setWord', 'guessWord');
        socket.emit('makeGuess', 'g');
        socket.emit('makeGuess', 'x');

        setTimeout(() => {
          expect(responseCount).toEqual(10);
          expect(result).toEqual([
            {inRoom: true, hasGenerator: false},
            {
              rooms:  [
               'debug-room',
              ],
            },
            {
              attempts: [],
              attemptsLeft: 6,
              display: [],
              hasGenerator: true,
              isGameReady: false,
              isOver: false,
              isWon: false,
              playerNames: ['Billy'],
              scores: {'Billy': 0}
            },
            {
              attempts: [],
              attemptsLeft: 6,
              display: ['_','_','_','_','_','_','_','_','_'],
              hasGenerator: true,
              isGameReady: false,
              isOver: false,
              isWon: false,
              playerNames: ['Billy'],
              scores: {'Billy': 0}
            },
            {
              attempts: ['g'],
              attemptsLeft: 6,
              display: ['g','_','_','_','_','_','_','_','_'],
              isWon: false
            },
            {
              attempts: ['g','x'],
              attemptsLeft: 5,
              display: ['g','_','_','_','_','_','_','_','_'],
              isWon: false
            }
          ]);
          done();
        }, 400);
      });
    });

    describe('sendMessage', () => {

      it('should be able to send a chat message', (done) => {

        responseCount = 0;
        result = [];

        socket.emit('sendMessage', 'debug message' );

        setTimeout(() => {
          expect(responseCount).toEqual(1);
          expect(result).toEqual(['Billy: debug message']);
          done();
        }, 80);
      });
    });

    describe('setRole', () => {

      it('should be able to set the Role while joining a game', (done) => {

        responseCount = 0;
        result = [];

        socket.emit('setRole', true, 'Scott' );

        setTimeout(() => {
          expect(responseCount).toEqual(1);
          expect(result).toEqual([
            {
              attempts: [],
              attemptsLeft: 6,
              display: ['_','_','_','_','_','_','_','_','_'],
              isOver: true,
              isWon: false,
              scores: {
                Scott: {
                  attempts: 6,
                  didWin: "gen",
                  score: 0,
                }
              },
              userName: "Scott",
              hasGenerator: true,
              isGameReady: false,
              playerNames: ['Scott']
            }
          ]);
          done();
        }, 80);
      });
    });

    describe('setWord', () => {

      it('should be able to set the guessWord', (done) => {

        responseCount = 0;
        result = [];

        socket.emit('setWord', 'debugging!' );

        setTimeout(() => {
          expect(responseCount).toEqual(1);
          expect(result).toEqual([
            {
              attempts: [],
              attemptsLeft: 6,
              display: ['_','_','_','_','_','_','_','_','_','!'],
              hasGenerator: true,
              hasWord: true,
              isGameReady: false,
              isOver: true,
              isWon: false,
              playerNames: ['Scott'],
              scores: {
                Scott: {
                  attempts: 6,
                  didWin: "gen",
                  score: 0,
                }
              }
            }
          ]);
          done();
        }, 80);
      });
    });

    describe('disconnect', () => {

      it('should leave any rooms their in', (done) => {

        socket.disconnect();
        setTimeout(() => {
          expect(rooms).toEqual({});
          done();
        }, 80);
        done();
      });

      it('should update the player count', (done) => {

        setTimeout(() => {
          expect(players).toEqual({});
          done();
        }, 80);
        done();
      })
    });
  });

  afterAll( (done) => {
    setTimeout(() => {
      server.close(done)
      done();
    }, 0);
  });
});
