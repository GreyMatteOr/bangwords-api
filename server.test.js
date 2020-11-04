let io = require('socket.io-client');
let { server, rooms, players, joinRoom, leaveRoom } = require('./server.js');
const Room = require('./Room/Room.js');

let result = [], callCount = 0, socket, app;

function mockSetState(data, done) {
  callCount++;
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
    done();
  });

  it('should let a socket connect', async (done) => {
    setTimeout(() => {
      expect(socket.connected).toEqual(true);
      expect(callCount).toEqual(2);
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

        let joinedRooms = []
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

        let joinedRooms = []
        socket.join = (roomID) => joinedRooms.push(roomID)
        socket.leave = (roomID) => {
          joinedRooms = joinedRooms.filter(id => id !== roomID);
        }
        rooms['debug1'] = new Room('debug1');

        joinRoom(socket, rooms['debug1']);

        expect(leaveRoom(socket)).toEqual({rooms: []});
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
        callCount = 0;
        result = [];
        socket.emit('createRoom', 'debug-room');
        setTimeout(() => {
          expect(callCount).toEqual(2);
          expect(result).toEqual([
            {hasGenerator: false, inRoom: true},
            {rooms:['debug-room']}
          ]);
          expect(rooms).toEqual({'debug-room': new Room('debug-room')});
          expect(players[socket.id]).toEqual('debug-room');
          done();
        }, 80)
      });

      it('should not be ablt to create a room that exists already', async (done) => {
        callCount = 0;
        result = [];
        socket.emit('createRoom', 'debug-room');
        setTimeout(() => {
          expect(callCount).toEqual(1);
          expect(result).toEqual([
            {errorMSG: `A room with the name 'debug-room' already exists! Choose again`}
          ]);
          expect(rooms).toEqual({'debug-room': new Room('debug-room')});
          expect(players[socket.id]).toEqual('debug-room');
          done();
        }, 80)
      });

    it('should be able to join a game', async (done) => {
      callCount = 0;
      socket.emit('joinRoom', 'debug-room');
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
      }, 70)
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

  });
  });
  afterAll( (done) => {
    if(socket.connected) {
      socket.disconnect();
    }
    setTimeout(() => {
      server.close(done)
      done();
    }, 0);
  });
});
